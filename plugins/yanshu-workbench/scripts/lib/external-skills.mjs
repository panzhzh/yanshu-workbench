import { spawnSync } from "node:child_process";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { CliError } from "./cli.mjs";

export const EXTERNAL_SKILL_REGISTRY = [
  {
    id: "research-paper-writing",
    aliases: ["ml-paper-writing"],
    repository: "Master-cai/Research-Paper-Writing-Skills",
    repositoryPath: "research-paper-writing",
    purpose: "paper drafting and argument-level writing review",
  },
  {
    id: "nature-figure",
    aliases: [],
    repository: "Yuan1z0825/nature-skills",
    repositoryPath: "skills/nature-figure",
    purpose: "code-based experimental plotting",
  },
];

export const EXTERNAL_SKILL_DECISIONS = ["accepted", "declined"];
const RECEIPT_SCHEMA_VERSION = 1;

function dataRoot(override) {
  return path.resolve(
    override ??
      process.env.PLUGIN_DATA ??
      path.join(homedir(), ".codex", "yanshu-workbench"),
  );
}

function receiptPath(override) {
  return path.join(dataRoot(override), "external-skills.json");
}

function skillRootCandidates(override) {
  if (override) return [path.resolve(override)];
  return [
    process.env.CODEX_SKILLS_DIR,
    process.env.CODEX_HOME
      ? path.join(process.env.CODEX_HOME, "skills")
      : null,
    path.join(homedir(), ".codex", "skills"),
  ]
    .filter(Boolean)
    .map((candidate) => path.resolve(candidate))
    .filter((candidate, index, all) => all.indexOf(candidate) === index);
}

function frontmatterName(content) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/u)?.[1];
  return frontmatter?.match(/^name:\s*["']?([^"'\n]+)["']?\s*$/mu)?.[1]?.trim();
}

async function findInstalledSkill(spec, roots) {
  const supportedNames = new Set([spec.id, ...spec.aliases]);
  for (const root of roots) {
    for (const name of supportedNames) {
      const skillPath = path.join(root, name, "SKILL.md");
      try {
        const content = await readFile(skillPath, "utf8");
        const declaredName = frontmatterName(content);
        if (!declaredName || supportedNames.has(declaredName)) {
          return {
            id: spec.id,
            installed: true,
            matchedName: declaredName ?? name,
            path: path.dirname(skillPath),
          };
        }
      } catch {
        // Continue with aliases and other roots.
      }
    }

    let entries = [];
    try {
      entries = await readdir(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const skillPath = path.join(root, entry.name, "SKILL.md");
      try {
        const declaredName = frontmatterName(
          await readFile(skillPath, "utf8"),
        );
        if (declaredName && supportedNames.has(declaredName)) {
          return {
            id: spec.id,
            installed: true,
            matchedName: declaredName,
            path: path.dirname(skillPath),
          };
        }
      } catch {
        // Not an installed skill directory.
      }
    }
  }
  return {
    id: spec.id,
    installed: false,
    matchedName: null,
    path: null,
  };
}

async function readReceipt(dataRootOverride) {
  const statePath = receiptPath(dataRootOverride);
  try {
    const state = JSON.parse(await readFile(statePath, "utf8"));
    const expectedIds = EXTERNAL_SKILL_REGISTRY.map((skill) => skill.id);
    const valid =
      state?.schemaVersion === RECEIPT_SCHEMA_VERSION &&
      EXTERNAL_SKILL_DECISIONS.includes(state?.decision) &&
      Array.isArray(state?.authorizedSkillIds) &&
      expectedIds.every((id) => state.authorizedSkillIds.includes(id)) &&
      state.authorizedSkillIds.every((id) => expectedIds.includes(id));
    return {
      complete: valid,
      invalidReceipt: !valid,
      state: valid ? state : null,
      statePath,
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        complete: false,
        invalidReceipt: false,
        state: null,
        statePath,
      };
    }
    if (error instanceof SyntaxError) {
      return {
        complete: false,
        invalidReceipt: true,
        state: null,
        statePath,
      };
    }
    throw error;
  }
}

export async function externalSkillsStatus({
  dataRoot: dataRootOverride,
  skillsRoot,
} = {}) {
  const roots = skillRootCandidates(skillsRoot);
  const skills = await Promise.all(
    EXTERNAL_SKILL_REGISTRY.map(async (spec) => ({
      ...spec,
      ...(await findInstalledSkill(spec, roots)),
    })),
  );
  const receipt = await readReceipt(dataRootOverride);
  const missing = skills.filter((skill) => !skill.installed);
  return {
    ok: true,
    registry: EXTERNAL_SKILL_REGISTRY,
    skills,
    installed: skills.filter((skill) => skill.installed).map((skill) => skill.id),
    missing: missing.map((skill) => skill.id),
    skillsRoots: roots,
    installRoot: roots[0],
    consent: {
      complete: receipt.complete,
      decision: receipt.state?.decision ?? null,
      statePath: receipt.statePath,
      invalidReceipt: receipt.invalidReceipt,
      askOnce: missing.length > 0 && !receipt.complete,
      authorized:
        receipt.complete && receipt.state?.decision === "accepted",
    },
    nextAction:
      missing.length === 0
        ? "continue"
        : receipt.state?.decision === "declined"
          ? "continue-without-external-skills"
          : receipt.state?.decision === "accepted"
            ? "install-authorized-missing-skills"
            : "ask-once",
  };
}

