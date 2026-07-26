#!/usr/bin/env node

import { createServer } from "node:http";
import {
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  loadOnboardingState,
  writeOnboardingState,
} from "./lib/onboarding-store.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(scriptDirectory, "..");
const uiRoot = path.join(pluginRoot, "ui", "onboarding");
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

function paperDisplayName(projectRoot) {
  const baseName = path.basename(projectRoot);
  if (baseName.toLowerCase() !== "paper") return baseName;
  return `${path.basename(path.dirname(projectRoot))} · ${baseName}`;
}

function localizedSelection(config, model) {
  const style = model.paperStyles[config.styleId];
  const ratio = model.frameworkFigure.aspectRatios.find(
    (item) => item.id === config.frameworkFigure.aspectRatioId,
  );
  const ratioLabel =
    ratio?.id === "custom"
      ? `${config.frameworkFigure.customAspectWidth}:${config.frameworkFigure.customAspectHeight}`
      : ratio?.ratio;
  return {
    styleId: config.styleId,
    styleLabel: style?.label,
    hasWordLimit: config.hasWordLimit,
    targetWords: config.hasWordLimit ? config.targetWords : null,
    unlimitedCoreSections:
      config.hasWordLimit && config.unlimitedCoreSections,
    includeAppendix: config.includeAppendix,
    promptLanguage: config.language,
    figureRatio: ratioLabel,
    reasoningPreference: config.chatExecution.reasoningPreference,
  };
}

function normalizedRequestedWorkflow(body, engine) {
  const requestedWorkflow = {
    ...(body.workflow ?? {}),
    unlimitedCoreSections:
      body.workflow?.hasWordLimit === false
        ? false
        : body.workflow?.unlimitedCoreSections,
  };
  return engine.buildReconstructionWorkflow(requestedWorkflow);
}

async function main() {
  const sessionPath = sessionPathFromArgs(process.argv.slice(2));
  let state = await loadOnboardingState(sessionPath);
  const engine = await import(
    pathToFileURL(
      path.join(pluginRoot, "runtime", "prompt-engine.mjs"),
    ).href
  );
  const configurationModel = engine.getReconstructionConfigurationModel();
  const initialWorkflow = engine.buildReconstructionWorkflow(
    state.prefillWorkflow ?? {},
  ).config;
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
          sessionId: state.sessionId,
          uiLanguage: state.uiLanguage,
          project: {
            name: paperDisplayName(state.projectRoot),
            path: state.projectRoot,
          },
          inputs: state.inputs,
          model: configurationModel,
          initialWorkflow,
          expiresAt: state.expiresAt,
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
          selection: state.selection,
          error: state.error,
        });
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/preview"
      ) {
        if (state.status !== "ready") {
          sendJson(response, 409, {
            ok: false,
            error: `Onboarding session is ${state.status}.`,
          });
          return;
        }
        const workflow = normalizedRequestedWorkflow(
          await readJsonBody(request),
          engine,
        );
        sendJson(response, 200, {
          ok: true,
          config: workflow.config,
          rounds: workflow.rounds.map((round) => ({
            id: round.id,
            number: round.number,
            language: round.language,
            title: round.title,
            purpose: round.purpose,
            prompt: round.prompt,
          })),
        });
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/confirm"
      ) {
        if (state.status === "confirmed") {
          sendJson(response, 200, {
            ok: true,
            status: state.status,
            selection: state.selection,
          });
          return;
        }
        if (state.status !== "ready") {
          sendJson(response, 409, {
            ok: false,
            error: `Onboarding session is ${state.status}.`,
          });
          return;
        }
        const body = await readJsonBody(request);
        const workflow = normalizedRequestedWorkflow(body, engine);
        const configPath = path.join(
          sessionPath,
          "confirmed.yanshu.json",
        );
        const configuration = {
          schemaVersion: 1,
          source: "yanshu-local-onboarding",
          createdAt: new Date().toISOString(),
          execution: {
            surface: "visible-chat",
            startAuthorized: true,
          },
          projectRoot: state.projectRoot,
          inputs: state.inputs,
          workflow: workflow.config,
        };
        await writeFile(
          configPath,
          `${JSON.stringify(configuration, null, 2)}\n`,
          "utf8",
        );
        const selection = localizedSelection(
          workflow.config,
          configurationModel,
        );
        state.status = "confirmed";
        state.updatedAt = new Date().toISOString();
        state.confirmedAt = state.updatedAt;
        state.configPath = configPath;
        state.selection = selection;
        await writeOnboardingState(sessionPath, state);
        sendJson(response, 200, {
          ok: true,
          status: state.status,
          selection,
        });
        if (!closing) {
          closing = true;
          setTimeout(() => server.close(), 1_500);
        }
        return;
      }
      if (
        request.method === "POST" &&
        requestUrl.pathname === "/api/cancel"
      ) {
        if (state.status === "cancelled") {
          sendJson(response, 200, { ok: true, status: state.status });
          return;
        }
        if (state.status !== "ready") {
          sendJson(response, 409, {
            ok: false,
            error: `Onboarding session is ${state.status}.`,
          });
          return;
        }
        state.status = "cancelled";
        state.updatedAt = new Date().toISOString();
        await writeOnboardingState(sessionPath, state);
        sendJson(response, 200, { ok: true, status: state.status });
        if (!closing) {
          closing = true;
          setTimeout(() => server.close(), 500);
        }
        return;
      }

      sendJson(response, 404, { ok: false, error: "Not found." });
    } catch (error) {
      sendJson(response, 400, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  server.on("error", async (error) => {
    state.status = "error";
    state.updatedAt = new Date().toISOString();
    state.error = {
      code: "onboarding_server_error",
      message: error instanceof Error ? error.message : String(error),
    };
    await writeOnboardingState(sessionPath, state);
    process.exitCode = 1;
  });

  server.listen(0, "127.0.0.1", async () => {
    try {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("YanShu could not determine the onboarding port.");
      }
      state.status = "ready";
      state.updatedAt = new Date().toISOString();
      state.serverPid = process.pid;
      state.url = `http://127.0.0.1:${address.port}/?token=${state.token}`;
      await writeOnboardingState(sessionPath, state);
    } catch (error) {
      state.status = "error";
      state.updatedAt = new Date().toISOString();
      state.error = {
        code: "onboarding_start_failed",
        message: error instanceof Error ? error.message : String(error),
      };
      await writeOnboardingState(sessionPath, state);
      server.close();
    }
  });

  const expiryDelay = Math.max(
    1_000,
    Date.parse(state.expiresAt) - Date.now(),
  );
  setTimeout(async () => {
    if (closing) return;
    closing = true;
    state = await loadOnboardingState(sessionPath);
    if (state.status === "ready") {
      state.status = "expired";
      state.updatedAt = new Date().toISOString();
      await writeOnboardingState(sessionPath, state);
    }
    server.close();
  }, expiryDelay).unref();
}

main().catch(async (error) => {
  try {
    const sessionPath = sessionPathFromArgs(process.argv.slice(2));
    const state = await loadOnboardingState(sessionPath);
    state.status = "error";
    state.updatedAt = new Date().toISOString();
    state.error = {
      code: "onboarding_start_failed",
      message: error instanceof Error ? error.message : String(error),
    };
    await writeOnboardingState(sessionPath, state);
  } finally {
    process.exitCode = 1;
  }
});
