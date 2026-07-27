import { createHash, randomUUID } from "node:crypto";
import {
  access,
  appendFile,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CliError } from "./cli.mjs";
import { compareWorkflowVersions } from "./prompt-release.mjs";

export const RUN_SCHEMA_VERSION = 2;
export const ROUND_STATUSES = [
  "pending",
  "running",
  "waiting",
  "completed",
  "failed",
  "blocked",
];
export const ROUND_CHECKPOINTS = [
  "configured",
  "submitted",
  "generating",
  "artifact-ready",
  "artifact-imported",
  "correction-requested",
  "compiled",
  "validated",
  "finalized",
];
export const CHAT_CONFIGURATION_VERIFICATIONS = [
  "verified",
  "click-acknowledged",
];
const COMPLETE_LIBRARY_PROTOCOL_VERSION = "2026.07.7";

const FIGURE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".pdf",
  ".eps",
  ".svg",
  ".webp",
]);
const FIGURE_EXTENSION_PRIORITY = new Map(
  [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".svg", ".eps"].map(
    (extension, index) => [extension, index],
  ),
);

export async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function resolveExistingPath(projectRoot, value, label) {
  if (!value) return null;
  const resolved = path.resolve(projectRoot, value);
  if (!(await pathExists(resolved))) {
    throw new CliError(`${label} does not exist: ${resolved}`, "missing_input");
  }
  return resolved;
}

async function rootFilesWithExtension(projectRoot, extension) {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() && path.extname(entry.name).toLowerCase() === extension,
    )
    .map((entry) => path.join(projectRoot, entry.name))
    .sort();
}

async function detectFile(projectRoot, supplied, extension, preferredName) {
  if (supplied) {
    return resolveExistingPath(projectRoot, supplied, extension);
  }

  const preferred = path.join(projectRoot, preferredName);
  if (await pathExists(preferred)) return preferred;
  const candidates = await rootFilesWithExtension(projectRoot, extension);
  return candidates.length === 1 ? candidates[0] : null;
}

async function detectPdf(projectRoot, supplied) {
  if (supplied) {
    return resolveExistingPath(projectRoot, supplied, "PDF");
  }

  for (const relativePath of [
    "main.pdf",
    path.join("build", "main.pdf"),
    path.join("output", "main.pdf"),
    path.join("out", "main.pdf"),
  ]) {
    const candidate = path.join(projectRoot, relativePath);
    if (await pathExists(candidate)) return candidate;
  }

  const candidates = await rootFilesWithExtension(projectRoot, ".pdf");
  return candidates.length === 1 ? candidates[0] : null;
}

async function detectFigures(projectRoot, supplied) {
  if (supplied) {
    return resolveExistingPath(projectRoot, supplied, "Figures path");
  }
  for (const candidate of ["figures", "figs", "images"]) {
    const resolved = path.join(projectRoot, candidate);
    if (await pathExists(resolved)) return resolved;
  }
  return null;
}

export async function resolvePaperInputs(projectRoot, supplied = {}) {
  const tex = await detectFile(projectRoot, supplied.tex, ".tex", "main.tex");
  const bib = await detectFile(
    projectRoot,
    supplied.bib,
    ".bib",
    "references.bib",
  );
  const pdf = await detectPdf(projectRoot, supplied.pdf);
  const figures = await detectFigures(projectRoot, supplied.figures);

  if (!tex && !pdf) {
    throw new CliError(
      "No unambiguous TeX or PDF input was found. Pass --tex and/or --pdf explicitly.",
      "missing_input",
    );
  }

  return { tex, bib, pdf, figures };
}

function safeRunId(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);
  if (!normalized) {
    throw new CliError("Run id must contain a letter or number.");
  }
  return normalized;
}

export function defaultRunId(now = new Date()) {
  const stamp = now
    .toISOString()
    .replace(/\.\d{3}Z$/, "z")
    .replaceAll(":", "")
    .replace("T", "-");
  return safeRunId(stamp);
}

function relativeToRun(runPath, target) {
  return path.relative(runPath, target).split(path.sep).join("/");
}

