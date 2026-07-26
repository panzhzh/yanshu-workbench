import { createHash, randomUUID } from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { CliError } from "./cli.mjs";
import {
  loadRun,
  markRound,
  nextRound,
  pathExists,
  roundMaterials,
  saveRun,
} from "./run-store.mjs";
import {
  runPortableTool,
  toolAvailable,
} from "./process-tools.mjs";

const MAX_MANIFEST_FILES = 512;
const MAX_TEXT_CHARS = 60_000;
const MAX_WRITE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_PDF_PAGES_PER_READ = 8;

const TEXT_EXTENSIONS = new Set([
  ".tex",
  ".bib",
  ".md",
  ".txt",
  ".sty",
  ".cls",
  ".bst",
  ".bbx",
  ".cbx",
  ".csv",
  ".tsv",
  ".json",
  ".log",
]);
const FIGURE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".pdf",
  ".eps",
  ".svg",
]);
const WRITABLE_EXTENSIONS = new Set([
  ".tex",
  ".bib",
  ".md",
  ".txt",
  ".json",
  ".csv",
  ".tsv",
]);
const COMPILATION_EXTENSIONS = new Set([
  ".tex",
  ".bib",
  ".bst",
  ".cls",
  ".sty",
  ".bbx",
  ".cbx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".pdf",
  ".eps",
  ".svg",
  ".csv",
  ".tsv",
  ".dat",
]);
const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".svn",
  ".hg",
  "node_modules",
  "yanshu-reconstruction",
  "__pycache__",
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function isWithin(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== ".." &&
      !path.isAbsolute(relative))
  );
}

function relativeDisplayPath(state, target) {
  if (isWithin(state.runPath, target)) {
    return `run/${path.relative(state.runPath, target).split(path.sep).join("/")}`;
  }
  if (isWithin(state.projectRoot, target)) {
    return `paper/${path
      .relative(state.projectRoot, target)
      .split(path.sep)
      .join("/")}`;
  }
  return `approved/${path.basename(target)}`;
}

function artifactId(state, target) {
  const scope = isWithin(state.runPath, target)
    ? `run:${path.relative(state.runPath, target)}`
    : isWithin(state.projectRoot, target)
      ? `paper:${path.relative(state.projectRoot, target)}`
      : `approved:${path.resolve(target)}`;
  return `art_${sha256(scope).slice(0, 24)}`;
}

function mimeTypeFor(target) {
  switch (path.extname(target).toLowerCase()) {
    case ".tex":
      return "application/x-tex";
    case ".bib":
      return "application/x-bibtex";
    case ".md":
      return "text/markdown";
    case ".txt":
    case ".log":
      return "text/plain";
    case ".json":
      return "application/json";
    case ".csv":
      return "text/csv";
    case ".tsv":
      return "text/tab-separated-values";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".eps":
      return "application/postscript";
    default:
      return "application/octet-stream";
  }
}

function kindFor(target, role) {
  if (role === "round-prompt") return "prompt";
  const extension = path.extname(target).toLowerCase();
  if (extension === ".tex") return "tex";
  if (extension === ".bib") return "bib";
  if (extension === ".pdf") return "pdf";
  if (FIGURE_EXTENSIONS.has(extension)) return "figure";
  if (TEXT_EXTENSIONS.has(extension)) return "text";
  return "file";
}

function roundFor(state, selector) {
  const requested =
    selector === undefined || selector === null || selector === ""
      ? nextRound(state)?.id
      : selector;
  const round = state.rounds.find(
    (candidate) =>
      candidate.id === requested ||
      String(candidate.number) === String(requested),
  );
  if (!round) {
    throw new CliError(
      requested
        ? `Unknown YanShu round: ${requested}`
        : "This YanShu run has no remaining round.",
      "unknown_round",
    );
  }
  return round;
}

async function walkFiles(
  target,
  {
    extensions,
    limit = MAX_MANIFEST_FILES,
    skipRunPath = null,
    collected = [],
  } = {},
) {
  if (!target || collected.length >= limit || !(await pathExists(target))) {
    return collected;
  }
  const info = await stat(target);
  if (info.isFile()) {
    const extension = path.extname(target).toLowerCase();
    if (!extensions || extensions.has(extension)) collected.push(target);
    return collected;
  }
  if (!info.isDirectory()) return collected;

  const entries = await readdir(target, { withFileTypes: true });
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const child = path.join(target, entry.name);
    if (
      entry.isDirectory() &&
      (SKIPPED_DIRECTORIES.has(entry.name) ||
        entry.name.startsWith(".") ||
        (skipRunPath && isWithin(skipRunPath, child)))
    ) {
      continue;
    }
    await walkFiles(child, {
      extensions,
      limit,
      skipRunPath,
      collected,
    });
    if (collected.length >= limit) break;
  }
  return collected;
}

