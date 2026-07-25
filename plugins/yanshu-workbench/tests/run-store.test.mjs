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
import { resolveChatPreference } from "../scripts/lib/chat-preferences.mjs";
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
  assert.match(workflow.rounds[3].prompt, /exact 16:9 canvas/);
  assert.match(workflow.rounds[3].prompt, /within the 2–4 range/);
  assert.match(
    workflow.rounds[3].prompt,
    /#0077BB \/ RGB\(0, 119, 187\)/,
  );
  assert.match(workflow.rounds[3].prompt, /pure-white canvas, thin but print-safe structural lines/);
  assert.match(workflow.rounds[3].prompt, /Use Calibri throughout/);
  assert.match(
    workflow.rounds[3].prompt,
    /Restrained light-cartoon technical illustrations/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Use thin dark-neutral lines by default/,
  );
  assert.match(workflow.rounds[3].prompt, /Do not use a large in-figure title/);
  assert.match(
    workflow.rounds[3].prompt,
    /<base_name>_round_4_framework_reconstruction\.png/,
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
    /width of one column in a two-column paper/,
  );
  assert.match(workflow.rounds[3].prompt, /exact 3:4 canvas/);
});

test("skill requires explicit onboarding confirmation before initialization", async () => {
  const skill = await readFile(
    new URL("../skills/paper-reconstruction/SKILL.md", import.meta.url),
    "utf8",
  );

  assert.match(skill, /Mandatory onboarding gate/);
  assert.match(skill, /# Paper Reconstruction/);
  assert.match(skill, /Ask for the paper directory first/);
  assert.match(skill, /never select a paper at random/);
  assert.match(skill, /Display one concise confirmation summary/);
  assert.match(skill, /Wait for an explicit start confirmation/);
  assert.match(skill, /do not run `init`/);
  assert.match(skill, /--reasoning strongest\|medium\|high\|extra-high\|pro/);
  assert.match(skill, /chat-plan/);
  assert.match(skill, /Never pin a GPT model name/);
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
    });
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