async function writeJsonAtomic(target, value) {
  const parent = path.dirname(target);
  await mkdir(parent, { recursive: true });
  const temporary = path.join(
    parent,
    `.${path.basename(target)}.${randomUUID()}.tmp`,
  );
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function checkpointForLegacyRound(round) {
  if (round.status === "completed") return "finalized";
  if (round.compilation?.status === "passed") return "compiled";
  if ((round.outputs ?? []).length > 0) return "artifact-imported";
  if (round.status === "waiting") return "generating";
  if (round.status === "running") return "submitted";
  return "configured";
}

function migrateRunState(state) {
  let changed = false;
  if (
    state.schemaVersion !== RUN_SCHEMA_VERSION &&
    state.schemaVersion !== 1
  ) {
    throw new CliError(
      `Unsupported run schema ${state.schemaVersion}.`,
      "unsupported_schema",
    );
  }
  if (state.schemaVersion === 1) {
    state.schemaVersion = RUN_SCHEMA_VERSION;
    changed = true;
  }
  if (!state.execution) {
    state.execution = {
      transferMode: "undecided",
      fallbackReason: null,
      mcpHandshake: null,
      attachmentProbe: null,
      updatedAt: null,
    };
    changed = true;
  }
  if (!state.runtimeVersions) {
    state.runtimeVersions = {
      pluginVersion: null,
      createdWithPluginVersion: null,
      executionPluginVersion: null,
      workflowVersion: state.workflowVersion ?? null,
      loadedSkillVersion: null,
      marketplaceVersion: null,
      marketplaceRevision: null,
    };
    changed = true;
  } else {
    const runtimeDefaults = {
      createdWithPluginVersion:
        state.runtimeVersions.pluginVersion ?? null,
      executionPluginVersion:
        state.runtimeVersions.pluginVersion ?? null,
      marketplaceRevision: null,
    };
    for (const [key, value] of Object.entries(runtimeDefaults)) {
      if (state.runtimeVersions[key] === undefined) {
        state.runtimeVersions[key] = value;
        changed = true;
      }
    }
  }
  if (state.finalManifestPath === undefined) {
    state.finalManifestPath = null;
    changed = true;
  }
  if (!state.validation) {
    state.validation = {};
    changed = true;
  }
  if (!Array.isArray(state.validation.checks)) {
    state.validation.checks = [];
    changed = true;
  }
  for (const round of state.rounds ?? []) {
    if (!round.checkpoint) {
      round.checkpoint = checkpointForLegacyRound(round);
      changed = true;
    }
    if (!Array.isArray(round.revisions)) {
      round.revisions = [];
      changed = true;
    }
    if (round.compilation === undefined) {
      round.compilation = null;
      changed = true;
    }
    if (round.validation === undefined) {
      round.validation = null;
      changed = true;
    }
  }
  return changed;
}

function visibleStatusMarkdown(state) {
  const current = nextRound(state);
  const completed = state.rounds.filter(
    (round) => round.status === "completed",
  ).length;
  const roundLines = state.rounds
    .map((round) => {
      const marker = round.status === "completed" ? "x" : " ";
      return `- [${marker}] Round ${round.number}: ${round.title} — ${round.status} / ${round.checkpoint ?? "configured"}`;
    })
    .join("\n");
  return `# YanShu Progress

Updated: ${state.updatedAt}

- Run: \`${state.runId}\`
- Overall status: **${state.status}**
- Progress: **${completed}/${state.rounds.length} rounds**
- Transfer mode: **${state.execution?.transferMode ?? "undecided"}**
- Current round: **${
    current
      ? `${current.number}. ${current.title} — ${current.checkpoint ?? current.status}`
      : "Completed"
  }**
- Final manifest: ${
    state.finalManifestPath
      ? `\`${state.finalManifestPath}\``
      : "not generated"
  }

## Rounds

${roundLines}

This file is updated automatically. Detailed machine-readable state remains in \`run.json\`.
`;
}

async function writeVisibleStatus(state) {
  await writeFile(
    path.join(state.runPath, "STATUS.md"),
    visibleStatusMarkdown(state),
    "utf8",
  );
}

