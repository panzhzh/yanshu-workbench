import { COMMON_PROMPT_BLOCKS } from "../../../content/prompts/templates";
import type { Language } from "../../config";

type LocalizedText = Record<Language, string>;

export const SPECIALIZED_AUDIT_IDS = [
  "terminology",
  "bibliography",
  "data-consistency",
  "visual-integrity",
  "claim-evidence",
  "notation",
  "reproducibility",
  "cross-section-redundancy",
] as const;

export type SpecializedAuditId =
  (typeof SPECIALIZED_AUDIT_IDS)[number];

export const AUDIT_EXECUTION_MODE_IDS = [
  "report-only",
  "safe-fix",
] as const;

export type AuditExecutionMode =
  (typeof AUDIT_EXECUTION_MODE_IDS)[number];

interface AuditDefinition {
  label: LocalizedText;
  summary: LocalizedText;
  tag: string;
}

export const SPECIALIZED_AUDITS: Record<
  SpecializedAuditId,
  AuditDefinition
> = {
  terminology: {
    label: {
      zh: "专业术语与命名",
      en: "Terminology & Naming",
    },
    summary: {
      zh: "审计冗余术语、同义漂移、缩写、大小写与概念边界。",
      en: "Audit redundant terms, synonym drift, acronyms, casing, and concept boundaries.",
    },
    tag: "TERM",
  },
  bibliography: {
    label: {
      zh: "引用与 BibTeX",
      en: "Citations & BibTeX",
    },
    summary: {
      zh: "核验引用语义、Bib 元数据、失效 key、重复条目与重要缺引。",
      en: "Verify citation support, Bib metadata, broken keys, duplicates, and material omissions.",
    },
    tag: "BIB",
  },
  "data-consistency": {
    label: {
      zh: "数据与数字一致性",
      en: "Data & Numeric Consistency",
    },
    summary: {
      zh: "逐项核对正文、附录、图表与 caption 中的数据、单位和统计口径。",
      en: "Cross-check values, units, and statistical conventions across prose, appendix, visuals, and captions.",
    },
    tag: "DATA",
  },
  "visual-integrity": {
    label: {
      zh: "图表与交叉引用",
      en: "Visuals & Cross-references",
    },
    summary: {
      zh: "发现孤儿图表、失效引用、顺序错误、缺失源文件与 caption 冲突。",
      en: "Find orphan visuals, broken references, ordering errors, missing sources, and caption conflicts.",
    },
    tag: "VIS",
  },
  "claim-evidence": {
    label: {
      zh: "Claim–证据对齐",
      en: "Claim–Evidence Alignment",
    },
    summary: {
      zh: "核对主要 claim、贡献、机制和实验是否形成可追溯证据链。",
      en: "Trace primary claims and contributions to mechanisms and experimental evidence.",
    },
    tag: "CLAIM",
  },
  notation: {
    label: {
      zh: "符号、公式与单位",
      en: "Notation, Equations & Units",
    },
    summary: {
      zh: "检查符号定义、复用冲突、维度、公式引用和单位书写。",
      en: "Check symbol definitions, collisions, dimensions, equation references, and unit notation.",
    },
    tag: "MATH",
  },
  reproducibility: {
    label: {
      zh: "可复现性信息",
      en: "Reproducibility Information",
    },
    summary: {
      zh: "检查数据、环境、超参、随机性、统计检验与基线公平性是否充分。",
      en: "Check data, environment, hyperparameters, randomness, statistics, and baseline fairness.",
    },
    tag: "REPRO",
  },
  "cross-section-redundancy": {
    label: {
      zh: "跨章节重复与错位",
      en: "Cross-section Redundancy",
    },
    summary: {
      zh: "发现重复论述、章节功能错位、结论越界和前后叙事断裂。",
      en: "Find repeated prose, misplaced section functions, overreaching conclusions, and narrative breaks.",
    },
    tag: "STRUCT",
  },
};

