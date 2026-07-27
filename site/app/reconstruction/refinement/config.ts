import { COMMON_PROMPT_BLOCKS } from "../../../content/prompts/templates";
import { withPromptJudgmentDirective } from "../../../content/prompts/promptAgency";
import type { Language } from "../../config";

type LocalizedText = Record<Language, string>;

export const REFINEMENT_SECTION_IDS = [
  "abstract",
  "introduction",
  "related-work",
  "method",
  "experiments-results",
  "discussion",
  "conclusion",
] as const;

export type RefinementSectionId =
  (typeof REFINEMENT_SECTION_IDS)[number];

export const DISCUSSION_SCOPE_IDS = [
  "discussion-only",
  "merged-experiments-results-discussion",
] as const;

export type DiscussionScopeId = (typeof DISCUSSION_SCOPE_IDS)[number];

export const EXPERIMENTAL_FOCUS_IDS = [
  "both",
  "setup",
  "results",
] as const;

export type ExperimentalFocusId = (typeof EXPERIMENTAL_FOCUS_IDS)[number];

export const REWRITE_DEPTH_IDS = [
  "polish",
  "deep",
  "from-scratch",
] as const;

export type RewriteDepthId = (typeof REWRITE_DEPTH_IDS)[number];

export const CITATION_MODE_IDS = [
  "preserve",
  "verified-additions",
] as const;

export type CitationModeId = (typeof CITATION_MODE_IDS)[number];
export type LimitationModeId = "separate" | "merged";
export type SectionLengthMode = "none" | "preserve" | "custom";
export type ParagraphsPerVisual = 1 | 2;
export type RelatedWorkParagraphs = 1 | 2;
export type MethodOverviewMode = "preserve" | "standalone" | "integrated";

export interface SectionRefinementPreferences {
  sectionId: RefinementSectionId;
  discussionScope: DiscussionScopeId;
  experimentalFocus: ExperimentalFocusId;
  limitationMode: LimitationModeId;
  sectionLengthMode: SectionLengthMode;
  sectionMinWords: number;
  sectionMaxWords: number;
  paragraphMinWords: number;
  paragraphMaxWords: number;
  sentenceMinWords: number;
  sentenceMaxWords: number;
  rewriteDepth: RewriteDepthId;
  citationMode: CitationModeId;
  allowColon: boolean;
  allowWe: boolean;
  abstractResultNumbersMin: number;
  abstractResultNumbersMax: number;
  abstractKeywordCountMin: number;
  abstractKeywordCountMax: number;
  abstractKeywordWordsMin: number;
  abstractKeywordWordsMax: number;
  introductionCitationMin: number;
  introductionCitationMax: number;
  introductionMaxCitationsPerSentence: number;
  introductionContributionCount: number;
  introductionContributionWords: number;
  introductionContributionStartsWithWe: boolean;
  introductionIncludeNavigationSentence: boolean;
  relatedCitationMin: number;
  relatedCitationMax: number;
  relatedMaxCitationsPerSentence: number;
  relatedParagraphsPerSubsection: RelatedWorkParagraphs;
  visualParagraphsPerItem: ParagraphsPerVisual;
  visualParagraphMinWords: number;
  visualParagraphMaxWords: number;
  keyNumbersPerParagraphMin: number;
  keyNumbersPerParagraphMax: number;
  discussionMaxSpecificNumbers: number;
  methodOverviewMode: MethodOverviewMode;
  methodOverviewMaxWords: number;
  methodOverviewParagraphs: number;
  methodIncludePseudocode: boolean;
  methodPseudocodeMaxLines: number;
  methodIncludeComplexityAnalysis: boolean;
  allowVisualReorder: boolean;
  allowVisualDeletion: boolean;
  allowVisualAppendixMove: boolean;
}

interface RefinementSectionDefinition {
  label: LocalizedText;
  shortLabel: LocalizedText;
  purpose: LocalizedText;
  contractSummary: LocalizedText;
}

export const REFINEMENT_SECTIONS: Record<
  RefinementSectionId,
  RefinementSectionDefinition
> = {
  abstract: {
    label: { zh: "摘要", en: "Abstract" },
    shortLabel: { zh: "Abstract", en: "Abstract" },
    purpose: {
      zh: "压缩背景、方法、关键结果与证据边界，形成可独立阅读的连续段落。",
      en: "Compress background, method, decisive results, and evidence boundaries into one self-contained paragraph.",
    },
    contractSummary: {
      zh: "固定为单段；无引用；结果数字、缩写和句子功能单独约束。",
      en: "One paragraph; no citations; dedicated controls for result values, acronyms, and sentence functions.",
    },
  },
  introduction: {
    label: { zh: "引言", en: "Introduction" },
    shortLabel: { zh: "Introduction", en: "Introduction" },
    purpose: {
      zh: "重建问题—缺口—挑战—核心思想—贡献的进入路径。",
      en: "Rebuild the path from problem and gap to challenges, core idea, and contributions.",
    },
    contractSummary: {
      zh: "五个核心段落；独立控制引用、贡献写法与纯章节导航句。",
      en: "Five core paragraphs with dedicated controls for citations, contribution form, and an optional pure paper roadmap.",
    },
  },
  "related-work": {
    label: { zh: "相关工作", en: "Related Work" },
    shortLabel: { zh: "Related Work", en: "Related Work" },
    purpose: {
      zh: "按研究范式与关键权衡综合文献，建立可核验的差异化定位。",
      en: "Synthesize literature by paradigm and trade-off to establish a verifiable position.",
    },
    contractSummary: {
      zh: "固定三个 subsection；独立控制每节段落数、引用论文总数与单句引用密度。",
      en: "Exactly three subsections with dedicated paragraph-count, cited-paper, and citation-density controls.",
    },
  },
  method: {
    label: { zh: "方法", en: "Method" },
    shortLabel: { zh: "Method", en: "Method" },
    purpose: {
      zh: "把设计动机、计算构造、组件接口和适用边界写成连贯科学故事。",
      en: "Turn motivation, computation, interfaces, and scope into a coherent scientific story.",
    },
    contractSummary: {
      zh: "默认保留核心内容和合理标题层级；围绕 why 组织叙事，不写成说明书。",
      en: "Preserve core content and a justified hierarchy by default; organize around why rather than a manual-like inventory.",
    },
  },
  "experiments-results": {
    label: { zh: "实验与结果", en: "Experiments & Results" },
    shortLabel: { zh: "Experiments & Results", en: "Experiments & Results" },
    purpose: {
      zh: "默认联合精修实验设置与结果，也可将范围收窄到其中一部分。",
      en: "Refine setup and results together by default, or narrow the scope to either part.",
    },
    contractSummary: {
      zh: "默认同时应用实验设置、结果叙事与图表证据合同；也支持单独精修。",
      en: "Apply setup, result-narrative, and visual-evidence contracts together by default, with focused modes available.",
    },
  },
  discussion: {
    label: { zh: "讨论", en: "Discussion" },
    shortLabel: { zh: "Discussion", en: "Discussion" },
    purpose: {
      zh: "解释机制、意义与适用范围，同时诚实呈现证据边界和局限。",
      en: "Interpret mechanisms, implications, and scope while stating evidentiary boundaries and limitations honestly.",
    },
    contractSummary: {
      zh: "不得复述 Results 或重新讲图表；单独控制结果数字上限与局限组织。",
      en: "Do not repeat Results or re-narrate visuals; control result-value density and limitation placement separately.",
    },
  },
  conclusion: {
    label: { zh: "结论", en: "Conclusion" },
    shortLabel: { zh: "Conclusion", en: "Conclusion" },
    purpose: {
      zh: "用两段收束问题、核心思想、证据、意义和边界，不重复摘要。",
      en: "Close the problem, core idea, evidence, implications, and boundaries in two paragraphs without repeating the Abstract.",
    },
    contractSummary: {
      zh: "固定两段；无引用、无新 claim、无新数字，也不复制摘要。",
      en: "Exactly two paragraphs; no citations, new claims, new values, or copied Abstract language.",
    },
  },
};

export const DISCUSSION_SCOPES = {
  "discussion-only": {
    label: { zh: "仅精修 Discussion", en: "Discussion only" },
    description: {
      zh: "保持 Experiments、Results 与 Discussion 的现有章节边界。",
      en: "Preserve the current boundaries among Experiments, Results, and Discussion.",
    },
  },
  "merged-experiments-results-discussion": {
    label: {
      zh: "合并实验、结果与 Discussion",
      en: "Merge Experiments + Results + Discussion",
    },
    description: {
      zh: "在同一顶层章节内组织设置、证据与解释，但严格保持三种功能边界。",
      en: "Use one top-level section while keeping setup, evidence, and interpretation functionally distinct.",
    },
  },
} as const satisfies Record<
  DiscussionScopeId,
  { label: LocalizedText; description: LocalizedText }
>;

export const EXPERIMENTAL_FOCUSES = {
  both: {
    label: { zh: "实验设置与结果", en: "Setup and Results" },
    description: {
      zh: "默认联合精修：完整保护实验事实，并重建结果与图表的证据叙事。",
      en: "Default joint refinement: protect all experimental facts while rebuilding result and visual-evidence narration.",
    },
  },
  setup: {
    label: { zh: "仅精修实验设置", en: "Experimental setup only" },
    description: {
      zh: "只处理数据集、实验配置、基线与协议；结果正文和图表保持不变。",
      en: "Refine datasets, configurations, baselines, and protocols only; keep result prose and visuals unchanged.",
    },
  },
  results: {
    label: { zh: "仅精修结果", en: "Results only" },
    description: {
      zh: "只处理结果叙事与图表证据；实验设置保持不变。",
      en: "Refine result narration and visual evidence only; keep experimental setup unchanged.",
    },
  },
} as const satisfies Record<
  ExperimentalFocusId,
  { label: LocalizedText; description: LocalizedText }
>;

export const REWRITE_DEPTHS = {
  polish: {
    label: { zh: "语言精修", en: "Language polish" },
    description: {
      zh: "保留结构和论证顺序，只修复表达、指代与局部衔接。",
      en: "Preserve structure and argument order; repair wording, references, and local transitions.",
    },
  },
  deep: {
    label: { zh: "深度精修", en: "Deep refinement" },
    description: {
      zh: "允许重组段落与证据顺序，但不改变事实、主张和章节功能。",
      en: "Reorganize paragraphs and evidence order without changing facts, claims, or section function.",
    },
  },
  "from-scratch": {
    label: { zh: "证据重组", en: "Evidence-led recomposition" },
    description: {
      zh: "在事实与原稿优质表达清单上重组所选范围；仅替换确有问题的表达。",
      en: "Recompose the scope from verified facts and a preservation list of strong original expression, replacing only wording that genuinely fails.",
    },
  },
} as const satisfies Record<
  RewriteDepthId,
  { label: LocalizedText; description: LocalizedText }
