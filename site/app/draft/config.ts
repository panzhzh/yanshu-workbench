import type { Language } from "../config";
import { withPromptJudgmentDirective } from "../../content/prompts/promptAgency";

export type DraftTemplateId =
  | "arxiv"
  | "neurips"
  | "icml"
  | "iclr"
  | "cvpr"
  | "iccv"
  | "eccv"
  | "acl"
  | "emnlp"
  | "aaai"
  | "kdd"
  | "acm-mm"
  | "custom";

interface DraftTemplate {
  label: string;
  group: "preprint" | "conference" | "custom";
  searchHint?: string;
}

export const ARXIV_STYLE_REPOSITORY =
  "https://github.com/kourgeorge/arxiv-style";

export const DRAFT_TEMPLATES = {
  arxiv: {
    label: "arXiv",
    group: "preprint",
  },
  neurips: {
    label: "NeurIPS",
    group: "conference",
    searchHint: "NeurIPS official author instructions and style files",
  },
  icml: {
    label: "ICML",
    group: "conference",
    searchHint: "ICML official author instructions and LaTeX template",
  },
  iclr: {
    label: "ICLR",
    group: "conference",
    searchHint: "ICLR official author guide and LaTeX style",
  },
  cvpr: {
    label: "CVPR",
    group: "conference",
    searchHint: "CVPR official author guidelines and author kit",
  },
  iccv: {
    label: "ICCV",
    group: "conference",
    searchHint: "ICCV official author guidelines and author kit",
  },
  eccv: {
    label: "ECCV",
    group: "conference",
    searchHint: "ECCV official author guidelines and template",
  },
  acl: {
    label: "ACL",
    group: "conference",
    searchHint: "ACL official style files and author guidelines",
  },
  emnlp: {
    label: "EMNLP",
    group: "conference",
    searchHint: "EMNLP official style files and author guidelines",
  },
  aaai: {
    label: "AAAI",
    group: "conference",
    searchHint: "AAAI official author kit and LaTeX template",
  },
  kdd: {
    label: "KDD",
    group: "conference",
    searchHint: "ACM KDD official call for papers and ACM template",
  },
  "acm-mm": {
    label: "ACM Multimedia",
    group: "conference",
    searchHint: "ACM Multimedia official call for papers and ACM template",
  },
  custom: {
    label: "自定义顶会 / Custom venue",
    group: "custom",
  },
} as const satisfies Record<DraftTemplateId, DraftTemplate>;

export const DRAFT_TEMPLATE_IDS = Object.keys(
  DRAFT_TEMPLATES,
) as DraftTemplateId[];

export const DEFAULT_DRAFT_TEMPLATE_ID: DraftTemplateId = "arxiv";

