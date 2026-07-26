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
  assert.match(html, /<title>研术台 · YanShu<\/title>/i);
  assert.match(html, /从实验完成，到论文可投稿/);
  assert.match(html, /五轮重构，支持断点继续/);
  assert.match(html, /Workflow\s*(?:<!-- -->)?2026\.07\.8/);
  assert.match(html, /同一份 Prompt/);
  assert.match(html, /最小材料链/);
  assert.match(html, /一次交接/);
  assert.match(html, /选择当前最需要完成的一步/);
  assert.match(html, /论文初稿/);
  assert.match(html, /论文重构/);
  assert.match(html, /科研绘图/);
  assert.match(html, /投稿策略/);
  assert.match(html, /论文写作/);
  assert.match(html, /实验与复现/);
  assert.match(html, /科研图表/);
  assert.match(html, /投稿与审校/);
  assert.match(html, /搜索/);
  assert.match(html, /Idea 查找/);
  assert.match(html, /Idea 评估与优化/);
  assert.match(html, /全文初稿/);
  assert.match(html, /分章节写作/);
  assert.match(html, /全文重构/);
  assert.match(html, /章节精修/);
  assert.match(html, /专项审计/);
  assert.match(html, /href="\/reconstruction\/audit"/);
  assert.match(html, /版本转换/);
  assert.match(html, /实验方案设计/);
  assert.match(html, /Baseline 与复现/);
  assert.match(html, /实验代码/);
  assert.match(html, /结果分析/);
  assert.match(html, /可复现性/);
  assert.match(html, /科学示意图/);
  assert.match(html, /实验绘图/);
  assert.match(html, /论文表格/);
  assert.match(html, /图表审计/);
  assert.match(html, /投稿定位/);
  assert.match(html, /投稿前终检/);
  assert.match(html, /投稿材料/);
  assert.match(html, /审稿与返修/);
  assert.match(html, /搜索功能或页面/);
  assert.doesNotMatch(html, /关于研术台|About YanShu/);
  assert.match(html, /href="\/draft"/);
  assert.match(html, /href="\/reconstruction"/);
  assert.match(html, /href="\/reconstruction\/refinement"/);
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
  assert.match(html, /总体框架图/);
  assert.match(html, /画布比例/);
  assert.match(html, /Tol 鲜明色系/);
  assert.match(html, /2–3 个强调色为上限/);
  assert.match(html, /Calibri/);
  assert.match(html, /可按需使用与论文对象直接对应的简化科学图形/);
  assert.doesNotMatch(html, /论文占栏/);
  assert.match(html, /ChatGPT 执行/);
  assert.match(html, /最新可用推理模型/);
  assert.match(html, /结果检查间隔/);
  assert.match(html, /Medium \/ High 1 分钟/);
  assert.match(html, /自动最强/);
  assert.match(html, /Extra High/);
  assert.match(html, /不锁定 GPT 型号名称/);
  assert.match(html, /发生回退时先明确提示/);
  assert.match(html, /正文与章节预算/);
  assert.match(html, /不限制方法和实验的字数/);
  assert.match(html, /每张表格或图片按 200 词计入/);
  assert.match(html, /导出桌面配置/);
  assert.match(html, /class="codex-launch-guide"/);
  assert.match(html, /在 Codex 中启动/);
  assert.match(html, /发送给 Codex/);
  assert.match(html, /复制给 Codex/);
  assert.match(html, /panzhzh\/yanshu-workbench/);
  assert.match(html, /yanshu-workbench@yanshu-workbench/);
  assert.match(html, /新建一个 Codex 任务/);
  assert.match(html, /从断点继续/);
  assert.match(html, /重新配置/);
  assert.match(html, /复制全部/);
  assert.equal((html.match(/>English<\/button>/g) ?? []).length, 5);
  assert.match(html, /科学定位与结构重构/);
  assert.match(html, /重构方法总览框架图/);
  assert.doesNotMatch(html, /RECONSTRUCTION WORKFLOW|五步重构工作流/);
  assert.doesNotMatch(html, /class="workflow-context"|class="prompt-number"/);
  assert.doesNotMatch(html, /投稿目标检索与官网核验/);
  assert.match(html, /Scientific Positioning Contract/);
  assert.match(html, /论文标题与品牌缩写/);
  assert.match(html, /4–7 个拉丁字母/);
  assert.match(html, /不提供候选标题/);
  assert.match(
    html,
    /会议论文需要第三层标题时使用 paragraph 而非 subsubsection/,
  );
  assert.match(
    html,
    /标题只命名真实科学对象、机制、实验设置或分析主题/,
  );
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
  assert.match(html, /_round_1_artifacts\.zip/);
  assert.match(html, /完整当前 BibTeX 文献库/);
  assert.match(html, /_round_1_references\.bib/);
  assert.doesNotMatch(html, /_round_1_bib_suggestions\.bib/);
  assert.match(
    html,
    /data-reconstruction-workflow-version="2026\.07\.8"/,
  );
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

