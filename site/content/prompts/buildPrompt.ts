import { COMMON_PROMPT_BLOCKS } from "./templates";
import { buildFrameworkFigureReconstructionPrompt } from "../../app/figures/config";
import {
  PROMPT_DETAILED_CONSTRAINTS,
  PROMPT_STEP_POLICIES,
  SOURCE_BUDGET_REFERENCE,
} from "./constraints";
import type { PromptConstraintSet } from "./constraints";
import { WORD_COUNT_POLICY } from "./wordCountPolicy";
import type {
  Language,
  PromptBuildContext,
  PromptTemplate,
} from "./types";

const LABELS = {
  zh: {
    role: "## 你的角色",
    configuration: "## 当前配置",
    paperStyle: "论文类型",
    lengthMode: "字数模式",
    flexibleCoreMode: "正文总数不限；仅限制方法和实验以外的章节",
    targetType: "投稿类型",
    appendix: "附录",
    styleDirective: "写作侧重",
    openAccess: "是否 OA",
    apc: "是否有 APC",
    apcRange: "APC 范围",
    impactFactor: "影响因子（IF）",
    reviewArticles: "综述文章",
    jcrQuartiles: "JCR 分区",
    casZones: "中科院分区",
    citationIndexes: "收录索引",
    excludedPublishers: "固定排除",
    unrestricted: "不限",
    yes: "是",
    no: "否",
    submissionFilterInstruction:
      "除“不限”外，以上均为候选池筛选条件。必须逐项通过官网或权威来源核验；不得猜测，无法核验的候选应明确标记并单独列出。候选期刊还必须处于正常运营且当前可投稿状态；不得把 CiteScore、SJR 或其他指标冒充 JCR Journal Impact Factor。",
    inputs: "## 本轮输入",
    evidence: "## 证据与事实规则",
    manuscriptProtection: "## TeX 与格式保护",
    cohesiveRevision: "## 融合式重写规则",
    pdfReview: "## PDF 深度阅读",
    citationAndWeb: "## 引用与联网核验",
    scope: "## 本轮边界",
    styleBranch: "### 当前类型的执行重点",
    length: "## 正文与章节预算",
    mainTextTarget: "正文目标",
    unlimited: "不限",
    countingScope:
      `计词范围为 Abstract 至 Conclusion。标题、作者信息、关键词、公式、算法、参考文献、附录和补充材料不计入；图注与表格单元格不逐词统计，每张表格或图片按 ${WORD_COUNT_POLICY.visualWordEquivalent} 词计入所在章节及正文总数`,
    sectionBudgets: "章节预算",
    recommendedRange: "推荐范围",
    lengthInstruction:
      "以上预算是正式目标。若当前步骤另设临时上限，以该步骤的规则完成阶段性重构，但后续仍须回到正式目标；不得用删减关键定义、实验协议或局限来机械凑数。",
    flexibleLengthInstruction:
      "仅标有数字预算的章节必须达标；“不限”不等于任意扩写，Method 与 Experiments and Results 仍须按科学完整性与证据需要展开并删除重复。",
    tasks: "## 本轮任务",
    detailedConstraints: "## 原始模板详细约束",
    deliverables: "## 输出与文件要求",
    targetingDeliverables: "## 输出要求",
    fileNames: "### 文件名",
    deliveryBundle: "### 单文件交付包",
    finalChecks: "## 输出前自检",
    words: "词",
  },
  en: {
    role: "## Your Role",
    configuration: "## Current Configuration",
    paperStyle: "Paper type",
    lengthMode: "Length mode",
    flexibleCoreMode:
      "No main-text total; only sections other than Method and Experiments are limited",
    targetType: "Submission type",
    appendix: "Appendix",
    styleDirective: "Writing emphasis",
    openAccess: "OA",
    apc: "APC charged",
    apcRange: "APC range",
    impactFactor: "Impact factor (IF)",
    reviewArticles: "Review articles",
    jcrQuartiles: "JCR quartiles",
    casZones: "CAS zones",
    citationIndexes: "Citation indexes",
    excludedPublishers: "Excluded publishers",
    unrestricted: "Any",
    yes: "Yes",
    no: "No",
    submissionFilterInstruction:
      "Treat every value other than “Any” as a candidate-pool filter. Verify each item against an official or authoritative source; never guess, and clearly separate candidates whose status cannot be verified. Every candidate journal must also be active and currently accepting submissions. Never present CiteScore, SJR, or another metric as the JCR Journal Impact Factor.",
    inputs: "## Inputs for This Round",
    evidence: "## Evidence and Fact Rules",
    manuscriptProtection: "## TeX and Format Protection",
    cohesiveRevision: "## Cohesive Revision Rule",
    pdfReview: "## Deep PDF Review",
    citationAndWeb: "## Citations and Web Verification",
    scope: "## Scope of This Round",
    styleBranch: "### Execution Priorities for the Current Type",
    length: "## Main-text and Section Budgets",
    mainTextTarget: "Main-text target",
    unlimited: "Unlimited",
    countingScope:
      `Count content from Abstract through Conclusion. Exclude the title, authors, keywords, equations, algorithms, references, appendix, and supplementary material. Do not count captions or table cells word by word; count each table or figure as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the main-text total`,
    sectionBudgets: "Section budgets",
    recommendedRange: "recommended range",
    lengthInstruction:
      "These budgets are the formal target. If this step defines a temporary ceiling, follow that step-specific rule for the interim reconstruction and return to the formal target later. Never hit a number by removing essential definitions, experimental protocols, or limitations.",
    flexibleLengthInstruction:
      "Only sections with numeric budgets must meet a range. “Unlimited” does not permit arbitrary expansion: develop Method and Experiments & Results only as scientific completeness and evidence require, and remove repetition.",
    tasks: "## Tasks for This Round",
    detailedConstraints: "## Detailed Constraints from the Source Template",
    deliverables: "## Output and File Requirements",
    targetingDeliverables: "## Output Requirements",
    fileNames: "### File Names",
    deliveryBundle: "### Single-download Handoff Bundle",
    finalChecks: "## Final Checklist",
    words: "words",
  },
} as const;