export async function createRun({
  projectRoot,
  outputRoot,
  runId,
  inputs,
  workflow,
  runtimeVersions = {},
}) {
  const resolvedProject = path.resolve(projectRoot);
  const resolvedOutputRoot = path.resolve(
    outputRoot ?? path.join(resolvedProject, "yanshu-reconstruction"),
  );
  const normalizedRunId = safeRunId(runId ?? defaultRunId());
  const runPath = path.join(resolvedOutputRoot, normalizedRunId);

  if (await pathExists(runPath)) {
    throw new CliError(
      `Run directory already exists: ${runPath}`,
      "run_exists",
    );
  }

  await mkdir(resolvedOutputRoot, { recursive: true });
  await mkdir(runPath, { recursive: false });
  const createdAt = new Date().toISOString();
  const rounds = [];

  for (const round of workflow.rounds) {
    const roundName = `round-${String(round.number).padStart(2, "0")}-${round.id}`;
    const roundPath = path.join(runPath, roundName);
    const promptPath = path.join(roundPath, "prompt.md");
    await mkdir(path.join(roundPath, "output"), { recursive: true });
    await mkdir(path.join(roundPath, "logs"), { recursive: true });
    await writeFile(promptPath, `${round.prompt.trim()}\n`, "utf8");
    rounds.push({
      id: round.id,
      number: round.number,
      title: round.title,
      purpose: round.purpose,
      status: "pending",
      checkpoint: "configured",
      directory: roundName,
      promptPath: relativeToRun(runPath, promptPath),
      sourceTemplate: round.sourceFile,
      chat: null,
      outputs: [],
      revisions: [],
      compilation: null,
      validation: null,
      startedAt: null,
      completedAt: null,
      updatedAt: createdAt,
      note: null,
    });
  }

  const state = {
    schemaVersion: RUN_SCHEMA_VERSION,
    workflowVersion: workflow.workflowVersion,
    workflow: workflow.workflow,
    runId: normalizedRunId,
    status: "ready",
    createdAt,
    updatedAt: createdAt,
    projectRoot: resolvedProject,
    runPath,
    inputs,
    config: workflow.config,
    runtimeVersions: {
      pluginVersion: runtimeVersions.pluginVersion ?? null,
      createdWithPluginVersion:
        runtimeVersions.pluginVersion ?? null,
      executionPluginVersion:
        runtimeVersions.pluginVersion ?? null,
      workflowVersion: workflow.workflowVersion,
      loadedSkillVersion: runtimeVersions.loadedSkillVersion ?? null,
      marketplaceVersion: runtimeVersions.marketplaceVersion ?? null,
      marketplaceRevision:
        runtimeVersions.marketplaceRevision ?? null,
    },
    execution: {
      transferMode: "undecided",
      fallbackReason: null,
      mcpHandshake: null,
      attachmentProbe: null,
      updatedAt: null,
    },
    rounds,
    validation: {
      status: "not-run",
      texPath: null,
      logPath: null,
      updatedAt: null,
      checks: [],
    },
    finalManifestPath: null,
  };

  await writeJsonAtomic(path.join(runPath, "run.json"), state);
  await writeJsonAtomic(path.join(runPath, "inputs.json"), {
    projectRoot: resolvedProject,
    approvedAttachments: inputs,
    notice:
      "Only these paths and explicitly registered round outputs may be uploaded to ChatGPT.",
  });
  await writeFile(
    path.join(runPath, "README.md"),
    buildRunReadme(state),
    "utf8",
  );
  await writeVisibleStatus(state);
  await recordRunEvent(state, "run-created", {
    workflow: state.workflow,
    workflowVersion: state.workflowVersion,
    runtimeVersions: state.runtimeVersions,
  });

  return state;
}

function buildRunReadme(state) {
  const rounds = state.rounds
    .map(
      (round) =>
        `- [ ] Round ${round.number}: ${round.title} (\`${round.directory}\`)`,
    )
    .join("\n");
  return `# YanShu · Paper Reconstruction

Run: \`${state.runId}\`

This directory is an append-only working record. Original manuscript files stay in their existing locations; generated prompts, Chat artifacts, logs, and checkpoints are stored here.

${rounds}

## Safety boundary

- Manuscript prose must be produced in the user's visible ChatGPT Chat session.
- Codex coordinates files, status, compilation, and error handoff; it must not silently replace Chat as the paper writer.
- Only paths listed in \`inputs.json\` and outputs explicitly registered in \`run.json\` may be uploaded.
- Never upload credentials, environment files, private keys, or unrelated project files.
`;
}

export async function loadRun(runPath) {
  const resolved = path.resolve(runPath);
  const statePath = path.join(resolved, "run.json");
  if (!(await pathExists(statePath))) {
    throw new CliError(
      `Not a YanShu run directory: ${resolved}`,
      "invalid_run",
    );
  }
  const state = JSON.parse(await readFile(statePath, "utf8"));
  if (path.resolve(state.runPath) !== resolved) {
    throw new CliError(
      "The run directory does not match run.json. Move recovery is not supported yet.",
      "moved_run",
    );
  }
  const migrated = migrateRunState(state);
  if (migrated) {
    state.updatedAt = new Date().toISOString();
    await writeJsonAtomic(statePath, state);
    await writeVisibleStatus(state);
  }
  return state;
}

export async function saveRun(state) {
  state.updatedAt = new Date().toISOString();
  await writeJsonAtomic(path.join(state.runPath, "run.json"), state);
  await writeVisibleStatus(state);
  return state;
}

export async function recordRunEvent(
  state,
  type,
  details = {},
) {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    details,
  };
  await appendFile(
    path.join(state.runPath, "events.jsonl"),
    `${JSON.stringify(event)}\n`,
    "utf8",
  );
  return event;
}

