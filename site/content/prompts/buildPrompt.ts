import { COMMON_PROMPT_BLOCKS } from "./templates";
import {
  PROMPT_DETAILED_CONSTRAINTS,
  PROMPT_STEP_POLICIES,
  SOURCE_BUDGET_REFERENCE,
} from "./constraints";
import type { PromptConstraintSet } from "./constraints";
import { buildCaptionLengthGuidance } from "./captionLength";
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
    targetConference: "目标会议",
    targetJournal: "目标期刊",
    targetVenueNotSpecified: "未指定",
    targetVenueVerification:
      "已指定目标时，执行前必须核验该会议当届或该期刊当前官方作者指南；页面预设与 CCF 分组仅用于便捷填写，不视为 venue 官方规则。",
    lengthMode: "篇幅建议",
    flexibleCoreMode: "不设正文总建议；仅为方法和实验以外的章节提供参考范围",
    targetType: "投稿类型",
    appendix: "附录",
    captionLength: "Caption 建议长度",
    styleDirective: "写作侧重",
    introductionRoadmap: "Introduction 章节导航段",
    included: "保留约 65 词的独立导航段",
    omitted: "不写章节导航段",
    openAccess: "是否 OA",
    apc: "是否有 APC",
    apcRange: "APC 范围",
    impactFactor: "影响因子（IF）",
    reviewArticles: "综述文章",
    jcrQuartiles: "JCR 分区",
    casZones: "中科院分区",
    citationIndexes: "收录索引",
    excludedPublishers: "排除出版社",
    noPublisherExclusions: "不排除",
    unrestricted: "不限",
    yes: "是",
    no: "否",
    submissionFilterInstruction:
      "除“不限”外，以上均为候选池筛选条件。必须逐项通过官网或权威来源核验；不得猜测，无法核验的候选应明确标记并单独列出。候选期刊还必须处于正常运营且当前可投稿状态；不得把 CiteScore、SJR 或其他指标冒充 JCR Journal Impact Factor。",
    inputs: "## 本轮输入",
    evidence: "## 证据与事实规则",
    manuscriptProtection: "## TeX 与格式保护",
    identityGovernance: "## 标题、品牌与科学主线治理",
    cohesiveRevision: "## 融合式精修规则",
    pdfReview: "## PDF 深度阅读",
    citationAndWeb: "## 引用与联网核验",
    scope: "## 本轮边界",
    styleBranch: "### 当前类型的执行重点",
    length: "## 可选正文与章节篇幅建议",
    mainTextTarget: "建议正文参考值",
    unlimited: "不设建议",
    countingScope:
      `建议估算范围为 Abstract 至 Conclusion。标题、作者信息、关键词、公式、算法、参考文献、附录和补充材料不计入；图注与表格单元格不逐词统计，每张表格或图片按 ${WORD_COUNT_POLICY.visualWordEquivalent} 词计入所在章节及正文参考值`,
    sectionBudgets: "章节建议",
    recommendedRange: "可选参考区间",
    lengthInstruction:
      "以上数值均为可选写作建议，不是上限、最低要求或验收条件。请根据论文内容、证据密度和目标版面自行决定采纳、调整或忽略；若偏离建议更有利于科学完整性，可直接偏离并在报告中简要说明，不得为命中数字删减核心内容。",
    flexibleLengthInstruction:
      "仅为标有数字的章节提供可选参考范围；Method 与 Experiments and Results 不设置篇幅建议，按科学完整性和证据需要展开。所有建议均可根据论文内容调整或忽略。",
    tasks: "## 本轮任务",
    detailedConstraints: "## 本轮专用规则",
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
    targetConference: "Target conference",
    targetJournal: "Target journal",
    targetVenueNotSpecified: "Not specified",
    targetVenueVerification:
      "When a target is specified, verify the current official author guidelines for that conference edition or journal before execution. Website presets and CCF groups are input shortcuts, not official venue rules.",
    lengthMode: "Length guidance",
    flexibleCoreMode:
      "No suggested main-text total; optional ranges only for sections other than Method and Experiments",
    targetType: "Submission type",
    appendix: "Appendix",
    captionLength: "Suggested caption length",
    styleDirective: "Writing emphasis",
    introductionRoadmap: "Introduction roadmap paragraph",
    included: "Include a separate ≈65-word roadmap",
    omitted: "Omit the roadmap paragraph",
    openAccess: "OA",
    apc: "APC charged",
    apcRange: "APC range",
    impactFactor: "Impact factor (IF)",
    reviewArticles: "Review articles",
    jcrQuartiles: "JCR quartiles",
    casZones: "CAS zones",
    citationIndexes: "Citation indexes",
    excludedPublishers: "Excluded publishers",
    noPublisherExclusions: "None",
    unrestricted: "Any",
    yes: "Yes",
    no: "No",
    submissionFilterInstruction:
      "Treat every value other than “Any” as a candidate-pool filter. Verify each item against an official or authoritative source; never guess, and clearly separate candidates whose status cannot be verified. Every candidate journal must also be active and currently accepting submissions. Never present CiteScore, SJR, or another metric as the JCR Journal Impact Factor.",
    inputs: "## Inputs for This Round",
    evidence: "## Evidence and Fact Rules",
    manuscriptProtection: "## TeX and Format Protection",
    identityGovernance: "## Title, Brand, and Scientific-throughline Governance",
    cohesiveRevision: "## Cohesive Refinement Rule",
    pdfReview: "## Deep PDF Review",
    citationAndWeb: "## Citations and Web Verification",
    scope: "## Scope of This Round",
    styleBranch: "### Execution Priorities for the Current Type",
    length: "## Optional Main-text and Section Length Guidance",
    mainTextTarget: "Suggested main-text reference",
    unlimited: "No suggestion",
    countingScope:
      `Estimate content from Abstract through Conclusion. Exclude the title, authors, keywords, equations, algorithms, references, appendix, and supplementary material. Do not count captions or table cells word by word; estimate each table or figure as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the suggested main-text reference`,
    sectionBudgets: "Section suggestions",
    recommendedRange: "optional reference range",
    lengthInstruction:
      "Every number above is optional writing guidance, not a cap, minimum, or acceptance criterion. Accept, adjust, or ignore it according to the paper's content, evidence density, and target layout. Deviate whenever that better preserves scientific completeness, and briefly record the reason instead of deleting core content to hit a number.",
    flexibleLengthInstruction:
      "Numeric sections receive optional reference ranges only. Method and Experiments & Results receive no length suggestion and should follow scientific completeness and evidence needs. Every suggestion may be adjusted or ignored according to the paper.",
    tasks: "## Tasks for This Round",
    detailedConstraints: "## Round-specific Rules",
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
        preferences?.excludedPublishers.length
          ? preferences.excludedPublishers.join(", ")
          : labels.noPublisherExclusions,
      ),
      "",
      labels.submissionFilterInstruction,
    ].join("\n");
  }

  return [
    field(labels.paperStyle, context.styleLabel),
    ...(context.targetVenueName !== undefined
      ? [
          field(
            context.styleId === "conference"
              ? labels.targetConference
              : labels.targetJournal,
            context.targetVenueName || labels.targetVenueNotSpecified,
          ),
          ...(context.targetVenueName
            ? [labels.targetVenueVerification]
            : []),
        ]
      : []),
    field(labels.styleDirective, context.styleDirective),
    ...(["scientific-positioning", "narrative-reconstruction", "full-reconstruction"].includes(
      template.id,
    )
      ? [
          field(
            labels.introductionRoadmap,
            context.includeSectionNavigationSentence
              ? labels.included
              : labels.omitted,
          ),
        ]
      : []),
    ...(context.hasWordLimit && context.unlimitedCoreSections
      ? [field(labels.lengthMode, labels.flexibleCoreMode)]
      : []),
    field(
      labels.captionLength,
      buildCaptionLengthGuidance(
        context.captionWordRange,
        context.language,
      ),
    ),
    field(labels.appendix, context.appendixLabel),
    context.appendixDirective,
  ].join("\n");
}

