import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { CliError } from "./cli.mjs";
import { pathExists, sha256File } from "./run-store.mjs";

const GRAPHIC_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".eps",
];
const OVERVIEW_NAME_PATTERN =
  /(?:overview|framework|architecture|pipeline|workflow|protocol|system[-_ ]?diagram)/iu;

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

function absoluteOutputPaths(state, round) {
  return (round.outputs ?? []).map((relative) =>
    path.resolve(state.runPath, relative),
  );
}

async function readableFiles(paths) {
  const files = [];
  for (const target of paths) {
    if (!(await pathExists(target))) continue;
    const info = await stat(target);
    if (info.isFile()) files.push(target);
  }
  return files;
}

function latestWithExtension(paths, extensions) {
  const allowed = new Set(
    extensions.map((extension) => extension.toLocaleLowerCase("en-US")),
  );
  return [...paths]
    .reverse()
    .find((target) =>
      allowed.has(path.extname(target).toLocaleLowerCase("en-US")),
    );
}

export function stripTexComments(content) {
  return String(content)
    .split(/\r?\n/u)
    .map((line) => {
      let escaped = false;
      for (let index = 0; index < line.length; index += 1) {
        if (line[index] === "\\" && !escaped) {
          escaped = true;
          continue;
        }
        if (line[index] === "%" && !escaped) return line.slice(0, index);
        escaped = false;
      }
      return line;
    })
    .join("\n");
}

export function extractBibKeys(content) {
  const keys = new Set();
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
    keys.add(match[2]);
  }
  return keys;
}

export function extractCiteKeys(content) {
  const keys = new Set();
  const tex = stripTexComments(content);
  const expression =
    /\\(?:[a-zA-Z]*cite[a-zA-Z]*|nocite)\*?(?:\s*\[[^\]]*\]){0,2}\s*\{([^{}]+)\}/gu;
  for (const match of tex.matchAll(expression)) {
    for (const key of match[1].split(",")) {
      const normalized = key.trim();
      if (normalized && normalized !== "*") keys.add(normalized);
    }
  }
  return keys;
}

export function extractGraphics(content) {
  return [
    ...stripTexComments(content).matchAll(
      /\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^{}]+)\}/gu,
    ),
  ].map((match) => match[1].trim());
}

export function extractBibliographyStems(content) {
  const stems = new Set();
  const tex = stripTexComments(content);
  for (const match of tex.matchAll(/\\bibliography\s*\{([^{}]+)\}/gu)) {
    for (const entry of match[1].split(",")) {
      const value = entry.trim();
      if (value) stems.add(path.basename(value, path.extname(value)));
    }
  }
  for (const match of tex.matchAll(/\\addbibresource(?:\s*\[[^\]]*\])?\s*\{([^{}]+)\}/gu)) {
    const value = match[1].trim();
    if (value) stems.add(path.basename(value, path.extname(value)));
  }
  return stems;
}

function normalizedGraphicStem(value) {
  return path
    .basename(value, path.extname(value))
    .normalize("NFKC")
    .toLocaleLowerCase("en-US");
}

async function collectCandidateFiles(root, limit = 4_000, collected = []) {
  if (!root || collected.length >= limit || !(await pathExists(root))) {
    return collected;
  }
  const info = await stat(root);
  if (info.isFile()) {
    collected.push(root);
    return collected;
  }
  if (!info.isDirectory()) return collected;
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.name.startsWith(".") ||
      [
        "node_modules",
        ".git",
        "yanshu-reconstruction",
        "__pycache__",
      ].includes(entry.name)
    ) {
      continue;
    }
    await collectCandidateFiles(
      path.join(root, entry.name),
      limit,
      collected,
    );
    if (collected.length >= limit) break;
  }
  return collected;
}