>;

export const CITATION_MODES = {
  preserve: {
    label: { zh: "仅使用现有文献", en: "Existing sources only" },
    description: {
      zh: "不新增文献；只修复引用位置、密度和重复。",
      en: "Add no source; repair only citation placement, density, and duplication.",
    },
  },
  "verified-additions": {
    label: { zh: "允许核验后补充", en: "Allow verified additions" },
    description: {
      zh: "仅在真实论证缺口下核验原始来源并补充准确 BibTeX。",
      en: "Add accurate BibTeX from verified primary sources only for a genuine argumentative gap.",
    },
  },
} as const satisfies Record<
  CitationModeId,
  { label: LocalizedText; description: LocalizedText }
>;

interface LengthProfile {
  mode: SectionLengthMode;
  section: readonly [number, number];
  paragraph: readonly [number, number];
  sentence: readonly [number, number];
}

const SECTION_LENGTH_PROFILES: Record<
  RefinementSectionId,
  LengthProfile
> = {
  abstract: {
    mode: "none",
    section: [190, 220],
    paragraph: [190, 220],
    sentence: [12, 24],
  },
  introduction: {
    mode: "none",
    section: [480, 560],
    paragraph: [65, 100],
    sentence: [14, 24],
  },
  "related-work": {
    mode: "none",
    section: [420, 520],
    paragraph: [110, 170],
    sentence: [14, 22],
  },
  method: {
    mode: "none",
    section: [1200, 1800],
    paragraph: [90, 160],
    sentence: [14, 26],
  },
  "experiments-results": {
    mode: "none",
    section: [300, 500],
    paragraph: [75, 130],
    sentence: [14, 24],
  },
  discussion: {
    mode: "none",
    section: [420, 560],
    paragraph: [90, 150],
    sentence: [14, 24],
  },
  conclusion: {
    mode: "none",
    section: [180, 220],
    paragraph: [80, 120],
    sentence: [14, 24],
  },
};

export function getLengthProfile(
  sectionId: RefinementSectionId,
  discussionScope: DiscussionScopeId = "discussion-only",
  experimentalFocus: ExperimentalFocusId = "both",
): LengthProfile {
  const base = SECTION_LENGTH_PROFILES[sectionId];
  if (sectionId === "experiments-results") {
    if (experimentalFocus === "both") {
      return {
        mode: "none",
        section: [800, 1400],
        paragraph: [80, 135],
        sentence: [14, 24],
      };
    }
    if (experimentalFocus === "results") {
      return {
        mode: "none",
        section: [500, 900],
        paragraph: [85, 140],
        sentence: [14, 24],
      };
    }
    return base;
  }
  if (
    sectionId === "discussion" &&
    discussionScope === "merged-experiments-results-discussion"
  ) {
    return {
      mode: "none",
      section: [1800, 2800],
      paragraph: base.paragraph,
      sentence: base.sentence,
    };
  }
  return base;
}

function scopeParts(preferences: SectionRefinementPreferences) {
  if (preferences.sectionId === "experiments-results") {
    return {
      experiments:
        preferences.experimentalFocus === "both" ||
        preferences.experimentalFocus === "setup",
      results:
        preferences.experimentalFocus === "both" ||
        preferences.experimentalFocus === "results",
      discussion: false,
    };
  }
  if (preferences.sectionId === "discussion") {
    const merged =
      preferences.discussionScope ===
      "merged-experiments-results-discussion";
    return {
      experiments: merged,
      results: merged,
      discussion: true,
    };
  }
  return {
    experiments: false,
    results: false,
    discussion: false,
  };
}

export function scopeIncludesDiscussion(
  preferences: SectionRefinementPreferences,
) {
  return scopeParts(preferences).discussion;
}

export function scopeUsesVisualEvidence(
  preferences: SectionRefinementPreferences,
) {
  return scopeParts(preferences).results;
}

export function scopeSupportsCitations(
  preferences: SectionRefinementPreferences,
) {
  return !["abstract", "conclusion"].includes(preferences.sectionId);
}

export function scopeUsesWeToggle(
  preferences: SectionRefinementPreferences,
) {
  return ["method", "experiments-results", "discussion"].includes(
    preferences.sectionId,
  );
}

const DEFAULT_SPECIALIZED_VALUES = {
  abstractResultNumbersMin: 2,
  abstractResultNumbersMax: 4,
  abstractKeywordCountMin: 4,
  abstractKeywordCountMax: 5,
  abstractKeywordWordsMin: 1,
  abstractKeywordWordsMax: 2,
  introductionCitationMin: 10,
  introductionCitationMax: 18,
  introductionMaxCitationsPerSentence: 4,
  introductionContributionCount: 3,
  introductionContributionWords: 22,
  introductionContributionStartsWithWe: true,
  introductionIncludeNavigationSentence: false,
  relatedCitationMin: 15,
  relatedCitationMax: 25,
  relatedMaxCitationsPerSentence: 4,
  relatedParagraphsPerSubsection: 1 as RelatedWorkParagraphs,
  visualParagraphsPerItem: 2 as ParagraphsPerVisual,
  visualParagraphMinWords: 70,
  visualParagraphMaxWords: 150,
  keyNumbersPerParagraphMin: 0,
  keyNumbersPerParagraphMax: 4,
  discussionMaxSpecificNumbers: 3,
  methodOverviewMode: "preserve" as MethodOverviewMode,
  methodOverviewMaxWords: 80,
  methodOverviewParagraphs: 2,
  methodIncludePseudocode: false,
  methodPseudocodeMaxLines: 12,
  methodIncludeComplexityAnalysis: false,
  allowVisualReorder: false,
  allowVisualDeletion: false,
  allowVisualAppendixMove: false,
};

export function createSectionPreferences(
  sectionId: RefinementSectionId,
  discussionScope: DiscussionScopeId = "discussion-only",
  experimentalFocus: ExperimentalFocusId = "both",
): SectionRefinementPreferences {
  const profile = getLengthProfile(
    sectionId,
    discussionScope,
    experimentalFocus,
  );
  return {
    sectionId,
    discussionScope,
    experimentalFocus,
    limitationMode: "separate",
    sectionLengthMode: profile.mode,
    sectionMinWords: profile.section[0],
    sectionMaxWords: profile.section[1],
    paragraphMinWords: profile.paragraph[0],
    paragraphMaxWords: profile.paragraph[1],
    sentenceMinWords: profile.sentence[0],
    sentenceMaxWords: profile.sentence[1],
    rewriteDepth: "deep",
    citationMode:
      sectionId === "introduction" || sectionId === "related-work"
        ? "verified-additions"
        : "preserve",
    allowColon: true,
    allowWe: true,
    ...DEFAULT_SPECIALIZED_VALUES,
  };
}

export const DEFAULT_SECTION_REFINEMENT_PREFERENCES =
  createSectionPreferences("abstract");

