import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { CliError } from "./cli.mjs";

export const ONBOARDING_SCHEMA_VERSION = 1;
const DEFAULT_SESSION_TTL_MS = 2 * 60 * 60 * 1000;

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function writeOnboardingState(sessionPath, state) {
  const statePath = path.join(sessionPath, "session.json");
  const temporaryPath = path.join(
    sessionPath,
    `.session.${randomUUID()}.tmp`,
  );
  await writeFile(
    temporaryPath,
    `${JSON.stringify(state, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, statePath);
  return state;
}

export async function loadOnboardingState(sessionPath) {
  const resolved = path.resolve(sessionPath);
  const statePath = path.join(resolved, "session.json");
  if (!(await exists(statePath))) {
    throw new CliError(
      `Not a YanShu onboarding session: ${resolved}`,
      "invalid_onboarding_session",
    );
  }
  const state = JSON.parse(await readFile(statePath, "utf8"));
  if (state.schemaVersion !== ONBOARDING_SCHEMA_VERSION) {
    throw new CliError(
      `Unsupported onboarding schema ${state.schemaVersion}.`,
      "unsupported_onboarding_schema",
    );
  }
  if (path.resolve(state.sessionPath) !== resolved) {
    throw new CliError(
      "The onboarding directory does not match session.json.",
      "moved_onboarding_session",
    );
  }
  return state;
}

function summarizeOnboardingState(state, opened = undefined) {
  const isReconstruction =
    !state.workflowId || state.workflowId === "paper-reconstruction";
  return {
    ok: state.status !== "error",
    sessionId: state.sessionId,
    sessionPath: state.sessionPath,
    workflowId: state.workflowId ?? "paper-reconstruction",
    status: state.status,
    url: state.url,
    opened,
    configPath: state.configPath,
    selection: state.selection,
    error: state.error,
    expiresAt: state.expiresAt,
    instruction:
      state.status === "confirmed"
        ? isReconstruction
          ? "The local page confirmation is the start authorization. Run the Chat bridge preflight, then initialize from configPath without asking configuration questions again."
          : "The local page confirmation is the start authorization. Read configPath, use its exact saved Prompt and preferences, then execute the selected workflow without asking configuration questions again."
        : state.status === "cancelled"
          ? "The user exited the local page. Stop without initializing, uploading files, or asking replacement workflow questions."
          : isReconstruction
            ? "Keep this session path and poll configure-status. The user completes all remaining workflow choices and can inspect every Prompt in the local page."
            : "Keep this session path and poll workflow-configure-status. The user completes all remaining choices and can inspect the exact execution Prompt on the local page.",
  };
}

async function waitForReady(sessionPath, timeoutMs = 8_000) {
  const deadline = Date.now() + timeoutMs;
  let latest = null;
  while (Date.now() < deadline) {
    latest = await loadOnboardingState(sessionPath);
    if (["ready", "confirmed", "cancelled", "error"].includes(latest.status)) {
      return latest;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new CliError(
    `YanShu onboarding page did not start within ${timeoutMs} ms.`,
    "onboarding_start_timeout",
    latest,
  );
}

function spawnUrlOpener(command, args) {
  return new Promise((resolve) => {
    let settled = false;
    try {
      const child = spawn(command, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      });
      child.once("spawn", () => {
        if (settled) return;
        settled = true;
        child.unref();
        resolve(true);
      });
      child.once("error", () => {
        if (settled) return;
        settled = true;
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

async function openExternalUrl(url) {
  if (process.platform === "win32") {
    return spawnUrlOpener("cmd.exe", ["/d", "/c", "start", "", url]);
  }
  if (process.platform === "darwin") {
    return spawnUrlOpener("open", [url]);
  }
  if (process.env.WSL_DISTRO_NAME) {
    const windowsCommand = "/mnt/c/Windows/System32/cmd.exe";
    if (await exists(windowsCommand)) {
      return spawnUrlOpener(windowsCommand, [
        "/d",
        "/c",
        "start",
        "",
        url,
      ]);
    }
  }
  return spawnUrlOpener("xdg-open", [url]);
}

export async function startOnboardingSession({
  pluginRoot,
  projectRoot,
  inputs,
  workflowId = "paper-reconstruction",
  uiLanguage = "zh",
  prefillWorkflow = {},
  openBrowser = true,
  sessionRoot = path.join(tmpdir(), "yanshu-onboarding"),
  ttlMs = DEFAULT_SESSION_TTL_MS,
}) {
  const sessionId = randomUUID();
  const sessionPath = path.join(path.resolve(sessionRoot), sessionId);
  const now = new Date();
  const state = {
    schemaVersion: ONBOARDING_SCHEMA_VERSION,
    sessionId,
    sessionPath,
    status: "starting",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    token: randomBytes(24).toString("hex"),
    workflowId,
    projectRoot: path.resolve(projectRoot),
    inputs,
    uiLanguage,
    prefillWorkflow,
    url: null,
    serverPid: null,
    configPath: null,
    selection: null,
    error: null,
  };
  await mkdir(path.resolve(sessionRoot), { recursive: true, mode: 0o700 });
  await mkdir(sessionPath, { recursive: false, mode: 0o700 });
  await writeOnboardingState(sessionPath, state);

  const serverPath = path.join(
    path.resolve(pluginRoot),
    "scripts",
    workflowId === "paper-reconstruction"
      ? "onboarding-server.mjs"
      : "workflow-configuration-server.mjs",
  );
  const child = spawn(process.execPath, [serverPath, "--session", sessionPath], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.once("error", async (error) => {
    const failed = await loadOnboardingState(sessionPath);
    failed.status = "error";
    failed.updatedAt = new Date().toISOString();
    failed.error = {
      code: "onboarding_start_failed",
      message: error instanceof Error ? error.message : String(error),
    };
    await writeOnboardingState(sessionPath, failed);
  });
  child.unref();

  const readyState = await waitForReady(sessionPath);
  if (readyState.status === "error") {
    throw new CliError(
      readyState.error?.message ?? "YanShu onboarding page failed to start.",
      readyState.error?.code ?? "onboarding_start_failed",
      readyState.error,
    );
  }
  const opened =
    openBrowser && readyState.url
      ? await openExternalUrl(readyState.url)
      : false;
  return summarizeOnboardingState(readyState, opened);
}

export async function onboardingStatus(sessionPath) {
  return summarizeOnboardingState(
    await loadOnboardingState(path.resolve(sessionPath)),
  );
}