async function graphicInventory(state, round, texPath) {
  const roots = [
    path.dirname(texPath),
    path.join(state.runPath, round.directory, "output"),
    state.inputs?.figures,
    state.projectRoot,
    ...state.rounds.map((candidate) =>
      path.join(
        state.runPath,
        candidate.directory,
        "output",
      ),
    ),
  ].filter(Boolean);
  const files = [];
  for (const root of [...new Set(roots.map((item) => path.resolve(item)))]) {
    await collectCandidateFiles(root, 4_000, files);
  }
  const byBasename = new Map();
  for (const file of files) {
    const extension = path.extname(file).toLocaleLowerCase("en-US");
    if (!GRAPHIC_EXTENSIONS.includes(extension)) continue;
    const name = path.basename(file).toLocaleLowerCase("en-US");
    const stem = path
      .basename(file, extension)
      .toLocaleLowerCase("en-US");
    for (const key of [name, stem]) {
      const matches = byBasename.get(key) ?? [];
      matches.push(file);
      byBasename.set(key, matches);
    }
  }
  return byBasename;
}

async function missingGraphics(state, round, texPath, graphics) {
  const inventory = await graphicInventory(state, round, texPath);
  const missing = [];
  for (const reference of graphics) {
    const extension = path.extname(reference).toLocaleLowerCase("en-US");
    const portable = reference.replaceAll("/", path.sep);
    const roots = [
      path.dirname(texPath),
      state.projectRoot,
      state.inputs?.figures,
      path.join(state.runPath, round.directory, "output"),
      ...state.rounds.map((candidate) =>
        path.join(
          state.runPath,
          candidate.directory,
          "output",
        ),
      ),
    ].filter(Boolean);
    const exactCandidates = [
      ...new Set(
        roots.flatMap((root) => {
          const direct = path.resolve(root, portable);
          const basename = path.resolve(
            root,
            path.basename(portable),
          );
          const bases =
            direct === basename
              ? [direct]
              : [direct, basename];
          return bases.flatMap((base) =>
            extension
              ? [base]
              : GRAPHIC_EXTENSIONS.map(
                  (candidate) => `${base}${candidate}`,
                ),
          );
        }),
      ),
    ];
    let exactMatch = false;
    for (const candidate of exactCandidates) {
      if (await pathExists(candidate)) {
        const info = await stat(candidate);
        if (info.isFile()) {
          exactMatch = true;
          break;
        }
      }
    }
    if (exactMatch) continue;
    const candidates = extension
      ? [path.basename(reference).toLocaleLowerCase("en-US")]
      : [
          path.basename(reference).toLocaleLowerCase("en-US"),
          ...GRAPHIC_EXTENSIONS.map(
            (candidate) =>
              `${path.basename(reference).toLocaleLowerCase("en-US")}${candidate}`,
          ),
        ];
    const fallbackMatches = [
      ...new Set(
        candidates.flatMap(
          (candidate) => inventory.get(candidate) ?? [],
        ),
      ),
    ];
    if (fallbackMatches.length !== 1) {
      missing.push(reference);
    }
  }
  return missing;
}

function check(id, status, message, details = undefined) {
  return {
    id,
    status,
    message,
    ...(details === undefined ? {} : { details }),
  };
}

function splitBeforeAppendix(tex) {
  return tex.split(/\\appendix\b|\\begin\s*\{appendices\}/u, 1)[0];
}

export function countMainTextWords(content, visualWordEquivalent = 200) {
  let tex = splitBeforeAppendix(stripTexComments(content));
  const visualCount = [
    ...tex.matchAll(/\\begin\s*\{(?:figure\*?|table\*?)\}/gu),
  ].length;
  tex = tex
    .replace(/\\begin\s*\{(?:figure\*?|table\*?)\}[\s\S]*?\\end\s*\{(?:figure\*?|table\*?)\}/gu, " ")
    .replace(/\$[^$]*\$/gu, " ")
    .replace(/\\\[[\s\S]*?\\\]/gu, " ")
    .replace(/\\begin\s*\{(?:equation|align|algorithm)[^}]*\}[\s\S]*?\\end\s*\{[^}]+\}/gu, " ")
    .replace(/\\(?:title|author|keywords?)\s*\{[^{}]*\}/giu, " ")
    .replace(/\\[a-zA-Z@]+\*?(?:\s*\[[^\]]*\])*/gu, " ")
    .replace(/[{}~_^&]/gu, " ");
  const textWords =
    tex.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return {
    textWords,
    visualCount,
    visualWordEquivalent,
    totalWords: textWords + visualCount * visualWordEquivalent,
  };
}

