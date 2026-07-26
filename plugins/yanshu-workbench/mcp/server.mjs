#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import {
  compileRound,
  completeRound,
  getEvidenceIndex,
  getRoundManifest,
  readPdfText,
  readTextArtifact,
  searchPdf,
  viewImageArtifact,
  workspaceCapabilities,
  writeRoundArtifact,
} from "../scripts/lib/mcp-workspace.mjs";

const pluginRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const pluginManifest = JSON.parse(
  await readFile(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"),
);
const SERVER_NAME = "YanShu Paper Workspace";
const SERVER_VERSION = pluginManifest.version;
const DEFAULT_PROTOCOL_VERSION = "2025-11-25";
const MAX_HTTP_BODY_BYTES = 4 * 1024 * 1024;

const JsonRpcError = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
};

function objectSchema(properties, required = []) {
  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

function stringProperty(description) {
  return { type: "string", minLength: 1, description };
}

function runProperty(boundRunPath) {
  return boundRunPath
    ? {}
    : {
        runPath: stringProperty(
          "Absolute path to the authorized YanShu reconstruction run.",
        ),
      };
}

function runRequired(boundRunPath) {
  return boundRunPath ? [] : ["runPath"];
}

export function toolDefinitions(boundRunPath = null) {
  const runProperties = runProperty(boundRunPath);
  const requiredRun = runRequired(boundRunPath);
  return [
    {
      name: "yanshu_get_round_manifest",
      title: "Open YanShu Round",
      description:
        "Start or resume a YanShu round. Returns the exact round Prompt and only the latest necessary TeX/Bib/PDF/framework-figure artifact IDs plus the evidence policy. It does not accumulate superseded rounds or figures already represented by a usable PDF. Call this before reading or writing anything.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description:
              "Round id or number. Omit to use the first incomplete round.",
          },
        },
        requiredRun,
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_read_text",
      title: "Read YanShu Text Artifact",
      description:
        "Read an approved Prompt, TeX, BibTeX, report, table data, or compile log by artifact ID. Supports deterministic chunks for long files.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          artifactId: stringProperty(
            "Artifact ID returned by yanshu_get_round_manifest.",
          ),
          offset: {
            type: "integer",
            minimum: 0,
            default: 0,
            description: "Character offset for chunked reading.",
          },
          maxChars: {
            type: "integer",
            minimum: 1000,
            maximum: 60000,
            default: 40000,
            description: "Maximum characters to return.",
          },
        },
        [...requiredRun, "artifactId"],
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_get_evidence_index",
      title: "Index Paper Figures and Tables",
      description:
        "Parse the latest approved TeX into a figure/table evidence index with labels, captions, sections, table TeX, and resolvable image artifact IDs. Call before revising Method, Experiments, Discussion, or claims.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
        },
        requiredRun,
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_view_image",
      title: "View Paper Figure or PDF Page",
      description:
        "Return one approved raster figure, SVG, rendered PDF page, or rendered EPS figure as actual image content. Use it for every result-bearing visual; never rely only on filenames or captions.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          artifactId: stringProperty(
            "Figure or PDF artifact ID from the manifest/evidence index.",
          ),
          page: {
            type: "integer",
            minimum: 1,
            default: 1,
            description: "One-based PDF page. Ignored for ordinary images.",
          },
        },
        [...requiredRun, "artifactId"],
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_read_pdf_text",
      title: "Read Paper PDF Pages",
      description:
        "Extract layout-preserving text from up to eight approved PDF pages. Use TeX as the terminology authority and PDF text to locate rendered tables, captions, and page context.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          artifactId: stringProperty("Approved PDF artifact ID."),
          startPage: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          endPage: {
            type: "integer",
            minimum: 1,
            description:
              "Inclusive final page; the server caps one call at eight pages.",
          },
        },
        [...requiredRun, "artifactId"],
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_search_pdf",
      title: "Locate Evidence in Paper PDF",
      description:
        "Search an approved PDF for a figure label, table label, section title, metric, dataset, or other exact phrase and return matching page numbers and excerpts. Follow with yanshu_view_image for visual inspection.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          artifactId: stringProperty("Approved PDF artifact ID."),
          query: stringProperty("Exact label or phrase to locate."),
          maxMatches: {
            type: "integer",
            minimum: 1,
            maximum: 50,
            default: 20,
          },
        },
        [...requiredRun, "artifactId", "query"],
      ),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_write_round_artifact",
      title: "Save YanShu Round Artifact",
      description:
        "Atomically save a complete TeX, BibTeX, report, or structured text artifact inside the current round. Original paper files are never overwritten; replacements are versioned and recoverable.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          fileName: stringProperty(
            "Relative output filename, for example paper_round_2.tex or report_zh.md.",
          ),
          content: {
            type: "string",
            description:
              "Complete artifact content, up to 2 MB. Do not send a diff.",
          },
        },
        [...requiredRun, "round", "fileName", "content"],
      ),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_compile_latex",
      title: "Compile YanShu LaTeX",
      description:
        "Compile an approved TeX artifact in an isolated, versioned workspace using the fixed local LaTeX toolchain. Returns the PDF artifact ID or a focused log tail for correction.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          texArtifactId: {
            type: "string",
            minLength: 1,
            description:
              "Approved TeX artifact ID. Omit to compile the latest current-round TeX.",
          },
          engine: {
            type: "string",
            enum: ["auto", "pdflatex", "xelatex", "lualatex"],
            default: "auto",
          },
        },
        [...requiredRun, "round"],
      ),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    {
      name: "yanshu_complete_round",
      title: "Complete YanShu Round",
      description:
        "Finalize the current round only after the complete TeX, report, complete current BibTeX, and compiled PDF exist (or the Round 4 image exists). Verifies that the BibTeX preserves every prior key and that manuscript TeX compiled successfully, then returns the next round identity for a clean new Chat conversation.",
      inputSchema: objectSchema(
        {
          ...runProperties,
          round: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Current round id or number.",
          },
          note: {
            type: "string",
            maxLength: 2000,
            description: "Optional concise handoff note.",
          },
        },
        [...requiredRun, "round"],
      ),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
  ];
}

