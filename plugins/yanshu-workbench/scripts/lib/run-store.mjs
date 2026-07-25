import { randomUUID } from "node:crypto";
import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CliError } from "./cli.mjs";

export const RUN_SCHEMA_VERSION = 1;
export const ROUND_STATUSES = [
  "pending",
  "running",
  "waiting",
  "completed",
  "failed",
  "blocked",
];
export const CHAT_CONFIGURATION_VERIFICATIONS = [
  "verified",
  "click-acknowledged",
];

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
  const pdf = await detectFile(projectRoot, supplied.pdf, ".pdf", "main.pdf");
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

export async function createRun({
  projectRoot,
  outputRoot,
  runId,
  inputs,
  workflow,
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
      directory: roundName,
      promptPath: relativeToRun(runPath, promptPath),
      sourceTemplate: round.sourceFile,
      chat: null,
      outputs: [],
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
    rounds,
    validation: {
      status: "not-run",
      texPath: null,
      logPath: null,
      updatedAt: null,
    },
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
  if (state.schemaVersion !== RUN_SCHEMA_VERSION) {
    throw new CliError(
      `Unsupported run schema ${state.schemaVersion}.`,
      "unsupported_schema",
    );
  }
  if (path.resolve(state.runPath) !== resolved) {
    throw new CliError(
      "The run directory does not match run.json. Move recovery is not supported yet.",
      "moved_run",
    );
  }
  return state;
}

export async function saveRun(state) {
  state.updatedAt = new Date().toISOString();
  await writeJsonAtomic(path.join(state.runPath, "run.json"), state);
  return state;
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
  if (round.status === "completed" && update.status !== "completed" && !force) {
    throw new CliError(
      `Round ${round.number} is completed. Pass --force to reopen it.`,
      "completed_round",
    );
  }

  const now = new Date().toISOString();
  round.status = update.status;
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
    update.configurationVerification
  ) {
    round.chat = {
      ...(round.chat ?? {}),
      threadUrl: update.threadUrl ?? round.chat?.threadUrl ?? null,
      experience: update.experience ?? round.chat?.experience ?? "chat",
      model: update.model ?? round.chat?.model ?? null,
      effort: update.effort ?? round.chat?.effort ?? null,
      configurationVerification:
        update.configurationVerification ??
        round.chat?.configurationVerification ??
        null,
    };
  }

  state.status = state.rounds.every(
    (candidate) => candidate.status === "completed",
  )
    ? "rounds-completed"
    : state.rounds.some((candidate) => candidate.status === "running")
      ? "running"
      : state.rounds.some((candidate) => candidate.status === "blocked")
        ? "blocked"
        : "ready";
  await saveRun(state);
  return round;
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

export async function roundAttachments(state, selector) {
  const round = findRound(state, selector);
  const attachments = [
    state.inputs.tex,
    state.inputs.bib,
    state.inputs.pdf,
  ].filter(Boolean);
  if (state.inputs.figures) {
    const figureFiles = await collectFiles(state.inputs.figures, {
        limit: 64,
        extensions: FIGURE_EXTENSIONS,
      });
    attachments.push(...selectFigureRepresentations(figureFiles));
  }

  for (const previous of state.rounds) {
    if (previous.number >= round.number) break;
    if (previous.status !== "completed") continue;
    const outputPath = path.join(state.runPath, previous.directory, "output");
    attachments.push(...(await collectFiles(outputPath, { limit: 64 })));
  }

  return [...new Set(attachments.map((target) => path.resolve(target)))];
}

export function nextRound(state) {
  return (
    state.rounds.find((round) => round.status !== "completed") ?? null
  );
}

export async function registerArtifact(
  state,
  selector,
  sourcePath,
  replace = false,
) {
  const round = findRound(state, selector);
  const source = path.resolve(sourcePath);
  if (!(await pathExists(source))) {
    throw new CliError(`Artifact does not exist: ${source}`, "missing_artifact");
  }
  const sourceInfo = await stat(source);
  if (!sourceInfo.isFile()) {
    throw new CliError("Only individual artifact files can be registered.");
  }

  const outputDirectory = path.join(
    state.runPath,
    round.directory,
    "output",
  );
  const destination = path.join(outputDirectory, path.basename(source));
  if ((await pathExists(destination)) && !replace) {
    throw new CliError(
      `Artifact already exists: ${destination}. Pass --replace to overwrite it.`,
      "artifact_exists",
    );
  }
  if (source !== destination) await copyFile(source, destination);

  const relative = relativeToRun(state.runPath, destination);
  if (!round.outputs.includes(relative)) round.outputs.push(relative);
  round.updatedAt = new Date().toISOString();
  await saveRun(state);
  return destination;
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
          threadUrl: current.chat?.threadUrl ?? null,
        }
      : null,
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
