#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  booleanFlag,
  CliError,
  enumFlag,
  numberFlag,
  parseArgs,
  printJson,
  requiredFlag,
  stringFlag,
} from "./lib/cli.mjs";
import {
  CHAT_INTERACTION_KINDS,
  CHAT_REASONING_PREFERENCES,
  parseVisibleChatOptions,
  resolveChatPreference,
  resolveEffectiveChatPreference,
} from "./lib/chat-preferences.mjs";
import {
  artifactBundleSpec,
  importArtifactBundle,
} from "./lib/artifact-bundle.mjs";
import {
  checkPublishedPromptRelease,
  OFFICIAL_RECONSTRUCTION_URL,
} from "./lib/prompt-release.mjs";
import {
  onboardingStatus,
  startOnboardingSession,
} from "./lib/onboarding-store.mjs";
import {
  bridgeHints,
  createRun,
  loadRun,
  markRound,
  nextRound,
  pathExists,
  registerArtifact,
  resolvePaperInputs,
  roundAttachments,
  saveRun,
  summarizeRun,
} from "./lib/run-store.mjs";
import {
  mcpSessionStatus,
  startMcpSession,
  stopMcpSession,
} from "./lib/mcp-session.mjs";
import {
  finalizeRound,
  workspaceCapabilities,
} from "./lib/mcp-workspace.mjs";
import {
  autoUpdatePlugin,
  comparePluginVersions,
  discoverInstalledPluginRoots,
  discoverMarketplaceSnapshot,
  refreshMarketplaceSnapshot,
  relaunchUpdatedRuntime,
} from "./lib/plugin-update.mjs";
import {
  readSupportStatus,
  recordSupportStatus,
  SUPPORT_STATUSES,
} from "./lib/support-state.mjs";
import {
  EXTERNAL_SKILL_DECISIONS,
  externalSkillsStatus,
  installApprovedExternalSkills,
  recordExternalSkillDecision,
} from "./lib/external-skills.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(scriptDirectory, "..");
const pluginManifest = JSON.parse(
  await readFile(
    path.join(pluginRoot, ".codex-plugin", "plugin.json"),
    "utf8",
  ),
);

function help() {
  return {
    name: "yanshu",
    usage: "node scripts/yanshu.mjs <command> [options]",
    commands: {
      doctor:
        "Check the local runtime and paper inputs without changing manuscript files.",
      "configure-start":
        "Open the local one-page configuration UI for a confirmed full-automation paper.",
      "configure-status":
        "Read whether the local configuration page is waiting, confirmed, cancelled, or expired.",
      "workflow-configure-start":
        "Open the shared local configuration page for Idea Discovery, Paper Drafting, or Scientific Figure.",
      "workflow-configure-status":
        "Read whether a shared workflow configuration page is waiting, confirmed, cancelled, or expired.",
      init: "Create a resumable five-round reconstruction run.",
      status: "Read compact progress for an existing run.",
      next: "Return the next round, prompt, and approved attachments.",
      "mcp-start":
        "Start a run-scoped YanShu MCP workspace for TeX, PDF-page, figure, write, and compile tools.",
      "mcp-status":
        "Check whether the run-scoped YanShu MCP workspace is reachable.",
      "mcp-stop": "Stop the run-scoped YanShu MCP workspace.",
      "chat-plan":
        "Resolve a saved reasoning preference against ChatGPT options currently visible to the user.",
      "version-handshake":
        "Compare plugin, workflow, marketplace, and loaded runtime versions; update automatically when required.",
      "support-status":
        "Read the one-time optional GitHub support receipt without accessing GitHub.",
      "support-record":
        "Record the completed, declined, or unavailable one-time GitHub support action.",
      "external-skills-status":
        "Detect the two optional, allowlisted writing and figure skills and read the one-time consent receipt.",
      "external-skills-install":
        "Install exactly the two missing allowlisted sub-skills after one-time consent.",
      "external-skills-record":
        "Record a one-time accepted or declined external-skill decision.",
      mark: "Record round status and visible Chat thread metadata.",
      artifact: "Copy one downloaded artifact into a round output directory.",
      "artifact-bundle":
        "Validate and import one round ZIP into its exact TeX, report, and BibTeX artifacts.",
      "round-finalize":
        "Import, compile, deterministically validate, and atomically complete one round.",
    },
  };
}

