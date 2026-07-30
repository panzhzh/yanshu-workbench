import { mkdir, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { artifactBundleSpec } from "./artifact-bundle.mjs";
import { CliError } from "./cli.mjs";
import { commitArtifactsAtomically } from "./run-store.mjs";

function roundFor(state, selector) {
  const round = state.rounds.find(
    (candidate) =>
      candidate.id === selector ||
      String(candidate.number) === String(selector),
  );
  if (!round) {
    throw new CliError(`Unknown round: ${selector}`, "unknown_round");
  }
  return round;
}

function suffixesFor(spec) {
  if (spec.required) {
    return spec.entries.map((entry) =>
      entry.replace(/^<base_name>/u, ""),
    );
  }
  return spec.directArtifactSuffix
    ? [spec.directArtifactSuffix]
    : [];
}

function registeredArtifactNames(state, round) {
  return new Set(
    (round.outputs ?? []).map((relative) =>
      path.basename(path.resolve(state.runPath, relative)),
    ),
  );
}

function matchingRegisteredNames(names, suffixes) {
  return suffixes.map((suffix) =>
    [...names].filter((name) => name.endsWith(suffix)),
  );
}

async function readableTopLevelFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, {
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue;
    const target = path.join(directory, entry.name);
    const info = await stat(target);
    if (info.isFile()) files.push(target);
  }
  return files;
}

function selectWorkspaceArtifacts(files, suffixes) {
  const matches = suffixes.map((suffix) => ({
    suffix,
    candidates: files.filter((target) =>
      path.basename(target).endsWith(suffix),
    ),
  }));
  const missing = matches
    .filter((item) => item.candidates.length === 0)
    .map((item) => item.suffix);
  const ambiguous = matches
    .filter((item) => item.candidates.length > 1)
    .map((item) => ({
      suffix: item.suffix,
      candidates: item.candidates.map((target) =>
        path.basename(target),
      ),
    }));
  if (missing.length > 0 || ambiguous.length > 0) {
    throw new CliError(
      "The round workspace does not contain exactly one complete artifact for every required suffix.",
      "invalid_executor_workspace_artifacts",
      { missing, ambiguous },
    );
  }

  const selected = matches.map((item) => item.candidates[0]);
  const baseNames = new Set(
    selected.map((target, index) =>
      path
        .basename(target)
        .slice(0, -suffixes[index].length),
    ),
  );
  if (
    baseNames.size !== 1 ||
    [...baseNames].some((value) => !value.trim())
  ) {
    throw new CliError(
      "Every round workspace artifact must use the same non-empty <base_name>.",
      "executor_workspace_basename_mismatch",
      {
        files: selected.map((target) => path.basename(target)),
      },
    );
  }
  return selected;
}

async function validateTextArtifacts(files) {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (const target of files) {
    if (![".tex", ".bib", ".md"].includes(path.extname(target))) {
      continue;
    }
    try {
      decoder.decode(await readFile(target));
    } catch {
      throw new CliError(
        `Workspace artifact ${path.basename(target)} is not valid UTF-8 text.`,
        "invalid_artifact_encoding",
      );
    }
  }
}

export async function executorWorkspaceSpec(
  state,
  selector,
) {
  const round = roundFor(state, selector);
  const roundRoot = path.join(state.runPath, round.directory);
  const workingDirectory = path.join(roundRoot, "workspace");
  const canonicalOutputDirectory = path.join(roundRoot, "output");
  await mkdir(workingDirectory, { recursive: true });
  const artifactSpec = artifactBundleSpec(
    round,
    state.workflowVersion,
  );
  const expectedArtifactSuffixes = suffixesFor(artifactSpec);
  return {
    mode: "round-scoped",
    workingDirectory,
    canonicalOutputDirectory,
    expectedArtifactSuffixes,
    automaticImportSupported:
      expectedArtifactSuffixes.length > 0,
    autoImportOnFinalize:
      state.execution?.adapter === "codex-host",
    writeBoundary: {
      executorWritableRoots: [workingDirectory],
      sourceProject: "read-only",
      runMetadata: "YanShu-managed",
      previousRounds: "read-only",
      canonicalOutput:
        "YanShu-managed; import complete artifacts from workingDirectory",
    },
  };
}

export async function importExecutorWorkspaceArtifacts({
  state,
  selector,
  replace = false,
  reason = "executor workspace import",
  chatTurn = null,
}) {
  const round = roundFor(state, selector);
  const workspace = await executorWorkspaceSpec(
    state,
    round.id,
  );
  const suffixes = workspace.expectedArtifactSuffixes;
  if (suffixes.length === 0) {
    throw new CliError(
      `Round ${round.number} does not support automatic workspace import.`,
      "executor_workspace_import_not_supported",
    );
  }

  const registered = registeredArtifactNames(state, round);
  const registeredMatches = matchingRegisteredNames(
    registered,
    suffixes,
  );
  const ambiguousRegistered = registeredMatches
    .map((matches, index) => ({
      suffix: suffixes[index],
      matches,
    }))
    .filter((item) => item.matches.length > 1);
  if (ambiguousRegistered.length > 0) {
    throw new CliError(
      "The canonical round output contains multiple registered artifacts for one required suffix.",
      "ambiguous_registered_artifacts",
      { ambiguous: ambiguousRegistered },
    );
  }
  if (
    registeredMatches.every((matches) => matches.length === 1)
  ) {
    return {
      imported: false,
      skipped: true,
      reason: "required artifacts are already registered",
      workspace,
      artifacts: registeredMatches.map((matches) =>
        path.join(workspace.canonicalOutputDirectory, matches[0]),
      ),
    };
  }

  const files = await readableTopLevelFiles(
    workspace.workingDirectory,
  );
  const selected = selectWorkspaceArtifacts(files, suffixes);
  await validateTextArtifacts(selected);
  const transaction = await commitArtifactsAtomically(
    state,
    round.id,
    selected.map((sourcePath) => ({
      sourcePath,
      destinationName: path.basename(sourcePath),
    })),
    {
      replace,
      reason,
      chatTurn,
    },
  );
  return {
    imported: true,
    skipped: false,
    workspace,
    artifacts: transaction.paths,
    transactionId: transaction.transactionId,
    revisions: transaction.revisions,
  };
}
