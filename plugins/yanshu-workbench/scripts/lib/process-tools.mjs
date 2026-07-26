import { spawn, spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const DEFAULT_WSL_DISTRO =
  process.env.YANSHU_WSL_DISTRO?.trim() || "Ubuntu-22.04";

function asciiStagingRoot() {
  if (process.env.YANSHU_STAGING_ROOT?.trim()) {
    return path.resolve(process.env.YANSHU_STAGING_ROOT.trim());
  }
  if (process.platform === "win32") {
    const systemRoot = process.env.SystemRoot || "C:\\Windows";
    return path.join(systemRoot, "Temp");
  }
  return "/tmp";
}

function asciiFileName(value, fallback = "input") {
  const extension = path.extname(value).replace(/[^a-zA-Z0-9.]/g, "");
  const stem = path
    .basename(value, path.extname(value))
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]+/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${stem || fallback}${extension}`;
}

export async function createAsciiStagingDirectory(
  prefix = "yanshu-stage-",
) {
  const root = asciiStagingRoot();
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, prefix));
  return {
    directory,
    async stageFile(source, preferredName) {
      const destination = path.join(
        directory,
        asciiFileName(preferredName ?? source),
      );
      await copyFile(source, destination);
      return destination;
    },
    async copyOut(source, destination) {
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
      return destination;
    },
    async cleanup() {
      await rm(directory, { recursive: true, force: true });
    },
  };
}

function commandProbe(command) {
  if (process.platform === "win32") {
    return spawnSync("where.exe", [command], {
      encoding: "utf8",
      windowsHide: true,
    }).status === 0;
  }
  return spawnSync("sh", ["-lc", `command -v "${command}"`], {
    encoding: "utf8",
  }).status === 0;
}

function wslProbe(command, distro = DEFAULT_WSL_DISTRO) {
  if (process.platform !== "win32") return false;
  return (
    spawnSync(
      "wsl.exe",
      ["-d", distro, "--", "sh", "-lc", `command -v "${command}"`],
      {
        encoding: "utf8",
        windowsHide: true,
      },
    ).status === 0
  );
}

export function resolveToolBackend(
  command,
  { distro = DEFAULT_WSL_DISTRO } = {},
) {
  if (commandProbe(command)) {
    return { kind: "native", command, distro: null };
  }
  if (wslProbe(command, distro)) {
    return { kind: "wsl", command: "wsl.exe", distro };
  }
  return null;
}

export function toolAvailable(command, options = {}) {
  return resolveToolBackend(command, options) !== null;
}

function windowsPathToWsl(target, distro) {
  const resolved = path.resolve(target);
  const result = spawnSync(
    "wsl.exe",
    ["-d", distro, "--", "wslpath", "-a", "-u", resolved],
    {
      encoding: "utf8",
      windowsHide: true,
    },
  );
  if (result.status !== 0 || !result.stdout.trim()) {
    throw new Error(
      `Unable to translate a Windows path for WSL: ${resolved}`,
    );
  }
  return result.stdout.trim();
}

function collectOutput(child, timeoutMs) {
  return new Promise((resolve) => {
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.stdout?.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr?.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        status: null,
        signal: null,
        timedOut,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        error,
      });
    });
    child.on("close", (status, signal) => {
      clearTimeout(timer);
      resolve({
        ok: status === 0 && !timedOut,
        status,
        signal,
        timedOut,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        error: null,
      });
    });
  });
}

/**
 * Run one fixed local tool. `buildArgs` receives a path mapper so callers can
 * construct equivalent native and WSL invocations without accepting arbitrary
 * shell input.
 */
export async function runPortableTool(
  command,
  {
    cwd,
    buildArgs,
    timeoutMs = 120_000,
    distro = DEFAULT_WSL_DISTRO,
    env = {},
  },
) {
  const backend = resolveToolBackend(command, { distro });
  if (!backend) {
    return {
      ok: false,
      status: null,
      signal: null,
      timedOut: false,
      stdout: "",
      stderr: "",
      error: new Error(`Required local tool is unavailable: ${command}`),
      backend: null,
    };
  }

  const mapPath =
    backend.kind === "wsl"
      ? (target) => windowsPathToWsl(target, distro)
      : (target) => path.resolve(target);
  const args = buildArgs(mapPath);
  const resolvedCwd = cwd ? path.resolve(cwd) : process.cwd();

  let executable = command;
  let finalArgs = args;
  let spawnCwd = resolvedCwd;
  if (backend.kind === "wsl") {
    executable = "wsl.exe";
    finalArgs = [
      "-d",
      distro,
      "--cd",
      mapPath(resolvedCwd),
      "--",
      command,
      ...args,
    ];
    spawnCwd = undefined;
  }

  const child = spawn(executable, finalArgs, {
    cwd: spawnCwd,
    env: { ...process.env, ...env },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const result = await collectOutput(child, timeoutMs);
  return { ...result, backend: backend.kind };
}
