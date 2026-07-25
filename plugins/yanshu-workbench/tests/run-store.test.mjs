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
  assert.match(workflow.rounds[3].prompt, /whether the figure needs two or three chromatic accents/);
  assert.match(workflow.rounds[3].prompt, /pure-white canvas, thin but print-safe structural lines/);
  assert.match(workflow.rounds[3].prompt, /Do not use a large in-figure title/);
  assert.match(
    workflow.rounds[3].prompt,
    /<base_name>_round_4_framework_reconstruction\.png/,
  );
  assert.equal(workflow.rounds[4].id, "final-refinement");
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
