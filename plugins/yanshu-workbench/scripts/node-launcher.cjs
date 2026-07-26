#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const { existsSync, readdirSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MINIMUM_NODE_MAJOR = 22;

function nodeMajor(executable) {
  try {
    const result = spawnSync(
      executable,
      ["-p", "Number(process.versions.node.split('.')[0])"],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 5_000,
      },
    );
    if (result.status !== 0) return null;
    const value = Number.parseInt(result.stdout.trim(), 10);
    return Number.isInteger(value) ? value : null;
  } catch {
    return null;
  }
}

function nvmCandidates() {
  const roots = [];
  if (process.env.NVM_DIR) {
    roots.push(path.join(process.env.NVM_DIR, "versions", "node"));
  }
  roots.push(path.join(os.homedir(), ".nvm", "versions", "node"));

  const candidates = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const version of readdirSync(root).sort().reverse()) {
      const executable = path.join(
        root,
        version,
        "bin",
        process.platform === "win32" ? "node.exe" : "node",
      );
      if (existsSync(executable)) candidates.push(executable);
    }
  }
  return candidates;
}

function candidateExecutables() {
  const candidates = [
    process.env.YANSHU_NODE,
    process.env.CODEX_NODE_PATH,
    process.env.CODEX_NODE,
    process.execPath,
  ];

  if (process.platform === "win32") {
    candidates.push(
      path.join(
        os.homedir(),
        ".cache",
        "codex-runtimes",
        "codex-primary-runtime",
        "dependencies",
        "node",
        "bin",
        "node.exe",
      ),
    );
    if (process.env.NVM_SYMLINK) {
      candidates.push(path.join(process.env.NVM_SYMLINK, "node.exe"));
    }
  }

  candidates.push(...nvmCandidates(), "node");
  return [...new Set(candidates.filter(Boolean))];
}

function resolveCompatibleNode() {
  const inspected = [];
  for (const executable of candidateExecutables()) {
    const major = nodeMajor(executable);
    inspected.push({ executable, major });
    if (major !== null && major >= MINIMUM_NODE_MAJOR) {
      return { executable, major, inspected };
    }
  }
  return { executable: null, major: null, inspected };
}

function resolveEntry(rawEntry) {
  const pluginRoot = path.resolve(__dirname, "..");
  const entry = rawEntry || "scripts/yanshu.mjs";
  return path.isAbsolute(entry) ? entry : path.resolve(pluginRoot, entry);
}

function run(argv = process.argv.slice(2)) {
  const [rawEntry, ...entryArgs] = argv;
  const entry = resolveEntry(rawEntry);
  if (!existsSync(entry)) {
    process.stderr.write(`YanShu entry does not exist: ${entry}\n`);
    return 1;
  }

  const resolution = resolveCompatibleNode();
  if (!resolution.executable) {
    process.stderr.write(
      `${JSON.stringify(
        {
          ok: false,
          error: {
            code: "compatible_node_unavailable",
            message: `YanShu requires Node ${MINIMUM_NODE_MAJOR} or newer.`,
            inspected: resolution.inspected,
          },
        },
        null,
        2,
      )}\n`,
    );
    return 1;
  }

  const result = spawnSync(
    resolution.executable,
    [entry, ...entryArgs],
    {
      stdio: "inherit",
      windowsHide: true,
      env: {
        ...process.env,
        YANSHU_RESOLVED_NODE: resolution.executable,
        YANSHU_RESOLVED_NODE_MAJOR: String(resolution.major),
      },
    },
  );
  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
    return 1;
  }
  return result.status ?? 1;
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = {
  MINIMUM_NODE_MAJOR,
  candidateExecutables,
  nodeMajor,
  resolveCompatibleNode,
  resolveEntry,
  run,
};