function findRound(state, selector) {
  const round = state.rounds.find(
    (candidate) =>
      candidate.id === selector || String(candidate.number) === String(selector),
  );
  if (!round) {
    throw new CliError(`Unknown round: ${selector}`, "unknown_round");
  }
  return round;
}

export function inspectBibLibraryContinuity(
  inputContent,
  outputContent,
) {
  const extractKeys = (content) => {
    const keys = [];
    const expression =
      /@([a-z][a-z0-9_-]*)\s*[\{\(]\s*([^,\s=]+)\s*,/giu;
    for (const match of String(content).matchAll(expression)) {
      if (
        ["comment", "preamble", "string"].includes(
          match[1].toLocaleLowerCase("en-US"),
        )
      ) {
        continue;
      }
      keys.push(match[2]);
    }
    return keys;
  };
  const inputKeys = extractKeys(inputContent);
  const outputKeys = extractKeys(outputContent);
  const outputCounts = new Map();
  for (const key of outputKeys) {
    outputCounts.set(key, (outputCounts.get(key) ?? 0) + 1);
  }
  const missingKeys = [
    ...new Set(inputKeys.filter((key) => !outputCounts.has(key))),
  ];
  const duplicateKeys = [...outputCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
  return {
    ok: missingKeys.length === 0 && duplicateKeys.length === 0,
    inputKeyCount: new Set(inputKeys).size,
    outputKeyCount: new Set(outputKeys).size,
    missingKeys,
    duplicateKeys,
  };
}

export async function validateRoundDeliverables(state, selector) {
  const round = findRound(state, selector);
  if (
    compareWorkflowVersions(
      state.workflowVersion,
      COMPLETE_LIBRARY_PROTOCOL_VERSION,
    ) < 0
  ) {
    return {
      enforced: false,
      reason:
        "The saved run predates the complete-library handoff protocol.",
    };
  }

  const outputs = [];
  for (const relative of round.outputs ?? []) {
    const target = path.resolve(state.runPath, relative);
    if (!isWithin(state.runPath, target) || !(await pathExists(target))) {
      continue;
    }
    const info = await stat(target);
    if (info.isFile()) outputs.push(target);
  }
  const outputExtensions = new Set(
    outputs.map((target) => path.extname(target).toLowerCase()),
  );
  if (round.id === "framework-figure") {
    if (
      ![".png", ".jpg", ".jpeg", ".webp"].some((extension) =>
        outputExtensions.has(extension),
      )
    ) {
      throw new CliError(
        "The framework-figure round requires a registered image artifact.",
        "missing_required_artifact",
      );
    }
    return { enforced: true, bibContinuity: null };
  }

  const requiredExtensions = [".tex", ".md", ".bib", ".pdf"];
  const missingExtensions = requiredExtensions.filter(
    (extension) => !outputExtensions.has(extension),
  );
  if (missingExtensions.length > 0) {
    throw new CliError(
      `This manuscript round is missing required registered artifacts: ${missingExtensions.join(", ")}.`,
      "missing_required_artifact",
      { missingExtensions },
    );
  }

  const outputBib = [...outputs]
    .reverse()
    .find((target) => path.extname(target).toLowerCase() === ".bib");
  const inputBib = (await roundMaterials(state, round.id)).find(
    (material) => material.roles.includes("primary-bib"),
  )?.path;
  if (!inputBib) {
    return {
      enforced: true,
      bibContinuity: {
        ok: true,
        inputKeyCount: 0,
        outputKeyCount: 0,
        missingKeys: [],
        duplicateKeys: [],
      },
    };
  }
  const bibContinuity = inspectBibLibraryContinuity(
    await readFile(inputBib, "utf8"),
    await readFile(outputBib, "utf8"),
  );
  if (!bibContinuity.ok) {
    throw new CliError(
      "The round BibTeX artifact is not a complete continuation of the input library.",
      "incomplete_bib_library",
      bibContinuity,
    );
  }
  return { enforced: true, bibContinuity };
}

export async function markRound(state, selector, update, force = false) {
  const round = findRound(state, selector);
  if (!ROUND_STATUSES.includes(update.status)) {
    throw new CliError(`Unknown round status: ${update.status}.`);
  }
  if (
    update.configurationVerification !== undefined &&
    !CHAT_CONFIGURATION_VERIFICATIONS.includes(
      update.configurationVerification,
    )
  ) {
    throw new CliError(
      `Unknown Chat configuration verification: ${update.configurationVerification}.`,
    );
  }
  if (
    update.transferMode !== undefined &&
    !["mcp", "attachments"].includes(update.transferMode)
  ) {
    throw new CliError(
      `Unknown round transfer mode: ${update.transferMode}.`,
      "invalid_transfer_mode",
    );
  }
  if (round.status === "completed" && update.status !== "completed" && !force) {
    throw new CliError(
      `Round ${round.number} is completed. Pass --force to reopen it.`,
      "completed_round",
    );
  }
  if (
    update.checkpoint !== undefined &&
    !ROUND_CHECKPOINTS.includes(update.checkpoint)
  ) {
    throw new CliError(
      `Unknown round checkpoint: ${update.checkpoint}.`,
      "unknown_checkpoint",
    );
  }
  if (update.status === "completed") {
    await validateRoundDeliverables(state, round.id);
  }

  const now = new Date().toISOString();
  round.status = update.status;
  if (update.checkpoint !== undefined) {
    round.checkpoint = update.checkpoint;
  } else if (update.status === "completed") {
    round.checkpoint = "finalized";
  } else if (update.status === "waiting") {
    round.checkpoint = "generating";
  }
  round.updatedAt = now;
  if (update.status === "running" && !round.startedAt) round.startedAt = now;
  if (update.status === "completed") round.completedAt = now;
  if (update.status !== "completed" && force) round.completedAt = null;
  if (update.note !== undefined) round.note = update.note;

  if (
    update.threadUrl ||
    update.experience ||
    update.model ||
    update.effort ||
    update.configurationVerification ||
    update.assistantTurn !== undefined ||
    update.transferMode
  ) {
    round.chat = {
      ...(round.chat ?? {}),
      threadUrl: update.threadUrl ?? round.chat?.threadUrl ?? null,
      experience: update.experience ?? round.chat?.experience ?? "chat",
      model: update.model ?? round.chat?.model ?? null,
      effort: update.effort ?? round.chat?.effort ?? null,
      assistantTurn:
        update.assistantTurn ??
        round.chat?.assistantTurn ??
        null,
      transferMode:
        update.transferMode ??
        round.chat?.transferMode ??
        state.execution?.transferMode ??
        null,
      configurationVerification:
        update.configurationVerification ??
        round.chat?.configurationVerification ??
        null,
    };
  }

  const allCompleted = state.rounds.every(
    (candidate) => candidate.status === "completed",
  );
  state.status = allCompleted
    ? state.finalManifestPath
      ? "completed"
      : "rounds-completed"
    : state.rounds.some((candidate) => candidate.status === "running")
      ? "running"
      : state.rounds.some((candidate) => candidate.status === "blocked")
        ? "blocked"
        : "ready";
  await saveRun(state);
  await recordRunEvent(state, "round-status", {
    round: round.number,
    status: round.status,
    checkpoint: round.checkpoint,
    note: update.note ?? null,
  });
  return round;
}

export async function updateRoundCheckpoint(
  state,
  selector,
  checkpoint,
  details = {},
) {
  if (!ROUND_CHECKPOINTS.includes(checkpoint)) {
    throw new CliError(
      `Unknown round checkpoint: ${checkpoint}.`,
      "unknown_checkpoint",
    );
  }
  const round = findRound(state, selector);
  round.checkpoint = checkpoint;
  round.updatedAt = new Date().toISOString();
  if (details.validation !== undefined) {
    round.validation = details.validation;
  }
  await saveRun(state);
  await recordRunEvent(state, "round-checkpoint", {
    round: round.number,
    checkpoint,
    ...details,
  });
  return round;
}

export async function updateExecutionMode(
  state,
  {
    transferMode,
    fallbackReason = null,
    mcpHandshake,
    attachmentProbe,
  },
) {
  if (
    transferMode !== undefined &&
    !["undecided", "mcp", "attachments"].includes(transferMode)
  ) {
    throw new CliError(
      `Unknown transfer mode: ${transferMode}.`,
      "invalid_transfer_mode",
    );
  }
  state.execution = {
    ...(state.execution ?? {}),
    ...(transferMode === undefined ? {} : { transferMode }),
    fallbackReason,
    ...(mcpHandshake === undefined ? {} : { mcpHandshake }),
    ...(attachmentProbe === undefined ? {} : { attachmentProbe }),
    updatedAt: new Date().toISOString(),
  };
  await saveRun(state);
  await recordRunEvent(state, "transfer-mode", state.execution);
  return state.execution;
}

async function collectFiles(target, options = {}, collected = []) {
  if (!target || collected.length >= (options.limit ?? 80)) return collected;
  const info = await stat(target);
  if (info.isFile()) {
    if (!options.extensions || options.extensions.has(path.extname(target))) {
      collected.push(target);
    }
    return collected;
  }
  if (!info.isDirectory()) return collected;

  const entries = await readdir(target, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (
      entry.name.startsWith(".") ||
      ["node_modules", "yanshu-reconstruction"].includes(entry.name)
    ) {
      continue;
    }
    await collectFiles(path.join(target, entry.name), options, collected);
    if (collected.length >= (options.limit ?? 80)) break;
  }
  return collected;
}

function selectFigureRepresentations(files) {
  const selected = new Map();
  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    const figureKey = path.join(
      path.dirname(file),
      path.basename(file, extension),
    );
    const current = selected.get(figureKey);
    if (
      !current ||
      (FIGURE_EXTENSION_PRIORITY.get(extension) ?? Number.MAX_SAFE_INTEGER) <
        (FIGURE_EXTENSION_PRIORITY.get(path.extname(current).toLowerCase()) ??
          Number.MAX_SAFE_INTEGER)
    ) {
      selected.set(figureKey, file);
    }
  }
  return [...selected.values()].sort((left, right) =>
    left.localeCompare(right),
  );
}

function isWithin(root, target) {
  const relative = path.relative(root, target);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  );
}

async function latestCompletedOutput(
  state,
  currentRoundNumber,
  extensions,
  roundPredicate = () => true,
) {
  const normalizedExtensions = new Set(
    extensions.map((extension) => extension.toLowerCase()),
  );
  const candidates = state.rounds
    .filter(
      (round) =>
        round.number < currentRoundNumber &&
        round.status === "completed" &&
        roundPredicate(round),
    )
    .sort((left, right) => right.number - left.number);

  for (const round of candidates) {
    for (const relative of [...(round.outputs ?? [])].reverse()) {
      const target = path.resolve(state.runPath, relative);
      if (
        !isWithin(state.runPath, target) ||
        !normalizedExtensions.has(path.extname(target).toLowerCase()) ||
        !(await pathExists(target))
      ) {
        continue;
      }
      const info = await stat(target);
      if (info.isFile()) {
        return {
          path: target,
          source: "round-output",
          roundNumber: round.number,
        };
      }
    }
  }
  return null;
}

export async function roundMaterials(state, selector) {
  const round = findRound(state, selector);
  const materials = new Map();
  const add = (target, metadata) => {
    if (!target) return;
    const resolved = path.resolve(target);
    const existing = materials.get(resolved);
    if (existing) {
      existing.roles = [...new Set([...existing.roles, ...metadata.roles])];
      return;
    }
    materials.set(resolved, {
      path: resolved,
      source: metadata.source,
      roles: metadata.roles,
      roundNumber: metadata.roundNumber ?? null,
    });
  };

  let tex = null;
  let bib = null;
  let pdf = null;

  if (round.number === 1) {
    tex = state.inputs.tex
      ? { path: state.inputs.tex, source: "original", roundNumber: null }
      : null;
    bib = state.inputs.bib
      ? { path: state.inputs.bib, source: "original", roundNumber: null }
      : null;
    pdf = state.inputs.pdf
      ? { path: state.inputs.pdf, source: "original", roundNumber: null }
      : null;
  } else {
    tex =
      (await latestCompletedOutput(
        state,
        round.number,
        [".tex"],
      )) ??
      (state.inputs.tex
        ? { path: state.inputs.tex, source: "original", roundNumber: null }
        : null);
    if (round.id !== "framework-figure") {
      bib =
        (await latestCompletedOutput(
          state,
          round.number,
          [".bib"],
        )) ??
        (state.inputs.bib
          ? { path: state.inputs.bib, source: "original", roundNumber: null }
          : null);
    }
    pdf =
      (await latestCompletedOutput(
        state,
        round.number,
        [".pdf"],
      )) ??
      (state.inputs.pdf
        ? { path: state.inputs.pdf, source: "original", roundNumber: null }
        : null);
  }

  add(tex?.path, {
    source: tex?.source,
    roles: [
      "primary-tex",
      ...(tex?.source === "round-output" ? ["previous-round-output"] : []),
    ],
    roundNumber: tex?.roundNumber,
  });
  add(bib?.path, {
    source: bib?.source,
    roles: [
      "primary-bib",
      ...(bib?.source === "round-output" ? ["previous-round-output"] : []),
    ],
    roundNumber: bib?.roundNumber,
  });
  add(pdf?.path, {
    source: pdf?.source,
    roles: [
      "compiled-paper",
      ...(pdf?.source === "round-output" ? ["previous-round-output"] : []),
    ],
    roundNumber: pdf?.roundNumber,
  });

  if (round.id === "final-refinement") {
    add(state.inputs.tex, {
      source: "original",
      roles: ["original-tex", "quality-regression-baseline"],
      roundNumber: null,
    });
    add(state.inputs.pdf, {
      source: "original",
      roles: ["original-pdf", "quality-regression-baseline"],
      roundNumber: null,
    });
    const frameworkFigure = await latestCompletedOutput(
      state,
      round.number,
      [".png", ".jpg", ".jpeg", ".webp"],
      (candidate) => candidate.id === "framework-figure",
    );
    add(frameworkFigure?.path, {
      source: frameworkFigure?.source,
      roles: ["framework-figure", "previous-round-output"],
      roundNumber: frameworkFigure?.roundNumber,
    });
  }

  if (!pdf && state.inputs.figures) {
    const figureFiles = await collectFiles(state.inputs.figures, {
      limit: 64,
      extensions: FIGURE_EXTENSIONS,
    });
    for (const figure of selectFigureRepresentations(figureFiles)) {
      add(figure, {
        source: "original",
        roles: ["paper-figure"],
        roundNumber: null,
      });
    }
  }

  return [...materials.values()];
}

export async function roundAttachments(state, selector) {
  return (await roundMaterials(state, selector)).map(
    (material) => material.path,
  );
}

export function nextRound(state) {
  return (
    state.rounds.find((round) => round.status !== "completed") ?? null
  );
}

export async function sha256File(target) {
  const content = await readFile(target);
  return createHash("sha256").update(content).digest("hex");
}

function safeDestinationName(value) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== path.basename(value) ||
    value === "." ||
    value === ".."
  ) {
    throw new CliError(
      `Artifact destination must be one filename: ${String(value)}.`,
      "invalid_artifact_name",
    );
  }
  return value;
}