async function buildManifestInternal(runPath, selector) {
  const state = await loadRun(runPath);
  const round = roundFor(state, selector);
  const artifacts = new Map();

  async function add(target, metadata) {
    if (!target || !(await pathExists(target))) return;
    const resolved = path.resolve(target);
    const info = await stat(resolved);
    if (!info.isFile()) return;
    const id = artifactId(state, resolved);
    const existing = artifacts.get(id);
    if (existing) {
      existing.roles = [...new Set([...existing.roles, metadata.role])];
      return;
    }
    artifacts.set(id, {
      id,
      name: path.basename(resolved),
      displayPath: relativeDisplayPath(state, resolved),
      kind: kindFor(resolved, metadata.role),
      mimeType: mimeTypeFor(resolved),
      sizeBytes: info.size,
      source: metadata.source,
      roles: [metadata.role],
      roundNumber: metadata.roundNumber ?? null,
      absolutePath: resolved,
    });
  }

  const promptPath = path.join(state.runPath, round.promptPath);
  await add(promptPath, { source: "run", role: "round-prompt" });
  for (const material of await roundMaterials(state, round.id)) {
    for (const role of material.roles) {
      await add(material.path, {
        source: material.source,
        role,
        roundNumber: material.roundNumber,
      });
    }
  }

  for (const relative of round.outputs ?? []) {
    const output = path.resolve(state.runPath, relative);
    if (!isWithin(state.runPath, output)) continue;
    await add(output, {
      source: "round-output",
      role: "current-round-output",
      roundNumber: round.number,
    });
  }
  const logFiles = await walkFiles(
    path.join(state.runPath, round.directory, "logs"),
    {
      extensions: new Set([".log"]),
      limit: 24,
    },
  );
  for (const logFile of logFiles) {
    await add(logFile, {
      source: "run",
      role: "compile-log",
      roundNumber: round.number,
    });
  }

  const items = [...artifacts.values()].sort((left, right) => {
    const sourceRank = {
      run: 0,
      "round-output": 1,
      original: 2,
    };
    return (
      (sourceRank[left.source] ?? 9) - (sourceRank[right.source] ?? 9) ||
      (right.roundNumber ?? 0) - (left.roundNumber ?? 0) ||
      left.displayPath.localeCompare(right.displayPath)
    );
  });
  return { state, round, artifacts: items };
}

function publicArtifact(artifact) {
  const { absolutePath: _absolutePath, ...publicValue } = artifact;
  return publicValue;
}

export async function getRoundManifest(runPath, selector) {
  const { state, round, artifacts } = await buildManifestInternal(
    runPath,
    selector,
  );
  const prompt = artifacts.find((item) => item.roles.includes("round-prompt"));
  return {
    runId: state.runId,
    workflow: state.workflow,
    round: {
      id: round.id,
      number: round.number,
      title: round.title,
      purpose: round.purpose,
      status: round.status,
    },
    promptArtifactId: prompt?.id ?? null,
    artifacts: artifacts.map(publicArtifact),
    evidencePolicy: {
      texAuthority:
        "Use TeX for exact terminology, equations, labels, citations, and manuscript structure.",
      visualEvidence:
        "Before writing or revising experiments, call get_evidence_index, then inspect every result-bearing figure and every relevant PDF page. Never infer numeric results from a filename or caption alone.",
      pdfRole:
        "Use the compiled PDF for page layout, rendered tables, visual consistency, and material not reliably recoverable from TeX text.",
    },
  };
}

async function resolveArtifact(runPath, selector, requestedId) {
  if (typeof requestedId !== "string" || !requestedId.trim()) {
    throw new CliError("artifactId must be a non-empty string.");
  }
  const manifest = await buildManifestInternal(runPath, selector);
  const artifact = manifest.artifacts.find(
    (candidate) => candidate.id === requestedId,
  );
  if (!artifact) {
    throw new CliError(
      `Artifact is not approved for this round: ${requestedId}`,
      "unapproved_artifact",
    );
  }
  return { ...manifest, artifact };
}