function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US").format(
    value,
  );
}

function buildConfiguration(
  template: PromptTemplate,
  context: PromptBuildContext,
) {
  const labels = LABELS[context.language];
  const field = (label: string, value: string) =>
    context.language === "zh" ? `- ${label}：${value}` : `- ${label}: ${value}`;

  if (template.profile === "targeting") {
    const preferences = context.submissionPreferences;
    const modeLabel = (mode: "any" | "yes" | "no") =>
      mode === "any"
        ? labels.unrestricted
        : mode === "yes"
          ? labels.yes
          : labels.no;
    const selectedOrAny = (values: readonly string[]) =>
      values.length > 0 ? values.join(", ") : labels.unrestricted;
    const casZones =
      preferences?.casZones.map((zone) =>
        context.language === "zh" ? `${zone}区` : `Zone ${zone}`,
      ) ?? [];

    return [
      field(labels.targetType, context.styleLabel),
      field(
        labels.openAccess,
        modeLabel(preferences?.openAccess ?? "any"),
      ),
      field(labels.apc, modeLabel(preferences?.apc ?? "any")),
      ...(preferences?.apc === "yes"
        ? [
            field(
              labels.apcRange,
              `${preferences.apcCurrency} ${formatNumber(preferences.apcMin, context.language)}–${formatNumber(preferences.apcMax, context.language)}`,
            ),
          ]
        : []),
      field(
        labels.impactFactor,
        preferences?.useImpactFactorRange
          ? `${preferences.impactFactorMin.toFixed(1)}–${preferences.impactFactorMax.toFixed(1)}`
          : labels.unrestricted,
      ),
      field(
        labels.reviewArticles,
        preferences?.requireReviewArticles
          ? labels.yes
          : labels.unrestricted,
      ),
      field(
        labels.jcrQuartiles,
        selectedOrAny(preferences?.jcrQuartiles ?? []),
      ),
      field(labels.casZones, selectedOrAny(casZones)),
      field(
        labels.citationIndexes,
        selectedOrAny(preferences?.citationIndexes ?? []),
      ),
      field(
        labels.excludedPublishers,
        selectedOrAny(preferences?.excludedPublishers ?? []),
      ),
      "",
      labels.submissionFilterInstruction,
    ].join("\n");
  }

  return [
    field(labels.paperStyle, context.styleLabel),
    ...(template.showStyleDirective === false
      ? []
      : [field(labels.styleDirective, context.styleDirective)]),
    ...(context.hasWordLimit && context.unlimitedCoreSections
      ? [field(labels.lengthMode, labels.flexibleCoreMode)]
      : []),
    ...(template.showAppendixConfiguration === false
      ? []
      : [
          field(labels.appendix, context.appendixLabel),
          context.appendixDirective,
        ]),
  ].join("\n");
}