function interpolateSubmissionPreferences(
  text: string,
  context: PromptBuildContext,
) {
  const publishers = context.submissionPreferences?.excludedPublishers ?? [];
  const names = publishers.join(context.language === "zh" ? "、" : ", ");
  const sentence =
    publishers.length === 0
      ? ""
      : context.language === "zh"
        ? `用户已选择排除 ${names}：其旗下期刊不得进入候选池、评分或推荐梯队，只在排除记录中注明“用户排除”，不得据此作无依据的泛化质量定性。`
        : `The user has chosen to exclude ${names}. Do not place journals from these publishers in the candidate pool, scoring, or recommendation tiers. Record them only as “excluded by user” without making unsupported general quality claims.`;

  return text
    .replaceAll("{{publisher_exclusion_sentence}}", sentence)
    .replaceAll(
      "{{publisher_exclusion_bullet}}",
      sentence ? `- ${sentence}` : "",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
    template.showDeliveryBundle === false ||
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

  for (const fragment of constraints.inlinePreferenceConstraints ?? []) {
    const enabled = context[fragment.contextKey];
    core = core.replaceAll(
      `{{${fragment.marker}}}`,
      fragment.branches[enabled ? "enabled" : "disabled"][context.language],
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

  return interpolateSubmissionPreferences(core, context);
}

export function buildPrompt(
  template: PromptTemplate,
  context: PromptBuildContext,
) {
  const language = context.language;
  const labels = LABELS[language];
  const common = COMMON_PROMPT_BLOCKS;
  const taskBlocks = template.tasks.flatMap((task) => [
    `### ${task.heading[language]}`,
    interpolateSubmissionPreferences(task.body[language], context),
    "",
  ]);
  const styleBranch =
    template.profile === "targeting"
      ? template.styleBranches?.[context.styleId]?.[language]
      : undefined;
  const lengthBudget =
    template.profile === "manuscript" ? buildLengthBudget(context) : "";
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
          labels.identityGovernance,
          common.identityGovernance[language],
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