export async function readTextArtifact({
  runPath,
  round,
  artifactId: requestedId,
  offset = 0,
  maxChars = 40_000,
}) {
  const { artifact } = await resolveArtifact(runPath, round, requestedId);
  if (!TEXT_EXTENSIONS.has(path.extname(artifact.absolutePath).toLowerCase())) {
    throw new CliError(
      `${artifact.name} is not a text artifact. Use a PDF or image tool instead.`,
      "unsupported_artifact_type",
    );
  }
  const normalizedOffset = Math.max(0, Number(offset) || 0);
  const normalizedLimit = Math.min(
    MAX_TEXT_CHARS,
    Math.max(1_000, Number(maxChars) || 40_000),
  );
  const text = await readFile(artifact.absolutePath, "utf8");
  const content = text.slice(
    normalizedOffset,
    normalizedOffset + normalizedLimit,
  );
  const nextOffset = normalizedOffset + content.length;
  return {
    artifact: publicArtifact(artifact),
    offset: normalizedOffset,
    nextOffset: nextOffset < text.length ? nextOffset : null,
    complete: nextOffset >= text.length,
    totalChars: text.length,
    sha256: sha256(text),
    content,
  };
}

function stripLatexComments(text) {
  return text
    .split(/\r?\n/)
    .map((line) => {
      for (let index = 0; index < line.length; index += 1) {
        if (line[index] !== "%") continue;
        let slashes = 0;
        for (let cursor = index - 1; cursor >= 0 && line[cursor] === "\\"; cursor -= 1) {
          slashes += 1;
        }
        if (slashes % 2 === 0) return line.slice(0, index);
      }
      return line;
    })
    .join("\n");
}

function balancedArgument(text, startIndex) {
  const open = text.indexOf("{", startIndex);
  if (open < 0) return null;
  let depth = 0;
  for (let index = open; index < text.length; index += 1) {
    if (text[index] === "{" && text[index - 1] !== "\\") depth += 1;
    if (text[index] === "}" && text[index - 1] !== "\\") depth -= 1;
    if (depth === 0) {
      return { value: text.slice(open + 1, index), end: index + 1 };
    }
  }
  return null;
}

function commandArgument(text, command) {
  const matcher = new RegExp(`\\\\${command}(?:\\s*\\[[^\\]]*\\])?\\s*\\{`, "i");
  const match = matcher.exec(text);
  return match ? balancedArgument(text, match.index) : null;
}

function plainLatex(value) {
  return (value ?? "")
    .replace(/\\(?:textbf|textit|emph|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\(?:cite|ref|eqref|autoref)\s*\{[^{}]*\}/g, "")
    .replace(/\\[a-zA-Z@]+\*?(?:\[[^\]]*\])?/g, "")
    .replace(/[{}~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionMarkers(text) {
  const markers = [];
  const matcher =
    /\\(section|subsection|subsubsection|paragraph)\*?\s*\{([^{}]*)\}/g;
  for (const match of text.matchAll(matcher)) {
    markers.push({
      index: match.index,
      level: match[1],
      title: plainLatex(match[2]),
    });
  }
  return markers;
}

function sectionAt(markers, index) {
  const active = {};
  for (const marker of markers) {
    if (marker.index > index) break;
    active[marker.level] = marker.title;
    if (marker.level === "section") {
      delete active.subsection;
      delete active.subsubsection;
      delete active.paragraph;
    } else if (marker.level === "subsection") {
      delete active.subsubsection;
      delete active.paragraph;
    } else if (marker.level === "subsubsection") {
      delete active.paragraph;
    }
  }
  return active;
}

function environmentBlocks(text, environment) {
  const matcher = new RegExp(
    `\\\\begin\\{${environment}\\*?\\}([\\s\\S]*?)\\\\end\\{${environment}\\*?\\}`,
    "g",
  );
  return [...text.matchAll(matcher)].map((match) => ({
    index: match.index,
    content: match[1],
    full: match[0],
  }));
}

function includeGraphics(block) {
  return [
    ...block.matchAll(
      /\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^{}]+)\}/g,
    ),
  ].map((match) => match[1].trim());
}

function resolveGraphicArtifact(reference, texArtifact, artifacts) {
  const normalized = reference.replaceAll("/", path.sep);
  const candidates = [];
  const bases = [
    path.resolve(path.dirname(texArtifact.absolutePath), normalized),
  ];
  for (const base of bases) {
    if (path.extname(base)) candidates.push(base);
    else {
      for (const extension of FIGURE_EXTENSIONS) {
        candidates.push(`${base}${extension}`);
      }
    }
  }
  const exact = artifacts.find((artifact) =>
    candidates.some(
      (candidate) => path.resolve(candidate) === path.resolve(artifact.absolutePath),
    ),
  );
  if (exact) return exact;
  const referenceBase = path.basename(
    normalized,
    path.extname(normalized),
  ).toLowerCase();
  return artifacts.find(
    (artifact) =>
      artifact.kind === "figure" &&
      path
        .basename(artifact.absolutePath, path.extname(artifact.absolutePath))
        .toLowerCase() === referenceBase,
  );
}

