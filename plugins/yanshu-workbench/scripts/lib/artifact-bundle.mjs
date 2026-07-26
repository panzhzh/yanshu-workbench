import { inflateRawSync } from "node:zlib";
import {
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { CliError } from "./cli.mjs";
import {
  commitArtifactsAtomically,
  pathExists,
} from "./run-store.mjs";
import { compareWorkflowVersions } from "./prompt-release.mjs";

const MAX_ARCHIVE_BYTES = 32 * 1024 * 1024;
const MAX_ENTRY_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_OUTPUT_BYTES = 20 * 1024 * 1024;
const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const SINGLE_DOWNLOAD_PROTOCOL_VERSION = "2026.07.7";

const ROUND_ARTIFACT_SUFFIXES = {
  "scientific-positioning": [
    "_round_1_scientific_structure.tex",
    "_round_1_report_zh.md",
    "_round_1_references.bib",
  ],
  "method-experiments": [
    "_round_2_method_experiments.tex",
    "_round_2_report_zh.md",
    "_round_2_references.bib",
  ],
  "narrative-reconstruction": [
    "_round_3_narrative_reconstruction.tex",
    "_round_3_report_zh.md",
    "_round_3_references.bib",
  ],
  "final-refinement": [
    "_round_5_final_refinement.tex",
    "_round_5_report_zh.md",
    "_round_5_references.bib",
  ],
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeDuplicateDownloadName(value) {
  let normalized = path.basename(String(value));
  let previous;
  do {
    previous = normalized;
    normalized = normalized
      .replace(/\s*\(\d+\)(?=\.[^.]+$)/u, "")
      .replace(/\s*\(\d+\)$/u, "");
  } while (normalized !== previous);
  return normalized;
}

export function artifactBundleSpec(round, workflowVersion) {
  const entrySuffixes = ROUND_ARTIFACT_SUFFIXES[round.id] ?? null;
  if (!entrySuffixes) {
    return {
      required: false,
      ...(round.id === "framework-figure"
        ? {
            directArtifactName:
              "<base_name>_round_4_framework_reconstruction.png",
            directArtifactSuffix:
              "_round_4_framework_reconstruction.png",
            filenamePattern:
              "^.+_round_4_framework_reconstruction(?:\\s*\\(\\d+\\))?\\.png(?:\\s*\\(\\d+\\))?$",
          }
        : {}),
      reason:
        round.id === "framework-figure"
          ? "Round 4 delivers one PNG directly."
          : "This round has no bundled text-artifact protocol.",
    };
  }
  if (
    workflowVersion &&
    compareWorkflowVersions(
      workflowVersion,
      SINGLE_DOWNLOAD_PROTOCOL_VERSION,
    ) < 0
  ) {
    return {
      required: false,
      reason:
        "This saved run predates the single-download bundle protocol; preserve its saved prompt and use the exact individual filenames recorded there.",
    };
  }
  const archiveSuffix = `_round_${round.number}_artifacts.zip`;
  return {
    required: true,
    archiveName: `<base_name>${archiveSuffix}`,
    archiveSuffix,
    filenamePattern: `^.+_round_${round.number}_artifacts(?:\\s*\\(\\d+\\))?\\.zip(?:\\s*\\(\\d+\\))?$`,
    entries: entrySuffixes.map((suffix) => `<base_name>${suffix}`),
  };
}

function findEndOfCentralDirectory(bytes) {
  const earliest = Math.max(0, bytes.length - 65_557);
  for (let cursor = bytes.length - 22; cursor >= earliest; cursor -= 1) {
    if (bytes.readUInt32LE(cursor) === EOCD_SIGNATURE) return cursor;
  }
  throw new CliError(
    "The downloaded artifact bundle is not a readable ZIP archive.",
    "invalid_artifact_bundle",
  );
}

let crcTable;

function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value =
        value & 1
          ? 0xedb88320 ^ (value >>> 1)
          : value >>> 1;
    }
    crcTable[index] = value >>> 0;
  }
  return crcTable;
}

