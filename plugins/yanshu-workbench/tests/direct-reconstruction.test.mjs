import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { buildReconstructionWorkflow } from "../runtime/prompt-engine.mjs";
import { resolvePaperInputs } from "../scripts/lib/run-store.mjs";

const pluginRoot = path.resolve(new URL("..", import.meta.url).pathname);

test("Paper Reconstruction compiles to one current-task Prompt", () => {
  const workflow = buildReconstructionWorkflow({
    language: "zh",
    styleId: "conference",
    includeAppendix: true,
  });

  assert.equal(workflow.workflowVersion, "2026.09.05");
  assert.equal(workflow.rounds.length, 1);
  assert.equal(workflow.rounds[0].id, "full-reconstruction");
  assert.match(workflow.rounds[0].prompt, /四个 Step 作为同一次完整重构/);
  assert.match(workflow.rounds[0].prompt, /Step 1 · 科学定位与宏观结构/);
  assert.match(workflow.rounds[0].prompt, /Step 2 · 方法与实验深度重构/);
  assert.match(workflow.rounds[0].prompt, /Step 3 · 前后叙事深度精修/);
  assert.match(workflow.rounds[0].prompt, /Step 4 · 原稿质量回归门/);
  assert.match(workflow.rounds[0].prompt, /<base_name>_restructured\.tex/);
  assert.match(workflow.rounds[0].prompt, /<base_name>_restructured\.bib/);
  assert.match(workflow.rounds[0].prompt, /<base_name>_restructuring_report_zh\.md/);
  assert.doesNotMatch(
    workflow.rounds[0].prompt,
    /_round_[1-5]|artifacts\.zip|framework_reconstruction\.png|模拟审稿人攻击测试/,
  );
});

test("default reconstruction uses advisory length policy and protects core evidence", () => {
  const workflow = buildReconstructionWorkflow({ language: "en" });
  const prompt = workflow.rounds[0].prompt;

  assert.equal(workflow.config.hasWordLimit, false);
  assert.equal(workflow.config.unlimitedCoreSections, true);
  assert.doesNotMatch(prompt, /Suggested main-text and section length guidance/);
  assert.match(prompt, /Preserve every protocol, core result, unfavorable result/);
  assert.match(prompt, /Do not change the template, generate images/);
  assert.match(prompt, /Repair only confirmed regressions cohesively/);
});

test("paper input discovery remains read-only and handles spaces and Unicode", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "yanshu-direct-input-"));
  const paperRoot = path.join(temporaryRoot, "论文 空格", "paper");
  const figures = path.join(paperRoot, "figures");

  try {
    await mkdir(figures, { recursive: true });
    const tex = String.raw`\documentclass{article}
\usepackage{graphicx}
\begin{document}
Result~\cite{verified}.\includegraphics{figures/result.png}
\end{document}`;
    const bib = "@article{verified, title={Verified}, author={A}, year={2026}}\n";
    await writeFile(path.join(paperRoot, "main.tex"), tex, "utf8");
    await writeFile(path.join(paperRoot, "references.bib"), bib, "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "%PDF fixture", "utf8");
    await writeFile(path.join(figures, "result.png"), "png fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    assert.equal(path.basename(inputs.tex), "main.tex");
    assert.equal(path.basename(inputs.bib), "references.bib");
    assert.equal(path.basename(inputs.pdf), "main.pdf");
    assert.equal(path.basename(inputs.figures), "figures");
    assert.equal(await readFile(path.join(paperRoot, "main.tex"), "utf8"), tex);
    assert.equal(await readFile(path.join(paperRoot, "references.bib"), "utf8"), bib);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("the Paper Reconstruction Skill forbids pages, nested tasks, and intermediate rounds", async () => {
  const skill = await readFile(
    path.join(pluginRoot, "skills", "paper-reconstruction", "SKILL.md"),
    "utf8",
  );
  assert.match(skill, /workflow-resolve/);
  assert.match(skill, /current Codex or CLI session/);
  assert.match(skill, /Never open a website, local configuration page, internal JSON file/);
  assert.match(skill, /Never launch nested `codex`/);
  assert.match(skill, /Do not save Step outputs, round reports, Prompt copies, ZIP files/);
  assert.match(skill, /output directory contains exactly/);
});