test("server-renders the section-refinement workbench", async () => {
  const response = await render("/reconstruction/refinement");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /章节精修/);
  assert.match(html, /每个章节使用独立精修合同/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.match(
    html,
    /class="content-section prompt-rail refinement-prompt-section"/,
  );
  assert.match(html, /完整 \.tex/);
  assert.match(html, /最新编译 \.pdf/);
  assert.match(html, /完整 \.bib/);
  assert.match(html, /figures\/（可选）/);
  assert.match(html, /缺少 figures\/ 不阻止精修/);
  assert.doesNotMatch(html, /论文类型/);
  assert.match(html, /精修章节/);
  assert.match(html, /Abstract/);
  assert.match(html, /Introduction/);
  assert.match(html, /Related Work/);
  assert.match(html, /Method/);
  assert.match(html, /Experiments &amp; Results/);
  assert.match(html, /Discussion/);
  assert.match(html, /Conclusion/);
  assert.match(html, /章节专用约束/);
  assert.match(html, /Results 关键数字/);
  assert.match(html, /默认建议 2–4 个/);
  assert.match(html, /Keywords 数量/);
  assert.match(html, /每个 Keyword 词数/);
  assert.match(html, /精修范围总量/);
  assert.match(html, /保持当前长度/);
  assert.match(html, /自定义区间/);
  assert.match(html, /普通句子词数/);
  assert.match(html, /改写强度/);
  assert.match(html, /深度精修/);
  assert.match(html, /允许冒号/);
  assert.doesNotMatch(html, /引用策略/);
  assert.doesNotMatch(html, /允许 we \/ our/);
  assert.match(html, /class="prompt-card expanded"/);
  assert.match(html, /# 精修 摘要/);
  assert.match(html, /Abstract 必须为一个连续英文段落/);
  assert.match(html, /整段保留 2–4 个最能支撑核心 claim 的数字/);
  assert.match(html, /使用 4–5 个高信息量英文关键词/);
  assert.match(html, /每个关键词 1–2 个词/);
  assert.match(html, /不鼓励使用本文方法之外的缩写/);
  assert.match(html, /摘要不使用任何引用/);
  assert.match(html, /当前精修范围目标为 190–220 个英文单词/);
  assert.match(html, /普通句子目标为 12–24 个英文单词/);
  assert.match(html, /冒号只在确有必要/);
  assert.doesNotMatch(html, /论文类型：/);
  assert.match(html, /完整、连续、可编译的英文论文/);
  assert.match(html, /_abstract_refinement_report_zh\.md/);
});

test("server-renders the multi-select specialized-audit workbench", async () => {
  const response = await render("/reconstruction/audit");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /专项审计/);
  assert.match(html, /一个 Prompt 建立共享证据台账/);
  assert.match(html, /class="prompt-resize-handle"/);
  assert.match(html, /完整 \.tex/);
  assert.match(html, /最新编译 \.pdf/);
  assert.match(html, /完整 \.bib/);
  assert.match(html, /figures\/（按需）/);
  assert.match(html, /专业术语与命名/);
  assert.match(html, /引用与 BibTeX/);
  assert.match(html, /数据与数字一致性/);
  assert.match(html, /图表与交叉引用/);
  assert.match(html, /Claim–证据对齐/);
  assert.match(html, /符号、公式与单位/);
  assert.match(html, /可复现性信息/);
  assert.match(html, /跨章节重复与错位/);
  assert.match(html, /已选/);
  assert.match(html, /全选/);
  assert.match(html, /清空/);
  assert.match(html, /只审计，不改稿/);
  assert.match(html, /审计并安全修复/);
  assert.match(html, /只修改已确认错误的最小片段/);
  assert.match(html, /安全修复采用严格最小差异/);
  assert.match(html, /专项审计 · 4 项/);
  assert.match(html, /# 论文专项联合审计/);
  assert.match(html, /\[TERM\] 专业术语与命名/);
  assert.match(html, /\[BIB\] 引用与 BibTeX/);
  assert.match(html, /\[DATA\] 数据与数字一致性/);
  assert.match(html, /\[VIS\] 图表与交叉引用/);
  assert.doesNotMatch(html, /\[CLAIM\] Claim–证据对齐/);
  assert.match(html, /同一根因只生成一个稳定问题 ID/);
  assert.match(html, /Blocker \/ Major \/ Minor/);
  assert.match(html, /不修改 \.tex、\.bib、图片或 PDF/);
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
  assert.match(html, /读取完整实验材料，生成证据一致、可编译并可继续修改/);
  assert.doesNotMatch(html, /DRAFTING PROMPT|当前论文初稿 Prompt|独立 Prompt/);
  assert.doesNotMatch(html, /class="prompt-number"/);
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
  assert.doesNotMatch(html, /TARGETING PROMPT|投稿目标检索 Prompt|实时 Prompt/);
  assert.doesNotMatch(html, /class="prompt-number"/);
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
  assert.match(html, /可选编译稿/);
  assert.match(html, /本站不读取或保存论文/);
  assert.match(html, /引言图/);
  assert.match(html, /任务定义图/);
  assert.match(html, /方法总览图/);
  assert.match(html, /核心机制细节图/);
  assert.match(html, /训练–推理图/);
  assert.match(html, /算法／协议图/);
  assert.match(html, /数据构建图/);
  assert.match(html, /系统／部署图/);
  assert.match(html, /理论／概念关系图/);
  assert.match(html, /几何／坐标关系图/);
  assert.match(html, /综述／分类体系图/);
  assert.match(html, /这张图主要需要回答什么？/);
  assert.match(html, /核心论文图/);
  assert.match(html, /过程与系统/);
  assert.match(html, /更多专业图型/);
  assert.match(html, /此页负责科学示意图，不负责实验数据图/);
  assert.match(html, /真实 attention 或 feature heatmap/);
  assert.match(html, /机制图中的示意 matrix、mask 与 token heatmap 仍可使用/);
  assert.match(html, /11 种图型分别保存自己的设置/);
  assert.match(html, /画布比例/);
  assert.doesNotMatch(html, /极简论文线稿|轻插图技术图/);
  assert.doesNotMatch(html, /论文占栏|单栏|跨双栏/);
  assert.match(html, /横版 4:3/);
  assert.match(html, /横版 3:2/);
  assert.match(html, /竖版 3:4/);
  assert.match(html, /横版 16:9/);
  assert.match(html, /超宽 2:1/);
  assert.match(html, /竖版 9:16/);
  assert.match(html, /自定义/);
  assert.match(html, /输入任意宽高比例/);
  assert.match(html, /4:3/);
  assert.match(html, /3:2/);
  assert.match(html, /3:4/);
  assert.match(html, /16:9/);
  assert.match(html, /2:1/);
  assert.match(html, /9:16/);
  assert.match(html, /线条颜色/);
  assert.match(html, /统一深色/);
  assert.match(html, /按语义区分/);
  assert.match(html, /强调色范围/);
  assert.match(html, /1–2/);
  assert.match(html, /色系/);
  assert.match(html, /Tol 鲜明 · 蓝橙/);
  assert.match(html, /Tol 明亮 · 蓝红绿黄/);
  assert.match(html, /Tol 柔和 · 靛玫瑰青沙/);
  assert.match(html, /全图字体/);
  assert.match(html, /Times New Roman/);
  assert.match(html, /Arial/);
  assert.match(html, /Calibri/);
  assert.match(html, /Comic Sans MS/);
  assert.match(html, /技术图形与图标/);
  assert.match(html, /容器卡片底色/);
  assert.match(html, /全部纯白/);
  assert.match(html, /关键区域浅底/);
  assert.match(html, /按语义区域浅底/);
  assert.match(html, /字号层级/);
  assert.match(html, /2 级字号/);
  assert.match(html, /3 级字号/);
  assert.match(html, /不得缩成微型文字/);
  assert.match(html, /不使用/);
  assert.match(html, /方法总览图/);
  assert.match(html, /整体心智地图/);
  assert.match(html, /class="prompt-card expanded"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /Yanshu Scientific Figure Director — Common Base/);
  assert.match(html, /Figure-Type Adapter — Method Overview Figure/);
  assert.match(html, /User-Selected Visual Configuration/);
  assert.match(html, /Output and Two-Step Execution Protocol/);
  assert.match(html, /本轮不要生成图片/);
  assert.match(html, /FINAL IMAGE PROMPT/);
  assert.match(html, /VISUAL THESIS/);
  assert.match(html, /COMPOSITION/);
  assert.match(html, /SCIENTIFIC VISUAL OBJECTS/);
  assert.match(html, /FLOW AND RELATIONSHIPS/);
  assert.match(html, /STYLE SPECIFICATION/);
  assert.match(html, /EXACT TEXT AND MATH/);
  assert.match(html, /NEGATIVE CONSTRAINTS/);
  assert.match(html, /输入“开始绘图”生成这张图/);
  assert.match(html, /Generate after confirmation/);
  assert.doesNotMatch(html, /RGB\(/);
  assert.doesNotMatch(html, /TWO-STEP FIGURE PROMPT|两步制图 Prompt/);
  assert.doesNotMatch(html, /class="figure-prompt-summary"|class="prompt-number"/);
  assert.doesNotMatch(
    html,
    /## 目标|成功标准：|## 输入与取证|## 这张图必须完成|## 不得混入|## 统一视觉与文字约束/,
  );
  assert.doesNotMatch(
    html,
    /论文占栏：|画布比例：|视觉风格：|线条颜色：|强调色：|全图字体：|轻插图与图标：|模块卡片底色：|字号层级：|大标题：/,
  );
  assert.doesNotMatch(html, /## 直接生成|直接生成最终图片/);
  assert.doesNotMatch(html, /保持 Overview 粒度|Stay at overview granularity/);
  assert.equal((html.match(/class="prompt-card(?:\s|")/g) ?? []).length, 1);
  assert.doesNotMatch(html, /上传文件<\/button>/);
});

test("keeps presets and production prompts configuration-driven", async () => {
  const [
    config,
    component,
    navigation,
    navigationConfig,
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
    chatExecutionConfig,
    sourceFiles,
  ] = await Promise.all([
    readFile(new URL("../app/config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/YanshuWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/navigation.ts", import.meta.url), "utf8"),
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
    readFile(
      new URL("../content/prompts/chatExecution.ts", import.meta.url),
      "utf8",
    ),
    readdir(new URL("../content/prompts/source/", import.meta.url)),
  ]);

  assert.match(config, /defaultTargetWords:\s*4500/);
  assert.match(config, /defaultTargetWords:\s*5000/);
  assert.match(config, /引言 480 词，讨论与局限占 10%，结论 200 词/);
  assert.match(config, /ratio:\s*0\.10666666666666667/);
  assert.match(config, /ratio:\s*0\.1/);
  assert.match(config, /ratio:\s*0\.044444444444444446/);
  assert.match(config, /第三层使用 paragraph 而非 subsubsection/);
  assert.match(config, /目录层级默认止于 subsubsection/);
  assert.doesNotMatch(
    config,
    /section → subsection → subsubsection → paragraph/,
  );
  assert.match(config, /三个小节，每小节一个普通段落/);
  assert.match(config, /约 100 词的局限小节/);
  assert.match(config, /defaultMode:\s*"target"/);
  assert.match(config, /defaultAppendix:\s*true/);
  assert.match(config, /defaultAppendix:\s*false/);
  assert.match(config, /wordLimitOff:\s*"无特殊规定"/);
  assert.match(config, /appendixOn:\s*"允许附录"/);
  assert.doesNotMatch(config, /workflowTitle|五步重构工作流/);
  assert.match(config, /resizePromptRail:\s*"拖动调整 Prompt 栏宽度"/);
  assert.match(config, /resetPromptRail:\s*"双击恢复为 40%"/);
  assert.match(config, /满足当前适用的总量与章节预算时不得使用/);
  assert.match(config, /defaultUnlimitedCoreSections:\s*false/);
  assert.match(config, /chatExecution:\s*\{/);
  assert.match(config, /chatLatestVisibleModel:\s*"最新可用推理模型"/);
  assert.match(config, /chatPollingInterval:\s*"结果检查间隔"/);
  assert.match(
    chatExecutionConfig,
    /CHAT_MODEL_POLICY\s*=\s*"latest-visible-reasoning"/,
  );
  assert.match(
    chatExecutionConfig,
    /CHAT_FALLBACK_POLICY[\s\S]*"closest-lower-then-strongest"/,
  );
  assert.match(
    chatExecutionConfig,
    /"strongest"[\s\S]*"medium"[\s\S]*"high"[\s\S]*"extra-high"[\s\S]*"pro"/,
  );
  assert.match(
    chatExecutionConfig,
    /medium:\s*60_000[\s\S]*high:\s*60_000[\s\S]*"extra-high":\s*180_000[\s\S]*pro:\s*300_000/,
  );
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
  assert.doesNotMatch(templates, /可选：其他附件/);
  assert.doesNotMatch(templates, /Optional: other attachments/);
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
  assert.match(
    originalPrompts,
    /Question、Observation、Interpretation 等叙述功能/,
  );
  assert.match(
    originalPrompts,
    /列名不得变成 TeX 中重复的小标题或句首标签/,
  );
  assert.doesNotMatch(
    originalPrompts,
    /<base_name>_round_2_framework\.png/,
  );
  assert.match(
    originalPrompts,
    /COMMON_BASE[\s\S]*?FIGURE_TYPE_ADAPTERS\["method-overview"\][\s\S]*?COMPILED_VISUAL_CONFIGURATION[\s\S]*?OUTPUT_PROTOCOL/,
  );
  assert.match(originalPrompts, /ultra-wide `2:1`/);
  assert.doesNotMatch(originalPrompts, /double-column|paper placement/);
  assert.match(originalPrompts, /`2–3`[\s\S]*?accent budget/);
  assert.doesNotMatch(originalPrompts, /RGB\(/);
  assert.match(originalPrompts, /Calibri prose labels/);
  assert.match(originalPrompts, /pure-white canvas/);
  assert.match(originalPrompts, /paper-specific scientific forms/);
  assert.match(originalPrompts, /no large[\s\S]*?in-figure title/);
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
  assert.match(component, /chatExecution/);
  assert.match(component, /reasoningPreference:\s*preferenceId/);
  assert.match(component, /chatPollingDescription/);
  assert.match(component, /chatRuntimePolicy/);
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
  assert.match(navigation, /className="top-nav-dropdown"/);
  assert.match(navigation, /className="top-nav-search-trigger"/);
  assert.match(navigation, /searchResults/);
  assert.match(navigation, /aria-live="polite"/);
  assert.match(navigationConfig, /id:\s*"writing"/);
  assert.match(navigationConfig, /id:\s*"reconstruction"/);
  assert.match(navigationConfig, /id:\s*"experiments"/);
  assert.match(navigationConfig, /id:\s*"figures"/);
  assert.match(navigationConfig, /id:\s*"submission"/);
  assert.match(navigationConfig, /href:\s*"\/draft"/);
  assert.match(navigationConfig, /href:\s*"\/reconstruction"/);
  assert.match(
    navigationConfig,
    /href:\s*"\/reconstruction\/refinement"/,
  );
  assert.match(navigationConfig, /href:\s*"\/reconstruction\/audit"/);
  assert.match(navigationConfig, /href:\s*"\/figures"/);
  assert.match(navigationConfig, /href:\s*"\/submission"/);
  assert.equal(
    (navigationConfig.match(/status:\s*"available",/g) ?? []).length,
    6,
  );
  assert.equal(
    (navigationConfig.match(/status:\s*"future",/g) ?? []).length,
    15,
  );
  assert.doesNotMatch(navigationConfig, /关于研术台|About YanShu/);
  assert.match(
    styles,
    /--prompt-rail-width:\s*40%[\s\S]*?@media \(min-width: 1101px\)[\s\S]*?grid-template-columns:[\s\S]*?var\(--prompt-rail-width\)[\s\S]*?\.prompt-rail[\s\S]*?position: sticky/,
  );
  assert.match(styles, /\.top-nav-dropdown-panel/);
  assert.match(styles, /\.top-nav-search-panel/);
  assert.match(
    styles,
    /@media \(max-width: 1280px\)[\s\S]*?\.top-nav-dropdown,[\s\S]*?position: static/,
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
  assert.match(
    promptReadme,
    /source\/.*five active rounds.*Round 4.*pointer/s,
  );
  assert.match(
    promptReadme,
    /four reconstruction cards and the separate submission-strategy/,
  );
  assert.match(promptReadme, /unlimitedCoreSections/);
  assert.match(promptReadme, /counted as 200 words/);
  assert.match(page, /<HomePage \/>/);
  assert.match(layout, /研术台 · YanShu/);
  assert.match(layout, /\/og-reconstruction-2026-07-7\.png/);
  assert.match(packageJson, /"name": "yanshu-workbench-site"/);
  assert.match(packageJson, /"build:pages":\s*"CLOUDFLARE_PAGES_STATIC=1 next build"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("app/_sites-preview/", templateRoot)),
  );
  await assert.rejects(
    access(new URL(".openai/hosting.json", templateRoot)),
  );
  await assert.rejects(
    access(new URL("build/sites-vite-plugin.ts", templateRoot)),
  );
});

test("keeps section-refinement rules and merge controls configuration-driven", async () => {
  const [config, component, navigation] = await Promise.all([
    readFile(
      new URL(
        "../app/reconstruction/refinement/config.ts",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/reconstruction/refinement/SectionRefinementWorkbench.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/navigation.ts", import.meta.url), "utf8"),
  ]);

  assert.match(config, /"experiments-results"/);
  assert.match(config, /"merged-experiments-results-discussion"/);
  assert.match(config, /label: \{ zh: "实验设置与结果", en: "Setup and Results" \}/);
  assert.match(config, /仅精修实验设置/);
  assert.match(config, /仅精修结果/);
  assert.match(config, /合并实验、结果与 Discussion/);
  assert.match(config, /局限单列为 Limitations subsection/);
  assert.match(config, /将局限放入 Discussion 最后一个 subsection/);
  assert.match(config, /不得复述 Results/);
  assert.match(config, /Discussion 具体结果数字上限/);
  assert.match(config, /每个标题为 3–7 个英文单词/);
  assert.match(config, /relatedCitationMin: 15/);
  assert.match(config, /relatedCitationMax: 25/);
  assert.match(config, /subsection 最后一句不超过 18 个英文单词/);
  assert.match(config, /function abstractContract/);
  assert.match(config, /abstractKeywordCountMin: 4/);
  assert.match(config, /abstractKeywordCountMax: 5/);
  assert.match(config, /abstractKeywordWordsMin: 1/);
  assert.match(config, /abstractKeywordWordsMax: 2/);
  assert.match(config, /Abstract 后单列 Keywords/);
  assert.match(config, /function introductionContract/);
  assert.match(config, /function relatedWorkContract/);
  assert.match(config, /function methodContract/);
  assert.match(config, /function experimentsContract/);
  assert.match(config, /function resultsContract/);
  assert.match(config, /function discussionContract/);
  assert.match(config, /function conclusionContract/);
  assert.match(config, /figures\/ 不是必需输入/);
  assert.match(config, /introductionMaxCitationsPerSentence: 4/);
  assert.match(config, /relatedMaxCitationsPerSentence: 4/);
  assert.match(config, /introductionContributionCount: 3/);
  assert.match(config, /introductionContributionWords: 22/);
  assert.match(config, /introductionContributionStartsWithWe: true/);
  assert.match(config, /凡陈述既有研究、领域事实、已有能力或他人结论/);
  assert.match(config, /本文自己的 claim、作者综合判断和贡献句可以不引用/);
  assert.match(config, /执行日前两年内、与当前论点直接相关的顶会或顶刊论文/);
  assert.match(config, /逐项核查当前章节每个引用的语义支持关系/);
  assert.match(config, /methodOverviewMode/);
  assert.match(config, /methodOverviewMaxWords: 80/);
  assert.match(config, /methodOverviewParagraphs: 2/);
  assert.match(config, /methodPseudocodeMaxLines: 12/);
  assert.match(config, /methodIncludeComplexityAnalysis/);
  assert.match(config, /每张图或表对应恰好两个主要正文段落/);
  assert.match(config, /图表本体负责完整数值/);
  assert.match(config, /允许调整图表顺序/);
  assert.match(config, /核心证据、不利结果和唯一消融证据不得删除/);
  assert.match(config, /不得移动 Main Results、核心比较或关键消融图表/);
  assert.match(config, /上限不是配额/);
  assert.match(config, /冒号只在确有必要/);
  assert.match(config, /“允许”不是使用要求/);
  assert.match(config, /mode: "preserve"[\s\S]*section: \[300, 500\]/);
  assert.match(config, /experimentalFocus: ExperimentalFocusId = "both"/);
  assert.match(config, /section: \[800, 1400\]/);
  assert.match(config, /allowColon:\s*true/);
  assert.match(config, /allowWe:\s*true/);
  assert.match(component, /showDiscussionOrganization/);
  assert.match(component, /showLimitationMode/);
  assert.match(component, /showVisualEvidence/);
  assert.match(component, /showCitationMode/);
  assert.match(component, /showWeToggle/);
  assert.match(component, /sectionMinWords/);
  assert.match(component, /paragraphMinWords/);
  assert.match(component, /sentenceMinWords/);
  assert.match(component, /visualParagraphsPerItem/);
  assert.match(component, /abstractKeywordCountMin/);
  assert.match(component, /abstractKeywordWordsMax/);
  assert.match(component, /keyNumbersPerParagraphMax/);
  assert.match(component, /selectExperimentalFocus/);
  assert.match(component, /allowVisualReorder/);
  assert.match(component, /methodIncludePseudocode/);
  assert.doesNotMatch(component, /PaperStyleId/);
  assert.match(
    component,
    /const \[expanded, setExpanded\] = useState\(true\)/,
  );
  assert.match(navigation, /href:\s*"\/reconstruction\/refinement"/);
  assert.match(navigation, /activePage:\s*"refinement"/);
});

test("keeps specialized audits selectable, coordinated, and evidence-bound", async () => {
  const [config, component, page, navigation] = await Promise.all([
    readFile(
      new URL("../app/reconstruction/audit/config.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/reconstruction/audit/SpecializedAuditWorkbench.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../app/reconstruction/audit/page.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/navigation.ts", import.meta.url), "utf8"),
  ]);

  assert.match(config, /"terminology"/);
  assert.match(config, /"bibliography"/);
  assert.match(config, /"data-consistency"/);
  assert.match(config, /"visual-integrity"/);
  assert.match(config, /"claim-evidence"/);
  assert.match(config, /"notation"/);
  assert.match(config, /"reproducibility"/);
  assert.match(config, /"cross-section-redundancy"/);
  assert.match(config, /executionMode: "report-only"/);
  assert.match(config, /同一根因只生成一个稳定问题 ID/);
  assert.match(config, /AUD-007 \[DATA\]\[VIS\]\[CLAIM\]/);
  assert.match(config, /Blocker \/ Major \/ Minor/);
  assert.match(config, /先建立 Fix Allowlist/);
  assert.match(config, /未被问题 ID 命中的句子、段落、标题、术语、引用、公式、图表、宏、空白和换行必须与输入逐字一致/);
  assert.match(config, /禁止顺便润色、改写、压缩、扩写、统一措辞、全局替换、重新排版、重新换行/);
  assert.match(config, /任何无法映射到 Fix Allowlist 问题 ID 的差异都必须回退/);
  assert.match(config, /every edit includes its issue ID, location, and before\/after/);
  assert.match(config, /numeric-claim ledger/);
  assert.match(config, /孤儿图表/);
  assert.match(config, /执行日前两年内直接相关的顶会、顶刊论文/);
  assert.match(config, /不把偏好差异、无证据猜测或纯风格意见包装成问题/);
  assert.match(config, /buildSpecializedAuditPrompt/);
  assert.match(component, /role="checkbox"/);
  assert.match(component, /selectAllAudits/);
  assert.match(component, /clearAudits/);
  assert.match(component, /<PromptResizeHandle language=\{uiLanguage\}/);
  assert.match(
    component,
    /const \[expanded, setExpanded\] = useState\(true\)/,
  );
  assert.match(page, /<SpecializedAuditWorkbench \/>/);
  assert.match(navigation, /href:\s*"\/reconstruction\/audit"/);
  assert.match(navigation, /activePage:\s*"audit"/);
});

test("keeps research-figure choices and prompt rules configuration-driven", async () => {
  const [
    figureConfig,
    figureArchitecture,
    extendedFigureAdapters,
    figureComponent,
    figurePage,
    navigation,
    navigationConfig,
  ] =
    await Promise.all([
      readFile(new URL("../app/figures/config.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/figures/promptArchitecture.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/figures/extendedFigureAdapters.ts",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../app/figures/FigureWorkbench.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/figures/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/navigation.ts", import.meta.url), "utf8"),
    ]);

  assert.match(figureConfig, /promptId:\s*"method-overview"/);
  for (const promptId of [
    "introduction",
    "task-definition",
    "method-overview",
    "technical-detail",
    "training-inference",
    "algorithm-protocol",
    "data-construction",
    "system-deployment",
    "theory-concept",
    "geometry-coordinate",
    "survey-taxonomy",
  ]) {
    assert.match(figureConfig, new RegExp(`"${promptId}"|${promptId}:`));
  }
  assert.match(figureConfig, /aspectRatioId:\s*"landscape-2-1"/);
  assert.doesNotMatch(
    figureConfig,
    /FigurePlacementId|placementId|FIGURE_PLACEMENTS|FIGURE_PLACEMENT_IDS/,
  );
  assert.doesNotMatch(
    figureConfig,
    /FigureStyleId|styleId|FIGURE_STYLES|FIGURE_STYLE_IDS|极简论文线稿|轻插图技术图/,
  );
  assert.doesNotMatch(
    figureConfig,
    /canvasPresetId|includeIntroductionFigure|includeMethodOverview|includeTechnicalDetailFigure/,
  );
  assert.doesNotMatch(figureConfig, /technicalFigureCount|TechnicalFigureCount/);
  assert.match(
    figureConfig,
    /introduction:\s*\{[\s\S]*?aspectRatioId:\s*"landscape-16-9"[\s\S]*?accentColorRangeId:\s*"2-3"[\s\S]*?allowLightIllustrations:\s*true[\s\S]*?cardFillPolicyId:\s*"semantic-regions"[\s\S]*?fontSizeLevels:\s*3/,
  );
  assert.match(
    figureConfig,
    /"method-overview":\s*\{[\s\S]*?aspectRatioId:\s*"landscape-2-1"[\s\S]*?accentColorRangeId:\s*"2-3"[\s\S]*?allowLightIllustrations:\s*true[\s\S]*?cardFillPolicyId:\s*"key-regions"[\s\S]*?fontSizeLevels:\s*3/,
  );
  assert.match(
    figureConfig,
    /"technical-detail":\s*\{[\s\S]*?aspectRatioId:\s*"landscape-4-3"[\s\S]*?accentColorRangeId:\s*"1-2"[\s\S]*?cardFillPolicyId:\s*"key-regions"[\s\S]*?fontSizeLevels:\s*3/,
  );
  assert.match(
    figureConfig,
    /"task-definition":\s*\{[\s\S]*?aspectRatioId:\s*"landscape-3-2"[\s\S]*?allowLightIllustrations:\s*true/,
  );
  assert.match(
    figureConfig,
    /"training-inference":\s*\{[\s\S]*?aspectRatioId:\s*"landscape-2-1"[\s\S]*?lineColorMode:\s*"semantic"/,
  );
  assert.match(
    figureConfig,
    /"geometry-coordinate":\s*\{[\s\S]*?aspectRatioId:\s*"landscape-3-2"[\s\S]*?allowLightIllustrations:\s*true/,
  );
  assert.match(figureConfig, /ratio:\s*"4:3"/);
  assert.match(figureConfig, /ratio:\s*"3:2"/);
  assert.match(figureConfig, /ratio:\s*"3:4"/);
  assert.match(figureConfig, /ratio:\s*"16:9"/);
  assert.match(figureConfig, /ratio:\s*"2:1"/);
  assert.match(figureConfig, /ratio:\s*"9:16"/);
  assert.match(figureConfig, /custom:\s*\{[\s\S]*?ratio:\s*null/);
  assert.match(
    figureConfig,
    /DEFAULT_FIGURE_PREFERENCES[\s\S]*?\.\.\.FIGURE_TYPE_RECOMMENDATIONS\["method-overview"\]/,
  );
  assert.match(figureConfig, /getFigureAspectRatio/);
  assert.match(figureConfig, /greatestCommonDivisor/);
  assert.match(figureConfig, /输入任意宽高比例/);
  assert.match(figureConfig, /lineColorMode:\s*"neutral"/);
  assert.match(figureConfig, /accentColorRangeId:\s*"1-2"/);
  assert.match(figureConfig, /accentColorRangeId:\s*"2-3"/);
  assert.match(figureConfig, /allowLightIllustrations:\s*false/);
  assert.match(figureConfig, /cardFillPolicyId:\s*"key-regions"/);
  assert.match(figureConfig, /cardFillPolicyId:\s*"semantic-regions"/);
  assert.match(figureConfig, /fontSizeLevels:\s*3/);
  assert.match(figureConfig, /includeLargeTitle:\s*false/);
  assert.match(figureConfig, /paletteId:\s*"tol-vibrant"/);
  assert.match(figureConfig, /fontFamilyId:\s*"calibri"/);
  assert.doesNotMatch(
    figureConfig,
    /"conference-minimal"|"illustrated-technical"|"structured-technical"|"light-academic"/,
  );
  assert.match(figureConfig, /FIGURE_PROMPT_ORDER/);
  assert.match(figureConfig, /FIGURE_PROMPT_GROUPS/);
  assert.match(figureConfig, /核心论文图/);
  assert.match(figureConfig, /过程与系统/);
  assert.match(figureConfig, /更多专业图型/);
  assert.match(figureConfig, /这张图主要需要回答什么？/);
  assert.match(figureConfig, /不负责实验数据图/);
  assert.match(figureConfig, /buildFigurePrompt/);
  assert.match(
    figureConfig,
    /COMMON_BASE\[language\][\s\S]*?FIGURE_TYPE_ADAPTERS\[promptId\]\[language\][\s\S]*?buildVisualConfiguration\(preferences\)[\s\S]*?OUTPUT_PROTOCOL\[language\]/,
  );
  assert.match(figureConfig, /User-Selected Visual Configuration/);
  assert.match(figureConfig, /Canvas background: pure white/);
  assert.doesNotMatch(
    figureConfig,
    /Target paper placement|Visual style preset/,
  );
  assert.match(figureConfig, /maximum semantic budget, not a target/);
  assert.match(figureConfig, /1\.00 : 1\.22 : 1\.50/);
  assert.match(figureConfig, /No decorative or pictorial icons/);
  assert.match(figureConfig, /Pure-white cards/);
  assert.match(figureConfig, /Remove or reflow secondary content/);
  assert.match(figureConfig, /FIGURE_COLOR_PALETTES/);
  assert.match(figureConfig, /"tol-vibrant"/);
  assert.match(figureConfig, /"tol-bright"/);
  assert.match(figureConfig, /"tol-muted"/);
  assert.doesNotMatch(figureConfig, /RGB\(/);
  assert.doesNotMatch(
    figureConfig,
    /"academic-blue"|"blue-orange"|"teal-purple"|"warm-earth"|"cool-monochrome"/,
  );
  assert.match(figureConfig, /FIGURE_FONT_FAMILIES/);
  assert.match(figureConfig, /Times New Roman/);
  assert.match(figureConfig, /Comic Sans MS/);
  assert.match(figureArchitecture, /export const COMMON_BASE/);
  assert.match(figureArchitecture, /export const FIGURE_TYPE_ADAPTERS/);
  assert.match(
    figureArchitecture,
    /\.\.\.EXTENDED_FIGURE_TYPE_ADAPTERS/,
  );
  assert.match(figureArchitecture, /export const OUTPUT_PROTOCOL/);
  assert.match(figureArchitecture, /逐字符一致/);
  assert.match(figureArchitecture, /主要视觉对象中/);
  assert.match(figureArchitecture, /conventional assumption → hidden failure/);
  assert.match(figureArchitecture, /evaluation protocol/);
  assert.match(figureArchitecture, /exploded operator anatomy/);
  assert.match(figureArchitecture, /2–4 个主要区域/);
  assert.match(figureArchitecture, /3–5 个主要区域/);
  assert.match(figureArchitecture, /1–3 个核心公式/);
  assert.match(figureArchitecture, /真实性能热图/);
  assert.match(
    extendedFigureAdapters,
    /Task and Problem Formulation Figure/,
  );
  assert.match(extendedFigureAdapters, /Training and Inference Figure/);
  assert.match(
    extendedFigureAdapters,
    /Algorithm, Decision, or Protocol Figure/,
  );
  assert.match(
    extendedFigureAdapters,
    /Data Construction and Annotation Figure/,
  );
  assert.match(
    extendedFigureAdapters,
    /System and Deployment Architecture Figure/,
  );
  assert.match(
    extendedFigureAdapters,
    /Theoretical and Conceptual Relation Figure/,
  );
  assert.match(
    extendedFigureAdapters,
    /Geometry and Coordinate-System Figure/,
  );
  assert.match(
    extendedFigureAdapters,
    /Survey Taxonomy and Research-Landscape Figure/,
  );
  assert.match(extendedFigureAdapters, /HYBRID OR VECTOR RECOMMENDED/);
  assert.match(extendedFigureAdapters, /VECTOR RECOMMENDED/);
  assert.match(figureArchitecture, /FINAL IMAGE PROMPT/);
  assert.match(figureArchitecture, /VISUAL THESIS/);
  assert.match(figureArchitecture, /COMPOSITION/);
  assert.match(figureArchitecture, /SCIENTIFIC VISUAL OBJECTS/);
  assert.match(figureArchitecture, /FLOW AND RELATIONSHIPS/);
  assert.match(figureArchitecture, /STYLE SPECIFICATION/);
  assert.match(figureArchitecture, /EXACT TEXT AND MATH/);
  assert.match(figureArchitecture, /NEGATIVE CONSTRAINTS/);
  assert.match(figureArchitecture, /输入“开始绘图”生成这张图/);
  assert.match(figureArchitecture, /Then stop/);
  assert.doesNotMatch(figureArchitecture, /RGB\(/);
  assert.doesNotMatch(
    figureArchitecture,
    /材料足够时直接生成最终图片|## 直接生成|## Generate directly/,
  );
  assert.match(figureComponent, /buildFigurePrompt\(\s*activePromptId/);
  assert.match(figureComponent, /setPromptLanguages/);
  assert.match(figureComponent, /selectFigurePrompt/);
  assert.match(figureComponent, /figure-intent-question/);
  assert.match(figureComponent, /FIGURE_PROMPT_GROUP_ORDER/);
  assert.match(figureComponent, /figure-professional-types/);
  assert.match(figureComponent, /preferencesByPrompt/);
  assert.match(figureComponent, /createRecommendedPreferences/);
  assert.match(figureComponent, /setActivePromptId\(promptId\)/);
  assert.match(figureComponent, /FIGURE_TYPE_RECOMMENDATIONS\[activePromptId\]/);
  assert.doesNotMatch(figureComponent, /\.\.\.FIGURE_DEFAULT_LAYOUT\[promptId\]/);
  assert.doesNotMatch(
    figureComponent,
    /selectFigureStyle|FIGURE_STYLE_DEFAULTS|FIGURE_STYLE_IDS/,
  );
  assert.match(figureComponent, /role="radiogroup"/);
  assert.match(figureComponent, /role="radio"/);
  assert.doesNotMatch(figureComponent, /FIGURE_PLACEMENT_IDS|placementId/);
  assert.match(figureComponent, /FIGURE_ASPECT_RATIO_IDS\.map/);
  assert.match(figureComponent, /getFigureAspectRatio\(preferences\)/);
  assert.match(figureComponent, /copy\.customRatioWidth/);
  assert.match(figureComponent, /copy\.customRatioHeight/);
  assert.doesNotMatch(
    figureComponent,
    /figure-prompt-summary|prompt-number|promptEyebrow|promptTitle|promptBody/,
  );
  assert.match(
    figureComponent,
    /DEFAULT_PROMPT_EXPANSION[\s\S]*?FIGURE_PROMPT_ORDER\.map\(\(promptId\) => \[promptId, true\]\)/,
  );
  assert.match(
    figureComponent,
    /FIGURE_ACCENT_COLOR_RANGE_IDS\.map/,
  );
  assert.match(figureComponent, /FIGURE_CARD_FILL_POLICY_IDS\.map/);
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
  assert.match(navigation, /NAVIGATION_GROUPS/);
  assert.match(navigationConfig, /href:\s*"\/figures"/);
});

test("keeps paper-draft templates and provenance rules configuration-driven", async () => {
  const [
    draftConfig,
    draftComponent,
    draftPage,
    navigation,
    navigationConfig,
    homePage,
  ] =
    await Promise.all([
      readFile(new URL("../app/draft/config.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/draft/DraftWorkbench.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/draft/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteNavigation.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/navigation.ts", import.meta.url), "utf8"),
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
  assert.match(navigation, /NAVIGATION_GROUPS/);
  assert.match(navigationConfig, /href:\s*"\/draft"/);
  assert.match(homePage, /href="\/draft"/);
  assert.match(homePage, /href="\/reconstruction"/);
});
