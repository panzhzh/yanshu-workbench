import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the concise YanShu home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>研术台 · YanShu Workbench<\/title>/i);
  assert.match(html, /从实验完成，到论文可投稿/);
  assert.match(html, /选择当前最需要完成的一步/);
  assert.match(html, /论文初稿/);
  assert.match(html, /论文重构/);
  assert.match(html, /科研绘图/);
  assert.match(html, /投稿策略/);
  assert.match(html, /href="\/draft"/);
  assert.match(html, /href="\/reconstruction"/);
  assert.match(html, /class="home-module-grid"/);
  assert.doesNotMatch(html, /class="prompt-resize-handle"/);
  assert.doesNotMatch(html, /写作风格|Writing style/);
});

test("server-renders the YanShu reconstruction workbench", async () => {
  const response = await render("/reconstruction");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /论文重构/);
  assert.match(html, /class="site-topbar"/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.doesNotMatch(html, /class="site-sidebar/);
  assert.match(html, /class="workflow-section content-section prompt-rail"/);
  assert.match(html, /会议/);
  assert.match(html, /期刊/);
  assert.match(html, /限制正文字数/);
  assert.match(html, /附录不计入正文，每张表格或图片按 200 词计入/);
  assert.match(html, /正文与章节预算/);
  assert.match(html, /不限制方法和实验的字数/);
  assert.match(html, /每张表格或图片按 200 词计入/);
  assert.match(html, /导出桌面配置/);
  assert.match(html, /五步重构工作流/);
  assert.equal((html.match(/>English<\/button>/g) ?? []).length, 5);
  assert.match(html, /真实 Prompt/);
  assert.match(html, /科学定位与结构重构/);
  assert.match(html, /重构方法总览框架图/);
  assert.doesNotMatch(html, /投稿目标检索与官网核验/);
  assert.match(html, /Scientific Positioning Contract/);
  assert.match(html, /论文标题与品牌缩写/);
  assert.match(html, /4–7 个拉丁字母/);
  assert.match(html, /不提供候选标题/);
  assert.match(html, /会议论文目录层级固定为 section → subsection → paragraph/);
  assert.match(html, /Related Work：恰好三个 subsection，每个小节恰好一个普通段落/);
  assert.match(html, /不单设 Overview subsection/);
  assert.match(html, /三个承担综合解释、适用范围与科学意义的 discussion subsection/);
  assert.match(html, /最后单列一个 Limitations subsection/);
  assert.match(html, /具体结果数字最多保留三个/);
  assert.match(html, /Experimental Configuration/);
  assert.match(html, /本步骤临时上限与附录分流规则/);
  assert.match(html, /临时上限为 5,400 词/);
  assert.match(html, /Experiments and Results 的现有内容不得精简、删除、弱化或移入附录/);
  assert.match(html, /当前配置只允许、并不要求使用附录/);
  assert.match(html, /满足当前适用的总量与章节预算，不得使用附录/);
  assert.match(
    html,
    /## 正文与章节预算[\s\S]*### 本步骤临时上限与附录分流规则[\s\S]*## 本轮任务/,
  );
  assert.doesNotMatch(html, /证据基线与初稿审计|Evidence Baseline/);
  assert.doesNotMatch(html, /## 使用方式|## 独立运行规则/);
  assert.doesNotMatch(html, /# 第\d+轮：|# Round \d+:/);
  assert.doesNotMatch(html, /启用字数限制时的完整定量约束/);
  assert.doesNotMatch(html, /\{\{[a-z0-9_]+\}\}/);
  assert.doesNotMatch(
    html,
    /在中文报告中先给出恰好三个候选英文标题/,
  );
  assert.match(html, /科研绘图/);
  assert.match(html, /通用产品预设/);
  assert.doesNotMatch(html, /一个面向 CS 研究者的写作控制面/);
  assert.doesNotMatch(html, /CS 顶会|CS 顶刊|当前风格说明/);
  assert.doesNotMatch(html, /占位 Prompt|Placeholder prompt/);
  assert.doesNotMatch(html, /后续方法模块|METHOD LIBRARY/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the evidence-led paper-draft workbench", async () => {
  const response = await render("/draft");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /论文初稿/);
  assert.match(html, /实验结果、表格与原始分析/);
  assert.match(html, /目标模板/);
  assert.match(html, /arXiv/);
  assert.match(html, /NeurIPS/);
  assert.match(html, /CVPR/);
  assert.match(html, /ACL/);
  assert.match(html, /ACM Multimedia/);
  assert.match(html, /kourgeorge\/arxiv-style/);
  assert.match(html, /不是 arXiv 官方投稿格式要求/);
  assert.match(html, /顶会必须在执行时从当届官网核验并取得最新官方 TeX 模板/);
  assert.match(html, /不得发明实验数字/);
  assert.match(html, /TEMPLATE_SOURCE\.md/);
  assert.match(html, /不要先给提纲、写作计划或等待我逐节确认/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.match(html, /class="prompt-card expanded"/);
});

test("server-renders submission strategy filters and its live prompt", async () => {
  const response = await render("/submission");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /投稿策略/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.match(
    html,
    /class="content-section prompt-rail submission-prompt-section"/,
  );
  assert.match(html, /是否 OA/);
  assert.match(html, /是否有 APC/);
  assert.match(html, /影响因子（IF）/);
  assert.match(html, /自定义 IF 范围/);
  assert.match(html, /综述文章/);
  assert.match(html, /不限文章类型/);
  assert.match(html, /JCR 分区/);
  assert.match(html, /中科院分区/);
  assert.match(html, /SCIE/);
  assert.match(html, /SSCI/);
  assert.match(html, /ESCI/);
  assert.match(html, /投稿目标检索与官网核验/);
  assert.match(html, /## 当前配置/);
  assert.match(html, /投稿类型：期刊/);
  assert.match(html, /是否 OA：不限/);
  assert.match(html, /影响因子（IF）：不限/);
  assert.match(html, /综述文章：不限/);
  assert.match(html, /JCR 分区：不限/);
  assert.match(html, /中科院分区：不限/);
  assert.match(html, /收录索引：不限/);
  assert.match(html, /固定排除：MDPI, Hindawi, Frontiers/);
  assert.match(html, /以上均为候选池筛选条件/);
  assert.match(html, /当前可投稿状态/);
  assert.match(html, /不能仅凭历史上发表过综述推断/);
  assert.match(html, /MDPI、Hindawi 和 Frontiers 是用户明确排除项/);
  assert.match(html, /直接在当前对话中给出完整中文检索结果/);
  assert.match(html, /未生成文件/);
  assert.doesNotMatch(html, /### 文件名/);
  assert.doesNotMatch(
    html,
    /round_6_(?:venue|journal)_(?:targeting|report)/,
  );
  assert.doesNotMatch(html, /原样归档的英文/);
  assert.doesNotMatch(html, /五步重构工作流/);
});

test("server-renders independent research-figure prompt cards", async () => {
  const response = await render("/figures");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /科研绘图/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.match(
    html,
    /class="content-section prompt-rail figure-prompt-section"/,
  );
  assert.match(html, /论文材料/);
  assert.match(html, /\.tex/);
  assert.match(html, /\.pdf/);
  assert.match(html, /本站不读取或保存论文/);
  assert.match(html, /引言图/);
  assert.match(html, /方法总览图/);
  assert.match(html, /关键技术细节图/);
  assert.match(html, /极简论文线稿/);
  assert.match(html, /轻插图技术图/);
  assert.match(html, /三选一/);
  assert.match(html, /论文占栏与画布/);
  assert.match(html, /单栏/);
  assert.match(html, /跨双栏/);
  assert.match(html, /横版 4:3/);
  assert.match(html, /竖版 3:4/);
  assert.match(html, /横版 16:9/);
  assert.match(html, /竖版 9:16/);
  assert.match(html, /自定义/);
  assert.match(html, /输入任意宽高比例/);
  assert.match(html, /4:3/);
  assert.match(html, /3:4/);
  assert.match(html, /16:9/);
  assert.match(html, /9:16/);
  assert.doesNotMatch(html, />2:1</);
  assert.match(html, /线条颜色/);
  assert.match(html, /统一深色/);
  assert.match(html, /按语义区分/);
  assert.match(html, /强调色数量/);
  assert.match(html, /色系/);
  assert.match(html, /学术蓝/);
  assert.match(html, /蓝橙对照/);
  assert.match(html, /全图字体/);
  assert.match(html, /Times New Roman/);
  assert.match(html, /Arial/);
  assert.match(html, /Calibri/);
  assert.match(html, /Comic Sans MS/);
  assert.match(html, /轻插图与图标/);
  assert.match(html, /模块卡片底色/);
  assert.match(html, /字号层级/);
  assert.match(html, /2 级字号/);
  assert.match(html, /3 级字号/);
  assert.match(html, /禁止浅灰文字/);
  assert.match(html, /不使用/);
  assert.match(html, /当前绘图 Prompt/);
  assert.match(html, /问题与意义/);
  assert.match(html, /整体心智地图/);
  assert.match(html, /class="prompt-card expanded"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /统一视觉与文字约束/);
  assert.match(html, /## 直接生成/);
  assert.match(html, /直接生成最终图片/);
  assert.doesNotMatch(html, /## 工作顺序|## Workflow/);
  assert.doesNotMatch(html, /先输出不超过 6 行|After I approve/);
  assert.doesNotMatch(html, /保持 Overview 粒度|Stay at overview granularity/);
  assert.equal((html.match(/class="prompt-card(?:\s|")/g) ?? []).length, 1);
  assert.doesNotMatch(html, /上传文件<\/button>/);
});

test("keeps presets and production prompts configuration-driven", async () => {
  const [
    config,
    component,
    navigation,
    styles,
    resizer,
    submission,
    submissionConfig,
    wordCountPolicy,
    templates,
    constraints,
    builder,
    promptReadme,
    page,
    layout,
    packageJson,
    sourceFiles,
  ] = await Promise.all([
    readFile(new URL("../app/config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/YanshuWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/PromptResizeHandle.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/submission/SubmissionStrategy.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/submission/config.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../content/prompts/wordCountPolicy.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../content/prompts/templates.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../content/prompts/constraints.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../content/prompts/buildPrompt.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../content/prompts/README.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../content/prompts/source/", import.meta.url)),
  ]);

  assert.match(config, /defaultTargetWords:\s*4500/);
  assert.match(config, /defaultTargetWords:\s*5000/);
  assert.match(config, /引言 480 词，讨论与局限占 10%，结论 200 词/);
  assert.match(config, /ratio:\s*0\.10666666666666667/);
  assert.match(config, /ratio:\s*0\.1/);
  assert.match(config, /ratio:\s*0\.044444444444444446/);
  assert.match(config, /section → subsection → paragraph/);
  assert.match(config, /section → subsection → subsubsection → paragraph/);
  assert.match(config, /三个小节，每小节一个普通段落/);
  assert.match(config, /约 100 词的局限小节/);
  assert.match(config, /defaultMode:\s*"target"/);
  assert.match(config, /defaultAppendix:\s*true/);
  assert.match(config, /defaultAppendix:\s*false/);
  assert.match(config, /wordLimitOff:\s*"无特殊规定"/);
  assert.match(config, /appendixOn:\s*"允许附录"/);
  assert.match(config, /五步重构工作流/);
  assert.match(config, /resizePromptRail:\s*"拖动调整 Prompt 栏宽度"/);
  assert.match(config, /resetPromptRail:\s*"双击恢复为 40%"/);
  assert.match(config, /满足当前适用的总量与章节预算时不得使用/);
  assert.match(config, /defaultUnlimitedCoreSections:\s*false/);
  assert.match(
    config,
    /unlimitedSectionIds:\s*WORD_COUNT_POLICY\.unlimitedCoreSectionIds/,
  );
  assert.match(
    wordCountPolicy,
    /unlimitedCoreSectionIds:\s*\["method", "experiments-results"\]/,
  );
  assert.match(wordCountPolicy, /visualWordEquivalent:\s*200/);
  assert.equal((config.match(/id:\s*"abstract"/g) ?? []).length, 2);
  assert.doesNotMatch(config, /export const PROMPT_ROUNDS/);
  assert.match(templates, /export const PROMPT_TEMPLATES/);
  assert.match(templates, /export const RECONSTRUCTION_PROMPTS/);
  assert.match(templates, /export const SUBMISSION_PROMPT_TEMPLATE/);
  assert.equal((templates.match(/number:\s*[1-5],/g) ?? []).length, 6);
  assert.equal(
    (templates.match(/sourceFile:\s*"Round_[1-5][^"]+\.md"/g) ?? [])
      .length,
    5,
  );
  assert.match(
    templates,
    /sourceFile:\s*"Submission_Strategy_and_Verification\.md"/,
  );
  assert.doesNotMatch(templates, /evidence-audit|Evidence Baseline/);
  assert.match(templates, /可选：其他附件/);
  assert.match(templates, /Optional: other attachments/);
  assert.doesNotMatch(templates, /<base_name>_round_2_framework\.png/);
  assert.match(
    templates,
    /<base_name>_round_4_framework_reconstruction\.png/,
  );
  assert.match(templates, /contentKind:\s*"framework-figure"/);
  assert.match(templates, /showStyleDirective:\s*false/);
  assert.match(templates, /showAppendixConfiguration:\s*false/);
  assert.match(templates, /showLengthBudget:\s*false/);
  const originalPromptFiles = sourceFiles.filter(
    (file) =>
      /^Round_[1-5].*\.md$/.test(file) ||
      file === "Submission_Strategy_and_Verification.md",
  );
  assert.equal(originalPromptFiles.length, 6);
  assert.equal(
    sourceFiles.includes("Round_1_Manuscript_Evidence_Audit.md"),
    false,
  );
  const originalPrompts = (
    await Promise.all(
      originalPromptFiles.map((file) =>
        readFile(
          new URL(`../content/prompts/source/${file}`, import.meta.url),
          "utf8",
        ),
      ),
    )
  ).join("\n");
  assert.match(
    originalPrompts,
    /Abstract 必须为一个连续英文段落，并执行页面注入的 Abstract 预算/,
  );
  assert.match(
    originalPrompts,
    /固定以 `To address these challenges, we \.\.\.` 开头/,
  );
  assert.match(originalPrompts, /\*\*Method\*\*：3–4 句/);
  assert.match(originalPrompts, /\*\*Results\*\*：2–3 句/);
  assert.match(originalPrompts, /\*\*Implication\*\*：恰好 1 句/);
  assert.match(
    originalPrompts,
    /其他术语只有在摘要内确需多次出现时才定义缩写/,
  );
  assert.match(originalPrompts, /建议只保留 2–4 个最有代表性的结果数字/);
  assert.match(
    originalPrompts,
    /不得堆叠模块名、损失名、变量名、实验设置名/,
  );
  assert.match(originalPrompts, /标题为 3–7 个英文单词/);
  assert.match(originalPrompts, /15–25 个真实 BibTeX key/);
  assert.match(originalPrompts, /不得出现本文方法名，不得使用 `we`/);
  assert.match(originalPrompts, /4–7 个拉丁字母/);
  assert.doesNotMatch(originalPrompts, /## 任务 A：Title 重构/);
  assert.doesNotMatch(originalPrompts, /摘要正文只允许出现一个缩写/);
  assert.match(originalPrompts, /可选的其他附件/);
  assert.match(originalPrompts, /本步骤允许正文临时上浮 20%/);
  assert.doesNotMatch(originalPrompts, /临时上限为 6,000 词/);
  assert.match(
    originalPrompts,
    /Experiments and Results 的现有内容不得精简、删除、弱化或移入附录/,
  );
  assert.equal(
    (originalPrompts.match(/所有表格和图片各按 \*\*200 词\*\*/g) ?? [])
      .length,
    3,
  );
  assert.match(originalPrompts, /会议论文不得单设 `Overview` 小节/);
  assert.match(originalPrompts, /期刊论文必须单设 `Overview`，恰好两个普通段落且总计不超过 80 词/);
  assert.match(originalPrompts, /后续小节不绑定第三或第四的固定序号/);
  assert.match(originalPrompts, /\\paragraph\{Experimental Configuration\}/);
  assert.doesNotMatch(
    originalPrompts,
    /<base_name>_round_2_framework\.png/,
  );
  assert.match(originalPrompts, /画布固定为横版 `16:9`/);
  assert.match(originalPrompts, /自行判断使用 2 种还是 3 种强调色/);
  assert.match(originalPrompts, /使用极简论文线稿/);
  assert.match(originalPrompts, /不使用图内大标题/);
  assert.match(
    originalPrompts,
    /<base_name>_round_4_framework_reconstruction\.png/,
  );
  assert.match(originalPrompts, /三个承担综合解释、适用范围与科学意义的 discussion/);
  assert.match(originalPrompts, /不得引用 Experiments 中的表格或图片/);
  assert.doesNotMatch(originalPrompts, /第四个必须为 `Ablation Studies`/);
  assert.doesNotMatch(originalPrompts, /^# 第\d+轮：/m);
  assert.doesNotMatch(originalPrompts, /## 使用方式/);
  assert.doesNotMatch(originalPrompts, /## 跨窗口独立运行规则/);
  assert.doesNotMatch(originalPrompts, /round_6_(?:venue|journal)/);
  assert.doesNotMatch(originalPrompts, /## 本轮文件名[\s\S]*journal_targeting/);
  assert.match(
    originalPrompts,
    /MDPI、Hindawi 和 Frontiers 是用户明确排除的出版社/,
  );
  assert.match(
    originalPrompts,
    /直接在当前对话中输出完整中文检索结果/,
  );
  const finalRefinementSource = await readFile(
    new URL(
      "../content/prompts/source/Round_5_Full_Manuscript_Refinement_and_Audit.md",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(finalRefinementSource, /全文长度与章节预算/);
  assert.doesNotMatch(finalRefinementSource, /附录|Appendix/);
  assert.doesNotMatch(finalRefinementSource, /总词数|章节词数|句长统计/);
  assert.doesNotMatch(finalRefinementSource, /4,850|5,000|5,150/);

  assert.match(component, /allocateWords/);
  assert.match(component, /RECONSTRUCTION_PROMPTS/);
  assert.doesNotMatch(component, /PROMPT_TEMPLATES/);
  assert.match(component, /buildPrompt\(round/);
  assert.match(component, /setPromptLanguages/);
  assert.match(component, /togglePromptLanguage/);
  assert.match(component, /hasWordLimit/);
  assert.match(component, /unlimitedCoreSections/);
  assert.match(component, /setUnlimitedCoreSections/);
  assert.match(component, /UNLIMITED_CORE_SECTION_IDS/);
  assert.match(component, /allocation-policy-row/);
  assert.match(component, /allocation-item-unlimited/);
  assert.match(component, /setTargetWords\(nextTotal\)/);
  assert.match(component, /setAllocationMode\("custom"\)/);
  assert.match(component, /yanshu-workbench-web/);
  assert.match(component, /roundLanguages:\s*promptLanguages/);
  assert.match(component, /\.yanshu\.json/);
  assert.match(
    component,
    /allocationExpanded,\s*setAllocationExpanded\]\s*=\s*useState\(true\)/,
  );
  assert.match(component, /setAllocationExpanded\(enabled\)/);
  assert.match(component, /formatRatio\(actualRatio\)/);
  assert.match(component, /<SiteNavigation/);
  assert.match(component, /<PromptResizeHandle language=\{uiLanguage\}/);
  assert.match(component, /content-section prompt-rail/);
  assert.match(navigation, /global-language-control/);
  assert.match(navigation, /className="site-topbar"/);
  assert.match(navigation, /className="topbar-brand"/);
  assert.match(navigation, /className="top-nav-list"/);
  assert.doesNotMatch(navigation, /site-sidebar|desktopCollapsed/);
  assert.match(navigation, /href:\s*"\/"/);
  assert.match(navigation, /href:\s*"\/draft"/);
  assert.match(navigation, /href:\s*"\/reconstruction"/);
  assert.match(navigation, /href:\s*"\/submission"/);
  assert.doesNotMatch(navigation, /navWriting|id:\s*"writing"/);
  assert.match(
    styles,
    /--prompt-rail-width:\s*40%[\s\S]*?@media \(min-width: 1101px\)[\s\S]*?grid-template-columns:[\s\S]*?var\(--prompt-rail-width\)[\s\S]*?\.prompt-rail[\s\S]*?position: sticky/,
  );
  assert.match(styles, /\.prompt-resize-handle[\s\S]*?cursor: col-resize/);
  assert.match(resizer, /DEFAULT_PROMPT_WIDTH\s*=\s*40/);
  assert.match(resizer, /MIN_PROMPT_WIDTH\s*=\s*30/);
  assert.match(resizer, /MAX_PROMPT_WIDTH\s*=\s*60/);
  assert.match(resizer, /setPointerCapture/);
  assert.match(resizer, /--prompt-rail-width/);
  assert.match(resizer, /event\.key === "ArrowLeft"/);
  assert.match(resizer, /onDoubleClick/);
  assert.match(submission, /content-section prompt-rail submission-prompt-section/);
  assert.match(submission, /<PromptResizeHandle language=\{uiLanguage\}/);
  assert.match(component, /className="allocation-target"/);
  assert.doesNotMatch(component, /paperStyle\.defaultTargetWords[\s\S]{0,180}copy\.words/);
  assert.doesNotMatch(component, /config-control language-control/);
  assert.doesNotMatch(component, /planner-section|upcoming-section|about-section/);
  assert.match(component, /navigator\.clipboard/);
  assert.match(component, /aria-live="polite"/);
  assert.match(builder, /if \(!context\.hasWordLimit\) return ""/);
  assert.match(builder, /sectionBudgets/);
  assert.match(builder, /appendixDirective/);
  assert.match(builder, /template\.showStyleDirective === false/);
  assert.match(builder, /template\.showAppendixConfiguration === false/);
  assert.match(builder, /template\.showLengthBudget !== false/);
  assert.match(builder, /submissionPreferences/);
  assert.match(builder, /context\.unlimitedCoreSections/);
  assert.match(builder, /activeWordLimitConstraints/);
  assert.match(builder, /flexibleCoreWordLimit/);
  assert.match(builder, /buildDetailedCore/);
  assert.match(builder, /inlineStyleConstraints/);
  assert.match(builder, /inlineWordLimits/);
  assert.match(builder, /replaceAll\(`\{\{\$\{fragment\.marker\}\}\}`/);
  assert.match(builder, /WORD_COUNT_POLICY\.visualWordEquivalent/);
  assert.match(builder, /labels\.jcrQuartiles/);
  assert.match(builder, /labels\.casZones/);
  assert.match(builder, /labels\.citationIndexes/);
  assert.match(builder, /labels\.excludedPublishers/);
  assert.match(builder, /PROMPT_DETAILED_CONSTRAINTS/);
  assert.match(builder, /PROMPT_STEP_POLICIES/);
  assert.match(builder, /temporary_ceiling_words/);
  assert.match(builder, /context\.includeAppendix \? "enabled" : "disabled"/);
  assert.doesNotMatch(builder, /labels\.round|labels\.usage/);
  assert.doesNotMatch(builder, /common\.independence/);
  assert.match(builder, /context\.hasWordLimit && activeWordLimitConstraints/);
  assert.match(builder, /interpolateConstraints/);
  assert.match(constraints, /Abstract 的固定结构/);
  assert.match(
    constraints,
    /Abstract 为 \{\{abstract_min\}\}–\{\{abstract_max\}\} 词/,
  );
  assert.match(
    constraints,
    /Bridge 为 12–18 词/,
  );
  assert.match(constraints, /Method 每句 16–24 词/);
  assert.match(constraints, /Results 每句 14–22 词/);
  assert.match(constraints, /Implication 为 12–18 词/);
  assert.match(constraints, /论文标题与品牌缩写/);
  assert.match(constraints, /marker:\s*"abstract_word_limits"/);
  assert.match(constraints, /marker:\s*"method_word_limits"/);
  assert.doesNotMatch(constraints, /marker:\s*"final_length_limits"/);
  assert.doesNotMatch(constraints, /启用字数限制时的完整定量约束/);
  assert.match(constraints, /Method 的固定结构约束/);
  assert.match(constraints, /Claim–Evidence 终审/);
  assert.match(constraints, /100 分匹配评分/);
  assert.match(
    constraints,
    /temporaryMainTextCeilingMultiplier:\s*1\.2/,
  );
  assert.match(
    constraints,
    /protectedSectionIds:\s*\["method", "experiments-results"\]/,
  );
  assert.match(constraints, /本步骤临时上限与附录分流规则/);
  assert.match(constraints, /当前 Method 不设词数范围/);
  assert.match(constraints, /因正文没有总量上限，20% 临时上浮规则不适用/);
  assert.match(
    constraints,
    /Problem Definition 与当前论文类型规定的 Overview 结构仍须满足/,
  );
  assert.match(constraints, /method_document_hierarchy/);
  assert.match(constraints, /narrative_related_work_structure/);
  assert.match(constraints, /narrative_discussion_structure/);
  assert.doesNotMatch(
    constraints,
    /\{\{narrative_related_work_word_limits\}\}/,
  );
  assert.match(constraints, /现有图表与正文接口审计/);
  assert.match(constraints, /不绑定第三或第四的固定序号/);
  assert.match(constraints, /具体结果数字最多保留三个/);
  assert.match(
    builder,
    /仅标有数字预算的章节必须达标/,
  );
  assert.match(constraints, /只允许、并不要求使用附录/);
  assert.match(
    constraints,
    /若正文能够满足当前适用的总量与章节预算，不得使用附录/,
  );
  assert.match(constraints, /wordLimitPlacement:\s*"after-budget"/);
  assert.doesNotMatch(constraints, /"evidence-audit"/);
  assert.match(submission, /DEFAULT_SUBMISSION_PREFERENCES/);
  assert.match(submission, /SUBMISSION_PROMPT_TEMPLATE/);
  assert.match(submission, /buildPrompt\(SUBMISSION_PROMPT_TEMPLATE/);
  assert.match(submission, /preferences\.apc === "yes"/);
  assert.match(submission, /preferences\.useImpactFactorRange/);
  assert.match(submission, /preferences\.requireReviewArticles/);
  assert.match(submission, /updateImpactFactorMinimum/);
  assert.match(submission, /updateImpactFactorMaximum/);
  assert.match(submission, /toggleValue<JcrQuartile>/);
  assert.match(submission, /toggleValue<CasZone>/);
  assert.match(submission, /toggleValue<CitationIndex>/);
  assert.match(submissionConfig, /jcrQuartiles:\s*\[\]/);
  assert.match(submissionConfig, /casZones:\s*\[\]/);
  assert.match(submissionConfig, /citationIndexes:\s*\[\]/);
  assert.match(submissionConfig, /useImpactFactorRange:\s*false/);
  assert.match(submissionConfig, /impactFactorMin:\s*0/);
  assert.match(submissionConfig, /impactFactorMax:\s*20/);
  assert.match(submissionConfig, /requireReviewArticles:\s*false/);
  assert.match(
    submissionConfig,
    /excludedPublishers:\s*\["MDPI", "Hindawi", "Frontiers"\]/,
  );
  assert.match(promptReadme, /source\/.*five active Markdown prompts/s);
  assert.match(
    promptReadme,
    /four reconstruction cards and the separate submission-strategy/,
  );
  assert.match(promptReadme, /unlimitedCoreSections/);
  assert.match(promptReadme, /counted as 200 words/);
  assert.match(page, /<HomePage \/>/);
  assert.match(layout, /研术台 · YanShu Workbench/);
  assert.match(layout, /\/og\.png/);
  assert.match(packageJson, /"name": "yanshu-workbench-site"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("app/_sites-preview/", templateRoot)),
  );
});

test("keeps research-figure choices and prompt rules configuration-driven", async () => {
  const [figureConfig, figureComponent, figurePage, navigation] =
    await Promise.all([
      readFile(new URL("../app/figures/config.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/figures/FigureWorkbench.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/figures/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
    ]);

  assert.match(figureConfig, /promptId:\s*"introduction"/);
  assert.match(figureConfig, /placementId:\s*"single-column"/);
  assert.match(figureConfig, /aspectRatioId:\s*"landscape-4-3"/);
  assert.doesNotMatch(
    figureConfig,
    /canvasPresetId|includeIntroductionFigure|includeMethodOverview|includeTechnicalDetailFigure/,
  );
  assert.doesNotMatch(figureConfig, /technicalFigureCount|TechnicalFigureCount/);
  assert.match(
    figureConfig,
    /introduction:\s*\{[\s\S]*?placementId:\s*"single-column"[\s\S]*?aspectRatioId:\s*"landscape-4-3"/,
  );
  assert.match(
    figureConfig,
    /"method-overview":\s*\{[\s\S]*?placementId:\s*"double-column"[\s\S]*?aspectRatioId:\s*"landscape-16-9"/,
  );
  assert.match(figureConfig, /ratio:\s*"4:3"/);
  assert.match(figureConfig, /ratio:\s*"3:4"/);
  assert.match(figureConfig, /ratio:\s*"16:9"/);
  assert.match(figureConfig, /ratio:\s*"9:16"/);
  assert.match(figureConfig, /custom:\s*\{[\s\S]*?ratio:\s*null/);
  assert.match(figureConfig, /customAspectWidth:\s*5/);
  assert.match(figureConfig, /customAspectHeight:\s*4/);
  assert.match(figureConfig, /getFigureAspectRatio/);
  assert.match(figureConfig, /greatestCommonDivisor/);
  assert.match(figureConfig, /自定义宽高比/);
  assert.doesNotMatch(figureConfig, /ratio:\s*"2:1"|ratio:\s*"1:2"/);
  assert.match(figureConfig, /双栏论文中的单栏宽度/);
  assert.match(figureConfig, /横跨两栏的通栏宽度/);
  assert.match(figureConfig, /styleId:\s*"conference-minimal"/);
  assert.match(figureConfig, /lineColorMode:\s*"neutral"/);
  assert.match(figureConfig, /accentColorCount:\s*1/);
  assert.match(figureConfig, /allowLightIllustrations:\s*false/);
  assert.match(figureConfig, /useCardFills:\s*false/);
  assert.match(figureConfig, /fontSizeLevels:\s*2/);
  assert.match(figureConfig, /includeLargeTitle:\s*false/);
  assert.match(figureConfig, /paletteId:\s*"academic-blue"/);
  assert.match(figureConfig, /fontFamilyId:\s*"arial"/);
  assert.match(figureConfig, /"conference-minimal"/);
  assert.match(figureConfig, /"illustrated-technical"/);
  assert.doesNotMatch(figureConfig, /"structured-technical"|"light-academic"/);
  assert.match(
    figureConfig,
    /"illustrated-technical":\s*\{[\s\S]*?lineColorMode:\s*"semantic"[\s\S]*?accentColorCount:\s*2[\s\S]*?allowLightIllustrations:\s*true[\s\S]*?useCardFills:\s*true[\s\S]*?fontSizeLevels:\s*3/,
  );
  assert.match(figureConfig, /FIGURE_PROMPT_ORDER/);
  assert.match(figureConfig, /buildFigurePrompt/);
  assert.match(figureConfig, /不得翻译、改写或自造近义词/);
  assert.match(figureConfig, /今天仍存在什么关键障碍/);
  assert.match(figureConfig, /整个方法如何组织并运转/);
  assert.match(figureConfig, /最需要视觉解释的一项核心机制/);
  assert.match(figureConfig, /只生成这一张图/);
  assert.match(figureConfig, /论文占栏/);
  assert.match(figureConfig, /比例选择器设为/);
  assert.match(figureConfig, /目标 venue 的正式模板/);
  assert.match(figureConfig, /全图严格只使用两级字号/);
  assert.match(figureConfig, /最大字号不得超过最小字号的 1\.25 倍/);
  assert.match(figureConfig, /最大字号不得超过最小字号的 1\.35 倍/);
  assert.match(figureConfig, /禁止浅灰色、低透明度或低对比度文字/);
  assert.match(figureConfig, /纯白背景、黑色文字和深色中性结构线/);
  assert.match(figureConfig, /FIGURE_COLOR_PALETTES/);
  assert.match(figureConfig, /"blue-orange"/);
  assert.match(figureConfig, /"teal-purple"/);
  assert.match(figureConfig, /FIGURE_FONT_FAMILIES/);
  assert.match(figureConfig, /Times New Roman/);
  assert.match(figureConfig, /Comic Sans MS/);
  assert.match(figureConfig, /材料足够时直接生成最终图片/);
  assert.doesNotMatch(figureConfig, /## 工作顺序|## Workflow/);
  assert.doesNotMatch(figureConfig, /After I approve the plan/);
  assert.doesNotMatch(
    figureConfig,
    /保持 Overview 粒度|Stay at overview granularity/,
  );
  assert.match(figureComponent, /buildFigurePrompt\(\s*activePromptId/);
  assert.match(figureComponent, /setPromptLanguages/);
  assert.match(figureComponent, /selectFigurePrompt/);
  assert.match(
    figureComponent,
    /\.\.\.FIGURE_DEFAULT_LAYOUT\[promptId\]/,
  );
  assert.match(figureComponent, /selectFigureStyle/);
  assert.match(figureComponent, /\.\.\.FIGURE_STYLE_DEFAULTS\[styleId\]/);
  assert.match(figureComponent, /role="radiogroup"/);
  assert.match(figureComponent, /role="radio"/);
  assert.match(figureComponent, /FIGURE_PLACEMENT_IDS\.map/);
  assert.match(figureComponent, /FIGURE_ASPECT_RATIO_IDS\.map/);
  assert.match(figureComponent, /getFigureAspectRatio\(preferences\)/);
  assert.match(figureComponent, /copy\.customRatioWidth/);
  assert.match(figureComponent, /copy\.customRatioHeight/);
  assert.match(
    figureComponent,
    /DEFAULT_PROMPT_EXPANSION[\s\S]*?introduction:\s*true[\s\S]*?"method-overview":\s*true[\s\S]*?"technical-detail":\s*true/,
  );
  assert.match(figureComponent, /ACCENT_COLOR_COUNTS\.map/);
  assert.match(figureComponent, /FONT_SIZE_LEVELS\.map/);
  assert.match(figureComponent, /FIGURE_COLOR_PALETTE_IDS\.map/);
  assert.match(figureComponent, /FIGURE_FONT_FAMILY_IDS\.map/);
  assert.match(figureComponent, /preferences\.paletteId/);
  assert.match(figureComponent, /preferences\.fontFamilyId/);
  assert.doesNotMatch(figureComponent, /selectedPromptIds\.map/);
  assert.match(figureComponent, /copiedPrompt === activePromptId/);
  assert.doesNotMatch(figureComponent, /setTechnicalFigureCount/);
  assert.match(figureComponent, /navigator\.clipboard/);
  assert.match(figureComponent, /activePage="figures"/);
  assert.match(
    figureComponent,
    /<PromptResizeHandle language=\{uiLanguage\}/,
  );
  assert.match(
    figureComponent,
    /content-section prompt-rail figure-prompt-section/,
  );
  assert.match(figurePage, /<FigureWorkbench \/>/);
  assert.match(navigation, /href:\s*"\/figures"/);
});

test("keeps paper-draft templates and provenance rules configuration-driven", async () => {
  const [draftConfig, draftComponent, draftPage, navigation, homePage] =
    await Promise.all([
      readFile(new URL("../app/draft/config.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/draft/DraftWorkbench.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/draft/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/HomePage.tsx", import.meta.url), "utf8"),
    ]);

  assert.match(draftConfig, /DEFAULT_DRAFT_TEMPLATE_ID[^;]*"arxiv"/s);
  assert.match(
    draftConfig,
    /https:\/\/github\.com\/kourgeorge\/arxiv-style/,
  );
  assert.match(draftConfig, /NeurIPS/);
  assert.match(draftConfig, /ICML/);
  assert.match(draftConfig, /ICLR/);
  assert.match(draftConfig, /CVPR/);
  assert.match(draftConfig, /ACL/);
  assert.match(draftConfig, /不得沿用旧届模板或非官方镜像/);
  assert.match(draftConfig, /预印本回退/);
  assert.match(draftConfig, /TEMPLATE_SOURCE\.md/);
  assert.match(draftConfig, /不得发明实验数字/);
  assert.match(draftConfig, /论文写作、LaTeX、文件生成或编译 Skill/);
  assert.match(draftComponent, /buildDraftPrompt/);
  assert.match(draftComponent, /activePage="draft"/);
  assert.match(draftComponent, /<PromptResizeHandle language=\{uiLanguage\}/);
  assert.match(draftComponent, /useState\(true\)/);
  assert.match(draftPage, /<DraftWorkbench \/>/);
  assert.match(navigation, /href:\s*"\/draft"/);
  assert.match(homePage, /href="\/draft"/);
  assert.match(homePage, /href="\/reconstruction"/);
});
