import type { Language, LocalizedText } from "../config";

export type IdeaWorkbenchMode = "discovery" | "evaluation";

export const IDEA_DIRECTION_IDS = [
  "general-cs",
  "ai-ml",
  "nlp",
  "computer-vision",
  "data-mining",
  "systems",
  "software-engineering",
  "security",
  "hci",
  "robotics",
  "theory",
  "custom",
] as const;

export type IdeaDirectionId = (typeof IDEA_DIRECTION_IDS)[number];

interface IdeaDirection {
  label: LocalizedText;
  prompt: LocalizedText;
}

export const IDEA_DIRECTIONS: Record<IdeaDirectionId, IdeaDirection> = {
  "general-cs": {
    label: { zh: "计算机科学（开放）", en: "Computer Science — Open" },
    prompt: {
      zh: "计算机科学；根据用户给出的具体兴趣进一步收窄，不跨到非 CS 学科",
      en: "Computer science; narrow the scope from the user's stated interests and do not drift into non-CS disciplines",
    },
  },
  "ai-ml": {
    label: { zh: "人工智能与机器学习", en: "AI & Machine Learning" },
    prompt: {
      zh: "人工智能与机器学习",
      en: "artificial intelligence and machine learning",
    },
  },
  nlp: {
    label: { zh: "自然语言处理", en: "Natural Language Processing" },
    prompt: {
      zh: "自然语言处理",
      en: "natural language processing",
    },
  },
  "computer-vision": {
    label: { zh: "计算机视觉", en: "Computer Vision" },
    prompt: {
      zh: "计算机视觉",
      en: "computer vision",
    },
  },
  "data-mining": {
    label: { zh: "数据挖掘与数据库", en: "Data Mining & Databases" },
    prompt: {
      zh: "数据挖掘、知识发现与数据库",
      en: "data mining, knowledge discovery, and databases",
    },
  },
  systems: {
    label: { zh: "计算机系统与网络", en: "Systems & Networking" },
    prompt: {
      zh: "计算机系统、分布式系统与网络",
      en: "computer systems, distributed systems, and networking",
    },
  },
  "software-engineering": {
    label: { zh: "软件工程", en: "Software Engineering" },
    prompt: {
      zh: "软件工程与程序分析",
      en: "software engineering and program analysis",
    },
  },
  security: {
    label: { zh: "安全与隐私", en: "Security & Privacy" },
    prompt: {
      zh: "计算机安全、隐私与可信计算",
      en: "computer security, privacy, and trustworthy computing",
    },
  },
  hci: {
    label: { zh: "人机交互", en: "Human–Computer Interaction" },
    prompt: {
      zh: "人机交互与计算机支持的协作",
      en: "human–computer interaction and computer-supported collaboration",
    },
  },
  robotics: {
    label: { zh: "机器人与具身智能", en: "Robotics & Embodied AI" },
    prompt: {
      zh: "机器人、具身智能与自主系统",
      en: "robotics, embodied intelligence, and autonomous systems",
    },
  },
  theory: {
    label: { zh: "理论计算机科学", en: "Theoretical Computer Science" },
    prompt: {
      zh: "理论计算机科学与算法",
      en: "theoretical computer science and algorithms",
    },
  },
  custom: {
    label: { zh: "自定义方向", en: "Custom Direction" },
    prompt: {
      zh: "以用户填写的自定义 CS 方向为准",
      en: "use the custom CS direction supplied by the user",
    },
  },
};

export const IDEA_COUNT_OPTIONS = [2, 3, 5, 8] as const;
export type IdeaCount = (typeof IDEA_COUNT_OPTIONS)[number];

export const NOVELTY_POSTURE_IDS = [
  "grounded",
  "balanced",
  "frontier",
] as const;
export type NoveltyPostureId = (typeof NOVELTY_POSTURE_IDS)[number];

export const NOVELTY_POSTURES: Record<
  NoveltyPostureId,
  { label: LocalizedText; prompt: LocalizedText }
> = {
  grounded: {
    label: { zh: "稳健增量", en: "Grounded" },
    prompt: {
      zh: "优先可执行且有清楚证据缺口的稳健增量贡献，但不得把微小改动包装成新 Idea",
      en: "favor executable, evidence-backed incremental contributions without dressing minor variations up as new ideas",
    },
  },
  balanced: {
    label: { zh: "平衡探索", en: "Balanced" },
    prompt: {
      zh: "在新颖性、科学意义与可执行性之间保持平衡",
      en: "balance novelty, scientific significance, and executability",
    },
  },
  frontier: {
    label: { zh: "高风险前沿", en: "Frontier" },
    prompt: {
      zh: "允许提出高风险、高潜力方向，但必须明确未经验证的关键假设、资源代价与最快否证路径",
      en: "allow high-risk, high-upside directions only when their unverified assumptions, resource costs, and fastest falsification paths are explicit",
    },
  },
};

export const REFINEMENT_FREEDOM_IDS = [
  "preserve",
  "reframe",
] as const;
export type RefinementFreedomId = (typeof REFINEMENT_FREEDOM_IDS)[number];

export const REFINEMENT_FREEDOMS: Record<
  RefinementFreedomId,
  {
    label: LocalizedText;
    description: LocalizedText;
    prompt: LocalizedText;
  }
