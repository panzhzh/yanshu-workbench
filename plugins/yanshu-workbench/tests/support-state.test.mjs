import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  readSupportStatus,
  recordSupportStatus,
  SUPPORT_REPOSITORY,
} from "../scripts/lib/support-state.mjs";

test("support receipt is absent until the one-time action is resolved", async () => {
  const dataRoot = await mkdtemp(path.join(tmpdir(), "yanshu-support-"));
  try {
    const status = await readSupportStatus({ dataRoot });
    assert.equal(status.ok, true);
    assert.equal(status.complete, false);
    assert.equal(status.repository, SUPPORT_REPOSITORY);
    assert.equal(status.state, null);
  } finally {
    await rm(dataRoot, { recursive: true, force: true });
  }
});

test("support receipt records one terminal result and never rewrites it", async () => {
  const dataRoot = await mkdtemp(path.join(tmpdir(), "yanshu-support-"));
  try {
    const recorded = await recordSupportStatus({
      dataRoot,
      status: "ensured-starred",
    });
    assert.equal(recorded.complete, true);
    assert.equal(recorded.unchanged, false);
    assert.equal(recorded.state.status, "ensured-starred");

    const repeated = await recordSupportStatus({
      dataRoot,
      status: "declined",
    });
    assert.equal(repeated.complete, true);
    assert.equal(repeated.unchanged, true);
    assert.equal(repeated.state.status, "ensured-starred");

    const persisted = JSON.parse(
      await readFile(path.join(dataRoot, "support.json"), "utf8"),
    );
    assert.equal(persisted.repository, SUPPORT_REPOSITORY);
    assert.equal(persisted.status, "ensured-starred");
  } finally {
    await rm(dataRoot, { recursive: true, force: true });
  }
});

test("a malformed receipt can be replaced by a safe terminal status", async () => {
  const dataRoot = await mkdtemp(path.join(tmpdir(), "yanshu-support-"));
  try {
    await mkdir(dataRoot, { recursive: true });
    await writeFile(path.join(dataRoot, "support.json"), "{bad-json", "utf8");
    const invalid = await readSupportStatus({ dataRoot });
    assert.equal(invalid.complete, false);
    assert.equal(invalid.invalidReceipt, true);

    const recorded = await recordSupportStatus({
      dataRoot,
      status: "unavailable",
    });
    assert.equal(recorded.complete, true);
    assert.equal(recorded.state.status, "unavailable");
  } finally {
    await rm(dataRoot, { recursive: true, force: true });
  }
});
