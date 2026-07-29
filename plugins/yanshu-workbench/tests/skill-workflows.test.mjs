import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CONFIGURABLE_SKILL_WORKFLOW_IDS,
  YANSHU_SKILL_CATALOG,
  buildSkillWorkflowConfiguration,
  getSkillWorkflowConfigurationModel,
} from "../runtime/skill-workflow-engine.mjs";
import {
  onboardingStatus,
  readAuthorizedOnboardingConfiguration,
  startOnboardingSession,
} from "../scripts/lib/onboarding-store.mjs";

const pluginRoot = path.resolve(new URL("..", import.meta.url).pathname);

test("website-sourced runtime exposes the five configurable YanShu skills", () => {
  assert.deepEqual(CONFIGURABLE_SKILL_WORKFLOW_IDS, [
    "idea-discovery",
    "paper-drafting",
    "writing-diagnosis",
    "scientific-figure",
    "experimental-plotting",
  ]);
  assert.deepEqual(
    YANSHU_SKILL_CATALOG.map((item) => item.id),
    [
      "idea-discovery",
      "paper-drafting",
      "writing-diagnosis",
      "paper-reconstruction",
      "scientific-figure",
      "experimental-plotting",
    ],
  );

  const idea = buildSkillWorkflowConfiguration(
    "idea-discovery",
    {},
    "zh",
  );
  assert.equal(idea.preferences.recentYears, 2);
  assert.equal(idea.preferences.ideaCount, 2);
  assert.match(idea.prompt, /重点检索近 2 年/);
  assert.match(idea.prompt, /两份语义一致/);

  const draft = buildSkillWorkflowConfiguration(
    "paper-drafting",
    {},
    "en",
  );
  assert.equal(draft.preferences.templateId, "arxiv");
  assert.match(draft.prompt, /arxiv-style/);
  assert.match(draft.prompt, /\$research-paper-writing/);
  assert.match(draft.prompt, /complete LaTeX project/i);

  const diagnosis = buildSkillWorkflowConfiguration(
    "writing-diagnosis",
    {},
    "zh",
  );
  assert.equal(diagnosis.preferences.scope, "whole");
  assert.equal(diagnosis.preferences.depth, "standard");
  assert.equal(diagnosis.preferences.action, "report");
  assert.equal(diagnosis.preferences.preserveStrengths, true);
  assert.match(diagnosis.prompt, /全文与章节 → 段落与图表 → 句子与公式/);
  assert.match(diagnosis.prompt, /逐格复述图表、堆砌数字/);
  assert.match(diagnosis.prompt, /不要用字数、句长或 caption 长度单独判错/);
  assert.match(diagnosis.prompt, /不要修改论文文件/);
  assert.doesNotMatch(
    diagnosis.prompt,
    /\$research-paper-writing|\$nature-figure/,
  );

  const figure = buildSkillWorkflowConfiguration(
    "scientific-figure",
    {},
    "zh",
  );
  assert.equal(figure.preferences.promptId, "method-overview");
  assert.equal(figure.preferences.accentColorMin, 2);
  assert.equal(figure.preferences.accentColorMax, 4);
  assert.equal(figure.preferences.hasReferenceImage, false);
  assert.match(figure.prompt, /方法总览图/);
  assert.match(figure.prompt, /2–4/);
  assert.doesNotMatch(figure.prompt, /如有另行提供的图片/);
  assert.doesNotMatch(figure.prompt, /\$nature-figure/);

  const plot = buildSkillWorkflowConfiguration(
    "experimental-plotting",
    {},
    "zh",
  );
  assert.equal(plot.preferences.palette, "tol-vibrant");
  assert.equal(plot.preferences.allowComposite, true);
  assert.deepEqual(plot.preferences.panelCount, [1, 3]);
  assert.match(plot.prompt, /\$nature-figure/);
  assert.match(plot.prompt, /允许组合图，使用 1–3 个子图/);
  assert.match(plot.prompt, /#0077BB, #EE7733, #009988, #CC3311/);
});

test("all new skill definitions are complete and open the shared page", async () => {
  for (const skillId of CONFIGURABLE_SKILL_WORKFLOW_IDS) {
    const skill = await readFile(
      path.join(pluginRoot, "skills", skillId, "SKILL.md"),
      "utf8",
    );
    const agent = await readFile(
      path.join(pluginRoot, "skills", skillId, "agents", "openai.yaml"),
      "utf8",
    );
    assert.doesNotMatch(skill, /\[TODO:/);
    assert.match(skill, new RegExp(`--workflow ${skillId}`));
    assert.match(skill, /workflow-configure-status/);
    assert.match(skill, /workflow-configure-result/);
    assert.match(skill, /Start full automation/);
    assert.match(skill, /Never open `plugin\.json`/);
    assert.doesNotMatch(skill, /configPath/);
    assert.match(agent, new RegExp(`\\$${skillId}`));
  }
});

test("shared workflow configuration page confirms the exact generated prompt", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-skill-configuration-test-"),
  );
  try {
    const workspace = path.join(temporaryRoot, "research");
    await mkdir(workspace, { recursive: true });
    const started = await startOnboardingSession({
      pluginRoot,
      projectRoot: workspace,
      inputs: {},
      workflowId: "idea-discovery",
      uiLanguage: "zh",
      openBrowser: false,
      sessionRoot: path.join(temporaryRoot, "sessions"),
      ttlMs: 30_000,
    });

    assert.equal(started.status, "ready");
    assert.equal(started.workflowId, "idea-discovery");
    const pageUrl = new URL(started.url);
    const endpoint = (pathname) => {
      const url = new URL(pathname, pageUrl.origin);
      url.searchParams.set("token", pageUrl.searchParams.get("token"));
      return url;
    };

    const bootstrapResponse = await fetch(endpoint("/api/bootstrap"));
    const bootstrap = await bootstrapResponse.json();
    assert.equal(bootstrap.ok, true);
    assert.equal(bootstrap.workflowId, "idea-discovery");
    assert.equal(bootstrap.model.defaults.recentYears, 2);
    assert.equal(bootstrap.model.defaults.ideaCount, 2);
    assert.equal(bootstrap.initial.promptLanguage, "zh");
    assert.match(bootstrap.initial.prompt, /重点检索近 2 年/);

    const requested = {
      ...bootstrap.initial.preferences,
      recentYears: 3,
      ideaCount: 3,
      focus: "efficient multimodal retrieval",
    };
    const previewResponse = await fetch(endpoint("/api/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: requested,
        promptLanguage: "en",
      }),
    });
    const preview = await previewResponse.json();
    assert.equal(preview.ok, true);
    assert.equal(preview.preferences.recentYears, 3);
    assert.equal(preview.preferences.ideaCount, 3);
    assert.match(preview.prompt, /recent 3 years/i);
    assert.match(preview.prompt, /efficient multimodal retrieval/);

    const confirmResponse = await fetch(endpoint("/api/confirm"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: requested,
        promptLanguage: "en",
      }),
    });
    const confirmed = await confirmResponse.json();
    assert.equal(confirmed.ok, true);
    assert.equal(confirmed.status, "confirmed");
    assert.equal("configPath" in confirmed, false);

    const apiStatusResponse = await fetch(endpoint("/api/status"));
    const apiStatus = await apiStatusResponse.json();
    assert.equal(apiStatus.status, "confirmed");
    assert.equal(apiStatus.configurationReady, true);
    assert.equal("configPath" in apiStatus, false);

    const status = await onboardingStatus(started.sessionPath);
    assert.equal(status.status, "confirmed");
    assert.equal(status.workflowId, "idea-discovery");
    assert.equal(status.configurationReady, true);
    assert.equal("configPath" in status, false);
    const { configuration: saved } =
      await readAuthorizedOnboardingConfiguration(started.sessionPath, {
        expectedWorkflowId: "idea-discovery",
      });
    assert.equal(saved.execution.startAuthorized, true);
    assert.equal(saved.workflowId, "idea-discovery");
    assert.equal(saved.projectRoot, workspace);
    assert.equal(saved.promptLanguage, "en");
    assert.equal(saved.preferences.recentYears, 3);
    assert.equal(saved.prompt, preview.prompt);

    const resolved = spawnSync(
      process.execPath,
      [
        path.join(pluginRoot, "scripts", "yanshu.mjs"),
        "workflow-configure-result",
        "--session",
        started.sessionPath,
      ],
      {
        encoding: "utf8",
        windowsHide: true,
      },
    );
    assert.equal(resolved.status, 0, resolved.stderr);
    const resolvedOutput = JSON.parse(resolved.stdout);
    assert.equal(resolvedOutput.workflowId, "idea-discovery");
    assert.equal(resolvedOutput.configuration.prompt, preview.prompt);
    assert.doesNotMatch(resolved.stdout, /configPath/);

    const ui = await readFile(
      path.join(pluginRoot, "ui", "workflow-configuration", "index.html"),
      "utf8",
    );
    assert.match(ui, /configuration-sections/);
    assert.match(ui, /prompt-content/);
    assert.match(ui, /confirm-button/);
    assert.match(ui, /exit-button/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("shared workflow models retain website defaults", () => {
  const drafting = getSkillWorkflowConfigurationModel("paper-drafting");
  assert.equal(drafting.defaults.templateId, "arxiv");

  const figure = getSkillWorkflowConfigurationModel("scientific-figure");
  assert.equal(figure.defaults.promptId, "method-overview");
  assert.equal(figure.defaults.aspectRatioId, "landscape-2-1");
  assert.equal(figure.defaults.accentColorMin, 2);
  assert.equal(figure.defaults.accentColorMax, 4);
  assert.equal(figure.defaults.hasReferenceImage, false);

  const plot = getSkillWorkflowConfigurationModel("experimental-plotting");
  assert.equal(plot.defaults.palette, "tol-vibrant");
  assert.equal(plot.defaults.allowComposite, true);
  assert.deepEqual(plot.defaults.panelCount, [1, 3]);
  assert.ok(plot.fields.some((field) => field.type === "range"));
  assert.ok(plot.fields.some((field) => field.type === "multi"));

  const diagnosis = getSkillWorkflowConfigurationModel("writing-diagnosis");
  assert.equal(diagnosis.defaults.scope, "whole");
  assert.equal(diagnosis.defaults.depth, "standard");
  assert.equal(diagnosis.defaults.action, "report");
  assert.equal(diagnosis.defaults.browseCitations, false);
  assert.equal(
    diagnosis.fields.find((field) => field.id === "sections")?.visibleWhen
      ?.equals,
    "selected",
  );
  assert.equal(
    diagnosis.fields.find((field) => field.id === "browseCitations")
      ?.visibleWhen?.includes,
    "citation-practice",
  );
});

test("writing diagnosis keeps repair and citation search conservative", () => {
  const repair = buildSkillWorkflowConfiguration(
    "writing-diagnosis",
    {
      action: "repair",
      browseCitations: true,
      dimensions: [
        "citation-practice",
        "display-writing",
        "results-writing",
      ],
    },
    "en",
  );

  assert.equal(repair.preferences.action, "repair");
  assert.equal(repair.preferences.browseCitations, true);
  assert.match(repair.prompt, /high-risk diff/i);
  assert.match(repair.prompt, /never append patch sentences/i);
  assert.match(repair.prompt, /never insert them silently/i);
  assert.match(repair.prompt, /Do not assess idea novelty/i);

  const noCitationDimension = buildSkillWorkflowConfiguration(
    "writing-diagnosis",
    {
      browseCitations: true,
      dimensions: ["paragraph-craft"],
    },
    "en",
  );
  assert.equal(noCitationDimension.preferences.browseCitations, false);
  assert.doesNotMatch(
    noCitationDimension.prompt,
    /publisher records, or the original paper/i,
  );
});

test("scientific-figure reference guidance is opt-in for every role", () => {
  const model = getSkillWorkflowConfigurationModel("scientific-figure");
  const promptIds = model.fields
    .find((field) => field.id === "promptId")
    ?.choices?.map((choice) => choice.value);

  assert.ok(promptIds?.length > 3);
  for (const promptId of promptIds) {
    const chineseDefault = buildSkillWorkflowConfiguration(
      "scientific-figure",
      { promptId },
      "zh",
    ).prompt;
    const englishDefault = buildSkillWorkflowConfiguration(
      "scientific-figure",
      { promptId },
      "en",
    ).prompt;
    const chineseEnabled = buildSkillWorkflowConfiguration(
      "scientific-figure",
      { promptId, hasReferenceImage: true },
      "zh",
    ).prompt;
    const englishEnabled = buildSkillWorkflowConfiguration(
      "scientific-figure",
      { promptId, hasReferenceImage: true },
      "en",
    ).prompt;

    assert.doesNotMatch(chineseDefault, /如有另行提供的图片/);
    assert.doesNotMatch(chineseDefault, /“绘图草稿”/);
    assert.doesNotMatch(englishDefault, /separately supplied image/);
    assert.doesNotMatch(englishDefault, /“figure draft”/);

    assert.match(
      chineseEnabled,
      /如有另行提供的图片，默认仅作为视觉样式参考/,
    );
    assert.match(
      chineseEnabled,
      /明确标注某张图片为“绘图草稿”/,
    );
    assert.doesNotMatch(
      chineseEnabled,
      /不得沿用其中的模块、流程、箭头或科学含义/,
    );
    assert.match(
      englishEnabled,
      /Treat any separately supplied image only as a visual-style reference by default/,
    );
    assert.match(
      englishEnabled,
      /explicitly label an image as a “figure draft”/,
    );
    assert.doesNotMatch(
      englishEnabled,
      /If I also provide an existing framework figure/,
    );
    assert.doesNotMatch(chineseEnabled, /\$nature-figure/);
  }
});