export const REFINEMENT_COPY = {
  zh: {
    eyebrow: "SECTION REFINEMENT",
    title: "章节精修",
    subtitle:
      "每个章节使用独立精修合同；页面只显示当前章节真正适用的结构、引用与证据控件。",
    preset: "单章聚焦 · 章节专用 Prompt · 证据不变",
    reset: "恢复当前章节默认",
    resetHint: "恢复当前章节的推荐结构；篇幅建议默认关闭。",
    materials: "论文材料",
    materialItems: [
      "完整 .tex",
      "最新编译 .pdf",
      "完整 .bib",
      "figures/（可选）",
    ],
    materialsHint:
      "figures/ 仅在当前范围引用图表、需要核对视觉证据或源图时提供；缺少 figures/ 不阻止精修。",
    targetSection: "精修章节",
    targetSectionHint: "切换章节会同步切换专用控件和完整 Prompt；篇幅建议默认关闭。",
    organization: "Discussion 组织",
    organizationHint:
      "可只精修 Discussion，也可将 Experiments、Results 与 Discussion 合并为一个顶层章节。",
    limitation: "局限组织",
    limitationSeparate: "单列 Limitations",
    limitationMerged: "并入 Discussion",
    limitationHint: "仅在精修范围包含 Discussion 时生效。",
    sectionContract: "章节专用约束",
    abstractNumbers: "Results 关键数字",
    abstractNumbersHint:
      "只保留能直接支撑核心 claim 的数字；默认建议 2–4 个，避免摘要数字密度过高。",
    abstractKeywords: "Keywords 数量",
    abstractKeywordWords: "每个 Keyword 词数",
    abstractKeywordsHint:
      "使用高信息量、可检索且彼此不重复的术语；避免 Method、Model 等脱离语境的泛化词。",
    introductionCitations: "Introduction 引用论文数",
    relatedCitations: "Related Work 引用论文数",
    maxCitationsPerSentence: "单句最多引用论文",
    citationCountHint:
      "按去重论文计数。默认允许联网补充，并优先执行日前两年的顶会、顶刊论文；所有新增文献必须写入完整 BibTeX。",
    contributionRule: "贡献写法",
    contributionCount: "贡献数量",
    contributionWords: "每条约",
    contributionStartsWithWe: "每条以 We 开头",
    introductionNavigation: "纯章节导航句",
    introductionNavigationOn: "包含",
    introductionNavigationOff: "不包含",
    contributionRuleText:
      "每条贡献只写一句。P3 只界定今天仍未解决的挑战，P4 直接回答这些挑战；导航句只说明论文组织，不承担新论证。",
    relatedParagraphs: "每个 subsection 段落数",
    oneParagraph: "1 段",
    twoParagraphs: "2 段",
    relatedRuleText:
      "固定三个 subsection；最后一句建议控制在 18 词以内，不出现方法名、品牌缩写或 we。",
    experimentalFocus: "精修范围",
    experimentalFocusHint:
      "默认联合精修实验设置与结果；切换为单独范围时会同步收窄章节合同。",
    visualParagraphs: "每张图／表对应段落",
    visualParagraphLength: "图表对应段落词数",
    keyNumbersPerParagraph: "每段关键数字",
    visualRuleText:
      "70–150 词是单段建议范围。Main Results 与决定性证据可接近上限，常规或辅助证据宜更短；按图表重要性分配篇幅，而不是平均铺开。",
    visualOperations: "图表结构权限",
    allowVisualReorder: "允许调整图表顺序",
    allowVisualDeletion: "允许删除图表",
    allowVisualAppendixMove: "允许图表移入附录",
    visualOperationsHint:
      "“允许”不等于必须操作：核心证据不得删除或移出正文，任何顺序、删除或附录变更都必须在报告中逐项说明。",
    discussionNumbers: "Discussion 具体结果数字上限",
    discussionRuleText:
      "Discussion 不引用实验图表，也不复述 Results；不写具体结果数字完全可以。",
    methodRuleText:
      "围绕设计动机、必要机制、接口和边界讲清 why；标题只对应实质科学单元，不为每个模块新增层级。",
    methodStructure: "Method 结构与算法表达",
    methodOverview: "独立 Method Overview",
    overviewPreserve: "保持现状",
    overviewStandalone: "单列 Overview",
    overviewIntegrated: "不单列",
    overviewWords: "Overview 建议总词数",
    overviewParagraphs: "Overview 段落数",
    includePseudocode: "需要伪代码",
    pseudocodeLines: "伪代码行数上限",
    includeComplexity: "增加时间复杂度分析",
    methodStructureHint:
      "伪代码默认不超过 12 行；复杂度分析只做可由现有算法推出的精简说明，不为完整性虚构结论。",
    conclusionRuleText:
      "固定两段且不使用引用；不得加入新 claim、新数字、新模块或复制 Abstract 句子。",
    length: "篇幅建议",
    sectionLength: "精修范围参考方式",
    noLength: "不设篇幅建议",
    preserveLength: "参考原稿长度",
    customLength: "自定义建议",
    paragraphLength: "普通段落建议词数",
    sentenceLength: "普通句子建议词数",
    minimum: "最少",
    maximum: "最多",
    words: "词",
    papers: "篇",
    values: "个",
    lines: "行",
    lengthHint:
      "默认不设篇幅建议。启用后，所有数字也只供参考，可根据论文内容选择接受、调整或忽略；定义完整性和证据准确性始终优先。",
    expression: "改写与表达",
    rewriteDepth: "改写强度",
    citationMode: "引用策略",
    allowColon: "允许冒号",
    allowWe: "允许 we / our",
    enabled: "允许但克制",
    disabled: "不使用",
    on: "启用",
    off: "关闭",
    expressionHint:
      "“允许”不是使用指标：冒号只在确有必要时使用；we / our 只用于作者真实动作且不得滥用。",
    promptPurpose:
      "完整读取论文，只重写配置覆盖的范围，并返回可编译的完整论文。",
    switchPromptLanguage: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "收起",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    eyebrow: "SECTION REFINEMENT",
    title: "Section refinement",
    subtitle:
      "Each section has its own refinement contract; only structurally and evidentially relevant controls are shown.",
    preset: "One focused scope · section-specific Prompt · unchanged evidence",
    reset: "Restore section defaults",
    resetHint:
      "Restore the current section's recommended structure; length guidance remains off by default.",
    materials: "Paper materials",
    materialItems: [
      "Complete .tex",
      "Latest compiled .pdf",
      "Complete .bib",
      "figures/ (optional)",
    ],
    materialsHint:
      "Provide figures/ only when the scope cites visuals or source images are needed for evidence checks. Its absence does not block refinement.",
    targetSection: "Section to refine",
    targetSectionHint:
      "Changing the section updates its dedicated controls and complete Prompt; length guidance remains off by default.",
    organization: "Discussion organization",
    organizationHint:
      "Refine Discussion alone or merge Experiments, Results, and Discussion into one top-level section.",
    limitation: "Limitations organization",
    limitationSeparate: "Separate Limitations",
    limitationMerged: "Merge into Discussion",
    limitationHint: "Applies only when Discussion is in scope.",
    sectionContract: "Section-specific constraints",
    abstractNumbers: "Key values in Results",
    abstractNumbersHint:
      "Keep only values that directly support primary claims; two to four is the default to avoid excessive numeric density.",
    abstractKeywords: "Number of Keywords",
    abstractKeywordWords: "Words per Keyword",
    abstractKeywordsHint:
      "Use high-information, searchable, non-overlapping terms; avoid context-free generic labels such as Method or Model.",
    introductionCitations: "Papers cited in Introduction",
    relatedCitations: "Papers cited in Related Work",
    maxCitationsPerSentence: "Maximum papers per sentence",
    citationCountHint:
      "Count distinct papers. Verified additions are enabled by default and prioritize top conference/journal papers from the two years preceding execution; every addition must enter the complete BibTeX.",
    contributionRule: "Contribution form",
    contributionCount: "Number of contributions",
    contributionWords: "Words per item",
    contributionStartsWithWe: "Begin each with We",
    introductionNavigation: "Pure paper-roadmap sentence",
    introductionNavigationOn: "Include",
    introductionNavigationOff: "Omit",
    contributionRuleText:
      "Each contribution is one sentence. P3 defines only the challenges that remain today; P4 answers them directly. A roadmap sentence states organization only and carries no new argument.",
    relatedParagraphs: "Paragraphs per subsection",
    oneParagraph: "1 paragraph",
    twoParagraphs: "2 paragraphs",
    relatedRuleText:
      "Exactly three subsections; each final sentence should preferably stay within 18 words and names neither the method, its acronym, nor we.",
    experimentalFocus: "Refinement scope",
    experimentalFocusHint:
      "Setup and Results are refined together by default; a focused scope narrows the section contract.",
    visualParagraphs: "Paragraphs per figure/table",
    visualParagraphLength: "Words per visual paragraph",
    keyNumbersPerParagraph: "Key values per paragraph",
    visualRuleText:
      "The 70–150-word range applies per paragraph. Main Results and decisive evidence may approach the upper end; routine or supporting evidence should be shorter. Allocate prose by evidential importance rather than evenly.",
    visualOperations: "Visual-structure permissions",
    allowVisualReorder: "Allow visual reordering",
    allowVisualDeletion: "Allow visual deletion",
    allowVisualAppendixMove: "Allow moving visuals to appendix",
    visualOperationsHint:
      "Permission never makes an operation mandatory: core evidence cannot be deleted or removed from the main text, and every reorder, deletion, or appendix move must be reported.",
    discussionNumbers: "Maximum result values in Discussion",
    discussionRuleText:
      "Discussion neither cites experimental visuals nor repeats Results; using no specific result value is acceptable.",
    methodRuleText:
      "Explain motivation, necessary mechanisms, interfaces, and boundaries as a why-driven story. Use headings only for substantive scientific units, not every component.",
    methodStructure: "Method structure and algorithm expression",
    methodOverview: "Standalone Method Overview",
    overviewPreserve: "Preserve current",
    overviewStandalone: "Standalone Overview",
    overviewIntegrated: "No standalone Overview",
    overviewWords: "Suggested Overview words",
    overviewParagraphs: "Overview paragraphs",
    includePseudocode: "Include pseudocode",
    pseudocodeLines: "Pseudocode line maximum",
    includeComplexity: "Add time-complexity analysis",
    methodStructureHint:
      "Pseudocode defaults to at most 12 lines. Complexity analysis stays concise and includes only conclusions derivable from the existing algorithm.",
    conclusionRuleText:
      "Exactly two paragraphs with no citations, new claims, new values, new components, or copied Abstract sentences.",
    length: "Length guidance",
    sectionLength: "Reference mode",
    noLength: "No length guidance",
    preserveLength: "Use current length as reference",
    customLength: "Custom suggestions",
    paragraphLength: "Suggested ordinary paragraph length",
    sentenceLength: "Suggested ordinary sentence length",
    minimum: "Minimum",
    maximum: "Maximum",
    words: "words",
    papers: "papers",
    values: "values",
    lines: "lines",
    lengthHint:
      "Length guidance is off by default. When enabled, every number is optional: accept, adjust, or ignore it according to the paper; definitional completeness and evidence accuracy always take priority.",
    expression: "Revision and expression",
    rewriteDepth: "Revision depth",
    citationMode: "Citation policy",
    allowColon: "Allow colons",
    allowWe: "Allow we / our",
    enabled: "Allowed sparingly",
    disabled: "Not used",
    on: "Enabled",
    off: "Off",
    expressionHint:
      "Permission is not a usage target: use a colon only when indispensable, and use we / our only for genuine author actions without repetition.",
    promptPurpose:
      "Read the complete paper, revise only the configured scope, and return a compilable complete manuscript.",
    switchPromptLanguage: "Switch Prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

export function getRefinementScopeLabel(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (preferences.sectionId === "experiments-results") {
    if (preferences.experimentalFocus === "both") {
      return language === "zh"
        ? "实验与结果"
        : "Experiments and Results";
    }
    if (preferences.experimentalFocus === "setup") {
      return language === "zh"
        ? "实验设置"
        : "Experimental Setup";
    }
    return language === "zh" ? "实验结果" : "Results";
  }
  if (
    preferences.sectionId === "discussion" &&
    preferences.discussionScope ===
      "merged-experiments-results-discussion"
  ) {
    return language === "zh"
      ? "实验、结果与讨论（合并）"
      : "Experiments, Results, and Discussion (merged)";
  }
  return REFINEMENT_SECTIONS[preferences.sectionId].label[language];
}

function limitationDirective(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (!scopeIncludesDiscussion(preferences)) return "";
  if (preferences.limitationMode === "separate") {
    return language === "zh"
      ? "- 局限单列为 Limitations subsection，集中写真实适用边界、证据不足和文字无法修复的风险，不重复结果。"
      : "- Keep a separate Limitations subsection for real scope boundaries, evidentiary gaps, and risks prose cannot repair, without repeating results.";
  }
  return language === "zh"
    ? "- 不单列 Limitations；将局限放入 Discussion 最后一个 subsection 的独立自然段，清楚区分已知边界、证据不足和未来工作。"
    : "- Do not create a standalone Limitations subsection. Put limitations in a distinct paragraph of the final Discussion subsection, separating known boundaries, evidence gaps, and future work.";
}

function citationDirective(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (!scopeSupportsCitations(preferences)) return "";
  const deepAudit =
    preferences.sectionId === "introduction" ||
    preferences.sectionId === "related-work";
  if (preferences.citationMode === "preserve") {
    if (language === "zh") {
      return `## 引用与 BibTeX
不得新增文献或 cite key。可以移动引用到正确语义位置、合并重复引用，或删除确实不支持当前句子的引用；每项删除都写入报告。数量目标不得迫使你虚构或补造文献，现有真实文献不足时应在报告中说明。所有保留的 key 必须存在于完整 .bib。
${deepAudit ? "逐项核查当前章节每个引用的语义支持关系，并核对 .bib 中的作者、题名、venue、年份、页码、DOI/URL 和条目类型；发现错误时，以论文原文、出版社页面、DOI 或权威索引为依据修正完整 BibTeX，并在报告中记录。" : ""}`;
    }
    return `## Citations and BibTeX
Add no source or cite key. You may move a citation to the correct semantic position, consolidate duplication, or remove a source that demonstrably does not support its sentence; report every removal. A count target never authorizes invented or unverified sources. If the existing authentic library cannot meet it, state that limitation in the report. Every retained key must exist in the complete .bib.
${deepAudit ? "Audit the semantic support of every citation in the current section and verify author names, title, venue, year, pages, DOI/URL, and entry type in .bib. Correct the complete BibTeX against the original paper, publisher page, DOI, or authoritative index, and report every correction." : ""}`;
  }
  if (language === "zh") {
    return `## 引用与 BibTeX
先逐项核查当前章节每个引用是否真正支持所在句子，并核对 .bib 中的作者、题名、venue、年份、页码、DOI/URL 和条目类型。发现错误时，以论文原文、出版社页面、DOI 或权威索引为依据修正完整 BibTeX。
只有存在真实论证缺口时才联网补充文献。${deepAudit ? "原则上优先检索执行日前两年内、与当前论点直接相关的顶会或顶刊论文；较早文献只用于不可替代的奠基定义或经典方法。" : "优先使用与当前论点直接相关的高质量原始论文。"}每篇新增文献必须核验原文和元数据、追加准确且不重复的 BibTeX，并在报告中说明支持的句子、加入理由与来源。不得虚构作者、标题、venue、年份、DOI 或 key。`;
  }
  return `## Citations and BibTeX
First audit whether every current citation genuinely supports its sentence, and verify author names, title, venue, year, pages, DOI/URL, and entry type in .bib. Correct the complete BibTeX against the original paper, publisher page, DOI, or authoritative index.
Search the web only for a genuine argumentative gap. ${deepAudit ? "As a rule, prioritize directly relevant top-conference or top-journal papers published within the two years preceding execution; use older work only for irreplaceable foundations or canonical methods." : "Prioritize high-quality primary papers directly relevant to the claim."} Verify the full text and metadata of every addition, append accurate non-duplicate BibTeX, and report the supported sentence, reason, and source. Never invent an author, title, venue, year, DOI, or key.`;
}

function lengthDirective(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (preferences.sectionLengthMode === "none") {
    return language === "zh"
      ? "- 默认不设置章节、段落或句子的篇幅建议；根据论证、证据和可读性决定自然长度。"
      : "- No section-, paragraph-, or sentence-length guidance is configured by default; let argument, evidence, and readability determine the natural length.";
  }

  const guidance =
    preferences.sectionLengthMode === "preserve"
      ? language === "zh"
        ? "- 可将原稿当前长度作为轻量参考，但允许为逻辑、证据和表达质量自然增减。"
        : "- Use the manuscript's current length only as a light reference, with natural expansion or contraction for logic, evidence, and prose quality."
      : language === "zh"
        ? `- 当前精修范围可参考 ${preferences.sectionMinWords}–${preferences.sectionMaxWords} 个英文单词。`
        : `- The complete refinement scope may use ${preferences.sectionMinWords}–${preferences.sectionMaxWords} English words as a reference.`;

  return [
    guidance,
    language === "zh"
      ? `- 普通段落可参考 ${preferences.paragraphMinWords}–${preferences.paragraphMaxWords} 个英文单词，普通句子可参考 ${preferences.sentenceMinWords}–${preferences.sentenceMaxWords} 个英文单词。`
      : `- Ordinary paragraphs may use ${preferences.paragraphMinWords}–${preferences.paragraphMaxWords} English words and ordinary sentences ${preferences.sentenceMinWords}–${preferences.sentenceMaxWords} words as references.`,
    language === "zh"
      ? "- 以上均为可选建议，不是上限、下限或验收标准；根据论文内容选择接受、调整或忽略，不得为贴合数字损害定义、证据或行文。"
      : "- Every number above is optional guidance, not a cap, minimum, or acceptance criterion. Accept, adjust, or ignore it according to the paper; never damage definitions, evidence, or prose merely to match a number.",
  ].join("\n");
}

function expressionDirective(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const colon = preferences.allowColon
    ? language === "zh"
      ? "- 冒号只在确有必要引出精确定义、受控列举或直接解释时使用，并保持稀少；“允许”不是使用要求，禁止机械的“标签：说明”句式。"
      : "- Use a colon only when indispensable for an exact definition, controlled list, or direct explanation, and keep it rare. Permission is not a usage target; avoid mechanical label–description prose."
    : language === "zh"
      ? "- 改写后的正文和标题不使用冒号；TeX 命令、路径、URL、BibTeX 和原样代码不受此限制。"
      : "- Use no colon in revised prose or headings; TeX commands, paths, URLs, BibTeX, and preserved code are exempt.";

  let firstPerson: string;
  if (preferences.sectionId === "introduction") {
    if (preferences.introductionContributionStartsWithWe) {
      firstPerson =
        language === "zh"
          ? `- 只有 P5 的 ${preferences.introductionContributionCount} 条贡献句可以使用第一人称复数，且每句必须以 We 开头；Introduction 其他句子不得使用 we、our 或 us。`
          : `- Only the ${preferences.introductionContributionCount} P5 contribution sentences may use first-person plural, and each must begin with We. No other Introduction sentence may use we, our, or us.`;
    } else {
      firstPerson =
        language === "zh"
          ? "- Introduction 全节不使用 we、our 或 us，包括贡献句；使用准确的无生命主语描述本文贡献。"
          : "- Use no we, our, or us anywhere in Introduction, including contribution sentences; describe contributions with precise inanimate subjects.";
    }
  } else if (preferences.sectionId === "abstract") {
    firstPerson =
      language === "zh"
        ? "- Abstract 仅在 Bridge 需要自然引出本文工作时允许一次 we；不得重复使用 we，也不使用 our 或 us。"
        : "- Abstract may use we once only when the Bridge naturally introduces the present work; do not repeat we or use our/us.";
  } else if (
    preferences.sectionId === "related-work" ||
    preferences.sectionId === "conclusion"
  ) {
    firstPerson =
      language === "zh"
        ? "- 当前章节不使用 we、our 或 us；使用准确的研究对象、机制或无生命主语。"
        : "- Use no we, our, or us in this section; use the precise research object, mechanism, or an inanimate subject.";
  } else if (preferences.allowWe) {
    firstPerson =
      language === "zh"
        ? "- 允许但不得滥用 we / our：只用于作者真实执行的定义、设计或实验动作；优先使用准确的无生命主语，不得用第一人称强化 claim，也不得连续多句以 We 开头。"
        : "- We / our is permitted but must not be overused: reserve it for definitions, designs, or experimental actions genuinely performed by the authors. Prefer precise inanimate subjects, never use first person to strengthen a claim, and do not begin consecutive sentences with We.";
  } else {
    firstPerson =
      language === "zh"
        ? "- 当前章节不使用 we、our 或 us；改用准确的无生命主语、被定义对象或实验设置。"
        : "- Use no we, our, or us; use a precise inanimate subject, defined object, or experimental setting.";
  }

  return [
    colon,
    firstPerson,
    language === "zh"
      ? "- 优先使用一般现在时、主动语态和清楚主语；仅在描述已完成的实验操作或历史研究行为时使用过去时。"
      : "- Prefer present tense, active voice, and explicit subjects; use past tense only for completed experimental procedures or historical research actions.",
    language === "zh"
      ? "- 避免重复句首、机械平行句、空洞过渡、名词堆叠、模糊 this/it/which 指代和宣传性形容词。"
      : "- Avoid repeated sentence openings, mechanical parallelism, empty transitions, noun stacks, vague this/it/which references, and promotional adjectives.",
  ].join("\n");
}

function abstractContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  return language === "zh"
    ? `- Abstract 必须为一个连续英文段落，不含引用、公式、脚注、编号、项目符号或换行。
- 内部顺序严格为 Background → Bridge → Method → Results → Implication，但不得显示这些标签。
- Background：1–2 句，句长可参考 16–24 词，具体说明任务、场景和今天仍存在的限制。
- Bridge：恰好 1 句，句长可参考 12–18 词，自然引入方法全称与既定品牌缩写，不机械套用固定句式。
- Method：3–4 句，句长可参考 16–24 词，从核心思想到必要机制展开；不堆砌正文中才需要的模块名、公式名或专有名词。
- Results：2–3 句，句长可参考 14–22 词；整段保留 ${preferences.abstractResultNumbersMin}–${preferences.abstractResultNumbersMax} 个最能支撑核心 claim 的数字，不逐项罗列表格。
- Implication：恰好 1 句，句长可参考 12–18 词，只陈述证据支持的意义和适用范围。
- 不鼓励使用本文方法之外的缩写。确需多次出现的术语必须先给全称；数据集等公认名称可按领域惯例处理。
- Abstract 后单列 Keywords：建议使用 ${preferences.abstractKeywordCountMin}–${preferences.abstractKeywordCountMax} 个高信息量英文关键词，每个关键词可参考 ${preferences.abstractKeywordWordsMin}–${preferences.abstractKeywordWordsMax} 个词。关键词应覆盖任务、问题或机制且彼此不近义重复；避免 Method、Model、Framework 等脱离语境的泛化词，也不得引入正文未建立的术语。
- 上述词数均为可选的可读性建议；根据内容选择接受、调整或忽略，不得为贴合数字牺牲准确性或自然表达。
- 摘要不使用任何引用；不得因界面未提供引用选项而自行补充文献。`
    : `- The Abstract is one continuous English paragraph with no citations, equations, footnotes, numbering, bullets, or line breaks.
- Follow Background → Bridge → Method → Results → Implication internally without exposing those labels.
- Background: one or two sentences, using 16–24 words as an optional readability reference, stating the task, setting, and limitation that still exists today.
- Bridge: exactly one sentence, optionally using 12–18 words as a reference, that naturally introduces the full method name and established brand acronym without forcing a stock phrase.
- Method: three or four sentences, optionally using 16–24 words as a reference, moving from the core idea to necessary mechanisms without body-level module names, equation names, or specialist terms that burden first-time readers.
- Results: two or three sentences, optionally using 14–22 words as a reference; retain ${preferences.abstractResultNumbersMin}–${preferences.abstractResultNumbersMax} values across the paragraph, selecting only those that directly support primary claims rather than enumerating a table.
- Implication: exactly one sentence, optionally using 12–18 words as a reference, stating only evidence-supported significance and scope.
- Discourage acronyms other than the method acronym. Give the full form before any repeatedly necessary abbreviation; conventional dataset names may follow field practice.
- Add a Keywords line after the Abstract, preferably with ${preferences.abstractKeywordCountMin}–${preferences.abstractKeywordCountMax} high-information English keywords using ${preferences.abstractKeywordWordsMin}–${preferences.abstractKeywordWordsMax} words each as a reference. Cover the task, problem, or mechanism without near-duplicates; avoid context-free labels such as Method, Model, or Framework and introduce no term absent from the manuscript.
- Every word-count value above is optional readability guidance. Accept, adjust, or ignore it according to the content; never sacrifice accuracy or natural prose merely to match a number.
- Use no citation in the Abstract; the absence of a citation control does not authorize adding one.`;
}

function introductionContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const contributionMinWords = Math.max(
    1,
    preferences.introductionContributionWords - 2,
  );
  const contributionMaxWords =
    preferences.introductionContributionWords + 2;
  const contributionOpeningZh =
    preferences.introductionContributionStartsWithWe
      ? "每句必须以 `We` 开头；只有这些贡献句可以出现第一人称复数"
      : "贡献句不使用 we、our 或 us，并以准确的无生命主语开头";
  const contributionOpeningEn =
    preferences.introductionContributionStartsWithWe
      ? "Each sentence must begin with `We`; only these contribution sentences may use first-person plural"
      : "Use no we, our, or us in the contribution sentences, and begin them with precise inanimate subjects";
  const navigationZh = preferences.introductionIncludeNavigationSentence
    ? "- 在 P5 后增加一句简短的纯章节导航句，只说明论文组织，不重复章节内容，也不使用引用；该句不是独立段落。"
    : "- 不写纯章节导航句，以贡献段自然结束 Introduction。";
  const navigationEn = preferences.introductionIncludeNavigationSentence
    ? "- After P5, add one concise pure paper-roadmap sentence that states organization only, repeats no section content, and uses no citation. It is not a separate paragraph."
    : "- Omit a pure paper-roadmap sentence and close Introduction naturally with the contribution paragraph.";
  return language === "zh"
    ? `- 使用五个核心连续普通段落，不增加内部小标题。
- P1：直接进入任务、场景和现实约束，明确说明该问题在今天仍然存在。
- P2：综合最相关研究路线及共同假设，形成当前缺口；不得逐篇罗列。
- P3：最小充分界定问题，并明确今天仍未解决、且真正决定设计的 2–3 个挑战；不在这里提前介绍本文方案。
- P4：直接回答 P3，介绍核心思想、总体机制和设计直觉；不重复缺口或挑战，不展开公式、实现步骤或实验数字。
- P5：恰好 ${preferences.introductionContributionCount} 条贡献句。每条只用一句，可参考约 ${preferences.introductionContributionWords} 词（建议区间 ${contributionMinWords}–${contributionMaxWords} 词，可按内容调整）；${contributionOpeningZh}。每条贡献分别对应 Method 中的真实机制与 Experiments/Results 中的现有证据。
${navigationZh}
- 整节目标引用 ${preferences.introductionCitationMin}–${preferences.introductionCitationMax} 篇去重后的真实论文；每句最多承载 ${preferences.introductionMaxCitationsPerSentence} 篇。凡陈述既有研究、领域事实、已有能力或他人结论，必须就近使用能够直接支持该句的引用；只有本文自己的 claim、作者综合判断和贡献句可以不引用，但这些内容必须由 Method 或 Results 建立，且不得把外部观点伪装成作者总结。
- 默认允许联网补充真实文献，原则上优先执行日前两年内直接相关的顶会或顶刊论文；不可替代的奠基工作可以更早。新增文献必须核验原文和元数据，并写入本轮交付的完整 .bib。
- 不得把贡献写成模块清单，不得用 best、novel、significant 等宣传词代替可核验内容。`
    : `- Use five core consecutive ordinary paragraphs with no internal heading.
- P1: enter the task, setting, and real-world constraint directly and make clear that the problem still exists today.
- P2: synthesize the closest research lines and shared assumptions into the current gap rather than listing papers.
- P3: define the problem minimally and state two or three challenges that remain unresolved today and genuinely determine the design; do not introduce this paper's solution here.
- P4: answer P3 directly with the core idea, overall mechanism, and design intuition. Do not repeat the gap or challenges, and do not expand equations, implementation steps, or result values.
- P5: give exactly ${preferences.introductionContributionCount} contribution sentences. Each uses one sentence and may use approximately ${preferences.introductionContributionWords} words (${contributionMinWords}–${contributionMaxWords} words as an optional reference, adjustable to the content). ${contributionOpeningEn}. Align every contribution with a real Method mechanism and existing Experiments/Results evidence.
${navigationEn}
- Cite ${preferences.introductionCitationMin}–${preferences.introductionCitationMax} distinct authentic papers across the section, with at most ${preferences.introductionMaxCitationsPerSentence} papers attached to one sentence. Every statement about prior research, field facts, existing capabilities, or others' conclusions needs a nearby source that directly supports it. Only the paper's own claims, author synthesis, and contribution sentences may remain uncited, and these must be established by Method or Results; never disguise an external position as author synthesis.
- Verified web additions are enabled by default. As a rule, prioritize directly relevant top-conference or top-journal papers from the two years preceding execution; older work is acceptable for irreplaceable foundations. Verify full text and metadata, and add every new source to the complete delivered .bib.
- Do not turn contributions into a component inventory or replace verifiable content with promotional terms such as best, novel, or significant.`;
}

function relatedWorkContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const paragraphProtocol =
    preferences.relatedParagraphsPerSubsection === 1
      ? language === "zh"
        ? "每个 subsection 恰好一个普通段落；在同一段中完成研究路线、共同假设、能力边界与综合判断。"
        : "Use exactly one ordinary paragraph per subsection, integrating the research line, shared assumptions, capability boundary, and synthesis."
      : language === "zh"
        ? "每个 subsection 恰好两个普通段落：第一段建立研究路线与代表性能力，第二段综合共同假设、关键权衡和仍存在的边界；不得把两段都写成论文罗列。"
        : "Use exactly two ordinary paragraphs per subsection: the first establishes the research line and representative capabilities; the second synthesizes shared assumptions, key trade-offs, and remaining boundaries. Neither paragraph may become a paper list.";
  return language === "zh"
    ? `- 恰好设置三个 subsection；每个标题为 3–7 个英文单词，并命名真实研究主题。
- ${paragraphProtocol}
- 整节使用 ${preferences.relatedCitationMin}–${preferences.relatedCitationMax} 篇去重后的真实论文；每句最多引用 ${preferences.relatedMaxCitationsPerSentence} 篇。原则上优先执行日前两年内直接相关的顶会、顶刊论文，同时保留不可替代的奠基文献。
- 按范式、假设、能力边界或关键权衡综合组织；禁止逐篇流水账、citation dumping，以及一篇论文一句话的机械排列。
- 每个 subsection 最后一句建议控制在 18 个英文单词以内，承担综合总结；必要时可按内容调整，可自然收束到研究定位，也可只总结该路线。
- subsection 最后一句不得出现本文方法名、论文品牌缩写、we、our 或 us。
- 每个引用必须存在于完整 BibTeX 文献库并在语义上支持当前句子；引用数量不允许牺牲相关性。逐项核查当前引用及其 BibTeX 元数据；联网新增的每篇文献都必须核验并写入完整 .bib。`
    : `- Use exactly three subsections. Each title contains three to seven English words and names a genuine research theme.
- ${paragraphProtocol}
- Cite ${preferences.relatedCitationMin}–${preferences.relatedCitationMax} distinct authentic papers across the section, with at most ${preferences.relatedMaxCitationsPerSentence} papers in one sentence. As a rule, prioritize directly relevant top-conference and top-journal papers from the two years preceding execution while retaining irreplaceable foundations.
- Organize by paradigm, assumption, capability boundary, or key trade-off. Do not narrate papers serially, dump citations, or assign one sentence mechanically to each paper.
- End every subsection with a synthesis sentence that preferably stays within 18 English words but may adjust to the content. It may close toward the research position or simply summarize the line.
- The subsection-final sentence must not name the method, use its brand acronym, or use we / our / us.
- Every citation must exist in the complete BibTeX library and semantically support its sentence; a count target never overrides relevance. Audit every current citation and its BibTeX metadata, and verify and append every web addition to the complete .bib.`;
}

function methodContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const overviewZh =
    preferences.methodOverviewMode === "preserve"
      ? "- 保持当前是否单列 Method Overview 及其标题层级，不新增、删除或转换 Overview。"
      : preferences.methodOverviewMode === "standalone"
        ? `- 设置独立 Method Overview：使用 ${preferences.methodOverviewParagraphs} 个普通段落，总词数可参考 ${preferences.methodOverviewMaxWords} 个英文单词并按内容调整。只建立输入、主要阶段、信息流与输出的总体心智地图，不复述框架图、不展开局部计算。`
        : "- 不设置独立 Method Overview；在进入第一个核心机制前，用最短必要过渡自然引出总体框架，并同步修复标题、label/ref 和相邻衔接。";
  const overviewEn =
    preferences.methodOverviewMode === "preserve"
      ? "- Preserve whether the manuscript currently has a standalone Method Overview and preserve its heading level; do not add, remove, or convert it."
      : preferences.methodOverviewMode === "standalone"
        ? `- Use a standalone Method Overview with ${preferences.methodOverviewParagraphs} ordinary paragraphs and ${preferences.methodOverviewMaxWords} English words as an optional total-length reference, adjustable to the content. Establish only the input, major stages, information flow, and output; do not narrate the framework figure or expand local computation.`
        : "- Use no standalone Method Overview. Introduce the overall framework through the shortest necessary transition before the first core mechanism, and synchronize headings, label/ref, and adjacent transitions.";
  const pseudocodeZh = preferences.methodIncludePseudocode
    ? `- 加入一份真正有助于理解控制流、状态更新或关键算法步骤的精简伪代码，正文不超过 ${preferences.methodPseudocodeMaxLines} 行；不把公式逐行改写成算法，也不加入实现细节。`
    : "- 不新增伪代码；若原稿已有必要 algorithm 环境，仅做语言和一致性精修，不因关闭该选项而删除现有证据。";
  const pseudocodeEn = preferences.methodIncludePseudocode
    ? `- Include concise pseudocode only when it materially clarifies control flow, state updates, or key algorithmic steps, with at most ${preferences.methodPseudocodeMaxLines} body lines. Do not rewrite equations line by line or add implementation details.`
    : "- Add no pseudocode. If the manuscript already contains a necessary algorithm environment, refine its wording and consistency rather than deleting existing evidence because this option is off.";
  const complexityZh = preferences.methodIncludeComplexityAnalysis
    ? "- 增加一段精简时间复杂度分析：定义规模变量，给出可由现有步骤直接推出的主导项和 Big-O；如信息不足，明确无法可靠推导，不猜测。"
    : "- 不新增时间复杂度分析；保留原稿已有且证据充分的复杂度结论。";
  const complexityEn = preferences.methodIncludeComplexityAnalysis
    ? "- Add one concise time-complexity paragraph: define size variables and state the dominant term and Big-O only when directly derivable from existing steps. If evidence is insufficient, state that reliable derivation is impossible rather than guessing."
    : "- Add no time-complexity analysis; preserve any existing well-supported complexity result.";
  return language === "zh"
    ? `- Method 不得写成论文说明书、代码文档或组件清单。围绕“为什么问题困难、为什么需要当前机制、机制如何回应问题、边界是什么”融合讲故事；不要求每句话机械解释 why。
- 只保留论文真实定义的机制、公式、目标、训练与推理流程，不为叙事完整发明模块、符号或依赖。
- 保留全部核心机制、必要公式、接口与训练/推理差异；只合并真实重复，不因篇幅或结构整齐而压缩。
- 每个核心机制自然融合设计动机、计算构造、上下游接口、作用和适用边界，而不是先罗列名称再逐项解释。
${overviewZh}
${pseudocodeZh}
${complexityZh}
- 公式前解释为什么需要该构造；公式后解释变量、作用与接口，不逐符号朗读公式。
- 只在真实科学单元需要时保留标题。Question、Observation、Design Purpose、Motivation 等段落功能默认用主题句表达，不升级为标题。`
    : `- Method must not read like a paper manual, code document, or component inventory. Integrate why the problem is difficult, why the mechanism is needed, how it addresses the problem, and where it applies without forcing every sentence to state a why.
- Retain only mechanisms, equations, objectives, training, and inference procedures actually defined by the paper. Never invent a module, symbol, or dependency to complete the narrative.
- Preserve every core mechanism, necessary equation, interface, and training/inference distinction. Merge only genuine repetition and never compress content for length or structural symmetry.
- Integrate motivation, computational construction, upstream/downstream interfaces, function, and scope for each core mechanism rather than listing names and explaining them serially.
${overviewEn}
${pseudocodeEn}
${complexityEn}
- Before an equation, explain why the construction is needed; after it, explain variables, function, and interfaces rather than reading symbols aloud.
- Keep a heading only for a genuine scientific unit. Express functions such as Question, Observation, Design Purpose, and Motivation as topic sentences by default.`;
}