export async function recordExternalSkillDecision({
  dataRoot: dataRootOverride,
  decision,
}) {
  if (!EXTERNAL_SKILL_DECISIONS.includes(decision)) {
    throw new CliError(
      `External-skill decision must be one of ${EXTERNAL_SKILL_DECISIONS.join(", ")}.`,
    );
  }
  const current = await readReceipt(dataRootOverride);
  if (current.complete) {
    return {
      ok: true,
      unchanged: true,
      statePath: current.statePath,
      state: current.state,
    };
  }
  const state = {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    decision,
    authorizedSkillIds: EXTERNAL_SKILL_REGISTRY.map((skill) => skill.id),
    recordedAt: new Date().toISOString(),
  };
  const root = path.dirname(current.statePath);
  const temporaryPath = `${current.statePath}.${process.pid}.${Date.now()}.tmp`;
  await mkdir(root, { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
  try {
    if (current.invalidReceipt) {
      await rm(current.statePath, { force: true });
    }
    await rename(temporaryPath, current.statePath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    const concurrent = await readReceipt(dataRootOverride);
    if (concurrent.complete) {
      return {
        ok: true,
        unchanged: true,
        statePath: concurrent.statePath,
        state: concurrent.state,
      };
    }
    throw error;
  }
  return {
    ok: true,
    unchanged: false,
    statePath: current.statePath,
    state,
  };
}

async function pathExists(target) {
  try {
    await readFile(target);
    return true;
  } catch {
    return false;
  }
}

async function resolveInstallerScript() {
  const candidates = [
    process.env.YANSHU_SKILL_INSTALLER,
    process.env.CODEX_HOME
      ? path.join(
          process.env.CODEX_HOME,
          "skills",
          ".system",
          "skill-installer",
          "scripts",
          "install-skill-from-github.py",
        )
      : null,
    path.join(
      homedir(),
      ".codex",
      "skills",
      ".system",
      "skill-installer",
      "scripts",
      "install-skill-from-github.py",
    ),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  throw new CliError(
    "Codex's bundled skill-installer helper was not found.",
    "external_skill_installer_missing",
    { candidates },
  );
}

function resolvePython(runner = spawnSync) {
  const candidates =
    process.platform === "win32"
      ? [
          { executable: "py", prefix: ["-3"] },
          { executable: "python", prefix: [] },
          { executable: "python3", prefix: [] },
        ]
      : [
          { executable: "python3", prefix: [] },
          { executable: "python", prefix: [] },
        ];
  for (const candidate of candidates) {
    const probe = runner(
      candidate.executable,
      [...candidate.prefix, "--version"],
      {
        encoding: "utf8",
        windowsHide: true,
        shell: false,
        timeout: 10_000,
      },
    );
    if (probe.status === 0) return candidate;
  }
  throw new CliError(
    "Python is required by Codex's bundled skill installer but was not found.",
    "external_skill_python_missing",
  );
}

async function installWithBundledHelper(
  spec,
  { destination, runner = spawnSync } = {},
) {
  const installer = await resolveInstallerScript();
  const python = resolvePython(runner);
  const result = runner(
    python.executable,
    [
      ...python.prefix,
      installer,
      "--repo",
      spec.repository,
      "--path",
      spec.repositoryPath,
      "--dest",
      destination,
    ],
    {
      encoding: "utf8",
      windowsHide: true,
      shell: false,
      timeout: 600_000,
    },
  );
  if (result.status !== 0) {
    throw new CliError(
      `Could not install the approved external skill ${spec.id}.`,
      "external_skill_install_failed",
      {
        id: spec.id,
        repository: spec.repository,
        repositoryPath: spec.repositoryPath,
        status: result.status,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
        error: result.error?.message ?? null,
      },
    );
  }
  return {
    id: spec.id,
    repository: spec.repository,
    repositoryPath: spec.repositoryPath,
    stdout: String(result.stdout ?? "").trim(),
  };
}

export async function installApprovedExternalSkills({
  dataRoot: dataRootOverride,
  skillsRoot,
  consent = false,
  installSkill = installWithBundledHelper,
} = {}) {
  const before = await externalSkillsStatus({
    dataRoot: dataRootOverride,
    skillsRoot,
  });
  if (before.missing.length === 0) {
    return { ok: true, installedNow: [], status: before };
  }
  if (before.consent.decision === "declined") {
    throw new CliError(
      "External skills were previously declined. YanShu will continue without them.",
      "external_skills_declined",
      { missing: before.missing },
    );
  }
  if (!before.consent.authorized && !consent) {
    throw new CliError(
      "One-time consent is required before installing the two allowlisted external skills.",
      "external_skills_consent_required",
      {
        skills: EXTERNAL_SKILL_REGISTRY,
        instruction:
          "Ask once, then rerun with --consent true or record declined.",
      },
    );
  }

  const installedNow = [];
  for (const spec of EXTERNAL_SKILL_REGISTRY) {
    if (!before.missing.includes(spec.id)) continue;
    installedNow.push(
      await installSkill(spec, {
        destination: before.installRoot,
      }),
    );
  }
  const after = await externalSkillsStatus({
    dataRoot: dataRootOverride,
    skillsRoot,
  });
  if (after.missing.length > 0) {
    throw new CliError(
      "The installer returned but one or more approved skills are still missing.",
      "external_skill_install_unverified",
      { missing: after.missing, installedNow },
    );
  }
  const receipt = before.consent.authorized
    ? null
    : await recordExternalSkillDecision({
        dataRoot: dataRootOverride,
        decision: "accepted",
      });
  return {
    ok: true,
    installedNow,
    receipt,
    status: await externalSkillsStatus({
      dataRoot: dataRootOverride,
      skillsRoot,
    }),
    note:
      "Only the two allowlisted sub-skill paths were installed; no repository-wide install was performed.",
  };
}