> = {
  preserve: {
    label: { zh: "保留核心", en: "Preserve Core" },
    description: {
      zh: "保留研究问题与核心机制，只优化范围、论证和验证方案。",
      en: "Keep the question and core mechanism; refine scope, argument, and validation.",
    },
    prompt: {
      zh: "保留原 Idea 的核心研究问题和核心机制；只允许优化范围、假设、定位和验证设计",
      en: "preserve the idea's core research question and mechanism; refine only its scope, hypothesis, positioning, and validation design",
    },
  },
  reframe: {
    label: { zh: "允许重构", en: "Allow Reframing" },
    description: {
      zh: "保留最有价值的洞察，允许重写问题、机制或实验主线。",
      en: "Keep the strongest insight while allowing the question, mechanism, or experiment story to change.",
    },
    prompt: {
      zh: "保留最有价值且有证据支撑的洞察；允许整体重构研究问题、机制、数据或实验主线",
      en: "retain the most valuable evidence-supported insight while allowing an integrated reframing of the question, mechanism, data, or experimental throughline",
    },
  },
};

export interface IdeaPreferences {
  directionId: IdeaDirectionId;
  focus: string;
  seed: string;
  dataset: string;
  recentYears: number;
  topConferences: boolean;
  topJournals: boolean;
  customVenues: string;
  pursueSota: boolean;
  resourceConstraints: string;
  ideaCount: IdeaCount;
  noveltyPosture: NoveltyPostureId;
  refinementFreedom: RefinementFreedomId;
  additionalCriteria: string;
}

const BASE_IDEA_PREFERENCES: IdeaPreferences = {
  directionId: "general-cs",
  focus: "",
  seed: "",
  dataset: "",
  recentYears: 5,
  topConferences: true,
  topJournals: true,
  customVenues: "",
  pursueSota: false,
  resourceConstraints: "",
  ideaCount: 5,
  noveltyPosture: "balanced",
  refinementFreedom: "preserve",
  additionalCriteria: "",
};

export const DEFAULT_IDEA_PREFERENCES_BY_MODE: Record<
  IdeaWorkbenchMode,
  IdeaPreferences
> = {
  discovery: {
    ...BASE_IDEA_PREFERENCES,
    recentYears: 2,
    ideaCount: 2,
  },
  evaluation: {
    ...BASE_IDEA_PREFERENCES,
  },
};

export function getDefaultIdeaPreferences(
  mode: IdeaWorkbenchMode,
): IdeaPreferences {
  return { ...DEFAULT_IDEA_PREFERENCES_BY_MODE[mode] };
}

const SHARED_COPY = {
  zh: {
    reset: "恢复默认",
    resetHint: "恢复本页默认配置",
    directionTitle: "研究范围",
    direction: "方向",
    focus: "具体方向或问题",
    focusPlaceholder: "例如：检索增强生成中的长期知识更新",
    evidenceTitle: "文献检索边界",
    recentYears: "近 N 年",
    years: "年",
    sourceScope: "优先检索",
    topConferences: "顶会",
    topConferencesHint: "当前方向公认的主要会议",
    topJournals: "顶刊",
    topJournalsHint: "当前方向公认的主要期刊",
    customVenues: "指定 venue（可选）",
    customVenuesPlaceholder: "例如：ACL, EMNLP, TACL；逗号分隔",
    evidenceHint:
      "“顶会/顶刊”按当前 CS 子领域识别并说明选择依据；近年窗口之外只补充不可替代的奠基工作。",
    dataTitle: "数据与目标",
    dataset: "指定数据集或数据条件（可选）",
    datasetPlaceholder:
      "公开数据集、私有数据条件、任务子集或“请根据证据推荐”",
    sota: "追求 SOTA",
    sotaOn: "将可核验的 SOTA 目标作为必要条件",
    sotaOff: "不把排行榜提升作为必要条件",
    sotaHint:
      "关闭时仍要求明确贡献，可来自新问题、机制理解、测量、稳健性、效率或负结果。",
    resources: "资源与执行边界（可选）",
    resourcesPlaceholder:
      "例如：单张 24GB GPU、8 周、不能采集新数据、优先开源代码",
    strategyTitle: "生成与判断",
    seed: "问题线索或待处理内容",
    ideaCount: "候选 Idea 数量",
    noveltyPosture: "探索幅度",
    refinementFreedom: "优化自由度",
    additionalCriteria: "补充约束或评估标准（可选）",
    additionalCriteriaPlaceholder:
      "例如：必须可复现、避免闭源模型、优先低资源场景",
    outputTitle: "输出",
    outputValue: "Markdown · 中文 + English",
    outputHint: "生成两份语义一致、可下载的 .md 文件，不生成 TeX。",
    promptSwitch: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    collapse: "收起",
    expand: "展开",
    clipboardError: "复制失败，请手动选择 Prompt 文本。",
  },
  en: {
    reset: "Reset",
    resetHint: "Restore this page's defaults",
    directionTitle: "Research Scope",
    direction: "Direction",
    focus: "Specific focus or problem",
    focusPlaceholder: "e.g. continual knowledge updates in retrieval-augmented generation",
    evidenceTitle: "Literature Boundary",
    recentYears: "Recent N years",
    years: "years",
    sourceScope: "Prioritize",
    topConferences: "Top conferences",
    topConferencesHint: "Established major conferences in this subfield",
    topJournals: "Top journals",
    topJournalsHint: "Established major journals in this subfield",
    customVenues: "Named venues (optional)",
    customVenuesPlaceholder: "e.g. ACL, EMNLP, TACL; comma-separated",
    evidenceHint:
      "Identify major venues for the selected CS subfield and explain the choice. Use older work only when it is genuinely foundational.",
    dataTitle: "Data & Objective",
    dataset: "Dataset or data condition (optional)",
    datasetPlaceholder:
      "Public dataset, private-data condition, task subset, or “recommend from evidence”",
    sota: "Pursue SOTA",
    sotaOn: "Require a verifiable SOTA target",
    sotaOff: "Do not require leaderboard improvement",
    sotaHint:
      "When off, the contribution must still be explicit and may come from a new problem, mechanism, measurement, robustness, efficiency, or negative result.",
    resources: "Resources and execution limits (optional)",
    resourcesPlaceholder:
      "e.g. one 24GB GPU, eight weeks, no new data collection, open-source code preferred",
    strategyTitle: "Generation & Judgment",
    seed: "Problem seed or material to evaluate",
    ideaCount: "Candidate idea count",
    noveltyPosture: "Exploration posture",
    refinementFreedom: "Optimization freedom",
    additionalCriteria: "Additional constraint or criterion (optional)",
    additionalCriteriaPlaceholder:
      "e.g. must be reproducible, avoid closed models, prioritize low-resource settings",
    outputTitle: "Output",
    outputValue: "Markdown · 中文 + English",
    outputHint: "Create two semantically aligned downloadable .md files. Do not create TeX.",
    promptSwitch: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    collapse: "Collapse",
    expand: "Expand",
    clipboardError: "Copy failed. Select and copy the prompt manually.",
  },
} as const;