function visualEvidenceProtocol(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const paragraphProtocol =
    preferences.visualParagraphsPerItem === 1
      ? language === "zh"
        ? `- 每张图或表通常对应一个主要正文段落，建议 ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} 词。该段融合研究问题、最小必要证据、${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} 个决定性数字、克制解释与适用边界。`
        : `- Assign each figure or table one primary prose paragraph in most cases, using ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} words only as an optional reference. Integrate the research question, minimum necessary evidence, ${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} decisive values, restrained interpretation, and applicable boundary.`
      : language === "zh"
        ? `- 重要图表可用两个主要正文段落，每段建议 ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} 词。第一段建立问题、比较条件与主要证据模式，并选择 ${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} 个决定性数字；第二段解释意义、机制/权衡/异常与边界，原则上不重复第一段数字。`
        : `- Important visuals may use two primary prose paragraphs, each using ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} words only as an optional reference. Paragraph 1 establishes the question, comparison conditions, and primary evidence pattern with ${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} decisive values. Paragraph 2 explains implications, mechanism/trade-off/anomaly, and scope, normally without repeating Paragraph 1 values.`;
  return language === "zh"
    ? `${paragraphProtocol}
- 按证据重要性调节篇幅：Main Results、决定性消融或直接支撑主要 claim 的图表可接近区间上限；常规诊断、补充对比和辅助证据应更短。不得平均分配字数。
- 图表对应段落的词数区间同样只是建议，可根据每项证据的重要性接受、调整或忽略。
- 图表本体负责完整数值、视觉比较和结构关系；caption 负责对象、条件、指标与图例的自足说明；正文负责提出判断、选择最小证据并解释意义。三者各司其职，不机械复述 caption、坐标轴、表格单元格或全部数字。
- “每张图或表对应段落”指主要解释单元，不要求每次提及 label 都新建段落。只有多张图表回答同一个不可分割的问题时才允许联合分析，并在报告中说明。
- 每个正文数字都必须可追溯到对应图表或已核验统计；不得通过省略负面结果制造更强叙事，也不得把相关性改写为因果。
- 若 0 个数字已足以表达稳定趋势，可以不写数字；上限不是配额。`
    : `${paragraphProtocol}
- Allocate prose by evidential importance: Main Results, decisive ablations, and visuals directly supporting primary claims may approach the upper end; routine diagnostics, supplementary comparisons, and supporting evidence should be shorter. Do not distribute words evenly.
- The visual-paragraph range is also optional guidance; accept, adjust, or ignore it according to each item’s evidential importance.
- The visual carries complete values, visual comparisons, and structural relations; the caption supplies self-contained objects, conditions, metrics, and legend; prose makes the claim, selects minimum evidence, and explains meaning. Keep these roles distinct and do not restate captions, axes, cells, or all values mechanically.
- “Paragraphs per figure/table” means the primary interpretive unit, not a new paragraph for every label mention. Joint analysis is allowed only when multiple visuals answer one inseparable question, and the report must explain that choice.
- Every prose value must trace to the corresponding visual or verified statistic. Do not create a stronger story by omitting unfavorable evidence or rewrite correlation as causation.
- If a stable pattern is clear without a number, using zero is acceptable; the maximum is not a quota.`;
}

function visualOperationProtocol(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const reorder = preferences.allowVisualReorder
    ? language === "zh"
      ? "- 允许调整图表顺序，但只在新的顺序能更清楚地对应研究问题与证据链时执行；保持图表内容、label 和首次引用一致，并同步所有 ref、caption 与过渡。"
      : "- Visual reordering is allowed only when the new sequence aligns research questions and evidence more clearly. Preserve visual content and labels, and synchronize every first mention, ref, caption, and transition."
    : language === "zh"
      ? "- 不调整任何图表的相对顺序；只修复正文引用和过渡。"
      : "- Preserve the relative order of every figure and table; repair only prose references and transitions.";
  const deletion = preferences.allowVisualDeletion
    ? language === "zh"
      ? "- 允许删除图表不代表应当删除。只有图表与其他证据完全重复、没有独立信息且不支撑任何主要或次要 claim 时才可删除；核心证据、不利结果和唯一消融证据不得删除。逐项报告删除理由、受影响引用和证据保留位置。"
      : "- Permission to delete a visual is not a request to do so. Delete only when it fully duplicates other evidence, carries no unique information, and supports no primary or secondary claim. Never delete core evidence, unfavorable results, or unique ablation evidence. Report the reason, affected references, and where the evidence remains."
    : language === "zh"
      ? "- 不删除任何图表、caption 或其唯一证据；即使发现重复，也只在报告中提出建议。"
      : "- Delete no visual, caption, or unique evidence. If duplication is found, report it as a recommendation only.";
  const appendix = preferences.allowVisualAppendixMove
    ? language === "zh"
      ? "- 允许将图表移入附录，但仅限服务次要诊断、扩展分析或实现细节的图表；正文必须继续完整支撑所有主要 claim，并保留简洁文字总结和正确交叉引用。不得移动 Main Results、核心比较或关键消融图表。逐项报告移动理由和新位置。"
      : "- Moving a visual to the appendix is allowed only for secondary diagnostics, extended analyses, or implementation detail. The main text must still fully support every primary claim with a concise summary and correct cross-reference. Never move Main Results, core comparisons, or decisive ablations. Report each reason and destination."
    : language === "zh"
      ? "- 不将任何图表移入附录；保持当前正文/附录归属。"
      : "- Move no visual to the appendix; preserve its current main-text/appendix placement.";
  return [reorder, deletion, appendix].join("\n");
}

function experimentsContract(language: Language) {
  return language === "zh"
    ? `- 完整保留现有实验设置、比较协议、实验量与不利结果；只合并真实重复。
- Datasets and Experimental Setup 按 Datasets → Evaluation Metrics → Experimental Configuration → Baselines 覆盖四个功能单元。它们不必机械成为四个标题；只在内容构成独立科学单元时增加层级。Evaluation Metrics 说明定义、方向、尺度、聚合方式及其与任务目标的关系。
- 数据划分、指标方向、随机种子、运行次数、服务器、软件版本、超参数和 baseline 公平性只能来自现有证据。
- 不把 Experiments 写成配置清单：解释每项关键设置服务于哪个研究问题、公平性要求或复现需求。
- 图表、caption、正文数字、单位、best/second-best 标记和显著性必须逐项一致。`
    : `- Preserve every existing setting, comparison protocol, experiment, and unfavorable result, merging only genuine repetition.
- Cover Datasets → Evaluation Metrics → Experimental Configuration → Baselines in that order within Datasets and Experimental Setup. They are content functions rather than mandatory headings; add hierarchy only for a substantive scientific unit. Evaluation Metrics defines direction, scale, aggregation, and relation to the task objective.
- Dataset splits, metric directions, seeds, run counts, servers, software versions, hyperparameters, and baseline fairness may come only from existing evidence.
- Do not turn Experiments into a configuration inventory: explain which research question, fairness requirement, or reproducibility need each important choice serves.
- Keep visuals, captions, prose values, units, best/second-best marks, and significance statements exactly consistent.`;
}

function resultsContract(language: Language) {
  return language === "zh"
    ? `- 按真实研究问题组织结果，而不是按图表出现顺序流水叙述。每个证据单元遵循“问题或比较目的 → 最小必要证据 → 克制解释 → 适用边界”。
- Main Results 优先回答主要 claim；后续只按现有证据安排 Ablation Studies、机制/效率/参数分析、Case Studies and Qualitative Analysis、稳健性、敏感性、泛化或错误分析。
- 不绑定固定小节序号，不为结构对称发明缺失实验。
- 明确区分直接观察、合理推断和未经验证的机制解释；不得把相关性写成因果。
- 所有 best、second-best、提升比例、均值/标准差和显著性表述必须与图表完全一致。`
    : `- Organize Results by genuine research questions rather than visual order. Each evidence unit follows question/comparison purpose → minimum necessary evidence → restrained interpretation → applicable boundary.
- Let Main Results answer primary claims first. Include Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis only when supported.
- Do not bind analyses to fixed subsection positions or invent an experiment for structural symmetry.
- Distinguish direct observation, reasonable inference, and untested mechanistic explanation; never rewrite correlation as causation.
- Every best/second-best mark, gain, mean/standard deviation, and significance statement must match the visual evidence exactly.`;
}

function discussionContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  return language === "zh"
    ? `- Discussion 必须提供综合分析，不得复述 Results、重新讲解实验流程，或逐项解释图表。
- 由模型根据证据选择 3–5 个主题小节，覆盖最值得讨论的机制、权衡、适用范围、异常与局限；不为数量对称拆分同一论点。
- 不引用 Experiments/Results 中的表格或图片；整节最多保留 ${preferences.discussionMaxSpecificNumbers} 个具体结果数字，不写任何具体数字也可以。
- 明确区分直接证据、合理推断和尚未验证的机制解释。
- 解释为什么观察可能成立、在哪些条件下成立、对研究问题意味着什么，以及不能推广到哪里。
- 不引入 Method/Experiments 中不存在的新组件、新实验或新结论。
- 外部引用只服务于机制解释、范围比较或外部有效性，不用文献掩盖本文证据不足。
${limitationDirective(preferences, "zh")}`
    : `- Discussion must provide synthesis rather than repeat Results, re-explain experimental procedures, or narrate visuals.
- Let the model select three to five evidence-driven topic subsections covering the most important mechanisms, trade-offs, scope, anomalies, and limitations; do not split one argument merely for symmetry.
- Do not cite tables or figures from Experiments/Results. Retain at most ${preferences.discussionMaxSpecificNumbers} specific result values across the section; using none is acceptable.
- Distinguish direct evidence, reasonable inference, and mechanisms that remain untested.
- Explain why an observation may hold, under which conditions, what it means for the research problem, and where it cannot generalize.
- Introduce no component, experiment, or conclusion absent from Method/Experiments.
- Use external citations only for mechanistic interpretation, scope comparison, or external validity—not to conceal gaps in the paper's own evidence.
${limitationDirective(preferences, "en")}`;
}

function conclusionContract(language: Language) {
  return language === "zh"
    ? `- 使用恰好两个连续普通段落，不设置内部标题。
- 第一段收束科学问题、核心思想、计算实现和主要证据。
- 第二段说明意义、适用边界和真正由证据支持的未来方向。
- 不使用引用，不引入新 claim、数字、模块、实验或正文未建立的术语。
- 不复制 Abstract 句子或贡献列表，不使用宣传性收尾，也不把限制重复写成一份清单。`
    : `- Use exactly two consecutive ordinary paragraphs with no internal heading.
- Paragraph 1 closes the scientific problem, core idea, computational realization, and primary evidence.
- Paragraph 2 states implications, applicable boundaries, and future directions genuinely supported by evidence.
- Use no citations and introduce no new claim, value, component, experiment, or term absent from the manuscript.
- Do not copy Abstract sentences or the contribution list, use promotional closure, or repeat limitations as an inventory.`;
}

function organizationDirective(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (preferences.sectionId === "experiments-results") {
    if (preferences.experimentalFocus === "both") {
      return language === "zh"
        ? "联合精修实验设置与结果：先完整建立可复现的实验条件，再按研究问题组织结果证据与解释。实验事实、结果观察和推断必须分别承担清楚功能，不得把配置写进结果，也不得把解释伪装成设置。"
        : "Refine experimental setup and Results together: first establish complete reproducible conditions, then organize result evidence and interpretation by research question. Keep setup facts, result observations, and inferences functionally distinct.";
    }
    if (preferences.experimentalFocus === "setup") {
      return language === "zh"
        ? "仅精修实验设置部分；Results 正文、图表、caption、顺序和交叉引用全部保持不变。"
        : "Refine experimental setup only; keep Results prose, visuals, captions, ordering, and cross-references unchanged.";
    }
    return language === "zh"
      ? "仅精修结果部分；Datasets、Evaluation Metrics、Experimental Configuration、Baselines 和其他实验设置保持不变。"
      : "Refine Results only; keep Datasets, Evaluation Metrics, Experimental Configuration, Baselines, and all other setup unchanged.";
  }
  if (
    preferences.sectionId === "discussion" &&
    preferences.discussionScope ===
      "merged-experiments-results-discussion"
  ) {
    return language === "zh"
      ? "将 Experiments、Results 与 Discussion 合并为一个顶层章节：先建立完整设置，再按研究问题组织证据，最后开展综合解释。三者可以共享章节边界，但不得混淆段落功能。"
      : "Merge Experiments, Results, and Discussion into one top-level section: establish complete setup first, organize evidence by research question, then provide synthesis. They may share a section boundary but must retain distinct paragraph functions.";
  }
  return language === "zh"
    ? "仅精修 Discussion，保持 Experiments 与 Results 的正文、图表和章节边界不变。"
    : "Refine Discussion only, preserving the prose, visuals, and section boundaries of Experiments and Results.";
}

function sectionContract(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  if (preferences.sectionId === "abstract") {
    return abstractContract(preferences, language);
  }
  if (preferences.sectionId === "introduction") {
    return introductionContract(preferences, language);
  }
  if (preferences.sectionId === "related-work") {
    return relatedWorkContract(preferences, language);
  }
  if (preferences.sectionId === "method") {
    return methodContract(preferences, language);
  }
  if (preferences.sectionId === "conclusion") {
    return conclusionContract(language);
  }

  const parts = scopeParts(preferences);
  const blocks = [organizationDirective(preferences, language)];
  if (parts.experiments) {
    blocks.push(
      language === "zh"
        ? `### Experiments 合同\n${experimentsContract("zh")}`
        : `### Experiments Contract\n${experimentsContract("en")}`,
    );
  }
  if (parts.results) {
    blocks.push(
      language === "zh"
        ? `### Results 合同\n${resultsContract("zh")}`
        : `### Results Contract\n${resultsContract("en")}`,
    );
  }
  if (parts.results) {
    blocks.push(
      language === "zh"
        ? `### 图表—正文证据协议\n${visualEvidenceProtocol(preferences, "zh")}`
        : `### Visual-to-Prose Evidence Protocol\n${visualEvidenceProtocol(preferences, "en")}`,
    );
    blocks.push(
      language === "zh"
        ? `### 图表结构操作边界\n${visualOperationProtocol(preferences, "zh")}`
        : `### Visual-Structure Operation Boundaries\n${visualOperationProtocol(preferences, "en")}`,
    );
  }
  if (parts.discussion) {
    blocks.push(
      language === "zh"
        ? `### Discussion 合同\n${discussionContract(preferences, "zh")}`
        : `### Discussion Contract\n${discussionContract(preferences, "en")}`,
    );
  }
  return blocks.join("\n\n");
}

function specializedConfiguration(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const lines: string[] = [];
  if (preferences.sectionId === "abstract") {
    lines.push(
      language === "zh"
        ? `- Abstract Results 数字：整段 ${preferences.abstractResultNumbersMin}–${preferences.abstractResultNumbersMax} 个\n- Keywords 建议：${preferences.abstractKeywordCountMin}–${preferences.abstractKeywordCountMax} 个，每个可参考 ${preferences.abstractKeywordWordsMin}–${preferences.abstractKeywordWordsMax} 词`
        : `- Result values in Abstract: ${preferences.abstractResultNumbersMin}–${preferences.abstractResultNumbersMax} across the paragraph\n- Suggested Keywords: ${preferences.abstractKeywordCountMin}–${preferences.abstractKeywordCountMax}, optionally using ${preferences.abstractKeywordWordsMin}–${preferences.abstractKeywordWordsMax} words each`,
    );
  }
  if (preferences.sectionId === "introduction") {
    lines.push(
      language === "zh"
        ? `- Introduction 引用：${preferences.introductionCitationMin}–${preferences.introductionCitationMax} 篇去重论文；单句最多 ${preferences.introductionMaxCitationsPerSentence} 篇\n- Contributions：${preferences.introductionContributionCount} 条，每条可参考约 ${preferences.introductionContributionWords} 词，${preferences.introductionContributionStartsWithWe ? "以 We 开头" : "不以 We 开头"}\n- 纯章节导航句：${preferences.introductionIncludeNavigationSentence ? "包含" : "不包含"}`
        : `- Introduction citations: ${preferences.introductionCitationMin}–${preferences.introductionCitationMax} distinct papers; at most ${preferences.introductionMaxCitationsPerSentence} per sentence\n- Contributions: ${preferences.introductionContributionCount}, optionally using approximately ${preferences.introductionContributionWords} words each, ${preferences.introductionContributionStartsWithWe ? "beginning with We" : "not beginning with We"}\n- Pure paper-roadmap sentence: ${preferences.introductionIncludeNavigationSentence ? "included" : "omitted"}`,
    );
  }
  if (preferences.sectionId === "related-work") {
    lines.push(
      language === "zh"
        ? `- Related Work：每个 subsection ${preferences.relatedParagraphsPerSubsection} 段；共引用 ${preferences.relatedCitationMin}–${preferences.relatedCitationMax} 篇去重论文；单句最多 ${preferences.relatedMaxCitationsPerSentence} 篇`
        : `- Related Work: ${preferences.relatedParagraphsPerSubsection} paragraph(s) per subsection; ${preferences.relatedCitationMin}–${preferences.relatedCitationMax} distinct papers overall; at most ${preferences.relatedMaxCitationsPerSentence} per sentence`,
    );
  }
  if (preferences.sectionId === "method") {
    const overview =
      preferences.methodOverviewMode === "preserve"
        ? language === "zh"
          ? "保持当前 Overview 结构"
          : "preserve the current Overview structure"
        : preferences.methodOverviewMode === "standalone"
          ? language === "zh"
            ? `独立 Overview，${preferences.methodOverviewParagraphs} 段、建议参考 ${preferences.methodOverviewMaxWords} 词`
            : `standalone Overview, ${preferences.methodOverviewParagraphs} paragraphs with ${preferences.methodOverviewMaxWords} words as an optional reference`
          : language === "zh"
            ? "不单列 Overview"
            : "no standalone Overview";
    lines.push(
      language === "zh"
        ? `- Method：${overview}；伪代码${preferences.methodIncludePseudocode ? `不超过 ${preferences.methodPseudocodeMaxLines} 行` : "不新增"}；时间复杂度分析${preferences.methodIncludeComplexityAnalysis ? "精简加入" : "不新增"}`
        : `- Method: ${overview}; pseudocode ${preferences.methodIncludePseudocode ? `at most ${preferences.methodPseudocodeMaxLines} lines` : "not added"}; time-complexity analysis ${preferences.methodIncludeComplexityAnalysis ? "added concisely" : "not added"}`,
    );
  }
  if (preferences.sectionId === "experiments-results") {
    lines.push(
      language === "zh"
        ? `- 实验与结果范围：${EXPERIMENTAL_FOCUSES[preferences.experimentalFocus].label.zh}`
        : `- Experiments/Results scope: ${EXPERIMENTAL_FOCUSES[preferences.experimentalFocus].label.en}`,
    );
  }
  if (scopeUsesVisualEvidence(preferences)) {
    lines.push(
      language === "zh"
        ? `- 每张图／表：${preferences.visualParagraphsPerItem} 个主要段落，每段可参考 ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} 词，并选择 ${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} 个关键数字`
        : `- Per figure/table: ${preferences.visualParagraphsPerItem} primary paragraph(s), optionally using ${preferences.visualParagraphMinWords}–${preferences.visualParagraphMaxWords} words and selecting ${preferences.keyNumbersPerParagraphMin}–${preferences.keyNumbersPerParagraphMax} key values per paragraph`,
    );
    lines.push(
      language === "zh"
        ? `- 图表操作：顺序${preferences.allowVisualReorder ? "可调整" : "保持"}；删除${preferences.allowVisualDeletion ? "有条件允许" : "禁止"}；移入附录${preferences.allowVisualAppendixMove ? "有条件允许" : "禁止"}`
        : `- Visual operations: ordering ${preferences.allowVisualReorder ? "may change" : "is preserved"}; deletion ${preferences.allowVisualDeletion ? "conditionally allowed" : "forbidden"}; appendix moves ${preferences.allowVisualAppendixMove ? "conditionally allowed" : "forbidden"}`,
    );
  }
  if (scopeIncludesDiscussion(preferences)) {
    lines.push(
      language === "zh"
        ? `- Discussion：具体结果数字最多 ${preferences.discussionMaxSpecificNumbers} 个；局限${preferences.limitationMode === "separate" ? "单列" : "并入最后一个讨论小节"}`
        : `- Discussion: at most ${preferences.discussionMaxSpecificNumbers} specific result values; limitations ${preferences.limitationMode === "separate" ? "remain separate" : "are integrated into the final discussion subsection"}`,
    );
  }
  return lines.join("\n");
}

