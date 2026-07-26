import { spawnSync } from "node:child_process";
import {
  readFile,
  readdir,
  stat,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CliError } from "./cli.mjs";

const DEFAULT_PLUGIN_NAME = "yanshu-workbench";
const DEFAULT_MARKETPLACE_NAME = "yanshu-workbench";

function codexCandidates() {
  const candidates = [
    process.env.YANSHU_CODEX_CLI,
    process.env.CODEX_CLI,
  ];
  if (process.platform === "win32") {
    candidates.push(
      path.join(
        os.homedir(),
        ".codex",
        "plugins",
        ".plugin-appserver",
        "codex.exe",
      ),
    );
  }
  candidates.push("codex");
  return [...new Set(candidates.filter(Boolean))];
}

export function resolveCodexExecutable(runner = spawnSync) {
  const inspected = [];
  for (const executable of codexCandidates()) {
    const probe = runner(executable, ["--version"], {
      encoding: "utf8",
      windowsHide: true,
      shell: false,
      timeout: 10_000,
    });
    inspected.push({
      executable,
      ok: probe.status === 0,
      status: probe.status,
      error: probe.error?.message ?? null,
    });
    if (probe.status === 0) {
      return { executable, inspected };
    }
  }
  return { executable: null, inspected };
}

function runCodex(args, runner = spawnSync, executable) {
  const resolved =
    executable ??
    resolveCodexExecutable(runner).executable;
  if (!resolved) {
    return {
      ok: false,
      status: null,
      stdout: "",
      stderr: "",
      error: "No callable Codex CLI executable was found.",
      executable: null,
    };
  }
  const result = runner(resolved, args, {
    encoding: "utf8",
    windowsHide: true,
    shell: false,
    timeout: 180_000,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error?.message ?? null,
    executable: resolved,
  };
}

async function pluginVersionAt(root) {
  try {
    const manifest = JSON.parse(
      await readFile(
        path.join(root, ".codex-plugin", "plugin.json"),
        "utf8",
      ),
    );
    const info = await stat(root);
    return {
      root,
      version: manifest.version ?? null,
      modifiedAt: info.mtimeMs,
    };
  } catch {
    return null;
  }
}

export async function discoverInstalledPluginRoots({
  pluginName = DEFAULT_PLUGIN_NAME,
  marketplaceName = DEFAULT_MARKETPLACE_NAME,
} = {}) {
  const cacheRoot = path.join(
    os.homedir(),
    ".codex",
    "plugins",
    "cache",
    marketplaceName,
    pluginName,
  );
  let entries;
  try {
    entries = await readdir(cacheRoot, { withFileTypes: true });
  } catch {
    return [];
  }
  const roots = (
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => pluginVersionAt(path.join(cacheRoot, entry.name))),
    )
  ).filter(Boolean);
  return roots.sort((left, right) => right.modifiedAt - left.modifiedAt);
}

function marketplaceRootCandidates(marketplaceName) {
  return [
    path.join(
      os.homedir(),
      ".codex",
      ".tmp",
      "marketplaces",
      marketplaceName,
    ),
    path.join(
      os.homedir(),
      ".codex",
      "marketplaces",
      marketplaceName,
    ),
  ];
}

export async function discoverMarketplaceSnapshot({
  pluginName = DEFAULT_PLUGIN_NAME,
  marketplaceName = DEFAULT_MARKETPLACE_NAME,
} = {}) {
  for (const root of marketplaceRootCandidates(marketplaceName)) {
    try {
      const installRecord = JSON.parse(
        await readFile(
          path.join(root, ".codex-marketplace-install.json"),
          "utf8",
        ),
      );
      const plugin = await pluginVersionAt(
        path.join(root, "plugins", pluginName),
      );
      return {
        root,
        source: installRecord.source ?? null,
        refName: installRecord.ref_name ?? null,
        revision: installRecord.revision ?? null,
        pluginVersion: plugin?.version ?? null,
      };
    } catch {
      // Try the next supported marketplace location.
    }
  }
  return null;
}

function numericVersionParts(value) {
  const match = String(value ?? "").match(
    /^(\d+)\.(\d+)\.(\d+)/u,
  );
  if (!match) return null;
  const cachebuster =
    String(value).match(/\+codex\.(\d+)$/u)?.[1] ?? "";
  return [
    Number.parseInt(match[1], 10),
    Number.parseInt(match[2], 10),
    Number.parseInt(match[3], 10),
    cachebuster,
  ];
}

