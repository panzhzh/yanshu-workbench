import type { Language } from "../../config";
import type {
  LocalizedText,
  WorkbenchCopy,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../../workbench/types";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

function scalar(values: Readonly<WorkbenchValues>, id: string) {
  return String(values[id] ?? "").trim();
}

function enabled(values: Readonly<WorkbenchValues>, id: string) {
  return values[id] === true;
}

function numberValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: number,
) {
  const value = Number(values[id]);
  return Number.isFinite(value) ? value : fallback;
}

function rangeValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: readonly [number, number],
) {
  const value = values[id];
  return Array.isArray(value) && value.length === 2
    ? ([Number(value[0]), Number(value[1])] as const)
    : fallback;
}

function selected(values: Readonly<WorkbenchValues>, id: string) {
  return Array.isArray(values[id]) ? (values[id] as readonly string[]) : [];
}

const SECTION_NAMES: Record<string, LocalizedText> = {
  introduction: text("Introduction", "Introduction"),
  "related-work": text("Related Work", "Related Work"),
  method: text("Method", "Method"),
  "experiments-results": text("Experiments & Results", "Experiments & Results"),
  discussion: text("Discussion", "Discussion"),
  conclusion: text("Conclusion", "Conclusion"),
};

function workbenchCopy(
  seed: Record<
    Language,
    Pick<
      WorkbenchCopy,
      | "eyebrow"
      | "title"
      | "subtitle"
      | "preset"
      | "inputTitle"
      | "inputItems"
      | "inputHint"
      | "promptTitle"
      | "promptPurpose"
    >
  >,
) {
  return {
    zh: {
      ...seed.zh,
      reset: "恢复默认配置",
      resetHint: "恢复引文核查默认值。",
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
      ...seed.en,
      reset: "Restore defaults",
      resetHint: "Restore citation-review defaults.",
      switchPromptLanguage: "Switch prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError: "Copy failed. Expand the prompt and select it manually.",
      on: "On",
      off: "Off",
    },
  } satisfies Record<Language, WorkbenchCopy>;
}