function crc32(bytes) {
  const table = getCrcTable();
  let value = 0xffffffff;
  for (const byte of bytes) {
    value = table[(value ^ byte) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function decodeEntryName(bytes) {
  const value = bytes.toString("utf8");
  if (!value || value.includes("\uFFFD") || value.includes("\0")) {
    throw new CliError(
      "The artifact bundle contains an invalid filename.",
      "invalid_artifact_bundle",
    );
  }
  if (
    value.includes("/") ||
    value.includes("\\") ||
    value === "." ||
    value === ".." ||
    path.basename(value) !== value
  ) {
    throw new CliError(
      "Artifact bundle files must be placed directly at the ZIP root.",
      "unsafe_artifact_bundle",
    );
  }
  return value;
}

function parseZip(bytes) {
  const eocd = findEndOfCentralDirectory(bytes);
  const diskNumber = bytes.readUInt16LE(eocd + 4);
  const centralDisk = bytes.readUInt16LE(eocd + 6);
  const entriesOnDisk = bytes.readUInt16LE(eocd + 8);
  const entryCount = bytes.readUInt16LE(eocd + 10);
  const centralSize = bytes.readUInt32LE(eocd + 12);
  const centralOffset = bytes.readUInt32LE(eocd + 16);
  const commentLength = bytes.readUInt16LE(eocd + 20);

  if (
    diskNumber !== 0 ||
    centralDisk !== 0 ||
    entriesOnDisk !== entryCount ||
    entryCount === 0xffff ||
    centralSize === 0xffffffff ||
    centralOffset === 0xffffffff
  ) {
    throw new CliError(
      "Multi-volume and ZIP64 artifact bundles are not supported.",
      "unsupported_artifact_bundle",
    );
  }
  if (
    eocd + 22 + commentLength > bytes.length ||
    centralOffset + centralSize > eocd
  ) {
    throw new CliError(
      "The artifact bundle central directory is truncated.",
      "invalid_artifact_bundle",
    );
  }

  const entries = [];
  const seen = new Set();
  let cursor = centralOffset;
  let totalOutputBytes = 0;

  for (let index = 0; index < entryCount; index += 1) {
    if (
      cursor + 46 > bytes.length ||
      bytes.readUInt32LE(cursor) !== CENTRAL_SIGNATURE
    ) {
      throw new CliError(
        "The artifact bundle central directory is invalid.",
        "invalid_artifact_bundle",
      );
    }

    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const expectedCrc = bytes.readUInt32LE(cursor + 16);
    const compressedSize = bytes.readUInt32LE(cursor + 20);
    const uncompressedSize = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const extraLength = bytes.readUInt16LE(cursor + 30);
    const entryCommentLength = bytes.readUInt16LE(cursor + 32);
    const externalAttributes = bytes.readUInt32LE(cursor + 38);
    const localOffset = bytes.readUInt32LE(cursor + 42);
    const recordEnd =
      cursor + 46 + nameLength + extraLength + entryCommentLength;

    if (
      recordEnd > bytes.length ||
      compressedSize === 0xffffffff ||
      uncompressedSize === 0xffffffff ||
      localOffset === 0xffffffff
    ) {
      throw new CliError(
        "The artifact bundle contains an unsupported ZIP64 entry.",
        "unsupported_artifact_bundle",
      );
    }
    if (flags & 0x1) {
      throw new CliError(
        "Encrypted artifact bundles are not supported.",
        "unsupported_artifact_bundle",
      );
    }
    if (method !== 0 && method !== 8) {
      throw new CliError(
        `Unsupported ZIP compression method ${method}.`,
        "unsupported_artifact_bundle",
      );
    }
    if (uncompressedSize > MAX_ENTRY_BYTES) {
      throw new CliError(
        "An artifact bundle entry exceeds the size limit.",
        "artifact_bundle_too_large",
      );
    }

    const name = decodeEntryName(
      bytes.subarray(cursor + 46, cursor + 46 + nameLength),
    );
    const normalizedName = name.toLocaleLowerCase("en-US");
    if (seen.has(normalizedName)) {
      throw new CliError(
        `Duplicate artifact bundle entry: ${name}`,
        "invalid_artifact_bundle",
      );
    }
    seen.add(normalizedName);

    const unixMode = (externalAttributes >>> 16) & 0xffff;
    if ((unixMode & 0o170000) === 0o120000) {
      throw new CliError(
        "Symbolic links are not allowed in artifact bundles.",
        "unsafe_artifact_bundle",
      );
    }
    if (
      localOffset + 30 > bytes.length ||
      bytes.readUInt32LE(localOffset) !== LOCAL_SIGNATURE
    ) {
      throw new CliError(
        `Missing local ZIP header for ${name}.`,
        "invalid_artifact_bundle",
      );
    }
    const localNameLength = bytes.readUInt16LE(localOffset + 26);
    const localExtraLength = bytes.readUInt16LE(localOffset + 28);
    const dataStart =
      localOffset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > bytes.length) {
      throw new CliError(
        `Truncated ZIP data for ${name}.`,
        "invalid_artifact_bundle",
      );
    }

    const compressed = bytes.subarray(dataStart, dataEnd);
    let content;
    try {
      content =
        method === 0
          ? Buffer.from(compressed)
          : inflateRawSync(compressed, {
              maxOutputLength: MAX_ENTRY_BYTES,
            });
    } catch (error) {
      throw new CliError(
        `Could not decompress ${name}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        "invalid_artifact_bundle",
      );
    }
    if (
      content.length !== uncompressedSize ||
      crc32(content) !== expectedCrc
    ) {
      throw new CliError(
        `ZIP integrity validation failed for ${name}.`,
        "invalid_artifact_bundle",
      );
    }
    totalOutputBytes += content.length;
    if (totalOutputBytes > MAX_TOTAL_OUTPUT_BYTES) {
      throw new CliError(
        "The expanded artifact bundle exceeds the size limit.",
        "artifact_bundle_too_large",
      );
    }
    entries.push({ name, content });
    cursor = recordEnd;
  }

  if (cursor !== centralOffset + centralSize) {
    throw new CliError(
      "The artifact bundle central directory has unexpected trailing data.",
      "invalid_artifact_bundle",
    );
  }
  return entries;
}

function findRound(state, selector) {
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

function validateExpectedEntries(
  entries,
  round,
  bundlePath,
  workflowVersion,
) {
  const spec = artifactBundleSpec(round, workflowVersion);
  if (!spec.required) {
    throw new CliError(
      `Round ${round.number} does not use a ZIP artifact bundle.`,
      "artifact_bundle_not_applicable",
    );
  }

  const downloadedArchiveName = path.basename(bundlePath);
  const archiveName = normalizeDuplicateDownloadName(
    downloadedArchiveName,
  );
  if (
    !archiveName
      .toLocaleLowerCase("en-US")
      .endsWith(spec.archiveSuffix.toLocaleLowerCase("en-US"))
  ) {
    throw new CliError(
      `Expected a filename ending in ${spec.archiveSuffix}.`,
      "artifact_bundle_name_mismatch",
    );
  }
  const baseName = archiveName.slice(0, -spec.archiveSuffix.length);
  if (!baseName.trim()) {
    throw new CliError(
      "The artifact bundle filename is missing <base_name>.",
      "artifact_bundle_name_mismatch",
    );
  }

  const expectedNames = ROUND_ARTIFACT_SUFFIXES[round.id].map(
    (suffix) => `${baseName}${suffix}`,
  );
  const actualNames = entries.map((entry) => entry.name);
  if (
    actualNames.length !== expectedNames.length ||
    expectedNames.some((name) => !actualNames.includes(name))
  ) {
    throw new CliError(
      "The artifact bundle must contain exactly the three expected round files.",
      "artifact_bundle_contents_mismatch",
      {
        expected: expectedNames,
        actual: actualNames,
      },
    );
  }

  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (const entry of entries) {
    try {
      decoder.decode(entry.content);
    } catch {
      throw new CliError(
        `Artifact ${entry.name} is not valid UTF-8 text.`,
        "invalid_artifact_encoding",
      );
    }
  }
  return {
    expectedNames,
    archiveName,
    downloadedArchiveName,
  };
}

export async function importArtifactBundle({
  state,
  selector,
  bundlePath,
  replace = false,
  reason = "ChatGPT artifact bundle import",
  chatTurn = null,
}) {
  const round = findRound(state, selector);
  const source = path.resolve(bundlePath);
  if (!(await pathExists(source))) {
    throw new CliError(
      `Artifact bundle does not exist: ${source}`,
      "missing_artifact_bundle",
    );
  }
  const info = await stat(source);
  if (!info.isFile()) {
    throw new CliError(
      "Artifact bundle must be a ZIP file.",
      "invalid_artifact_bundle",
    );
  }
  if (info.size > MAX_ARCHIVE_BYTES) {
    throw new CliError(
      "The artifact bundle exceeds the size limit.",
      "artifact_bundle_too_large",
    );
  }

  const entries = parseZip(await readFile(source));
  const validated = validateExpectedEntries(
    entries,
    round,
    source,
    state.workflowVersion,
  );

  const temporaryDirectory = await mkdtemp(
    path.join(tmpdir(), "yanshu-artifact-bundle-"),
  );
  try {
    const transactionFiles = [
      {
        sourcePath: source,
        destinationName: validated.archiveName,
      },
    ];
    for (const entry of entries) {
      const temporaryFile = path.join(temporaryDirectory, entry.name);
      await writeFile(temporaryFile, entry.content);
      transactionFiles.push({
        sourcePath: temporaryFile,
        destinationName: entry.name,
      });
    }

    const transaction = await commitArtifactsAtomically(
      state,
      round.id,
      transactionFiles,
      {
        replace,
        reason,
        chatTurn,
      },
    );
    return {
      bundle: transaction.paths[0],
      artifacts: transaction.paths.slice(1),
      transactionId: transaction.transactionId,
      revisions: transaction.revisions,
      downloadedArchiveName: validated.downloadedArchiveName,
      canonicalArchiveName: validated.archiveName,
    };
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}