function toolText(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
    structuredContent: value,
  };
}

function scopeArguments(boundRunPath, args) {
  if (!boundRunPath) {
    if (typeof args.runPath !== "string" || !args.runPath.trim()) {
      throw new Error("runPath is required.");
    }
    return { ...args, runPath: path.resolve(args.runPath) };
  }
  if (
    args.runPath &&
    path.resolve(args.runPath) !== path.resolve(boundRunPath)
  ) {
    throw new Error("This MCP session is bound to a different YanShu run.");
  }
  return { ...args, runPath: boundRunPath };
}

export async function callTool(name, rawArgs = {}, boundRunPath = null) {
  const args = scopeArguments(boundRunPath, rawArgs ?? {});
  switch (name) {
    case "yanshu_get_round_manifest": {
      const value = await getRoundManifest(args.runPath, args.round);
      return toolText({
        ...value,
        localCapabilities: workspaceCapabilities(),
      });
    }
    case "yanshu_read_text": {
      const value = await readTextArtifact({
        runPath: args.runPath,
        round: args.round,
        artifactId: args.artifactId,
        offset: args.offset,
        maxChars: args.maxChars,
      });
      const { content, ...metadata } = value;
      return {
        structuredContent: metadata,
        content: [
          {
            type: "text",
            text: [
              `YanShu artifact ${value.artifact.name}`,
              `Characters ${value.offset}–${value.offset + content.length} of ${value.totalChars}`,
              value.complete
                ? "This is the final chunk."
                : `Continue at offset ${value.nextOffset}.`,
              "",
              content,
            ].join("\n"),
          },
        ],
      };
    }
    case "yanshu_get_evidence_index":
      return toolText(await getEvidenceIndex(args.runPath, args.round));
    case "yanshu_view_image": {
      const value = await viewImageArtifact({
        runPath: args.runPath,
        round: args.round,
        artifactId: args.artifactId,
        page: args.page,
      });
      const metadata = {
        artifact: value.artifact,
        page: value.page,
        pageCount: value.pageCount,
        mimeType: value.mimeType,
      };
      return {
        structuredContent: metadata,
        content: [
          {
            type: "text",
            text: `Visual evidence: ${value.artifact.name}${
              value.page ? `, page ${value.page} of ${value.pageCount}` : ""
            }. Inspect the pixels directly; do not infer unsupported values.`,
          },
          {
            type: "image",
            data: value.bytes.toString("base64"),
            mimeType: value.mimeType,
          },
        ],
      };
    }
    case "yanshu_read_pdf_text":
      return toolText(
        await readPdfText({
          runPath: args.runPath,
          round: args.round,
          artifactId: args.artifactId,
          startPage: args.startPage,
          endPage: args.endPage,
        }),
      );
    case "yanshu_search_pdf":
      return toolText(
        await searchPdf({
          runPath: args.runPath,
          round: args.round,
          artifactId: args.artifactId,
          query: args.query,
          maxMatches: args.maxMatches,
        }),
      );
    case "yanshu_write_round_artifact":
      return toolText(
        await writeRoundArtifact({
          runPath: args.runPath,
          round: args.round,
          fileName: args.fileName,
          content: args.content,
        }),
      );
    case "yanshu_compile_latex":
      return toolText(
        await compileRound({
          runPath: args.runPath,
          round: args.round,
          texArtifactId: args.texArtifactId,
          engine: args.engine,
        }),
      );
    case "yanshu_complete_round":
      return toolText(
        await completeRound({
          runPath: args.runPath,
          round: args.round,
          note: args.note,
        }),
      );
    default:
      throw new Error(`Unknown YanShu tool: ${name}`);
  }
}