function buildSectionRefinementPromptContent(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  const scopeLabel = getRefinementScopeLabel(preferences, language);
  const fileStem =
    preferences.sectionId === "experiments-results"
      ? preferences.experimentalFocus === "both"
        ? "experiments-results"
        : preferences.experimentalFocus === "setup"
        ? "experimental-setup"
        : "results"
      : preferences.sectionId === "discussion" &&
          preferences.discussionScope ===
            "merged-experiments-results-discussion"
        ? "experiments-results-discussion"
        : preferences.sectionId;
  const citation = citationDirective(preferences, language);
  const specialized = specializedConfiguration(preferences, language);
  const citationConfig = scopeSupportsCitations(preferences)
    ? language === "zh"
      ? `- 引用策略：${CITATION_MODES[preferences.citationMode].label.zh}`
      : `- Citation policy: ${CITATION_MODES[preferences.citationMode].label.en}`
    : "";
  const weConfig = scopeUsesWeToggle(preferences)
    ? language === "zh"
      ? `- we / our：${preferences.allowWe ? "允许但克制" : "不使用"}`
      : `- we / our: ${preferences.allowWe ? "allowed sparingly" : "not used"}`
    : "";

  if (language === "zh") {
    return `# 精修 ${scopeLabel}

## 你的角色
你是一名熟悉当前论文具体 CS 子领域的资深论文作者、审稿人和 LaTeX 编辑。完整理解论文后，只对配置覆盖的章节执行投稿级精修。每个章节遵守下方独立合同，不把其他章节的惯例机械套用到当前章节。若环境提供论文阅读、PDF 查看、文件写入或 LaTeX 编译工具，直接使用。

## 本轮输入
在同一对话中读取：
- 当前完整 .tex；
- 与其对应的最新编译 PDF；
- 当前完整 .bib；
- 可选：当前范围引用的 figures/ 图片、源图及其他必要附件。

figures/ 不是必需输入。仅当当前范围需要核对图像内容、图表证据或源图时读取；缺少 figures/ 不得阻止文字精修。以 .tex 为术语、公式、引用和结构依据，以 PDF 检查最终版面、图表、公式和上下文。先读全文建立事实底稿，但只修改当前范围。

## 当前配置
- 精修范围：${scopeLabel}
- 改写强度：${REWRITE_DEPTHS[preferences.rewriteDepth].label.zh}
- 冒号：${preferences.allowColon ? "仅在必须时允许" : "不使用"}
${citationConfig}
${weConfig}
${specialized}

## 证据与事实规则
${COMMON_PROMPT_BLOCKS.evidence.zh}

## TeX 与格式保护
${COMMON_PROMPT_BLOCKS.manuscriptProtection.zh}

补充边界：
- 只修改当前范围及合并所必需的标题、label/ref/cite、图表引用与相邻过渡；其他内容保持原样。
- 保持全文事实、claim、术语、缩写、变量、数据集、指标、数字和单位一致；跨章节冲突采用最低风险处理并在报告中定位，不用文字掩盖证据缺口或不利结果。

## PDF 深度阅读
${COMMON_PROMPT_BLOCKS.pdfReview.zh}

## 当前章节的独立精修合同
${sectionContract(preferences, "zh")}

## 改写强度
${REWRITE_DEPTHS[preferences.rewriteDepth].description.zh}
无论强度如何，都要保留真实事实、证据边界、公式语义、引用关系和原稿中准确有力的表达。

## 融合式精修
${COMMON_PROMPT_BLOCKS.cohesiveRevision.zh}

## 句段与篇幅
${lengthDirective(preferences, "zh")}

## 表达约束
${expressionDirective(preferences, "zh")}

${citation}

## 执行方式
1. 内部建立当前范围的事实—claim—证据与交叉引用表，诊断功能重复、证据错位和逻辑断裂，不输出冗长计划；
2. 按独立合同直接精修目标范围；合并章节时仍区分 Experiments、Results 与 Discussion 的段落功能；
3. 仅做必要的标题、label/ref/cite、图表引用和相邻过渡同步；
4. 编译全文，并逐句检查语言、数字、引用、证据强度、交叉引用、浮动体、公式和编码。

## 输出要求
直接交付：
- \`<base_name>_${fileStem}_refined.tex\`：完整、连续、可编译的英文论文，只在允许范围内修改；
    - \`<base_name>_${fileStem}_refinement_report_zh.md\`：简洁中文报告，记录范围、结构操作、主要修改、保留证据、冲突、引用变化、图表—正文对应关系、可选篇幅建议的处理和仍需作者判断的问题；
- \`<base_name>_${fileStem}_references.bib\`：完整当前 BibTeX 文献库，不是增量建议；
- 成功编译的 PDF。

不得只返回 diff、孤立片段、建议、提纲或多个候选版本。现在完整读取材料并直接完成精修。`;
  }

  return `# Refine ${scopeLabel}

## Your Role
Act as a senior CS paper author, reviewer, and LaTeX editor familiar with the manuscript's specific subfield. Read the complete paper, then bring only the configured scope to submission quality. Follow the independent contract below instead of applying generic rules mechanically across sections. Use available paper-reading, PDF-viewing, file-writing, and LaTeX-compilation tools directly.

## Inputs
Read in the same conversation:
- the complete current .tex;
- its latest compiled PDF;
- the complete current .bib;
- optional: figures, source images, and other attachments referenced by the current scope.

figures/ is not required. Read it only when the scope needs visual-content, visual-evidence, or source-image verification; its absence must not block prose refinement. Use .tex for terminology, equations, citations, and structure, and the PDF for final layout, visuals, equations, and context. Build the fact base from the whole manuscript but modify only the configured scope.

## Current Configuration
- Refinement scope: ${scopeLabel}
- Revision depth: ${REWRITE_DEPTHS[preferences.rewriteDepth].label.en}
- Colons: ${preferences.allowColon ? "allowed only when indispensable" : "not used"}
${citationConfig}
${weConfig}
${specialized}

## Evidence and Fact Rules
${COMMON_PROMPT_BLOCKS.evidence.en}

## TeX and Format Protection
${COMMON_PROMPT_BLOCKS.manuscriptProtection.en}

Additional boundaries:
- Change only the configured scope and the heading, label/ref/cite, visual-reference, or adjacent-transition synchronization strictly required by a merge; preserve everything else.
- Keep facts, claims, terminology, acronyms, variables, datasets, metrics, values, and units consistent. Treat cross-section conflicts with the lowest-risk wording and locate them in the report; do not hide evidence gaps or unfavorable results.

## Deep PDF Review
${COMMON_PROMPT_BLOCKS.pdfReview.en}

## Independent Contract for the Current Section
${sectionContract(preferences, "en")}

## Revision Depth
${REWRITE_DEPTHS[preferences.rewriteDepth].description.en}
At every depth, preserve verified facts, evidence boundaries, equation semantics, citation relations, and accurate, effective original expression.

## Cohesive Refinement
${COMMON_PROMPT_BLOCKS.cohesiveRevision.en}

## Length and Prose Units
${lengthDirective(preferences, "en")}

## Expression Constraints
${expressionDirective(preferences, "en")}

${citation}

## Execution
1. Internally map facts, claims, evidence, and cross-references for the scope; diagnose functional repetition, evidence misalignment, and logical breaks without outputting a long plan.
2. Refine the scope directly under its independent contract; retain distinct Experiments, Results, and Discussion paragraph functions when merging.
3. Synchronize only necessary headings, label/ref/cite links, visual references, and adjacent transitions.
4. Compile the complete paper, then audit language, values, citations, evidence strength, cross-references, floats, equations, and encoding.

## Deliverables
Deliver directly:
- \`<base_name>_${fileStem}_refined.tex\`: the complete continuous compilable English manuscript, changed only within the permitted scope;
    - \`<base_name>_${fileStem}_refinement_report_zh.md\`: a concise Chinese report covering scope, structural operations, major revisions, preserved evidence, conflicts, citation changes, visual-to-prose mapping, how optional length guidance was handled, and remaining author decisions;
- \`<base_name>_${fileStem}_references.bib\`: the complete current BibTeX library, not an incremental suggestion file;
- the successfully compiled PDF.

Do not return only a diff, isolated fragment, advice, outline, or multiple candidate versions. Read the complete materials and finish the refinement now.`;
}

export function buildSectionRefinementPrompt(
  preferences: SectionRefinementPreferences,
  language: Language,
) {
  return withPromptJudgmentDirective(
    buildSectionRefinementPromptContent(preferences, language),
    language,
  );
}