export const AUDIT_EXECUTION_MODES = {
  "report-only": {
    label: {
      zh: "只审计，不改稿",
      en: "Audit only",
    },
    description: {
      zh: "输出可定位的问题报告和修复建议，不改写论文文件。",
      en: "Return a location-specific report and repair instructions without changing manuscript files.",
    },
  },
  "safe-fix": {
    label: {
      zh: "审计并安全修复",
      en: "Audit and safely fix",
    },
    description: {
      zh: "只自动修复证据唯一、不会改变科学含义的问题；冲突与缺证据仍留给作者。",
      en: "Automatically fix only deterministic issues that cannot change scientific meaning; leave conflicts and evidence gaps for the author.",
    },
  },
} as const satisfies Record<
  AuditExecutionMode,
  { label: LocalizedText; description: LocalizedText }
>;

export interface SpecializedAuditPreferences {
  selectedAuditIds: SpecializedAuditId[];
  executionMode: AuditExecutionMode;
}

export const DEFAULT_SPECIALIZED_AUDIT_PREFERENCES: SpecializedAuditPreferences =
  {
    selectedAuditIds: [
      "terminology",
      "bibliography",
      "data-consistency",
      "visual-integrity",
    ],
    executionMode: "report-only",
  };

export const AUDIT_COPY = {
  zh: {
    eyebrow: "SPECIALIZED AUDIT",
    title: "专项审计",
    subtitle:
      "选择一项或多项检查，由一个 Prompt 建立共享证据台账、交叉核验并去重报告。",
    preset: "全文取证 · 多项联审 · 精确定位",
    reset: "恢复默认",
    resetHint: "恢复四项核心审计和只审计模式。",
    materials: "论文材料",
    materialItems: [
      "完整 .tex",
      "最新编译 .pdf",
      "完整 .bib",
      "figures/（按需）",
    ],
    materialsHint:
      "PDF 用于读取已渲染图表与版面；选择图表或数据审计时，若源图可用请同时提供 figures/。缺少源图时仍审计 PDF 中可见证据，并明确覆盖边界。",
    auditSelection: "审计项目",
    auditSelectionHint:
      "可单选或多选。多项审计共享位置、证据与问题编号，同一问题不会重复输出。",
    selectedCount: "已选",
    items: "项",
    selectAll: "全选",
    clear: "清空",
    execution: "执行方式",
    executionHint:
      "默认只报告。安全修复也不得猜测冲突值、补造证据或改变 claim。",
    promptTitle: "专项审计",
    promptPurpose:
      "完整读取论文，对所选项目进行一次联合审计，并输出可直接执行的问题清单。",
    emptyPromptTitle: "请选择审计项目",
    emptyPromptPurpose: "至少选择一项后才能生成和复制 Prompt。",
    switchPromptLanguage: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "收起",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    eyebrow: "SPECIALIZED AUDIT",
    title: "Specialized audits",
    subtitle:
      "Select one or more checks. One Prompt builds a shared evidence ledger, cross-validates findings, and removes duplicates.",
    preset: "Full-paper evidence · combined checks · exact locations",
    reset: "Restore defaults",
    resetHint: "Restore the four core audits and audit-only mode.",
    materials: "Paper materials",
    materialItems: [
      "Complete .tex",
      "Latest compiled .pdf",
      "Complete .bib",
      "figures/ (as needed)",
    ],
    materialsHint:
      "Use the PDF for rendered visuals and layout. When visual or numeric checks are selected, provide figures/ if source images are available. Otherwise audit visible PDF evidence and state the coverage boundary.",
    auditSelection: "Audit checks",
    auditSelectionHint:
      "Select one or many. Combined checks share locations, evidence, and issue IDs, so one defect is never reported repeatedly.",
    selectedCount: "Selected",
    items: "checks",
    selectAll: "Select all",
    clear: "Clear",
    execution: "Execution mode",
    executionHint:
      "Audit-only is the default. Safe fixes must never guess a conflicting value, fabricate evidence, or alter a claim.",
    promptTitle: "Specialized audit",
    promptPurpose:
      "Read the complete paper, run the selected checks as one coordinated audit, and return an actionable issue register.",
    emptyPromptTitle: "Select an audit check",
    emptyPromptPurpose:
      "Select at least one check before generating or copying the Prompt.",
    switchPromptLanguage: "Switch Prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

function terminologyAdapter(language: Language) {
  return language === "zh"
    ? `### [TERM] 专业术语与命名
- 从标题、Abstract、正文、附录、图表、caption、算法与公式说明中提取 canonical term registry：概念、推荐名称、首次定义位置、允许缩写、禁用变体和必须区分的相近概念。
- 检查同一概念被多个近义词反复命名、同一术语指向不同概念、全称与缩写不一致、未定义缩写、大小写/连字符/单复数漂移，以及术语只在局部突然出现。
- 区分有助于自然表达的普通措辞变化与会改变技术含义的术语漂移；不得为了表面统一机械替换普通词。
- 将“冗余”定位到具体概念和位置，给出一个 canonical term 及替换映射，不得改变公式、代码标识符、数据集官方名或引用作品标题。`
    : `### [TERM] Terminology and Naming
- Extract a canonical-term registry from the title, Abstract, body, appendix, visuals, captions, algorithms, and equation explanations: concept, preferred name, first definition, allowed acronym, prohibited variants, and nearby concepts that must remain distinct.
- Check synonym proliferation for one concept, one term denoting different concepts, full-form/acronym mismatches, undefined abbreviations, casing/hyphenation/number drift, and terms appearing abruptly in only one location.
- Distinguish harmless ordinary wording variation from terminology drift that changes technical meaning; do not normalize ordinary language mechanically.
- Locate redundancy by concept and occurrence, then give one canonical term and replacement map without altering equations, code identifiers, official dataset names, or cited-work titles.`;
}

function bibliographyAdapter(language: Language) {
  return language === "zh"
    ? `### [BIB] 引用与 BibTeX
- 建立 cite-key 台账：每个正文 key 必须在 .bib 中唯一解析；查找缺失 key、未使用条目、重复论文、key 冲突和同一论文的多个版本。
- 逐条核验引用所在句与原论文是否存在直接语义支持；区分“支持背景事实”“支持方法归属”“仅为相邻工作”三种关系，报告错引、弱支持、citation dumping 和引用位置错误。
- 以原论文、官方 proceedings/出版社页面、DOI、DBLP、Crossref 或作者公开版本核验作者、题名、venue、年份、页码、DOI/URL 与条目类型；不要把搜索摘要当作最终证据。
- 检查缺失的重要引文：优先执行日前两年内直接相关的顶会、顶刊论文，同时保留不可替代的奠基工作；只有能支持具体句子或定位缺口的来源才可建议加入，禁止凑数。
- 对每个新增或修正条目给出准确完整 BibTeX、支持的具体 claim、建议引用位置、核验来源和与现有库的去重结果；无法核验则只报告，不生成条目。`
    : `### [BIB] Citations and BibTeX
- Build a cite-key ledger: every key in prose must resolve exactly once in .bib. Find missing keys, unused entries, duplicate works, key collisions, and multiple records for the same paper.
- Verify whether every cited source directly supports its sentence. Distinguish support for a background fact, attribution of a method, and mere neighboring work; report miscitation, weak support, citation dumping, and misplaced citations.
- Verify authors, title, venue, year, pages, DOI/URL, and entry type against the original paper, official proceedings/publisher page, DOI, DBLP, Crossref, or an author-hosted copy. A search-result snippet is not final evidence.
- Find materially missing citations, prioritizing directly relevant top-conference and top-journal work from the two years preceding execution while retaining irreplaceable foundations. Suggest a source only for a specific sentence or positioning gap; never pad counts.
- For every addition or correction, provide exact complete BibTeX, the supported claim, proposed citation location, verification source, and deduplication result. If verification fails, report the gap without inventing an entry.`;
}

function dataConsistencyAdapter(language: Language) {
  return language === "zh"
    ? `### [DATA] 数据与数字一致性
- 建立 numeric-claim ledger，覆盖 Abstract、正文、附录、表格、图片、caption、脚注和结论中的每个关键数字，并记录位置、对象、条件、指标、单位、统计口径和证据源。
- 核对数据集规模与划分、样本数、超参数、运行次数、均值/标准差、显著性、排名、提升比例、百分比与百分点、单位换算、有效位数和四舍五入。
- 检查正文中的 best/second-best、绝对提升和相对提升能否由图表直接推出；重新计算可确定的派生值，但保留原始值和计算式。
- 主文、附录、图表或 TeX/PDF 冲突时不得静默选一个数。并列给出冲突位置、各值、影响的 claim 与最低风险处理；缺少原始证据时标为作者确认。
- 不把展示精度差异误报为科学冲突；必须说明允许的舍入容差与判断依据。`
    : `### [DATA] Data and Numeric Consistency
- Build a numeric-claim ledger covering every material value in the Abstract, body, appendix, tables, figures, captions, footnotes, and Conclusion. Record location, object, condition, metric, unit, statistical convention, and evidence source.
- Cross-check dataset sizes and splits, sample counts, hyperparameters, run counts, means/standard deviations, significance, rankings, gains, percentages versus percentage points, unit conversions, significant digits, and rounding.
- Verify that best/second-best claims and absolute or relative gains in prose are derivable from visuals. Recalculate deterministic derived values while retaining source values and the formula used.
- Never choose silently when main text, appendix, visuals, or TeX/PDF disagree. List every location and value, the affected claim, and the lowest-risk treatment; require author confirmation when primary evidence is absent.
- Do not mistake display precision for a scientific conflict; state the accepted rounding tolerance and rationale.`;
}

function visualIntegrityAdapter(language: Language) {
  return language === "zh"
    ? `### [VIS] 图表与交叉引用
- 从 TeX 与 PDF 双向建立图表台账：环境、编号、label、源文件、caption、首次正文引用、主要解释段落、所支持 claim 和正文/附录归属。
- 查找孤儿图表（存在但从未被正文引用或解释）、悬空引用（正文引用不存在的图表）、重复/缺失 label、错误 ref、缺失源文件、编号与首次出现顺序错误。
- 核对 caption、图例、坐标轴、表头、指标方向、单位、颜色/线型语义与正文描述；检查子图引用是否完整且不会把不同条件混为一谈。
- “提到 label”不等于完成解释。每张证据图表都应有明确研究问题、最小必要观察和克制解释；纯排版或装饰元素不得误报为孤儿证据。
- 只审计模式不移动或删除图表；安全修复模式也不得删除唯一证据、隐藏不利结果或把核心结果移出正文。`
    : `### [VIS] Visuals and Cross-references
- Build a bidirectional visual ledger from TeX and PDF: environment, number, label, source file, caption, first prose citation, primary interpretive paragraph, supported claim, and main-text/appendix placement.
- Find orphan visuals (present but never cited or interpreted), dangling references (prose points to no visual), duplicate/missing labels, broken refs, missing source files, and numbering or first-mention order errors.
- Cross-check captions, legends, axes, table headers, metric direction, units, color/line semantics, and prose descriptions. Verify that subfigure references are complete and do not conflate conditions.
- Mentioning a label is not interpretation. Every evidentiary visual needs a research question, minimum necessary observation, and restrained explanation; do not misclassify layout-only or decorative elements as orphan evidence.
- Audit-only mode moves or deletes nothing. Safe-fix mode still cannot delete unique evidence, hide unfavorable results, or move core results out of the main text.`;
}

function claimEvidenceAdapter(language: Language) {
  return language === "zh"
    ? `### [CLAIM] Claim–证据对齐
- 提取标题、Abstract、Introduction 贡献、Discussion 和 Conclusion 中的主要 claim，并逐项映射到 Method 中的真实机制以及 Experiments/Results 中的直接证据。
- 查找无实验支撑的贡献、证据只支持较窄条件却被泛化的 claim、把相关性写成因果、把推断写成观察，以及结论强于图表的情况。
- 同时查找重要证据未被任何 claim 使用、负面或边界证据被正文遗漏、同一 claim 在前后章节强度不一致。
- 对每个缺口给出“保留并补证据、缩窄措辞、移动到 Discussion、删除 claim”中的最低风险建议；不得发明实验或用外部论文替代本文证据。`
    : `### [CLAIM] Claim–Evidence Alignment
- Extract primary claims from the title, Abstract, Introduction contributions, Discussion, and Conclusion, then map each to a real Method mechanism and direct Experiments/Results evidence.
- Find contributions without experimental support, claims generalized beyond tested conditions, correlation presented as causation, inference presented as observation, and conclusions stronger than visual evidence.
- Also find material evidence supporting no stated claim, omitted unfavorable or boundary evidence, and changes in claim strength across sections.
- For every gap, recommend the lowest-risk action among retain and add existing evidence, narrow wording, move to Discussion, or remove the claim. Never invent an experiment or use external literature as a substitute for this paper's evidence.`;
}

function notationAdapter(language: Language) {
  return language === "zh"
    ? `### [MATH] 符号、公式与单位
- 建立 notation registry：符号、首次定义、语义、类型/维度、单位、适用范围和复用位置；遵循一个符号一个含义、首次使用前定义。
- 检查标量/向量/矩阵字体、上下标、集合与随机变量、损失项、期望、概率、范数、转置和运算符是否前后一致。
- 核对公式编号与引用、符号在正文和算法中的一致性、输入输出维度、训练/推理阶段含义，以及量纲或单位是否可相容。
- 区分排版不一致与数学错误。只有确定性的排版/引用错误可安全修复；潜在推导错误必须定位并交给作者确认，不得改造算法。`
    : `### [MATH] Notation, Equations, and Units
- Build a notation registry: symbol, first definition, meaning, type/dimension, unit, scope, and reuse locations. Enforce one symbol per meaning and definition before first use.
- Check scalar/vector/matrix typography, subscripts, sets and random variables, loss terms, expectations, probabilities, norms, transposes, and operators for consistency.
- Verify equation numbering and references, symbol consistency between prose and algorithms, input/output dimensions, training/inference meanings, and dimensional or unit compatibility.
- Distinguish typography drift from a mathematical defect. Safely fix only deterministic typography/reference issues; locate potential derivation errors for author confirmation rather than redesigning the algorithm.`;
}

function reproducibilityAdapter(language: Language) {
  return language === "zh"
    ? `### [REPRO] 可复现性信息
- 按论文实际实验建立复现清单：数据集版本/来源/许可、划分与预处理、评价指标、baseline 来源和公平设置、超参数、硬件、软件环境、随机种子、运行次数和停止规则。
- 检查均值/方差或置信区间、统计检验、超参选择、模型选择、数据泄漏防护、失败运行和计算预算是否足以解释报告结果。
- 核对代码、数据、模型和配置的可用性陈述与论文实际材料是否一致；匿名投稿时不得暴露身份。
- 将“论文未报告”和“证据表明未执行”严格区分。信息缺失只能列为复现风险或作者待补，不得按领域惯例补造。`
    : `### [REPRO] Reproducibility Information
- Build an experiment-specific checklist covering dataset version/source/license, splits and preprocessing, metrics, baseline provenance and fairness, hyperparameters, hardware, software, seeds, run counts, and stopping rules.
- Check whether means/variance or confidence intervals, statistical tests, hyperparameter/model selection, leakage controls, failed runs, and compute budget adequately explain reported results.
- Verify that code, data, model, and configuration availability statements match actual manuscript materials without breaking anonymous review.
- Distinguish “not reported” from “evidence shows not performed.” Treat missing information only as a reproducibility risk or author action; never fill it from field convention.`;
}

function redundancyAdapter(language: Language) {
  return language === "zh"
    ? `### [STRUCT] 跨章节重复与功能错位
- 建立 section-function map，检查 Abstract、Introduction、Related Work、Method、Experiments/Results、Discussion、Conclusion 和附录是否各自完成应有功能。
- 查找句级或段级重复、贡献列表在多处原样复写、Introduction 过早展开方法细节、Method 混入结果、Results 混入无证据机制解释、Discussion 重复数字与图表、Conclusion 引入新 claim。
- 区分必要回指与无新增信息的重复；只有后者才建议合并或删除，并明确保留哪一处、为什么。
- 检查标题层级、段落主题句、跨章节过渡和前后术语是否形成连续叙事；不得为了“更顺”移动公式、实验或证据而破坏可追溯性。`
    : `### [STRUCT] Cross-section Redundancy and Functional Drift
- Build a section-function map and verify that Abstract, Introduction, Related Work, Method, Experiments/Results, Discussion, Conclusion, and appendix each perform their proper role.
- Find sentence- or paragraph-level duplication, contribution lists copied across sections, premature Method detail in Introduction, results inside Method, unsupported mechanism interpretation inside Results, numeric/visual repetition in Discussion, and new claims in Conclusion.
- Distinguish necessary callbacks from repetition that adds no information. Recommend merging or deletion only for the latter, stating which occurrence remains and why.
- Check heading hierarchy, topic sentences, transitions, and terminology for a continuous narrative. Do not move equations, experiments, or evidence merely for fluency when traceability would suffer.`;
}

const AUDIT_ADAPTERS: Record<
  SpecializedAuditId,
  (language: Language) => string
> = {
  terminology: terminologyAdapter,
  bibliography: bibliographyAdapter,
  "data-consistency": dataConsistencyAdapter,
  "visual-integrity": visualIntegrityAdapter,
  "claim-evidence": claimEvidenceAdapter,
  notation: notationAdapter,
  reproducibility: reproducibilityAdapter,
  "cross-section-redundancy": redundancyAdapter,
};

function auditProtection(
  mode: AuditExecutionMode,
  language: Language,
) {
  if (language === "zh") {
    const modeBoundary =
      mode === "report-only"
        ? "本轮是只审计模式：不得改写、覆盖或另存 .tex、.bib、图片与 PDF；全局证据规则中任何“删除、弱化或修正”的表述都只能转化为带精确位置的建议。"
        : "本轮是安全修复模式：只修改证据唯一、影响局部且不会改变科学含义的确定性问题；任何事实冲突、数学疑点、证据缺失或可能改变 claim 的操作只报告。";
    return `1. 沿用当前 .tex 的文档类、宏包、参考文献样式、单双栏、作者信息、自定义命令、图像路径和编译体系。
2. 保留 label、ref、cite、公式编号、算法标签、图表内容和正文/附录归属；除已选择且满足安全修复条件的确定性错误外，不做结构操作。
3. 不删除真实证据，不隐藏不利结果，不生成、虚构或替换图片、数据、公式、引用或实验。
4. 中文审计结论不得混入英文 TeX；不以 TODO、TBD 或占位文字替代缺失证据。
5. ${modeBoundary}`;
  }

  const modeBoundary =
    mode === "report-only"
      ? "This is audit-only mode: do not rewrite, overwrite, or save a new .tex, .bib, image, or PDF. Any wording in the global evidence rules that implies deletion, qualification, or correction must become a location-specific recommendation only."
      : "This is safe-fix mode: change only deterministic issues with unique evidence, local impact, and no possible change to scientific meaning. Report every factual conflict, mathematical concern, evidence gap, or potentially claim-changing operation without applying it.";
  return `1. Preserve the current .tex document class, packages, bibliography style, column layout, author block, custom commands, image paths, and compilation system.
2. Preserve labels, refs, cites, equation numbers, algorithm identifiers, visual content, and main-text/appendix placement except for a selected deterministic defect that meets every safe-fix condition.
3. Delete no real evidence, hide no unfavorable result, and generate, invent, or replace no image, value, equation, citation, or experiment.
4. Keep Chinese audit findings out of the English TeX; never replace missing evidence with TODO, TBD, or placeholder prose.
5. ${modeBoundary}`;
}

export function buildSpecializedAuditPrompt(
  preferences: SpecializedAuditPreferences,
  language: Language,
) {
  const selected = SPECIALIZED_AUDIT_IDS.filter((id) =>
    preferences.selectedAuditIds.includes(id),
  );
  if (selected.length === 0) return "";

  const selectedList = selected
    .map(
      (id, index) =>
        `${index + 1}. [${SPECIALIZED_AUDITS[id].tag}] ${
          SPECIALIZED_AUDITS[id].label[language]
        }`,
    )
    .join("\n");
  const adapters = selected
    .map((id) => AUDIT_ADAPTERS[id](language))
    .join("\n\n");
  const needsBibliography = selected.includes("bibliography");
  const needsVisualInspection =
    selected.includes("visual-integrity") ||
    selected.includes("data-consistency") ||
    selected.includes("claim-evidence");
  const modeLabel =
    AUDIT_EXECUTION_MODES[preferences.executionMode].label[language];

  if (language === "zh") {
    const bibliographyRules = needsBibliography
      ? `\n## 文献联网核验规则\n${COMMON_PROMPT_BLOCKS.citationAndWeb.zh}\n`
      : "";
    const visualRules = needsVisualInspection
      ? `\n## PDF 与视觉证据检查\n${COMMON_PROMPT_BLOCKS.pdfReview.zh}\n`
      : "";
    const deliverables =
      preferences.executionMode === "report-only"
        ? `- \`<base_name>_specialized_audit_report_zh.md\`：完整中文审计报告；
- 不修改 .tex、.bib、图片或 PDF。对于确定性修复，报告中给出准确替换位置和修复文本；对于 BibTeX 新增或修正，给出经过核验的完整条目。`
        : `- \`<base_name>_audited.tex\`：包含全部确定性安全修复的完整、连续、可编译英文论文；
- \`<base_name>_audited_references.bib\`：完整当前 BibTeX 文献库；若未选择 [BIB] 或没有可核验修改，也保持输入库完整不变；
- \`<base_name>_specialized_audit_report_zh.md\`：完整中文审计报告与逐项修改日志；
- 成功编译的 PDF。

只自动修复满足以下全部条件的问题：证据唯一、修改局部、不会改变科学含义、不会隐藏冲突或负面结果。其余问题只报告，不得猜测。`;

    return `# 论文专项联合审计

## 你的角色
你是一名熟悉当前论文具体 CS 子领域的资深审稿人、科研诚信审计员、BibTeX 核验员与 LaTeX 编辑。完整读取论文后，对下列所选项目执行一次联合审计。先建立共享事实、术语、数字、引用、图表和 claim 台账，再运行各审计适配器；不得把同一问题复制到多个报告段落。

## 输入
在同一对话中读取：
- 当前完整主 .tex 及其所有 \`\\input\` / \`\\include\` 文件；
- 与其一致的最新编译 PDF；
- 当前完整 .bib；
- 可选但建议：figures/ 源图、表格数据、补充材料及其他审计所需附件。

以 .tex 为结构、术语、公式、引用与原始数字依据，以 PDF 检查实际渲染结果和可见图表。没有 figures/ 时仍检查 PDF 中可见内容，并在报告中明确哪些像素级、源文件级或数据级核验无法完成。

## 当前配置
- 执行方式：${modeLabel}
- 审计项目：
${selectedList}

## 全局证据边界
${COMMON_PROMPT_BLOCKS.evidence.zh}

## 稿件保护
${auditProtection(preferences.executionMode, "zh")}
${visualRules}${bibliographyRules}
## 所选审计合同
${adapters}

## 联合审计方法
1. 先建立共享台账，再执行所选审计；台账必须覆盖主文与附录，而不是只搜索关键词。
2. 同一根因只生成一个稳定问题 ID，并附全部相关标签，例如 \`AUD-007 [DATA][VIS][CLAIM]\`；不要在不同审计中重复计数。
3. 每项发现必须包含：严重度（Blocker / Major / Minor）、置信度、精确位置（文件与行、章节/图表/cite key、PDF 页码按适用情况）、观察、直接证据、影响、最低风险行动和状态。
4. 严重度按科学影响划分：Blocker 会使核心 claim、数据或引用不可信；Major 会实质影响理解、复现或投稿判断；Minor 是确定性一致性或表达缺陷。
5. 不把偏好差异、无证据猜测或纯风格意见包装成问题。每个已选审计即使零发现，也要报告覆盖范围和“未发现可核验问题”。
6. 先报告跨项统计和 Blocker，再给问题台账、各审计覆盖摘要、确定性修复、待作者确认项和无法覆盖的材料边界。

## 输出
${deliverables}

不得只给泛化检查清单、总体评价或无法定位的建议。现在完整读取材料并直接完成所选专项审计。`;
  }

  const bibliographyRules = needsBibliography
    ? `\n## Online Bibliographic Verification\n${COMMON_PROMPT_BLOCKS.citationAndWeb.en}\n`
    : "";
  const visualRules = needsVisualInspection
    ? `\n## PDF and Visual-Evidence Review\n${COMMON_PROMPT_BLOCKS.pdfReview.en}\n`
    : "";
  const deliverables =
    preferences.executionMode === "report-only"
      ? `- \`<base_name>_specialized_audit_report_zh.md\`: the complete Chinese audit report;
- Do not modify .tex, .bib, images, or PDF. For a deterministic repair, give the exact location and replacement text in the report. For a BibTeX addition or correction, provide the complete verified entry.`
      : `- \`<base_name>_audited.tex\`: the complete continuous compilable English manuscript containing all deterministic safe fixes;
- \`<base_name>_audited_references.bib\`: the complete current BibTeX library; if [BIB] is not selected or no verified edit exists, preserve the input library in full;
- \`<base_name>_specialized_audit_report_zh.md\`: the complete Chinese audit report and itemized change log;
- the successfully compiled PDF.

Apply an automatic fix only when all conditions hold: the evidence is unique, the edit is local, scientific meaning cannot change, and no conflict or unfavorable result is hidden. Report every other issue without guessing.`;

  return `# Combined Specialized Paper Audit

## Your Role
Act as a senior reviewer in the manuscript's specific CS subfield, a research-integrity auditor, BibTeX verifier, and LaTeX editor. Read the complete paper and run the selected checks as one coordinated audit. Build shared fact, terminology, numeric, citation, visual, and claim ledgers before applying the adapters; never duplicate one defect across report sections.

## Inputs
Read in the same conversation:
- the complete main .tex and every \`\\input\` / \`\\include\` file;
- its matching latest compiled PDF;
- the complete current .bib;
- optional but recommended: figures/, table data, supplementary material, and other audit evidence.

Use .tex for structure, terminology, equations, citations, and source values, and the PDF for actual rendering and visible evidence. Without figures/, still inspect visible PDF content and state which pixel-level, source-file, or underlying-data checks could not be completed.

## Current Configuration
- Execution mode: ${modeLabel}
- Selected checks:
${selectedList}

## Global Evidence Boundaries
${COMMON_PROMPT_BLOCKS.evidence.en}

## Manuscript Protection
${auditProtection(preferences.executionMode, "en")}
${visualRules}${bibliographyRules}
## Selected Audit Contracts
${adapters}

## Coordinated Audit Method
1. Build shared ledgers before running selected checks; cover the main paper and appendix rather than relying on keyword search.
2. Give one stable issue ID to each root cause and attach every applicable tag, for example \`AUD-007 [DATA][VIS][CLAIM]\`; never count the issue again under another check.
3. Every finding includes severity (Blocker / Major / Minor), confidence, exact location (file and line, section/visual/cite key, and PDF page as applicable), observation, direct evidence, impact, lowest-risk action, and status.
4. Severity reflects scientific impact: Blocker makes a core claim, value, or citation unreliable; Major materially affects interpretation, reproduction, or submission judgment; Minor is a deterministic consistency or expression defect.
5. Do not present preference differences, unsupported guesses, or generic style opinions as defects. Even when a selected check has zero findings, report its coverage and “no verifiable issue found.”
6. Report cross-check statistics and Blockers first, followed by the issue register, coverage summary for every selected check, deterministic fixes, author decisions, and unavailable-evidence boundaries.

## Deliverables
${deliverables}

Do not return only a generic checklist, overall impression, or unlocatable advice. Read the complete materials and perform the selected audit now.`;
}
