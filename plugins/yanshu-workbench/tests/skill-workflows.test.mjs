import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  CONFIGURABLE_SKILL_WORKFLOW_IDS,
  YANSHU_SKILL_CATALOG,
  buildSkillWorkflowConfiguration,
} from "../runtime/skill-workflow-engine.mjs";

const pluginRoot = path.resolve(new URL("..", import.meta.url).pathname);
const cliPath = path.join(pluginRoot, "scripts", "yanshu.mjs");

const configurableIds = [
  "idea-discovery",
  "paper-drafting",
  "citation-audit",
  "scientific-figure",
  "image-to-svg",
  "experimental-plotting",
  "peer-review",
  "revision-planning",
  "revision-audit",
];

const catalogIds = [
  "idea-discovery",
  "paper-drafting",
  "citation-audit",
  "paper-reconstruction",
  "scientific-figure",
  "image-to-svg",
  "experimental-plotting",
  "peer-review",
  "revision-planning",
  "revision-audit",
];

function resolveWithCli(workflow, preferences = {}, language = "zh") {
  const result = spawnSync(
    process.execPath,
    [
      cliPath,
      "workflow-resolve",
      "--workflow",
      workflow,
      "--prompt-language",
      language,
      "--preferences-json",
      JSON.stringify(preferences),
    ],
    { cwd: pluginRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

test("website-sourced runtime exposes ten direct YanShu sub-skills", () => {
  assert.deepEqual(CONFIGURABLE_SKILL_WORKFLOW_IDS, configurableIds);
  assert.deepEqual(
    YANSHU_SKILL_CATALOG.map((item) => item.id),
    catalogIds,
  );
  assert.equal(new Set(catalogIds).size, 10);
});

test("shared workflow models retain the reviewed website defaults", () => {
  const idea = buildSkillWorkflowConfiguration("idea-discovery", {}, "zh");
  assert.equal(idea.preferences.recentYears, 2);
  assert.equal(idea.preferences.ideaCount, 2);
  assert.match(idea.prompt, /重点检索近 2 年/);

  const draft = buildSkillWorkflowConfiguration("paper-drafting", {}, "en");
  assert.equal(draft.preferences.templateId, "arxiv");
  assert.deepEqual(draft.preferences.captionWordRange, [10, 40]);
  assert.match(draft.prompt, /arxiv-style/);
  assert.match(draft.prompt, /\$research-paper-writing/);

  const citation = buildSkillWorkflowConfiguration("citation-audit", {}, "zh");
  assert.equal(citation.preferences.action, "repair");
  assert.deepEqual(citation.preferences.sections, ["introduction", "related-work"]);
  assert.deepEqual(citation.preferences.referenceRange, [35, 40]);
  assert.equal(citation.preferences.recentYears, 3);
  assert.equal(citation.preferences.recentShare, 65);
  assert.equal(citation.preferences.allowPreprints, false);
  assert.equal(citation.preferences.targetVenueMinimum, 3);
  assert.match(citation.prompt, /论文自己的方法、贡献、实验发现/);
  assert.match(citation.prompt, /默认不引用预印本/);
  assert.match(citation.prompt, /完整、可合并且不冲突的 BibTeX/);

  const figure = buildSkillWorkflowConfiguration("scientific-figure", {}, "zh");
  assert.equal(figure.preferences.promptId, "method-overview");
  assert.equal(figure.preferences.accentColorMin, 2);
  assert.equal(figure.preferences.accentColorMax, 4);
  assert.equal(figure.preferences.hasReferenceImage, false);
  assert.match(figure.prompt, /方法总览图/);
  assert.doesNotMatch(figure.prompt, /如有另行提供的图片/);

  const svg = buildSkillWorkflowConfiguration("image-to-svg", {}, "zh");
  assert.equal(svg.preferences.vectorMode, "pure");
  assert.equal(svg.preferences.backgroundMode, "preserve");
  assert.equal(svg.preferences.keepValidationPreview, false);
  assert.match(svg.prompt, /1:1 视觉复刻/);
  assert.match(svg.prompt, /font-family="Calibri"/);
  assert.match(svg.prompt, /不得出现 `<image>`、Base64/);
  assert.match(svg.prompt, /原始像素尺寸回渲染/);

  const plot = buildSkillWorkflowConfiguration("experimental-plotting", {}, "zh");
  assert.equal(plot.preferences.allowComposite, true);
  assert.deepEqual(plot.preferences.panelCount, [1, 3]);
  assert.match(plot.prompt, /\$nature-figure/);

  const review = buildSkillWorkflowConfiguration("peer-review", {}, "zh");
  assert.equal(review.preferences.useTarget, false);
  assert.equal(review.preferences.ignoreNonScientificPresentation, true);
  assert.match(review.prompt, /当前任务只输出审稿报告，不修改论文/);

  const revision = buildSkillWorkflowConfiguration("revision-planning", {}, "zh");
  assert.match(revision.prompt, /P0＝影响核心结论或接收判断/);
  assert.match(revision.prompt, /A＝无需补实验/);

  const audit = buildSkillWorkflowConfiguration("revision-audit", {}, "zh");
  assert.match(audit.prompt, /Adequately addressed/);
  assert.match(audit.prompt, /不得因为回复信写了“we have revised”就默认修改成立/);
});

test("every Skill resolves internally and executes in the current task", async () => {
  for (const skillId of catalogIds) {
    const skill = await readFile(
      path.join(pluginRoot, "skills", skillId, "SKILL.md"),
      "utf8",
    );
    const agent = await readFile(
      path.join(pluginRoot, "skills", skillId, "agents", "openai.yaml"),
      "utf8",
    );

    assert.doesNotMatch(skill, /\[TODO:/);
    assert.match(skill, /workflow-resolve/);
    assert.match(skill, /current (?:(?:Codex or CLI) )?(?:task|session)/i);
    assert.match(skill, /Do not (?:display|show|open|expose)|never open|without opening/i);
    assert.doesNotMatch(
      skill,
      /workflow-configure|workflow-configure-status|workflow-configure-result|Start full automation/,
    );
    assert.doesNotMatch(skill, /configPath/);
    assert.match(agent, new RegExp(`\\$${skillId}`));
  }

  await assert.rejects(
    access(path.join(pluginRoot, "skills", "writing-diagnosis", "SKILL.md")),
  );
});

test("workflow-resolve returns canonical prompts without opening configuration artifacts", () => {
  const citation = resolveWithCli("citation-audit");
  assert.equal(citation.ok, true);
  assert.equal(citation.workflowId, "citation-audit");
  assert.equal(citation.websitePath, "/writing/citations");
  assert.match(citation.prompt, /建议参考文献总量：35–40 篇/);
  assert.match(citation.instruction, /current task/);
  assert.match(citation.instruction, /Do not open a configuration page or internal JSON file/);

  const svg = resolveWithCli("image-to-svg", {
    vectorMode: "hybrid",
    backgroundMode: "transparent",
    keepValidationPreview: true,
  });
  assert.equal(svg.ok, true);
  assert.equal(svg.websitePath, "/figures/image-to-svg");
  assert.equal(svg.preferences.vectorMode, "hybrid");
  assert.match(svg.prompt, /混合保真模式/);
  assert.match(svg.prompt, /使画布透明/);
  assert.match(svg.prompt, /保留一张原图与最终回渲染结果的并排校验图/);

  const reconstruction = resolveWithCli(
    "paper-reconstruction",
    { styleId: "journal", includeAppendix: false },
    "zh",
  );
  assert.equal(reconstruction.ok, true);
  assert.equal(reconstruction.workflowVersion, "2026.09.05");
  assert.equal(reconstruction.preferences.styleId, "journal");
  assert.equal(reconstruction.preferences.hasWordLimit, false);
  assert.equal(reconstruction.preferences.unlimitedCoreSections, true);
  assert.match(reconstruction.prompt, /Step 1 · 科学定位与宏观结构/);
  assert.match(reconstruction.prompt, /Step 4 · 原稿质量回归门/);
  assert.match(reconstruction.prompt, /<base_name>_restructured\.tex/);
  assert.match(reconstruction.prompt, /<base_name>_restructured\.bib/);
  assert.match(reconstruction.prompt, /<base_name>_restructuring_report_zh\.md/);
  assert.doesNotMatch(
    reconstruction.prompt,
    /_round_[1-5]|artifacts\.zip|framework_reconstruction\.png|模拟审稿人攻击测试/,
  );
});

test("Skill delivery remains lightweight and artifact-focused", async () => {
  const readSkill = (skillId) =>
    readFile(path.join(pluginRoot, "skills", skillId, "SKILL.md"), "utf8");

  assert.match(await readSkill("idea-discovery"), /Chinese and English Markdown reports/);
  assert.match(await readSkill("paper-drafting"), /complete LaTeX project and compiled PDF paths/);
  assert.match(await readSkill("citation-audit"), /Create no configuration snapshot, Prompt copy, or state file/);
  assert.match(await readSkill("scientific-figure"), /Save one final PNG/);
  assert.match(await readSkill("image-to-svg"), /final `\.svg` path/);
  assert.match(await readSkill("experimental-plotting"), /reproducible code and final figure paths/);
  assert.match(await readSkill("peer-review"), /directly in chat/);
  assert.match(await readSkill("revision-planning"), /directly in chat/);
  assert.match(await readSkill("revision-audit"), /directly in chat/);

  const reconstruction = await readSkill("paper-reconstruction");
  assert.match(reconstruction, /creates no round folders, intermediate manuscripts/);
  assert.match(reconstruction, /output directory contains exactly/);
  assert.match(reconstruction, /There is no five-round resume state/);
});