function resultMessage(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function errorMessage(id, code, message, data) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      ...(data === undefined ? {} : { data }),
    },
  };
}

export async function handleJsonRpc(message, { boundRunPath = null } = {}) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return errorMessage(null, JsonRpcError.INVALID_REQUEST, "Invalid request.");
  }
  const { id, method, params } = message;
  if (typeof method !== "string") {
    return errorMessage(
      id ?? null,
      JsonRpcError.INVALID_REQUEST,
      "Method is required.",
    );
  }

  if (method === "initialize") {
    return resultMessage(id, {
      protocolVersion:
        params?.protocolVersion ?? DEFAULT_PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      instructions:
        "Work only inside the authorized YanShu run. Begin with yanshu_get_round_manifest and read its Prompt. Before Method, Experiments, Discussion, or numeric claims, index tables/figures and inspect every relevant image or rendered PDF page. Save complete artifacts, compile and correct TeX, then complete the round. Original sources are read-only.",
    });
  }
  if (method === "ping") return resultMessage(id, {});
  if (method === "tools/list") {
    return resultMessage(id, { tools: toolDefinitions(boundRunPath) });
  }
  if (method === "tools/call") {
    if (!params || typeof params.name !== "string") {
      return errorMessage(
        id,
        JsonRpcError.INVALID_PARAMS,
        "tools/call requires a tool name.",
      );
    }
    try {
      return resultMessage(
        id,
        await callTool(
          params.name,
          params.arguments ?? {},
          boundRunPath,
        ),
      );
    } catch (error) {
      return resultMessage(id, {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : String(error),
          },
        ],
        structuredContent: {
          ok: false,
          error: {
            name: error?.name ?? "Error",
            code: error?.code ?? "tool_error",
            message:
              error instanceof Error
                ? error.message
                : String(error),
          },
        },
      });
    }
  }
  if (method.startsWith("notifications/")) return null;
  return errorMessage(
    id ?? null,
    JsonRpcError.METHOD_NOT_FOUND,
    `Method not found: ${method}`,
  );
}

export function startStdioServer({ boundRunPath = null } = {}) {
  function send(message) {
    if (message !== null) {
      process.stdout.write(`${JSON.stringify(message)}\n`);
    }
  }
  const lines = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  lines.on("line", (line) => {
    if (!line.trim()) return;
    let message;
    try {
      message = JSON.parse(line.replace(/^\uFEFF/, ""));
    } catch {
      send(
        errorMessage(
          null,
          JsonRpcError.PARSE_ERROR,
          "Invalid JSON-RPC payload.",
        ),
      );
      return;
    }
    void handleJsonRpc(message, { boundRunPath }).then(send);
  });
  return lines;
}

