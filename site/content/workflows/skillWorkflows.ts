import type { Language } from "../../app/config";
import type {
  WorkbenchControl,
  WorkbenchDefinition,
  WorkbenchValue,
  WorkbenchValues,
} from "../../app/workbench/types";
import {
  DEFAULT_IDEA_PREFERENCES_BY_MODE,
  IDEA_COUNT_OPTIONS,
  IDEA_DIRECTION_IDS,
  IDEA_DIRECTIONS,
  NOVELTY_POSTURE_IDS,
  NOVELTY_POSTURES,
  buildIdeaPrompt,
  getDefaultIdeaPreferences,
  type IdeaCount,
  type IdeaDirectionId,
  type IdeaPreferences,
  type NoveltyPostureId,
} from "../../app/ideas/config";
import {
  DEFAULT_DRAFT_TEMPLATE_ID,
  DRAFT_TEMPLATE_IDS,
  DRAFT_TEMPLATES,
  buildDraftPrompt,
  type DraftTemplateId,
} from "../../app/draft/config";
import {
  CAPTION_LENGTH_POLICY,
  normalizeCaptionWordRange,
} from "../prompts/captionLength";
import {
  DEFAULT_FIGURE_PREFERENCES,
  FIGURE_ASPECT_RATIO_IDS,
  FIGURE_ASPECT_RATIOS,
  FIGURE_CARD_FILL_POLICIES,
  FIGURE_CARD_FILL_POLICY_IDS,
  FIGURE_COLOR_PALETTES,
  FIGURE_COLOR_PALETTE_IDS,
  FIGURE_FONT_FAMILIES,
  FIGURE_FONT_FAMILY_IDS,
  FIGURE_PROMPT_ORDER,
  FIGURE_PROMPTS,
  buildFigurePrompt,
  getFigureAccentColorRange,
  getFigureAspectRatio,
  type FigureAspectRatioId,
  type FigureCardFillPolicyId,
  type FigureFontFamilyId,
  type FigureFontSizeLevels,
  type FigureLineColorMode,
  type FigurePaletteId,
  type FigurePreferences,
  type FigurePromptId,
} from "../../app/figures/config";
import {
  EXPERIMENTAL_PLOTS_WORKBENCH,
  buildExperimentalPlotPrompt,
  getDefaultExperimentalPlotValues,
  normalizeExperimentalPlotValues,
} from "../../app/figures/toolsConfig";
import { CITATION_AUDIT_WORKBENCH } from "../../app/writing/citations/config";
import {
  PEER_REVIEW_WORKBENCH,
  REVISION_AUDIT_WORKBENCH,
  REVISION_PLANNING_WORKBENCH,
} from "../../app/submission/workflowConfig";

export type LocalizedWorkflowText = Record<Language, string>;

export type YanShuSkillId =
  | "idea-discovery"
  | "paper-drafting"
  | "citation-audit"
  | "paper-reconstruction"
  | "scientific-figure"
  | "experimental-plotting"
  | "peer-review"
  | "revision-planning"
  | "revision-audit";

export type ConfigurableSkillWorkflowId = Exclude<
  YanShuSkillId,
  "paper-reconstruction"
>;

export type SkillWorkflowFieldValue =
  | string
  | number
  | boolean
  | readonly string[]
  | readonly [number, number];

export interface SkillWorkflowChoice {
  value: SkillWorkflowFieldValue;
  label: LocalizedWorkflowText;
  description?: LocalizedWorkflowText;
}

export interface SkillWorkflowVisibility {
  fieldId: string;
  equals?: SkillWorkflowFieldValue;
  notEquals?: SkillWorkflowFieldValue;
  includes?: SkillWorkflowFieldValue;
}

export interface SkillWorkflowField {
  id: string;
  sectionId: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "range"
    | "multi"
    | "boolean"
    | "choice"
    | "select";
  label: LocalizedWorkflowText;
  description?: LocalizedWorkflowText;
  placeholder?: LocalizedWorkflowText;
  choices?: readonly SkillWorkflowChoice[];
  min?: number;
  max?: number;
  step?: number;
  minSelected?: number;
  visibleWhen?: SkillWorkflowVisibility;
}

export interface SkillWorkflowSection {
  id: string;
  index: string;
  title: LocalizedWorkflowText;
  description: LocalizedWorkflowText;
}

export interface SkillWorkflowModel {
  id: ConfigurableSkillWorkflowId;
  version: string;
  skillId: ConfigurableSkillWorkflowId;
  websitePath: string;
  title: LocalizedWorkflowText;
  eyebrow: string;
  description: LocalizedWorkflowText;
  materialTitle: LocalizedWorkflowText;
  materialItems: Record<Language, readonly string[]>;
  materialHint: LocalizedWorkflowText;
  output: LocalizedWorkflowText;
  sections: readonly SkillWorkflowSection[];
  fields: readonly SkillWorkflowField[];
  defaults: Record<string, SkillWorkflowFieldValue>;
}

export interface YanShuSkillCatalogItem {
  id: YanShuSkillId;
  index: string;
  skillName: string;
  websitePath: string;
  title: LocalizedWorkflowText;
  description: LocalizedWorkflowText;
  command: LocalizedWorkflowText;
  input: LocalizedWorkflowText;
  output: LocalizedWorkflowText;
}

export const SKILL_WORKFLOW_VERSION = "2026.09.05";