const MODE_COPY = {
  discovery: {
    zh: {
      eyebrow: "PAPER WRITING · IDEA DISCOVERY",
      preset: "EVIDENCE-GROUNDED",
      title: "Idea 查找",
      subtitle:
        "从近期文献、真实数据条件与可执行边界中发现研究机会；先检索和去重，再提出候选 Idea。",
      materialTitle: "可提供材料",
      materialItems: ["问题线索（可选）", "相关论文（可选）", "数据说明（可选）"],
      materialHint:
        "没有现成材料也可开始；Prompt 会要求联网检索并明确搜索覆盖范围。",
      seedPlaceholder:
        "例如：我不满意现有 RAG 评测只看静态问答；也可以留空，让模型从指定方向开始检索。",
      strategyHint:
        "先生成更大的内部候选池，再去重、核验近邻论文并只保留设定数量。",
      promptTitle: "发现可验证的 CS 研究 Idea",
      promptDescription:
        "基于近期可信文献寻找真实机会，输出候选、比较、风险与最小验证实验。",
    },
    en: {
      eyebrow: "PAPER WRITING · IDEA DISCOVERY",
      preset: "EVIDENCE-GROUNDED",
      title: "Idea Discovery",
      subtitle:
        "Find research opportunities from recent literature, real data conditions, and execution limits—search and deduplicate before proposing ideas.",
      materialTitle: "Optional materials",
      materialItems: ["Problem seed", "Related papers", "Dataset notes"],
      materialHint:
        "You may start without attachments; the prompt requires live literature search and explicit coverage reporting.",
      seedPlaceholder:
        "e.g. Current RAG evaluation overemphasizes static QA; or leave blank and search from the configured direction.",
      strategyHint:
        "Build a larger internal pool, then deduplicate and verify nearest work before returning only the requested count.",
      promptTitle: "Discover Verifiable CS Research Ideas",
      promptDescription:
        "Use recent trustworthy literature to identify real opportunities, candidates, risks, comparisons, and minimum decisive tests.",
    },
  },
  evaluation: {
    zh: {
      eyebrow: "PAPER WRITING · IDEA EVALUATION",
      preset: "EVIDENCE-GROUNDED",
      title: "Idea 评估与优化",
      subtitle:
        "用近邻论文、竞争格局和执行条件压力测试一个 Idea，并将可修复部分融合成完整的新版本。",
      materialTitle: "建议提供",
      materialItems: ["Idea 描述（必需）", "相关论文（可选）", "数据或代码（可选）"],
      materialHint:
        "可在下方粘贴简述，也可复制 Prompt 后在同一对话中上传现有 Idea Markdown。",
      seedPlaceholder:
        "粘贴待评估 Idea：研究问题、核心假设、方法线索、预期数据与实验；也可写“见同一对话上传的文件”。",
      strategyHint:
        "不是润色措辞，而是核验新颖性、意义、有效性、可行性与竞争时机，再整体重构。",
      promptTitle: "评估并优化一个 CS 研究 Idea",
      promptDescription:
        "检索最接近工作，识别致命假设与可修复问题，给出明确决策和一份完整优化稿。",
    },
    en: {
      eyebrow: "PAPER WRITING · IDEA EVALUATION",
      preset: "EVIDENCE-GROUNDED",
      title: "Idea Evaluation & Refinement",
      subtitle:
        "Stress-test an idea against nearest work, the competitive landscape, and execution limits, then integrate fixable changes into a coherent new version.",
      materialTitle: "Recommended materials",
      materialItems: ["Idea description (required)", "Related papers", "Data or code"],
      materialHint:
        "Paste a concise description below or attach an existing idea Markdown file in the same conversation after copying the prompt.",
      seedPlaceholder:
        "Paste the idea's question, hypothesis, method intuition, expected data, and experiment—or write “see the attached file in this conversation.”",
      strategyHint:
        "This is not prose polishing. Verify novelty, significance, validity, feasibility, and timing before recomposing the idea.",
      promptTitle: "Evaluate and Refine a CS Research Idea",
      promptDescription:
        "Retrieve nearest work, expose fatal assumptions and fixable weaknesses, then return a clear decision and one coherent optimized idea.",
    },
  },
} as const;

