import type { Language } from "../../config";
import type {
  NumberRange,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../../workbench/types";

const CONVERSION_IDS = [
  "conference-journal",
  "journal-conference",
  "preprint-submission",
  "blind-camera-ready",
  "venue-migration",
] as const;

type ConversionId = (typeof CONVERSION_IDS)[number];

const CONVERSION_NAMES: Record<ConversionId, Record<Language, string>> = {
  "conference-journal": {
    zh: "会议论文 → 期刊扩展版",
    en: "Conference paper → journal extension",
  },
  "journal-conference": {
    zh: "期刊论文 → 会议版本",
    en: "Journal paper → conference version",
  },
  "preprint-submission": {
    zh: "预印本 → 投稿版本",
    en: "Preprint → submission version",
  },
  "blind-camera-ready": {
    zh: "匿名稿 → Camera-ready",
    en: "Blind manuscript → camera-ready",
  },
  "venue-migration": {
    zh: "Venue / 模板迁移",
    en: "Venue / template migration",
  },
};

const EXECUTION_NAMES = {
  convert: { zh: "直接完成转换", en: "Perform the conversion" },
  plan: { zh: "只输出转换方案", en: "Conversion plan only" },
} as const;

const DEPTH_NAMES = {
  format: { zh: "仅格式与模板", en: "Format and template only" },
  adaptive: { zh: "格式 + 叙事适配", en: "Format + narrative adaptation" },
  extension: {
    zh: "基于现有证据扩展",
    en: "Evidence-supported extension",
  },
} as const;

const TEMPLATE_NAMES = {
  official: {
    zh: "联网获取最新官方模板",
    en: "Fetch the latest official template",
  },
  provided: {
    zh: "使用用户提供模板",
    en: "Use the provided template",
  },
  preserve: {
    zh: "暂时沿用当前模板",
    en: "Preserve the current template",
  },
} as const;

const ANONYMITY_NAMES = {
  verify: { zh: "按官方规则核验", en: "Verify official policy" },
  double: { zh: "双盲匿名", en: "Double-blind" },
  single: { zh: "单盲投稿", en: "Single-blind" },
  public: { zh: "非匿名 / Camera-ready", en: "Non-anonymous / camera-ready" },
} as const;

const APPENDIX_NAMES = {
  verify: { zh: "按官方规则决定", en: "Follow official policy" },
  allow: { zh: "允许作为补充", en: "Allow supplementary appendix" },
  none: { zh: "不使用附录", en: "No appendix" },
} as const;

const EXTENSION_FOCUS_NAMES = {
  theory: { zh: "理论与问题定义", en: "Theory and problem formulation" },
  method: { zh: "方法与机制", en: "Method and mechanisms" },
  experiments: { zh: "新增实验", en: "New experiments" },
  analysis: { zh: "结果与稳健性分析", en: "Results and robustness analysis" },
  literature: { zh: "文献定位", en: "Literature positioning" },
  discussion: { zh: "讨论与外部效度", en: "Discussion and external validity" },
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

function rangeText(range: NumberRange, unit: string) {
  return `${range[0]}–${range[1]} ${unit}`;
}

function directionInstructions(
  values: Readonly<WorkbenchValues>,
  direction: ConversionId,
  language: Language,
) {
  if (direction === "conference-journal") {
    const depth = enumValue(
      values,
      "conversionDepth",
      ["format", "adaptive", "extension"] as const,
      "adaptive",
    );
    const extensionFocus = multiValue(values, "extensionFocus")
      .map(
        (id) =>
          EXTENSION_FOCUS_NAMES[
            id as keyof typeof EXTENSION_FOCUS_NAMES
          ]?.[language],
      )
      .filter(Boolean)
      .join(language === "zh" ? "、" : ", ");
    const priorDisclosure = booleanValue(values, "priorDisclosure", true);
    if (depth === "format") {
      return language === "zh"
        ? `- 只建立会议版—期刊模板映射并完成必要格式迁移，不扩写研究内容。
- ${priorDisclosure ? "核验并按目标期刊官方政策处理既有会议版本的引用与披露。" : "仍需核验 prior-publication 政策；官方要求披露时必须执行并记录配置冲突。"}`
        : `- Build the conference-to-journal template mapping and perform only required formatting migration; do not extend research content.
- ${priorDisclosure ? "Verify and follow the target journal's official citation and disclosure policy for the conference version." : "Still verify prior-publication policy; comply and record a configuration conflict when disclosure is required."}`;
    }
    if (depth === "adaptive") {
      return language === "zh"
        ? `- 建立会议版—期刊版结构与叙事 delta，补足期刊读者需要的解释和过渡，但不新增实验、分析或科学结论。
- ${priorDisclosure ? "核验并按目标期刊官方政策处理既有会议版本的引用与披露。" : "仍需核验 prior-publication 政策；官方要求披露时必须执行并记录配置冲突。"}`
        : `- Build the conference-to-journal structural and narrative delta, adding explanation and transitions needed by journal readers without adding experiments, analyses, or scientific conclusions.
- ${priorDisclosure ? "Verify and follow the target journal's official citation and disclosure policy for the conference version." : "Still verify prior-publication policy; comply and record a configuration conflict when disclosure is required."}`;
    }
    return language === "zh"
      ? `- 先建立会议版—期刊版 delta map，确认期刊扩展带来新的研究价值，而不是拉长段落。当前扩展重点：${extensionFocus || "由证据决定"}。
- 只整合已经提供且可核验的新理论、方法、实验或分析；材料尚未提供的扩展写入行动清单，不得生成结果。
- ${priorDisclosure ? "核验目标期刊对既有会议版本、实质扩展、原文引用和披露的官方政策，并在稿件与报告中按规则处理。" : "仍需核验目标期刊的 prior-publication 政策；若披露是官方要求，必须执行并在报告中说明与当前配置的冲突。"}`
      : `- Build a conference-to-journal delta map first and ensure the journal version adds research value rather than longer prose. Current extension priorities: ${extensionFocus || "evidence-driven"}.
- Integrate only new theory, methods, experiments, or analyses that are supplied and verifiable; place any unsupported extension in an action list instead of generating results.
- ${priorDisclosure ? "Verify and follow the target journal's official policy for prior conference versions, substantive extension, citation of the earlier paper, and disclosure." : "Still verify the target journal's prior-publication policy; if disclosure is officially required, comply and explain the configuration conflict in the report."}`;
  }

  if (direction === "journal-conference") {
    const priority = enumValue(
      values,
      "compressionPriority",
      ["core-evidence", "argument", "balanced"] as const,
      "core-evidence",
    );
    const priorityText =
      priority === "core-evidence"
        ? language === "zh"
          ? "优先保留核心 Method 与 Experiments and Results"
          : "prioritize core Method and Experiments & Results"
        : priority === "argument"
          ? language === "zh"
            ? "围绕最强创新主线重组"
            : "reorganize around the strongest novelty spine"
          : language === "zh"
            ? "均衡保留论证与证据"
            : "balance argument and evidence";
    const appendixAllowed =
      enumValue(
        values,
        "appendix",
        ["verify", "allow", "none"] as const,
        "verify",
      ) !== "none";
    return language === "zh"
      ? `- ${priorityText}。先区分决定性内容与真正补充内容，再压缩重复背景、次要推导和低增量分析；不按章节同比例删减。
- ${appendixAllowed ? "任何移入附录的内容必须在官方规则允许且不影响方法复现、结果判断和局限理解时才移动" : "当前不使用附录，所有必要方法、结果和边界必须留在正文；只能删除真实重复或非必要内容"}；不得隐藏不利结果。
- 建立删除/迁移台账，逐项说明原位置、科学功能、去向和对 claim 的影响。`
      : `- ${priorityText}. Separate decisive from genuinely supplementary material before compressing repeated background, secondary derivations, and low-increment analysis; never cut every section by the same ratio.
- ${appendixAllowed ? "Move content to an appendix only when official rules permit it and method reproduction, result assessment, and limitation understanding remain intact" : "No appendix is allowed: keep every necessary method, result, and boundary in the main text, removing only true redundancy or nonessential material"}; never hide unfavorable evidence.
- Maintain a deletion/movement ledger with original location, scientific function, destination, and claim impact.`;
  }

  if (direction === "preprint-submission") {
    const priorDisclosure = booleanValue(values, "priorDisclosure", true);
    return language === "zh"
      ? `- 将预印本适配为可审稿版本：核对匿名、页面或字数、补充材料、代码链接和预印本政策，并只处理官方规则要求的差异。
- 保留预印本中的高价值表述和完整证据；为目标读者调整定位时，不静默改变 claim 强度或删去边界。
- ${priorDisclosure ? "在报告中记录预印本状态、官方政策和需要披露或处理的位置。" : "若官方政策要求披露预印本，必须执行并在报告中标记配置冲突。"}`
      : `- Adapt the preprint into a review-ready submission by checking anonymity, page or word policy, supplements, code links, and preprint policy, changing only differences required by official rules.
- Preserve strong preprint prose and complete evidence. Audience-specific repositioning must not silently change claim strength or remove boundaries.
- ${priorDisclosure ? "Record the preprint status, official policy, and every required disclosure or treatment in the report." : "If official policy requires preprint disclosure, comply and mark the configuration conflict in the report."}`;
  }

  if (direction === "blind-camera-ready") {
    const restoreMetadata = booleanValue(values, "restoreMetadata", true);
    return language === "zh"
      ? `- 从匿名稿生成 Camera-ready：${restoreMetadata ? "恢复作者提供的姓名、单位、致谢、资助和代码/项目链接" : "暂不恢复身份元数据，仅完成其余 Camera-ready 转换"}；没有提供的身份或资助信息必须列为待补，不能猜测。
- 保留评审后确认的科学内容，移除匿名化占位和审稿期标记；对任何实质内容变化单列 high-risk diff。
- 使用正式版模板重新核查版权、页眉、作者块、补充材料与最终页数，并完成编译。`
      : `- Produce a camera-ready version from the blind manuscript: ${restoreMetadata ? "restore author-supplied names, affiliations, acknowledgments, funding, and code/project links" : "leave identity metadata unresolved while completing the remaining camera-ready conversion"}. List missing identity or funding information rather than guessing.
- Preserve scientifically accepted content and remove anonymization placeholders and review-stage markers; list every substantive content change in a high-risk diff.
- Recheck copyright, running headers, author block, supplements, and final length against the production template, then compile.`;
  }

  return language === "zh"
    ? `- 先比较源与目标的官方模板、结构和政策，再建立迁移映射；区分纯格式差异、叙事适配和可能改变科学含义的高风险变化。
- 模板迁移应保留公式、算法、图表、引用、label/ref/cite、宏语义和图像质量；只有目标模板明确需要时才替换命令或重排浮动体。
- 允许为目标读者重组定位与过渡，但核心 claim、方法定义、数据和实验结论必须保持证据等价。`
    : `- Compare source and target official templates, structures, and policies before building a migration map; separate formatting differences, narrative adaptation, and high-risk changes that may alter scientific meaning.
- Preserve equations, algorithms, visuals, citations, label/ref/cite links, macro semantics, and image quality during template migration; replace commands or reflow floats only when the target template requires it.
- Positioning and transitions may be adapted for the target audience, but core claims, method definitions, values, and experimental conclusions must remain evidence-equivalent.`;
}

function planningInstructions(
  direction: ConversionId,
  language: Language,
) {
  const focus = {
    "conference-journal": {
      zh: "建立会议版—期刊版 delta map，列出可由现有或待提供证据支持的实质扩展、prior-publication 披露和执行顺序；不实际扩写或编译。",
      en: "Build a conference-to-journal delta map covering evidence-supported substantive extensions, prior-publication disclosure, and execution order; do not expand or compile the manuscript.",
    },
    "journal-conference": {
      zh: "建立保留、压缩、删除与附录候选台账，评估每项对核心 claim 和复现性的影响；不实际删改。",
      en: "Build a retain/compress/remove/appendix-candidate ledger and assess the impact on core claims and reproducibility; do not edit the manuscript.",
    },
    "preprint-submission": {
      zh: "比较预印本与目标投稿版本的匿名、格式、补充材料和披露差异，形成逐项迁移计划；不修改预印本。",
      en: "Compare anonymity, formatting, supplement, and disclosure requirements between the preprint and target submission, producing an itemized migration plan without editing the preprint.",
    },
    "blind-camera-ready": {
      zh: "盘点需要恢复的作者元数据、致谢、链接、版权和正式版模板字段，标出缺失信息与验证步骤；不恢复身份或生成正式稿。",
      en: "Inventory identity metadata, acknowledgments, links, copyright, and production-template fields to restore, marking missing inputs and validation steps; do not reveal identities or generate final files.",
    },
    "venue-migration": {
      zh: "建立源—目标模板、政策、结构、宏、图表和附件映射，区分自动迁移项与高风险人工复核项；不修改文件。",
      en: "Map source and target templates, policies, structure, macros, visuals, and attachments, separating mechanical migration from high-risk review; do not modify files.",
    },
  } as const;
  return `- ${focus[direction][language]}`;
}

function depthInstructions(
  depth: "format" | "adaptive" | "extension",
  language: Language,
) {
  if (depth === "format") {
    return language === "zh"
      ? "只处理模板、宏、浮动体、元数据和官方格式差异；除模板适配必需内容外，保持叙事与科学内容不变。"
      : "Handle template, macro, float, metadata, and official-format differences only; preserve narrative and scientific content except for wording strictly required by migration.";
  }
  if (depth === "extension") {
    return language === "zh"
      ? "允许整合作者已提供且可核验的新理论、实验或分析，并同步调整叙事；未提供的扩展只能列入行动清单。"
      : "Integrate author-supplied, verifiable new theory, experiments, or analyses and adapt the narrative accordingly; unsupported extensions belong in an action list only.";
  }
  return language === "zh"
    ? "在保持证据等价的前提下完成格式、结构和过渡适配；不新增实验或科学结论。"
    : "Adapt formatting, structure, and transitions while preserving evidential equivalence; add no experiment or scientific conclusion.";
}

function buildVersionConversionPrompt(
  values: Readonly<WorkbenchValues>,
  language: Language,
) {
  const direction = enumValue(
    values,
    "conversion",
    CONVERSION_IDS,
    "conference-journal",
  );
  const execution = enumValue(
    values,
    "execution",
    ["convert", "plan"] as const,
    "convert",
  );
  const depth = enumValue(
    values,
    "conversionDepth",
    ["format", "adaptive", "extension"] as const,
    "adaptive",
  );
  const templatePolicy = enumValue(
    values,
    "templatePolicy",
    ["official", "provided", "preserve"] as const,
    "official",
  );
  const anonymity = enumValue(
    values,
    "anonymity",
    ["verify", "double", "single", "public"] as const,
    "verify",
  );
  const appendix = enumValue(
    values,
    "appendix",
    ["verify", "allow", "none"] as const,
    "verify",
  );
  const figurePolicy = enumValue(
    values,
    "figurePolicy",
    ["preserve", "reflow", "supplement"] as const,
    "reflow",
  );
  const reportLanguage = enumValue(
    values,
    "reportLanguage",
    ["zh", "en", "bilingual"] as const,
    "zh",
  );
  const targetVenue = stringValue(values, "targetVenue").trim();
  const useLengthGuidance = booleanValue(values, "useLengthGuidance", false);
  const suggestedWords = rangeValue(values, "suggestedWords", [4500, 8000]);
  const customInstructions = stringValue(values, "customInstructions").trim();

  const reportLanguageText =
    reportLanguage === "bilingual"
      ? language === "zh"
        ? "中英双语"
        : "Chinese and English"
      : reportLanguage === "zh"
        ? language === "zh"
          ? "中文"
          : "Chinese"
        : language === "zh"
          ? "英文"
          : "English";

  const figureText =
    figurePolicy === "preserve"
      ? language === "zh"
        ? "保持现有图表内容、顺序与正文归属，仅做模板必需的尺寸适配"
        : "preserve visual content, order, and main-text placement, changing size only when the template requires it"
      : figurePolicy === "reflow"
        ? language === "zh"
          ? "允许为版面和论证顺序重排图表，但不得改变图中证据或 caption 含义"
          : "allow visual reflow for layout and argument order without changing visual evidence or caption meaning"
        : language === "zh"
          ? "允许把真正补充性的图表列为附录/补充材料候选，但不得自动移动决定性证据"
          : "allow genuinely supplementary visuals to become appendix/supplement candidates without automatically moving decisive evidence";

  const venueRules = targetVenue
    ? language === "zh"
      ? `目标 venue：${targetVenue}。联网核验并优先采用其当前官方作者指南、官方模板、投稿系统说明和 prior-publication/扩展政策；记录 URL 与核验日期。`
      : `Target venue: ${targetVenue}. Verify and prioritize its current official author instructions, official template, submission-system guidance, and prior-publication/extension policy; record URLs and the verification date.`
    : language === "zh"
      ? "未指定目标 venue：不得假定页数、匿名、模板、附录或扩展比例；输出通用转换结果及待确定规则。"
      : "No target venue is specified: do not assume any page, anonymity, template, appendix, or extension-percentage rule; deliver a venue-neutral conversion and list unresolved rules.";

  const lengthText = useLengthGuidance
    ? language === "zh"
      ? `建议正文 ${rangeText(suggestedWords, "词")}；这是可根据论文内容与官方规则接受、调整或忽略的参考，不是硬上限。`
      : `Suggested main-text length: ${rangeText(suggestedWords, "words")}; this is flexible guidance that may be accepted, adjusted, or ignored for content and official rules, not a hard cap.`
    : language === "zh"
      ? "默认不设置字数建议；以完整科学论证和核验后的官方规则为准。"
      : "No length guidance by default; prioritize a complete scientific argument and verified official rules.";

  const customText = customInstructions
    ? language === "zh"
      ? `\n- 个性化要求：${customInstructions}`
      : `\n- Custom requirement: ${customInstructions}`
    : "";
  const directionGuidance =
    execution === "plan"
      ? planningInstructions(direction, language)
      : directionInstructions(values, direction, language);
  const depthGuidance = depthInstructions(depth, language);
  const executionGuidance =
    execution === "plan"
      ? language === "zh"
        ? "本轮只建立规则、内容与文件迁移方案；所有“恢复、扩写、压缩、迁移、编译”均写为未来步骤，不执行任何修改或下载。"
        : "This run produces the rule, content, and file-migration plan only. Treat every restore, expand, compress, migrate, download, or compile action as a future step; execute no change."
      : language === "zh"
        ? "先建立源—目标规则与内容 delta，再执行并验证转换。"
        : "Build the source-to-target rule and content delta before executing and validating the conversion.";

  const deliverables =
    execution === "plan"
      ? language === "zh"
        ? `只输出 \`<base_name>_conversion_plan_${reportLanguage === "en" ? "en" : reportLanguage === "zh" ? "zh" : "bilingual"}.md\`：官方规则台账、源—目标结构映射、保留/压缩/扩展/迁移清单、材料缺口、编译计划和 high-risk diff 预案。本模式不修改论文文件。`
        : `Return only \`<base_name>_conversion_plan_${reportLanguage === "en" ? "en" : reportLanguage === "zh" ? "zh" : "bilingual"}.md\`: official-rule ledger, source-to-target structure map, retain/compress/extend/move register, missing inputs, compilation plan, and anticipated high-risk diff. Do not modify manuscript files in this mode.`
      : language === "zh"
        ? `交付一个可复现转换包：
1. \`<base_name>_converted.tex\` 及目标模板必需文件；
2. 完整 \`<base_name>_converted_references.bib\`，未修改条目也必须保留；
3. figures/ 文件映射与实际使用的图表；
4. 成功编译的 PDF 与简短编译说明；
5. ${reportLanguageText} Markdown 转换报告：官方规则来源、结构 delta、删改迁移台账、未完成材料和 high-risk diff。`
        : `Deliver a reproducible conversion package:
1. \`<base_name>_converted.tex\` and required target-template files;
2. the complete \`<base_name>_converted_references.bib\`, retaining unchanged entries;
3. the figures/ mapping and visuals actually used;
4. a successfully compiled PDF and concise compilation note;
5. a ${reportLanguageText} Markdown conversion report with official-rule sources, structural delta, edit/movement ledger, unresolved inputs, and high-risk diff.`;

  if (language === "zh") {
    return `# 学术论文版本转换

## 角色
你是一名熟悉学术出版政策、LaTeX 模板迁移和研究叙事的论文版本编辑。先识别论文所属领域、当前版本和科学主线，再完成“${CONVERSION_NAMES[direction].zh}”。

## 输入与取证
在同一对话中读取完整主 .tex 及所有 \`\\input\` / \`\\include\` 文件、当前 .bib、与源稿一致的最新 PDF、figures/（如有）、作者提供的新实验或元数据，以及目标模板（如选择用户提供）。先编译或检查源稿基线并建立文件清单。论文事实只来自输入材料；缺失内容进入待办，不得补造数据、引用、作者信息或实验。

## 配置目标
- 执行方式：${EXECUTION_NAMES[execution].zh}
- 转换深度：${DEPTH_NAMES[depth].zh}
- 模板策略：${TEMPLATE_NAMES[templatePolicy].zh}
- 匿名策略：${ANONYMITY_NAMES[anonymity].zh}
- 附录策略：${APPENDIX_NAMES[appendix].zh}
- 图表策略：${figureText}
- ${lengthText}
- ${venueRules}${customText}

## 执行重点
- ${executionGuidance}
- 转换深度边界：${depthGuidance}
- 保留可复现证据链：claim、方法定义、公式、数字、图表、cite key 与结论必须前后一致。AI 可自动选择最优转换方案，但任何可能改变标题/缩写、claim 强度、实验解释、作者身份或内容归属的变化都应进入 high-risk diff。
${directionGuidance}

## 交付
${deliverables}

${execution === "plan" ? "输出前核对方案是否覆盖 cite/ref/label、图片路径、模板选项、匿名信息和正文/附录归属，并列出未来编译验收标准。" : "输出前核验所有 cite/ref/label、图片路径、模板选项、匿名信息、正文与附录归属及编译结果。"}官方规则与用户偏好冲突时遵循官方规则，并在报告中明确说明。`;
  }

  return `# Academic Manuscript Version Conversion

## Role
Act as a manuscript-version editor experienced in scholarly publishing policy, LaTeX template migration, and research narrative. Identify the paper's field, current version, and scientific throughline before completing “${CONVERSION_NAMES[direction].en}.”

## Inputs and Evidence
Read the complete main .tex and every \`\\input\` / \`\\include\` file, current .bib, latest PDF matching the source, figures/ when available, author-supplied new experiments or metadata, and the target template when the provided-template option is selected. Compile or inspect a source baseline and build a file manifest first. Paper facts come only from the inputs; list missing data, citations, identities, or experiments instead of inventing them.

## Configured Target
- Execution: ${EXECUTION_NAMES[execution].en}
- Conversion depth: ${DEPTH_NAMES[depth].en}
- Template policy: ${TEMPLATE_NAMES[templatePolicy].en}
- Anonymity: ${ANONYMITY_NAMES[anonymity].en}
- Appendix: ${APPENDIX_NAMES[appendix].en}
- Visual policy: ${figureText}
- ${lengthText}
- ${venueRules}${customText}

## Execution Priorities
- ${executionGuidance}
- Conversion-depth boundary: ${depthGuidance}
- Preserve the reproducible evidence chain: claims, method definitions, equations, values, visuals, cite keys, and conclusions must remain consistent. The AI may choose the best conversion automatically, but every change that may affect the title/acronym, claim strength, result interpretation, author identity, or content placement belongs in a high-risk diff.
${directionGuidance}

## Deliverables
${deliverables}

${execution === "plan" ? "Before delivery, check that the plan covers cite/ref/label links, image paths, template options, anonymity, and main-text/appendix placement, and define future compilation acceptance criteria." : "Before delivery, verify every cite/ref/label, image path, template option, anonymity field, main-text/appendix placement, and compilation result."} When an official rule conflicts with a preference, follow the official rule and explain the conflict in the report.`;
}

export const VERSION_CONVERSION_WORKBENCH = {
  id: "version-conversion",
  activePage: "version-conversion",
  copy: {
    zh: {
      eyebrow: "VERSION CONVERSION",
      title: "版本转换",
      subtitle:
        "在保留科学证据链的前提下，完成会议、期刊、预印本与投稿版本之间的结构和模板迁移。",
      preset: "官方规则核验 · 证据等价 · 可编译交付",
      reset: "恢复默认配置",
      resetHint: "恢复会议转期刊、完整转换和沿用当前模板策略。",
      inputTitle: "转换材料",
      inputItems: [
        "完整 .tex",
        "当前 .bib",
        "最新 PDF",
        "目标模板 / figures（按需）",
      ],
      inputHint:
        "figures/ 非必需，但涉及图表迁移时建议提供；身份信息、新实验和扩展内容只使用作者明确给出的材料。",
      promptTitle: "论文版本转换",
      promptPurpose:
        "核验源与目标规则，建立内容 delta，并输出证据等价、可编译的新版本。",
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
      eyebrow: "VERSION CONVERSION",
      title: "Version conversion",
      subtitle:
        "Migrate structure and templates across conference, journal, preprint, and submission versions while preserving the scientific evidence chain.",
      preset: "Official rules · evidence equivalence · compilable delivery",
      reset: "Restore defaults",
      resetHint:
        "Restore conference-to-journal, full conversion, and preserve-template defaults.",
      inputTitle: "Conversion materials",
      inputItems: [
        "Complete .tex",
        "Current .bib",
        "Latest PDF",
        "Target template / figures (as needed)",
      ],
      inputHint:
        "figures/ is optional but useful for visual migration. Use identity data, new experiments, and extension material only when explicitly supplied.",
      promptTitle: "Manuscript version conversion",
      promptPurpose:
        "Verify source and target rules, build a content delta, and deliver an evidence-equivalent compilable version.",
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
      id: "conversion",
      kind: "select",
      label: { zh: "转换方向", en: "Conversion direction" },
      description: {
        zh: "不同方向使用独立的扩展、压缩、匿名和披露策略。",
        en: "Each direction receives its own extension, compression, anonymity, and disclosure logic.",
      },
      defaultValue: "conference-journal",
      options: CONVERSION_IDS.map((value) => ({
        value,
        label: CONVERSION_NAMES[value],
      })),
    },
    {
      id: "execution",
      kind: "segmented",
      label: { zh: "执行方式", en: "Execution mode" },
      description: {
        zh: "材料完整时直接转换；高风险投稿可先只生成可审计方案。",
        en: "Convert when materials are complete, or create an auditable plan first for a high-risk submission.",
      },
      defaultValue: "convert",
      options: [
        {
          value: "convert",
          label: { zh: "直接转换", en: "Convert" },
          description: {
            zh: "输出完整可编译版本",
            en: "Deliver a complete compilable version",
          },
        },
        {
          value: "plan",
          label: { zh: "只做方案", en: "Plan only" },
          description: {
            zh: "不修改论文文件",
            en: "Do not modify manuscript files",
          },
        },
      ],
    },
    {
      id: "conversionDepth",
      kind: "select",
      label: { zh: "转换深度", en: "Conversion depth" },
      description: {
        zh: "默认同时适配模板与叙事；扩展模式仍只能使用已提供证据。",
        en: "Template and narrative adaptation is the default; extension still uses only supplied evidence.",
      },
      defaultValue: "adaptive",
      options: [
        {
          value: "format",
          label: { zh: "仅格式与模板", en: "Format & template only" },
        },
        {
          value: "adaptive",
          label: { zh: "格式 + 叙事适配", en: "Format + narrative" },
        },
        {
          value: "extension",
          label: { zh: "基于证据扩展", en: "Evidence-supported extension" },
        },
      ],
    },
    {
      id: "targetVenue",
      kind: "text",
      label: { zh: "目标 venue（建议填写）", en: "Target venue (recommended)" },
      description: {
        zh: "填写正式名称和年份；Prompt 将要求联网核验当前官方规则。",
        en: "Enter the formal name and year so the Prompt can verify current official rules online.",
      },
      defaultValue: "",
      placeholder: {
        zh: "例如 IEEE T-PAMI / ACL 2027",
        en: "e.g., IEEE T-PAMI / ACL 2027",
      },
    },
    {
      id: "templatePolicy",
      kind: "segmented",
      label: { zh: "目标模板", en: "Target template" },
      description: {
        zh: "未指定 venue 时默认沿用当前模板；填写目标后可选择最新官方模板。",
        en: "Preserve the current template when no venue is named; choose the latest official template after specifying a target.",
      },
      defaultValue: "preserve",
      options: [
        { value: "official", label: { zh: "最新官方", en: "Latest official" } },
        { value: "provided", label: { zh: "用户提供", en: "Provided" } },
        { value: "preserve", label: { zh: "沿用当前", en: "Preserve current" } },
      ],
    },
    {
      id: "anonymity",
      kind: "select",
      label: { zh: "匿名策略", en: "Anonymity policy" },
      description: {
        zh: "默认由目标官方规则决定；Camera-ready 只恢复作者提供的信息。",
        en: "Verify the target policy by default; camera-ready restores only author-supplied metadata.",
      },
      defaultValue: "verify",
      options: [
        { value: "verify", label: { zh: "核验官方规则", en: "Verify policy" } },
        { value: "double", label: { zh: "双盲", en: "Double-blind" } },
        { value: "single", label: { zh: "单盲", en: "Single-blind" } },
        {
          value: "public",
          label: { zh: "非匿名 / 正式版", en: "Non-anonymous / final" },
        },
      ],
      visibleWhen: (values) =>
        stringValue(values, "conversion") !== "blind-camera-ready",
    },
    {
      id: "appendix",
      kind: "segmented",
      label: { zh: "附录策略", en: "Appendix policy" },
      description: {
        zh: "附录只放真正补充内容，不能成为压缩核心证据的默认出口。",
        en: "Use an appendix only for genuinely supplementary material, never as the default outlet for core evidence.",
      },
      defaultValue: "verify",
      options: [
        { value: "verify", label: { zh: "按官方规则", en: "Verify policy" } },
        { value: "allow", label: { zh: "允许", en: "Allow" } },
        { value: "none", label: { zh: "不使用", en: "None" } },
      ],
    },
    {
      id: "extensionFocus",
      kind: "multi",
      label: { zh: "期刊扩展重点", en: "Journal extension priorities" },
      description: {
        zh: "只代表优先方向；未提供的新实验和分析只能进入行动清单。",
        en: "These are priorities only; unavailable new experiments and analyses become action items.",
      },
      defaultValue: ["experiments", "analysis", "discussion"],
      minSelected: 1,
      options: [
        { value: "theory", label: { zh: "理论与定义", en: "Theory" } },
        { value: "method", label: { zh: "方法与机制", en: "Method" } },
        { value: "experiments", label: { zh: "新增实验", en: "Experiments" } },
        { value: "analysis", label: { zh: "深入分析", en: "Analysis" } },
        { value: "literature", label: { zh: "文献定位", en: "Literature" } },
        { value: "discussion", label: { zh: "讨论与边界", en: "Discussion" } },
      ],
      visibleWhen: (values) =>
        stringValue(values, "conversion") === "conference-journal" &&
        stringValue(values, "conversionDepth") === "extension",
    },
    {
      id: "compressionPriority",
      kind: "select",
      label: { zh: "会议版压缩优先级", en: "Conference compression priority" },
      description: {
        zh: "默认保护核心方法与实验，不按章节比例机械删减。",
        en: "Protect core methods and experiments by default; never trim sections proportionally.",
      },
      defaultValue: "core-evidence",
      options: [
        {
          value: "core-evidence",
          label: { zh: "核心方法与证据优先", en: "Core method & evidence" },
        },
        {
          value: "argument",
          label: { zh: "最强创新主线优先", en: "Strongest novelty spine" },
        },
        { value: "balanced", label: { zh: "均衡", en: "Balanced" } },
      ],
      visibleWhen: (values) =>
        stringValue(values, "conversion") === "journal-conference",
    },
    {
      id: "priorDisclosure",
      kind: "toggle",
      label: { zh: "既有版本披露", en: "Prior-version disclosure" },
      description: {
        zh: "默认核验并处理既有会议稿或预印本；官方要求始终优先。",
        en: "Verify and handle the conference paper or preprint by default; official policy always prevails.",
      },
      defaultValue: true,
      enabledLabel: { zh: "核验并披露", en: "Verify and disclose" },
      disabledLabel: { zh: "不主动披露", en: "Do not proactively disclose" },
      visibleWhen: (values) =>
        ["conference-journal", "preprint-submission"].includes(
          stringValue(values, "conversion"),
        ),
    },
    {
      id: "restoreMetadata",
      kind: "toggle",
      label: { zh: "恢复身份与致谢", en: "Restore identity and acknowledgments" },
      description: {
        zh: "仅恢复作者明确提供的姓名、单位、资助与项目链接。",
        en: "Restore only author-supplied names, affiliations, funding, and project links.",
      },
      defaultValue: true,
      enabledLabel: { zh: "恢复已提供信息", en: "Restore supplied metadata" },
      disabledLabel: { zh: "暂不恢复", en: "Leave unresolved" },
      visibleWhen: (values) =>
        stringValue(values, "conversion") === "blind-camera-ready",
    },
    {
      id: "figurePolicy",
      kind: "select",
      label: { zh: "图表迁移", en: "Visual migration" },
      description: {
        zh: "重排只改变版面与阅读顺序，不改变图中证据或 caption 含义。",
        en: "Reflow may change layout and reading order, never evidence or caption meaning.",
      },
      defaultValue: "reflow",
      options: [
        {
          value: "preserve",
          label: { zh: "保持位置与顺序", en: "Preserve placement" },
        },
        {
          value: "reflow",
          label: { zh: "允许合理重排", en: "Allow reasoned reflow" },
        },
        {
          value: "supplement",
          label: { zh: "允许补充材料候选", en: "Allow supplement candidates" },
        },
      ],
    },
    {
      id: "useLengthGuidance",
      kind: "toggle",
      label: { zh: "篇幅建议", en: "Length guidance" },
      description: {
        zh: "默认不限制；官方硬性规则仍须核验和遵守。",
        en: "Off by default; verified official hard limits still apply.",
      },
      defaultValue: false,
      enabledLabel: { zh: "使用建议区间", en: "Use suggested range" },
      disabledLabel: { zh: "不设置建议", en: "No guidance" },
    },
    {
      id: "suggestedWords",
      kind: "range",
      label: { zh: "建议正文字数", en: "Suggested main-text words" },
      description: {
        zh: "只是规划参考；模型可根据论文内容决定是否采纳。",
        en: "Planning guidance only; the model may accept or depart based on the paper.",
      },
      defaultValue: [4500, 8000],
      min: 1000,
      max: 20000,
      step: 100,
      suffix: { zh: "词", en: "words" },
      visibleWhen: (values) => booleanValue(values, "useLengthGuidance"),
    },
    {
      id: "reportLanguage",
      kind: "segmented",
      label: { zh: "转换报告语言", en: "Conversion report language" },
      description: {
        zh: "论文正文语言沿用源稿；这里只控制规则和差异报告。",
        en: "The manuscript keeps its source language; this controls only the rule and diff report.",
      },
      defaultValue: "zh",
      options: [
        { value: "zh", label: { zh: "中文", en: "Chinese" } },
        { value: "en", label: { zh: "English", en: "English" } },
        { value: "bilingual", label: { zh: "中英双语", en: "Bilingual" } },
      ],
    },
    {
      id: "customInstructions",
      kind: "textarea",
      label: { zh: "个性化要求（可选）", en: "Custom requirements (optional)" },
      description: {
        zh: "填写必须保留的章节、现有新证据、模板约束或投稿背景。",
        en: "Add must-keep sections, available new evidence, template constraints, or submission context.",
      },
      defaultValue: "",
      placeholder: {
        zh: "例如：保留全部三个数据集结果；新增长期实验已在 appendix_new.tex；不要改变方法缩写。",
        en: "e.g., Keep results for all three datasets; new longitudinal evidence is in appendix_new.tex; preserve the method acronym.",
      },
      span: "full",
    },
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "conversion") {
      if (value === "blind-camera-ready") {
        next.anonymity = "public";
        next.restoreMetadata = true;
      } else if (stringValue(current, "conversion") === "blind-camera-ready") {
        next.anonymity = "verify";
      }
    }
    if (id === "targetVenue") {
      const targetVenue = typeof value === "string" ? value.trim() : "";
      if (targetVenue && stringValue(current, "templatePolicy") === "preserve") {
        next.templatePolicy = "official";
      }
      if (!targetVenue && stringValue(current, "templatePolicy") === "official") {
        next.templatePolicy = "preserve";
      }
    }
    if (
      id === "appendix" &&
      value === "none" &&
      stringValue(next, "figurePolicy") === "supplement"
    ) {
      next.figurePolicy = "reflow";
    }
    if (
      id === "figurePolicy" &&
      value === "supplement" &&
      stringValue(next, "appendix") === "none"
    ) {
      next.appendix = "allow";
    }
    return next;
  },
  buildPrompt: buildVersionConversionPrompt,
} satisfies WorkbenchDefinition;
