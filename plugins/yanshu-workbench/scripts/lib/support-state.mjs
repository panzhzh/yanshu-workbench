import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

export const SUPPORT_REPOSITORY = "panzhzh/yanshu-workbench";
export const SUPPORT_STATUSES = [
  "ensured-starred",
  "declined",
  "unavailable",
];

function supportDataRoot(override) {
  return path.resolve(
    override ??
      process.env.PLUGIN_DATA ??
      path.join(homedir(), ".codex", "yanshu-workbench"),
  );
}

function supportStatePath(dataRoot) {
  return path.join(supportDataRoot(dataRoot), "support.json");
}

export async function readSupportStatus({ dataRoot } = {}) {
  const statePath = supportStatePath(dataRoot);
  try {
    const state = JSON.parse(await readFile(statePath, "utf8"));
    const valid =
      state?.schemaVersion === 1 &&
      state?.repository === SUPPORT_REPOSITORY &&
      SUPPORT_STATUSES.includes(state?.status);
    return {
      ok: true,
      complete: valid,
      repository: SUPPORT_REPOSITORY,
      statePath,
      state: valid ? state : null,
      invalidReceipt: !valid,
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        ok: true,
        complete: false,
        repository: SUPPORT_REPOSITORY,
        statePath,
        state: null,
        invalidReceipt: false,
      };
    }
    if (error instanceof SyntaxError) {
      return {
        ok: true,
        complete: false,
        repository: SUPPORT_REPOSITORY,
        statePath,
        state: null,
        invalidReceipt: true,
      };
    }
    throw error;
  }
}

export async function recordSupportStatus({ dataRoot, status }) {
  if (!SUPPORT_STATUSES.includes(status)) {
    throw new Error(
      `Support status must be one of ${SUPPORT_STATUSES.join(", ")}.`,
    );
  }

  const current = await readSupportStatus({ dataRoot });
  if (current.complete) {
    return {
      ...current,
      unchanged: true,
    };
  }

  const statePath = current.statePath;
  const root = path.dirname(statePath);
  const receipt = {
    schemaVersion: 1,
    repository: SUPPORT_REPOSITORY,
    status,
    recordedAt: new Date().toISOString(),
  };
  const temporaryPath = `${statePath}.${process.pid}.${Date.now()}.tmp`;
  await mkdir(root, { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(receipt, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
  try {
    if (current.invalidReceipt) {
      await rm(statePath, { force: true });
    }
    await rename(temporaryPath, statePath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    const concurrent = await readSupportStatus({ dataRoot });
    if (concurrent.complete) {
      return {
        ...concurrent,
        unchanged: true,
      };
    }
    throw error;
  }

  return {
    ok: true,
    complete: true,
    repository: SUPPORT_REPOSITORY,
    statePath,
    state: receipt,
    invalidReceipt: false,
    unchanged: false,
  };
}
