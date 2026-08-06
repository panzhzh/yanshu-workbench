import type {
  CasZone,
  CitationIndex,
  JcrQuartile,
  SubmissionPreferences,
} from "../../content/prompts/types";

export const EXCLUDED_PUBLISHERS = [
  "MDPI",
  "Hindawi",
  "Frontiers",
] as const;

export const DEFAULT_SUBMISSION_PREFERENCES: SubmissionPreferences = {
  openAccess: "any",
  apc: "any",
  apcCurrency: "USD",
  apcMin: 0,
  apcMax: 3000,
  useImpactFactorRange: false,
  impactFactorMin: 0,
  impactFactorMax: 20,
  requireReviewArticles: false,
  jcrQuartiles: [],
  casZones: [],
  citationIndexes: [],
  excludedPublishers: [...EXCLUDED_PUBLISHERS],
};

export const JCR_QUARTILES: JcrQuartile[] = ["Q1", "Q2", "Q3", "Q4"];
export const CAS_ZONES: CasZone[] = ["1", "2", "3", "4"];
export const CITATION_INDEXES: CitationIndex[] = [
  "SCIE",
  "SSCI",
  "AHCI",
  "ESCI",
];

export const SUBMISSION_COPY = {
  zh: {
    eyebrow: "SUBMISSION STRATEGY",
    title: "投稿策略",
    subtitle:
      "先判断论文所属领域与稿件类型，再建立候选投稿池并核验匹配度、规则、收录和费用。",
    preset: "投稿目标检索 · 动态筛选条件",
    reset: "恢复默认筛选",
    resetHint: "恢复 OA、APC、IF、综述、分区、收录和出版社排除设置。",
    any: "不限",
    yes: "是",
    no: "否",
    openAccess: "是否 OA",
    openAccessHint: "选择“不限”时，OA 不作为候选池筛选条件。",
    apc: "是否有 APC",
    apcHint: "选择“是”后设置可接受的 APC 金额范围。",
    apcRange: "APC 范围",
    minimum: "最低",
    maximum: "最高",
    currency: "币种",
    impactFactor: "影响因子（IF）",
    impactFactorToggle: "自定义 IF 范围",
    impactFactorOn: "限制 IF",
    impactFactorOff: "不限 IF",
    impactFactorHint:
      "开启后按最新可核验 JCR Journal Impact Factor 筛选，并要求标注年份与来源。",
    reviewArticles: "综述文章",
    reviewArticlesOn: "要求接收综述",
    reviewArticlesOff: "不限文章类型",
    reviewArticlesHint:
      "开启后必须由最新官网作者指南确认 Review 或 Survey 是可投稿文章类型。",
    jcr: "JCR 分区",
    jcrHint: "可多选；不选择表示不限。必须标注核验年份和类别。",
    cas: "中科院分区",
    casHint: "可多选；与 JCR 分区分开核验和展示。",
    zone: "区",
    indexes: "收录索引",
    indexesHint: "可多选；未选择表示不以 SCIE、SSCI、AHCI 或 ESCI 限制候选池。",
    publisherExclusions: "排除指定出版社",
    publisherExclusionsOn: "排除 MDPI、Hindawi、Frontiers",
    publisherExclusionsOff: "不排除",
    publisherExclusionsHint:
      "默认排除这三家出版社旗下期刊；关闭后仍按论文匹配度和可核验规则正常筛选。",
    switchPromptLanguage: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "收起",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    eyebrow: "SUBMISSION STRATEGY",
    title: "Submission strategy",
    subtitle:
      "Classify the manuscript first, then build a candidate pool and verify fit, rules, indexing, and fees against official or authoritative sources.",
    preset: "Venue targeting · dynamic filters",
    reset: "Reset filters",
    resetHint:
      "Restore OA, APC, IF, review-article, ranking, indexing, and publisher-exclusion settings.",
    any: "Any",
    yes: "Yes",
    no: "No",
    openAccess: "Open access",
    openAccessHint:
      "With “Any,” OA status is not used to filter the candidate pool.",
    apc: "APC charged",
    apcHint: "Choose “Yes” to set an acceptable APC range.",
    apcRange: "APC range",
    minimum: "Minimum",
    maximum: "Maximum",
    currency: "Currency",
    impactFactor: "Impact factor (IF)",
    impactFactorToggle: "Custom IF range",
    impactFactorOn: "Limit IF",
    impactFactorOff: "Any IF",
    impactFactorHint:
      "When enabled, filter by the latest verifiable JCR Journal Impact Factor and report its year and source.",
    reviewArticles: "Review articles",
    reviewArticlesOn: "Must accept reviews",
    reviewArticlesOff: "Any article type",
    reviewArticlesHint:
      "When enabled, verify in the latest official author guide that Review or Survey is an accepted article type.",
    jcr: "JCR quartile",
    jcrHint:
      "Select multiple if needed; no selection means any. Verify year and category.",
    cas: "CAS zone",
    casHint: "Select multiple if needed and verify separately from JCR.",
    zone: "Zone",
    indexes: "Citation index",
    indexesHint:
      "Select multiple if needed; no selection leaves SCIE, SSCI, AHCI, and ESCI unrestricted.",
    publisherExclusions: "Exclude named publishers",
    publisherExclusionsOn: "Exclude MDPI, Hindawi, and Frontiers",
    publisherExclusionsOff: "Do not exclude",
    publisherExclusionsHint:
      "Journals from these three publishers are excluded by default. When disabled, evaluate them normally using manuscript fit and verifiable rules.",
    switchPromptLanguage: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;