export const YANSHU_SKILL_CATALOG: readonly YanShuSkillCatalogItem[] = [
  {
    id: "idea-discovery",
    index: "01",
    skillName: "Idea Discovery",
    websitePath: "/ideas/discovery",
    title: { zh: "查找研究 Idea", en: "Discover a research idea" },
    description: {
      zh: "配置方向、近年文献、数据和资源边界，自动检索、去重并给出最小验证实验。",
      en: "Configure the field, recent literature, data, and resource limits, then search, deduplicate, and define a minimum decisive test.",
    },
    command: {
      zh: "使用 $idea-discovery 在当前工作区查找研究 Idea。",
      en: "Use $idea-discovery to find research ideas in the current workspace.",
    },
    input: {
      zh: "方向或问题线索；也可从空白开始",
      en: "A field or problem seed, or start from scratch",
    },
    output: {
      zh: "中英文 Idea Markdown",
      en: "Chinese and English idea Markdown",
    },
  },
  {
    id: "paper-drafting",
    index: "02",
    skillName: "Paper Drafting",
    websitePath: "/draft",
    title: { zh: "撰写论文初稿", en: "Draft a complete paper" },
    description: {
      zh: "读取已完成的实验、代码、图表和引用，生成可编译、可继续修改的 LaTeX 初稿。",
      en: "Read completed experiments, code, figures, and references, then produce a compilable LaTeX draft that remains editable.",
    },
    command: {
      zh: "使用 $paper-drafting 根据这个实验目录撰写论文初稿。",
      en: "Use $paper-drafting to draft a paper from this experiment directory.",
    },
    input: {
      zh: "实验目录、结果、代码、图表与 BibTeX",
      en: "Experiment directory, results, code, figures, and BibTeX",
    },
    output: {
      zh: "完整 LaTeX 工程与编译 PDF",
      en: "Complete LaTeX project and compiled PDF",
    },
  },
  {
    id: "citation-audit",
    index: "03",
    skillName: "Citation Audit",
    websitePath: "/writing/citations",
    title: { zh: "核查与补充引文", en: "Review and strengthen citations" },
    description: {
      zh: "核对正文引用与原论文是否匹配，补足真实缺口，并同步校验 BibTeX 与近期文献覆盖。",
      en: "Verify claim–source alignment, fill genuine gaps, and validate BibTeX and recent-literature coverage.",
    },
    command: {
      zh: "使用 $citation-audit 核查并补充这个论文目录中的引文。",
      en: "Use $citation-audit to review and strengthen citations in this manuscript directory.",
    },
    input: {
      zh: "主稿 TeX、完整 BibTeX 与建议提供的 PDF",
      en: "Main TeX, complete BibTeX, and recommended PDF",
    },
    output: {
      zh: "聊天内审计；安全修复时交付完整修订 TeX/BibTeX",
      en: "In-chat audit, with complete revised TeX/BibTeX for safe repair",
    },
  },
  {
    id: "paper-reconstruction",
    index: "04",
    skillName: "Paper Reconstruction",
    websitePath: "/reconstruction",
    title: { zh: "重构现有论文", en: "Reconstruct an existing paper" },
    description: {
      zh: "用一个完整 Prompt 连续完成科学定位、结构、方法实验、前后叙事和原稿质量回归。",
      en: "Use one complete prompt for positioning, structure, method and experiments, narrative, and source-aware quality regression.",
    },
    command: {
      zh: "使用 $paper-reconstruction 重构这个论文目录。",
      en: "Use $paper-reconstruction to reconstruct this paper directory.",
    },
    input: {
      zh: "TeX、BibTeX、PDF 与可选 figures",
      en: "TeX, BibTeX, PDF, and optional figures",
    },
    output: {
      zh: "重构后 TeX、BibTeX 与中文说明",
      en: "Restructured TeX, BibTeX, and Chinese report",
    },
  },
  {
    id: "scientific-figure",
    index: "05",
    skillName: "Scientific Figure",
    websitePath: "/figures",
    title: { zh: "绘制科研配图", en: "Create a scientific figure" },
    description: {
      zh: "从论文证据中选择一种图型，配置画布、配色和文字规则，只生成一张高清科研配图。",
      en: "Choose one figure role from the paper evidence, configure canvas, palette, and typography, and generate one high-resolution scientific figure.",
    },
    command: {
      zh: "使用 $scientific-figure 为这个论文目录绘制一张科研配图。",
      en: "Use $scientific-figure to create one research figure for this paper directory.",
    },
    input: {
      zh: "论文 TeX、可选 PDF，以及按配置提供的参考图",
      en: "Paper TeX, optional PDF, and a reference image only when configured",
    },
    output: {
      zh: "一张高清 PNG",
      en: "One high-resolution PNG",
    },
  },
  {
    id: "experimental-plotting",
    index: "06",
    skillName: "Experimental Plotting",
    websitePath: "/figures/plots",
    title: { zh: "绘制实验图", en: "Create an experimental plot" },
    description: {
      zh: "从真实实验数据生成统计语义清楚、可复现且符合论文版面的代码绘图。",
      en: "Generate reproducible, statistically explicit publication plots from authentic experimental data.",
    },
    command: {
      zh: "使用 $experimental-plotting 根据这个实验目录绘制论文实验图。",
      en: "Use $experimental-plotting to create a paper plot from this experiment directory.",
    },
    input: {
      zh: "原始结果、指标定义、统计协议与论文上下文",
      en: "Raw results, metric definitions, statistical protocol, and manuscript context",
    },
    output: {
      zh: "可复现代码、出版级图件与派生数据",
      en: "Reproducible code, publication assets, and derived data",
    },
  },
  {
    id: "peer-review",
    index: "07",
    skillName: "Peer Review",
    websitePath: "/submission/review",
    title: { zh: "独立审稿", en: "Review a manuscript" },
    description: {
      zh: "从贡献、方法、证据、结论边界和可复现性等维度生成独立、可追溯的审稿报告。",
      en: "Produce an independent, traceable review across contribution, method, evidence, claim calibration, and reproducibility.",
    },
    command: {
      zh: "使用 $peer-review 审稿这个论文目录。",
      en: "Use $peer-review to review the manuscript in this directory.",
    },
    input: {
      zh: "论文、可选补充材料、代码与数据",
      en: "Manuscript with optional supplement, code, and data",
    },
    output: {
      zh: "聊天内结构化同行评审；可选保存 Markdown",
      en: "Structured peer review in chat, optionally saved as Markdown",
    },
  },
  {
    id: "revision-planning",
    index: "08",
    skillName: "Revision Planning",
    websitePath: "/submission/revision",
    title: { zh: "规划论文返修", en: "Plan a manuscript revision" },
    description: {
      zh: "合并多位审稿人的重复意见，完成 P0/P1/P2 与 A/B/C/D 分类，并规划最小实验与修改顺序。",
      en: "Merge repeated reviewer concerns, assign P0/P1/P2 and A/B/C/D classes, and plan minimum experiments and revision order.",
    },
    command: {
      zh: "使用 $revision-planning 整理这些审稿意见并制定返修计划。",
      en: "Use $revision-planning to organize these reviews and build a revision plan.",
    },
    input: {
      zh: "审稿意见、编辑决定、论文与真实新增证据",
      en: "Reviews, editor decision, manuscript, and authentic new evidence",
    },
    output: {
      zh: "聊天内返修优先级与实验决策；可选保存 Markdown",
      en: "Revision priorities and experiment decisions in chat, optionally saved as Markdown",
    },
  },
  {
    id: "revision-audit",
    index: "09",
    skillName: "Revision Audit",
    websitePath: "/submission/revision-audit",
    title: { zh: "审查论文返修稿", en: "Audit a manuscript revision" },
    description: {
      zh: "逐条核验审稿回复与实际修改是否闭环，并区分期刊返修和会议 rebuttal 的证据要求。",
      en: "Verify every response against the actual revision while adapting evidence requirements for journal revisions and conference rebuttals.",
    },
    command: {
      zh: "使用 $revision-audit 审查这份返修稿和回复信。",
      en: "Use $revision-audit to audit this revised manuscript and response.",
    },
    input: {
      zh: "审稿意见、回复信、修改稿、原稿与 diff",
      en: "Reviews, response, revised manuscript, original manuscript, and diff",
    },
    output: {
      zh: "聊天内逐条返修核验与重新提交风险；可选保存 Markdown",
      en: "Comment-level revision verification and resubmission risk in chat, optionally saved as Markdown",
    },
  },
] as const;

export const CONFIGURATION_UI_COPY = {
  zh: {
    brand: "研术台 · YanShu",
    local: "本地配置",
    project: "当前工作区",
    reset: "恢复默认",
    promptLanguage: "Prompt 语言",
    promptTitle: "执行 Prompt",
    promptHint: "右侧 Prompt 与官网使用同一份配置源。",
    copy: "复制 Prompt",
    copied: "已复制",
    exit: "退出",
    start: "全自动开始",
    starting: "正在确认…",
    ready:
      "确认后 YanShu 将返回 Codex 并直接执行；不会再次逐项询问配置。",
    loading: "正在载入工作流…",
    loadFailed: "工作流载入失败。",
    submitFailed: "配置未能提交，请检查当前设置。",
    cancelled: "已退出；没有创建运行目录或发送材料。",
    confirmed: "配置已确认，可以关闭此页面。",
  },
  en: {
    brand: "YanShu Workbench",
    local: "Local configuration",
    project: "Current workspace",
    reset: "Reset",
    promptLanguage: "Prompt language",
    promptTitle: "Execution prompt",
    promptHint: "This prompt uses the same configuration source as the website.",
    copy: "Copy prompt",
    copied: "Copied",
    exit: "Exit",
    start: "Start full automation",
    starting: "Confirming…",
    ready:
      "After confirmation, YanShu returns to Codex and runs directly without asking each setting again.",
    loading: "Loading workflow…",
    loadFailed: "The workflow could not be loaded.",
    submitFailed: "The configuration could not be submitted. Review the current settings.",
    cancelled: "Exited without creating a run or sending materials.",
    confirmed: "Configuration confirmed. You may close this page.",
  },
} as const;

