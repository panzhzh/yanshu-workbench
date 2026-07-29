#!/usr/bin/env node

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  loadOnboardingState,
  writeOnboardingState,
} from "./lib/onboarding-store.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(scriptDirectory, "..");
const uiRoot = path.join(pluginRoot, "ui", "workflow-configuration");
const MAX_BODY_BYTES = 256 * 1024;

function sessionPathFromArgs(argv) {
  const index = argv.indexOf("--session");
  if (index < 0 || !argv[index + 1]) {
    throw new Error("Missing required option --session.");
  }
  return path.resolve(argv[index + 1]);
}

function responseHeaders(contentType) {
  return {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy":
      "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  };
}

function sendJson(response, statusCode, value) {
  response.writeHead(
    statusCode,
    responseHeaders("application/json; charset=utf-8"),
  );
  response.end(`${JSON.stringify(value)}\n`);
}

function sendText(response, statusCode, contentType, value) {
  response.writeHead(statusCode, responseHeaders(contentType));
  response.end(value);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Configuration payload is too large.");
      error.code = "payload_too_large";
      throw error;
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function tokenMatches(url, state) {
  return url.searchParams.get("token") === state.token;
}

function projectDisplayName(projectRoot) {
  const baseName = path.basename(projectRoot);
  return baseName || projectRoot;
}

async function main() {
  const sessionPath = sessionPathFromArgs(process.argv.slice(2));
  let state = await loadOnboardingState(sessionPath);
  const engine = await import(
    pathToFileURL(
      path.join(pluginRoot, "runtime", "skill-workflow-engine.mjs"),
    ).href,
  );
  if (!engine.CONFIGURABLE_SKILL_WORKFLOW_IDS.includes(state.workflowId)) {
    throw new Error(`Unsupported YanShu workflow: ${state.workflowId}`);
  }
  const model = engine.getSkillWorkflowConfigurationModel(state.workflowId);
  const initial = engine.buildSkillWorkflowConfiguration(
    state.workflowId,
    state.prefillWorkflow ?? {},
    state.uiLanguage ?? "zh",
  );
  let closing = false;

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(
        request.url ?? "/",
        "http://127.0.0.1",
      );
      state = await loadOnboardingState(sessionPath);

      if (
        requestUrl.pathname.startsWith("/api/") &&
        !tokenMatches(requestUrl, state)
      ) {
        sendJson(response, 403, {
          ok: false,
          error: "Invalid or expired onboarding token.",
        });
        return;
      }

      if (request.method === "GET" && requestUrl.pathname === "/") {
        sendText(
          response,
          200,
          "text/html; charset=utf-8",
          await readFile(path.join(uiRoot, "index.html"), "utf8"),
        );
        return;
      }
      if (request.method === "GET" && requestUrl.pathname === "/app.js") {
        sendText(
          response,
          200,
          "text/javascript; charset=utf-8",
          await readFile(path.join(uiRoot, "app.js"), "utf8"),
        );
        return;
      }
      if (request.method === "GET" && requestUrl.pathname === "/styles.css") {
        sendText(
          response,
          200,
          "text/css; charset=utf-8",
          await readFile(path.join(uiRoot, "styles.css"), "utf8"),
        );
        return;
      }
      if (
        request.method === "GET" &&
        requestUrl.pathname === "/api/bootstrap"
      ) {
        sendJson(response, 200, {
          ok: true,
          workflowId: state.workflowId,
          projectRoot: state.projectRoot,
          projectName: projectDisplayName(state.projectRoot),
          uiLanguage: state.uiLanguage,
          model,
          copy: engine.CONFIGURATION_UI_COPY,
          initial: {
            preferences: initial.preferences,
            promptLanguage: initial.promptLanguage,
            prompt: initial.prompt,
            selection: initial.selection,
          },
        });
        return;
      }
      if (
        request.method === "GET" &&
        requestUrl.pathname === "/api/status"
      ) {
        sendJson(response, 200, {
          ok: state.status !== "error",
          status: state.status,
          configurationReady: state.status === "confirmed",
          selection: state.selection,
          error: state.error,
        });
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/preview"
      ) {
        const body = await readJsonBody(request);
        const built = engine.buildSkillWorkflowConfiguration(
          state.workflowId,
          body.preferences ?? {},
          body.promptLanguage === "en" ? "en" : "zh",
        );
        sendJson(response, 200, { ok: true, ...built });
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/confirm"
      ) {
        if (state.status === "cancelled") {
          sendJson(response, 409, {
            ok: false,
            error: "This configuration session has already been cancelled.",
          });
          return;
        }
        const body = await readJsonBody(request);
        const built = engine.buildSkillWorkflowConfiguration(
          state.workflowId,
          body.preferences ?? {},
          body.promptLanguage === "en" ? "en" : "zh",
        );
        const configPath = path.join(
          sessionPath,
          "confirmed.yanshu-workflow.json",
        );
        const configuration = {
          ...built,
          source: "yanshu-local-workflow-configuration",
          createdAt: new Date().toISOString(),
          projectRoot: state.projectRoot,
          inputs: state.inputs ?? {},
          execution: {
            mode: "visible-chatgpt",
            startAuthorized: true,
          },
        };
        await writeFile(
          configPath,
          `${JSON.stringify(configuration, null, 2)}\n`,
          "utf8",
        );
        state.status = "confirmed";
        state.updatedAt = new Date().toISOString();
        state.configPath = configPath;
        state.selection = built.selection;
        await writeOnboardingState(sessionPath, state);
        sendJson(response, 200, {
          ok: true,
          status: state.status,
          selection: state.selection,
        });
        closing = true;
        setTimeout(() => server.close(), 1_200).unref();
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/cancel"
      ) {
        if (state.status !== "confirmed") {
          state.status = "cancelled";
          state.updatedAt = new Date().toISOString();
          state.configPath = null;
          state.selection = null;
          await writeOnboardingState(sessionPath, state);
        }
        sendJson(response, 200, {
          ok: true,
          status: state.status,
        });
        closing = true;
        setTimeout(() => server.close(), 400).unref();
        return;
      }

      sendJson(response, 404, { ok: false, error: "Not found." });
    } catch (error) {
      sendJson(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  server.listen(0, "127.0.0.1", async () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("YanShu could not determine the configuration port.");
    }
    state.status = "ready";
    state.updatedAt = new Date().toISOString();
    state.serverPid = process.pid;
    state.url = `http://127.0.0.1:${address.port}/?token=${state.token}`;
    await writeOnboardingState(sessionPath, state);
  });

  const shutdown = async (signal) => {
    if (!closing) {
      const latest = await loadOnboardingState(sessionPath);
      if (!["confirmed", "cancelled"].includes(latest.status)) {
        latest.status = "error";
        latest.updatedAt = new Date().toISOString();
        latest.error = {
          code: "workflow_configuration_interrupted",
          message: `YanShu configuration server stopped by ${signal}.`,
        };
        await writeOnboardingState(sessionPath, latest);
      }
    }
    server.close();
  };
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));
}

main().catch(async (error) => {
  try {
    const sessionPath = sessionPathFromArgs(process.argv.slice(2));
    const state = await loadOnboardingState(sessionPath);
    state.status = "error";
    state.updatedAt = new Date().toISOString();
    state.error = {
      code: error?.code ?? "workflow_configuration_server_error",
      message: error instanceof Error ? error.message : String(error),
    };
    await writeOnboardingState(sessionPath, state);
  } catch {
    // The parent launcher reports start failures when state cannot be updated.
  }
  process.exitCode = 1;
});