function executableAvailable(command) {
  const probe =
    process.platform === "win32"
      ? spawnSync("where.exe", [command], { encoding: "utf8" })
      : spawnSync("sh", ["-lc", `command -v ${command}`], {
          encoding: "utf8",
        });
  return probe.status === 0;
}

async function loadConfig(flags) {
  const configPath = stringFlag(flags, "config");
  if (!configPath) return {};
  const resolved = path.resolve(configPath);
  if (!(await pathExists(resolved))) {
    throw new CliError(`Config file does not exist: ${resolved}`);
  }
  return JSON.parse(await readFile(resolved, "utf8"));
}

async function loadPromptEngine() {
  const enginePath = path.join(pluginRoot, "runtime", "prompt-engine.mjs");
  if (!(await pathExists(enginePath))) {
    throw new CliError(
      "The bundled prompt engine is missing. Rebuild the plugin runtime before use.",
      "missing_runtime",
    );
  }
  return import(pathToFileURL(enginePath).href);
}

async function loadSkillWorkflowEngine() {
  const enginePath = path.join(
    pluginRoot,
    "runtime",
    "skill-workflow-engine.mjs",
  );
  if (!(await pathExists(enginePath))) {
    throw new CliError(
      "The bundled skill workflow engine is missing. Rebuild the plugin runtime before use.",
      "missing_skill_workflow_runtime",
    );
  }
  return import(pathToFileURL(enginePath).href);
}

