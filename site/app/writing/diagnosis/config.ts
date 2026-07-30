import type { Language } from "../../config";
import type {
  LocalizedText,
  NumberRange,
  WorkbenchCopy,
  WorkbenchControl,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../../workbench/types";
import {
  CAPTION_LENGTH_POLICY,
  buildCaptionLengthGuidance,
} from "../../../content/prompts/captionLength";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

function scalar(values: Readonly<WorkbenchValues>, id: string) {
  return String(values[id] ?? "").trim();
}

function enabled(values: Readonly<WorkbenchValues>, id: string) {
  return values[id] === true;
}

function selected(values: Readonly<WorkbenchValues>, id: string) {
  return Array.isArray(values[id])
    ? (values[id] as readonly string[])
    : [];
}

function rangeValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: NumberRange,
) {
  const value = values[id];
  return Array.isArray(value) && value.length === 2
    ? ([Number(value[0]), Number(value[1])] as NumberRange)
    : fallback;
}

interface CopySeed {
  eyebrow: string;
  title: string;
  subtitle: string;
  preset: string;
  inputTitle: string;
  inputItems: readonly string[];
  inputHint: string;
  promptTitle: string;
  promptPurpose: string;
}

function sharedCopy(seed: Record<Language, CopySeed>) {
  return {
    zh: {
      ...seed.zh,
      reset: "恢复默认配置",
      resetHint: "恢复全文、标准诊断和仅输出报告。",
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
      resetHint:
        "Restore whole-manuscript scope, standard depth, and report-only mode.",
      switchPromptLanguage: "Switch prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError:
        "Copy failed. Expand the prompt and select the text manually.",
      on: "On",
      off: "Off",
    },
  } satisfies Record<Language, WorkbenchCopy>;
}

const DIAGNOSIS_SCOPES = {
  whole: text("全文", "Whole manuscript"),
  selected: text("选定内容", "Selected sections"),
};

const MANUSCRIPT_SECTIONS = {
  abstract: text("Abstract", "Abstract"),
  introduction: text("Introduction", "Introduction"),
  "related-work": text("Related Work", "Related Work"),
  method: text("Method", "Method"),
  "experiments-results": text(
    "Experiments & Results",
    "Experiments & Results",
  ),
  discussion: text("Discussion & Limitations", "Discussion & Limitations"),
  conclusion: text("Conclusion", "Conclusion"),
  "captions-notes": text("Captions、Notes 与脚注", "Captions, notes, and footnotes"),
  equations: text("公式及其说明文字", "Equations and surrounding prose"),
};

interface LabeledPrompt {
  label: LocalizedText;
  prompt: LocalizedText;
}

const DIAGNOSIS_DEPTHS: Record<string, LabeledPrompt> = {
  focused: {
    label: text("聚焦", "Focused"),
    prompt: text(
      "只报告反复出现或明显影响理解的主要习惯",
      "report only recurring or clearly consequential habits",
    ),
  },
  standard: {
    label: text("标准", "Standard"),
    prompt: text(
      "覆盖主要与中等问题，忽略无关紧要的个人偏好",
      "cover major and moderate issues while ignoring inconsequential preferences",
    ),
  },
  deep: {
    label: text("深入", "Deep"),
    prompt: text(
      "同时检查局部阅读阻力，但不退化为逐词语法挑错",
      "include local reading friction without degenerating into word-by-word copyediting",
    ),
  },
};

const READER_PROFILES: Record<string, LabeledPrompt> = {
  infer: {
    label: text("根据论文判断", "Infer from the manuscript"),
    prompt: text(
      "根据论文主题、目标读者和现有写法判断",
      "infer from the topic, intended readership, and current manuscript",
    ),
  },
  specialist: {
    label: text("领域专家", "Specialists"),
    prompt: text(
      "面向熟悉该子领域术语与常见方法的专家",
      "specialists familiar with the subfield's terminology and standard methods",
    ),
  },
  mixed: {
    label: text("混合读者", "Mixed technical audience"),
    prompt: text(
      "同时服务子领域专家和相邻方向研究者",
      "both subfield specialists and researchers from adjacent areas",
    ),
  },
  broad: {
    label: text("广泛科研读者", "Broad research audience"),
    prompt: text(
      "减少不必要的专业负担，但保留科学精度",
      "reduce avoidable specialist burden while preserving scientific precision",
    ),
  },
};