function latestTexArtifacts(artifacts) {
  const tex = artifacts.filter((artifact) => artifact.kind === "tex");
  const roundOutputs = tex
    .filter((artifact) => artifact.source === "round-output")
    .sort((left, right) => (right.roundNumber ?? 0) - (left.roundNumber ?? 0));
  if (roundOutputs.length === 0) return tex;
  const latestRound = roundOutputs[0].roundNumber;
  const selected = roundOutputs.filter(
    (artifact) => artifact.roundNumber === latestRound,
  );
  const support = tex.filter(
    (artifact) =>
      artifact.source === "original" &&
      !artifact.roles.includes("primary-tex"),
  );
  return [...selected, ...support];
}

export async function getEvidenceIndex(runPath, selector) {
  const manifest = await buildManifestInternal(runPath, selector);
  const figures = [];
  const tables = [];
  const seenFigures = new Set();
  const seenTables = new Set();

  for (const texArtifact of latestTexArtifacts(manifest.artifacts)) {
    const raw = await readFile(texArtifact.absolutePath, "utf8");
    const text = stripLatexComments(raw);
    const markers = sectionMarkers(text);

    for (const block of environmentBlocks(text, "figure")) {
      const label = commandArgument(block.content, "label")?.value?.trim() ?? null;
      const caption = plainLatex(
        commandArgument(block.content, "caption")?.value,
      );
      const graphics = includeGraphics(block.content).map((reference) => {
        const resolved = resolveGraphicArtifact(
          reference,
          texArtifact,
          manifest.artifacts,
        );
        return {
          reference,
          artifactId: resolved?.id ?? null,
          artifactName: resolved?.name ?? null,
        };
      });
      const signature = `${label ?? ""}|${caption}|${graphics
        .map((item) => item.reference)
        .join("|")}`;
      if (seenFigures.has(signature)) continue;
      seenFigures.add(signature);
      figures.push({
        label,
        caption,
        section: sectionAt(markers, block.index),
        sourceArtifactId: texArtifact.id,
        sourceFile: texArtifact.name,
        graphics,
      });
    }

    for (const block of environmentBlocks(text, "table")) {
      const label = commandArgument(block.content, "label")?.value?.trim() ?? null;
      const caption = plainLatex(
        commandArgument(block.content, "caption")?.value,
      );
      const signature = `${label ?? ""}|${caption}`;
      if (seenTables.has(signature)) continue;
      seenTables.add(signature);
      tables.push({
        label,
        caption,
        section: sectionAt(markers, block.index),
        sourceArtifactId: texArtifact.id,
        sourceFile: texArtifact.name,
        texExcerpt:
          block.full.length > 3_000
            ? `${block.full.slice(0, 3_000)}\n% [truncated]`
            : block.full,
      });
    }
  }

  const referencedIds = new Set(
    figures.flatMap((figure) =>
      figure.graphics.map((graphic) => graphic.artifactId).filter(Boolean),
    ),
  );
  const unreferencedFigures = manifest.artifacts
    .filter(
      (artifact) =>
        artifact.roles.includes("paper-figure") && !referencedIds.has(artifact.id),
    )
    .map(publicArtifact);
  return {
    runId: manifest.state.runId,
    round: {
      id: manifest.round.id,
      number: manifest.round.number,
    },
    figures,
    tables,
    unreferencedFigures,
    instructions: [
      "Inspect every figure that carries experimental results; captions and filenames are navigation aids, not sufficient evidence.",
      "Read each TeX table excerpt and inspect the compiled PDF page when layout, symbols, highlighting, or embedded graphics affect interpretation.",
      "If a referenced graphic has no artifactId, report it as missing instead of inventing its content.",
    ],
  };
}

async function pdfMetadata(target) {
  const result = await runPortableTool("pdfinfo", {
    cwd: path.dirname(target),
    buildArgs: (mapPath) => [mapPath(target)],
    timeoutMs: 30_000,
  });
  if (!result.ok) {
    throw new CliError(
      `Unable to inspect PDF metadata: ${
        result.error?.message || result.stderr.trim() || "pdfinfo failed"
      }`,
      "pdf_tool_failed",
    );
  }
  const pages = Number(result.stdout.match(/^Pages:\s+(\d+)/im)?.[1] ?? 0);
  return {
    pages,
    title: result.stdout.match(/^Title:\s+(.+)$/im)?.[1]?.trim() || null,
    pageSize:
      result.stdout.match(/^Page size:\s+(.+)$/im)?.[1]?.trim() || null,
  };
}

