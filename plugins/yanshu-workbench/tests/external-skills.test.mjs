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
  EXTERNAL_SKILL_REGISTRY,
  externalSkillsStatus,
  installApprovedExternalSkills,
  recordExternalSkillDecision,
} from "../scripts/lib/external-skills.mjs";

async function writeSkill(root, directory, name = directory) {
  const target = path.join(root, directory);
  await mkdir(target, { recursive: true });
  await writeFile(
    path.join(target, "SKILL.md"),
    `---\nname: ${name}\ndescription: fixture\n---\n`,
    "utf8",
  );
}

test("external skill allowlist contains only the two exact sub-skill paths", () => {
  assert.deepEqual(
    EXTERNAL_SKILL_REGISTRY.map(
      ({ id, repository, repositoryPath }) => ({
        id,
        repository,
        repositoryPath,
      }),
    ),
    [
      {
        id: "research-paper-writing",
        repository: "Master-cai/Research-Paper-Writing-Skills",
        repositoryPath: "research-paper-writing",
      },
      {
        id: "nature-figure",
        repository: "Yuan1z0825/nature-skills",
        repositoryPath: "skills/nature-figure",
      },
    ],
  );
});

test("status detects canonical names and the legacy ml-paper-writing alias", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "yanshu-external-status-"));
  const skillsRoot = path.join(root, "skills");
  const dataRoot = path.join(root, "data");
  try {
    await writeSkill(skillsRoot, "legacy-writing", "ml-paper-writing");
    await writeSkill(skillsRoot, "nature-figure");
    const status = await externalSkillsStatus({ skillsRoot, dataRoot });
    assert.deepEqual(status.missing, []);
    assert.deepEqual(status.installed, [
      "research-paper-writing",
      "nature-figure",
    ]);
    assert.equal(status.consent.askOnce, false);
    assert.equal(status.nextAction, "continue");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("one consent installs only the two allowlisted skills and stores a receipt", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "yanshu-external-install-"));
  const skillsRoot = path.join(root, "skills");
  const dataRoot = path.join(root, "data");
  const calls = [];
  try {
    const before = await externalSkillsStatus({ skillsRoot, dataRoot });
    assert.equal(before.consent.askOnce, true);
    assert.deepEqual(before.missing, [
      "research-paper-writing",
      "nature-figure",
    ]);

    const installed = await installApprovedExternalSkills({
      skillsRoot,
      dataRoot,
      consent: true,
      installSkill: async (spec, { destination }) => {
        calls.push({
          id: spec.id,
          repository: spec.repository,
          repositoryPath: spec.repositoryPath,
        });
        await writeSkill(destination, spec.id);
        return { id: spec.id };
      },
    });
    assert.equal(installed.ok, true);
    assert.deepEqual(calls, [
      {
        id: "research-paper-writing",
        repository: "Master-cai/Research-Paper-Writing-Skills",
        repositoryPath: "research-paper-writing",
      },
      {
        id: "nature-figure",
        repository: "Yuan1z0825/nature-skills",
        repositoryPath: "skills/nature-figure",
      },
    ]);
    assert.deepEqual(installed.status.missing, []);
    assert.equal(installed.status.consent.decision, "accepted");
    const receipt = JSON.parse(
      await readFile(installed.status.consent.statePath, "utf8"),
    );
    assert.deepEqual(receipt.authorizedSkillIds, [
      "research-paper-writing",
      "nature-figure",
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("a declined receipt is durable and prevents repeated consent prompts", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "yanshu-external-decline-"));
  const skillsRoot = path.join(root, "skills");
  const dataRoot = path.join(root, "data");
  try {
    await recordExternalSkillDecision({ dataRoot, decision: "declined" });
    const status = await externalSkillsStatus({ skillsRoot, dataRoot });
    assert.equal(status.consent.complete, true);
    assert.equal(status.consent.decision, "declined");
    assert.equal(status.consent.askOnce, false);
    assert.equal(status.nextAction, "continue-without-external-skills");
    await assert.rejects(
      installApprovedExternalSkills({ skillsRoot, dataRoot }),
      (error) => error?.code === "external_skills_declined",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