const DIAGNOSIS_DIMENSIONS: Record<string, LabeledPrompt> = {
  "argument-flow": {
    label: text("主线与章节功能", "Argument flow and section function"),
    prompt: text(
      "检查核心主线能否贯穿标题、摘要、引言、正文和结论；检查章节职责、段落落点、old-to-new 信息流以及失焦、倒序或纯导航内容",
      "check whether one central line survives across title, abstract, introduction, body, and conclusion; inspect section roles, paragraph landing points, old-to-new flow, drift, inversion, and empty navigation",
    ),
  },
  "citation-practice": {
    label: text("引用覆盖与放置", "Citation coverage and placement"),
    prompt: text(
      "标出对领域事实、现状、比较、缺口或他人工作的高置信度缺引文位置；检查引用是否紧贴所支持的 claim，并区分文献事实、作者推断和本文发现",
      "flag high-confidence missing citations for field facts, current practice, comparisons, gaps, or prior work; check that citations attach to the exact claim and distinguish source facts, author inference, and this paper's findings",
    ),
  },
  "paragraph-craft": {
    label: text("段落与句间推进", "Paragraph and sentence progression"),
    prompt: text(
      "检查每段是否只承担一个主要功能，并形成语境或问题、展开、落点或过渡；检查 topic position、stress position、指代、主谓距离与句间衔接",
      "check that each paragraph performs one main job and moves from context or question through development to a takeaway or transition; inspect topic and stress positions, references, subject-verb distance, and sentence linkage",
    ),
  },
  "display-writing": {
    label: text("图表 Caption 与 Note", "Figure, table, caption, and note writing"),
    prompt: text(
      "检查 caption 是否自足但简洁、是否交代面板和必要统计语义；识别把方法、结果解释、公式推导或正文论证塞进 caption、note 或脚注，以及正文与图表的重复",
      "check whether captions are concise yet self-contained and explain panels plus essential statistical semantics; identify methods, interpretation, derivations, or main-text arguments displaced into captions, notes, or footnotes, and duplication between prose and displays",
    ),
  },
  "results-writing": {
    label: text("结果段落与 Finding", "Results prose and findings"),
    prompt: text(
      "检查结果段落是否说明问题或比较目的、关键 finding、必要证据和 take-away；识别逐格复述图表、堆砌数字或没有按主结果与次要结果分配篇幅",
      "check whether results paragraphs state the question or comparison purpose, key finding, necessary evidence, and take-away; identify cell-by-cell display narration, number dumping, and failure to allocate prose by result importance",
    ),
  },
  "mathematical-writing": {
    label: text("公式与数学叙述", "Equations and mathematical exposition"),
    prompt: text(
      "检查公式是否融入句子、用途是否先被建立、符号是否及时定义、公式前后是否解释其科学含义；识别孤立公式、符号堆叠、正文机械复述和 note 中的冗长推导",
      "check whether equations participate in sentences, have a stated purpose, define symbols when needed, and receive scientific interpretation; identify orphan equations, notation piles, mechanical prose restatement, and long derivations hidden in notes",
    ),
  },
  "language-precision": {
    label: text("精确、克制与读者负担", "Precision, restraint, and reader burden"),
    prompt: text(
      "检查术语与缩写负担、名词串、模糊主语或指代、过度断言或过度弱化、空泛形容词和不必要的复杂句；主动语态、被动语态、we/our 与冒号只按语境判断，不设机械禁令",
      "check jargon and acronym burden, noun stacks, vague subjects or antecedents, overclaiming or over-hedging, empty modifiers, and needless sentence complexity; judge active or passive voice, we/our, and colons contextually rather than by blanket rules",
    ),
  },
  "redundancy-navigation": {
    label: text("重复、标题与机械化表达", "Redundancy, headings, and mechanical prose"),
    prompt: text(
      "检查跨章节重复 claim 或定义、模板化铺垫与总结、泛化标题、过密层级和冗长导航句；区分必要回扣与无新增价值的重复",
      "check repeated claims or definitions across sections, formulaic setup and recap, generic headings, over-dense hierarchy, and verbose navigation; distinguish useful callbacks from repetition that adds no value",
    ),
  },
};

const DIAGNOSIS_ACTIONS = {
  report: text("只诊断并给出指正", "Diagnosis and guidance only"),
  repair: text("诊断并安全修复", "Diagnose and safely repair"),
};