function buildCitationPrompt(
  values: Readonly<WorkbenchValues>,
  language: Language,
) {
  const action = scalar(values, "action") || "repair";
  const scope = selected(values, "sections");
  const scopeLabel = scope
    .map((id) => SECTION_NAMES[id]?.[language] ?? id)
    .join(language === "zh" ? "、" : ", ");
  const targetType = scalar(values, "targetType") || "none";
  const targetVenue = scalar(values, "targetVenue");
  const targetMinimum = numberValue(values, "targetVenueMinimum", 3);
  const referenceRange = rangeValue(values, "referenceRange", [35, 40]);
  const recentYears = numberValue(values, "recentYears", 3);
  const recentShare = numberValue(values, "recentShare", 65);
  const citationsPerSentence = numberValue(values, "citationsPerSentence", 4);
  const custom = scalar(values, "custom");

  const targetRuleZh =
    targetType === "journal"
      ? targetVenue
        ? `目标期刊为“${targetVenue}”。在与论证真实相关且经核验的前提下，建议至少引用 ${targetMinimum} 篇该期刊论文；不得为了命中数量加入无关引用。`
        : "目标类型为期刊但未指定名称；先判断可能目标，不设置目标期刊引用配额。"
      : targetType === "conference"
        ? targetVenue
          ? `目标会议为“${targetVenue}”。优先识别真正相关的该会议论文，但不设置最低引用数量。`
          : "目标类型为会议但未指定名称；不设置目标会议引用配额。"
        : "未预设目标 venue，不设置定向引用数量。";
  const targetRuleEn =
    targetType === "journal"
      ? targetVenue
        ? `The target journal is “${targetVenue}.” When genuinely relevant and verified, aim to cite at least ${targetMinimum} papers from that journal; never pad the bibliography to meet the number.`
        : "The target type is journal but no journal is named; infer plausible targets without imposing a target-journal citation quota."
      : targetType === "conference"
        ? targetVenue
          ? `The target conference is “${targetVenue}.” Prioritize genuinely relevant papers from it, with no minimum target-venue citation count.`
          : "The target type is conference but no conference is named; impose no target-conference citation quota."
        : "No target venue is preset; impose no venue-specific citation count.";

  const sourcePolicyZh = [
    enabled(values, "preferTopConferences") ? "相关领域公认顶会" : "相关会议",
    enabled(values, "preferTopJournals") ? "相关领域公认顶刊" : "相关期刊",
  ].join("与");
  const sourcePolicyEn = [
    enabled(values, "preferTopConferences")
      ? "established leading conferences"
      : "relevant conferences",
    enabled(values, "preferTopJournals")
      ? "established leading journals"
      : "relevant journals",
  ].join(" and ");

  if (language === "zh") {
    return `# 论文引文核查与补充

你是一名熟悉该论文研究方向的学术引文编辑。完整理解论文和 .bib 后，判断现有引用是否真正支持对应陈述、哪些位置缺少必要引文，并在不改变科学主张的前提下${action === "repair" ? "安全修复正文引用与 BibTeX" : "给出可执行审计结果"}。

## 材料与范围
读取主 .tex、被 include/input 的章节、完整 .bib 和最新 PDF（如有）。重点检查：${scopeLabel || "Introduction、Related Work"}；同时快速检查 Abstract 是否误含引文、首次定义和跨章节 cite key 是否失效。主要修改 Introduction 与 Related Work，其他章节只处理明确的引文错误或缺口。

## 当前配置
- 建议参考文献总量：${referenceRange[0]}–${referenceRange[1]} 篇。这是覆盖度参考，不是凑数指标；论文内容不需要时可以偏离。
- 近期文献：以执行日期为准，近 ${recentYears} 年文献占比目标高于 ${recentShare}%；不可替代的奠基工作不因年份删除。
- 来源偏好：${sourcePolicyZh}；${enabled(values, "allowPreprints") ? "允许引用尚无正式版本的重要预印本，但必须标明版本状态" : "默认不引用预印本；存在正式发表版本时必须引用正式版本"}。
- 单句引用：通常不超过 ${citationsPerSentence} 篇真正共同支撑该句的论文，避免 citation dump。
- 定向引用：${targetRuleZh}${custom ? `\n- 补充要求：${custom}` : ""}

## 核查方法
1. 先提取论文自己的方法、贡献、实验发现和有证据支撑的作者综合判断；这些内容不应被机械补引文。对外部事实、已有能力、历史发展、普遍比较、领域现状和他人结论，逐句判断是否需要来源。
2. 对每个现有引用核对“句子主张—原论文证据”的语义关系，识别错引、过度外推、并列引用中只有部分支持、重复堆叠及引用位置含混。不得只凭标题、摘要片段或二手转述判断。
3. 核对 .bib 的标题、作者、年份、venue、卷期页码、DOI/稳定 URL 与发表状态；合并重复条目，保留现有 key，除非 key 本身冲突或错误。
4. ${enabled(values, "browse") ? `允许联网检索和核验。优先原论文、官方 proceedings、出版社或 DOI 页面；围绕近 ${recentYears} 年的直接相关工作补足缺口。` : "不联网新增文献；只核查已提供论文与 BibTeX，并把无法确认的缺口明确列出。"}
5. 新增文献必须解决明确的论证缺口，与句子语义直接相关，并给出完整、可合并且不冲突的 BibTeX。不得为了提高数量、近期占比或目标 venue 数量加入装饰性引用。

## 交付
${action === "repair" ? "直接返回完整的修订版 .tex；只有 BibTeX 确有变化时返回完整修订版 .bib。修改仅限引文及其必要的最小句子调整，不重写论文逻辑。另给一份精简摘要，列出新增、删除、替换、移动和仍待确认的引用。" : "在当前聊天返回结构化引文审计：位置、原陈述与 cite key、判断、证据、建议动作、候选来源和置信度。不要修改文件。"}

最后复核所有 cite key 均存在、同一来源没有重复条目、引用顺序与 LaTeX 可编译，并报告实际参考文献总量、近 ${recentYears} 年占比、预印本数量和目标 venue 引用数量。数字未达到建议值时解释内容原因，不要补齐。`;
  }

  return `# Citation Review and Support

Act as an academic citation editor familiar with this paper's research area. After understanding the manuscript and bibliography, determine whether each citation genuinely supports its statement, locate claims that need sources, and ${action === "repair" ? "safely repair citations and BibTeX without changing the scientific claims" : "produce an actionable audit"}.

## Materials and scope
Read the main .tex, every included section, the complete .bib, and the latest PDF when available. Focus on ${scopeLabel || "Introduction and Related Work"}, while quickly checking whether the Abstract improperly contains citations and whether first definitions or cross-section cite keys are broken. Make substantive citation changes mainly in Introduction and Related Work; elsewhere, address only clear citation errors or omissions.

## Configuration
- Suggested bibliography size: ${referenceRange[0]}–${referenceRange[1]} works. This is a coverage reference, never a quota; depart when the paper's content warrants it.
- Recency: as of the execution date, aim for more than ${recentShare}% of references from the latest ${recentYears} years, while retaining indispensable foundational work.
- Source policy: prefer ${sourcePolicyEn}; ${enabled(values, "allowPreprints") ? "important preprints without a formal version are allowed when their status is explicit" : "exclude preprints by default and cite the formal version whenever one exists"}.
- Citation density: normally use no more than ${citationsPerSentence} papers that genuinely co-support one sentence; avoid citation dumping.
- Targeting: ${targetRuleEn}${custom ? `\n- Additional requirement: ${custom}` : ""}

## Review method
1. Separate this paper's own method, contributions, experimental findings, and evidence-grounded synthesis from external factual, historical, comparative, field-state, and prior-work claims. Do not mechanically attach citations to the paper's own claims; assess external claims sentence by sentence.
2. Verify the semantic relation between every cited claim and the original source. Detect miscitation, overextension, partially supporting citation clusters, redundant stacks, and ambiguous citation placement. Do not rely on titles, search snippets, or secondary summaries alone.
3. Verify each BibTeX entry's title, authors, year, venue, volume/issue/pages, DOI or stable URL, and publication status. Merge duplicates while preserving existing keys unless a key is itself conflicting or wrong.
4. ${enabled(values, "browse") ? `Browse to verify and fill explicit gaps, prioritizing original papers, official proceedings, publishers, and DOI records, with special attention to directly relevant work from the latest ${recentYears} years.` : "Do not add literature from the web; audit only the supplied papers and BibTeX and list unverifiable gaps explicitly."}
5. Add a source only when it closes an identified argumentative gap and directly supports the sentence. Supply complete, merge-ready, non-conflicting BibTeX for every addition. Never pad the bibliography, recency ratio, or target-venue count.

## Delivery
${action === "repair" ? "Return the complete revised .tex and the complete revised .bib only when the bibliography actually changes. Limit edits to citations and the minimum sentence adjustment needed to make citation scope precise; do not rewrite the paper's logic. Add a concise summary of added, removed, replaced, moved, and unresolved citations." : "Return a structured citation audit in the current chat with location, original statement and cite keys, judgment, evidence, recommended action, candidate sources, and confidence. Do not modify files."}

Finally verify that every cite key exists, no source is duplicated, citation order and LaTeX compile, and report the actual bibliography count, latest-${recentYears}-year share, preprint count, and target-venue citation count. Explain content-driven departures from recommendations rather than filling them mechanically.`;
}

