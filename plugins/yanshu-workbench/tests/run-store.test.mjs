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
import { buildReconstructionWorkflow } from "../runtime/prompt-engine.mjs";
import { importChatGPTControl } from "../vendor/chatgpt-control/import-chatgpt-control.mjs";
import {
  applyChatReasoningSelection,
  inspectFreshChatConfiguration,
  openFreshChatRound,
  submitPreparedChatRound,
} from "../scripts/lib/chat-round-protocol.mjs";
import { resolveChatPreference } from "../scripts/lib/chat-preferences.mjs";
import {
  onboardingStatus,
  startOnboardingSession,
} from "../scripts/lib/onboarding-store.mjs";
import {
  createRun,
  markRound,
  nextRound,
  registerArtifact,
  resolvePaperInputs,
  roundAttachments,
  summarizeRun,
} from "../scripts/lib/run-store.mjs";

test("pinned visible Chat bridge bundle loads without external packages", async () => {
  const runtime = await importChatGPTControl({ cacheBust: false });
  assert.equal(typeof runtime.createChatGPT, "function");
});

test("visible Chat bridge prefers the verified chooser and keeps native file paste as fallback", async () => {
  const bundle = await readFile(
    new URL(
      "../vendor/chatgpt-control/node/codex-chatgpt-control.bundle.mjs",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(bundle, /native-file-clipboard-paste/);
  assert.ok(
    bundle.indexOf('name: "add-photos-files-menu-item"') <
      bundle.indexOf('name: "native-file-clipboard-paste"'),
  );
  assert.match(bundle, /Clipboard\]::SetFileDropList/);
  assert.match(bundle, /textbox\.press\("Control\+V"/);
  assert.match(bundle, /div\.__menu-item\[tabindex='0'\]/);
  assert.match(bundle, /route: attempt\.name/);
  assert.match(bundle, /route: "already-attached"/);
  assert.doesNotMatch(bundle, /snapshot === void 0\) \{\s*return \{ ready: true \}/);
  assert.doesNotMatch(bundle, /direct-file-input-set/);
});

test("attachment verification accepts ChatGPT duplicate suffixes without weakening the original name", async () => {
  const runtime = await importChatGPTControl({ cacheBust: true });

  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main (1).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main(12).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex (2)"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main (1).tex", "main (1) (2).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "domain.tex"), false);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex.backup"), false);
});

test("attachment verification consumes visible filename occurrences as a multiset", async () => {
  const runtime = await importChatGPTControl({ cacheBust: true });
  const matches = runtime.matchAttachmentDisplayNames(
    ["main.tex", "main.tex", "references.bib"],
    ["main.tex · main (1).tex · references (3).bib"],
  );

  assert.deepEqual(
    matches.map(({ name, visible }) => ({ name, visible })),
    [
      { name: "main.tex", visible: true },
      { name: "main.tex", visible: true },
      { name: "references.bib", visible: true },
    ],
  );
  assert.deepEqual(
    matches.map((match) => match.displayName),
    ["main.tex", "main (1).tex", "references (3).bib"],
  );

  assert.deepEqual(
    runtime.matchAttachmentDisplayNames(
      ["README.md", "README.md"],
      ["README.md"],
    ).map((match) => match.visible),
    [true, false],
  );
  assert.deepEqual(
    runtime.matchAttachmentDisplayNames(
      ["README.md", "README.md"],
      ["README.md", "README.md"],
    ).map((match) => match.visible),
    [true, true],
  );
});