function localized(
  zh: string,
  en: string,
): LocalizedWorkflowText {
  return { zh, en };
}

function choice(
  value: SkillWorkflowFieldValue,
  label: LocalizedWorkflowText,
  description?: LocalizedWorkflowText,
): SkillWorkflowChoice {
  return { value, label, description };
}

const ideaDefaults = getDefaultIdeaPreferences("discovery");

const IDEA_DISCOVERY_MODEL: SkillWorkflowModel = {
  id: "idea-discovery",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "idea-discovery",
  websitePath: "/ideas/discovery",
  title: localized("Idea 查找", "Idea Discovery"),
  eyebrow: "YANSHU · IDEA DISCOVERY",
  description: localized(
    "从近期可信文献、真实数据条件和资源边界中发现可验证的研究机会。",
    "Find verifiable research opportunities from recent trustworthy literature, real data conditions, and resource limits.",
  ),
  materialTitle: localized("可选材料", "Optional materials"),
  materialItems: {
    zh: ["问题线索", "相关论文", "数据集说明"],
    en: ["Problem seed", "Related papers", "Dataset notes"],
  },
  materialHint: localized(
    "没有现成材料也可以开始；执行时会联网检索并报告搜索覆盖范围。",
    "You may start without attachments; execution searches the web and reports its coverage.",
  ),
  output: localized(
    "生成语义一致的中文与英文 Markdown，不生成 TeX。",
    "Create semantically aligned Chinese and English Markdown files, not TeX.",
  ),
  sections: [
    {
      id: "scope",
      index: "01",
      title: localized("研究范围", "Research scope"),
      description: localized(
        "给出方向或问题线索；留空时从所选方向开始。",
        "Provide a field or problem seed, or start from the selected field.",
      ),
    },
    {
      id: "evidence",
      index: "02",
      title: localized("文献与数据", "Literature and data"),
      description: localized(
        "限定时间窗、主要 venue 与可用数据。",
        "Set the time window, major venues, and available data.",
      ),
    },
    {
      id: "decision",
      index: "03",
      title: localized("生成与判断", "Generation and judgment"),
      description: localized(
        "控制候选数量、探索幅度和现实资源边界。",
        "Control candidate count, exploration posture, and practical resource limits.",
      ),
    },
  ],
  fields: [
    {
      id: "directionId",
      sectionId: "scope",
      type: "select",
      label: localized("方向", "Direction"),
      choices: IDEA_DIRECTION_IDS.map((id) =>
        choice(id, IDEA_DIRECTIONS[id].label),
      ),
    },
    {
      id: "focus",
      sectionId: "scope",
      type: "text",
      label: localized("具体方向或问题", "Specific focus or problem"),
      placeholder: localized(
        "例如：检索增强生成中的长期知识更新",
        "e.g. continual knowledge updates in retrieval-augmented generation",
      ),
    },
    {
      id: "seed",
      sectionId: "scope",
      type: "textarea",
      label: localized("问题线索", "Problem seed"),
      placeholder: localized(
        "可以留空，让模型从方向与近期文献开始检索。",
        "Leave blank to start from the field and recent literature.",
      ),
    },
    {
      id: "recentYears",
      sectionId: "evidence",
      type: "number",
      label: localized("重点检索近 N 年", "Prioritize the recent N years"),
      min: 1,
      max: 20,
      step: 1,
    },
    {
      id: "topConferences",
      sectionId: "evidence",
      type: "boolean",
      label: localized("优先顶会", "Prioritize top conferences"),
      description: localized(
        "默认开启，并要求说明当前子领域的 venue 选择依据。",
        "Enabled by default; explain the venue choices for the subfield.",
      ),
    },
    {
      id: "topJournals",
      sectionId: "evidence",
      type: "boolean",
      label: localized("同时检索顶刊", "Also search top journals"),
    },
    {
      id: "customVenues",
      sectionId: "evidence",
      type: "text",
      label: localized("指定 venue（可选）", "Named venues (optional)"),
      placeholder: localized("例如：ACL, EMNLP, TACL", "e.g. ACL, EMNLP, TACL"),
    },
    {
      id: "dataset",
      sectionId: "evidence",
      type: "text",
      label: localized("数据集或数据条件（可选）", "Dataset or data condition (optional)"),
      placeholder: localized(
        "公开数据集、私有数据条件，或让模型根据证据推荐",
        "A public dataset, a private-data condition, or ask for evidence-based recommendations",
      ),
    },
    {
      id: "ideaCount",
      sectionId: "decision",
      type: "choice",
      label: localized("候选 Idea 数量", "Candidate idea count"),
      choices: IDEA_COUNT_OPTIONS.map((count) =>
        choice(count, localized(`${count} 个`, `${count}`)),
      ),
    },
    {
      id: "noveltyPosture",
      sectionId: "decision",
      type: "choice",
      label: localized("探索幅度", "Exploration posture"),
      choices: NOVELTY_POSTURE_IDS.map((id) =>
        choice(id, NOVELTY_POSTURES[id].label),
      ),
    },
    {
      id: "pursueSota",
      sectionId: "decision",
      type: "boolean",
      label: localized("把 SOTA 作为必要目标", "Require a SOTA target"),
      description: localized(
        "关闭时仍要求清楚贡献，但不把排行榜提升当作唯一价值。",
        "When off, require a clear contribution without treating leaderboard gains as the only value.",
      ),
    },
    {
      id: "resourceConstraints",
      sectionId: "decision",
      type: "textarea",
      label: localized("资源与执行边界（可选）", "Resources and execution limits (optional)"),
      placeholder: localized(
        "例如：单张 24GB GPU、8 周、不能采集新数据",
        "e.g. one 24GB GPU, eight weeks, no new data collection",
      ),
    },
    {
      id: "additionalCriteria",
      sectionId: "decision",
      type: "textarea",
      label: localized("补充约束（可选）", "Additional constraints (optional)"),
    },
  ],
  defaults: { ...ideaDefaults },
};

const PAPER_DRAFTING_MODEL: SkillWorkflowModel = {
  id: "paper-drafting",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "paper-drafting",
  websitePath: "/draft",
  title: localized("论文初稿", "Paper Drafting"),
  eyebrow: "YANSHU · PAPER DRAFTING",
  description: localized(
    "把已完成的实验、方法、图表和真实引用转化为完整、可编译的英文 LaTeX 初稿。",
    "Turn completed experiments, methods, figures, and authentic references into a complete, compilable English LaTeX draft.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["实验结果与代码", "方法说明与图表", "真实 BibTeX 或文献清单"],
    en: ["Experimental results and code", "Method notes and figures", "Authentic BibTeX or reference list"],
  },
  materialHint: localized(
    "YanShu 只从确认的工作区选择材料；证据不足处保留精确 TODO，不补造结果。",
    "YanShu selects materials only from the confirmed workspace and leaves precise TODOs instead of inventing missing evidence.",
  ),
  output: localized(
    "完整 LaTeX 工程、模板来源记录、编译 PDF 与压缩包。",
    "A complete LaTeX project, template provenance, compiled PDF, and archive.",
  ),
  sections: [
    {
      id: "template",
      index: "01",
      title: localized("目标模板", "Target template"),
      description: localized(
        "arXiv 使用指定开源样式；会议模板在执行时从当届官网核验。",
        "Use the specified open-source arXiv style or verify the current official conference template during execution.",
      ),
    },
  ],
  fields: [
    {
      id: "templateId",
      sectionId: "template",
      type: "select",
      label: localized("模板", "Template"),
      choices: DRAFT_TEMPLATE_IDS.map((id) =>
        choice(id, localized(DRAFT_TEMPLATES[id].label, DRAFT_TEMPLATES[id].label)),
      ),
    },
    {
      id: "customVenue",
      sectionId: "template",
      type: "text",
      label: localized("会议名称", "Venue name"),
      placeholder: localized("例如：SIGIR", "e.g. SIGIR"),
      visibleWhen: { fieldId: "templateId", equals: "custom" },
    },
    {
      id: "captionWordRange",
      sectionId: "writing",
      type: "range",
      label: localized("Caption 建议长度", "Suggested caption length"),
      description: localized(
        "默认 10–40 words；为保证自包含性，必要时允许超出。",
        "Defaults to 10–40 words and may be exceeded when self-containment requires it.",
      ),
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
    },
  ],
  defaults: {
    templateId: DEFAULT_DRAFT_TEMPLATE_ID,
    customVenue: "",
    captionWordRange: CAPTION_LENGTH_POLICY.defaultRange,
  },
};