export async function readPdfText({
  runPath,
  round,
  artifactId: requestedId,
  startPage = 1,
  endPage,
}) {
  const { artifact } = await resolveArtifact(runPath, round, requestedId);
  if (path.extname(artifact.absolutePath).toLowerCase() !== ".pdf") {
    throw new CliError(`${artifact.name} is not a PDF artifact.`);
  }
  const metadata = await pdfMetadata(artifact.absolutePath);
  const start = Math.max(1, Math.floor(Number(startPage) || 1));
  const requestedEnd = Math.floor(Number(endPage) || start);
  const end = Math.min(
    metadata.pages || requestedEnd,
    Math.max(start, requestedEnd),
    start + MAX_PDF_PAGES_PER_READ - 1,
  );
  if (metadata.pages && start > metadata.pages) {
    throw new CliError(
      `PDF page ${start} exceeds the ${metadata.pages}-page document.`,
    );
  }
  const result = await runPortableTool("pdftotext", {
    cwd: path.dirname(artifact.absolutePath),
    buildArgs: (mapPath) => [
      "-f",
      String(start),
      "-l",
      String(end),
      "-layout",
      mapPath(artifact.absolutePath),
      "-",
    ],
    timeoutMs: 60_000,
  });
  if (!result.ok) {
    throw new CliError(
      `Unable to extract PDF text: ${
        result.error?.message || result.stderr.trim() || "pdftotext failed"
      }`,
      "pdf_tool_failed",
    );
  }
  const pageTexts = result.stdout.split("\f");
  if (pageTexts.at(-1)?.trim() === "") pageTexts.pop();
  return {
    artifact: publicArtifact(artifact),
    metadata,
    startPage: start,
    endPage: end,
    pages: pageTexts.map((text, index) => ({
      page: start + index,
      text: text.trimEnd(),
    })),
  };
}

export async function searchPdf({
  runPath,
  round,
  artifactId: requestedId,
  query,
  maxMatches = 20,
}) {
  if (typeof query !== "string" || query.trim().length < 2) {
    throw new CliError("query must contain at least two characters.");
  }
  const { artifact } = await resolveArtifact(runPath, round, requestedId);
  if (path.extname(artifact.absolutePath).toLowerCase() !== ".pdf") {
    throw new CliError(`${artifact.name} is not a PDF artifact.`);
  }
  const metadata = await pdfMetadata(artifact.absolutePath);
  const result = await runPortableTool("pdftotext", {
    cwd: path.dirname(artifact.absolutePath),
    buildArgs: (mapPath) => ["-layout", mapPath(artifact.absolutePath), "-"],
    timeoutMs: 90_000,
  });
  if (!result.ok) {
    throw new CliError(
      `Unable to search PDF text: ${
        result.error?.message || result.stderr.trim() || "pdftotext failed"
      }`,
      "pdf_tool_failed",
    );
  }
  const needle = query.trim().toLocaleLowerCase();
  const matches = [];
  const pages = result.stdout.split("\f");
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const lines = pages[pageIndex].split(/\r?\n/);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      if (!lines[lineIndex].toLocaleLowerCase().includes(needle)) continue;
      matches.push({
        page: pageIndex + 1,
        excerpt: lines
          .slice(Math.max(0, lineIndex - 2), lineIndex + 3)
          .join("\n")
          .trim(),
      });
      if (matches.length >= Math.min(50, Math.max(1, maxMatches))) break;
    }
    if (matches.length >= Math.min(50, Math.max(1, maxMatches))) break;
  }
  return {
    artifact: publicArtifact(artifact),
    metadata,
    query: query.trim(),
    matches,
  };
}

async function renderPdfToPng(target, destination, page) {
  await mkdir(path.dirname(destination), { recursive: true });
  const prefix = destination.slice(0, -path.extname(destination).length);
  const result = await runPortableTool("pdftoppm", {
    cwd: path.dirname(target),
    buildArgs: (mapPath) => [
      "-f",
      String(page),
      "-l",
      String(page),
      "-singlefile",
      "-png",
      "-r",
      "144",
      mapPath(target),
      mapPath(prefix),
    ],
    timeoutMs: 90_000,
  });
  if (!result.ok || !(await pathExists(destination))) {
    throw new CliError(
      `Unable to render PDF page ${page}: ${
        result.error?.message || result.stderr.trim() || "pdftoppm failed"
      }`,
      "pdf_render_failed",
    );
  }
}

async function renderEpsToPng(target, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  const result = await runPortableTool("gs", {
    cwd: path.dirname(target),
    buildArgs: (mapPath) => [
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=pngalpha",
      "-r144",
      `-sOutputFile=${mapPath(destination)}`,
      mapPath(target),
    ],
    timeoutMs: 90_000,
  });
  if (!result.ok || !(await pathExists(destination))) {
    throw new CliError(
      `Unable to render EPS figure: ${
        result.error?.message || result.stderr.trim() || "Ghostscript failed"
      }`,
      "figure_render_failed",
    );
  }
}