function optionEntries(
  values: Record<string, LocalizedText>,
) {
  return Object.entries(values).map(([value, label]) => ({ value, label }));
}

function labelsFor(
  values: Readonly<WorkbenchValues>,
  id: string,
  labels: Record<string, { label: LocalizedText } | LocalizedText>,
  language: Language,
) {
  return selected(values, id)
    .map((value) => {
      const item = labels[value];
      if (!item) return value;
      return "label" in item ? item.label[language] : item[language];
    })
    .join(language === "zh" ? "、" : ", ");
}

function selectedDimensionInstructions(
  values: Readonly<WorkbenchValues>,
  language: Language,
) {
  return selected(values, "dimensions")
    .map((id) => DIAGNOSIS_DIMENSIONS[id]?.prompt[language])
    .filter(Boolean)
    .map((instruction) => `- ${instruction}`)
    .join("\n");
}

export const WRITING_DIAGNOSIS_WORKBENCH = {
  id: "writing-diagnosis",
  activePage: "writing-diagnosis",
  copy: sharedCopy({
    zh: {
      eyebrow: "ACADEMIC WRITING DIAGNOSIS",
      title: "学术写作诊断",
      subtitle:
        "发现作者自己最难察觉的写作手法与长期习惯问题，而不是重新评审论文的创新性和实验。",
      preset: "全文理解 · 具体定位 · 可执行指正",
      inputTitle: "诊断材料",
      inputItems: [
        "主稿 .tex（必需）",
        "最新编译 PDF（建议）",
        ".bib（建议）",
        "目标 venue 指南（可选）",
      ],
      inputHint:
        "无需上传 figures 或实验源数据。本页诊断写作表现；科学正确性、数据一致性和 BibTeX 真伪属于其他专项审计。",
      promptTitle: "学术写作诊断 Prompt",
      promptPurpose:
        "从全文、段落和句子三个尺度定位反复出现的写作弱点，并解释如何改进。",
    },
    en: {
      eyebrow: "ACADEMIC WRITING DIAGNOSIS",
      title: "Academic writing diagnosis",
      subtitle:
        "Expose recurring writing techniques and habits that authors rarely notice themselves—without re-reviewing novelty or experiments.",
      preset: "Whole-text reading · precise locations · actionable guidance",
      inputTitle: "Diagnostic materials",
      inputItems: [
        "Main .tex (required)",
        "Latest compiled PDF (recommended)",
        ".bib (recommended)",
        "Target-venue guidance (optional)",
      ],
      inputHint:
        "Figures and raw experimental data are unnecessary. This page diagnoses writing; scientific correctness, data consistency, and BibTeX authenticity belong to separate audits.",
      promptTitle: "Academic writing diagnosis prompt",
      promptPurpose:
        "Locate recurring writing weaknesses at manuscript, paragraph, and sentence scale, then explain how to improve them.",
    },
  }),
  controls: [
    {
      id: "scope",
      kind: "segmented",
      label: text("诊断范围", "Diagnostic scope"),
      description: text(
        "全文最有利于发现跨章节重复和叙事断裂。",
        "Whole-manuscript reading best exposes repetition and narrative breaks.",
      ),
      defaultValue: "whole",
      options: optionEntries(DIAGNOSIS_SCOPES),
      span: "full",
    },
    {
      id: "sections",
      kind: "multi",
      label: text("选择内容", "Select sections"),
      description: text(
        "至少选择一项；caption、note 和公式可独立诊断。",
        "Select at least one item; captions, notes, and equations can be diagnosed independently.",
      ),
      defaultValue: ["introduction"],
      minSelected: 1,
      options: optionEntries(MANUSCRIPT_SECTIONS),
      visibleWhen: (values) => scalar(values, "scope") === "selected",
      span: "full",
    },
    {
      id: "depth",
      kind: "segmented",
      label: text("诊断深度", "Diagnostic depth"),
      description: text(
        "默认关注会影响阅读、论证或审稿判断的问题。",
        "The default focuses on issues that affect reading, argument, or reviewer judgment.",
      ),
      defaultValue: "standard",
      options: Object.entries(DIAGNOSIS_DEPTHS).map(([value, item]) => ({
        value,
        label: item.label,
      })),
      span: "full",
    },
    {
      id: "audience",
      kind: "select",
      label: text("目标读者", "Intended readers"),
      description: text(
        "读者背景决定术语解释和技术细节的合理密度。",
        "Reader background determines the appropriate density of terminology and detail.",
      ),
      defaultValue: "infer",
      options: Object.entries(READER_PROFILES).map(([value, item]) => ({
        value,
        label: item.label,
      })),
    },
    {
      id: "dimensions",
      kind: "multi",
      label: text("诊断维度", "Diagnostic dimensions"),
      description: text(
        "允许组合检查；最终按反复出现的习惯归并，不按清单机械报错。",
        "Combine dimensions freely; findings are grouped by recurring habit rather than emitted as checklist noise.",
      ),
      defaultValue: Object.keys(DIAGNOSIS_DIMENSIONS),
      minSelected: 1,
      options: Object.entries(DIAGNOSIS_DIMENSIONS).map(
        ([value, item]) => ({
          value,
          label: item.label,
        }),
      ),
      span: "full",
    },
    {
      id: "browseCitations",
      kind: "toggle",
      label: text("为缺引文位置检索候选文献", "Search candidate sources for citation gaps"),
      description: text(
        "只处理高置信度缺口；新增来源必须核验并单独给出 BibTeX，不自动插入正文。",
        "Only address high-confidence gaps. Verify new sources, return BibTeX separately, and never insert them silently.",
      ),
      defaultValue: false,
      enabledLabel: text("联网检索候选", "Search verified candidates"),
      disabledLabel: text("只定位缺口", "Locate gaps only"),
      visibleWhen: (values) =>
        selected(values, "dimensions").includes("citation-practice"),
    },
    {
      id: "action",
      kind: "segmented",
      label: text("处理方式", "Action"),
      description: text(
        "默认只给出诊断，先让作者看清自己的写作习惯。",
        "The default reports the diagnosis so the author can see recurring habits before revision.",
      ),
      defaultValue: "report",
      options: optionEntries(DIAGNOSIS_ACTIONS),
      span: "full",
    },
    {
      id: "preserveStrengths",
      kind: "toggle",
      label: text("标记并保护原稿中的好表达", "Identify and preserve strong writing"),
      description: text(
        "避免为了统一风格而改坏已经清楚、准确且有辨识度的文字。",
        "Prevent clear, accurate, distinctive prose from being flattened for stylistic uniformity.",
      ),
      defaultValue: true,
      enabledLabel: text("保护好表达", "Preserve strengths"),
      disabledLabel: text("不单独标记", "Do not mark separately"),
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text("Caption 建议长度", "Suggested caption length"),
      description: text(
        "仅在安全修复确需改写 Caption 时使用；默认 10–40 words，必要时允许超出，长度本身不构成错误。",
        "Use only when a safe repair genuinely rewrites a caption. The default 10–40-word range is flexible, and length alone is never an error.",
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text("words", "words"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充关注点", "Additional focus"),
      description: text(
        "例如特别检查 caption、公式说明或某位作者反复出现的习惯。",
        "For example, focus on captions, equation exposition, or a recurring author habit.",
      ),
      defaultValue: "",
      placeholder: text(
        "可留空；不要在这里粘贴论文全文。",
        "Optional; do not paste the manuscript here.",
      ),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const scope =
      scalar(values, "scope") === "whole"
        ? DIAGNOSIS_SCOPES.whole[language]
        : labelsFor(values, "sections", MANUSCRIPT_SECTIONS, language);
    const depthId = scalar(values, "depth");
    const audienceId = scalar(values, "audience");
    const depth =
      DIAGNOSIS_DEPTHS[depthId]?.prompt[language] ?? depthId;
    const audience =
      READER_PROFILES[audienceId]?.prompt[language] ?? audienceId;
    const dimensions = labelsFor(
      values,
      "dimensions",
      DIAGNOSIS_DIMENSIONS,
      language,
    );
    const dimensionInstructions = selectedDimensionInstructions(
      values,
      language,
    );
    const repair = scalar(values, "action") === "repair";
    const browse =
      enabled(values, "browseCitations") &&
      selected(values, "dimensions").includes("citation-practice");
    const preserve = enabled(values, "preserveStrengths");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange,
      ),
      language,
    );
    const custom =
      scalar(values, "custom") || (language === "zh" ? "无" : "None");

    if (language === "zh") {
      return `# 学术写作诊断

完整阅读主稿 \`.tex\`，并结合最新 \`.pdf\` 判断真实阅读效果；\`.bib\` 只用于理解现有引用边界。本任务诊断写作手法和反复出现的写作习惯，不评价 Idea 创新性、实验设计、数据自洽、BibTeX 真伪、投稿格式、抄袭或 AI 生成概率。

请理解这些规则希望保护的写作目标，并运用你的专业判断完成比机械套用清单更准确的诊断；任何灵活处理仍须遵守证据边界。

## 本次配置
- 范围：${scope}
- 目标读者：${audience}
- 深度：${depth}
- 维度：${dimensions}
- 处理：${DIAGNOSIS_ACTIONS[repair ? "repair" : "report"].zh}
- 引文候选：${browse ? "联网核查高置信度缺口，给出真实来源与可用 BibTeX；不自动插入" : "只定位写作层面的缺引文位置"}
- 保护好表达：${preserve ? "是" : "不单独标记"}
- Caption 建议：${captionGuidance} 仅在安全修复确需改写 Caption 时采用，不能据此单独判错。
- 补充关注：${custom}

先在内部建立全文主线和 section-function map，再按“全文与章节 → 段落与图表 → 句子与公式”三个尺度诊断。尊重不同章节的真实功能：Abstract 讲完整故事；Introduction 建立问题、动机、缺口、方案与贡献；Related Work 做综合与定位；Method 解释设计逻辑；Experiments & Results 用证据形成 finding；Discussion 解释意义而不是重播结果；Conclusion 不引入新证据。

${dimensionInstructions}

不要用字数、句长或 caption 长度单独判错。判断某段文字是否占错位置、重复已有载体、增加读者负担或没有推进论证；区分必要回扣与机械重复。缺引文只报告高置信度位置，本文自己的结果、贡献或基于已呈现证据的总结不应被误判为必须引用。不要为了显得“更学术”而增加术语、被动语态、we/our、冒号或模板化连接词。

## 输出
1. 用一段话给出全文写作画像，并列出最影响阅读的 3–5 个反复习惯。
2. 按习惯归并问题，而不是逐句堆清单。每项给出严重度、出现频率、精确文件与行号、最短必要原文、读者为何受阻、修复原则和一个不补造事实的局部示例。没有问题的维度不凑数。
3. 给出 section-function map，说明各章节已经完成的功能、缺失的功能和不属于该章节的内容。
4. 给出按收益排序的修改顺序。${preserve ? "另列 3–5 个应保留的好表达或有效写法。" : ""}
${browse ? "5. 对高置信度缺引文位置，单独列出经过官网、出版社或论文原文核验的候选来源、建议支持的 claim、URL/DOI 和完整 BibTeX；找不到就明确保留缺口。" : ""}

${
  repair
    ? "同时交付 `writing_diagnosis.md`、修订后的完整 `.tex` 和 high-risk diff。只修复报告中有充分把握的写作问题；修改最小但完整的语义单元，不在段末追加补丁句。除修复所必需的局部组织外，不改变科学 claim、数字、实验、公式内容、引用集合、图表内容或章节顺序；不确定项只报告。"
    : "只交付 `writing_diagnosis.md`，不要修改论文文件。"
}`;
    }

    return `# Academic Writing Diagnosis

Read the main \`.tex\` in full and use the latest \`.pdf\` to assess the actual reading experience; use the \`.bib\` only to understand the existing citation boundary. Diagnose writing technique and recurring author habits. Do not assess idea novelty, experimental design, data consistency, BibTeX authenticity, venue formatting, plagiarism, or AI-generation probability.

Understand the writing goals behind these rules and use expert judgment to produce a more accurate diagnosis than mechanical checklist application, while remaining within the evidence boundary.

## Configuration
- Scope: ${scope}
- Intended readers: ${audience}
- Depth: ${depth}
- Dimensions: ${dimensions}
- Action: ${DIAGNOSIS_ACTIONS[repair ? "repair" : "report"].en}
- Citation candidates: ${browse ? "browse high-confidence gaps, verify authentic sources, return usable BibTeX, and never insert them silently" : "locate writing-level citation gaps only"}
- Preserve strong prose: ${preserve ? "yes" : "do not mark separately"}
- Caption guidance: ${captionGuidance} Apply it only when a safe repair genuinely rewrites a caption; never diagnose an error from this range alone.
- Additional focus: ${custom}

First build an internal central-argument and section-function map. Diagnose at three scales: manuscript and section, paragraph and display item, then sentence and equation. Respect section functions: the Abstract tells a complete story; the Introduction establishes problem, motivation, gap, solution, and contributions; Related Work synthesizes and positions; Method explains design logic; Experiments & Results turns evidence into findings; Discussion interprets rather than replays results; Conclusion introduces no new evidence.

${dimensionInstructions}

Do not declare an error from word count, sentence length, or caption length alone. Judge whether prose is misplaced, duplicates another information carrier, burdens the reader, or fails to advance the argument. Distinguish purposeful callbacks from mechanical repetition. Report only high-confidence citation gaps; this paper's own results, contributions, and evidence-grounded summaries do not automatically need citations. Never add terminology, passive voice, we/our, colons, or formulaic transitions merely to sound academic.

## Output
1. Give a one-paragraph writing profile and the 3–5 recurring habits with the greatest reader cost.
2. Group findings by habit rather than dumping sentence-level flags. For each, report severity, frequency, exact file and line, the shortest necessary excerpt, reader cost, repair principle, and one local example that invents no fact. Do not manufacture findings for clean dimensions.
3. Provide a section-function map showing fulfilled functions, missing functions, and content that belongs elsewhere.
4. Rank revisions by expected benefit. ${preserve ? "Also list 3–5 strong passages or effective techniques that should be preserved." : ""}
${browse ? "5. For high-confidence citation gaps, separately list sources verified against official pages, publisher records, or the original paper, the claim each source could support, URL/DOI, and complete BibTeX. Preserve the gap when no suitable source is verified." : ""}

${
  repair
    ? "Also deliver `writing_diagnosis.md`, a complete revised `.tex`, and a high-risk diff. Repair only well-supported writing problems from the report. Edit the smallest coherent semantic unit and never append patch sentences. Except for local organization required by the repair, do not change scientific claims, numbers, experiments, equation content, citation sets, display content, or section order. Report uncertain items without changing them."
    : "Deliver `writing_diagnosis.md` only and do not modify manuscript files."
}`;
  },
} satisfies WorkbenchDefinition;

export function getDefaultWritingDiagnosisValues(): WorkbenchValues {
  return Object.fromEntries(
    WRITING_DIAGNOSIS_WORKBENCH.controls.map((control) => [
      control.id,
      Array.isArray(control.defaultValue)
        ? [...control.defaultValue]
        : control.defaultValue,
    ]),
  );
}

export function normalizeWritingDiagnosisValues(
  input: Record<string, unknown> = {},
): WorkbenchValues {
  const values = getDefaultWritingDiagnosisValues();
  const controls: readonly WorkbenchControl[] =
    WRITING_DIAGNOSIS_WORKBENCH.controls;

  for (const control of controls) {
    const value = input[control.id];
    if (value === undefined) continue;

    if (control.kind === "toggle") {
      if (typeof value === "boolean") values[control.id] = value;
      continue;
    }
    if (control.kind === "range") {
      if (!Array.isArray(value) || value.length !== 2) continue;
      const left = Math.min(
        control.max,
        Math.max(control.min, Number(value[0])),
      );
      const right = Math.min(
        control.max,
        Math.max(control.min, Number(value[1])),
      );
      if (Number.isFinite(left) && Number.isFinite(right)) {
        values[control.id] = [
          Math.min(left, right),
          Math.max(left, right),
        ];
      }
      continue;
    }
    if (control.kind === "multi") {
      if (!Array.isArray(value)) continue;
      const allowed = new Set(
        control.options.map((option) => option.value),
      );
      const next = value
        .map(String)
        .filter((item) => allowed.has(item));
      if (next.length >= (control.minSelected ?? 0)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "select" || control.kind === "segmented") {
      const next = String(value);
      if (control.options.some((option) => option.value === next)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "text" || control.kind === "textarea") {
      values[control.id] = String(value);
    }
  }

  if (!selected(values, "dimensions").includes("citation-practice")) {
    values.browseCitations = false;
  }
  return values;
}

export function buildWritingDiagnosisPrompt(
  input: Record<string, unknown>,
  language: Language,
) {
  const values = normalizeWritingDiagnosisValues(input);
  return WRITING_DIAGNOSIS_WORKBENCH.buildPrompt(values, language);
}