function revisionTimestamp(now = new Date()) {
  return now
    .toISOString()
    .replace(/\.\d{3}Z$/, "z")
    .replaceAll(":", "")
    .replace("T", "-");
}

export async function commitArtifactsAtomically(
  state,
  selector,
  files,
  {
    replace = false,
    reason = "artifact import",
    chatTurn = null,
  } = {},
) {
  const round = findRound(state, selector);
  if (!Array.isArray(files) || files.length === 0) {
    throw new CliError(
      "At least one artifact is required.",
      "missing_artifact",
    );
  }

  const outputDirectory = path.join(
    state.runPath,
    round.directory,
    "output",
  );
  await mkdir(outputDirectory, { recursive: true });
  const prepared = [];
  const names = new Set();
  for (const item of files) {
    const source = path.resolve(item.sourcePath);
    if (!(await pathExists(source))) {
      throw new CliError(
        `Artifact does not exist: ${source}`,
        "missing_artifact",
      );
    }
    const sourceInfo = await stat(source);
    if (!sourceInfo.isFile()) {
      throw new CliError(
        `Only individual artifact files can be registered: ${source}`,
        "invalid_artifact",
      );
    }
    const destinationName = safeDestinationName(
      item.destinationName ?? path.basename(source),
    );
    const normalizedName = destinationName.toLocaleLowerCase("en-US");
    if (names.has(normalizedName)) {
      throw new CliError(
        `Duplicate artifact destination: ${destinationName}.`,
        "duplicate_artifact",
      );
    }
    names.add(normalizedName);
    const destination = path.join(outputDirectory, destinationName);
    const sourceIsDestination = path.resolve(source) === path.resolve(destination);
    const destinationExists = await pathExists(destination);
    if (sourceIsDestination && replace) {
      throw new CliError(
        "A replacement artifact must be downloaded outside the canonical output path so the previous version can be preserved.",
        "unsafe_in_place_replace",
      );
    }
    if (destinationExists && !sourceIsDestination && !replace) {
      throw new CliError(
        `Artifact already exists: ${destination}. Pass --replace to create a recoverable revision.`,
        "artifact_exists",
      );
    }
    prepared.push({
      source,
      destination,
      destinationName,
      sourceIsDestination,
      destinationExists,
      newSha256: await sha256File(source),
    });
  }

  const transactionId = randomUUID();
  const roundRoot = path.join(state.runPath, round.directory);
  const transactionRoot = path.join(
    roundRoot,
    ".transactions",
    transactionId,
  );
  const stagedRoot = path.join(transactionRoot, "staged");
  try {
    await mkdir(stagedRoot, { recursive: true });
    for (const item of prepared) {
      if (item.sourceIsDestination) continue;
      item.staged = path.join(stagedRoot, item.destinationName);
      await copyFile(item.source, item.staged);
      const stagedSha256 = await sha256File(item.staged);
      if (stagedSha256 !== item.newSha256) {
        throw new CliError(
          `Artifact changed while staging: ${item.source}.`,
          "artifact_changed_during_import",
        );
      }
    }
  } catch (error) {
    await rm(transactionRoot, { recursive: true, force: true }).catch(
      () => {},
    );
    throw error;
  }

  const snapshot = structuredClone(state);
  const committed = [];
  const backups = [];
  const revisions = [];
  const revisionRoot = path.join(
    roundRoot,
    "revisions",
    `${revisionTimestamp()}-${transactionId.slice(0, 8)}`,
  );
  try {
    for (const item of prepared) {
      if (item.sourceIsDestination) {
        committed.push({
          destination: item.destination,
          adoptedExisting: true,
        });
        continue;
      }
      if (item.destinationExists) {
        await mkdir(revisionRoot, { recursive: true });
        const previousSha256 = await sha256File(item.destination);
        const backup = path.join(revisionRoot, item.destinationName);
        await rename(item.destination, backup);
        backups.push({ backup, destination: item.destination });
        revisions.push({
          timestamp: new Date().toISOString(),
          fileName: item.destinationName,
          previousPath: relativeToRun(state.runPath, backup),
          previousSha256,
          newSha256: item.newSha256,
          reason,
          chatTurn,
        });
      }
      await rename(item.staged, item.destination);
      committed.push({
        destination: item.destination,
        adoptedExisting: false,
      });
    }

    for (const item of committed) {
      const relative = relativeToRun(state.runPath, item.destination);
      if (!round.outputs.includes(relative)) round.outputs.push(relative);
    }
    round.revisions ??= [];
    round.revisions.push(...revisions);
    round.checkpoint = "artifact-imported";
    round.updatedAt = new Date().toISOString();
    await saveRun(state);
    await recordRunEvent(state, "artifact-transaction", {
      round: round.number,
      replace,
      reason,
      chatTurn,
      artifacts: prepared.map((item) => ({
        fileName: item.destinationName,
        sha256: item.newSha256,
        adoptedExisting: item.sourceIsDestination,
      })),
      revisions,
    });
    await rm(transactionRoot, { recursive: true, force: true });
    return {
      transactionId,
      paths: committed.map((item) => item.destination),
      artifacts: prepared.map((item) => ({
        path: item.destination,
        fileName: item.destinationName,
        sha256: item.newSha256,
      })),
      revisions,
    };
  } catch (error) {
    for (const item of committed.reverse()) {
      if (!item.adoptedExisting) {
        await rm(item.destination, { force: true }).catch(() => {});
      }
    }
    for (const item of backups.reverse()) {
      if (await pathExists(item.backup)) {
        await rename(item.backup, item.destination).catch(() => {});
      }
    }
    for (const key of Object.keys(state)) delete state[key];
    Object.assign(state, snapshot);
    await rm(transactionRoot, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

export async function registerArtifact(
  state,
  selector,
  sourcePath,
  replace = false,
  options = {},
) {
  const transaction = await commitArtifactsAtomically(
    state,
    selector,
    [
      {
        sourcePath,
        destinationName: options.destinationName,
      },
    ],
    {
      replace,
      reason: options.reason ?? "individual artifact import",
      chatTurn: options.chatTurn ?? null,
    },
  );
  return transaction.paths[0];
}

export function summarizeRun(state) {
  const completed = state.rounds.filter(
    (round) => round.status === "completed",
  ).length;
  const current = nextRound(state);
  return {
    runId: state.runId,
    runPath: state.runPath,
    workflow: state.workflow,
    workflowVersion: state.workflowVersion,
    status: state.status,
    progress: {
      completed,
      total: state.rounds.length,
    },
    currentRound: current
      ? {
          id: current.id,
          number: current.number,
          title: current.title,
          status: current.status,
          checkpoint: current.checkpoint,
          threadUrl: current.chat?.threadUrl ?? null,
        }
      : null,
    execution: state.execution,
    statusPath: path.join(state.runPath, "STATUS.md"),
    finalManifestPath: state.finalManifestPath,
    validation: state.validation,
  };
}

export function bridgeHints() {
  const pluginRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  return {
    required:
      "A visible, signed-in ChatGPT session and a compatible Codex/Chrome browser bridge.",
    bundledRuntime: path.join(
      pluginRoot,
      "vendor",
      "chatgpt-control",
      "import-chatgpt-control.mjs",
    ),
    pinnedRevision: "73c5737f222709e324a1c7ba1637cef9966000ce",
    runtimeCheck:
      "Browser availability must be verified from the active Codex task; an ordinary shell cannot prove that globalThis.agent is available.",
  };
}