function imageDimensionsFromPng(bytes) {
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
  ) {
    return null;
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    format: "png",
  };
}

function imageDimensionsFromJpeg(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }
  let cursor = 2;
  while (cursor + 9 < bytes.length) {
    if (bytes[cursor] !== 0xff) {
      cursor += 1;
      continue;
    }
    const marker = bytes[cursor + 1];
    const length = bytes.readUInt16BE(cursor + 2);
    if (
      [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
        marker,
      )
    ) {
      return {
        width: bytes.readUInt16BE(cursor + 7),
        height: bytes.readUInt16BE(cursor + 5),
        format: "jpeg",
      };
    }
    if (!Number.isInteger(length) || length < 2) break;
    cursor += 2 + length;
  }
  return null;
}

export async function inspectImageDimensions(target) {
  const bytes = await readFile(target);
  return imageDimensionsFromPng(bytes) ?? imageDimensionsFromJpeg(bytes);
}

function configuredAspectRatio(config) {
  const figure = config?.frameworkFigure;
  if (!figure) return null;
  const ratios = {
    "landscape-4-3": 4 / 3,
    "landscape-3-2": 3 / 2,
    "landscape-16-9": 16 / 9,
    "landscape-2-1": 2,
    "portrait-3-4": 3 / 4,
    "portrait-9-16": 9 / 16,
  };
  if (figure.aspectRatioId === "custom") {
    const width = Number(figure.customAspectWidth);
    const height = Number(figure.customAspectHeight);
    return width > 0 && height > 0 ? width / height : null;
  }
  return ratios[figure.aspectRatioId] ?? null;
}

async function frameworkFigureChecks(state, round, files) {
  const checks = [];
  const image = latestWithExtension(files, [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
  ]);
  if (!image) {
    return [
      check(
        "framework-image",
        "failed",
        "No readable framework image is registered.",
      ),
    ];
  }
  const dimensions = await inspectImageDimensions(image);
  if (!dimensions) {
    checks.push(
      check(
        "framework-dimensions",
        "warning",
        "The image format does not expose dimensions to the built-in validator.",
        { image },
      ),
    );
    return checks;
  }
  const expected = configuredAspectRatio(state.config);
  const actual = dimensions.width / dimensions.height;
  const relativeError =
    expected === null ? null : Math.abs(actual - expected) / expected;
  checks.push(
    check(
      "framework-dimensions",
      expected === null || relativeError <= 0.02 ? "passed" : "failed",
      expected === null
        ? "Framework image dimensions were recorded."
        : relativeError <= 0.02
          ? "Framework image matches the configured canvas ratio."
          : "Framework image does not match the configured canvas ratio.",
      {
        image,
        ...dimensions,
        actualRatio: actual,
        expectedRatio: expected,
        relativeError,
      },
    ),
  );
  return checks;
}