const figureDefaults = { ...DEFAULT_FIGURE_PREFERENCES };

const SCIENTIFIC_FIGURE_MODEL: SkillWorkflowModel = {
  id: "scientific-figure",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "scientific-figure",
  websitePath: "/figures",
  title: localized("科研配图", "Scientific Figure"),
  eyebrow: "YANSHU · SCIENTIFIC FIGURE",
  description: localized(
    "先理解论文与同类论文图片，再按照当前图型和视觉配置生成一张高清科研配图。",
    "Understand the paper and comparable published figures, then generate one high-resolution scientific figure from the selected role and visual settings.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["论文主 TeX", "可选编译 PDF", "开启“提供参考图”后才需要图片"],
    en: ["Main paper TeX", "Optional compiled PDF", "An image only when “Reference supplied” is enabled"],
  },
  materialHint: localized(
    "参考图默认关闭。开启后，普通图片只用于视觉样式；明确标注为“绘图草稿”时才可把结构作为线索，并须用论文核验。",
    "Reference images are off by default. When enabled, ordinary images supply visual style only; structure becomes a cue only for an explicitly labeled figure draft verified against the paper.",
  ),
  output: localized(
    "默认只交付一张高清 PNG；仅在明确要求持久留档时保存配置与生图 Prompt。",
    "Deliver one high-resolution PNG by default; save configuration and the image prompt only when persistent provenance is explicitly requested.",
  ),
  sections: [
    {
      id: "purpose",
      index: "01",
      title: localized("图的职责", "Figure role"),
      description: localized(
        "一次只完成一种图型，默认方法总览图。",
        "Complete one figure role at a time; Method Overview is the default.",
      ),
    },
    {
      id: "canvas",
      index: "02",
      title: localized("画布与执行", "Canvas and execution"),
      description: localized(
        "选择比例以及直接绘图或先查看英文生图 Prompt。",
        "Choose the canvas ratio and whether to draw directly or review the English image prompt first.",
      ),
    },
    {
      id: "visual",
      index: "03",
      title: localized("视觉约束", "Visual controls"),
      description: localized(
        "控制科研配色、字体、线条、强调色范围与容器底色。",
        "Control the research palette, typeface, lines, accent range, and container fills.",
      ),
    },
  ],
  fields: [
    {
      id: "promptId",
      sectionId: "purpose",
      type: "select",
      label: localized("图型", "Figure type"),
      choices: FIGURE_PROMPT_ORDER.map((id) =>
        choice(id, FIGURE_PROMPTS[id].label, FIGURE_PROMPTS[id].purpose),
      ),
    },
    {
      id: "executionMode",
      sectionId: "canvas",
      type: "choice",
      label: localized("执行方式", "Execution"),
      choices: [
        choice(
          "direct",
          localized("直接绘图", "Draw directly"),
          localized(
            "充分推敲论文内容、构图与视觉细节后直接生成图片。",
            "Generate the image directly after carefully considering the paper, composition, and visual details.",
          ),
        ),
        choice(
          "prompt-first",
          localized("先看英文 Prompt", "Review prompt first"),
          localized(
            "先展示英文生图 Prompt，等待“开始绘图”。",
            "Show the English image prompt and wait for “Start drawing”.",
          ),
        ),
      ],
    },
    {
      id: "hasReferenceImage",
      sectionId: "canvas",
      type: "boolean",
      label: localized("是否提供参考图", "Reference image"),
      description: localized(
        "默认关闭；开启后才把参考图规则写入 Prompt 并纳入材料。",
        "Off by default; enable it to add reference-image guidance to the prompt and materials.",
      ),
    },
    {
      id: "aspectRatioId",
      sectionId: "canvas",
      type: "select",
      label: localized("画布比例", "Canvas ratio"),
      choices: FIGURE_ASPECT_RATIO_IDS.map((id) =>
        choice(
          id,
          FIGURE_ASPECT_RATIOS[id].label,
          FIGURE_ASPECT_RATIOS[id].shortDescription,
        ),
      ),
    },
    {
      id: "customAspectWidth",
      sectionId: "canvas",
      type: "number",
      label: localized("自定义宽", "Custom width"),
      min: 1,
      max: 100,
      step: 1,
      visibleWhen: { fieldId: "aspectRatioId", equals: "custom" },
    },
    {
      id: "customAspectHeight",
      sectionId: "canvas",
      type: "number",
      label: localized("自定义高", "Custom height"),
      min: 1,
      max: 100,
      step: 1,
      visibleWhen: { fieldId: "aspectRatioId", equals: "custom" },
    },
    {
      id: "paletteId",
      sectionId: "visual",
      type: "select",
      label: localized("色系", "Color palette"),
      choices: FIGURE_COLOR_PALETTE_IDS.map((id) =>
        choice(id, FIGURE_COLOR_PALETTES[id].label),
      ),
    },
    {
      id: "fontFamilyId",
      sectionId: "visual",
      type: "select",
      label: localized("全图字体", "Global typeface"),
      choices: FIGURE_FONT_FAMILY_IDS.map((id) =>
        choice(
          id,
          localized(
            FIGURE_FONT_FAMILIES[id].label,
            FIGURE_FONT_FAMILIES[id].label,
          ),
        ),
      ),
    },
    {
      id: "lineColorMode",
      sectionId: "visual",
      type: "choice",
      label: localized("线条颜色", "Line colors"),
      choices: [
        choice("neutral", localized("统一深色", "One dark color")),
        choice("semantic", localized("按语义区分", "Semantic colors")),
      ],
    },
    {
      id: "accentColorMin",
      sectionId: "visual",
      type: "number",
      label: localized("强调色最少", "Minimum accents"),
      min: 1,
      max: 4,
      step: 1,
    },
    {
      id: "accentColorMax",
      sectionId: "visual",
      type: "number",
      label: localized("强调色最多", "Maximum accents"),
      min: 1,
      max: 4,
      step: 1,
    },
    {
      id: "allowLightIllustrations",
      sectionId: "visual",
      type: "boolean",
      label: localized("允许论文对象图形", "Allow paper-specific forms"),
      description: localized(
        "允许与论文对象直接对应的简化科学图形，不使用营销插画。",
        "Allow simplified scientific forms tied directly to the paper, not marketing illustration.",
      ),
    },
    {
      id: "cardFillPolicyId",
      sectionId: "visual",
      type: "select",
      label: localized("容器卡片底色", "Container fills"),
      choices: FIGURE_CARD_FILL_POLICY_IDS.map((id) =>
        choice(
          id,
          FIGURE_CARD_FILL_POLICIES[id].label,
          FIGURE_CARD_FILL_POLICIES[id].shortDescription,
        ),
      ),
    },
    {
      id: "fontSizeLevels",
      sectionId: "visual",
      type: "choice",
      label: localized("字号层级", "Type-size levels"),
      choices: [
        choice(2, localized("2 级", "2 levels")),
        choice(3, localized("3 级", "3 levels")),
      ],
    },
    {
      id: "includeLargeTitle",
      sectionId: "visual",
      type: "boolean",
      label: localized("图内大标题", "Large in-figure title"),
    },
  ],
  defaults: { ...figureDefaults },
};

