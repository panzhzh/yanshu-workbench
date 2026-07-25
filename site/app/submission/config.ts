import type {
  CasZone,
  CitationIndex,
  JcrQuartile,
  SubmissionPreferences,
} from "../../content/prompts/types";

export const DEFAULT_SUBMISSION_PREFERENCES: SubmissionPreferences = {
  openAccess: "any",
  apc: "any",
  apcCurrency: "USD",
  apcMin: 0,
  apcMax: 3000,
  jcrQuartiles: [],
  casZones: [],
  citationIndexes: [],
  excludedPublishers: ["MDPI", "Hindawi", "Frontiers"],
};

export const JCR_QUARTILES: JcrQuartile[] = ["Q1", "Q2", "Q3", "Q4"];
export const CAS_ZONES: CasZone[] = ["1", "2", "3", "4"];
export const CITATION_INDEXES: CitationIndex[] = ["SCIE", "SSCI", "ESCI"];

export const SUBMISSION_COPY = {
  zh: {
    eyebrow: "SUBMISSION STRATEGY",
    title: "投稿策略",
    subtitle:
      "根据终稿建立期刊候选池，并用官网与权威来源核验匹配度、收录、分区、OA 和费用。",
    preset: "期刊目标检索 · 动态筛选条件",
    reset: "恢复默认筛选",
    resetHint: "清除 OA、APC、分区和收录筛选。",
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
    jcr: "JCR 分区",
    jcrHint: "可多选；不选择表示不限。必须标注核验年份和类别。",
    cas: "中科院分区",
    casHint: "可多选；与 JCR 分区分开核验和展示。",
    zone: "区",
    indexes: "收录索引",
    indexesHint: "可多选；未选择表示 SCIE、SSCI、ESCI 均可。",
    promptEyebrow: "TARGETING PROMPT",
    promptTitle: "投稿目标检索 Prompt",
    promptBody:
      "筛选条件会直接写入完整 Prompt；当前信息必须联网核验，无法确认的项目不得猜测。",
    livePrompt: "实时 Prompt",
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
      "Build a journal candidate pool from the final manuscript and verify fit, indexing, rankings, OA, and fees against official or authoritative sources.",
    preset: "Journal targeting · dynamic filters",
    reset: "Reset filters",
    resetHint: "Clear OA, APC, ranking, and indexing filters.",
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
    jcr: "JCR quartile",
    jcrHint:
      "Select multiple if needed; no selection means any. Verify year and category.",
    cas: "CAS zone",
    casHint: "Select multiple if needed and verify separately from JCR.",
    zone: "Zone",
    indexes: "Citation index",
    indexesHint: "Select multiple if needed; no selection allows SCIE, SSCI, or ESCI.",
    promptEyebrow: "TARGETING PROMPT",
    promptTitle: "Venue-targeting prompt",
    promptBody:
      "The complete prompt updates with every filter. Verify current facts online and never guess unresolved fields.",
    livePrompt: "Live prompt",
    switchPromptLanguage: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;