export function comparePluginVersions(left, right) {
  const leftParts = numericVersionParts(left);
  const rightParts = numericVersionParts(right);
  if (!leftParts || !rightParts) {
    return String(left ?? "").localeCompare(String(right ?? ""));
  }
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return Math.sign(leftParts[index] - rightParts[index]);
    }
  }
  return String(leftParts[3]).localeCompare(String(rightParts[3]));
}

export async function refreshMarketplaceSnapshot({
  pluginName = DEFAULT_PLUGIN_NAME,
  marketplaceName = DEFAULT_MARKETPLACE_NAME,
  runner = spawnSync,
} = {}) {
  const resolution = resolveCodexExecutable(runner);
  if (!resolution.executable) {
    return {
      ok: false,
      error: "No callable Codex CLI executable was found.",
      inspected: resolution.inspected,
      snapshot: await discoverMarketplaceSnapshot({
        pluginName,
        marketplaceName,
      }),
    };
  }
  const upgrade = runCodex(
    ["plugin", "marketplace", "upgrade", marketplaceName],
    runner,
    resolution.executable,
  );
  return {
    ok: upgrade.ok,
    upgrade,
    snapshot: await discoverMarketplaceSnapshot({
      pluginName,
      marketplaceName,
    }),
  };
}

export async function autoUpdatePlugin({
  pluginName = DEFAULT_PLUGIN_NAME,
  marketplaceName = DEFAULT_MARKETPLACE_NAME,
  runner = spawnSync,
} = {}) {
  const before = await discoverInstalledPluginRoots({
    pluginName,
    marketplaceName,
  });
  const refreshed = await refreshMarketplaceSnapshot({
    pluginName,
    marketplaceName,
    runner,
  });
  if (!refreshed.ok) {
    throw new CliError(
      "YanShu could not refresh its local marketplace automatically.",
      "plugin_auto_update_failed",
      { step: "marketplace-upgrade", refreshed },
    );
  }
  const marketplaceUpgrade = refreshed.upgrade;
  const reinstall = runCodex(
    ["plugin", "add", `${pluginName}@${marketplaceName}`],
    runner,
    marketplaceUpgrade.executable,
  );
  if (!reinstall.ok) {
    throw new CliError(
      "YanShu refreshed the marketplace but could not reinstall the plugin automatically.",
      "plugin_auto_update_failed",
      { step: "plugin-add", marketplaceUpgrade, reinstall },
    );
  }
  const after = await discoverInstalledPluginRoots({
    pluginName,
    marketplaceName,
  });
  if (after.length === 0) {
    throw new CliError(
      "YanShu update completed, but the installed plugin cache could not be located.",
      "plugin_auto_update_unverified",
      { marketplaceUpgrade, reinstall },
    );
  }
  return {
    updated: true,
    pluginName,
    marketplaceName,
    previous: before[0] ?? null,
    installed: after[0],
    marketplaceSnapshot:
      (await discoverMarketplaceSnapshot({
        pluginName,
        marketplaceName,
      })) ?? refreshed.snapshot,
    marketplaceUpgrade,
    reinstall,
  };
}

export function relaunchUpdatedRuntime({
  pluginRoot,
  argv,
  loadedSkillVersion,
  runner = spawnSync,
}) {
  const launcher = path.join(
    pluginRoot,
    "scripts",
    "node-launcher.cjs",
  );
  const entry = path.join(pluginRoot, "scripts", "yanshu.mjs");
  const result = runner(
    process.execPath,
    [launcher, entry, ...argv],
    {
      encoding: "utf8",
      windowsHide: true,
      timeout: 300_000,
      env: {
        ...process.env,
        YANSHU_AUTO_UPDATE_ATTEMPTED: "1",
        ...(loadedSkillVersion
          ? { YANSHU_LOADED_SKILL_VERSION: loadedSkillVersion }
          : {}),
      },
    },
  );
  if (result.status !== 0) {
    throw new CliError(
      "YanShu installed the update but could not relaunch the updated runtime.",
      "plugin_auto_relaunch_failed",
      {
        pluginRoot,
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        error: result.error?.message ?? null,
      },
    );
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new CliError(
      "The updated YanShu runtime returned an unreadable result.",
      "plugin_auto_relaunch_failed",
      { pluginRoot, stdout: result.stdout, stderr: result.stderr },
    );
  }
}