export const CITATION_AUDIT_WORKBENCH = {
  id: "citation-audit-workbench",
  activePage: "citation-audit",
  copy: workbenchCopy({
    zh: {
      eyebrow: "CITATION REVIEW",
      title: "引文核查与补充",
      subtitle: "核对引用是否支撑陈述，补足真正缺失的引文，并同步校验 BibTeX。",
      preset: "Introduction + Related Work · 近三年 >65% · 不引用预印本",
      inputTitle: "准备材料",
      inputItems: ["主稿 TeX 与完整 BibTeX", "最新 PDF（建议）", "目标 venue（可选）"],
      inputHint: "重点处理引言与相关工作；建议数量用于检查覆盖度，不用于凑引用。",
      promptTitle: "引文核查 Prompt",
      promptPurpose: "逐句核验支撑关系，并对新增来源给出可追溯 BibTeX。",
    },
    en: {
      eyebrow: "CITATION REVIEW",
      title: "Citation Review & Support",
      subtitle: "Verify claim–citation support, fill genuine gaps, and validate BibTeX metadata.",
      preset: "Introduction + Related Work · >65% recent · no preprints",
      inputTitle: "Prepare materials",
      inputItems: ["Main TeX and complete BibTeX", "Latest PDF (recommended)", "Target venue (optional)"],
      inputHint: "Prioritize Introduction and Related Work; use counts to assess coverage, never to pad references.",
      promptTitle: "Citation-review prompt",
      promptPurpose: "Verify sentence-level support and provide traceable BibTeX for every addition.",
    },
  }),
  controls: [
    {
      id: "action",
      kind: "segmented",
      label: text("执行方式", "Action"),
      description: text("仅报告，或在核验后安全修改。", "Report only, or safely revise after verification."),
      defaultValue: "repair",
      options: [
        { value: "repair", label: text("核查并安全修复", "Review & safely repair") },
        { value: "audit", label: text("仅核查", "Audit only") },
      ],
      span: "full",
    },
    {
      id: "sections",
      kind: "multi",
      label: text("重点章节", "Priority sections"),
      description: text("默认集中处理 Introduction 与 Related Work。", "Introduction and Related Work are the default focus."),
      defaultValue: ["introduction", "related-work"],
      minSelected: 1,
      options: Object.entries(SECTION_NAMES).map(([value, label]) => ({ value, label })),
      span: "full",
    },
    {
      id: "targetType",
      kind: "segmented",
      label: text("目标 venue", "Target venue"),
      description: text("期刊可设置定向引文建议；会议默认不设数量。", "Journals may use a target-citation recommendation; conferences have no default count."),
      defaultValue: "none",
      options: [
        { value: "none", label: text("不预设", "Not preset") },
        { value: "conference", label: text("会议", "Conference") },
        { value: "journal", label: text("期刊", "Journal") },
      ],
      span: "full",
    },
    {
      id: "targetVenue",
      kind: "text",
      label: text("目标名称", "Target name"),
      description: text("填写会议或期刊全称/简称。", "Enter the conference or journal name."),
      defaultValue: "",
      placeholder: text("例如：TNNLS", "e.g. TNNLS"),
      visibleWhen: (values) => scalar(values, "targetType") !== "none",
    },
    {
      id: "targetVenueMinimum",
      kind: "number",
      label: text("目标期刊建议引用", "Suggested target-journal citations"),
      description: text("仅在内容相关时参考，默认至少 3 篇。", "Use only when relevant; three is the default minimum."),
      defaultValue: 3,
      min: 0,
      max: 20,
      suffix: text("篇", "papers"),
      visibleWhen: (values) => scalar(values, "targetType") === "journal",
    },
    {
      id: "referenceRange",
      kind: "range",
      label: text("建议引文总量", "Suggested reference count"),
      description: text("默认 35–40，仅作覆盖度参考。", "Defaults to 35–40 as a coverage reference only."),
      defaultValue: [35, 40],
      min: 5,
      max: 150,
      suffix: text("篇", "works"),
    },
    {
      id: "recentYears",
      kind: "number",
      label: text("近期时间窗", "Recent window"),
      description: text("以执行日期向前计算。", "Count backward from the execution date."),
      defaultValue: 3,
      min: 1,
      max: 10,
      suffix: text("年", "years"),
    },
    {
      id: "recentShare",
      kind: "number",
      label: text("近期文献占比", "Recent-reference share"),
      description: text("默认目标高于 65%，经典工作不受影响。", "Default target is above 65%; foundational work remains allowed."),
      defaultValue: 65,
      min: 0,
      max: 100,
      suffix: text("%", "%"),
    },
    {
      id: "allowPreprints",
      kind: "toggle",
      label: text("允许预印本", "Allow preprints"),
      description: text("默认关闭；优先引用正式发表版本。", "Off by default; prefer formally published versions."),
      defaultValue: false,
      enabledLabel: text("允许必要预印本", "Allow when necessary"),
      disabledLabel: text("不引用预印本", "Exclude preprints"),
    },
    {
      id: "preferTopConferences",
      kind: "toggle",
      label: text("优先顶会", "Prefer leading conferences"),
      description: text("按论文所属子领域判断。", "Determine leadership within the paper's subfield."),
      defaultValue: true,
    },
    {
      id: "preferTopJournals",
      kind: "toggle",
      label: text("优先顶刊", "Prefer leading journals"),
      description: text("只引用与当前陈述真正相关的论文。", "Cite only work genuinely relevant to the statement."),
      defaultValue: true,
    },
    {
      id: "browse",
      kind: "toggle",
      label: text("联网核验与补充", "Browse to verify and extend"),
      description: text("核查原文和官方元数据，不依赖搜索摘要。", "Check original papers and official metadata, not search snippets."),
      defaultValue: true,
    },
    {
      id: "citationsPerSentence",
      kind: "number",
      label: text("单句最多引用", "Maximum citations per sentence"),
      description: text("默认 4 篇，避免堆叠但允许必要的综合引用。", "Defaults to four to avoid stacks while permitting real synthesis."),
      defaultValue: 4,
      min: 1,
      max: 10,
      suffix: text("篇", "papers"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充要求", "Additional requirements"),
      description: text("可指定必须保留的来源、主题或排除范围。", "Optionally name sources, topics, or exclusions to preserve."),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt: buildCitationPrompt,
} satisfies WorkbenchDefinition;

export { buildCitationPrompt };
