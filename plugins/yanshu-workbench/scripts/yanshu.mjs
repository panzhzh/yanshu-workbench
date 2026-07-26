#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  CHAT_REASONING_PREFERENCES,
  parseVisibleChatOptions,
  resolveChatPreference,
} from "./lib/chat-preferences.mjs";
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
  summarizeRun,
} from "./lib/run-store.mjs";
import {
  mcpSessionStatus,
  startMcpSession,
  stopMcpSession,
} from "./lib/mcp-session.mjs";
import { workspaceCapabilities } from "./lib/mcp-workspace.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(scriptDirectory, "..");

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
      mark: "Record round status and visible Chat thread metadata.",
      artifact: "Copy one downloaded artifact into a round output directory.",
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
  return import(enginePath);
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
  return {
    ok: projectExists && nodeMajor >= 22 && !inputError,
    checks: {
      node: {
        ok: nodeMajor >= 22,
        version: process.versions.node,
        required: ">=22",
      },
      project: { ok: projectExists, path: project },
      inputs: {
        ok: !inputError,
        detected: inputs,
        error: inputError,
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
      mcpWorkspace: {
        bundled: true,
        capabilities: workspaceCapabilities(),
        note:
          "The local workspace can read approved TeX/Bib files, return real figure and rendered PDF-page images, save versioned round outputs, and compile LaTeX.",
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
    fileConfig.workflow?.hasWordLimit === false
      ? "none"
      : String(fileConfig.workflow?.targetWords ?? ""),
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
    fileConfig.workflow?.unlimitedCoreSections ?? false,
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
  };

  const engine = await loadPromptEngine();
  const workflow = engine.buildReconstructionWorkflow({
    language,
    roundLanguages: fileConfig.workflow?.roundLanguages,
    styleId,
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets: fileConfig.workflow?.sectionBudgets,
    includeAppendix,
    frameworkFigure,
    chatExecution,
  });
  const state = await createRun({
    projectRoot,
    outputRoot: stringFlag(flags, "output", fileConfig.outputRoot),
    runId: stringFlag(flags, "run-id", fileConfig.runId),
    inputs,
    workflow,
  });
  return {
    ok: true,
    ...summarizeRun(state),
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
      promptPath: path.join(state.runPath, round.promptPath),
      outputDirectory: path.join(
        state.runPath,
        round.directory,
        "output",
      ),
      chat: round.chat,
    },
    approvedAttachments: await roundAttachments(state, round.id),
    mcpWorkspace: {
      available: true,
      startCommand:
        "Run `mcp-start --run <run-path>` and use its bootstrapPrompt in the visible Chat conversation. If the Chat surface cannot use the YanShu MCP connection, fall back to approvedAttachments.",
    },
    chatExecution: state.config.chatExecution,
    instruction:
      "Prepare a fresh visible Chat thread before configuration, inspect and resolve reasoning with `chat-plan`, apply it with the YanShu Chat-round protocol, submit to that same prepared thread exactly once, preserve the returned thread URL, and poll/read the same thread after timeouts.",
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
  const requested = enumFlag(
    flags,
    "requested",
    CHAT_REASONING_PREFERENCES,
    state.config.chatExecution?.reasoningPreference ?? "strongest",
  );
  const visibleOptions = parseVisibleChatOptions(
    requiredFlag(flags, "visible"),
  );
  return {
    ok: true,
    ...resolveChatPreference({ requested, visibleOptions }),
    visibleOptions,
    fallbackPolicy:
      state.config.chatExecution?.fallbackPolicy ??
      "closest-lower-then-strongest",
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
      note: stringFlag(flags, "note"),
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
  );
  return {
    ok: true,
    artifact: destination,
    run: summarizeRun(state),
  };
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
    case "mark":
      result = await mark(flags);
      break;
    case "artifact":
      result = await artifact(flags);
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