const EXPERIMENTAL_PLOT_SECTIONS = [
  {
    id: "question",
    index: "01",
    title: localized("数据与问题", "Data and question"),
    description: localized(
      "从真实数据状态和科学问题出发选择图型。",
      "Choose the visual form from the scientific question and actual data state.",
    ),
  },
  {
    id: "statistics",
    index: "02",
    title: localized("统计语义", "Statistical semantics"),
    description: localized(
      "明确重复单位、不确定性、效应量和检验。",
      "Define replicate units, uncertainty, effect sizes, and tests.",
    ),
  },
  {
    id: "visual",
    index: "03",
    title: localized("图型与版面", "Chart and layout"),
    description: localized(
      "控制组合图、子图数量、栏宽与精确配色。",
      "Control composites, subpanel count, publication width, and exact colors.",
    ),
  },
  {
    id: "delivery",
    index: "04",
    title: localized("交付", "Delivery"),
    description: localized(
      "选择代码、图片与派生数据产物。",
      "Select code, image, and derived-data artifacts.",
    ),
  },
] as const;

const EXPERIMENTAL_PLOT_FIELD_SECTIONS: Record<string, string> = {
  plotGoal: "question",
  dataState: "question",
  encourageAdvancedCharts: "question",
  uncertainty: "statistics",
  statistics: "statistics",
  multiplicity: "statistics",
  allowComposite: "visual",
  panelCount: "visual",
  panels: "visual",
  width: "visual",
  palette: "visual",
  outputs: "delivery",
  custom: "delivery",
};

function configurableWorkbenchField(
  control: WorkbenchControl,
  sectionId: string,
): SkillWorkflowField {
  const base = {
    id: control.id,
    sectionId,
    label: control.label,
    description: control.description,
  };
  if (control.kind === "toggle") {
    return { ...base, type: "boolean" };
  }
  if (control.kind === "number") {
    return {
      ...base,
      type: "number",
      min: control.min,
      max: control.max,
      step: control.step,
    };
  }
  if (control.kind === "range") {
    return {
      ...base,
      type: "range",
      min: control.min,
      max: control.max,
      step: control.step,
    };
  }
  if (control.kind === "multi") {
    return {
      ...base,
      type: "multi",
      minSelected: control.minSelected,
      choices: control.options.map((option) =>
        choice(option.value, option.label, option.description),
      ),
    };
  }
  if (control.kind === "select" || control.kind === "segmented") {
    return {
      ...base,
      type: control.kind === "segmented" ? "choice" : "select",
      choices: control.options.map((option) =>
        choice(option.value, option.label, option.description),
      ),
    };
  }
  if (control.kind === "text" || control.kind === "textarea") {
    return {
      ...base,
      type: control.kind,
      placeholder: control.placeholder,
    };
  }
  throw new Error(`Unsupported configurable workflow field: ${control.id}`);
}

function experimentalPlotWorkflowField(
  control: WorkbenchControl,
): SkillWorkflowField {
  return configurableWorkbenchField(
    control,
    EXPERIMENTAL_PLOT_FIELD_SECTIONS[control.id] ?? "delivery",
  );
}

const EXPERIMENTAL_PLOTTING_MODEL: SkillWorkflowModel = {
  id: "experimental-plotting",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "experimental-plotting",
  websitePath: "/figures/plots",
  title: localized("实验绘图", "Experimental Plotting"),
  eyebrow: "YANSHU · EXPERIMENTAL PLOTTING",
  description: localized(
    "把真实实验数据转化为统计透明、代码可复现的出版级论文图。",
    "Turn authentic experimental data into statistically transparent, code-reproducible publication plots.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["CSV / Excel / JSON 或统计结果", "指标定义与实验协议", "论文上下文或目标模板"],
    en: ["CSV, Excel, JSON, or statistical outputs", "Metric definitions and experimental protocol", "Manuscript context or target template"],
  },
  materialHint: localized(
    "优先提供逐次实验数据；只有汇总值时同时提供样本量与误差定义。",
    "Prefer run-level data. When only summaries exist, include sample sizes and error definitions.",
  ),
  output: localized(
    "可复现绘图代码、所选出版级图件、caption 与必要派生数据。",
    "Reproducible plotting code, selected publication assets, a caption, and required derived data.",
  ),
  sections: EXPERIMENTAL_PLOT_SECTIONS,
  fields: EXPERIMENTAL_PLOTS_WORKBENCH.controls.map(
    experimentalPlotWorkflowField,
  ),
  defaults: {
    ...getDefaultExperimentalPlotValues(),
  },
};

const CITATION_AUDIT_SECTIONS = [
  {
    id: "scope",
    index: "01",
    title: localized("范围与动作", "Scope and action"),
    description: localized(
      "选择重点章节，以及仅核查或核查并安全修复。",
      "Choose priority sections and report-only or safe-repair behavior.",
    ),
  },
  {
    id: "target",
    index: "02",
    title: localized("目标与覆盖", "Target and coverage"),
    description: localized(
      "设置目标 venue、建议引文总量和近期文献比例。",
      "Set the target venue, suggested bibliography size, and recent-work share.",
    ),
  },
  {
    id: "sources",
    index: "03",
    title: localized("来源策略", "Source policy"),
    description: localized(
      "控制预印本、顶会顶刊、联网核验和单句引用密度。",
      "Control preprints, leading venues, web verification, and sentence-level citation density.",
    ),
  },
  {
    id: "delivery",
    index: "04",
    title: localized("补充要求", "Additional requirements"),
    description: localized(
      "记录必须保留的来源、主题或排除范围。",
      "Record sources, topics, or exclusions that must be preserved.",
    ),
  },
] as const;

const CITATION_AUDIT_FIELD_SECTIONS: Record<string, string> = {
  action: "scope",
  sections: "scope",
  targetType: "target",
  targetVenue: "target",
  targetVenueMinimum: "target",
  referenceRange: "target",
  recentYears: "target",
  recentShare: "target",
  allowPreprints: "sources",
  preferTopConferences: "sources",
  preferTopJournals: "sources",
  browse: "sources",
  citationsPerSentence: "sources",
  custom: "delivery",
};

function citationAuditWorkflowField(
  control: WorkbenchControl,
): SkillWorkflowField {
  const field = configurableWorkbenchField(
    control,
    CITATION_AUDIT_FIELD_SECTIONS[control.id] ?? "delivery",
  );
  if (control.id === "targetVenue") {
    field.visibleWhen = { fieldId: "targetType", notEquals: "none" };
  }
  if (control.id === "targetVenueMinimum") {
    field.visibleWhen = { fieldId: "targetType", equals: "journal" };
  }
  return field;
}