export async function viewImageArtifact({
  runPath,
  round,
  artifactId: requestedId,
  page = 1,
}) {
  const { state, artifact } = await resolveArtifact(
    runPath,
    round,
    requestedId,
  );
  const extension = path.extname(artifact.absolutePath).toLowerCase();
  let renderedPath = artifact.absolutePath;
  let mimeType = mimeTypeFor(renderedPath);
  let pageCount = null;
  const normalizedPage = Math.max(1, Math.floor(Number(page) || 1));

  if (extension === ".pdf") {
    const metadata = await pdfMetadata(artifact.absolutePath);
    pageCount = metadata.pages;
    if (pageCount && normalizedPage > pageCount) {
      throw new CliError(
        `PDF page ${normalizedPage} exceeds the ${pageCount}-page document.`,
      );
    }
    renderedPath = path.join(
      state.runPath,
      "previews",
      artifact.id,
      `page-${String(normalizedPage).padStart(3, "0")}.png`,
    );
    if (!(await pathExists(renderedPath))) {
      await renderPdfToPng(
        artifact.absolutePath,
        renderedPath,
        normalizedPage,
      );
    }
    mimeType = "image/png";
  } else if (extension === ".eps") {
    renderedPath = path.join(
      state.runPath,
      "previews",
      artifact.id,
      "figure.png",
    );
    if (!(await pathExists(renderedPath))) {
      await renderEpsToPng(artifact.absolutePath, renderedPath);
    }
    mimeType = "image/png";
  } else if (![".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(extension)) {
    throw new CliError(
      `${artifact.name} cannot be viewed as an image.`,
      "unsupported_artifact_type",
    );
  }

  const bytes = await readFile(renderedPath);
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new CliError(
      `Rendered image is ${(bytes.length / 1024 / 1024).toFixed(
        1,
      )} MB; the MCP image limit is 8 MB. Reduce the source image or render it at a lower resolution.`,
      "image_too_large",
    );
  }
  return {
    artifact: publicArtifact(artifact),
    page: extension === ".pdf" ? normalizedPage : null,
    pageCount,
    mimeType,
    bytes,
  };
}

function safeOutputRelativePath(fileName) {
  if (typeof fileName !== "string" || !fileName.trim()) {
    throw new CliError("fileName must be a non-empty relative path.");
  }
  const portable = fileName.trim().replaceAll("\\", "/");
  const normalized = path.posix.normalize(portable);
  if (
    normalized === "." ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    normalized.startsWith("/") ||
    /^[a-zA-Z]:/.test(normalized) ||
    normalized.split("/").some((part) => !part || part.startsWith("."))
  ) {
    throw new CliError(
      "fileName must stay inside the current round output directory and may not use hidden path segments.",
      "unsafe_output_path",
    );
  }
  const extension = path.posix.extname(normalized).toLowerCase();
  if (!WRITABLE_EXTENSIONS.has(extension)) {
    throw new CliError(
      `Unsupported output extension ${extension || "(none)"}.`,
      "unsupported_output_type",
    );
  }
  return normalized;
}

function timestampId(now = new Date()) {
  return now
    .toISOString()
    .replace(/\.\d{3}Z$/, "z")
    .replaceAll(":", "")
    .replace("T", "-");
}