test("prompt runtime builds five configuration-driven rounds", () => {
  const workflow = buildReconstructionWorkflow({
    language: "en",
    styleId: "conference",
    hasWordLimit: true,
    targetWords: 4500,
    includeAppendix: true,
  });

  assert.equal(workflow.rounds.length, 5);
  assert.deepEqual(
    workflow.rounds.map((round) => round.number),
    [1, 2, 3, 4, 5],
  );
  assert.match(workflow.rounds[0].prompt, /4,500 words/);
  assert.match(workflow.rounds[0].prompt, /Appendix allowed/);
  assert.match(
    workflow.rounds[0].prompt,
    /section → subsection → paragraph/,
  );
  assert.equal(workflow.rounds[3].id, "framework-figure");
  assert.match(workflow.rounds[3].prompt, /Export aspect ratio: 2:1/);
  assert.match(
    workflow.rounds[3].prompt,
    /Allowed accent-color range: 2–3; this is a maximum semantic budget/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /candidate accents #0077BB, #EE7733, #009988/,
  );
  assert.doesNotMatch(workflow.rounds[3].prompt, /RGB\(/);
  assert.match(
    workflow.rounds[3].prompt,
    /Minimal paper linework on a pure-white canvas/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Preferred prose typeface: Calibri/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /No decorative or pictorial icons/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /One dark-neutral color for borders, arrows, and connectors/,
  );
  assert.match(workflow.rounds[3].prompt, /No large in-figure title/);
  assert.match(
    workflow.rounds[3].prompt,
    /<base_name>_round_4_framework_reconstruction\.png/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /# Output and Two-Step Execution Protocol/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Do not generate an image in the current response/,
  );
  assert.match(workflow.rounds[3].prompt, /FINAL IMAGE PROMPT/);
  assert.match(workflow.rounds[3].prompt, /SCIENTIFIC VISUAL OBJECTS/);
  assert.match(workflow.rounds[3].prompt, /EXACT TEXT AND MATH/);
  assert.match(workflow.rounds[3].prompt, /Start drawing/);
  assert.equal(
    (workflow.rounds[3].prompt.match(/2:1/g) ?? []).length,
    1,
  );
  assert.equal(workflow.rounds[4].id, "final-refinement");
  assert.deepEqual(workflow.config.chatExecution, {
    modelPolicy: "latest-visible-reasoning",
    reasoningPreference: "strongest",
    fallbackPolicy: "closest-lower-then-strongest",
  });
});

test("framework figure placement and canvas are configuration-driven", () => {
  const workflow = buildReconstructionWorkflow({
    language: "en",
    frameworkFigure: {
      placementId: "single-column",
      aspectRatioId: "portrait-3-4",
      customAspectWidth: 3,
      customAspectHeight: 4,
    },
  });

  assert.equal(
    workflow.config.frameworkFigure.placementId,
    "single-column",
  );
  assert.equal(
    workflow.config.frameworkFigure.aspectRatioId,
    "portrait-3-4",
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Target paper placement: Single column/,
  );
  assert.match(workflow.rounds[3].prompt, /Export aspect ratio: 3:4/);
  assert.equal(
    (workflow.rounds[3].prompt.match(/3:4/g) ?? []).length,
    1,
  );
});

test("skill opens one local launch page without an execution-mode question", async () => {
  const skill = await readFile(
    new URL("../skills/paper-reconstruction/SKILL.md", import.meta.url),
    "utf8",
  );
  const bridgeReference = await readFile(
    new URL(
      "../skills/paper-reconstruction/references/chat-bridge.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(skill, /Mandatory onboarding gate/);
  assert.match(skill, /# Paper Reconstruction/);
  assert.match(skill, /Ask for the paper directory first/);
  assert.match(skill, /never select a paper at random/);
  assert.match(skill, /Local configuration and launch page/);
  assert.match(skill, /configure-start/);
  assert.match(skill, /configure-status/);
  assert.match(
    skill,
    /do not ask whether the user wants automation or Prompt-only handoff/,
  );
  assert.match(
    skill,
    /Every configuration change must refresh the five generated Prompts/,
  );
  assert.match(skill, /\*\*Start full automation\*\*/);
  assert.match(skill, /\*\*Exit\*\*/);
  assert.match(skill, /do not ask the user to type “start”/);
  assert.match(skill, /Immediately run the visible Chat bridge preflight/);
  assert.match(skill, /do not display another confirmation summary/);
  assert.match(skill, /do not run `init`/);
  assert.match(skill, /--reasoning strongest\|medium\|high\|extra-high\|pro/);
  assert.match(skill, /chat-plan/);
  assert.match(skill, /Never pin a GPT model name/);
  assert.match(
    skill,
    /Never apply a round's Chat configuration inside an unrelated conversation/,
  );
  assert.match(skill, /openFreshChatRound/);
  assert.match(skill, /click-acknowledged/);
  assert.match(skill, /submitPreparedChatRound/);
  assert.match(skill, /Run-scoped MCP paper workspace/);
  assert.match(skill, /mcp-start/);
  assert.match(skill, /yanshu_get_round_manifest/);
  assert.match(skill, /yanshu_get_evidence_index/);
  assert.match(skill, /yanshu_view_image/);
  assert.match(skill, /browser attachment transfer only/);
  assert.match(bridgeReference, /openYanShuFreshChatRound/);
  assert.match(bridgeReference, /applyYanShuChatReasoningSelection/);
  assert.match(bridgeReference, /submitYanShuPreparedChatRound/);
  assert.match(bridgeReference, /thread: \{ type: "current" \}/);
  assert.match(bridgeReference, /Prefer the MCP round bootstrap/);
  assert.match(bridgeReference, /files: \[\]/);
});

test("local onboarding page confirms a complete automation config", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-onboarding-test-"),
  );
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    const figures = path.join(paperRoot, "figures");
    await mkdir(figures, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
    await writeFile(path.join(figures, "overview.png"), "png fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const pluginRoot = path.resolve(
      new URL("..", import.meta.url).pathname,
    );
    const started = await startOnboardingSession({
      pluginRoot,
      projectRoot: paperRoot,
      inputs,
      uiLanguage: "zh",
      openBrowser: false,
      sessionRoot: path.join(temporaryRoot, "sessions"),
      ttlMs: 30_000,
    });

    assert.equal(started.status, "ready");
    assert.match(started.url, /^http:\/\/127\.0\.0\.1:\d+\//);
    const pageUrl = new URL(started.url);
    const token = pageUrl.searchParams.get("token");
    const endpoint = (pathname) => {
      const url = new URL(pathname, pageUrl.origin);
      url.searchParams.set("token", token);
      return url;
    };

    const bootstrapResponse = await fetch(endpoint("/api/bootstrap"));
    const bootstrap = await bootstrapResponse.json();
    assert.equal(bootstrap.ok, true);
    assert.equal(bootstrap.model.paperStyles.conference.defaultTargetWords, 4500);
    assert.equal(bootstrap.model.paperStyles.journal.defaultTargetWords, 5000);
    assert.equal(bootstrap.initialWorkflow.styleId, "conference");

    const previewResponse = await fetch(endpoint("/api/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow: {
          ...bootstrap.initialWorkflow,
          language: "zh",
          roundLanguages: {
            ...bootstrap.initialWorkflow.roundLanguages,
            "scientific-positioning": "en",
            "method-experiments": "zh",
          },
          styleId: "journal",
          hasWordLimit: false,
          includeAppendix: true,
        },
      }),
    });
    const preview = await previewResponse.json();
    assert.equal(preview.ok, true);
    assert.equal(preview.rounds.length, 5);
    assert.equal(preview.rounds[0].id, "scientific-positioning");
    assert.equal(preview.rounds[0].language, "en");
    assert.match(preview.rounds[0].prompt, /## Your Role/);
    assert.equal(preview.rounds[1].language, "zh");
    assert.match(preview.rounds[1].prompt, /## 你的角色/);

    const confirmedResponse = await fetch(endpoint("/api/confirm"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow: {
          ...bootstrap.initialWorkflow,
          language: "en",
          styleId: "journal",
          hasWordLimit: false,
          unlimitedCoreSections: true,
          includeAppendix: true,
          frameworkFigure: {
            placementId: "single-column",
            aspectRatioId: "portrait-3-4",
            customAspectWidth: 3,
            customAspectHeight: 4,
          },
          chatExecution: {
            ...bootstrap.initialWorkflow.chatExecution,
            reasoningPreference: "high",
          },
        },
      }),
    });
    const confirmed = await confirmedResponse.json();
    assert.equal(confirmed.ok, true);
    assert.equal(confirmed.status, "confirmed");

    const status = await onboardingStatus(started.sessionPath);
    assert.equal(status.status, "confirmed");
    assert.ok(status.configPath);
    const config = JSON.parse(await readFile(status.configPath, "utf8"));
    assert.equal(config.execution.startAuthorized, true);
    assert.equal(config.projectRoot, paperRoot);
    assert.equal(config.workflow.styleId, "journal");
    assert.equal(config.workflow.hasWordLimit, false);
    assert.equal(config.workflow.unlimitedCoreSections, false);
    assert.equal(config.workflow.frameworkFigure.placementId, "single-column");
    assert.equal(config.workflow.chatExecution.reasoningPreference, "high");

    const ui = await readFile(
      path.join(pluginRoot, "ui", "onboarding", "index.html"),
      "utf8",
    );
    assert.match(ui, /configuration-form/);
    assert.match(ui, /confirm-button/);
    assert.match(ui, /exit-button/);
    assert.match(ui, /copy-all-button/);
    assert.match(ui, /prompt-preview-list/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("exiting local onboarding cancels without creating a run config", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-onboarding-cancel-test-"),
  );
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    await mkdir(path.join(paperRoot, "figures"), { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const pluginRoot = path.resolve(
      new URL("..", import.meta.url).pathname,
    );
    const started = await startOnboardingSession({
      pluginRoot,
      projectRoot: paperRoot,
      inputs,
      uiLanguage: "zh",
      openBrowser: false,
      sessionRoot: path.join(temporaryRoot, "sessions"),
      ttlMs: 30_000,
    });
    const pageUrl = new URL(started.url);
    const cancelUrl = new URL("/api/cancel", pageUrl.origin);
    cancelUrl.searchParams.set("token", pageUrl.searchParams.get("token"));
    const response = await fetch(cancelUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const cancelled = await response.json();
    assert.equal(cancelled.ok, true);
    assert.equal(cancelled.status, "cancelled");

    const status = await onboardingStatus(started.sessionPath);
    assert.equal(status.status, "cancelled");
    assert.equal(status.configPath, null);
    await assert.rejects(
      readFile(path.join(started.sessionPath, "confirmed.yanshu.json")),
      /ENOENT/,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("reasoning preferences fall back against visible Chat options", () => {
  const plusPro = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Medium", "High"],
  });
  assert.equal(plusPro.selectedLabel, "High");
  assert.equal(plusPro.fallbackApplied, true);
  assert.match(plusPro.notice, /Requested Pro; selected High/);

  const plusExtraHigh = resolveChatPreference({
    requested: "extra-high",
    visibleOptions: ["Medium", "High"],
  });
  assert.equal(plusExtraHigh.selectedLabel, "High");
  assert.equal(plusExtraHigh.fallbackApplied, true);

  const strongest = resolveChatPreference({
    requested: "strongest",
    visibleOptions: ["Medium", "High", "Extra High", "Pro Standard", "Pro Extended"],
  });
  assert.equal(strongest.selectedLabel, "Pro Extended");
  assert.equal(strongest.fallbackApplied, false);

  const renamed = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Balanced", "Deep"],
  });
  assert.equal(renamed.selectedLabel, "Deep");
  assert.equal(renamed.fallbackApplied, true);
  assert.match(renamed.source, /visible-order/);

  const newerAliases = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Standard", "Extended", "Max", "Ultra"],
  });
  assert.equal(newerAliases.selectedLabel, "Ultra");
  assert.equal(newerAliases.fallbackApplied, false);
});

test("chat round protocol prepares a fresh thread before configuration and upload", async () => {
  const calls = [];
  const chatgpt = {
    experience: {
      open: async (args) => {
        calls.push(["experience.open", args]);
        return {
          ok: true,
          status: "success",
          context: { url: "https://chatgpt.com/c/existing-thread" },
        };
      },
    },
    threads: {
      new: async () => {
        calls.push(["threads.new"]);
        return {
          ok: true,
          status: "success",
          data: { url: "https://chatgpt.com/" },
          context: { url: "https://chatgpt.com/" },
        };
      },
    },
    configuration: {
      inspect: async (args) => {
        calls.push(["configuration.inspect", args]);
        return {
          ok: true,
          status: "success",
          data: {
            experience: "chat",
            options: {
              intelligence: [
                { label: "Medium" },
                { label: "High" },
                { label: "Extra High" },
              ],
            },
          },
        };
      },
      apply: async (args) => {
        calls.push(["configuration.apply", args]);
        return {
          ok: true,
          status: "success",
          data: {
            verified: false,
            selected: [
              {
                axis: "intelligence",
                requested: "Extra High",
                selected: "Extra High",
              },
            ],
            after: { active: {} },
          },
          warnings: ["Visible postcondition is unavailable."],
        };
      },
    },
    modes: {
      get: async () => {
        calls.push(["modes.get"]);
        return {
          ok: true,
          status: "success",
          data: { modes: [] },
          warnings: ["No active mode label is exposed."],
        };
      },
    },
    askWithFiles: async (args) => {
      calls.push(["askWithFiles", args]);
      return {
        ok: true,
        status: "running",
        context: { url: "https://chatgpt.com/c/new-round-thread" },
      };
    },
  };

  const opened = await openFreshChatRound(chatgpt);
  assert.equal(opened.ok, true);
  assert.equal(opened.data.currentUrl, "https://chatgpt.com/");

  const inspected = await inspectFreshChatConfiguration(chatgpt);
  assert.equal(inspected.ok, true);

  const applied = await applyChatReasoningSelection(chatgpt, {
    selectedLabel: "Extra High",
    visibleOptions: ["Medium", "High", "Extra High"],
  });
  assert.equal(applied.ok, true);
  assert.equal(applied.data.verification, "click-acknowledged");
  assert.match(applied.warnings.at(-1), /will continue/);

  const submitted = await submitPreparedChatRound(chatgpt, {
    files: ["/paper/main.tex", "/paper/main.pdf"],
    tools: [{ tool: "YanShu" }],
    prompt: "Reconstruct this paper.",
  });
  assert.equal(submitted.ok, true);
  assert.deepEqual(
    calls.map(([name]) => name),
    [
      "experience.open",
      "threads.new",
      "configuration.inspect",
      "configuration.apply",
      "modes.get",
      "askWithFiles",
    ],
  );
  const applyArgs = calls.find(
    ([name]) => name === "configuration.apply",
  )[1];
  assert.equal(applyArgs.strict, false);
  const submitArgs = calls.find(([name]) => name === "askWithFiles")[1];
  assert.deepEqual(submitArgs.thread, { type: "current" });
  assert.equal(submitArgs.existingTab, true);
  assert.equal(submitArgs.configuration, undefined);
  assert.deepEqual(submitArgs.tools, [{ tool: "YanShu" }]);
});

test("chat round protocol blocks a stale thread or contradictory reasoning readback", async () => {
  const staleThread = await openFreshChatRound({
    experience: {
      open: async () => ({
        ok: true,
        context: { url: "https://chatgpt.com/c/same-thread" },
      }),
    },
    threads: {
      new: async () => ({
        ok: true,
        data: { url: "https://chatgpt.com/c/same-thread" },
      }),
    },
  });
  assert.equal(staleThread.ok, false);
  assert.equal(staleThread.blocker.code, "thread_creation_unverified");

  const conflicting = await applyChatReasoningSelection(
    {
      configuration: {
        apply: async () => ({
          ok: true,
          data: {
            verified: false,
            selected: [
              {
                axis: "intelligence",
                requested: "Extra High",
                selected: "Extra High",
              },
            ],
          },
          warnings: [],
        }),
      },
      modes: {
        get: async () => ({
          ok: true,
          data: { modes: ["High"] },
          warnings: [],
        }),
      },
    },
    {
      selectedLabel: "Extra High",
      visibleOptions: ["Medium", "High", "Extra High"],
    },
  );
  assert.equal(conflicting.ok, false);
  assert.equal(
    conflicting.blocker.code,
    "configuration_readback_conflict",
  );
});

test("workflow preserves an explicit reasoning preference", () => {
  const workflow = buildReconstructionWorkflow({
    chatExecution: {
      reasoningPreference: "extra-high",
    },
  });

  assert.equal(
    workflow.config.chatExecution.reasoningPreference,
    "extra-high",
  );
  assert.equal(
    workflow.config.chatExecution.modelPolicy,
    "latest-visible-reasoning",
  );
});

test("no-limit and unlimited-core modes alter generated prompts", () => {
  const noLimit = buildReconstructionWorkflow({
    language: "en",
    styleId: "journal",
    hasWordLimit: false,
  });
  assert.doesNotMatch(
    noLimit.rounds[0].prompt,
    /## Main-text and Section Budgets/,
  );

  const unlimitedCore = buildReconstructionWorkflow({
    language: "en",
    styleId: "conference",
    hasWordLimit: true,
    unlimitedCoreSections: true,
  });
  assert.match(
    unlimitedCore.rounds[0].prompt,
    /No main-text total; only sections other than Method and Experiments are limited/,
  );
  assert.match(unlimitedCore.rounds[0].prompt, /Method: Unlimited/);
  assert.match(
    unlimitedCore.rounds[0].prompt,
    /each table or figure as 200 words/,
  );
});

test("each automated round can preserve its exported prompt language", () => {
  const workflow = buildReconstructionWorkflow({
    language: "zh",
    roundLanguages: {
      "scientific-positioning": "en",
      "method-experiments": "zh",
      "narrative-reconstruction": "en",
      "framework-figure": "en",
      "final-refinement": "zh",
    },
  });

  assert.equal(workflow.rounds[0].language, "en");
  assert.match(workflow.rounds[0].prompt, /## Your Role/);
  assert.equal(workflow.rounds[1].language, "zh");
  assert.match(workflow.rounds[1].prompt, /## 你的角色/);
});

test("custom budgets must match the configured total", () => {
  assert.throws(
    () =>
      buildReconstructionWorkflow({
        language: "en",
        styleId: "conference",
        hasWordLimit: true,
        targetWords: 4500,
        sectionBudgets: { abstract: 999 },
      }),
    /Section budgets total/,
  );
});

test("run state is recoverable and attachment-scoped", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "yanshu-test-"));
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    const figures = path.join(paperRoot, "figures");
    await mkdir(figures, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
    await writeFile(path.join(figures, "overview.png"), "png fixture", "utf8");
    await writeFile(path.join(figures, "overview.pdf"), "pdf fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const workflow = buildReconstructionWorkflow({
      language: "zh",
      styleId: "conference",
    });
    const state = await createRun({
      projectRoot: paperRoot,
      runId: "test-run",
      inputs,
      workflow,
    });

    assert.equal(nextRound(state)?.number, 1);
    assert.equal(summarizeRun(state).progress.completed, 0);
    assert.match(
      await readFile(
        path.join(
          state.runPath,
          "round-01-scientific-positioning",
          "prompt.md",
        ),
        "utf8",
      ),
      /科学定位/,
    );

    const attachments = await roundAttachments(state, "scientific-positioning");
    assert.deepEqual(
      attachments.map((item) => path.basename(item)).sort(),
      ["main.pdf", "main.tex", "overview.png", "references.bib"],
    );

    await markRound(state, "1", {
      status: "running",
      threadUrl: "https://chatgpt.com/c/example",
      experience: "chat",
      model: "strongest-visible",
      effort: "strongest-visible",
      configurationVerification: "click-acknowledged",
    });
    assert.equal(
      state.rounds[0].chat.configurationVerification,
      "click-acknowledged",
    );
    const downloaded = path.join(temporaryRoot, "round-1-output.tex");
    await writeFile(downloaded, "round output", "utf8");
    await registerArtifact(state, "1", downloaded);
    await markRound(state, "1", { status: "completed" });

    assert.equal(nextRound(state)?.number, 2);
    assert.equal(summarizeRun(state).progress.completed, 1);
    const secondAttachments = await roundAttachments(state, "2");
    assert.ok(
      secondAttachments.some(
        (item) => path.basename(item) === "round-1-output.tex",
      ),
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