async function readHttpJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_HTTP_BODY_BYTES) {
      throw new Error("MCP request body exceeds 4 MB.");
    }
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(
    Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, ""),
  );
}

async function writeStateFile(target, value) {
  if (!target) return;
  const resolved = path.resolve(target);
  await mkdir(path.dirname(resolved), { recursive: true });
  const temporary = path.join(
    path.dirname(resolved),
    `.${path.basename(resolved)}.${randomUUID()}.tmp`,
  );
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, resolved);
}

export async function startHttpServer({
  host = "127.0.0.1",
  port = 0,
  token = null,
  boundRunPath = null,
  stateFile = null,
} = {}) {
  const endpointPath = token ? `/mcp/${token}` : "/mcp";
  const server = createServer(async (request, response) => {
    const requestUrl = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? `${host}:${port}`}`,
    );
    if (requestUrl.pathname !== endpointPath) {
      response.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        Allow: "POST, GET, DELETE, OPTIONS",
      });
      response.end();
      return;
    }
    if (request.method === "GET") {
      response.writeHead(405, {
        Allow: "POST, DELETE",
        "Content-Type": "application/json; charset=utf-8",
      });
      response.end(
        JSON.stringify({
          error:
            "This stateless MCP endpoint accepts JSON-RPC over POST.",
        }),
      );
      return;
    }
    if (request.method === "DELETE") {
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify({ ok: true }));
      return;
    }
    if (request.method !== "POST") {
      response.writeHead(405, {
        Allow: "POST, GET, DELETE, OPTIONS",
      });
      response.end();
      return;
    }

    try {
      const payload = await readHttpJson(request);
      const messages = Array.isArray(payload) ? payload : [payload];
      const replies = (
        await Promise.all(
          messages.map((message) =>
            handleJsonRpc(message, { boundRunPath }),
          ),
        )
      ).filter(Boolean);
      if (replies.length === 0) {
        response.writeHead(202);
        response.end();
        return;
      }
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(
        JSON.stringify(Array.isArray(payload) ? replies : replies[0]),
      );
    } catch (error) {
      response.writeHead(400, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(
        JSON.stringify(
          errorMessage(
            null,
            JsonRpcError.PARSE_ERROR,
            error instanceof Error ? error.message : String(error),
          ),
        ),
      );
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
  const address = server.address();
  const actualPort =
    typeof address === "object" && address ? address.port : port;
  const localUrl = `http://${host}:${actualPort}${endpointPath}`;
  const state = {
    ok: true,
    transport: "streamable-http",
    pid: process.pid,
    host,
    port: actualPort,
    endpointPath,
    localUrl,
    runPath: boundRunPath,
    startedAt: new Date().toISOString(),
  };
  await writeStateFile(stateFile, state);
  return { server, state };
}

function parseServerArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const name = token.slice(2);
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith("--")) {
      values[name] = next;
      index += 1;
    } else {
      values[name] = true;
    }
  }
  return values;
}

async function main() {
  const flags = parseServerArgs(process.argv.slice(2));
  const transport =
    flags.transport === "http" || flags.http === true ? "http" : "stdio";
  const boundRunPath =
    typeof flags.run === "string" ? path.resolve(flags.run) : null;
  if (transport === "stdio") {
    startStdioServer({ boundRunPath });
    return;
  }
  const { state } = await startHttpServer({
    host: typeof flags.host === "string" ? flags.host : "127.0.0.1",
    port: Number(flags.port ?? 0),
    token: typeof flags.token === "string" ? flags.token : null,
    boundRunPath,
    stateFile:
      typeof flags["state-file"] === "string"
        ? flags["state-file"]
        : null,
  });
  process.stdout.write(`${JSON.stringify(state)}\n`);
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.stack : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