const CITATION_AUDIT_MODEL: SkillWorkflowModel = {
  id: "citation-audit",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "citation-audit",
  websitePath: "/writing/citations",
  title: localized("引文核查与补充", "Citation Review & Support"),
  eyebrow: "YANSHU · CITATION REVIEW",
  description: localized(
    "核对引用是否支撑陈述，补足真实缺口，并校验 BibTeX 与文献覆盖。",
    "Verify claim–source support, fill genuine gaps, and validate BibTeX and literature coverage.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["主稿 .tex", "完整 .bib", "最新编译 PDF（建议）", "目标 venue（可选）"],
    en: ["Main .tex", "Complete .bib", "Latest compiled PDF (recommended)", "Target venue (optional)"],
  },
  materialHint: localized(
    "默认重点检查 Introduction 与 Related Work；建议数量用于判断覆盖度，不用于凑引用。",
    "Introduction and Related Work are the default focus; suggested counts assess coverage and never justify padding.",
  ),
  output: localized(
    "仅核查时在当前聊天返回结果；安全修复时交付完整修订 TeX，并仅在 BibTeX 变化时交付完整 .bib。",
    "Return audit results in chat; safe repair delivers complete revised TeX and a complete .bib only when it changes.",
  ),
  sections: CITATION_AUDIT_SECTIONS,
  fields: CITATION_AUDIT_WORKBENCH.controls.map(citationAuditWorkflowField),
  defaults: workbenchDefaults(CITATION_AUDIT_WORKBENCH),
};

function workbenchDefaults(definition: WorkbenchDefinition) {
  return Object.fromEntries(
    definition.controls.map((control) => [
      control.id,
      control.defaultValue as SkillWorkflowFieldValue,
    ]),
  );
}

const PEER_REVIEW_SECTIONS = [
  {
    id: "approach",
    index: "01",
    title: localized("评审任务", "Review task"),
    description: localized(
      "选择完整评审、风险筛查或压力测试，以及实际可用材料。",
      "Choose full review, risk screening, or stress testing and define available materials.",
    ),
  },
  {
    id: "dimensions",
    index: "02",
    title: localized("证据与维度", "Evidence and dimensions"),
    description: localized(
      "控制需要检查的科学维度和是否联网核查文献。",
      "Set the scientific dimensions and whether literature should be verified online.",
    ),
  },
  {
    id: "delivery",
    index: "03",
    title: localized("判断与交付", "Judgment and delivery"),
    description: localized(
      "选择通用评分卡并补充本次特别关注的问题。",
      "Choose the venue-neutral scorecard and add concerns specific to this review.",
    ),
  },
] as const;

const PEER_REVIEW_FIELD_SECTIONS: Record<string, string> = {
  useTarget: "approach",
  targetType: "approach",
  targetVenue: "approach",
  mode: "approach",
  materialScope: "approach",
  dimensions: "dimensions",
  ignoreNonScientificPresentation: "dimensions",
  browseLiterature: "dimensions",
  scorecard: "delivery",
  custom: "delivery",
};

function peerReviewWorkflowField(
  control: WorkbenchControl,
): SkillWorkflowField {
  const field = configurableWorkbenchField(
    control,
    PEER_REVIEW_FIELD_SECTIONS[control.id] ?? "delivery",
  );
  if (control.id === "targetType" || control.id === "targetVenue") {
    field.visibleWhen = { fieldId: "useTarget", equals: true };
  }
  return field;
}

const PEER_REVIEW_MODEL: SkillWorkflowModel = {
  id: "peer-review",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "peer-review",
  websitePath: "/submission/review",
  title: localized("审稿", "Peer Review"),
  eyebrow: "YANSHU · PEER REVIEW",
  description: localized(
    "从实际论文证据生成独立、分级且可执行的同行评审报告。",
    "Generate an independent, severity-aware, actionable review from actual manuscript evidence.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["论文主稿", "补充材料（建议）", "按配置提供代码与数据"],
    en: ["Main manuscript", "Supplement (recommended)", "Code and data when configured"],
  },
  materialHint: localized(
    "不区分会议或期刊；只评价实际提供且可读取的材料，不修改论文。",
    "No conference/journal split: review only supplied readable material and never edit the manuscript.",
  ),
  output: localized(
    "默认在当前聊天返回主要问题、次要问题、澄清问题与总体风险；明确要求时才保存 `peer_review.md`。",
    "Return major concerns, minor concerns, clarification questions, and overall risk in the current chat by default; save `peer_review.md` only when requested.",
  ),
  sections: PEER_REVIEW_SECTIONS,
  fields: PEER_REVIEW_WORKBENCH.controls.map(peerReviewWorkflowField),
  defaults: workbenchDefaults(PEER_REVIEW_WORKBENCH),
};

const REVISION_PLANNING_SECTIONS = [
  {
    id: "evidence",
    index: "01",
    title: localized("证据与资源", "Evidence and resources"),
    description: localized(
      "限定规划中可考虑的新增证据与真实执行窗口。",
      "Bound the new evidence and real execution window considered by the plan.",
    ),
  },
  {
    id: "context",
    index: "02",
    title: localized("本轮背景", "Revision context"),
    description: localized(
      "提供编辑决定、截止时间与作者现实边界。",
      "Provide the editor decision, deadline, and real author constraints.",
    ),
  },
  {
    id: "delivery",
    index: "03",
    title: localized("计划交付", "Plan delivery"),
    description: localized(
      "控制是否进一步输出任务依赖、并行批次和阻塞点。",
      "Choose whether to include dependencies, parallel batches, and blockers.",
    ),
  },
] as const;

const REVISION_PLANNING_FIELD_SECTIONS: Record<string, string> = {
  evidencePolicy: "evidence",
  resourceWindow: "evidence",
  decisionContext: "context",
  custom: "context",
  executionPlan: "delivery",
};

function revisionPlanningWorkflowField(
  control: WorkbenchControl,
): SkillWorkflowField {
  const field = configurableWorkbenchField(
    control,
    REVISION_PLANNING_FIELD_SECTIONS[control.id] ?? "delivery",
  );
  if (control.id === "resourceWindow") {
    field.visibleWhen = { fieldId: "evidencePolicy", notEquals: "existing" };
  }
  return field;
}

const REVISION_PLANNING_MODEL: SkillWorkflowModel = {
  id: "revision-planning",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "revision-planning",
  websitePath: "/submission/revision",
  title: localized("返修规划", "Revision Planning"),
  eyebrow: "YANSHU · REVISION PLANNING",
  description: localized(
    "把多位审稿人的意见拆分、合并、分级并转化为证据诚实的修改计划。",
    "Split, merge, prioritize, and classify multiple reviews into an evidence-honest revision plan.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["全部审稿意见", "编辑决定", "被审稿件与补充材料", "真实新增证据（如有）"],
    en: ["All reviews", "Editor decision", "Reviewed manuscript and supplement", "Authentic new evidence, if any"],
  },
  materialHint: localized(
    "保留 reviewer 编号和原评论；本阶段不写回复信，也不修改论文。",
    "Preserve reviewer IDs and source comments. This stage drafts neither a response letter nor a revised manuscript.",
  ),
  output: localized(
    "默认在当前聊天返回 P0/P1/P2、A/B/C/D、最小实验与推荐顺序；明确要求时才保存 `revision_plan.md`。",
    "Return P0/P1/P2 priorities, A/B/C/D classes, minimum experiments, and revision order in the current chat by default; save `revision_plan.md` only when requested.",
  ),
  sections: REVISION_PLANNING_SECTIONS,
  fields: REVISION_PLANNING_WORKBENCH.controls.map(
    revisionPlanningWorkflowField,
  ),
  defaults: workbenchDefaults(REVISION_PLANNING_WORKBENCH),
};

const REVISION_AUDIT_SECTIONS = [
  {
    id: "context",
    index: "01",
    title: localized("返修语境", "Revision context"),
    description: localized(
      "可选指定期刊、会议与本轮允许的修改范围。",
      "Optionally identify the journal, conference, and permitted revision scope.",
    ),
  },
  {
    id: "focus",
    index: "02",
    title: localized("审查重点", "Audit focus"),
    description: localized(
      "补充需要重点取证的 reviewer、实验或 claim。",
      "Add a reviewer, experiment, or claim that needs particular verification.",
    ),
  },
] as const;