export function getIdeaCopy(mode: IdeaWorkbenchMode, language: Language) {
  return {
    ...SHARED_COPY[language],
    ...MODE_COPY[mode][language],
  };
}

function clean(value: string) {
  return value.trim();
}

function optionalValue(
  value: string,
  language: Language,
  fallbackZh: string,
  fallbackEn: string,
) {
  return clean(value) || (language === "zh" ? fallbackZh : fallbackEn);
}

function directionValue(preferences: IdeaPreferences, language: Language) {
  const base = IDEA_DIRECTIONS[preferences.directionId].prompt[language];
  const focus = clean(preferences.focus);
  return focus ? `${base}；${focus}` : base;
}

function venueValue(preferences: IdeaPreferences, language: Language) {
  const scopes: string[] = [];
  if (preferences.topConferences) {
    scopes.push(language === "zh" ? "当前子领域公认顶会" : "established top conferences in the subfield");
  }
  if (preferences.topJournals) {
    scopes.push(language === "zh" ? "当前子领域公认顶刊" : "established top journals in the subfield");
  }
  if (clean(preferences.customVenues)) {
    scopes.push(
      language === "zh"
        ? `用户指定 venue：${clean(preferences.customVenues)}`
        : `user-specified venues: ${clean(preferences.customVenues)}`,
    );
  }
  return (
    scopes.join(language === "zh" ? "；" : "; ") ||
    (language === "zh"
      ? "不限定 venue，但必须优先可靠的一手学术来源"
      : "no venue restriction, but prioritize reliable primary scholarly sources")
  );
}