export const DRAFT_COPY = {
  zh: {
    eyebrow: "PAPER DRAFT",
    title: "论文初稿",
    subtitle:
      "实验完成后，把证据材料交给模型，直接生成结构完整、可编译、可继续修改的英文 LaTeX 初稿。",
    preset: "证据驱动 · 不补造结果 · 模板可追溯",
    reset: "恢复默认配置",
    resetHint: "恢复 arXiv 默认模板并清除自定义 venue。",
    inputTitle: "准备材料",
    inputItems: [
      "实验结果、表格与原始分析",
      "方法设计、实现与代码说明",
      "图、caption 与必要补充材料",
      "真实 BibTeX、笔记或现有草稿",
    ],
    inputHint:
      "复制 Prompt 后在同一模型对话中上传材料；本站不读取或保存论文文件。",
    templateTitle: "目标模板",
    templateHint:
      "arXiv 默认使用指定开源样式；顶会必须在执行时从当届官网核验并取得最新官方 TeX 模板。",
    preprintGroup: "预印本",
    conferenceGroup: "常用 CS 顶会",
    customGroup: "其他",
    customVenue: "会议名称",
    customVenuePlaceholder: "例如：SIGIR",
    templateSource: "默认 arXiv 样式来源",
    templateBoundary:
      "该 arXiv 样式是 MIT 开源的预印本样式，不是 arXiv 官方投稿格式要求。",
    switchPromptLanguage: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "收起",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    eyebrow: "PAPER DRAFT",
    title: "Paper draft",
    subtitle:
      "After experiments are complete, turn the evidence into a coherent, compilable English LaTeX manuscript that remains easy to revise.",
    preset: "Evidence-led · no fabricated results · traceable template",
    reset: "Restore defaults",
    resetHint: "Restore the default arXiv template and clear the custom venue.",
    inputTitle: "Prepare materials",
    inputItems: [
      "Experiment results, tables, and raw analyses",
      "Method design, implementation, and code notes",
      "Figures, captions, and necessary supplements",
      "Verified BibTeX, notes, or an existing draft",
    ],
    inputHint:
      "After copying the prompt, upload the materials in the same model conversation. This site never reads or stores paper files.",
    templateTitle: "Target template",
    templateHint:
      "arXiv uses the specified open-source style by default. For a conference, retrieve and verify the latest official TeX template for the current edition.",
    preprintGroup: "Preprint",
    conferenceGroup: "Common CS conferences",
    customGroup: "Other",
    customVenue: "Venue name",
    customVenuePlaceholder: "For example: SIGIR",
    templateSource: "Default arXiv style source",
    templateBoundary:
      "This MIT-licensed arXiv style is a preprint style, not an official arXiv submission requirement.",
    switchPromptLanguage: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

function selectedVenue(
  templateId: DraftTemplateId,
  customVenue: string,
) {
  if (templateId !== "custom") return DRAFT_TEMPLATES[templateId].label;
  return customVenue.trim() || "the custom top-tier CS conference named by the user";
}

function buildDraftPromptContent(
  templateId: DraftTemplateId,
  customVenue: string,
  language: Language,
) {
  const venue = selectedVenue(templateId, customVenue);
  const template = DRAFT_TEMPLATES[templateId];
  const isArxiv = templateId === "arxiv";
  const searchHint =
    template.group === "conference" ? template.searchHint : undefined;

  if (language === "zh") {
    const templateDirective = isArxiv
      ? `目标为 arXiv 预印本。使用 ${ARXIV_STYLE_REPOSITORY} 当前仓库中的 \`template.tex\` 与 \`arxiv.sty\` 作为默认排版基础；记录仓库 URL 与取得日期，不把该第三方 MIT 开源样式描述成 arXiv 官方要求，也不要修改样式文件来挤压篇幅。`
      : `目标为 ${venue}。开始写作前必须联网搜索 ${searchHint ?? `${venue} 官方作者指南与 LaTeX 模板`}，只从会议官网、官方 author kit 或会议组织方维护的仓库取得当前届或最近一个明确开放届次的最新官方 TeX 模板。记录 venue、届次/年份、模板版本、核验日期和官方 URL；不得沿用旧届模板或非官方镜像。若当前官方模板确实无法取得，透明说明后临时使用 ${ARXIV_STYLE_REPOSITORY} 作为“预印本回退”，并明确产物尚不符合 ${venue} 投稿格式。`;

    return `# 基于实验材料生成完整 CS 论文初稿

## 你的角色
你是严谨的 CS 论文作者、证据审计员和 LaTeX 工程师。若当前环境可用，鼓励使用 \`$research-paper-writing\` 辅助组织论证、学术行文和质量自检；本 Prompt 的证据边界、目标模板、用户配置与交付协议始终优先。若该 Skill 不可用，直接按本 Prompt 完成。你的任务是把已完成实验及其真实材料转化为一份完整英文初稿，而不是补造一篇“看起来完整”的论文。

## 本轮输入
请完整读取我在同一对话中上传的全部材料，包括但不限于：
- 实验结果、表格、统计输出、日志与原始分析；
- 方法设计、公式、算法、实现说明、代码或 README；
- 数据集、baseline、服务器、超参数与评估协议；
- 已有图片、caption、补充材料、研究笔记或局部草稿；
- 真实且可核验的 BibTeX 或参考文献清单。

材料之间冲突时，以可追溯的原始实验证据和代码定义为准，并在交付说明中记录冲突。不得静默选择对叙事更有利的版本。

## 目标模板
${templateDirective}

模板规则可能变化。不得硬编码往年页数、匿名规则或提交要求；必须以本次核验到的官方最新页面为准。模板类文件、版权块、页边距、字号和匿名设置不得为容纳内容而私自修改。

## 写作任务
1. 在内部建立 Evidence Ledger，将每项核心 claim 对齐到方法定义、表格、图片、统计结果或真实引用。不要把这份内部清单当作正文输出。
2. 从证据中确定一个清楚、可辩护的科学定位，并给出确定的英文标题和 4–7 个字母的论文品牌缩写。标题、摘要、引言、方法、实验、讨论和结论必须围绕同一主线。
3. 直接撰写完整英文论文初稿。章节按目标模板和论文实际内容组织；方法章节要解释设计为何成立并形成连贯叙事，不要写成组件说明书。Experiments and Results 的第一个小节为 Datasets and Experimental Setup，并按目标模板允许的下一层标题依次组织 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines；Evaluation Metrics 独立说明指标定义、方向、单位或尺度、聚合方式及其与任务目标的对应关系。实验必须完整呈现已有设置与证据，不得删减不利结果，也不得把 Discussion 写成 Results 的复述。
4. Abstract 只陈述正文能支持的内容；Introduction 说明今天仍存在的具体问题、核心洞察和可验证贡献；Related Work 用真实引用建立差异化定位；Discussion 分析机制、边界和局限。
5. 只使用上传或经过可靠来源逐项核验的文献。不得虚构作者、标题、venue、年份、DOI、BibTeX key 或引用关系；缺失但必要的引用用清楚的 \`TODO[citation: ...]\` 标记。
6. 不得发明实验数字、数据集、baseline、消融、显著性、复杂度、硬件、超参数、用户研究或结论。证据缺口使用精确 TODO，说明缺什么以及它影响哪项 claim，不得用含糊占位句掩盖。
7. 图表与正文交叉引用、术语、缩写、变量、数字、单位和大小写必须一致。所有表格数字应能回溯到输入证据。

## 交付与编译
生成一个可下载的完整 LaTeX 工程，至少包含：
- \`main.tex\`（篇幅较长时可拆分清楚命名的 section 文件）；
- \`references.bib\`；
- 目标模板所需且来源明确的类文件/样式文件；
- \`figures/\` 中的已有图或待补图清单，不得伪造图片；
- \`TEMPLATE_SOURCE.md\`，记录模板名称、届次/年份、来源 URL、取得日期、是否为官方模板及任何回退；
- 成功编译的 PDF 和包含全部源文件的压缩包。

实际运行 LaTeX 编译，修复缺包、引用、交叉引用、浮动体、BibTeX/Biber 和编码错误；不得通过删除科学内容“修复”构建。最终直接给出可下载文件，并用简短中文说明：完成内容、仍存在的 TODO、证据冲突、模板来源和编译状态。

## 输出前自检
- 每个核心 claim 均有输入证据或明确 TODO，没有补造结果与引用。
- 标题、摘要、贡献、方法、实验和结论叙事一致。
- 实验设置、对比、数字、图表和限制忠实于原始材料。
- 使用的是本次核验的目标模板，未私改样式规则。
- 工程可从干净环境编译，PDF、引用和交叉引用无错误。

现在完整读取材料并直接生成最终初稿工程；不要先给提纲、写作计划或等待我逐节确认。`;
  }

  const templateDirective = isArxiv
    ? `The target is an arXiv preprint. Use the current \`template.tex\` and \`arxiv.sty\` from ${ARXIV_STYLE_REPOSITORY} as the default typesetting base. Record the repository URL and retrieval date, do not describe this third-party MIT-licensed style as an official arXiv requirement, and do not alter the style file to squeeze content.`
    : `The target is ${venue}. Before writing, browse for ${searchHint ?? `${venue} official author instructions and LaTeX template`}. Obtain the latest official TeX template for the current or nearest explicitly open edition only from the conference website, official author kit, or organizer-maintained repository. Record the venue, edition/year, template version, verification date, and official URL. Never reuse an older edition or unofficial mirror when a current official source exists. If the official template genuinely cannot be obtained, disclose that limitation and temporarily use ${ARXIV_STYLE_REPOSITORY} as a “preprint fallback,” explicitly stating that the output is not yet ${venue}-compliant.`;

  return `# Generate a Complete CS Paper Draft from Experimental Evidence

## Your role
Act as a rigorous CS paper author, evidence auditor, and LaTeX engineer. When available, use \`$research-paper-writing\` to support argument organization, academic prose, and quality review; the evidence boundaries, target template, user configuration, and delivery protocol in this prompt always take precedence. If that skill is unavailable, continue directly from this prompt. Convert completed experiments and authentic research materials into a complete English draft—never manufacture a paper that merely looks complete.

## Inputs
Read every file uploaded in this conversation, including as applicable:
- experimental results, tables, statistical outputs, logs, and raw analyses;
- method designs, equations, algorithms, implementation notes, code, or README files;
- datasets, baselines, servers, hyperparameters, and evaluation protocols;
- existing figures, captions, supplementary materials, notes, or partial drafts;
- authentic, verifiable BibTeX or a reference list.

When sources conflict, prefer traceable raw experimental evidence and code-defined behavior, and record the conflict in the handoff. Never silently choose the version that creates a stronger story.

## Target template
${templateDirective}

Template rules change over time. Do not hardcode a previous year's page limit, anonymity policy, or submission rule. Follow the latest official page verified in this run. Never alter class/style files, copyright blocks, margins, type sizes, or anonymity settings to force content to fit.

## Drafting tasks
1. Internally build an Evidence Ledger that maps every core claim to a method definition, table, figure, statistic, or authentic citation. Do not emit this internal ledger as manuscript prose.
2. Derive one clear and defensible scientific position from the evidence, then commit to an English paper title and a 4–7-letter paper brand acronym. Keep the title, abstract, introduction, method, experiments, discussion, and conclusion on one throughline.
3. Write the complete English manuscript directly. Organize sections according to the target template and the paper's actual needs. Explain why the method's design works through an integrated narrative rather than a component manual. Make Datasets and Experimental Setup the first Experiments and Results subsection, then use the next heading level permitted by the target template for Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in that order. Evaluation Metrics independently defines every metric, its direction, unit or scale, aggregation, and relation to the task objective. Preserve all existing experimental evidence, including unfavorable results, and do not make Discussion a repetition of Results.
4. Keep the Abstract evidence-bounded; make the Introduction state the specific problem that still exists today, the core insight, and verifiable contributions; use authentic citations in Related Work to establish differentiated positioning; analyze mechanisms, boundaries, and limitations in Discussion.
5. Use only references supplied by the user or individually verified against reliable sources. Never invent authors, titles, venues, years, DOIs, BibTeX keys, or citation relationships. Mark a necessary missing source as \`TODO[citation: ...]\`.
6. Never invent experimental numbers, datasets, baselines, ablations, significance tests, complexity, hardware, hyperparameters, user studies, or conclusions. Use precise TODOs that state what evidence is missing and which claim it affects.
7. Keep terminology, acronyms, variables, numbers, units, capitalization, and all figure/table cross-references consistent. Every table value must trace back to input evidence.

## Deliverables and compilation
Create a downloadable, complete LaTeX project containing at least:
- \`main.tex\` (split into clearly named section files only when scale warrants it);
- \`references.bib\`;
- provenance-backed class/style files required by the target template;
- a \`figures/\` directory containing supplied figures or a missing-figure manifest—never fabricated images;
- \`TEMPLATE_SOURCE.md\` recording template name, edition/year, source URL, retrieval date, official status, and any fallback;
- a successfully compiled PDF and an archive containing all source files.

Run the LaTeX build and fix package, bibliography, cross-reference, float, BibTeX/Biber, and encoding errors. Never “fix” a build by deleting scientific content. Return the downloadable files directly, followed by a concise Chinese handoff covering completed work, remaining TODOs, evidence conflicts, template provenance, and compilation status.

## Final audit
- Every core claim has input evidence or a precise TODO; no result or citation was fabricated.
- Title, abstract, contributions, method, experiments, and conclusion tell one consistent story.
- Setup, comparisons, numbers, figures, tables, and limitations faithfully represent the source materials.
- The template was verified in this run and its style rules were not privately modified.
- The project compiles cleanly, with working bibliography and cross-references.

Read all materials now and generate the final draft project directly. Do not first provide an outline or writing plan, and do not wait for section-by-section approval.`;
}

export function buildDraftPrompt(
  templateId: DraftTemplateId,
  customVenue: string,
  language: Language,
) {
  return withPromptJudgmentDirective(
    buildDraftPromptContent(templateId, customVenue, language),
    language,
  );
}
