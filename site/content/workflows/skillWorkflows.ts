import type { Language } from "../../app/config";
import type { WorkbenchControl } from "../../app/workbench/types";
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
import {
  WRITING_DIAGNOSIS_WORKBENCH,
  buildWritingDiagnosisPrompt,
  getDefaultWritingDiagnosisValues,
  normalizeWritingDiagnosisValues,
} from "../../app/writing/diagnosis/config";

export type LocalizedWorkflowText = Record<Language, string>;

export type YanShuSkillId =
  | "idea-discovery"
  | "paper-drafting"
  | "writing-diagnosis"
  | "paper-reconstruction"
  | "scientific-figure"
  | "experimental-plotting";

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

export const SKILL_WORKFLOW_VERSION = "2026.07.30";

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
    id: "writing-diagnosis",
    index: "03",
    skillName: "Writing Diagnosis",
    websitePath: "/writing/diagnosis",
    title: { zh: "诊断学术写作", en: "Diagnose academic writing" },
    description: {
      zh: "从全文、段落和句子三个尺度发现反复出现的写作手法与习惯问题，并给出具体指正。",
      en: "Identify recurring writing-technique and habit problems at manuscript, paragraph, and sentence scale, then provide actionable guidance.",
    },
    command: {
      zh: "使用 $writing-diagnosis 诊断这个论文目录中的学术写作问题。",
      en: "Use $writing-diagnosis to diagnose academic writing problems in this manuscript directory.",
    },
    input: {
      zh: "主稿 TeX、建议提供 PDF 与 BibTeX",
      en: "Main TeX, with PDF and BibTeX recommended",
    },
    output: {
      zh: "写作诊断报告与可选安全修订稿",
      en: "Writing diagnosis report and optional safe revision",
    },
  },
  {
    id: "paper-reconstruction",
    index: "04",
    skillName: "Paper Reconstruction",
    websitePath: "/reconstruction",
    title: { zh: "重构现有论文", en: "Reconstruct an existing paper" },
    description: {
      zh: "通过可恢复的五轮工作流重构科学定位、结构、方法实验叙事和方法总览图。",
      en: "Use a resumable five-round workflow to rebuild positioning, structure, method and experiment narrative, and the method overview figure.",
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
      zh: "五轮版本、框架图与最终可编译论文",
      en: "Five versioned rounds, a framework figure, and the final compilable paper",
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
      zh: "一张高清 PNG 与配置快照",
      en: "One high-resolution PNG and its configuration snapshot",
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
    {
      id: "writing",
      index: "02",
      title: localized("写作建议", "Writing guidance"),
      description: localized(
        "控制 Caption 的建议长度；该范围不是硬性验收条件。",
        "Configure advisory caption length; the range is never a hard acceptance condition.",
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
    "只生成一张高清 PNG，并保存配置与最终英文生图 Prompt。",
    "Generate one high-resolution PNG and save its configuration and final English image prompt.",
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
            "内部完成风格总结和英文生图 Prompt，然后直接生成图片。",
            "Build the style summary and English image prompt internally, then generate the image.",
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

const WRITING_DIAGNOSIS_SECTIONS = [
  {
    id: "scope",
    index: "01",
    title: localized("材料与范围", "Materials and scope"),
    description: localized(
      "选择全文或需要诊断的具体章节与文字载体。",
      "Choose the whole manuscript or specific sections and text carriers.",
    ),
  },
  {
    id: "reader",
    index: "02",
    title: localized("读者与深度", "Readers and depth"),
    description: localized(
      "根据目标读者控制术语负担和诊断颗粒度。",
      "Set terminology burden and diagnostic granularity for the intended readers.",
    ),
  },
  {
    id: "dimensions",
    index: "03",
    title: localized("诊断维度", "Diagnostic dimensions"),
    description: localized(
      "组合检查叙事、引用、段落、图表、结果、公式与语言习惯。",
      "Combine narrative, citation, paragraph, display, results, equation, and language checks.",
    ),
  },
  {
    id: "delivery",
    index: "04",
    title: localized("指正与交付", "Guidance and delivery"),
    description: localized(
      "选择仅报告或安全修复，并保护原稿中的好表达。",
      "Choose report-only or safe repair while preserving strong existing prose.",
    ),
  },
] as const;

const WRITING_DIAGNOSIS_FIELD_SECTIONS: Record<string, string> = {
  scope: "scope",
  sections: "scope",
  depth: "reader",
  audience: "reader",
  dimensions: "dimensions",
  browseCitations: "dimensions",
  action: "delivery",
  preserveStrengths: "delivery",
  custom: "delivery",
};

function writingDiagnosisWorkflowField(
  control: WorkbenchControl,
): SkillWorkflowField {
  const field = configurableWorkbenchField(
    control,
    WRITING_DIAGNOSIS_FIELD_SECTIONS[control.id] ?? "delivery",
  );
  if (control.id === "sections") {
    field.visibleWhen = { fieldId: "scope", equals: "selected" };
  }
  if (control.id === "browseCitations") {
    field.visibleWhen = {
      fieldId: "dimensions",
      includes: "citation-practice",
    };
  }
  return field;
}

const WRITING_DIAGNOSIS_MODEL: SkillWorkflowModel = {
  id: "writing-diagnosis",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "writing-diagnosis",
  websitePath: "/writing/diagnosis",
  title: localized("学术写作诊断", "Academic Writing Diagnosis"),
  eyebrow: "YANSHU · ACADEMIC WRITING DIAGNOSIS",
  description: localized(
    "从全文、段落和句子三个尺度发现作者难以自察的写作手法与习惯问题。",
    "Expose hard-to-notice writing-technique and habit problems at manuscript, paragraph, and sentence scale.",
  ),
  materialTitle: localized("需要材料", "Required materials"),
  materialItems: {
    zh: ["主稿 .tex", "最新编译 PDF（建议）", ".bib（建议）", "目标 venue 指南（可选）"],
    en: ["Main .tex", "Latest compiled PDF (recommended)", ".bib (recommended)", "Target-venue guidance (optional)"],
  },
  materialHint: localized(
    "无需 figures 或实验源数据；本工作流只诊断写作，不重新评审科学贡献。",
    "Figures and raw experimental data are unnecessary; this workflow diagnoses writing rather than re-reviewing the science.",
  ),
  output: localized(
    "写作诊断 Markdown，以及选择安全修复时的完整修订 TeX 与 high-risk diff。",
    "A writing-diagnosis Markdown report plus a complete revised TeX and high-risk diff when safe repair is selected.",
  ),
  sections: WRITING_DIAGNOSIS_SECTIONS,
  fields: WRITING_DIAGNOSIS_WORKBENCH.controls.map(
    writingDiagnosisWorkflowField,
  ),
  defaults: {
    ...getDefaultWritingDiagnosisValues(),
  },
};

const CONFIGURABLE_MODELS: Record<
  ConfigurableSkillWorkflowId,
  SkillWorkflowModel
> = {
  "idea-discovery": IDEA_DISCOVERY_MODEL,
  "paper-drafting": PAPER_DRAFTING_MODEL,
  "writing-diagnosis": WRITING_DIAGNOSIS_MODEL,
  "scientific-figure": SCIENTIFIC_FIGURE_MODEL,
  "experimental-plotting": EXPERIMENTAL_PLOTTING_MODEL,
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
  if (workflowId === "writing-diagnosis") {
    return normalizeWritingDiagnosisValues(input);
  }
  if (workflowId === "experimental-plotting") {
    return normalizeExperimentalPlotValues(input);
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
  } else if (workflowId === "writing-diagnosis") {
    const diagnosisPreferences = preferences as ReturnType<
      typeof normalizeWritingDiagnosisValues
    >;
    prompt = buildWritingDiagnosisPrompt(
      diagnosisPreferences,
      promptLanguage,
    );
    selection = {
      scope: diagnosisPreferences.scope,
      depth: diagnosisPreferences.depth,
      dimensions: diagnosisPreferences.dimensions,
      action: diagnosisPreferences.action,
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