function parseCompilePageCount(log) {
  const matches = [
    ...String(log).matchAll(/Output written on .+?\((\d+)\s+pages?/giu),
  ];
  const value = Number.parseInt(matches.at(-1)?.[1] ?? "", 10);
  return Number.isInteger(value) ? value : null;
}

async function previousFrameworkBasenames(state, round) {
  const previous = state.rounds
    .filter(
      (candidate) =>
        candidate.number < round.number &&
        candidate.id !== "framework-figure",
    )
    .sort((left, right) => right.number - left.number);
  for (const candidate of previous) {
    const files = await readableFiles(
      absoluteOutputPaths(state, candidate),
    );
    const texPath = latestWithExtension(files, [".tex"]);
    if (!texPath) continue;
    const graphics = extractGraphics(await readFile(texPath, "utf8"));
    return graphics
      .map(normalizedGraphicStem)
      .filter((stem) => OVERVIEW_NAME_PATTERN.test(stem));
  }
  return [];
}

export async function validateRoundConsistency({
  state,
  selector,
}) {
  const round = roundFor(state, selector);
  const files = await readableFiles(absoluteOutputPaths(state, round));
  if (round.id === "framework-figure") {
    const checks = await frameworkFigureChecks(state, round, files);
    return {
      round: round.number,
      checks,
      passed: !checks.some((item) => item.status === "failed"),
    };
  }

  const checks = [];
  const texPath = latestWithExtension(files, [".tex"]);
  const bibPath = latestWithExtension(files, [".bib"]);
  const pdfPath = latestWithExtension(files, [".pdf"]);
  if (!texPath || !bibPath || !pdfPath) {
    checks.push(
      check(
        "required-artifacts",
        "failed",
        "TeX, BibTeX, and compiled PDF must all be registered.",
        { texPath, bibPath, pdfPath },
      ),
    );
    return { round: round.number, checks, passed: false };
  }
  checks.push(
    check(
      "required-artifacts",
      "passed",
      "Required manuscript artifacts are present.",
      { texPath, bibPath, pdfPath },
    ),
  );

  const tex = await readFile(texPath, "utf8");
  const bib = await readFile(bibPath, "utf8");
  const graphics = extractGraphics(tex);
  const missing = await missingGraphics(
    state,
    round,
    texPath,
    graphics,
  );
  checks.push(
    check(
      "graphics-resolve",
      missing.length === 0 ? "passed" : "failed",
      missing.length === 0
        ? "Every includegraphics reference resolves to a real file."
        : "One or more includegraphics references do not resolve.",
      { references: graphics, missing },
    ),
  );

  const bibKeys = extractBibKeys(bib);
  const citeKeys = extractCiteKeys(tex);
  const missingCitations = [...citeKeys].filter(
    (key) => !bibKeys.has(key),
  );
  checks.push(
    check(
      "citation-keys",
      missingCitations.length === 0 ? "passed" : "failed",
      missingCitations.length === 0
        ? "Every cited key exists in the delivered BibTeX library."
        : "The TeX cites keys missing from the delivered BibTeX library.",
      {
        citationCount: citeKeys.size,
        bibKeyCount: bibKeys.size,
        missingCitations,
      },
    ),
  );

  const bibliographyStems = extractBibliographyStems(tex);
  const deliveredBibStem = path.basename(
    bibPath,
    path.extname(bibPath),
  );
  const bibliographyApplicable =
    citeKeys.size > 0 || bibliographyStems.size > 0;
  const bibliographyMatches =
    !bibliographyApplicable ||
    bibliographyStems.has(deliveredBibStem);
  checks.push(
    check(
      "bibliography-basename",
      !bibliographyApplicable
        ? "not-applicable"
        : bibliographyMatches
          ? "passed"
          : "failed",
      !bibliographyApplicable
        ? "The manuscript has no citation or bibliography command to validate."
        : bibliographyMatches
          ? "The TeX bibliography basename matches the delivered BibTeX file."
        : "The TeX bibliography command does not reference the delivered BibTeX basename.",
      {
        deliveredBibStem,
        referencedStems: [...bibliographyStems],
      },
    ),
  );

  if (round.id === "final-refinement") {
    const frameworkRound = state.rounds.find(
      (candidate) => candidate.id === "framework-figure",
    );
    const frameworkFiles = frameworkRound
      ? await readableFiles(absoluteOutputPaths(state, frameworkRound))
      : [];
    const frameworkImage = latestWithExtension(frameworkFiles, [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
    ]);
    const frameworkStem = frameworkImage
      ? normalizedGraphicStem(frameworkImage)
      : null;
    const currentStems = new Set(graphics.map(normalizedGraphicStem));
    checks.push(
      check(
        "round-4-framework-reference",
        frameworkStem && currentStems.has(frameworkStem)
          ? "passed"
          : "failed",
        frameworkStem && currentStems.has(frameworkStem)
          ? "The final TeX references the Round 4 framework image."
          : "The final TeX does not reference the Round 4 framework image.",
        {
          frameworkImage,
          frameworkStem,
          requiredIncludegraphics: frameworkImage
            ? `\\includegraphics{${path.basename(frameworkImage)}}`
            : null,
          currentGraphics: [...currentStems],
        },
      ),
    );
    const previousStems = await previousFrameworkBasenames(state, round);
    const stale = previousStems.filter(
      (stem) => stem !== frameworkStem && currentStems.has(stem),
    );
    checks.push(
      check(
        "stale-framework-reference",
        stale.length === 0 ? "passed" : "failed",
        stale.length === 0
          ? "No identifiable superseded overview/framework basename remains."
          : "The final TeX still references an identifiable superseded framework image.",
        {
          previousStems,
          stale,
          requiredAction:
            stale.length === 0
              ? null
              : "Remove or replace every active includegraphics reference whose normalized basename appears in stale.",
        },
      ),
    );
  }

  const appendixPresent =
    /\\appendix\b|\\begin\s*\{appendices\}/u.test(stripTexComments(tex));
  checks.push(
    check(
      "appendix-policy",
      state.config?.includeAppendix === false && appendixPresent
        ? "failed"
        : "passed",
      state.config?.includeAppendix === false && appendixPresent
        ? "The configuration forbids an appendix, but the TeX contains one."
        : "The appendix setting is satisfied.",
      {
        configured: state.config?.includeAppendix ?? null,
        appendixPresent,
      },
    ),
  );

  const words = countMainTextWords(tex, 200);
  const targetWords = state.config?.hasWordLimit
    ? Number(state.config?.targetWords)
    : null;
  const targetDifference =
    Number.isFinite(targetWords) && !state.config?.unlimitedCoreSections
      ? words.totalWords - targetWords
      : null;
  const relativeDifference =
    targetDifference === null || targetWords === 0
      ? null
      : Math.abs(targetDifference) / targetWords;
  checks.push(
    check(
      "main-text-word-budget",
      targetDifference === null
        ? "not-applicable"
        : "passed",
      targetDifference === null
        ? "No suggested main-text length is configured."
        : relativeDifference <= 0.05
          ? "The estimated main-text count is within 5% of the optional reference."
          : "The estimated main-text count differs from the optional reference by more than 5%; this is advisory and does not fail validation.",
      {
        ...words,
        targetWords,
        targetDifference,
        relativeDifference,
      },
    ),
  );

  let compileLog = "";
  if (round.compilation?.logPath) {
    const logPath = path.resolve(state.runPath, round.compilation.logPath);
    if (await pathExists(logPath)) {
      compileLog = await readFile(logPath, "utf8");
    }
  }
  const unresolved =
    /(?:undefined references?|Citation [`'][^`']+['`] .* undefined|There were undefined references|File [`'][^`']+['`] not found)/iu.test(
      compileLog,
    );
  checks.push(
    check(
      "compile-log",
      round.compilation?.status === "passed" && !unresolved
        ? "passed"
        : "failed",
      round.compilation?.status === "passed" && !unresolved
        ? "Compilation passed without unresolved-reference or missing-file diagnostics."
        : "Compilation is missing, failed, or contains unresolved-reference diagnostics.",
      {
        compilationStatus: round.compilation?.status ?? null,
        unresolvedDiagnostics: unresolved,
        pageCount: parseCompilePageCount(compileLog),
      },
    ),
  );

  return {
    round: round.number,
    checks,
    passed: !checks.some((item) => item.status === "failed"),
  };
}

async function fileManifestEntry(target, root) {
  const info = await stat(target);
  return {
    path: path.relative(root, target).split(path.sep).join("/"),
    bytes: info.size,
    sha256: await sha256File(target),
  };
}

async function inputManifestEntry(role, target) {
  const info = await stat(target);
  if (info.isFile()) {
    return {
      role,
      path: target,
      type: "file",
      bytes: info.size,
      sha256: await sha256File(target),
    };
  }
  if (!info.isDirectory()) return null;
  const limit = 4_000;
  const files = await collectCandidateFiles(target, limit + 1);
  const selected = files.slice(0, limit).sort();
  let bytes = 0;
  const aggregate = createHash("sha256");
  for (const file of selected) {
    const fileInfo = await stat(file);
    const digest = await sha256File(file);
    const relative = path
      .relative(target, file)
      .split(path.sep)
      .join("/");
    bytes += fileInfo.size;
    aggregate.update(`${relative}\0${digest}\n`);
  }
  return {
    role,
    path: target,
    type: "directory",
    fileCount: selected.length,
    bytes,
    sha256: aggregate.digest("hex"),
    truncated: files.length > limit,
  };
}

function roundValidationSummary(round) {
  const checks = round.validation?.checks ?? [];
  const compileCheck = checks.find(
    (item) => item.id === "compile-log",
  );
  return {
    round: round.number,
    id: round.id,
    checkpoint: round.checkpoint,
    status: round.validation?.status ?? "not-run",
    validationPath: round.validation?.path ?? null,
    checks,
    compilation: round.compilation
      ? {
          status: round.compilation.status,
          engine: round.compilation.engine,
          pdfPath: round.compilation.pdfPath,
          logPath: round.compilation.logPath,
          pageCount:
            compileCheck?.details?.pageCount ?? null,
          unresolvedDiagnostics:
            compileCheck?.details?.unresolvedDiagnostics ?? null,
        }
      : null,
  };
}

function checkFromRound(round, id) {
  return (round?.validation?.checks ?? []).find(
    (item) => item.id === id,
  ) ?? null;
}

export async function buildFinalManifest(state) {
  const finalRound = state.rounds.find(
    (round) => round.id === "final-refinement",
  );
  const frameworkRound = state.rounds.find(
    (round) => round.id === "framework-figure",
  );
  const finalFiles = await readableFiles([
    ...absoluteOutputPaths(state, finalRound ?? { outputs: [] }),
    ...absoluteOutputPaths(state, frameworkRound ?? { outputs: [] }),
  ]);
  const inputEntries = [];
  for (const [role, target] of Object.entries(state.inputs ?? {})) {
    if (!target || !(await pathExists(target))) continue;
    const entry = await inputManifestEntry(role, target);
    if (entry) inputEntries.push(entry);
  }
  const chatRounds = state.rounds.map((round) => ({
    round: round.number,
    id: round.id,
    threadUrl: round.chat?.threadUrl ?? null,
    model: round.chat?.model ?? null,
    reasoning: round.chat?.effort ?? null,
    assistantTurn: round.chat?.assistantTurn ?? null,
    configurationVerification:
      round.chat?.configurationVerification ?? null,
    transferMode: round.chat?.transferMode ?? state.execution?.transferMode ?? null,
  }));
  const roundValidations = state.rounds.map(
    roundValidationSummary,
  );
  const frameworkCheck = checkFromRound(
    frameworkRound,
    "framework-dimensions",
  );
  const wordBudgetCheck = checkFromRound(
    finalRound,
    "main-text-word-budget",
  );
  const appendixCheck = checkFromRound(
    finalRound,
    "appendix-policy",
  );
  const validationStatus = roundValidations.some(
    (item) => item.status === "failed",
  )
    ? "failed"
    : roundValidations.every(
          (item) => item.status === "passed",
        )
      ? "passed"
      : "incomplete";
  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    runId: state.runId,
    workflow: state.workflow,
    workflowVersion: state.workflowVersion,
    runtimeVersions: state.runtimeVersions,
    configuration: state.config,
    execution: state.execution,
    inputs: inputEntries,
    deliverables: await Promise.all(
      [...new Set(finalFiles)].map((target) =>
        fileManifestEntry(target, state.runPath),
      ),
    ),
    chats: chatRounds,
    validation: {
      status: validationStatus,
      latest: state.validation,
      rounds: roundValidations,
    },
    configurationCompliance: {
      paperType: state.config?.styleId ?? null,
      promptLanguage: state.config?.language ?? null,
      mainTextWordBudget: wordBudgetCheck,
      appendix: appendixCheck,
      frameworkCanvas: frameworkCheck,
      requestedReasoning:
        state.config?.chatExecution?.reasoningPreference ?? null,
      actualReasoning: chatRounds.map((item) => ({
        round: item.round,
        model: item.model,
        reasoning: item.reasoning,
      })),
      transferMode:
        state.execution?.transferMode ?? null,
      fallbackReason:
        state.execution?.fallbackReason ?? null,
    },
    revisions: state.rounds.flatMap((round) =>
      (round.revisions ?? []).map((revision) => ({
        round: round.number,
        ...revision,
      })),
    ),
    checksums: {
      algorithm: "SHA-256",
      manifestContentHash: createHash("sha256")
        .update(
          JSON.stringify({
            inputs: inputEntries,
            outputs: finalFiles.map((target) =>
              path.relative(state.runPath, target),
            ),
          }),
        )
        .digest("hex"),
    },
  };
}