function buildLengthBudget(context: PromptBuildContext) {
  if (!context.hasWordLimit) return "";

  const labels = LABELS[context.language];
  const totalRange = context.unlimitedCoreSections
    ? null
    : scaleRange(
        context.targetWords,
        SOURCE_BUDGET_REFERENCE.total,
        SOURCE_BUDGET_REFERENCE.totalRange,
      );
  const unlimitedSectionIds = new Set<string>(
    WORD_COUNT_POLICY.unlimitedCoreSectionIds,
  );
  const budgetLines = context.sectionBudgets
    .map((section) => {
      if (
        context.unlimitedCoreSections &&
        unlimitedSectionIds.has(section.id)
      ) {
        return `- ${section.label}: ${labels.unlimited}`;
      }
      const reference =
        SOURCE_BUDGET_REFERENCE.sections[
          section.id as keyof typeof SOURCE_BUDGET_REFERENCE.sections
        ];
      const range = reference
        ? scaleRange(section.words, reference.target, reference.range)
        : [section.words, section.words];
      return `- ${section.label}: ${formatNumber(section.words, context.language)} ${labels.words} (${labels.recommendedRange}: ${formatNumber(range[0], context.language)}–${formatNumber(range[1], context.language)} ${labels.words})`;
    })
    .join("\n");

  return [
    labels.length,
    "",
    context.unlimitedCoreSections
      ? `- ${labels.mainTextTarget}: ${labels.unlimited}`
      : `- ${labels.mainTextTarget}: ${formatNumber(context.targetWords, context.language)} ${labels.words} (${labels.recommendedRange}: ${formatNumber(totalRange![0], context.language)}–${formatNumber(totalRange![1], context.language)} ${labels.words})`,
    `- ${labels.countingScope}`,
    "",
    `### ${labels.sectionBudgets}`,
    budgetLines,
    "",
    context.unlimitedCoreSections
      ? labels.flexibleLengthInstruction
      : labels.lengthInstruction,
  ].join("\n");
}

function buildDeliveryBundle(
  template: PromptTemplate,
  language: Language,
) {
  if (
    template.profile !== "manuscript" ||
    template.contentKind === "framework-figure" ||
    !template.fileNames
  ) {
    return "";
  }

  const bundleName =
    `<base_name>_round_${template.number}_artifacts.zip`;
  if (language === "zh") {
    return `${LABELS.zh.deliveryBundle}

- 若当前环境提供 YanShu artifact 写入工具，直接分别写入并登记上述三个文件，不再创建重复归档。
- 否则，在最终回复中创建并附加一个可直接下载的 \`${bundleName}\`。ZIP 根目录必须恰好包含“文件名”中列出的三个完整 UTF-8 文件，不设子目录，不加入额外文件。
- ZIP 是自动化协调器首选的单次下载交付面；单独文件链接可以保留，但不是必需。
- 仅在对话中粘贴代码块、显示 Canvas/文档视图或文字声称“文件已创建”都不算完成文件交付。`;
  }

  return `${LABELS.en.deliveryBundle}

- When YanShu artifact-writing tools are available, write and register the three files separately and do not create a duplicate archive.
- Otherwise, create and attach one directly downloadable \`${bundleName}\` in the final response. The ZIP root must contain exactly the three complete UTF-8 files listed under “File Names,” with no subdirectories or extra files.
- The ZIP is the automation coordinator's preferred single-download handoff surface. Separate file links may remain available but are optional.
- Pasted code blocks, Canvas/document-only views, or prose claiming that files were created do not constitute file delivery.`;
}