export async function writeRoundArtifact({
  runPath,
  round: selector,
  fileName,
  content,
}) {
  if (typeof content !== "string") {
    throw new CliError("content must be a string.");
  }
  const bytes = Buffer.byteLength(content, "utf8");
  if (bytes > MAX_WRITE_BYTES) {
    throw new CliError(
      `Artifact content exceeds the ${MAX_WRITE_BYTES / 1024 / 1024} MB write limit.`,
      "artifact_too_large",
    );
  }
  const state = await loadRun(runPath);
  const round = roundFor(state, selector);
  const relative = safeOutputRelativePath(fileName);
  const outputRoot = path.join(state.runPath, round.directory, "output");
  const destination = path.resolve(outputRoot, ...relative.split("/"));
  if (!isWithin(outputRoot, destination)) {
    throw new CliError("Output path escaped the round directory.");
  }
  await mkdir(path.dirname(destination), { recursive: true });

  const newHash = sha256(content);
  let previousVersion = null;
  if (await pathExists(destination)) {
    const current = await readFile(destination);
    if (sha256(current) === newHash) {
      return {
        changed: false,
        artifactId: artifactId(state, destination),
        fileName: relative,
        displayPath: relativeDisplayPath(state, destination),
        sha256: newHash,
        sizeBytes: bytes,
        previousVersion: null,
      };
    }
    previousVersion = path.join(
      outputRoot,
      ".versions",
      timestampId(),
      ...relative.split("/"),
    );
    await mkdir(path.dirname(previousVersion), { recursive: true });
    await rename(destination, previousVersion);
  }

  const temporary = path.join(
    path.dirname(destination),
    `.${path.basename(destination)}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporary, content, "utf8");
    await rename(temporary, destination);
  } catch (error) {
    if (previousVersion && !(await pathExists(destination))) {
      await rename(previousVersion, destination);
    }
    throw error;
  }

  const relativeToRun = path
    .relative(state.runPath, destination)
    .split(path.sep)
    .join("/");
  if (!round.outputs.includes(relativeToRun)) {
    round.outputs.push(relativeToRun);
  }
  round.updatedAt = new Date().toISOString();
  await saveRun(state);
  return {
    changed: true,
    artifactId: artifactId(state, destination),
    fileName: relative,
    displayPath: relativeDisplayPath(state, destination),
    sha256: newHash,
    sizeBytes: bytes,
    previousVersion: previousVersion
      ? relativeDisplayPath(state, previousVersion)
      : null,
  };
}

async function copyCompilationInputs(state, destination) {
  const files = await walkFiles(state.projectRoot, {
    extensions: COMPILATION_EXTENSIONS,
    skipRunPath: state.runPath,
    limit: 2_000,
  });
  for (const source of files) {
    const info = await stat(source);
    if (info.size > 64 * 1024 * 1024) continue;
    const relative = path.relative(state.projectRoot, source);
    const target = path.join(destination, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(source, target);
  }
}

function latestTexForRound(manifest, selectedId) {
  if (selectedId) {
    const selected = manifest.artifacts.find(
      (artifact) => artifact.id === selectedId,
    );
    if (!selected || selected.kind !== "tex") {
      throw new CliError(
        "texArtifactId must identify an approved TeX artifact.",
        "unapproved_artifact",
      );
    }
    return selected;
  }
  return (
    manifest.artifacts.find(
      (artifact) =>
        artifact.kind === "tex" &&
        artifact.roles.includes("current-round-output"),
    ) ??
    manifest.artifacts.find(
      (artifact) =>
        artifact.kind === "tex" && artifact.source === "round-output",
    ) ??
    manifest.artifacts.find(
      (artifact) =>
        artifact.kind === "tex" && artifact.roles.includes("primary-tex"),
    )
  );
}

function detectEngine(tex, requested) {
  if (requested && requested !== "auto") return requested;
  if (/\\usepackage(?:\[[^\]]*\])?\{fontspec\}|%!TEX program\s*=\s*xelatex/i.test(tex)) {
    return "xelatex";
  }
  if (/%!TEX program\s*=\s*lualatex/i.test(tex)) return "lualatex";
  return "pdflatex";
}

function logTail(value, maxChars = 24_000) {
  if (value.length <= maxChars) return value;
  return `[earlier output omitted]\n${value.slice(-maxChars)}`;
}

export async function compileRound({
  runPath,
  round: selector,
  texArtifactId,
  engine = "auto",
}) {
  if (!["auto", "pdflatex", "xelatex", "lualatex"].includes(engine)) {
    throw new CliError(`Unsupported TeX engine: ${engine}`);
  }
  const manifest = await buildManifestInternal(runPath, selector);
  const selected = latestTexForRound(manifest, texArtifactId);
  if (!selected) {
    throw new CliError("No approved TeX artifact is available to compile.");
  }
  const texContent = await readFile(selected.absolutePath, "utf8");
  const selectedEngine = detectEngine(texContent, engine);
  if (!toolAvailable("latexmk")) {
    throw new CliError(
      "latexmk is unavailable in the local environment or configured WSL distribution.",
      "latex_tool_missing",
    );
  }

  const buildId = timestampId();
  const roundRoot = path.join(
    manifest.state.runPath,
    manifest.round.directory,
  );
  const buildRoot = path.join(roundRoot, "builds", buildId);
  const workspace = path.join(buildRoot, "workspace");
  const out = path.join(buildRoot, "out");
  await mkdir(workspace, { recursive: true });
  await mkdir(out, { recursive: true });
  await copyCompilationInputs(manifest.state, workspace);

  for (const artifact of manifest.artifacts) {
    if (
      artifact.source !== "round-output" ||
      !COMPILATION_EXTENSIONS.has(
        path.extname(artifact.absolutePath).toLowerCase(),
      )
    ) {
      continue;
    }
    const target = path.join(workspace, artifact.name);
    await copyFile(artifact.absolutePath, target);
  }
  const targetTex = path.join(workspace, selected.name);
  await copyFile(selected.absolutePath, targetTex);

  const engineFlag =
    selectedEngine === "xelatex"
      ? "-xelatex"
      : selectedEngine === "lualatex"
        ? "-lualatex"
        : "-pdf";
  const result = await runPortableTool("latexmk", {
    cwd: workspace,
    buildArgs: (mapPath) => [
      engineFlag,
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-file-line-error",
      `-outdir=${mapPath(out)}`,
      mapPath(targetTex),
    ],
    timeoutMs: 180_000,
  });
  const combinedLog = [
    `YanShu build: ${buildId}`,
    `Engine: ${selectedEngine}`,
    `Backend: ${result.backend ?? "unavailable"}`,
    "",
    result.stdout,
    result.stderr,
    result.error?.stack ?? "",
  ]
    .filter(Boolean)
    .join("\n");
  const logPath = path.join(roundRoot, "logs", `compile-${buildId}.log`);
  await writeFile(logPath, `${combinedLog.trimEnd()}\n`, "utf8");

  const builtPdf = path.join(
    out,
    `${path.basename(selected.name, path.extname(selected.name))}.pdf`,
  );
  const success = result.ok && (await pathExists(builtPdf));
  let registeredPdf = null;
  if (success) {
    registeredPdf = path.join(
      roundRoot,
      "output",
      "compiled",
      `${path.basename(
        selected.name,
        path.extname(selected.name),
      )}.${buildId}.pdf`,
    );
    await mkdir(path.dirname(registeredPdf), { recursive: true });
    await copyFile(builtPdf, registeredPdf);
    const relative = path
      .relative(manifest.state.runPath, registeredPdf)
      .split(path.sep)
      .join("/");
    if (!manifest.round.outputs.includes(relative)) {
      manifest.round.outputs.push(relative);
    }
  }

  manifest.round.compilation = {
    status: success ? "passed" : "failed",
    buildId,
    engine: selectedEngine,
    texArtifactId: selected.id,
    pdfPath: registeredPdf
      ? relativeDisplayPath(manifest.state, registeredPdf)
      : null,
    logPath: relativeDisplayPath(manifest.state, logPath),
    updatedAt: new Date().toISOString(),
  };
  manifest.state.validation = {
    status: success ? "passed" : "failed",
    texPath: relativeDisplayPath(manifest.state, selected.absolutePath),
    logPath: relativeDisplayPath(manifest.state, logPath),
    updatedAt: new Date().toISOString(),
  };
  await saveRun(manifest.state);
  return {
    success,
    buildId,
    engine: selectedEngine,
    backend: result.backend,
    texArtifactId: selected.id,
    compiledPdfArtifactId: registeredPdf
      ? artifactId(manifest.state, registeredPdf)
      : null,
    compiledPdfPath: registeredPdf
      ? relativeDisplayPath(manifest.state, registeredPdf)
      : null,
    logPath: relativeDisplayPath(manifest.state, logPath),
    logTail: logTail(combinedLog),
  };
}

export async function completeRound({
  runPath,
  round: selector,
  note,
}) {
  const state = await loadRun(runPath);
  const round = roundFor(state, selector);
  const outputExtensions = new Set(
    (round.outputs ?? []).map((relative) =>
      path.extname(relative).toLowerCase(),
    ),
  );
  if (round.id === "framework-figure") {
    if (
      ![".png", ".jpg", ".jpeg", ".webp"].some((extension) =>
        outputExtensions.has(extension),
      )
    ) {
      throw new CliError(
        "The framework-figure round cannot complete until a readable image artifact is registered.",
        "missing_required_artifact",
      );
    }
  } else {
    if (!outputExtensions.has(".tex")) {
      throw new CliError(
        "This manuscript round cannot complete until a TeX artifact is saved.",
        "missing_required_artifact",
      );
    }
    if (round.compilation?.status !== "passed") {
      throw new CliError(
        "Compile the current TeX successfully before completing this round.",
        "compilation_required",
      );
    }
  }
  await markRound(state, round.id, {
    status: "completed",
    note: typeof note === "string" ? note.slice(0, 2_000) : undefined,
  });
  const upcoming = nextRound(state);
  return {
    completedRound: {
      id: round.id,
      number: round.number,
      outputs: round.outputs,
    },
    nextRound: upcoming
      ? {
          id: upcoming.id,
          number: upcoming.number,
          title: upcoming.title,
        }
      : null,
    runComplete: upcoming === null,
  };
}

export function workspaceCapabilities() {
  return {
    latexmk: toolAvailable("latexmk"),
    pdfinfo: toolAvailable("pdfinfo"),
    pdftotext: toolAvailable("pdftotext"),
    pdftoppm: toolAvailable("pdftoppm"),
    ghostscript: toolAvailable("gs"),
    imageFormats: {
      direct: ["png", "jpeg", "webp", "svg"],
      rendered: ["pdf", "eps"],
    },
  };
}
