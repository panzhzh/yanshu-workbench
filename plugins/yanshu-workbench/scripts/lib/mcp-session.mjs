import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import {
  mkdir,
  open,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { CliError } from "./cli.mjs";
import { loadRun, nextRound, pathExists } from "./run-store.mjs";

const SESSION_FILE = "session.json";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function readSession(runPath) {
  const sessionPath = path.join(runPath, "mcp", SESSION_FILE);
  if (!(await pathExists(sessionPath))) return null;
  try {
    return JSON.parse(await readFile(sessionPath, "utf8"));
  } catch {
    return null;
  }
}

async function endpointHealthy(localUrl) {
  if (!localUrl) return false;
  try {
    const response = await fetch(localUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "health",
        method: "ping",
      }),
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return false;
    const payload = await response.json();
    return payload?.result !== undefined;
  } catch {
    return false;
  }
}

function bootstrapFor(state) {
  const round = nextRound(state);
  if (!round) {
    return `Open the connected YanShu Paper Workspace for run ${state.runId} and report its completed status.`;
  }
  return [
    `Continue YanShu Paper Reconstruction run ${state.runId}, Round ${round.number}: ${round.title}.`,
    `The authorized local run path is ${state.runPath}.`,
    "Use the connected YanShu Paper Workspace tools and call yanshu_get_round_manifest first.",
    "Read the exact round Prompt and approved TeX/Bib sources. Before writing experimental or numeric claims, index the figures and tables, inspect every relevant original figure, and render the necessary PDF pages.",
    "Save complete artifacts through YanShu, compile TeX, correct all compilation errors in this same conversation, and complete the round only after validation passes.",
  ].join(" ");
}

export async function startMcpSession({
  pluginRoot,
  runPath,
  port = 0,
}) {
  const state = await loadRun(runPath);
  const existing = await readSession(state.runPath);
  if (
    existing &&
    pidAlive(existing.pid) &&
    (await endpointHealthy(existing.localUrl))
  ) {
    return {
      ...existing,
      reused: true,
      bootstrapPrompt: bootstrapFor(state),
    };
  }

  const sessionDirectory = path.join(state.runPath, "mcp");
  const sessionPath = path.join(sessionDirectory, SESSION_FILE);
  const logPath = path.join(sessionDirectory, "server.log");
  await mkdir(sessionDirectory, { recursive: true });
  const token = randomBytes(24).toString("hex");
  const serverPath = path.join(pluginRoot, "mcp", "server.mjs");
  if (!(await pathExists(serverPath))) {
    throw new CliError(
      "The YanShu MCP server is missing from the installed plugin.",
      "missing_mcp_server",
    );
  }
  const log = await open(logPath, "a");
  const child = spawn(
    process.execPath,
    [
      serverPath,
      "--transport",
      "http",
      "--run",
      state.runPath,
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--token",
      token,
      "--state-file",
      sessionPath,
    ],
    {
      detached: true,
      windowsHide: true,
      stdio: ["ignore", log.fd, log.fd],
    },
  );
  child.unref();
  await log.close();

  let session = null;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await delay(100);
    session = await readSession(state.runPath);
    if (
      session &&
      session.pid === child.pid &&
      (await endpointHealthy(session.localUrl))
    ) {
      break;
    }
    if (!pidAlive(child.pid)) break;
  }
  if (!session || !(await endpointHealthy(session.localUrl))) {
    throw new CliError(
      `YanShu MCP did not become ready. Inspect ${logPath}.`,
      "mcp_start_failed",
    );
  }
  return {
    ...session,
    sessionPath,
    logPath,
    reused: false,
    bootstrapPrompt: bootstrapFor(state),
    connectionNote:
      "The loopback URL is private to this computer. A visible ChatGPT web conversation needs either an installed local YanShu connection or an authenticated HTTPS tunnel; browser file attachment remains the fallback until that connection is active.",
  };
}

export async function mcpSessionStatus(runPath) {
  const state = await loadRun(runPath);
  const session = await readSession(state.runPath);
  if (!session) {
    return {
      running: false,
      runId: state.runId,
      session: null,
    };
  }
  const running =
    pidAlive(session.pid) && (await endpointHealthy(session.localUrl));
  return {
    running,
    runId: state.runId,
    session,
    bootstrapPrompt: bootstrapFor(state),
  };
}

export async function stopMcpSession(runPath) {
  const state = await loadRun(runPath);
  const session = await readSession(state.runPath);
  if (!session || !pidAlive(session.pid)) {
    return { stopped: false, alreadyStopped: true, runId: state.runId };
  }
  process.kill(session.pid);
  const stoppedAt = new Date().toISOString();
  await writeFile(
    path.join(state.runPath, "mcp", SESSION_FILE),
    `${JSON.stringify({ ...session, stoppedAt }, null, 2)}\n`,
    "utf8",
  );
  return {
    stopped: true,
    alreadyStopped: false,
    runId: state.runId,
    pid: session.pid,
  };
}
