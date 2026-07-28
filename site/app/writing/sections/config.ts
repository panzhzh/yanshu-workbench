import type { Language } from "../../config";
import type {
  NumberRange,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../../workbench/types";

const SECTION_IDS = [
  "abstract",
  "introduction",
  "related-work",
  "method",
  "experiments-results",
  "discussion",
  "conclusion",
  "custom",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const SECTION_NAMES: Record<SectionId, Record<Language, string>> = {
  abstract: { zh: "Abstract", en: "Abstract" },
  introduction: { zh: "Introduction", en: "Introduction" },
  "related-work": { zh: "Related Work", en: "Related Work" },
  method: { zh: "Method", en: "Method" },
  "experiments-results": {
    zh: "Experiments & Results",
    en: "Experiments & Results",
  },
  discussion: {
    zh: "Discussion & Limitations",
    en: "Discussion & Limitations",
  },
  conclusion: { zh: "Conclusion", en: "Conclusion" },
  custom: { zh: "自定义章节", en: "Custom section" },
};

const OUTPUT_LANGUAGE_NAMES = {
  en: { zh: "英文", en: "English" },
  zh: { zh: "中文", en: "Chinese" },
} as const;

const VENUE_PROFILE_NAMES = {
  conference: { zh: "会议写法", en: "Conference style" },
  journal: { zh: "期刊写法", en: "Journal style" },
  preserve: { zh: "沿用原稿", en: "Preserve manuscript style" },
} as const;

const SECTION_LENGTH_PRESETS = {
  conference: {
    abstract: [190, 220],
    introduction: [450, 550],
    "related-work": [450, 650],
    method: [800, 1200],
    "experiments-results": [1200, 2200],
    discussion: [350, 550],
    conclusion: [180, 220],
    custom: [400, 800],
  },
  journal: {
    abstract: [200, 250],
    introduction: [700, 1000],
    "related-work": [900, 1500],
    method: [1400, 2400],
    "experiments-results": [1800, 3500],
    discussion: [700, 1100],
    conclusion: [250, 400],
    custom: [600, 1200],
  },
  preserve: {
    abstract: [180, 250],
    introduction: [500, 1000],
    "related-work": [500, 1200],
    method: [800, 2000],
    "experiments-results": [1000, 3000],
    discussion: [400, 900],
    conclusion: [180, 350],
    custom: [400, 1000],
  },
} as const satisfies Record<
  keyof typeof VENUE_PROFILE_NAMES,
  Record<SectionId, NumberRange>
>;

const SOURCE_STAGE_NAMES = {
  notes: { zh: "提纲与证据", en: "Outline and evidence" },
  partial: { zh: "已有不完整章节", en: "Partial section" },
  manuscript: { zh: "完整论文上下文", en: "Full manuscript context" },
} as const;

const REVISION_DEPTH_NAMES = {
  preserve: { zh: "保留式整合", en: "Conservative integration" },
  deep: { zh: "证据驱动深写", en: "Evidence-led deep writing" },
  restructure: { zh: "重组论证", en: "Argument restructuring" },
} as const;

const EXPERIMENT_SCOPE_NAMES = {
  setup: { zh: "实验设置", en: "Experimental setup" },
  results: { zh: "主结果", en: "Main results" },
  ablation: { zh: "消融与机制分析", en: "Ablation and mechanism analysis" },
  robustness: { zh: "稳健性与效率", en: "Robustness and efficiency" },
  qualitative: { zh: "案例与定性分析", en: "Case and qualitative analysis" },
} as const;

function stringValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback = "",
) {
  const value = values[id];
  return typeof value === "string" ? value : fallback;
}

function booleanValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback = false,
) {
  const value = values[id];
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: number,
) {
  const value = values[id];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function rangeValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: NumberRange,
): NumberRange {
  const value = values[id];
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [value[0], value[1]];
  }
  return fallback;
}

function multiValue(values: Readonly<WorkbenchValues>, id: string) {
  const value = values[id];
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : [];
}