const REVISION_AUDIT_FIELD_SECTIONS: Record<string, string> = {
  scenario: "context",
  venue: "context",
  decisionContext: "context",
  custom: "focus",
};

const REVISION_AUDIT_MODEL: SkillWorkflowModel = {
  id: "revision-audit",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "revision-audit",
  websitePath: "/submission/revision-audit",
  title: localized("返修稿审查", "Revision Audit"),
  eyebrow: "YANSHU · REVISION AUDIT",
  description: localized(
    "逐条核验回复信或 rebuttal 中的主张是否由实际修改与证据支持。",
    "Verify comment by comment whether response-letter or rebuttal claims are supported by actual changes and evidence.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["Reviewer comments 与编辑决定", "Response Letter 或 rebuttal", "Revised manuscript", "Original manuscript 与 diff manuscript（强烈建议）"],
    en: ["Reviewer comments and editor decision", "Response letter or rebuttal", "Revised manuscript", "Original manuscript and diff manuscript (strongly recommended)"],
  },
  materialHint: localized(
    "期刊或会议可留空并自动判断；缺失材料会被标为无法核验。",
    "Journal or conference may be omitted and inferred; missing evidence is marked not verifiable.",
  ),
  output: localized(
    "默认在当前聊天返回逐条判断、修改证据、遗留风险和最小修正；明确要求时才保存 `revision_audit.md`。",
    "Return comment-level judgments, change evidence, residual risk, and minimum corrections in the current chat by default; save `revision_audit.md` only when requested.",
  ),
  sections: REVISION_AUDIT_SECTIONS,
  fields: REVISION_AUDIT_WORKBENCH.controls.map((control) =>
    configurableWorkbenchField(
      control,
      REVISION_AUDIT_FIELD_SECTIONS[control.id] ?? "focus",
    ),
  ),
  defaults: workbenchDefaults(REVISION_AUDIT_WORKBENCH),
};

const CONFIGURABLE_MODELS: Record<
  ConfigurableSkillWorkflowId,
  SkillWorkflowModel
> = {
  "idea-discovery": IDEA_DISCOVERY_MODEL,
  "paper-drafting": PAPER_DRAFTING_MODEL,
  "citation-audit": CITATION_AUDIT_MODEL,
  "scientific-figure": SCIENTIFIC_FIGURE_MODEL,
  "experimental-plotting": EXPERIMENTAL_PLOTTING_MODEL,
  "peer-review": PEER_REVIEW_MODEL,
  "revision-planning": REVISION_PLANNING_MODEL,
  "revision-audit": REVISION_AUDIT_MODEL,
};

export const CONFIGURABLE_SKILL_WORKFLOW_IDS = Object.keys(
  CONFIGURABLE_MODELS,
) as ConfigurableSkillWorkflowId[];

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function allowedValue<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizeWorkbenchPreferences(
  definition: WorkbenchDefinition,
  input: Record<string, unknown>,
): WorkbenchValues {
  const normalized: WorkbenchValues = {};

  for (const control of definition.controls) {
    const raw = input[control.id];
    let value: WorkbenchValue = control.defaultValue;

    if (control.kind === "toggle") {
      value = booleanValue(raw, control.defaultValue);
    } else if (control.kind === "number") {
      value = numberValue(
        raw,
        control.defaultValue,
        control.min,
        control.max,
      );
    } else if (control.kind === "range") {
      const candidate = Array.isArray(raw) ? raw : control.defaultValue;
      const low = numberValue(
        candidate[0],
        control.defaultValue[0],
        control.min,
        control.max,
      );
      const high = numberValue(
        candidate[1],
        control.defaultValue[1],
        control.min,
        control.max,
      );
      value = [Math.min(low, high), Math.max(low, high)];
    } else if (control.kind === "multi") {
      const allowed = control.options.map((option) => option.value);
      const candidate = Array.isArray(raw)
        ? [...new Set(raw.filter((item): item is string =>
            typeof item === "string" && allowed.includes(item),
          ))]
        : [...control.defaultValue];
      value =
        candidate.length >= (control.minSelected ?? 0)
          ? candidate
          : [...control.defaultValue];
    } else if (control.kind === "select" || control.kind === "segmented") {
      value = allowedValue(
        raw,
        control.options.map((option) => option.value),
        control.defaultValue,
      );
    } else if (control.kind === "text" || control.kind === "textarea") {
      value = textValue(raw, control.defaultValue);
    }

    normalized[control.id] = value;
  }

  return normalized;
}

function normalizePeerReviewPreferences(input: Record<string, unknown>) {
  const normalized = normalizeWorkbenchPreferences(
    PEER_REVIEW_WORKBENCH,
    input,
  );
  if (input.scorecard === undefined && normalized.useTarget === true) {
    normalized.scorecard = normalized.targetType === "journal";
  }
  return normalized;
}

function normalizeIdeaPreferences(
  input: Record<string, unknown>,
): IdeaPreferences {
  const defaults = DEFAULT_IDEA_PREFERENCES_BY_MODE.discovery;
  return {
    ...defaults,
    directionId: allowedValue<IdeaDirectionId>(
      input.directionId,
      IDEA_DIRECTION_IDS,
      defaults.directionId,
    ),
    focus: textValue(input.focus),
    seed: textValue(input.seed),
    dataset: textValue(input.dataset),
    recentYears: numberValue(input.recentYears, defaults.recentYears, 1, 20),
    topConferences: booleanValue(
      input.topConferences,
      defaults.topConferences,
    ),
    topJournals: booleanValue(input.topJournals, defaults.topJournals),
    customVenues: textValue(input.customVenues),
    pursueSota: booleanValue(input.pursueSota, defaults.pursueSota),
    resourceConstraints: textValue(input.resourceConstraints),
    ideaCount: allowedValue<IdeaCount>(
      input.ideaCount,
      IDEA_COUNT_OPTIONS,
      defaults.ideaCount,
    ),
    noveltyPosture: allowedValue<NoveltyPostureId>(
      input.noveltyPosture,
      NOVELTY_POSTURE_IDS,
      defaults.noveltyPosture,
    ),
    additionalCriteria: textValue(input.additionalCriteria),
  };
}

function normalizeDraftPreferences(input: Record<string, unknown>) {
  return {
    templateId: allowedValue<DraftTemplateId>(
      input.templateId,
      DRAFT_TEMPLATE_IDS,
      DEFAULT_DRAFT_TEMPLATE_ID,
    ),
    customVenue: textValue(input.customVenue),
    captionWordRange: normalizeCaptionWordRange(
      input.captionWordRange,
    ),
  };
}