function roundToFive(value: number) {
  return Math.max(1, Math.round(value / 5) * 5);
}

function scaleRange(
  current: number,
  referenceTarget: number,
  referenceRange: readonly [number, number],
) {
  return [
    roundToFive((current * referenceRange[0]) / referenceTarget),
    roundToFive((current * referenceRange[1]) / referenceTarget),
  ] as const;
}

function scaledPair(
  sectionWords: number,
  referenceSectionWords: number,
  min: number,
  max: number,
) {
  return [
    roundToFive((sectionWords * min) / referenceSectionWords),
    roundToFive((sectionWords * max) / referenceSectionWords),
  ] as const;
}

function buildConstraintTokens(
  context: PromptBuildContext,
  templateId: string,
) {
  const values: Record<string, string> = {};
  const sectionWords = Object.fromEntries(
    context.sectionBudgets.map((section) => [section.id, section.words]),
  );
  const addPair = (
    prefix: string,
    pair: readonly [number, number],
  ) => {
    values[`${prefix}_min`] = formatNumber(pair[0], context.language);
    values[`${prefix}_max`] = formatNumber(pair[1], context.language);
  };

  for (const [id, reference] of Object.entries(
    SOURCE_BUDGET_REFERENCE.sections,
  )) {
    const current = sectionWords[id] ?? reference.target;
    addPair(
      id.replaceAll("-", "_"),
      scaleRange(current, reference.target, reference.range),
    );
  }

  const methodWords = sectionWords.method ?? 1500;
  const introductionWords = sectionWords.introduction ?? 520;
  const relatedWords = sectionWords["related-work"] ?? 450;
  const conclusionWords = sectionWords.conclusion ?? 200;

  addPair(
    "problem_definition",
    scaledPair(methodWords, 1500, 100, 140),
  );
  addPair("intro_p1", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p2", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p3", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p4", scaledPair(introductionWords, 520, 40, 100));
  addPair("intro_p5", scaledPair(introductionWords, 520, 40, 70));
  addPair("intro_p6", scaledPair(introductionWords, 520, 30, 60));
  addPair(
    "related_subsection",
    scaledPair(relatedWords, 450, 140, 160),
  );
  addPair(
    "related_paragraph",
    scaledPair(relatedWords, 450, 65, 85),
  );
  addPair(
    "conclusion_p1",
    scaledPair(conclusionWords, 200, 100, 120),
  );
  addPair(
    "conclusion_p2",
    scaledPair(conclusionWords, 200, 80, 100),
  );

  const stepPolicy =
    PROMPT_STEP_POLICIES[
      templateId as keyof typeof PROMPT_STEP_POLICIES
    ];
  if (stepPolicy) {
    const increasePercent = Math.round(
      (stepPolicy.temporaryMainTextCeilingMultiplier - 1) * 100,
    );
    const temporaryCeiling = Math.round(
      context.targetWords *
        stepPolicy.temporaryMainTextCeilingMultiplier,
    );
    const protectedLabels = context.sectionBudgets
      .filter((section) =>
        stepPolicy.protectedSectionIds.includes(section.id),
      )
      .map((section) => section.label);
    const protectedSections =
      context.language === "zh"
        ? protectedLabels.join("、")
        : protectedLabels.join(" and ");
    const appendixTemplate =
      stepPolicy.appendixTriage[
        context.includeAppendix ? "enabled" : "disabled"
      ][context.language];

    values.temporary_ceiling_percent = formatNumber(
      increasePercent,
      context.language,
    );
    values.temporary_ceiling_words = formatNumber(
      temporaryCeiling,
      context.language,
    );
    values.protected_sections = protectedSections;
    values.appendix_triage_rule = appendixTemplate.replaceAll(
      "{{protected_sections}}",
      protectedSections,
    );
  }

  return values;
}

function interpolateConstraints(
  text: string,
  context: PromptBuildContext,
  templateId: string,
) {
  const tokens = buildConstraintTokens(context, templateId);
  return text.replace(/\{\{([a-z0-9_]+)\}\}/g, (match, token) =>
    tokens[token] ?? match
  );
}

function buildDetailedCore(
  constraints: PromptConstraintSet,
  context: PromptBuildContext,
  templateId: string,
) {
  let core = constraints.core[context.language];

  for (const fragment of constraints.inlineStyleConstraints ?? []) {
    core = core.replaceAll(
      `{{${fragment.marker}}}`,
      fragment.branches[context.styleId][context.language],
    );
  }

  for (const fragment of constraints.inlineWordLimits ?? []) {
    const activeFragment = context.unlimitedCoreSections
      ? (fragment.flexibleCore ?? fragment.standard)
      : fragment.standard;
    const value = context.hasWordLimit
      ? interpolateConstraints(
          activeFragment[context.language],
          context,
          templateId,
        )
      : "";

    core = core.replaceAll(`{{${fragment.marker}}}`, value);
  }

  return core.replace(/\n{3,}/g, "\n\n").trim();
}

export function buildPrompt(
  template: PromptTemplate,
  context: PromptBuildContext,
) {
  if (template.contentKind === "framework-figure") {
    return buildFrameworkFigureReconstructionPrompt(
      context.language,
      context.frameworkFigure,
    );
  }

  const language = context.language;
  const labels = LABELS[language];
  const common = COMMON_PROMPT_BLOCKS;
  const taskBlocks = template.tasks.flatMap((task) => [
    `### ${task.heading[language]}`,
    task.body[language],
    "",
  ]);
  const styleBranch = template.styleBranches?.[context.styleId]?.[language];
  const lengthBudget =
    template.profile === "manuscript" &&
    template.showLengthBudget !== false
      ? buildLengthBudget(context)
      : "";
  const detailedConstraints = PROMPT_DETAILED_CONSTRAINTS[template.id];
  const detailedCore = detailedConstraints
    ? buildDetailedCore(detailedConstraints, context, template.id)
    : "";
  const activeWordLimitConstraints =
    context.unlimitedCoreSections
      ? (detailedConstraints?.flexibleCoreWordLimit ??
        detailedConstraints?.wordLimit)
      : detailedConstraints?.wordLimit;
  const wordLimitConstraints =
    context.hasWordLimit && activeWordLimitConstraints
      ? interpolateConstraints(
          activeWordLimitConstraints[language],
          context,
          template.id,
        )
      : "";
  const wordLimitAfterBudget =
    detailedConstraints?.wordLimitPlacement === "after-budget";
  const deliveryBundle = buildDeliveryBundle(template, language);

  return [
    labels.role,
    template.role[language],
    "",
    labels.configuration,
    buildConfiguration(template, context),
    "",
    labels.inputs,
    template.inputs[language],
    "",
    labels.evidence,
    common.evidence[language],
    "",
    ...(template.profile === "manuscript"
      ? [
          labels.manuscriptProtection,
          common.manuscriptProtection[language],
          "",
          labels.cohesiveRevision,
          common.cohesiveRevision[language],
          "",
        ]
      : []),
    labels.pdfReview,
    common.pdfReview[language],
    "",
    ...(template.profile === "manuscript"
      ? [
          labels.citationAndWeb,
          common.citationAndWeb[language],
          "",
        ]
      : []),
    labels.scope,
    template.scope[language],
    "",
    ...(styleBranch
      ? [labels.styleBranch, styleBranch, ""]
      : []),
    ...(lengthBudget ? [lengthBudget, ""] : []),
    ...(wordLimitAfterBudget && wordLimitConstraints
      ? [wordLimitConstraints, ""]
      : []),
    labels.tasks,
    ...taskBlocks,
    ...(detailedConstraints
      ? [
          labels.detailedConstraints,
          detailedCore,
          "",
          ...(!wordLimitAfterBudget && wordLimitConstraints
            ? [wordLimitConstraints, ""]
            : []),
        ]
      : []),
    template.profile === "targeting"
      ? labels.targetingDeliverables
      : labels.deliverables,
    template.deliverables[language],
    "",
    ...(template.fileNames
      ? [
          labels.fileNames,
          template.fileNames[language],
          "",
          ...(deliveryBundle ? [deliveryBundle, ""] : []),
        ]
      : []),
    labels.finalChecks,
    template.finalChecks[language],
  ].join("\n");
}