function enumValue<T extends string>(
  values: Readonly<WorkbenchValues>,
  id: string,
  allowed: readonly T[],
  fallback: T,
) {
  const value = values[id];
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function rangeText(range: NumberRange, language: Language, unit: string) {
  return language === "zh"
    ? `${range[0]}–${range[1]} ${unit}`
    : `${range[0]}–${range[1]} ${unit}`;
}

function sectionSpecificInstructions(
  values: Readonly<WorkbenchValues>,
  section: SectionId,
  language: Language,
  manuscriptLanguage: "en" | "zh",
) {
  const englishManuscript = manuscriptLanguage === "en";
  if (section === "abstract") {
    const keywords = rangeValue(values, "keywordCount", [4, 5]);
    const keywordWords = rangeValue(values, "keywordWords", [1, 2]);
    const resultNumbers = rangeValue(values, "abstractResultNumbers", [2, 4]);
    return language === "zh"
      ? `- 写成一个连续段落，依次完成问题与当前缺口、方法桥接、核心机制、主要证据和证据允许的意义；除非目标 venue 的官方格式明确要求结构化摘要。
- 摘要不使用引用。${rangeText(resultNumbers, language, "个")}结果数字只是建议密度；理论、定性或证据不需要数字时可以为 0，绝不能为命中数量补数字。避免专有名词和缩写造成阅读负担；非本文方法缩写仅在确有重复使用价值时采用，并在首次出现时给出全称（数据集等公认名称除外）。
- 另给出 ${rangeText(keywords, language, "个")} ${englishManuscript ? `Keywords，每个建议 ${rangeText(keywordWords, language, "个英文单词")}` : "中文关键词，每个保持为简洁、可检索的术语"}。`
      : `- Use one continuous paragraph that moves through the problem and current gap, method bridge, core mechanism, primary evidence, and evidence-supported implication, unless the target venue officially requires a structured abstract.
- Use no citations. ${rangeText(resultNumbers, language, "result numbers")} is a suggested density only; a theoretical, qualitative, or otherwise non-numeric abstract may use zero, and values must never be added to meet the range. Avoid dense paper-internal terminology and acronyms; use a non-method acronym only when repeated use is genuinely useful, and define it at first mention except for conventional dataset names.
- Provide ${rangeText(keywords, language, englishManuscript ? "Keywords" : "Chinese keywords")}${englishManuscript ? `, preferably ${rangeText(keywordWords, language, "English words")} each` : " as concise, searchable Chinese terms"}.`;
  }

  if (section === "introduction") {
    const contributionCount = numberValue(values, "contributionCount", 3);
    const contributionWords = rangeValue(
      values,
      "contributionWords",
      [18, 28],
    );
    const contributionWe = booleanValue(values, "contributionWe", true);
    const navigation = booleanValue(values, "navigationParagraph", false);
    const citationsPerSentence = numberValue(
      values,
      "citationsPerSentence",
      4,
    );
    const contributionForm = englishManuscript
      ? language === "zh"
        ? `以 \`This paper makes ${contributionCount} contributions:\` 引导 LaTeX \`itemize\`；目标为 ${contributionCount} 条互不重叠、可追溯的贡献，每条一句、建议 ${rangeText(contributionWords, language, "词")}${contributionWe ? "，并以 `We` 开头" : "，不强制以 `We` 开头"}。证据不足时应减少条目并说明，不能拆分凑数`
        : `Lead a LaTeX \`itemize\` with \`This paper makes ${contributionCount} contributions:\`. Aim for ${contributionCount} non-overlapping, traceable items, one sentence each at about ${rangeText(contributionWords, language, "words")}${contributionWe ? " beginning with `We`" : " without forcing a `We` opening"}. Use fewer items and explain why when evidence is insufficient; never split claims to hit the count`
      : language === "zh"
        ? `以“本文的主要贡献如下：”引导 LaTeX \`itemize\`；目标为 ${contributionCount} 条互不重叠、可追溯的中文贡献，每条一句。证据不足时应减少条目并说明，不能拆分凑数`
        : `Lead a LaTeX \`itemize\` with the Chinese sentence “本文的主要贡献如下：”. Aim for ${contributionCount} non-overlapping, traceable Chinese contribution sentences. Use fewer items and explain why when evidence is insufficient; never split claims to hit the count`;
    const navigationInstruction = navigation
      ? englishManuscript
        ? language === "zh"
          ? "末尾增加一个约 65 个英文单词的纯章节导航段；它不计入本节篇幅建议。"
          : "End with a separate roadmap paragraph of about 65 English words, excluded from this section's length guidance."
        : language === "zh"
          ? "末尾增加一个简短中文章节导航段；它不计入本节篇幅建议。"
          : "End with a concise Chinese roadmap paragraph, excluded from this section's length guidance."
      : language === "zh"
        ? "不写只复述章节编号的纯导航段；过渡应服务论证。"
        : "Do not add a paragraph that merely lists section numbers; transitions must advance the argument.";
    return language === "zh"
      ? `- 先建立任务、现实约束与今天仍然存在的问题，再从现有工作归纳尚未解决的缺口；随后用一段解释本文如何改变解决路径，避免提前展开 Method。
- 将“核心思路段”和“贡献列表”分工：前者解释 why/what 的总体桥接，后者只陈述可由方法或实验追溯的交付。${contributionForm}。
- 非本文 claim、作者总结和本文贡献之外的知识判断应有适当引用；单句至多合并 ${citationsPerSentence} 篇真正共同支撑该句的论文。${navigationInstruction}`
      : `- Establish the task, practical constraints, and a problem that still exists today, then synthesize what prior work has not resolved. Follow with one paragraph explaining how this paper changes the solution path without prematurely unpacking Method.
- Separate the core-idea paragraph from the contribution list: the former bridges why and what, while the latter states deliverables traceable to mechanisms or evidence. ${contributionForm}.
- Appropriately cite knowledge claims other than this paper's own claims, synthesis, and contributions; place at most ${citationsPerSentence} genuinely co-supporting papers in one sentence. ${navigationInstruction}`;
  }

  if (section === "related-work") {
    const subsections = rangeValue(values, "relatedSubsections", [3, 4]);
    const oneParagraph = booleanValue(values, "relatedOneParagraph", true);
    const citationsPerSentence = numberValue(
      values,
      "citationsPerSentence",
      4,
    );
    return language === "zh"
      ? `- 建议围绕 ${rangeText(subsections, language, "个")} 决定本文定位的研究问题组织 subsection，而不是逐篇罗列；只为内容独立且充足的主题设标题，不为命中数量拆分。${englishManuscript ? "标题使用 3–7 个英文单词。" : "中文标题保持简洁、可检索。"}${oneParagraph ? "每个 subsection 使用一个信息密度适中的完整段落。" : "段落数由论证需要决定，不机械扩张层级。"}
- 每个 subsection 依次完成研究脉络、关键分歧或局限和综合判断；末句${englishManuscript ? "不超过 18 个英文单词，不使用 `we`" : "使用一句简短中文综合判断，不使用“我们”"}或本文方法名，可自然落到研究缺口，也可作纯综合结论。
- 单句至多并列 ${citationsPerSentence} 篇真正支撑同一判断的论文；核查现有 cite key 与 BibTeX 元数据，不以 citation dump 代替分析。`
      : `- Aim for ${rangeText(subsections, language, "subsections")} organized around research questions that determine this paper's position rather than papers one by one. Create a heading only for an independent theme with enough evidence; never split content to hit the range. ${englishManuscript ? "Use 3–7 English words per heading." : "Use concise, searchable Chinese headings."} ${oneParagraph ? "Use one information-dense, coherent paragraph per subsection." : "Let the argument determine paragraph count without multiplying heading levels."}
- Move each subsection through the research trajectory, decisive difference or limitation, and synthesis. ${englishManuscript ? "Keep its final sentence within 18 English words and mention neither `we`" : "End with one concise Chinese synthesis sentence that mentions neither “我们”"} nor the method name; let it either expose the gap naturally or close with a pure synthesis.
- Place at most ${citationsPerSentence} genuinely co-supporting papers in one sentence. Verify existing cite keys and BibTeX metadata, and never substitute citation dumping for analysis.`;
  }

  if (section === "method") {
    const overview = booleanValue(values, "methodOverview", false);
    const overviewParagraphs = numberValue(values, "overviewParagraphs", 2);
    const overviewWords = rangeValue(values, "overviewWords", [60, 80]);
    const pseudocode = booleanValue(values, "pseudocode", false);
    const pseudocodeLines = numberValue(values, "pseudocodeLines", 12);
    return language === "zh"
      ? `- 从问题形式化进入方法，按核心思想、信息流、机制与必要实现组织 why-driven 叙事；不要写成逐组件说明书，也不要让每句话机械解释“为什么”。
- ${overview ? `设置独立 Overview，使用 ${overviewParagraphs} 个普通段落，建议合计 ${rangeText(overviewWords, language, "词")}，只建立整体路径，不复述框架图。` : "不单设 Overview 标题，在形式化或首个机制前自然引出整体框架。"}
- ${pseudocode ? `仅在算法顺序无法由正文清楚表达时提供伪代码，建议不超过 ${pseudocodeLines} 行，并与正文符号严格一致。` : "不新增伪代码；保留原稿中确有必要且有证据支持的算法表达。"} 标题层级只服务科学上独立且内容充足的单元。`
      : `- Move from problem formulation into the method and organize a why-driven narrative around the central idea, information flow, mechanisms, and necessary implementation. Do not turn the section into a component manual or make every sentence mechanically explain “why.”
- ${overview ? `Use a standalone Overview with ${overviewParagraphs} ordinary paragraphs and about ${rangeText(overviewWords, language, "words")} in total; establish the full path without narrating the framework figure.` : "Do not create a standalone Overview heading; introduce the overall framework naturally before formalization or the first mechanism."}
- ${pseudocode ? `Include pseudocode only when prose cannot express the algorithmic sequence clearly; keep it within about ${pseudocodeLines} lines and align every symbol with the text.` : "Add no new pseudocode; retain an existing algorithm only when it is necessary and evidence-grounded."} Create a heading only for a scientifically distinct unit with enough content.`;
  }

  if (section === "experiments-results") {
    const selectedScopes = multiValue(values, "experimentScope");
    const scopeNames = selectedScopes
      .map(
        (id) =>
          EXPERIMENT_SCOPE_NAMES[id as keyof typeof EXPERIMENT_SCOPE_NAMES]?.[
            language
          ],
      )
      .filter(Boolean)
      .join(language === "zh" ? "、" : ", ");
    const paragraphWords = rangeValue(values, "visualParagraphWords", [70, 150]);
    const numericDensity = rangeValue(values, "numbersPerParagraph", [0, 4]);
    return language === "zh"
      ? `- 本次覆盖：${scopeNames || "未指定子范围"}。若包含实验设置，在 \`Datasets and Experimental Setup\` 中清楚区分 Datasets、Experimental Configuration、Evaluation Metrics 与 Baselines；只在内容充足时使用真实标题层级。
- 保留现有核心实验与结果，不因篇幅建议压缩决定性证据。每张图或表通常对应 ${rangeText(paragraphWords, language, "词")} 的分析，可按重要性调整：Main Results 应获得更完整的比较、原因与边界，补充图表只回答其独有问题。
- 图表承载完整数值，正文提炼模式、关键比较和可解释边界；建议每段只选 ${rangeText(numericDensity, language, "个")} 关键数字，不机械复述全部单元格。两段分析时，首段回答发现与比较，次段解释机制、条件或异常。`
      : `- Cover: ${scopeNames || "no sub-scope specified"}. If setup is included, distinguish Datasets, Experimental Configuration, Evaluation Metrics, and Baselines inside \`Datasets and Experimental Setup\`; use actual heading levels only when each unit has enough content.
- Preserve core experiments and results rather than compressing decisive evidence to meet length guidance. A visual usually receives ${rangeText(paragraphWords, language, "words")} of analysis, adjusted by importance: Main Results deserve fuller comparison, explanation, and boundary analysis, while a supporting visual should answer only its unique question.
- Let the visual carry complete values and use prose for patterns, decisive comparisons, and interpretation boundaries. Prefer only ${rangeText(numericDensity, language, "key numbers")} per paragraph rather than narrating cells. With two paragraphs, use the first for findings/comparison and the second for mechanism, conditions, or anomalies.`;
  }

  if (section === "discussion") {
    const themes = rangeValue(values, "discussionThemes", [3, 5]);
    const limitations = booleanValue(values, "mergeLimitations", true);
    return language === "zh"
      ? `- 建议围绕 ${rangeText(themes, language, "个")} 真实且互不重叠的综合主题解释机制、适用边界、外部效度与实践或理论含义；Discussion 不是 Results 的复述，证据不足时应减少主题而不是拆分凑数。
- 不需要重新引用实验章节中的图表，数字引用宜少且不超过 3 个；优先解释“证据意味着什么、在什么条件下成立、哪里仍未知”。
- ${limitations ? "将 Limitations 作为本节中的清楚单元，与讨论共享证据边界；具体且不自我贬损。" : "Discussion 与 Limitations 保持独立；本节不得替代或弱化已有局限。"}`
      : `- Aim for ${rangeText(themes, language, "non-overlapping synthesis themes")} grounded in the paper's actual findings and covering mechanism, scope, external validity, and practical or theoretical implications. Discussion is not a replay of Results; use fewer themes when evidence is insufficient rather than splitting content to hit the range.
- It need not cite experiment figures again, and may use no numbers; in any case, keep numeric references to three or fewer. Prioritize what the evidence means, when it holds, and what remains unknown.
- ${limitations ? "Integrate a clearly delimited Limitations unit whose boundaries share the evidence base of the discussion; be specific without being self-defeating." : "Keep Discussion and Limitations separate; this section must not replace or dilute existing limitations."}`;
  }

  if (section === "conclusion") {
    return language === "zh"
      ? "- 回答本文真正研究的问题，回收方法与最强证据，再给出边界明确的意义；不新增引用、实验、数字、术语或未来工作清单。"
      : "- Answer the paper's actual research question, reconnect the method with its strongest evidence, and state a bounded implication. Add no new citation, experiment, value, term, or future-work list.";
  }

  const customName = stringValue(values, "customSectionName").trim();
  return language === "zh"
    ? `- 目标为“${customName || "用户自定义章节"}”。先从论文中的相邻章节、显式提纲和证据判断该章节应承担的唯一功能，再据此组织内容；不要照搬其他标准章节的模板。`
    : `- The target is “${customName || "the user-defined section"}.” Infer its unique function from adjacent sections, the explicit outline, and available evidence before organizing it; do not force the template of a standard section onto it.`;
}

function literatureInstructions(
  values: Readonly<WorkbenchValues>,
  section: SectionId,
  language: Language,
) {
  if (
    !["introduction", "related-work"].includes(section) ||
    !booleanValue(values, "literatureSearch", true)
  ) {
    return "";
  }
  const recentYears = numberValue(values, "recentYears", 2);
  return language === "zh"
    ? `\n## 文献补充\n允许联网补充定位所必需的文献。优先检索近 ${recentYears} 年相关顶会与顶刊的一手论文，同时保留不可替代的经典工作；逐条核验标题、作者、年份、venue、DOI/官方 URL 与论文实际结论。先检查现有 cite key 和 .bib，新增引用必须给出可直接合并且已核验的完整 BibTeX，不得用搜索摘要代替原文证据。`
    : `\n## Literature Support\nOnline search is allowed for positioning-essential literature. Prioritize primary papers from relevant leading conferences and journals in the past ${recentYears} years while retaining indispensable foundational work. Verify title, authors, year, venue, DOI/official URL, and the paper's actual finding. Check existing cite keys and the .bib first; provide a complete verified BibTeX entry for every addition, and never treat a search snippet as paper evidence.`;
}

function buildSectionWritingPrompt(
  values: Readonly<WorkbenchValues>,
  language: Language,
) {
  const section = enumValue(
    values,
    "section",
    SECTION_IDS,
    "introduction",
  );
  const sourceStage = enumValue(
    values,
    "sourceStage",
    ["notes", "partial", "manuscript"] as const,
    "manuscript",
  );
  const revisionDepth = enumValue(
    values,
    "revisionDepth",
    ["preserve", "deep", "restructure"] as const,
    "deep",
  );
  const venueProfile = enumValue(
    values,
    "venueProfile",
    ["conference", "journal", "preserve"] as const,
    "conference",
  );
  const outputLanguage = enumValue(
    values,
    "outputLanguage",
    ["en", "zh"] as const,
    "en",
  );
  const targetVenue = stringValue(values, "targetVenue").trim();
  const useLengthGuidance = booleanValue(values, "useLengthGuidance", false);
  const suggestedWords = rangeValue(values, "suggestedWords", [450, 550]);
  const customInstructions = stringValue(values, "customInstructions").trim();
  const sectionName =
    section === "custom" && stringValue(values, "customSectionName").trim()
      ? stringValue(values, "customSectionName").trim()
      : SECTION_NAMES[section][language];

  const venueStyle =
    venueProfile === "conference"
      ? language === "zh"
        ? "采用高密度、claim-first 的会议写法：段落功能集中，过渡简短自然，但不压缩核心机制或证据；不要盲目增加标题层级。"
        : "Use a dense, claim-first conference style with focused paragraphs and brief natural transitions, without compressing core mechanisms or evidence or multiplying headings."
      : venueProfile === "journal"
        ? language === "zh"
          ? "采用累积论证型期刊写法：充分解释研究脉络、机制理由和证据边界，但只为科学上独立且内容充足的单元设置标题。"
          : "Use a cumulative journal style with fuller positioning, mechanism rationale, and evidence boundaries, while reserving headings for scientifically distinct units with enough content."
        : language === "zh"
          ? "沿用原稿已建立的学术语气、目录层级和论证密度，只有当前写法妨碍准确理解时才调整。"
          : "Preserve the manuscript's established academic voice, hierarchy, and argument density, changing them only when they obstruct accurate understanding.";
  const sourceStageInstruction =
    sourceStage === "notes"
      ? language === "zh"
        ? "先把提纲和证据映射为段落功能与相邻章节接口，再完成章节草稿；缺失证据保留清楚待补项，不假定已有正文。"
        : "Map the outline and evidence to paragraph functions and adjacent-section interfaces before drafting; preserve explicit evidence gaps and do not assume existing prose."
      : sourceStage === "partial"
        ? language === "zh"
          ? "先识别不完整章节中可保留的有效论证，再补齐缺失功能并融合重组；不得把新内容作为补丁附在末尾。"
          : "Identify valid argument units in the partial section, then fill missing functions through integrated restructuring rather than appending patches."
        : language === "zh"
          ? "以完整论文为上下文核对本节与前后章节的术语、claim、证据和重复内容，只修改本节及必要接口。"
          : "Use the full manuscript to check terminology, claims, evidence, and overlap across adjacent sections, changing only this section and necessary interfaces.";
  const revisionInstruction =
    revisionDepth === "preserve"
      ? language === "zh"
        ? "尽量保留有效段落顺序和有辨识度的原句，只在准确性、连贯性或证据接口需要时整合修改。"
        : "Preserve functional paragraph order and distinctive valid prose, integrating changes only when accuracy, coherence, or evidence interfaces require them."
      : revisionDepth === "restructure"
        ? language === "zh"
          ? "可重建段落顺序和论证路径，但必须保留所有高价值表达与有效证据，并把结构性变化列入 high-risk diff。"
          : "The paragraph order and argument path may be rebuilt, but all high-value prose and valid evidence must be preserved, with structural changes listed in the high-risk diff."
        : language === "zh"
          ? "允许深度调整段落内部和段落之间的论证，以保留原稿优点的方式形成更完整的章节，而不是从零改写。"
          : "Deeply improve within- and cross-paragraph reasoning while preserving the manuscript's strengths; do not rewrite from zero.";

  const venueVerification = targetVenue
    ? language === "zh"
      ? `目标 venue 为“${targetVenue}”。联网核验其当前官方作者指南、官方模板和适用于本章节的政策，以官方来源为准，并在报告中记录 URL 与核验日期；不得凭领域印象编造格式、匿名或篇幅规则。`
      : `The target venue is “${targetVenue}.” Verify its current official author instructions, official template, and section-relevant policies online; use official sources and record their URLs and verification date in the report. Never infer formatting, anonymity, or length rules from field convention.`
    : language === "zh"
      ? "未指定具体 venue；保持通用学术写法，不虚构 venue 规则。"
      : "No specific venue is named; remain venue-neutral and invent no venue rule.";

  const lengthLine = useLengthGuidance
    ? language === "zh"
      ? `建议篇幅为 ${rangeText(suggestedWords, language, "词")}。这只是内容规划参考，不是硬上限；根据证据和章节功能可偏离，并在报告中说明。`
      : `The suggested length is ${rangeText(suggestedWords, language, "words")}. This guides content planning rather than imposing a hard cap; depart when evidence or section function requires it and explain why in the report.`
    : language === "zh"
      ? "不设置字数限制或建议；由证据与章节功能决定必要长度。"
      : "No word limit or recommendation applies; let evidence and section function determine the necessary length.";

  const customLine = customInstructions
    ? language === "zh"
      ? `\n- 个性化要求：${customInstructions}`
      : `\n- Custom requirement: ${customInstructions}`
    : "";

  if (language === "zh") {
    return `# 分章节证据驱动写作

## 角色
你是一名熟悉该论文具体研究方向的资深学术作者与 LaTeX 编辑。本轮只完成 ${sectionName}，但先理解全文的研究问题、方法、证据与术语体系。

## 输入与取证
在同一对话中读取当前可用的主 .tex 及其引用文件、.bib、最新 PDF，以及作者提供的提纲、实验结果、表格、图片或补充材料。当前材料阶段为“${SOURCE_STAGE_NAMES[sourceStage].zh}”；若尚无主稿，就以提纲和证据包建立章节接口，不得假定不存在的上下文。以可追溯证据为准；缺失信息应明确列入待补项，不得推测数据、实验、引用、公式或贡献。PDF 和 figures/ 仅在提供时使用。

## 配置目标
- 目标章节：${sectionName}
- 输出语言：${OUTPUT_LANGUAGE_NAMES[outputLanguage].zh}
- 写作深度：${REVISION_DEPTH_NAMES[revisionDepth].zh}
- 写作风格：${VENUE_PROFILE_NAMES[venueProfile].zh}
- ${lengthLine}
- ${venueVerification}${customLine}

## 执行重点
${venueStyle}
- ${sourceStageInstruction}
- ${revisionInstruction}
- 先建立本章节的“功能—证据—段落”映射，再写成一个完整、连续、可替换的章节；修改应融合进论证，不能以补丁句、附加段或局部拼接掩盖结构问题。
- 保留原稿中准确、有辨识度的表达。重组时不得静默改变标题、方法名、claim 强度、实验结论或术语；AI 可自动选择更优方案，但所有高风险变化必须在报告中给出 before/after、依据与影响。
${sectionSpecificInstructions(values, section, "zh", outputLanguage)}
${literatureInstructions(values, section, "zh")}

## 交付
1. 完整 ${sectionName} LaTeX，可直接替换目标章节，不输出零散 patch。
2. 如新增引用，给出完整、已核验且不与现有 key 冲突的 BibTeX。
3. 一份精简写作报告：段落功能与证据来源、未解决信息、篇幅建议采纳情况、官方规则来源，以及 high-risk diff（若有）。

输出前核对事实、数字、术语、cite key、label/ref 和与相邻章节的接口。`;
  }

  return `# Evidence-led Section Writing

## Role
Act as a senior academic author and LaTeX editor familiar with this paper's specific research area. Complete only ${sectionName} in this task, but first understand the paper's research question, method, evidence, and terminology system.

## Inputs and Evidence
Read the currently available main .tex and included files, .bib, latest PDF, and any author-provided outline, experimental results, tables, figures, or supplements in the same conversation. The current material stage is “${SOURCE_STAGE_NAMES[sourceStage].en}.” If no manuscript exists yet, establish the section interfaces from the outline and evidence pack without assuming missing context. Use only traceable evidence; list missing information instead of guessing a value, experiment, citation, equation, or contribution. Use the PDF and figures/ only when provided.

## Configured Target
- Target section: ${sectionName}
- Manuscript language: ${OUTPUT_LANGUAGE_NAMES[outputLanguage].en}
- Writing depth: ${REVISION_DEPTH_NAMES[revisionDepth].en}
- Style profile: ${VENUE_PROFILE_NAMES[venueProfile].en}
- ${lengthLine}
- ${venueVerification}${customLine}

## Execution Priorities
${venueStyle}
- ${sourceStageInstruction}
- ${revisionInstruction}
- Build a function–evidence–paragraph map before writing, then produce one coherent replacement section. Integrate revisions into the argument rather than hiding structural problems with patch sentences, appended paragraphs, or local splicing.
- Preserve accurate, distinctive existing prose. Do not silently change the title, method name, claim strength, experimental conclusion, or terminology. The AI may choose the best solution automatically, but every high-risk change needs a before/after, rationale, and impact in the report.
${sectionSpecificInstructions(values, section, "en", outputLanguage)}
${literatureInstructions(values, section, "en")}

## Deliverables
1. Complete ${sectionName} LaTeX ready to replace the target section, not a fragmentary patch.
2. For every added citation, a complete verified BibTeX entry with a non-conflicting key.
3. A concise writing report covering paragraph functions and evidence, unresolved inputs, use of length guidance, official-rule sources, and any high-risk diff.

Before delivery, check facts, values, terminology, cite keys, labels/refs, and interfaces with adjacent sections.`;
}

export const SECTION_WRITING_WORKBENCH = {
  id: "section-writing",
  activePage: "section-writing",
  copy: {
    zh: {
      eyebrow: "SECTION WRITING",
      title: "分章节写作",
      subtitle:
        "按章节功能、现有证据和目标写法生成一份可直接替换的完整章节。",
      preset: "证据驱动 · 完整章节 · 非补丁式写作",
      reset: "恢复默认配置",
      resetHint: "恢复 Introduction、会议写法和默认章节约束。",
      inputTitle: "写作材料",
      inputItems: [
        "主稿 .tex",
        "提纲或已有章节",
        ".bib（按需）",
        "PDF / 图表（可选）",
      ],
      inputHint:
        "只需提供当前拥有的材料。模型必须明确证据缺口，不得用常识补造论文事实。",
      promptTitle: "分章节写作",
      promptPurpose:
        "完整理解上下文后，生成一个证据可追溯、可直接替换的目标章节。",
      switchPromptLanguage: "切换 Prompt 语言",
      copy: "复制",
      copied: "已复制",
      expand: "展开",
      collapse: "收起",
      clipboardError: "复制失败，请展开后手动选择文本。",
      on: "开启",
      off: "关闭",
    },
    en: {
      eyebrow: "SECTION WRITING",
      title: "Section-by-section writing",
      subtitle:
        "Generate a complete replacement section from its function, available evidence, and target writing profile.",
      preset: "Evidence-led · complete section · integrated writing",
      reset: "Restore defaults",
      resetHint:
        "Restore Introduction, conference style, and default section controls.",
      inputTitle: "Writing materials",
      inputItems: [
        "Main .tex",
        "Outline or existing section",
        ".bib (as needed)",
        "PDF / visuals (optional)",
      ],
      inputHint:
        "Provide only the materials you have. The model must expose evidence gaps rather than fill paper facts from convention.",
      promptTitle: "Section writing",
      promptPurpose:
        "Understand the surrounding manuscript and write one traceable, drop-in section.",
      switchPromptLanguage: "Switch Prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError:
        "Copy failed. Expand the card and select the text manually.",
      on: "On",
      off: "Off",
    },
  },
  controls: [
    {
      id: "section",
      kind: "select",
      label: { zh: "目标章节", en: "Target section" },
      description: {
        zh: "一次只写一个章节，让证据、段落功能和输出边界保持清楚。",
        en: "Write one section at a time to keep evidence, paragraph functions, and output boundaries clear.",
      },
      defaultValue: "introduction",
      options: [
        { value: "abstract", label: { zh: "Abstract", en: "Abstract" } },
        {
          value: "introduction",
          label: { zh: "Introduction", en: "Introduction" },
        },
        {
          value: "related-work",
          label: { zh: "Related Work", en: "Related Work" },
        },
        { value: "method", label: { zh: "Method", en: "Method" } },
        {
          value: "experiments-results",
          label: {
            zh: "Experiments & Results",
            en: "Experiments & Results",
          },
        },
        {
          value: "discussion",
          label: {
            zh: "Discussion & Limitations",
            en: "Discussion & Limitations",
          },
        },
        {
          value: "conclusion",
          label: { zh: "Conclusion", en: "Conclusion" },
        },
        {
          value: "custom",
          label: { zh: "自定义章节", en: "Custom section" },
        },
      ],
    },
    {
      id: "customSectionName",
      kind: "text",
      label: { zh: "章节名称", en: "Section name" },
      description: {
        zh: "输入论文中实际使用的章节名或计划名称。",
        en: "Enter the actual or planned section name used by the paper.",
      },
      defaultValue: "",
      placeholder: {
        zh: "例如 Threats to Validity",
        en: "e.g., Threats to Validity",
      },
      visibleWhen: (values) => stringValue(values, "section") === "custom",
    },
    {
      id: "sourceStage",
      kind: "segmented",
      label: { zh: "现有材料阶段", en: "Source stage" },
      description: {
        zh: "决定模型是在证据上起草、补全已有章节，还是结合全文重写。",
        en: "Tell the model whether to draft from evidence, complete a partial section, or work within full-paper context.",
      },
      defaultValue: "manuscript",
      options: [
        {
          value: "notes",
          label: { zh: "提纲与证据", en: "Outline & evidence" },
        },
        {
          value: "partial",
          label: { zh: "不完整章节", en: "Partial section" },
        },
        {
          value: "manuscript",
          label: { zh: "完整论文", en: "Full manuscript" },
        },
      ],
    },
    {
      id: "revisionDepth",
      kind: "select",
      label: { zh: "写作深度", en: "Writing depth" },
      description: {
        zh: "默认深写并保留已有优点；只有论证结构确有问题时才重组。",
        en: "Deep writing preserves existing strengths by default; restructure only when the argument requires it.",
      },
      defaultValue: "deep",
      options: [
        {
          value: "preserve",
          label: { zh: "保留式整合", en: "Conservative integration" },
        },
        {
          value: "deep",
          label: { zh: "证据驱动深写", en: "Evidence-led deep writing" },
        },
        {
          value: "restructure",
          label: { zh: "重组论证", en: "Argument restructuring" },
        },
      ],
    },
    {
      id: "venueProfile",
      kind: "segmented",
      label: { zh: "写作风格", en: "Writing profile" },
      description: {
        zh: "控制论证密度和解释深度，不自动套用任何具体 venue 规则。",
        en: "Control argument density and explanatory depth without assuming a venue-specific rule.",
      },
      defaultValue: "conference",
      options: [
        {
          value: "conference",
          label: { zh: "会议", en: "Conference" },
        },
        { value: "journal", label: { zh: "期刊", en: "Journal" } },
        { value: "preserve", label: { zh: "沿用原稿", en: "Preserve" } },
      ],
    },
    {
      id: "targetVenue",
      kind: "text",
      label: { zh: "目标 venue（可选）", en: "Target venue (optional)" },
      description: {
        zh: "填写后要求只从当前官方指南和模板核验相关规则。",
        en: "When provided, relevant rules must be verified from current official instructions and templates.",
      },
      defaultValue: "",
      placeholder: {
        zh: "例如 NeurIPS 2026 / IEEE T-PAMI",
        en: "e.g., NeurIPS 2026 / IEEE T-PAMI",
      },
    },
    {
      id: "outputLanguage",
      kind: "segmented",
      label: { zh: "论文语言", en: "Manuscript language" },
      description: {
        zh: "独立于右侧 Prompt 的操作说明语言。",
        en: "Independent of the instruction language used by the Prompt.",
      },
      defaultValue: "en",
      options: [
        { value: "en", label: { zh: "English", en: "English" } },
        { value: "zh", label: { zh: "中文", en: "Chinese" } },
      ],
    },
    {
      id: "useLengthGuidance",
      kind: "toggle",
      label: { zh: "篇幅建议", en: "Length guidance" },
      description: {
        zh: "默认不限制；开启后只是可偏离的内容规划参考。",
        en: "Off by default; when enabled, it is flexible planning guidance rather than a hard cap.",
      },
      defaultValue: false,
      enabledLabel: { zh: "使用建议区间", en: "Use a suggested range" },
      disabledLabel: { zh: "不限制字数", en: "No word guidance" },
    },
    {
      id: "suggestedWords",
      kind: "range",
      label: { zh: "建议字数", en: "Suggested words" },
      description: {
        zh: "切换章节或会议/期刊时自动载入可修改区间；模型可按证据量和官方规则偏离。",
        en: "Switching the section or profile loads an editable range; the model may depart for evidence volume or official rules.",
      },
      defaultValue: [450, 550],
      min: 50,
      max: 4000,
      step: 10,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) => booleanValue(values, "useLengthGuidance"),
    },
    {
      id: "keywordCount",
      kind: "range",
      label: { zh: "Keywords 数量", en: "Keyword count" },
      description: {
        zh: "默认 4–5 个高信息量术语。",
        en: "Use four to five high-information terms by default.",
      },
      defaultValue: [4, 5],
      min: 3,
      max: 8,
      visibleWhen: (values) => stringValue(values, "section") === "abstract",
    },
    {
      id: "keywordWords",
      kind: "range",
      label: {
        zh: "每个 Keyword 单词数",
        en: "Words per keyword",
      },
      description: {
        zh: "短语应足够明确，但不堆叠长概念。",
        en: "Keep each phrase specific without stacking long concepts.",
      },
      defaultValue: [1, 2],
      min: 1,
      max: 4,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "abstract" &&
        stringValue(values, "outputLanguage") === "en",
    },
    {
      id: "abstractResultNumbers",
      kind: "range",
      label: { zh: "摘要结果数字", en: "Abstract result numbers" },
      description: {
        zh: "建议只保留最能区分贡献且可直接核查的数字。",
        en: "Keep only the most discriminative and directly verifiable values.",
      },
      defaultValue: [2, 4],
      min: 0,
      max: 8,
      visibleWhen: (values) => stringValue(values, "section") === "abstract",
    },
    {
      id: "contributionCount",
      kind: "number",
      label: { zh: "Contribution 条数", en: "Contribution count" },
      description: {
        zh: "每条必须能追溯到方法机制或实验结果。",
        en: "Each item must trace to a method mechanism or experimental result.",
      },
      defaultValue: 3,
      min: 2,
      max: 6,
      visibleWhen: (values) =>
        stringValue(values, "section") === "introduction",
    },
    {
      id: "contributionWords",
      kind: "range",
      label: { zh: "每条贡献建议长度", en: "Words per contribution" },
      description: {
        zh: "每条一整句，优先保证可验证性而不是凑长度。",
        en: "Use one complete sentence, prioritizing verifiability over word matching.",
      },
      defaultValue: [18, 28],
      min: 12,
      max: 45,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "introduction" &&
        stringValue(values, "outputLanguage") === "en",
    },
    {
      id: "contributionWe",
      kind: "toggle",
      label: { zh: "Contribution 使用 We", en: "We-led contributions" },
      description: {
        zh: "只约束 contribution item；正文其他位置不滥用 we/our。",
        en: "Applies only to contribution items; do not overuse we/our elsewhere.",
      },
      defaultValue: true,
      enabledLabel: { zh: "每条以 We 开头", en: "Begin each item with We" },
      disabledLabel: { zh: "不强制 We 开头", en: "Do not force We" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "introduction" &&
        stringValue(values, "outputLanguage") === "en",
    },
    {
      id: "navigationParagraph",
      kind: "toggle",
      label: { zh: "纯章节导航段", en: "Roadmap paragraph" },
      description: {
        zh: "启用时约 65 词、单独成段，且不计入 Introduction 篇幅建议。",
        en: "When enabled, use a separate ≈65-word paragraph excluded from Introduction guidance.",
      },
      defaultValue: false,
      enabledLabel: { zh: "包含导航段", en: "Include roadmap" },
      disabledLabel: { zh: "不包含", en: "Omit roadmap" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "introduction",
    },
    {
      id: "relatedSubsections",
      kind: "range",
      label: { zh: "Related Work 小节数", en: "Related Work subsections" },
      description: {
        zh: "按真正影响定位的研究脉络划分，不为凑数量增加标题。",
        en: "Divide by research trajectories that affect positioning, never to meet a count.",
      },
      defaultValue: [3, 4],
      min: 2,
      max: 6,
      visibleWhen: (values) =>
        stringValue(values, "section") === "related-work",
    },
    {
      id: "relatedOneParagraph",
      kind: "toggle",
      label: { zh: "每小节单段", en: "One paragraph per subsection" },
      description: {
        zh: "适合紧凑会议写法；关闭后仍避免不必要的层级扩张。",
        en: "Useful for compact conference writing; turning it off still avoids needless hierarchy.",
      },
      defaultValue: true,
      enabledLabel: { zh: "每小节一段", en: "One paragraph each" },
      disabledLabel: { zh: "按内容决定", en: "Content-driven" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "related-work",
    },
    {
      id: "literatureSearch",
      kind: "toggle",
      label: { zh: "联网补充文献", en: "Online literature support" },
      description: {
        zh: "只补定位所必需且可核验的论文，并给出完整 BibTeX。",
        en: "Add only positioning-essential, verifiable papers and provide complete BibTeX.",
      },
      defaultValue: true,
      enabledLabel: { zh: "允许检索", en: "Search allowed" },
      disabledLabel: { zh: "只用现有文献", en: "Existing sources only" },
      visibleWhen: (values) =>
        ["introduction", "related-work"].includes(
          stringValue(values, "section"),
        ),
    },
    {
      id: "recentYears",
      kind: "number",
      label: { zh: "优先近 N 年", en: "Prioritize recent N years" },
      description: {
        zh: "同时保留与问题定义直接相关的经典论文。",
        en: "Retain foundational work directly relevant to problem definition.",
      },
      defaultValue: 2,
      min: 1,
      max: 10,
      suffix: { zh: "年", en: "years" },
      visibleWhen: (values) =>
        ["introduction", "related-work"].includes(
          stringValue(values, "section"),
        ) && booleanValue(values, "literatureSearch", true),
    },
    {
      id: "citationsPerSentence",
      kind: "number",
      label: { zh: "单句最多引用论文", en: "Max papers per sentence" },
      description: {
        zh: "默认最多 4 篇，且必须共同支撑同一个判断。",
        en: "Up to four by default, all genuinely supporting the same statement.",
      },
      defaultValue: 4,
      min: 1,
      max: 8,
      visibleWhen: (values) =>
        ["introduction", "related-work"].includes(
          stringValue(values, "section"),
        ),
    },
    {
      id: "methodOverview",
      kind: "toggle",
      label: { zh: "独立 Method Overview", en: "Standalone Method Overview" },
      description: {
        zh: "期刊常用；会议通常在正文自然引出框架。",
        en: "Common in journals; conference papers usually introduce the framework in prose.",
      },
      defaultValue: false,
      enabledLabel: { zh: "设置 Overview", en: "Use Overview" },
      disabledLabel: { zh: "自然引出", en: "Introduce in context" },
      visibleWhen: (values) => stringValue(values, "section") === "method",
    },
    {
      id: "overviewParagraphs",
      kind: "number",
      label: { zh: "Overview 段落数", en: "Overview paragraphs" },
      description: {
        zh: "保持简短，不逐项复述框架图。",
        en: "Keep it compact and do not narrate the framework figure.",
      },
      defaultValue: 2,
      min: 1,
      max: 3,
      visibleWhen: (values) =>
        stringValue(values, "section") === "method" &&
        booleanValue(values, "methodOverview"),
    },
    {
      id: "overviewWords",
      kind: "range",
      label: { zh: "Overview 建议长度", en: "Overview suggested length" },
      description: {
        zh: "只是参考，总体路径清楚即可。",
        en: "A reference only; stop once the overall path is clear.",
      },
      defaultValue: [60, 80],
      min: 40,
      max: 160,
      step: 10,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "method" &&
        booleanValue(values, "methodOverview"),
    },
    {
      id: "pseudocode",
      kind: "toggle",
      label: { zh: "伪代码", en: "Pseudocode" },
      description: {
        zh: "只在顺序性算法无法由正文清楚表达时使用。",
        en: "Use only when prose cannot clearly express the algorithmic sequence.",
      },
      defaultValue: false,
      enabledLabel: { zh: "允许加入", en: "Allow" },
      disabledLabel: { zh: "不新增", en: "Do not add" },
      visibleWhen: (values) => stringValue(values, "section") === "method",
    },
    {
      id: "pseudocodeLines",
      kind: "number",
      label: { zh: "伪代码建议行数", en: "Suggested pseudocode lines" },
      description: {
        zh: "默认不超过 12 行，复杂度由真实算法决定。",
        en: "Twelve lines by default; actual complexity follows the algorithm.",
      },
      defaultValue: 12,
      min: 6,
      max: 30,
      suffix: { zh: "行", en: "lines" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "method" &&
        booleanValue(values, "pseudocode"),
    },
    {
      id: "experimentScope",
      kind: "multi",
      label: { zh: "实验写作范围", en: "Experiment writing scope" },
      description: {
        zh: "可组合设置、结果和分析；默认同时处理实验设置与主结果。",
        en: "Combine setup, results, and analyses; setup and main results are selected by default.",
      },
      defaultValue: ["setup", "results"],
      minSelected: 1,
      options: [
        { value: "setup", label: { zh: "实验设置", en: "Setup" } },
        { value: "results", label: { zh: "主结果", en: "Main results" } },
        {
          value: "ablation",
          label: { zh: "消融与机制", en: "Ablation & mechanism" },
        },
        {
          value: "robustness",
          label: { zh: "稳健性与效率", en: "Robustness & efficiency" },
        },
        {
          value: "qualitative",
          label: { zh: "案例与定性", en: "Case & qualitative" },
        },
      ],
      visibleWhen: (values) =>
        stringValue(values, "section") === "experiments-results",
    },
    {
      id: "visualParagraphWords",
      kind: "range",
      label: { zh: "每张图表对应分析", en: "Analysis per visual" },
      description: {
        zh: "默认 70–150 词，按图表重要性调节，Main Results 应更充分。",
        en: "Use 70–150 words by default, scaled by importance; Main Results deserve fuller treatment.",
      },
      defaultValue: [70, 150],
      min: 40,
      max: 300,
      step: 10,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) =>
        stringValue(values, "section") === "experiments-results",
    },
    {
      id: "numbersPerParagraph",
      kind: "range",
      label: { zh: "每段关键数字", en: "Key numbers per paragraph" },
      description: {
        zh: "图表承载完整数字，正文只提炼最有解释力的证据。",
        en: "Let visuals carry complete values and prose select only explanatory evidence.",
      },
      defaultValue: [0, 4],
      min: 0,
      max: 8,
      visibleWhen: (values) =>
        stringValue(values, "section") === "experiments-results",
    },
    {
      id: "discussionThemes",
      kind: "range",
      label: { zh: "讨论主题", en: "Discussion themes" },
      description: {
        zh: "由真实结果决定，不为命中数量拆分小节。",
        en: "Let actual findings determine themes; never split headings to meet the count.",
      },
      defaultValue: [3, 5],
      min: 2,
      max: 7,
      visibleWhen: (values) => stringValue(values, "section") === "discussion",
    },
    {
      id: "mergeLimitations",
      kind: "toggle",
      label: { zh: "合并 Limitations", en: "Integrate Limitations" },
      description: {
        zh: "合并时仍保持局限边界清楚，不把局限分散成弱化表述。",
        en: "When integrated, preserve a clear limitations boundary rather than diluting it.",
      },
      defaultValue: true,
      enabledLabel: { zh: "合并在本节", en: "Integrate here" },
      disabledLabel: { zh: "保持独立", en: "Keep separate" },
      visibleWhen: (values) => stringValue(values, "section") === "discussion",
    },
    {
      id: "customInstructions",
      kind: "textarea",
      label: { zh: "个性化要求（可选）", en: "Custom requirements (optional)" },
      description: {
        zh: "填写领域惯例、必须保留内容或语言偏好；不能覆盖事实边界。",
        en: "Add field conventions, must-keep content, or language preferences without overriding evidence boundaries.",
      },
      defaultValue: "",
      placeholder: {
        zh: "例如：保留现有三个研究问题；避免使用冒号；仅在贡献列表使用 we。",
        en: "e.g., Keep the three existing research questions; avoid colons; use we only in contributions.",
      },
      span: "full",
    },
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id !== "section" && id !== "venueProfile") return next;

    const section = enumValue(next, "section", SECTION_IDS, "introduction");
    const profile = enumValue(
      next,
      "venueProfile",
      ["conference", "journal", "preserve"] as const,
      "conference",
    );
    next.suggestedWords = SECTION_LENGTH_PRESETS[profile][section];

    if (section === "introduction") {
      next.navigationParagraph = profile === "journal";
    }
    if (section === "method") {
      next.methodOverview = profile === "journal";
    }
    return next;
  },
  buildPrompt: buildSectionWritingPrompt,
} satisfies WorkbenchDefinition;