function discoveryPrompt(
  preferences: IdeaPreferences,
  language: Language,
) {
  const direction = directionValue(preferences, language);
  const dataset = optionalValue(
    preferences.dataset,
    language,
    "未指定；根据任务证据推荐，不得为了迁就现成 benchmark 反向虚构问题",
    "not specified; recommend from task evidence and never invent a problem merely to fit an available benchmark",
  );
  const seed = optionalValue(
    preferences.seed,
    language,
    "未提供；从已配置方向开展证据驱动检索",
    "not supplied; begin evidence-grounded search from the configured direction",
  );
  const resources = optionalValue(
    preferences.resourceConstraints,
    language,
    "未指定；按普通高校 CS 研究团队可获得的资源进行保守估计，并显式标注假设",
    "not specified; make conservative assumptions for an ordinary academic CS team and label them explicitly",
  );
  const criteria = optionalValue(
    preferences.additionalCriteria,
    language,
    "无额外约束",
    "none",
  );
  const venues = venueValue(preferences, language);
  const novelty = NOVELTY_POSTURES[preferences.noveltyPosture].prompt[language];

  if (language === "zh") {
    return `# 为计算机科学研究发现可验证的 Idea

你是一名严谨的 CS 研究策略专家。你的任务不是凭关键词“脑暴”，而是先建立可核验的近期研究图景，再提出值得投入实验的候选 Idea。所有新颖性、SOTA 与文献判断必须由真实来源支撑。

## 当前配置
- 研究方向：${direction}
- 问题线索：${seed}
- 数据集或数据条件：${dataset}
- 文献时间窗：以执行当天为基准，重点检索近 ${preferences.recentYears} 年
- venue 范围：${venues}
- SOTA 目标：${preferences.pursueSota ? "是；必须定义明确数据集、指标、强基线与可核验目标，不接受只追求无解释的微小涨点" : "否；不得因不追求排行榜第一而降低对贡献清晰度的要求"}
- 资源与执行边界：${resources}
- 探索幅度：${novelty}
- 最终候选数量：${preferences.ideaCount}
- 补充约束：${criteria}

## 检索与证据规则
1. 先确认执行当天日期，并围绕任务、假设、方法、数据集、指标和失败现象设计多组检索式。重点检索近 ${preferences.recentYears} 年论文；只有不可替代的奠基工作才可超出窗口并单独标记。
2. “顶会/顶刊”必须按当前子领域识别并简要说明选择依据，不得把任意 venue 自称为顶级。默认优先检索与当前问题直接相关的公认顶会论文，再以顶刊和必要的奠基工作补足证据；优先使用官方 proceedings、OpenReview、出版社页面、arXiv 原文、项目主页和官方代码仓库。
3. 每篇实质性相关工作须核验标题、作者、年份、venue 和稳定链接。无法核验的信息不得补写；预印本与正式发表版本须区分。
4. 不得把“没有搜到”写成“从未有人研究”。只能报告在明确检索范围内未发现高度重合工作，并列出检索边界与不确定性。
5. 若指定公开数据集，核验其官方来源、许可或访问条件、任务定义、划分、常用指标、泄漏风险和当前强基线。若是私有或未公开数据，只把用户提供的信息视为条件，不伪造外部事实。
6. 不得发明实验结果、SOTA 数字、数据规模、代码可用性或论文结论。引用数量不等于证据质量。

## 工作流程
1. 建立研究图景：归纳已解决问题、仍然成立的瓶颈、彼此矛盾的发现、未经检验的常见假设，以及数据、指标、泛化、效率、鲁棒性、复现或真实部署中的缺口。
2. 从多种贡献形态发散内部候选池，包括但不限于新问题、新机制、新测量或指标、新数据/任务、稳健性与边界分析、系统权衡、复现与有价值的负结果；只保留适合当前方向和资源的类型。
3. 合并只是换术语、换模型或换数据集的重复候选。对剩余候选逐一检索最接近的工作，比较问题、假设、机制、数据、评价和预期贡献，而不是只比较标题关键词。
4. 对每个候选执行最快否证测试：指出最可能让项目失败的单一假设，以及一周内或最小预算下能够检验它的实验。
5. 综合证据后只输出 ${preferences.ideaCount} 个真正不同的候选，并给出明确排序。不得为了凑数保留证据薄弱 Idea。

## 每个候选 Idea 的最低合同
- 暂定标题与一句话核心洞察；
- 今天仍存在的具体问题，以及近期证据如何支持这一判断；
- 可证伪的研究问题或假设；
- 方法或研究设计的核心机制，不写成空泛模块组合；
- 建议数据集、指标、强基线和最小决定性实验；
- 与 2–4 篇最接近工作的逐项差异，以及可能被判定“不新”的位置；
- 预期贡献类型；${preferences.pursueSota ? "明确 SOTA 成功条件和即使未达到 SOTA 仍可成立的科学价值" : "明确不依赖 SOTA 的科学价值，不得暗示未经验证的性能领先"}；
- 所需数据、计算、时间与技能，最大执行风险、伦理或许可风险；
- 1–5 分的清晰度、新颖性、科学意义、有效性、可行性、时机与证据就绪度；每项给一句依据和置信度，不用平均分掩盖致命问题。

## 排序与推荐
给出候选比较表，并选择一个“最值得先验证”的 Idea。推荐理由必须同时考虑科学价值、近邻竞争、资源匹配和最快否证成本。随后给出第一周行动清单、停止条件，以及需要持续监测的关键词、研究团队或 venue。

## 输出文件
创建两份语义一致、可直接下载的 Markdown 文件，不要只在聊天中给摘要：
1. \`<topic_slug>_idea_discovery_zh.md\`
2. \`<topic_slug>_idea_discovery_en.md\`

两份文件均包含：配置快照、检索协议与覆盖范围、研究机会图谱、候选 Idea 完整合同、近邻工作比较、评分与不确定性、最终推荐、第一周验证计划和带稳定链接的参考文献。英文版应为自然学术英语，不做逐句机器式翻译。

不得生成 \`.tex\`、PDF、DOCX、BibTeX 或虚构附件。若关键信息不足，在报告中明确假设与待核验项，但仍完成在当前证据下能够完成的分析。`;
  }

  return `# Discover Verifiable Computer Science Research Ideas

You are a rigorous CS research strategist. Do not brainstorm from keywords. Build a verifiable picture of the recent field first, then propose ideas worth experimental investment. Every novelty, SOTA, and literature judgment must be grounded in authentic sources.

## Configuration
- Research direction: ${direction}
- Problem seed: ${seed}
- Dataset or data condition: ${dataset}
- Literature window: focus on the most recent ${preferences.recentYears} years as of the execution date
- Venue scope: ${venues}
- SOTA objective: ${preferences.pursueSota ? "required; define the dataset, metric, strongest baselines, and a verifiable target, and reject unexplained marginal leaderboard chasing" : "not required; contribution clarity remains mandatory even without a leaderboard-first objective"}
- Resources and execution limits: ${resources}
- Exploration posture: ${novelty}
- Final candidate count: ${preferences.ideaCount}
- Additional constraints: ${criteria}

## Search and evidence rules
1. Establish the actual execution date. Design multiple queries around the task, assumptions, methods, datasets, metrics, and failure phenomena. Focus on the most recent ${preferences.recentYears} years; label indispensable older foundational work separately.
2. Identify major conferences and journals for the selected subfield and briefly justify the choice. Never call an arbitrary venue “top.” By default, search established top-conference papers directly related to the problem first, then use top journals and indispensable foundational work to complete the evidence. Prefer official proceedings, OpenReview, publisher pages, original arXiv records, project pages, and official code repositories.
3. Verify the title, authors, year, venue, and stable link for every materially relevant paper. Do not fill missing metadata. Distinguish preprints from formally published versions.
4. Never turn “not found” into “never studied.” Report only that no close match was found within a documented search scope, and state the coverage limits and uncertainty.
5. For a named public dataset, verify its official source, license or access conditions, task definition, split, common metrics, leakage risks, and current strong baselines. Treat private or unpublished data only as a user-supplied condition.
6. Never invent results, SOTA values, dataset sizes, code availability, or paper conclusions. Citation volume is not evidence quality.

## Workflow
1. Map the landscape: established solutions, bottlenecks that still hold, conflicting findings, untested common assumptions, and gaps in data, metrics, generalization, efficiency, robustness, reproducibility, or deployment.
2. Build a larger internal pool across contribution types—new problem, mechanism, measurement or metric, dataset or task, robustness and boundary analysis, systems trade-off, replication, or valuable negative result—keeping only types that fit the configured scope and resources.
3. Merge candidates that merely rename a component, swap a model, or change a dataset. For every remaining candidate, retrieve the nearest work and compare the problem, assumptions, mechanism, data, evaluation, and contribution rather than title keywords.
4. Apply a fastest-falsification test: identify the single assumption most likely to kill each project and the experiment that could test it within one week or the smallest practical budget.
5. Return only ${preferences.ideaCount} substantively distinct candidates after evidence review. Do not keep weak ideas merely to satisfy the count.

## Minimum contract for each idea
- Working title and one-sentence nugget;
- The concrete problem that still exists today and recent evidence for it;
- A falsifiable research question or hypothesis;
- The core mechanism or research design, not a generic stack of modules;
- Recommended datasets, metrics, strong baselines, and minimum decisive experiment;
- Point-by-point differentiation from 2–4 nearest papers and where reviewers may still judge it non-novel;
- Contribution type; ${preferences.pursueSota ? "a precise SOTA success condition plus scientific value that can survive a non-SOTA outcome" : "scientific value independent of SOTA, with no unsupported claim of performance leadership"};
- Data, compute, time, and skill needs; main execution, ethical, and licensing risks;
- 1–5 ratings for clarity, novelty, significance, validity, feasibility, timing, and evidence readiness, each with a one-sentence rationale and confidence. Never let an average conceal a fatal weakness.

## Ranking and recommendation
Provide a comparison table and select one idea as “best to test first.” The recommendation must jointly consider scientific value, nearest competition, resource fit, and falsification cost. Give a first-week action list, stop conditions, and a watch list of queries, groups, or venues.

## Output files
Create two semantically aligned, directly downloadable Markdown files rather than only a chat summary:
1. \`<topic_slug>_idea_discovery_zh.md\`
2. \`<topic_slug>_idea_discovery_en.md\`

Both files must contain the configuration snapshot, search protocol and coverage, opportunity map, complete idea contracts, nearest-work comparisons, ratings and uncertainty, final recommendation, first-week validation plan, and references with stable links. Write the Chinese version naturally and the English version in natural academic English; do not translate sentence by sentence mechanically.

Do not create TeX, PDF, DOCX, BibTeX, or invented attachments. If critical information is missing, state assumptions and verification needs in the reports while completing everything the available evidence supports.`;
}