async function probeDynamicImportPaths() {
  const root = await mkdtemp(path.join(tmpdir(), "yanshu-import-"));
  try {
    const directory = path.join(root, "space 中文 path");
    await mkdir(directory, { recursive: true });
    const modulePath = path.join(directory, "probe.mjs");
    await writeFile(modulePath, "export const ready = true;\n", "utf8");
    const loaded = await import(
      `${pathToFileURL(modulePath).href}?t=${Date.now()}`
    );
    return {
      ok: loaded.ready === true,
      modulePath,
      usedFileUrl: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function doctor(flags) {
  const project = path.resolve(stringFlag(flags, "project", process.cwd()));
  const projectExists = await pathExists(project);
  let inputs = null;
  let inputError = null;
  if (projectExists) {
    try {
      inputs = await resolvePaperInputs(project, {
        tex: stringFlag(flags, "tex"),
        bib: stringFlag(flags, "bib"),
        pdf: stringFlag(flags, "pdf"),
        figures: stringFlag(flags, "figures"),
      });
    } catch (error) {
      inputError = error instanceof Error ? error.message : String(error);
    }
  }

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const dynamicImportPaths = await probeDynamicImportPaths();
  let promptRuntime;
  let skillWorkflowRuntime;
  try {
    const engine = await loadPromptEngine();
    const workflow = engine.buildReconstructionWorkflow({
      hasWordLimit: false,
    });
    promptRuntime = {
      ok: true,
      workflowVersion: workflow.workflowVersion,
      generatedFrom:
        "site/content/prompts plus site/app/figures canonical sources",
    };
  } catch (error) {
    promptRuntime = {
      ok: false,
      workflowVersion: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  try {
    const engine = await loadSkillWorkflowEngine();
    const workflows = engine.CONFIGURABLE_SKILL_WORKFLOW_IDS.map((id) => {
      const built = engine.buildSkillWorkflowConfiguration(id, {}, "zh");
      return {
        id,
        workflowVersion: built.workflowVersion,
        promptLength: built.prompt.length,
      };
    });
    skillWorkflowRuntime = {
      ok: workflows.every((item) => item.promptLength > 0),
      workflows,
      generatedFrom:
        "site Idea Discovery, Paper Drafting, and Scientific Figure canonical configuration sources",
    };
  } catch (error) {
    skillWorkflowRuntime = {
      ok: false,
      workflows: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
  const promptRelease = promptRuntime.ok
    ? await checkPublishedPromptRelease(promptRuntime.workflowVersion)
    : {
        ok: false,
        status: "runtime-unavailable",
        installedVersion: null,
        publishedVersion: null,
        officialUrl: OFFICIAL_RECONSTRUCTION_URL,
      };
  const marketplaceSnapshot = await discoverMarketplaceSnapshot();
  const externalSkills = await externalSkillsStatus();
  return {
    ok:
      projectExists &&
      nodeMajor >= 22 &&
      !inputError &&
      promptRuntime.ok &&
      skillWorkflowRuntime.ok &&
      dynamicImportPaths.ok &&
      promptRelease.ok,
    checks: {
      node: {
        ok: nodeMajor >= 22,
        version: process.versions.node,
        required: ">=22",
        executable:
          process.env.YANSHU_RESOLVED_NODE ?? process.execPath,
        selectedByLauncher:
          process.env.YANSHU_RESOLVED_NODE !== undefined,
      },
      project: { ok: projectExists, path: project },
      inputs: {
        ok: !inputError,
        detected: inputs,
        error: inputError,
      },
      promptRuntime,
      skillWorkflowRuntime,
      promptRelease,
      dynamicImportPaths,
      versionHandshake: {
        pluginVersion: pluginManifest.version,
        workflowVersion: promptRuntime.workflowVersion,
        publishedWorkflowVersion: promptRelease.publishedVersion,
        marketplacePluginVersion:
          marketplaceSnapshot?.pluginVersion ?? null,
        marketplaceRevision:
          marketplaceSnapshot?.revision ?? null,
        status: promptRelease.status,
        automaticUpdate:
          "New runs automatically refresh and relaunch an older installed plugin. Resumed runs keep their saved Prompt snapshot.",
      },
      latex: {
        latexmk: executableAvailable("latexmk"),
        pdflatex: executableAvailable("pdflatex"),
        xelatex: executableAvailable("xelatex"),
        requiredNow: false,
        note:
          "A TeX engine is optional at initialization and required only for automatic compilation.",
      },
      chatBridge: bridgeHints(),
      attachmentFallback: {
        mimePolicy: {
          ".tex": "text/plain",
          ".bib": "text/plain",
          unknown: "application/octet-stream",
        },
        realTransportProbe:
          "The visible zero-content .tex/.bib attachment probe runs automatically after an MCP handshake fallback.",
      },
      mcpWorkspace: {
        bundled: true,
        capabilities: workspaceCapabilities(),
        note:
          "The local workspace can read approved TeX/Bib files, return real figure and rendered PDF-page images, save versioned round outputs, and compile LaTeX.",
      },
      externalSkills: {
        ...externalSkills,
        requiredNow: false,
        note:
          "Optional for Paper Drafting and Experimental Plotting only; Scientific Figure remains on YanShu's visible-ChatGPT drawing workflow.",
      },
    },
  };
}

async function configureStart(flags) {
  const fileConfig = await loadConfig(flags);
  const projectRoot = path.resolve(
    stringFlag(flags, "project", fileConfig.projectRoot ?? process.cwd()),
  );
  if (!(await pathExists(projectRoot))) {
    throw new CliError(`Project directory does not exist: ${projectRoot}`);
  }
  const inputs = await resolvePaperInputs(projectRoot, {
    tex: stringFlag(flags, "tex", fileConfig.inputs?.tex),
    bib: stringFlag(flags, "bib", fileConfig.inputs?.bib),
    pdf: stringFlag(flags, "pdf", fileConfig.inputs?.pdf),
    figures: stringFlag(flags, "figures", fileConfig.inputs?.figures),
  });
  const uiLanguage = enumFlag(
    flags,
    "ui-language",
    ["zh", "en"],
    fileConfig.workflow?.language ?? "zh",
  );
  return startOnboardingSession({
    pluginRoot,
    projectRoot,
    inputs,
    uiLanguage,
    prefillWorkflow: fileConfig.workflow ?? {},
    openBrowser: booleanFlag(flags, "open", true),
  });
}

async function configureStatus(flags) {
  return onboardingStatus(requiredFlag(flags, "session"));
}

async function workflowConfigureStart(flags) {
  const fileConfig = await loadConfig(flags);
  const projectRoot = path.resolve(
    stringFlag(flags, "project", fileConfig.projectRoot ?? process.cwd()),
  );
  if (!(await pathExists(projectRoot))) {
    throw new CliError(`Workspace directory does not exist: ${projectRoot}`);
  }
  const workflowId = enumFlag(
    flags,
    "workflow",
    ["idea-discovery", "paper-drafting", "scientific-figure"],
    fileConfig.workflowId,
  );
  if (!workflowId) {
    throw new CliError(
      "Missing required option --workflow.",
      "missing_workflow",
    );
  }
  const uiLanguage = enumFlag(
    flags,
    "ui-language",
    ["zh", "en"],
    fileConfig.uiLanguage ?? fileConfig.promptLanguage ?? "zh",
  );
  return startOnboardingSession({
    pluginRoot,
    projectRoot,
    inputs: fileConfig.inputs ?? {},
    workflowId,
    uiLanguage,
    prefillWorkflow: fileConfig.preferences ?? {},
    openBrowser: booleanFlag(flags, "open", true),
  });
}

async function workflowConfigureStatus(flags) {
  return onboardingStatus(requiredFlag(flags, "session"));
}

async function init(flags) {
  const fileConfig = await loadConfig(flags);
  const projectRoot = path.resolve(
    stringFlag(flags, "project", fileConfig.projectRoot ?? process.cwd()),
  );
  if (!(await pathExists(projectRoot))) {
    throw new CliError(`Project directory does not exist: ${projectRoot}`);
  }

  const inputs = await resolvePaperInputs(projectRoot, {
    tex: stringFlag(flags, "tex", fileConfig.inputs?.tex),
    bib: stringFlag(flags, "bib", fileConfig.inputs?.bib),
    pdf: stringFlag(flags, "pdf", fileConfig.inputs?.pdf),
    figures: stringFlag(flags, "figures", fileConfig.inputs?.figures),
  });
  const styleId = enumFlag(
    flags,
    "style",
    ["conference", "journal"],
    fileConfig.workflow?.styleId ?? "conference",
  );
  const language = enumFlag(
    flags,
    "language",
    ["zh", "en"],
    fileConfig.workflow?.language ?? "zh",
  );
  const lengthValue = stringFlag(
    flags,
    "word-limit",
    fileConfig.workflow?.hasWordLimit === true
      ? String(fileConfig.workflow?.targetWords ?? "")
      : "none",
  );
  const hasWordLimit = lengthValue !== "none";
  const targetWords =
    hasWordLimit && lengthValue
      ? Number(lengthValue)
      : fileConfig.workflow?.targetWords;
  if (hasWordLimit && targetWords !== undefined && !Number.isFinite(targetWords)) {
    throw new CliError("--word-limit must be a number or 'none'.");
  }
  const includeAppendix = booleanFlag(
    flags,
    "appendix",
    fileConfig.workflow?.includeAppendix ?? styleId === "conference",
  );
  const unlimitedCoreSections = booleanFlag(
    flags,
    "unlimited-core",
    fileConfig.workflow?.unlimitedCoreSections ?? true,
  );
  const includeSectionNavigationSentence = booleanFlag(
    flags,
    "introduction-roadmap",
    fileConfig.workflow?.includeSectionNavigationSentence ??
      styleId === "journal",
  );
  const frameworkFigure = {
    aspectRatioId: enumFlag(
      flags,
      "figure-ratio",
      [
        "landscape-4-3",
        "landscape-3-2",
        "landscape-16-9",
        "landscape-2-1",
        "portrait-3-4",
        "portrait-9-16",
        "custom",
      ],
      fileConfig.workflow?.frameworkFigure?.aspectRatioId ??
        "landscape-2-1",
    ),
    customAspectWidth: numberFlag(
      flags,
      "figure-ratio-width",
      fileConfig.workflow?.frameworkFigure?.customAspectWidth ?? 2,
    ),
    customAspectHeight: numberFlag(
      flags,
      "figure-ratio-height",
      fileConfig.workflow?.frameworkFigure?.customAspectHeight ?? 1,
    ),
  };
  const chatExecution = {
    ...fileConfig.workflow?.chatExecution,
    reasoningPreference: enumFlag(
      flags,
      "reasoning",
      CHAT_REASONING_PREFERENCES,
      fileConfig.workflow?.chatExecution?.reasoningPreference ?? "strongest",
    ),
    forceProForAllTurns: booleanFlag(
      flags,
      "force-all-pro",
      fileConfig.workflow?.chatExecution?.forceProForAllTurns ?? false,
    ),
  };

  const engine = await loadPromptEngine();
  const workflow = engine.buildReconstructionWorkflow({
    language,
    roundLanguages: fileConfig.workflow?.roundLanguages,
    styleId,
    hasWordLimit,
    unlimitedCoreSections,
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets: fileConfig.workflow?.sectionBudgets,
    includeAppendix,
    frameworkFigure,
    chatExecution,
  });
  const promptRelease = await checkPublishedPromptRelease(
    workflow.workflowVersion,
  );
  const marketplaceRefresh = await refreshMarketplaceSnapshot();
  const marketplaceSnapshot =
    marketplaceRefresh.snapshot ??
    (await discoverMarketplaceSnapshot());
  const marketplaceRuntimeIsNewer =
    marketplaceSnapshot?.pluginVersion &&
    comparePluginVersions(
      marketplaceSnapshot.pluginVersion,
      pluginManifest.version,
    ) > 0;
  if (
    promptRelease.status === "installed-older" ||
    marketplaceRuntimeIsNewer
  ) {
    if (process.env.YANSHU_AUTO_UPDATE_ATTEMPTED === "1") {
      throw new CliError(
        "YanShu updated automatically, but the refreshed runtime is still older than the available release.",
        "plugin_auto_update_still_stale",
        { promptRelease, marketplaceSnapshot },
      );
    }
    const update = await autoUpdatePlugin();
    return relaunchUpdatedRuntime({
      pluginRoot: update.installed.root,
      argv: process.argv.slice(2),
      loadedSkillVersion: pluginManifest.version,
    });
  }
  const installed = await discoverInstalledPluginRoots();
  const state = await createRun({
    projectRoot,
    outputRoot: stringFlag(flags, "output", fileConfig.outputRoot),
    runId: stringFlag(flags, "run-id", fileConfig.runId),
    inputs,
    workflow,
    runtimeVersions: {
      pluginVersion: pluginManifest.version,
      loadedSkillVersion:
        process.env.YANSHU_LOADED_SKILL_VERSION ??
        pluginManifest.version,
      marketplaceVersion:
        marketplaceSnapshot?.pluginVersion ??
        installed[0]?.version ??
        pluginManifest.version,
      marketplaceRevision:
        marketplaceSnapshot?.revision ?? null,
    },
  });
  return {
    ok: true,
    ...summarizeRun(state),
    promptRelease,
    next:
      "Run `next` for the first prompt and approved attachment list. Do not upload any path not listed there.",
  };
}

async function status(flags) {
  return summarizeRun(await loadRun(requiredFlag(flags, "run")));
}

async function next(flags) {
  const state = await loadRun(requiredFlag(flags, "run"));
  const round = nextRound(state);
  if (!round) {
    return {
      ok: true,
      complete: true,
      ...summarizeRun(state),
    };
  }
  return {
    ok: true,
    complete: false,
    runId: state.runId,
    runPath: state.runPath,
    round: {
      id: round.id,
      number: round.number,
      title: round.title,
      purpose: round.purpose,
      status: round.status,
      checkpoint: round.checkpoint,
      promptPath: path.join(state.runPath, round.promptPath),
      outputDirectory: path.join(
        state.runPath,
        round.directory,
        "output",
      ),
      chat: round.chat,
    },
    approvedAttachments: await roundAttachments(state, round.id),
    artifactBundle: artifactBundleSpec(round, state.workflowVersion),
    mcpWorkspace: {
      available: true,
      startCommand:
        "Run `mcp-start --run <run-path>`, then perform the zero-sensitive visible MCP handshake. YanShu automatically switches to a verified approvedAttachments fallback when that handshake is unavailable.",
    },
    execution: state.execution,
    statusPath: path.join(state.runPath, "STATUS.md"),
    chatExecution: state.config.chatExecution,
    instruction:
      "Use the automatic transfer-mode handshake, prepare a fresh visible Chat thread for this round, resolve reasoning with `chat-plan`, submit exactly once, preserve the returned thread URL, and let the runtime monitor that same assistant turn after heartbeat timeouts.",
  };
}

async function mcpStart(flags) {
  return startMcpSession({
    pluginRoot,
    runPath: requiredFlag(flags, "run"),
    port: numberFlag(flags, "port", 0),
  });
}

async function mcpStatus(flags) {
  return mcpSessionStatus(requiredFlag(flags, "run"));
}

async function mcpStop(flags) {
  return stopMcpSession(requiredFlag(flags, "run"));
}

async function chatPlan(flags) {
  const state = await loadRun(requiredFlag(flags, "run"));
  const engine = await loadPromptEngine();
  const configured = enumFlag(
    flags,
    "requested",
    CHAT_REASONING_PREFERENCES,
    state.config.chatExecution?.reasoningPreference ?? "strongest",
  );
  const activeRound = nextRound(state);
  const interactionKind = enumFlag(
    flags,
    "interaction",
    CHAT_INTERACTION_KINDS,
    activeRound?.checkpoint === "configured" ? "initial" : "follow-up",
  );
  const forceProForAllTurns = booleanFlag(
    flags,
    "force-all-pro",
    state.config.chatExecution?.forceProForAllTurns ?? false,
  );
  const effectivePolicy = resolveEffectiveChatPreference({
    configured,
    interactionKind,
    forceProForAllTurns,
  });
  const visibleOptions = parseVisibleChatOptions(
    requiredFlag(flags, "visible"),
  );
  const pollingPolicy =
    state.config.chatExecution?.pollingPolicy ??
    engine.getReconstructionConfigurationModel().chatExecution
      .pollingPolicy;
  const resolved = resolveChatPreference({
    requested: effectivePolicy.effective,
    visibleOptions,
    pollingPolicy,
  });
  return {
    ok: true,
    ...resolved,
    configuredReasoningPreference: effectivePolicy.configured,
    effectiveReasoningPreference: effectivePolicy.effective,
    interactionKind: effectivePolicy.interactionKind,
    forceProForAllTurns: effectivePolicy.forceProForAllTurns,
    proPolicyApplied: effectivePolicy.policyApplied,
    proPolicyNotice: effectivePolicy.notice,
    visibleOptions,
    fallbackPolicy:
      state.config.chatExecution?.fallbackPolicy ??
      "closest-lower-then-strongest",
  };
}

async function versionHandshake(flags) {
  const engine = await loadPromptEngine();
  const workflow = engine.buildReconstructionWorkflow({
    hasWordLimit: false,
  });
  const promptRelease = await checkPublishedPromptRelease(
    workflow.workflowVersion,
  );
  const runPath = stringFlag(flags, "run");
  const run = runPath ? await loadRun(runPath) : null;
  const marketplaceRefresh = await refreshMarketplaceSnapshot();
  const marketplaceSnapshot =
    marketplaceRefresh.snapshot ??
    (await discoverMarketplaceSnapshot());
  const marketplaceRuntimeIsNewer =
    marketplaceSnapshot?.pluginVersion &&
    comparePluginVersions(
      marketplaceSnapshot.pluginVersion,
      pluginManifest.version,
    ) > 0;
  if (
    promptRelease.status === "installed-older" ||
    marketplaceRuntimeIsNewer
  ) {
    if (process.env.YANSHU_AUTO_UPDATE_ATTEMPTED === "1") {
      throw new CliError(
        "The automatically refreshed YanShu runtime still does not match the available release.",
        "plugin_auto_update_still_stale",
        { promptRelease, marketplaceSnapshot },
      );
    }
    const update = await autoUpdatePlugin();
    return relaunchUpdatedRuntime({
      pluginRoot: update.installed.root,
      argv: process.argv.slice(2),
      loadedSkillVersion: pluginManifest.version,
    });
  }
  if (run) {
    run.runtimeVersions = {
      ...(run.runtimeVersions ?? {}),
      executionPluginVersion: pluginManifest.version,
      loadedSkillVersion:
        process.env.YANSHU_LOADED_SKILL_VERSION ??
        pluginManifest.version,
      marketplaceVersion:
        marketplaceSnapshot?.pluginVersion ??
        run.runtimeVersions?.marketplaceVersion ??
        null,
      marketplaceRevision:
        marketplaceSnapshot?.revision ??
        run.runtimeVersions?.marketplaceRevision ??
        null,
      lastHandshakeAt: new Date().toISOString(),
    };
    await saveRun(run);
  }
  return {
    ok: true,
    status: promptRelease.status,
    pluginVersion: pluginManifest.version,
    loadedSkillVersion:
      process.env.YANSHU_LOADED_SKILL_VERSION ??
      pluginManifest.version,
    marketplacePluginVersion:
      marketplaceSnapshot?.pluginVersion ?? null,
    marketplaceRevision:
      marketplaceSnapshot?.revision ?? null,
    marketplaceRefresh: {
      ok: marketplaceRefresh.ok,
      error:
        marketplaceRefresh.ok
          ? null
          : marketplaceRefresh.error ??
            marketplaceRefresh.upgrade?.error ??
            marketplaceRefresh.upgrade?.stderr ??
            "Marketplace refresh unavailable.",
    },
    runtimeWorkflowVersion: workflow.workflowVersion,
    publishedWorkflowVersion: promptRelease.publishedVersion,
    runWorkflowVersion: run?.workflowVersion ?? null,
    resumePolicy: run
      ? "The compatible execution runtime is current; this run keeps its saved Prompt snapshot."
      : "A new run will use the current canonical Prompt snapshot.",
  };
}

async function mark(flags) {
  const state = await loadRun(requiredFlag(flags, "run"));
  const round = await markRound(
    state,
    requiredFlag(flags, "round"),
    {
      status: enumFlag(
        flags,
        "status",
        ["pending", "running", "waiting", "completed", "failed", "blocked"],
        "pending",
      ),
      threadUrl: stringFlag(flags, "thread-url"),
      experience: stringFlag(flags, "experience"),
      model: stringFlag(flags, "model"),
      effort: stringFlag(flags, "effort"),
      configurationVerification: stringFlag(
        flags,
        "configuration-verification",
      ),
      assistantTurn: numberFlag(flags, "assistant-turn"),
      transferMode: stringFlag(flags, "transfer-mode"),
      note: stringFlag(flags, "note"),
      checkpoint: stringFlag(flags, "checkpoint"),
    },
    booleanFlag(flags, "force", false),
  );
  return {
    ok: true,
    round: {
      id: round.id,
      number: round.number,
      status: round.status,
      chat: round.chat,
      outputs: round.outputs,
      checkpoint: round.checkpoint,
    },
    run: summarizeRun(state),
  };
}

async function artifact(flags) {
  const state = await loadRun(requiredFlag(flags, "run"));
  const destination = await registerArtifact(
    state,
    requiredFlag(flags, "round"),
    requiredFlag(flags, "file"),
    booleanFlag(flags, "replace", false),
    {
      destinationName: stringFlag(flags, "name"),
      reason: stringFlag(
        flags,
        "reason",
        "individual ChatGPT artifact import",
      ),
      chatTurn: stringFlag(flags, "chat-turn"),
    },
  );
  return {
    ok: true,
    artifact: destination,
    run: summarizeRun(state),
  };
}

async function artifactBundle(flags) {
  const state = await loadRun(requiredFlag(flags, "run"));
  const imported = await importArtifactBundle({
    state,
    selector: requiredFlag(flags, "round"),
    bundlePath: requiredFlag(flags, "file"),
    replace: booleanFlag(flags, "replace", false),
    reason: stringFlag(
      flags,
      "reason",
      "ChatGPT artifact bundle import",
    ),
    chatTurn: stringFlag(flags, "chat-turn"),
  });
  return {
    ok: true,
    ...imported,
    run: summarizeRun(state),
  };
}

async function roundFinalize(flags) {
  const result = await finalizeRound({
    runPath: requiredFlag(flags, "run"),
    round: requiredFlag(flags, "round"),
    bundlePath: stringFlag(flags, "bundle"),
    replace: booleanFlag(flags, "replace", false),
    compile: booleanFlag(flags, "compile", true),
    texArtifactId: stringFlag(flags, "tex-artifact-id"),
    reason: stringFlag(flags, "reason", "round finalization"),
    chatTurn: stringFlag(flags, "chat-turn"),
    note: stringFlag(flags, "note"),
  });
  return { ok: true, ...result };
}

async function supportStatus(flags) {
  return readSupportStatus({
    dataRoot: stringFlag(flags, "data-root"),
  });
}

async function supportRecord(flags) {
  return recordSupportStatus({
    dataRoot: stringFlag(flags, "data-root"),
    status: enumFlag(flags, "status", SUPPORT_STATUSES),
  });
}

async function externalSkillStatus(flags) {
  return externalSkillsStatus({
    dataRoot: stringFlag(flags, "data-root"),
    skillsRoot: stringFlag(flags, "skills-root"),
  });
}

async function externalSkillInstall(flags) {
  return installApprovedExternalSkills({
    dataRoot: stringFlag(flags, "data-root"),
    skillsRoot: stringFlag(flags, "skills-root"),
    consent: booleanFlag(flags, "consent", false),
  });
}

async function externalSkillRecord(flags) {
  return recordExternalSkillDecision({
    dataRoot: stringFlag(flags, "data-root"),
    decision: enumFlag(
      flags,
      "decision",
      EXTERNAL_SKILL_DECISIONS,
    ),
  });
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  let result;
  switch (command) {
    case "help":
    case "--help":
    case "-h":
      result = help();
      break;
    case "doctor":
      result = await doctor(flags);
      break;
    case "configure-start":
      result = await configureStart(flags);
      break;
    case "configure-status":
      result = await configureStatus(flags);
      break;
    case "workflow-configure-start":
      result = await workflowConfigureStart(flags);
      break;
    case "workflow-configure-status":
      result = await workflowConfigureStatus(flags);
      break;
    case "init":
      result = await init(flags);
      break;
    case "status":
      result = await status(flags);
      break;
    case "next":
      result = await next(flags);
      break;
    case "mcp-start":
      result = await mcpStart(flags);
      break;
    case "mcp-status":
      result = await mcpStatus(flags);
      break;
    case "mcp-stop":
      result = await mcpStop(flags);
      break;
    case "chat-plan":
      result = await chatPlan(flags);
      break;
    case "version-handshake":
      result = await versionHandshake(flags);
      break;
    case "support-status":
      result = await supportStatus(flags);
      break;
    case "support-record":
      result = await supportRecord(flags);
      break;
    case "external-skills-status":
      result = await externalSkillStatus(flags);
      break;
    case "external-skills-install":
      result = await externalSkillInstall(flags);
      break;
    case "external-skills-record":
      result = await externalSkillRecord(flags);
      break;
    case "mark":
      result = await mark(flags);
      break;
    case "artifact":
      result = await artifact(flags);
      break;
    case "artifact-bundle":
      result = await artifactBundle(flags);
      break;
    case "round-finalize":
      result = await roundFinalize(flags);
      break;
    default:
      throw new CliError(`Unknown command: ${command}`);
  }
  printJson(result);
}

main().catch((error) => {
  const cliError =
    error instanceof CliError
      ? error
      : new CliError(
          error instanceof Error ? error.message : String(error),
          "internal_error",
        );
  printJson({
    ok: false,
    error: {
      code: cliError.code,
      message: cliError.message,
      details: cliError.details,
    },
  });
  process.exitCode = 1;
});