function normalizeFigurePreferences(
  input: Record<string, unknown>,
): FigurePreferences {
  const defaults = DEFAULT_FIGURE_PREFERENCES;
  const rawAccentMin = numberValue(
    input.accentColorMin,
    defaults.accentColorMin,
    1,
    4,
  );
  const rawAccentMax = numberValue(
    input.accentColorMax,
    defaults.accentColorMax,
    1,
    4,
  );
  return {
    promptId: allowedValue<FigurePromptId>(
      input.promptId,
      FIGURE_PROMPT_ORDER,
      defaults.promptId,
    ),
    executionMode: allowedValue(
      input.executionMode,
      ["direct", "prompt-first"] as const,
      defaults.executionMode,
    ),
    hasReferenceImage: booleanValue(
      input.hasReferenceImage,
      defaults.hasReferenceImage,
    ),
    aspectRatioId: allowedValue<FigureAspectRatioId>(
      input.aspectRatioId,
      FIGURE_ASPECT_RATIO_IDS,
      defaults.aspectRatioId,
    ),
    customAspectWidth: numberValue(
      input.customAspectWidth,
      defaults.customAspectWidth,
      1,
      100,
    ),
    customAspectHeight: numberValue(
      input.customAspectHeight,
      defaults.customAspectHeight,
      1,
      100,
    ),
    paletteId: allowedValue<FigurePaletteId>(
      input.paletteId,
      FIGURE_COLOR_PALETTE_IDS,
      defaults.paletteId,
    ),
    fontFamilyId: allowedValue<FigureFontFamilyId>(
      input.fontFamilyId,
      FIGURE_FONT_FAMILY_IDS,
      defaults.fontFamilyId,
    ),
    lineColorMode: allowedValue<FigureLineColorMode>(
      input.lineColorMode,
      ["neutral", "semantic"] as const,
      defaults.lineColorMode,
    ),
    accentColorMin: Math.min(rawAccentMin, rawAccentMax),
    accentColorMax: Math.max(rawAccentMin, rawAccentMax),
    allowLightIllustrations: booleanValue(
      input.allowLightIllustrations,
      defaults.allowLightIllustrations,
    ),
    cardFillPolicyId: allowedValue<FigureCardFillPolicyId>(
      input.cardFillPolicyId,
      FIGURE_CARD_FILL_POLICY_IDS,
      defaults.cardFillPolicyId,
    ),
    fontSizeLevels: allowedValue<FigureFontSizeLevels>(
      input.fontSizeLevels,
      [2, 3] as const,
      defaults.fontSizeLevels,
    ),
    includeLargeTitle: booleanValue(
      input.includeLargeTitle,
      defaults.includeLargeTitle,
    ),
  };
}

export function getSkillWorkflowConfigurationModel(
  workflowId: ConfigurableSkillWorkflowId,
) {
  const model = CONFIGURABLE_MODELS[workflowId];
  if (!model) {
    throw new Error(`Unknown YanShu skill workflow: ${workflowId}`);
  }
  return model;
}

export function normalizeSkillWorkflowPreferences(
  workflowId: ConfigurableSkillWorkflowId,
  input: Record<string, unknown> = {},
) {
  if (workflowId === "idea-discovery") {
    return normalizeIdeaPreferences(input);
  }
  if (workflowId === "paper-drafting") {
    return normalizeDraftPreferences(input);
  }
  if (workflowId === "citation-audit") {
    return normalizeWorkbenchPreferences(CITATION_AUDIT_WORKBENCH, input);
  }
  if (workflowId === "experimental-plotting") {
    return normalizeExperimentalPlotValues(input);
  }
  if (workflowId === "peer-review") {
    return normalizePeerReviewPreferences(input);
  }
  if (workflowId === "revision-planning") {
    return normalizeWorkbenchPreferences(REVISION_PLANNING_WORKBENCH, input);
  }
  if (workflowId === "revision-audit") {
    return normalizeWorkbenchPreferences(REVISION_AUDIT_WORKBENCH, input);
  }
  return normalizeFigurePreferences(input);
}

export function buildSkillWorkflowConfiguration(
  workflowId: ConfigurableSkillWorkflowId,
  input: Record<string, unknown> = {},
  promptLanguage: Language = "zh",
) {
  const model = getSkillWorkflowConfigurationModel(workflowId);
  const preferences = normalizeSkillWorkflowPreferences(workflowId, input);
  let prompt: string;
  let selection: Record<string, SkillWorkflowFieldValue>;

  if (workflowId === "idea-discovery") {
    const ideaPreferences = preferences as IdeaPreferences;
    prompt = buildIdeaPrompt("discovery", ideaPreferences, promptLanguage);
    selection = {
      directionId: ideaPreferences.directionId,
      recentYears: ideaPreferences.recentYears,
      ideaCount: ideaPreferences.ideaCount,
      noveltyPosture: ideaPreferences.noveltyPosture,
    };
  } else if (workflowId === "paper-drafting") {
    const draftPreferences = preferences as ReturnType<
      typeof normalizeDraftPreferences
    >;
    prompt = buildDraftPrompt(
      draftPreferences.templateId,
      draftPreferences.customVenue,
      promptLanguage,
      draftPreferences.captionWordRange,
    );
    selection = {
      templateId: draftPreferences.templateId,
      customVenue: draftPreferences.customVenue,
      captionWordRange: draftPreferences.captionWordRange,
    };
  } else if (workflowId === "citation-audit") {
    const citationPreferences = preferences as WorkbenchValues;
    prompt = CITATION_AUDIT_WORKBENCH.buildPrompt(
      citationPreferences,
      promptLanguage,
    );
    selection = {
      action: citationPreferences.action,
      sections: citationPreferences.sections,
      targetType: citationPreferences.targetType,
      referenceRange: citationPreferences.referenceRange,
      recentShare: citationPreferences.recentShare,
    };
  } else if (workflowId === "experimental-plotting") {
    const plotPreferences = preferences as ReturnType<
      typeof normalizeExperimentalPlotValues
    >;
    prompt = buildExperimentalPlotPrompt(
      plotPreferences,
      promptLanguage,
    );
    selection = {
      plotGoal: plotPreferences.plotGoal,
      allowComposite: plotPreferences.allowComposite,
      panelCount: plotPreferences.panelCount,
      palette: plotPreferences.palette,
    };
  } else if (workflowId === "peer-review") {
    const reviewPreferences = preferences as WorkbenchValues;
    prompt = PEER_REVIEW_WORKBENCH.buildPrompt(
      reviewPreferences,
      promptLanguage,
    );
    selection = {
      useTarget: reviewPreferences.useTarget,
      targetType: reviewPreferences.targetType,
      targetVenue: reviewPreferences.targetVenue,
      mode: reviewPreferences.mode,
      materialScope: reviewPreferences.materialScope,
      dimensions: reviewPreferences.dimensions,
      ignoreNonScientificPresentation:
        reviewPreferences.ignoreNonScientificPresentation,
      browseLiterature: reviewPreferences.browseLiterature,
    };
  } else if (workflowId === "revision-planning") {
    const revisionPreferences = preferences as WorkbenchValues;
    prompt = REVISION_PLANNING_WORKBENCH.buildPrompt(
      revisionPreferences,
      promptLanguage,
    );
    selection = {
      evidencePolicy: revisionPreferences.evidencePolicy,
      executionPlan: revisionPreferences.executionPlan,
    };
  } else if (workflowId === "revision-audit") {
    const auditPreferences = preferences as WorkbenchValues;
    prompt = REVISION_AUDIT_WORKBENCH.buildPrompt(
      auditPreferences,
      promptLanguage,
    );
    selection = {
      scenario: auditPreferences.scenario,
      venue: auditPreferences.venue,
    };
  } else {
    const figurePreferences = preferences as FigurePreferences;
    prompt = buildFigurePrompt(
      figurePreferences.promptId,
      figurePreferences,
      promptLanguage,
    );
    selection = {
      promptId: figurePreferences.promptId,
      hasReferenceImage: figurePreferences.hasReferenceImage,
      aspectRatio: getFigureAspectRatio(figurePreferences),
      accentColors: getFigureAccentColorRange(figurePreferences).label,
      paletteId: figurePreferences.paletteId,
    };
  }

  return {
    schemaVersion: 1,
    workflowId,
    workflowVersion: model.version,
    websitePath: model.websitePath,
    promptLanguage,
    preferences,
    prompt,
    selection,
  };
}