function evaluationPrompt(
  preferences: IdeaPreferences,
  language: Language,
) {
  const direction = directionValue(preferences, language);
  const dataset = optionalValue(
    preferences.dataset,
    language,
    "以 Idea 原文为准；若未指定，只提出经过来源核验的候选，不擅自锁定数据集",
    "use the idea as supplied; if unspecified, propose only source-verified candidates and do not silently lock in a dataset",
  );
  const idea = optionalValue(
    preferences.seed,
    language,
    "请读取同一对话中提供的 Idea 描述或 Markdown 文件；若仍不存在，只询问一次并等待，不得凭空补造",
    "read the idea description or Markdown file supplied in the same conversation; if none exists, ask once and wait rather than inventing one",
  );
  const resources = optionalValue(
    preferences.resourceConstraints,
    language,
    "未指定；按普通高校 CS 研究团队可获得的资源进行保守估计，并显式标注假设",
    "not specified; make conservative assumptions for an ordinary academic CS team and label them explicitly",
  );
  const criteria = optionalValue(
    preferences.additionalCriteria,
    language,
    "无额外标准",
    "none",
  );
  const venues = venueValue(preferences, language);
  const freedom =
    REFINEMENT_FREEDOMS[preferences.refinementFreedom].prompt[language];

  if (language === "zh") {
    return `# 评估并优化一个计算机科学研究 Idea

你是一名严格但建设性的 CS 领域专家、审稿人和实验负责人。先把用户的 Idea 还原成可检验的研究合同，再用真实文献、代码、数据和资源条件进行压力测试。不要因为措辞流畅而高估 Idea，也不要用泛泛批评代替证据。

## 当前配置
- 研究方向：${direction}
- 待评估 Idea：${idea}
- 数据集或数据条件：${dataset}
- 文献时间窗：以执行当天为基准，重点检索近 ${preferences.recentYears} 年
- venue 范围：${venues}
- SOTA 目标：${preferences.pursueSota ? "是；优化稿必须给出可核验的目标数据集、指标和强基线，同时避免只靠微小涨点成立" : "否；用科学意义而非排行榜第一判断价值"}
- 资源与执行边界：${resources}
- 优化自由度：${freedom}
- 补充评估标准：${criteria}

## 证据规则
1. 确认执行当天日期，并围绕 Idea 的问题、claim、机制、数据、指标、baseline 和失败条件设计检索。重点覆盖近 ${preferences.recentYears} 年，必要的奠基工作单独列出。
2. 优先使用官方 proceedings、OpenReview、出版社页面、原始 arXiv 记录、项目主页、数据集主页和官方代码仓库。逐项核验标题、作者、年份、venue、版本和稳定链接。
3. 至少检索最接近的直接竞争工作，而不是只找同主题论文。比较问题定义、关键假设、技术机制、数据、评价协议、证据与贡献边界。
4. 不得把检索不到等同于绝对新颖，不得发明论文结论、实验数字、SOTA、数据规模、许可或代码状态。将事实、作者主张和你的推断明确分开。
5. 若指定数据集，核验来源、访问/许可、划分、指标、泄漏风险、饱和度和当前强基线；若为私有数据，只能依据用户提供的信息评估。

## 第一阶段：抽取 Idea 合同
用最强、最具体且不替作者补造事实的方式重述：
- 今天仍存在的研究问题；
- 一句话核心洞察；
- 可证伪的主要假设与预期 claim；
- 机制或研究设计；
- 数据、指标、baseline 与最小决定性实验；
- 依赖条件、预期贡献类型和明确不声称的内容。

标出原 Idea 中缺失、含混或相互冲突的字段。不要立即修改，先确保评估对象准确。

## 第二阶段：多证据压力测试
分别从领域专家、怀疑型审稿人和实验负责人视角检查，但最终形成一份统一判断：
1. 清晰度：问题、假设、机制和成功条件是否可操作；
2. 新颖性：与最近邻工作的实质差异是否成立，是否只是换模型、换数据集或重新命名；
3. 科学意义：即使结果不理想，是否仍能产生可解释、可累积的知识；
4. 有效性：机制与假设是否一致，指标是否真的测量目标，因果或泛化表述是否越界；
5. 可行性：数据、算力、时间、工程、标注、伦理和许可是否匹配；
6. 竞争与时机：领域是否拥挤、容易被抢先，用户的比较优势是什么；
7. 证据与复现就绪度：强 baseline、开源实现、评价协议和最小实验是否可获得；
8. SOTA 依赖：${preferences.pursueSota ? "SOTA 目标是否精确定义，达到它是否足以构成贡献，未达到时 Idea 是否仍有科学价值" : "Idea 是否错误地依赖潜在性能提升；若不追求 SOTA，替代价值是否足够清楚"}。

为每项给出 1–5 分、证据、置信度和问题等级（致命 / 重大但可修复 / 次要）。不要用平均分抵消致命缺陷。增加一张最近邻比较表，并明确最强反对意见和能够推翻它的证据。

## 第三阶段：融合式优化
禁止补丁式优化：不要保留有缺陷的原 Idea，再追加限定词、额外模块、更多数据集或一串免责声明进行补救。先识别最小完整研究命题，再整体重组问题、假设、机制、评价与贡献，使优化稿像一次成形的研究设计。

优化边界：${freedom}。不得虚构数据、结果、资源或文献。每项改变都要对应已识别的问题；删除没有独立功能的复杂度。

输出：
- 保留内容、删除内容和改变内容及其理由；
- 一份完整、自洽、可直接讨论的优化版 Idea 合同；
- 最小决定性实验、第一周计划、量化或可观察的成功/停止条件；
- 若存在两条都合理但互斥的路线，只保留推荐路线，把另一条列为备选，不得拼成臃肿方案。

## 最终决策
只给一个主决策：Pursue、Refine、Park 或 Stop。说明最关键依据、剩余最大不确定性和下一项行动。Park 必须写明重新考虑的触发条件；Stop 必须说明原 Idea 为什么不值得继续投入。

## 输出文件
创建两份语义一致、可直接下载的 Markdown 文件：
1. \`<topic_slug>_idea_evaluation_zh.md\`
2. \`<topic_slug>_idea_evaluation_en.md\`

两份文件均包含：配置快照、Idea 合同、检索协议与覆盖范围、最近邻比较、多维评估、致命与可修复问题、优化变更、完整优化版 Idea、最小验证计划、最终决策和带稳定链接的参考文献。英文版使用自然学术英语，不做机械逐句翻译。

不得生成 \`.tex\`、PDF、DOCX、BibTeX 或虚构附件。除非待评估 Idea 完全缺失，否则不要以追问代替分析；信息不足处应明确假设、降低置信度并给出核验方法。`;
  }

  return `# Evaluate and Refine a Computer Science Research Idea

You are a strict but constructive CS domain expert, reviewer, and experimental lead. First recover the user's idea as a testable research contract, then stress-test it against authentic literature, code, data, and resource constraints. Do not mistake fluent wording for a strong idea, and do not replace evidence with generic criticism.

## Configuration
- Research direction: ${direction}
- Idea to evaluate: ${idea}
- Dataset or data condition: ${dataset}
- Literature window: focus on the most recent ${preferences.recentYears} years as of the execution date
- Venue scope: ${venues}
- SOTA objective: ${preferences.pursueSota ? "required; the optimized idea must specify a verifiable dataset, metric, and strong baselines without depending on an unexplained marginal gain" : "not required; judge value by scientific contribution rather than leaderboard rank"}
- Resources and execution limits: ${resources}
- Optimization freedom: ${freedom}
- Additional evaluation criteria: ${criteria}

## Evidence rules
1. Establish the execution date and search around the idea's problem, claims, mechanism, data, metrics, baselines, and failure conditions. Focus on the most recent ${preferences.recentYears} years and list indispensable foundational work separately.
2. Prefer official proceedings, OpenReview, publisher pages, original arXiv records, project pages, dataset pages, and official repositories. Verify title, authors, year, venue, version, and stable link.
3. Retrieve the nearest direct competitors, not merely papers sharing the topic. Compare problem definition, assumptions, mechanism, data, evaluation protocol, evidence, and contribution boundary.
4. Never equate an unsuccessful search with absolute novelty. Never invent conclusions, results, SOTA values, dataset sizes, licenses, or code status. Separate source facts, author claims, and your inferences.
5. For a named dataset, verify provenance, access or license, split, metrics, leakage risk, saturation, and current strong baselines. Evaluate private data only from user-supplied facts.

## Stage 1 — Extract the idea contract
Restate the idea in its strongest specific form without inventing facts:
- The concrete problem that still exists today;
- One-sentence nugget;
- Falsifiable main hypothesis and expected claims;
- Mechanism or research design;
- Data, metrics, baselines, and minimum decisive experiment;
- Dependencies, contribution type, and explicit non-claims.

Mark missing, ambiguous, or contradictory fields. Do not optimize yet; first make the evaluation target accurate.

## Stage 2 — Multi-evidence stress test
Inspect the idea through the lenses of a domain expert, skeptical reviewer, and experimental lead, then synthesize one judgment:
1. Clarity: are the problem, hypothesis, mechanism, and success condition operational?
2. Novelty: does the substantive difference from nearest work survive, or is this a model swap, dataset swap, or renaming?
3. Significance: can the work produce interpretable, cumulative knowledge even if the expected result is weak?
4. Validity: do mechanism and hypothesis align, do metrics measure the intended construct, and do causal or generalization claims stay bounded?
5. Feasibility: do data, compute, time, engineering, annotation, ethics, and licensing fit?
6. Competition and timing: how crowded is the space, how likely is scooping, and what comparative advantage exists?
7. Evidence and reproducibility readiness: are strong baselines, implementations, protocols, and a minimum experiment available?
8. SOTA dependence: ${preferences.pursueSota ? "is the target precise, would reaching it constitute a contribution, and would the idea retain value if it misses?" : "does the idea secretly depend on hoped-for performance, and is its non-SOTA value explicit enough?"}

For every dimension, provide a 1–5 rating, evidence, confidence, and severity (fatal / major but repairable / minor). Never let an average cancel a fatal flaw. Add a nearest-work comparison table, the strongest objection, and the evidence that could defeat that objection.

## Stage 3 — Cohesive optimization
Do not optimize by patching. Never keep a broken idea and compensate by appending qualifiers, extra modules, more datasets, or a list of disclaimers. Identify the smallest complete research proposition, then recompose the problem, hypothesis, mechanism, evaluation, and contribution so the optimized idea reads as one coherent research design.

Optimization boundary: ${freedom}. Never invent data, results, resources, or literature. Every change must resolve an identified weakness; remove complexity with no independent function.

Return:
- What is retained, removed, and changed, with reasons;
- One complete, self-consistent optimized idea contract ready for discussion;
- The minimum decisive experiment, first-week plan, and measurable or observable success and stop conditions;
- If two routes are valid but mutually exclusive, recommend one and list the other as an alternative rather than merging them into a bloated design.

## Final decision
Give exactly one primary decision: Pursue, Refine, Park, or Stop. State the decisive reason, largest remaining uncertainty, and next action. Park requires explicit revisit triggers; Stop requires a clear account of why the original idea is no longer worth the investment.

## Output files
Create two semantically aligned, directly downloadable Markdown files:
1. \`<topic_slug>_idea_evaluation_zh.md\`
2. \`<topic_slug>_idea_evaluation_en.md\`

Both files must contain the configuration snapshot, extracted idea contract, search protocol and coverage, nearest-work comparison, multidimensional evaluation, fatal and repairable weaknesses, optimization changes, complete optimized idea, minimum validation plan, final decision, and references with stable links. Write the Chinese version naturally and the English version in natural academic English rather than translating sentence by sentence.

Do not create TeX, PDF, DOCX, BibTeX, or invented attachments. Unless the idea itself is entirely missing, do not replace analysis with follow-up questions; state assumptions, lower confidence, and provide verification steps where information is incomplete.`;
}

export function buildIdeaPrompt(
  mode: IdeaWorkbenchMode,
  preferences: IdeaPreferences,
  language: Language,
) {
  return mode === "discovery"
    ? discoveryPrompt(preferences, language)
    : evaluationPrompt(preferences, language);
}
