import type { Language } from "../config";
import type {
  LocalizedText,
  WorkbenchCopy,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../workbench/types";

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

function labelFor(
  value: string,
  labels: Record<string, LocalizedText>,
  language: Language,
) {
  return labels[value]?.[language] ?? value;
}

function labelsFor(
  values: Readonly<WorkbenchValues>,
  id: string,
  labels: Record<string, LocalizedText>,
  language: Language,
) {
  return selected(values, id)
    .map((value) => labelFor(value, labels, language))
    .join(language === "zh" ? "、" : ", ");
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
      resetHint: "恢复本页推荐配置",
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
      resetHint: "Restore the recommended configuration for this page",
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

const VENUE_TYPES = {
  conference: text("会议", "Conference"),
  journal: text("期刊", "Journal"),
  preprint: text("预印本", "Preprint"),
};

const SUBMISSION_STAGES = {
  initial: text("首次投稿", "Initial submission"),
  revision: text("返修投稿", "Revised submission"),
  camera: text("终稿 / Camera-ready", "Camera-ready or final files"),
};

const CHECK_MODES = {
  audit: text("仅检查", "Check only"),
  repair: text("检查并安全修复", "Check and safely repair"),
};

const CHECK_SCOPES = {
  official: text("官方规则与模板", "Official rules and template"),
  anonymity: text("匿名与身份信息", "Anonymity and identity"),
  format: text("格式、页数与文件", "Format, length, and files"),
  metadata: text("投稿系统元数据", "Submission-system metadata"),
  references: text("引用与参考文献", "Citations and references"),
  visuals: text("图表与补充材料", "Visuals and supplementary material"),
  integrity: text("伦理、许可与声明", "Ethics, licenses, and declarations"),
  build: text("编译与交叉引用", "Build and cross-references"),
};

const SOURCE_LEVELS = {
  project: text("完整 LaTeX 工程 + PDF", "Complete LaTeX project and PDF"),
  source: text("TeX / Word + PDF", "TeX or Word source plus PDF"),
  pdf: text("仅最终 PDF", "Final PDF only"),
};

export const PRE_SUBMISSION_CHECK_WORKBENCH = {
  id: "pre-submission-check-workbench",
  activePage: "pre-submission-check",
  copy: sharedCopy({
    zh: {
      eyebrow: "PRE-SUBMISSION CHECK",
      title: "投稿前终检",
      subtitle:
        "以当前官方规则为准，检查一份稿件是否真的可以提交，并把阻塞项与建议项分开。",
      preset: "官网核验 · 阻塞项优先 · 最小安全修复",
      inputTitle: "准备材料",
      inputItems: [
        "最终稿源文件与编译 PDF",
        "目标 venue、届次与投稿阶段",
        "补充材料和投稿系统截图（可选）",
        "伦理、数据、代码与作者声明",
      ],
      inputHint:
        "会议和期刊规则会变化；Prompt 要求执行时重新访问官方页面。",
      promptTitle: "投稿前终检 Prompt",
      promptPurpose: "核验当前规则，定位真正会阻塞投稿的问题，并给出可验证结论。",
    },
    en: {
      eyebrow: "PRE-SUBMISSION CHECK",
      title: "Pre-submission check",
      subtitle:
        "Use current official rules to decide whether a manuscript is truly ready to submit, separating blockers from recommendations.",
      preset: "Official verification · blocker-first · minimal safe repair",
      inputTitle: "Prepare materials",
      inputItems: [
        "Final source project and compiled PDF",
        "Target venue, edition, and submission stage",
        "Supplement and submission-system screenshots (optional)",
        "Ethics, data, code, and author declarations",
      ],
      inputHint:
        "Conference and journal rules change; the prompt requires fresh verification against official pages.",
      promptTitle: "Pre-submission check prompt",
      promptPurpose:
        "Verify current rules, identify genuine submission blockers, and return evidence-backed conclusions.",
    },
  }),
  controls: [
    {
      id: "venueType",
      kind: "segmented",
      label: text("投稿类型", "Venue type"),
      description: text(
        "决定应核验哪些官方页面与流程。",
        "Determines which official pages and workflow rules apply.",
      ),
      defaultValue: "conference",
      options: Object.entries(VENUE_TYPES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "venue",
      kind: "text",
      label: text("目标 venue 与届次", "Target venue and edition"),
      description: text(
        "填写完整名称；会议请写年份，期刊请写刊名。",
        "Use the full name; include the year for a conference.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：ACL 2027 / IEEE TPAMI",
        "For example: ACL 2027 / IEEE TPAMI",
      ),
    },
    {
      id: "stage",
      kind: "select",
      label: text("投稿阶段", "Submission stage"),
      description: text(
        "匿名、版权和文件要求随阶段变化。",
        "Anonymity, copyright, and file requirements vary by stage.",
      ),
      defaultValue: "initial",
      options: Object.entries(SUBMISSION_STAGES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "sourceLevel",
      kind: "select",
      label: text("可用材料", "Available sources"),
      description: text(
        "源工程允许检查模板、编译与隐藏身份信息。",
        "Source files enable template, build, and hidden-identity checks.",
      ),
      defaultValue: "project",
      options: Object.entries(SOURCE_LEVELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "mode",
      kind: "segmented",
      label: text("处理方式", "Action"),
      description: text(
        "安全修复只处理确定的合规错误。",
        "Safe repair addresses confirmed compliance errors only.",
      ),
      defaultValue: "audit",
      options: Object.entries(CHECK_MODES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "scopes",
      kind: "multi",
      label: text("检查范围", "Check scope"),
      description: text(
        "默认覆盖投稿最常见的阻塞原因。",
        "Defaults cover the most common causes of a blocked submission.",
      ),
      defaultValue: [
        "official",
        "anonymity",
        "format",
        "metadata",
        "references",
        "visuals",
        "integrity",
        "build",
      ],
      minSelected: 1,
      options: Object.entries(CHECK_SCOPES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "portalSnapshot",
      kind: "toggle",
      label: text("投稿系统核对", "Submission-system check"),
      description: text(
        "提供页面截图时，核对 PDF 与系统字段是否一致。",
        "When screenshots are supplied, compare portal fields with the PDF.",
      ),
      defaultValue: false,
      enabledLabel: text("核对系统字段", "Check portal fields"),
      disabledLabel: text("不核对", "Skip"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("已知特殊规则", "Known special rules"),
      description: text(
        "例如 track、双盲例外或已获批的页数豁免；仍需官网核验。",
        "For example, a track, anonymity exception, or approved length waiver; still verify it officially.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const repair = scalar(values, "mode") === "repair";
    const venue = scalar(values, "venue");
    const sourceLevel = scalar(values, "sourceLevel");
    const scopes = selected(values, "scopes");
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");
    const repairInstruction =
      sourceLevel === "pdf"
        ? {
            zh: "当前只有最终 PDF，无法安全修改源稿或验证重新编译；因此只输出定位精确的修复清单，不直接涂改 PDF，也不得声称问题已修复。取得源文件后再执行修改与复验。",
            en: "Only the final PDF is available, so source-safe repair and rebuild verification are impossible. Return a precisely located remediation list only; do not edit rendered pixels or claim that an issue has been fixed. Apply and revalidate changes after source files are supplied.",
          }
        : {
            zh: "只修复已确认的合规错误及其直接依赖内容；其他科学内容、措辞、数字、结构与版式保持不变。若合规修复必然改变科学 claim、大范围结构或非局部版式，停止自动修改并升级为 high-risk 决策。其余修复后重新编译并逐项复验，交付原文件、新文件与精确 diff。",
            en: "Change only confirmed compliance errors and their direct dependencies. Preserve all other scientific content, wording, values, structure, and layout. If compliance necessarily changes a scientific claim, broad structure, or nonlocal layout, stop automatic repair and escalate it as a high-risk decision. Rebuild and revalidate all remaining fixes, returning original and repaired files plus an exact diff.",
          };
    const scopeInstructions = {
      zh: [
        scopes.includes("official")
          ? "核对当前官方规则、模板版本和所选 track"
          : "",
        scopes.includes("anonymity")
          ? sourceLevel === "pdf"
            ? "只检查 PDF 可见身份线索；源文件元数据标为无法核验"
            : "检查作者、致谢、自引、PDF 元数据和源文件身份线索"
          : "",
        scopes.includes("format")
          ? "检查页面/字数、字体、边距、栏宽、文件格式和附件要求"
          : "",
        scopes.includes("metadata")
          ? "核对标题、摘要、关键词、作者顺序、track 与投稿系统字段"
          : "",
        scopes.includes("references")
          ? "检查引用完整性、匿名风险和参考文献格式"
          : "",
        scopes.includes("visuals")
          ? "检查图表、caption、分辨率、补充材料与正文引用"
          : "",
        scopes.includes("integrity")
          ? "检查伦理、许可、冲突、数据和代码声明"
          : "",
        scopes.includes("build")
          ? sourceLevel === "pdf"
            ? "只有 PDF，编译与交叉引用源检查标为无法核验"
            : "实际编译并检查错误、缺失文件和交叉引用"
          : "",
      ]
        .filter(Boolean)
        .join("；"),
      en: [
        scopes.includes("official")
          ? "verify current official rules, template version, and selected track"
          : "",
        scopes.includes("anonymity")
          ? sourceLevel === "pdf"
            ? "inspect only visible identity clues in the PDF and mark source metadata unverifiable"
            : "inspect authorship, acknowledgments, self-citation, PDF metadata, and source-level identity clues"
          : "",
        scopes.includes("format")
          ? "check page/word policy, fonts, margins, columns, file formats, and attachments"
          : "",
        scopes.includes("metadata")
          ? "cross-check title, abstract, keywords, author order, track, and portal fields"
          : "",
        scopes.includes("references")
          ? "check citation completeness, anonymity risk, and reference formatting"
          : "",
        scopes.includes("visuals")
          ? "check visuals, captions, resolution, supplements, and prose references"
          : "",
        scopes.includes("integrity")
          ? "check ethics, licenses, conflicts, data, and code declarations"
          : "",
        scopes.includes("build")
          ? sourceLevel === "pdf"
            ? "mark compilation and source cross-reference checks unverifiable because only a PDF is available"
            : "build the project and inspect errors, missing files, and cross-references"
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    };

    if (language === "zh") {
      return `# 对论文执行投稿前终检${repair ? "并安全修复" : ""}

目标：${venue || "未提供；不得从盲稿猜测"}（${labelFor(scalar(values, "venueType"), VENUE_TYPES, language)}，${labelFor(scalar(values, "stage"), SUBMISSION_STAGES, language)}）。材料：${labelFor(sourceLevel, SOURCE_LEVELS, language)}。

${venue ? "开始前联网核验本次投稿适用的官方作者指南、当前模板/author kit、FAQ、提交系统说明与补充材料政策。" : "目标 venue 缺失，不能完成具体规则核验；先列出必须补充的 venue、届次/track 和阶段信息，并将最终状态判为 NOT READY。"}公开通用规则以 venue 官网、出版社或官方组织方维护页面为准；用户提供的编辑决定、投稿系统消息或书面豁免是本稿件专属规则，若来源可核验则优先于通用页面。记录版本、访问日期和 URL/消息来源；冲突仍无法消解时标为“需人工确认”，不得套用往年记忆。

检查：${labelsFor(values, "scopes", CHECK_SCOPES, language)}${enabled(values, "portalSnapshot") ? "，以及投稿系统字段与最终稿的一致性" : ""}。本轮只执行：${scopeInstructions.zh || "未选择有效范围"}。特殊情况：${custom}。

将结果分为：阻塞投稿、提交前必须修复、建议优化、已通过、材料不足无法核验。每项给出规则或专属通知依据、稿件位置、影响和最小修复；只在材料和所选范围允许时做文件验证，不以自然语言声明代替证据。

${repair ? repairInstruction.zh : "只输出终检报告和一份按优先级排序的提交清单，不修改文件。"}

最终明确给出 READY、READY AFTER FIXES 或 NOT READY，并列出决定该状态的证据。`;
    }

    return `# Run a Pre-submission Check${repair ? " and Repair Confirmed Issues Safely" : ""}

Target: ${venue || "not supplied; do not infer it from a blind manuscript"} (${labelFor(scalar(values, "venueType"), VENUE_TYPES, language)}, ${labelFor(scalar(values, "stage"), SUBMISSION_STAGES, language)}). Sources: ${labelFor(sourceLevel, SOURCE_LEVELS, language)}.

${venue ? "Before checking the paper, browse and verify the official author instructions, current template or author kit, FAQ, submission-system guidance, and supplementary-material policy for this exact submission." : "The target venue is missing, so exact rule verification is impossible. List the required venue, edition/track, and stage inputs and assign NOT READY as the final state."} Use venue-, publisher-, or organizer-maintained pages for public general rules. A supplied editor decision, portal message, or written waiver is a manuscript-specific rule and takes priority over a general page when its provenance is verifiable. Record versions, access dates, URLs, or message provenance; mark conflicts that remain unresolved for human confirmation and never rely on remembered prior-year rules.

Check: ${labelsFor(values, "scopes", CHECK_SCOPES, language)}${enabled(values, "portalSnapshot") ? ", including consistency between submission-system fields and the final manuscript" : ""}. Perform only: ${scopeInstructions.en || "no valid scope selected"}. Special circumstances: ${custom}.

Classify results as submission blocker, mandatory fix, recommendation, passed, or unverifiable due to missing material. For each item, give the governing rule or case-specific notice, manuscript location, impact, and smallest remedy. Perform file-level verification only when the supplied sources and selected scope support it; do not trust prose claims in place of evidence.

${repair ? repairInstruction.en : "Return the audit report and a prioritized submission checklist only; do not modify files."}

End with exactly one readiness state—READY, READY AFTER FIXES, or NOT READY—and the evidence that determines it.`;
  },
} satisfies WorkbenchDefinition;

const MATERIAL_TYPES = {
  cover: text("Cover Letter", "Cover letter"),
  highlights: text("Highlights", "Highlights"),
  plain: text("通俗摘要", "Plain-language summary"),
  contributions: text("CRediT 作者贡献", "CRediT author contributions"),
  availability: text("数据与代码声明", "Data and code availability"),
  ethics: text("伦理与利益冲突声明", "Ethics and conflict statements"),
  reviewers: text("建议 / 回避审稿人", "Suggested or excluded reviewers"),
};

const MATERIAL_STAGES = {
  initial: text("首次投稿", "Initial submission"),
  transfer: text("转投", "Transfer"),
  revision: text("返修提交", "Revision submission"),
};

const MATERIAL_OUTPUTS = {
  english: text("英文", "English"),
  bilingual: text("中英文对照", "Chinese and English"),
  official: text("按官方要求", "Follow official language requirements"),
};

const COVER_TONES = {
  concise: text("简洁直接", "Concise and direct"),
  editorial: text("编辑判断导向", "Editor-oriented"),
  neutral: text("中性正式", "Neutral and formal"),
};

export const SUBMISSION_MATERIALS_WORKBENCH = {
  id: "submission-materials-workbench",
  activePage: "submission-materials",
  copy: sharedCopy({
    zh: {
      eyebrow: "SUBMISSION MATERIALS",
      title: "投稿材料",
      subtitle:
        "只生成本次投稿真正需要的材料，并让每项陈述都能回到论文或作者提供的元数据。",
      preset: "按需生成 · 不补造信息 · 服从官方字段",
      inputTitle: "准备材料",
      inputItems: [
        "最终稿与摘要",
        "目标 venue 和投稿阶段",
        "作者、单位与 CRediT 信息",
        "基金、伦理、数据、代码与冲突声明",
      ],
      inputHint:
        "缺失的作者事实会保留为明确字段，不会由模型猜测。",
      promptTitle: "投稿材料 Prompt",
      promptPurpose: "核验要求后，只生成已勾选材料，并保持与论文和投稿系统一致。",
    },
    en: {
      eyebrow: "SUBMISSION MATERIALS",
      title: "Submission materials",
      subtitle:
        "Generate only the materials required for this submission, with every statement traceable to the paper or author metadata.",
      preset: "Selected outputs only · no invented metadata · official fields",
      inputTitle: "Prepare materials",
      inputItems: [
        "Final manuscript and abstract",
        "Target venue and submission stage",
        "Author, affiliation, and CRediT information",
        "Funding, ethics, data, code, and conflict declarations",
      ],
      inputHint:
        "Missing author facts remain explicit fields; the model must never guess them.",
      promptTitle: "Submission materials prompt",
      promptPurpose:
        "Verify requirements, then generate only selected materials consistent with the manuscript and portal.",
    },
  }),
  controls: [
    {
      id: "venue",
      kind: "text",
      label: text("目标 venue", "Target venue"),
      description: text(
        "填写完整名称和会议届次；执行时核验官方要求。",
        "Provide the full name and conference edition; verify official requirements at execution time.",
      ),
      defaultValue: "",
      placeholder: text("例如：Nature Communications", "For example: Nature Communications"),
    },
    {
      id: "stage",
      kind: "select",
      label: text("投稿阶段", "Submission stage"),
      description: text(
        "材料内容应与当前阶段一致。",
        "Materials must match the current submission stage.",
      ),
      defaultValue: "initial",
      options: Object.entries(MATERIAL_STAGES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "materials",
      kind: "multi",
      label: text("需要生成", "Generate"),
      description: text(
        "未选择的材料不得生成。",
        "Do not generate unselected materials.",
      ),
      defaultValue: ["cover"],
      minSelected: 1,
      options: Object.entries(MATERIAL_TYPES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "outputLanguage",
      kind: "segmented",
      label: text("材料语言", "Material language"),
      description: text(
        "界面与 Prompt 语言不限制最终文件语言。",
        "The interface and prompt language do not constrain file language.",
      ),
      defaultValue: "official",
      options: Object.entries(MATERIAL_OUTPUTS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "coverTone",
      kind: "select",
      label: text("投稿信语气", "Cover-letter tone"),
      description: text(
        "突出编辑判断所需信息，不复述摘要。",
        "Prioritize editorial decision signals rather than repeating the abstract.",
      ),
      defaultValue: "editorial",
      options: Object.entries(COVER_TONES).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => selected(values, "materials").includes("cover"),
    },
    {
      id: "editor",
      kind: "text",
      label: text("编辑姓名（可选）", "Editor name (optional)"),
      description: text(
        "未确认时使用中性称呼，不猜测姓名或职务。",
        "Use a neutral salutation when unverified; never guess a name or title.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      visibleWhen: (values) => selected(values, "materials").includes("cover"),
    },
    {
      id: "highlightCount",
      kind: "range",
      label: text("Highlights 条数", "Number of highlights"),
      description: text(
        "官方规则优先；此区间仅在未规定时使用。",
        "Official rules override this range; use it only when unspecified.",
      ),
      defaultValue: [3, 5],
      min: 2,
      max: 8,
      visibleWhen: (values) =>
        selected(values, "materials").includes("highlights"),
    },
    {
      id: "reviewerConstraints",
      kind: "textarea",
      label: text("审稿人约束", "Reviewer constraints"),
      description: text(
        "提供地域、机构、近年合作或回避关系；不凭空推荐。",
        "Provide geography, institution, recent collaboration, or exclusion constraints; do not invent candidates.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：近 5 年无合作；回避同机构",
        "For example: no collaboration in five years; exclude same institution",
      ),
      visibleWhen: (values) =>
        selected(values, "materials").includes("reviewers"),
      span: "full",
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充字段与要求", "Additional fields and requirements"),
      description: text(
        "粘贴投稿系统的确切字段、字数或字符限制。",
        "Paste exact portal fields, word limits, or character limits.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const venue = scalar(values, "venue");
    const materials = labelsFor(
      values,
      "materials",
      MATERIAL_TYPES,
      language,
    );
    const includesCover = selected(values, "materials").includes("cover");
    const includesHighlights =
      selected(values, "materials").includes("highlights");
    const includesReviewers =
      selected(values, "materials").includes("reviewers");
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");
    const highlightRange = values.highlightCount as readonly [number, number];

    if (language === "zh") {
      return `# 生成本次投稿所需材料

请读取最终稿和作者提供的元数据。目标：${venue || "未提供；不得猜测"}；阶段：${labelFor(scalar(values, "stage"), MATERIAL_STAGES, language)}；只生成：${materials}；语言：${labelFor(scalar(values, "outputLanguage"), MATERIAL_OUTPUTS, language)}。

${venue ? "先联网核验目标 venue 当前官方投稿说明和系统字段，记录 URL 与访问日期。" : "目标 venue 未提供时，只能生成 venue-neutral 草稿并列出待补规则，不能声称符合官方字段。"}公开规则以当前官网为准；用户提供的投稿系统字段、编辑消息和书面豁免若来源可核验，则作为本稿件专属要求优先处理。不得生成未勾选材料。

所有标题、摘要、贡献、数字、作者、单位、基金、ORCID、CRediT、伦理、冲突、数据与代码状态必须来自论文或作者材料。信息缺失时使用清楚的 \`[AUTHOR INPUT REQUIRED: ...]\`，不得猜测。转投材料不得残留上一 venue 名称。

${includesCover ? `Cover Letter 使用${labelFor(scalar(values, "coverTone"), COVER_TONES, language)}语气；称呼 ${scalar(values, "editor") || "未核验编辑姓名时使用中性称呼"}。说明论文问题、核心贡献、venue 匹配和必要声明，但不逐句复述摘要、不夸大新颖性。` : ""}
${includesHighlights ? `Highlights 在官方未规定时写 ${highlightRange[0]}–${highlightRange[1]} 条，每条只保留一个可由正文支持的要点。` : ""}
${includesReviewers ? `建议/回避审稿人只基于可核验的专业匹配和约束：${scalar(values, "reviewerConstraints") || "未提供；缺少独立性证据时不输出具体人选"}。核查机构、近年合作与显著冲突，说明选择理由，绝不虚构邮箱或身份。` : ""}

补充字段：${custom}。每种材料单独输出为清楚命名的 Markdown 或官方要求格式；在回复末尾用精简清单标出事实来源与仍需作者填写的字段，不生成未选择的额外投稿文件。`;
    }

    return `# Generate the Required Submission Materials

Read the final manuscript and author-supplied metadata. Target: ${venue || "not supplied; do not guess"}; stage: ${labelFor(scalar(values, "stage"), MATERIAL_STAGES, language)}; generate only: ${materials}; language: ${labelFor(scalar(values, "outputLanguage"), MATERIAL_OUTPUTS, language)}.

${venue ? "First browse and verify the target venue's current official submission instructions and portal fields, recording URLs and access dates." : "Without a target venue, create venue-neutral drafts only and list unresolved rules; do not claim official compliance."} Public rules come from current official pages. A supplied portal field, editor message, or written waiver is a manuscript-specific requirement and takes priority when its provenance is verifiable. Do not generate any unselected material.

Every title, abstract statement, contribution, value, author, affiliation, funder, ORCID, CRediT role, ethics statement, conflict, and data/code status must come from the manuscript or author material. Mark missing facts as \`[AUTHOR INPUT REQUIRED: ...]\`; never guess. Transferred materials must contain no stale venue names.

${includesCover ? `Use a ${labelFor(scalar(values, "coverTone"), COVER_TONES, language).toLowerCase()} cover-letter tone and ${scalar(values, "editor") ? `address ${scalar(values, "editor")}` : "use a neutral salutation because no editor is verified"}. State the problem, core contribution, venue fit, and required declarations without paraphrasing the abstract sentence by sentence or exaggerating novelty.` : ""}
${includesHighlights ? `When no official count is specified, provide ${highlightRange[0]}–${highlightRange[1]} highlights, each containing one manuscript-supported point.` : ""}
${includesReviewers ? `Suggest or exclude reviewers only from verifiable expertise and these constraints: ${scalar(values, "reviewerConstraints") || "none supplied; do not name candidates without evidence of independence"}. Check affiliations, recent collaboration, and material conflicts, explain each choice, and never invent an email or identity.` : ""}

Additional fields: ${custom}. Return each selected material as a separately named Markdown file or the officially required format. End the response with a concise source and missing-field checklist; do not create any additional unselected submission file.`;
  },
} satisfies WorkbenchDefinition;

const REVIEW_MODES = {
  rebuttal: text("Rebuttal", "Rebuttal"),
  revision: text("返修稿", "Revised manuscript"),
  response: text("Response Letter", "Response letter"),
};

const DECISION_TYPES = {
  discussion: text("会议讨论 / Rebuttal", "Conference discussion or rebuttal"),
  major: text("Major Revision", "Major revision"),
  minor: text("Minor Revision", "Minor revision"),
  reject: text("拒稿后重投", "Revise after rejection"),
};

const EVIDENCE_POLICIES = {
  existing: text("仅使用现有证据", "Existing evidence only"),
  analysis: text("允许补充分析", "Allow additional analyses"),
  experiment: text("允许新增实验", "Allow new experiments"),
};

const RESPONSE_TONES = {
  concise: text("简洁直接", "Concise and direct"),
  balanced: text("礼貌且坚定", "Courteous and firm"),
  explanatory: text("充分解释", "Explanatory"),
};

const CHANGE_POLICIES = {
  responseOnly: text("只生成回复", "Response only"),
  marked: text("回复 + 带标记修改稿", "Response plus marked manuscript"),
  clean: text("回复 + 干净稿 + 差异", "Response, clean manuscript, and diff"),
};

export const REVIEW_REVISION_WORKBENCH = {
  id: "review-revision-workbench",
  activePage: "review-revision",
  copy: sharedCopy({
    zh: {
      eyebrow: "REVIEW & REVISION",
      title: "审稿与返修",
      subtitle:
        "把审稿意见拆成可追踪任务，逐条回应并映射到证据和实际修改，不虚构新增实验。",
      preset: "逐条映射 · 证据诚实 · 修改可追踪",
      inputTitle: "准备材料",
      inputItems: [
        "全部审稿意见与编辑决定",
        "投稿稿件和补充材料",
        "真实新增实验或分析（如有）",
        "字数、页数与回复期限",
      ],
      inputHint:
        "请保留 reviewer 编号和原始评论顺序；模型会为每条意见分配稳定 ID。",
      promptTitle: "审稿与返修 Prompt",
      promptPurpose: "形成逐条回应、修改位置和未完成证据的闭环。",
    },
    en: {
      eyebrow: "REVIEW & REVISION",
      title: "Review and revision",
      subtitle:
        "Turn reviews into traceable tasks, map every response to evidence and actual edits, and never invent new experiments.",
      preset: "Comment-level mapping · evidence honesty · traceable changes",
      inputTitle: "Prepare materials",
      inputItems: [
        "All reviews and the editor decision",
        "Submitted manuscript and supplement",
        "Authentic new experiments or analyses, if any",
        "Word/page limits and response deadline",
      ],
      inputHint:
        "Preserve reviewer IDs and original comment order; the model assigns a stable ID to every comment.",
      promptTitle: "Review and revision prompt",
      promptPurpose:
        "Close the loop among each comment, response, manuscript location, and unresolved evidence.",
    },
  }),
  controls: [
    {
      id: "mode",
      kind: "segmented",
      label: text("任务类型", "Task type"),
      description: text(
        "决定正文是否修改以及回复文件结构。",
        "Determines whether the manuscript changes and how responses are packaged.",
      ),
      defaultValue: "revision",
      options: Object.entries(REVIEW_MODES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "decision",
      kind: "select",
      label: text("审稿阶段", "Review stage"),
      description: text(
        "根据阶段控制承诺范围和篇幅。",
        "Controls commitment scope and response length.",
      ),
      defaultValue: "major",
      options: Object.entries(DECISION_TYPES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "venue",
      kind: "text",
      label: text("venue 与规则", "Venue and edition"),
      description: text(
        "用于联网核验 rebuttal 或返修规则。",
        "Used to verify current rebuttal or revision rules online.",
      ),
      defaultValue: "",
      placeholder: text("例如：ICLR 2027", "For example: ICLR 2027"),
    },
    {
      id: "evidencePolicy",
      kind: "segmented",
      label: text("可新增证据", "Permitted new evidence"),
      description: text(
        "选择允许执行的上限，不代表必须新增。",
        "This is the maximum permitted scope, not a requirement to add work.",
      ),
      defaultValue: "analysis",
      options: Object.entries(EVIDENCE_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "responseLimits",
      kind: "text",
      label: text("回复限制与截止时间", "Response limits and deadline"),
      description: text(
        "优先填写编辑决定或投稿系统给出的字数、字符和时间限制。",
        "Prefer the word, character, and time limits stated in the editor decision or portal.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：5,000 characters；2027-02-10 23:59 AoE",
        "For example: 5,000 characters; 2027-02-10 23:59 AoE",
      ),
    },
    {
      id: "resourceWindow",
      kind: "text",
      label: text("资源与时间窗口", "Resource and time window"),
      description: text(
        "限制新增分析或实验的承诺。",
        "Bounds commitments to new analyses or experiments.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：7 天，2×A100，不新增标注",
        "For example: 7 days, 2×A100, no new annotation",
      ),
      visibleWhen: (values) => scalar(values, "evidencePolicy") !== "existing",
    },
    {
      id: "tone",
      kind: "select",
      label: text("回复语气", "Response tone"),
      description: text(
        "礼貌不等于无条件接受；异议必须有证据。",
        "Courtesy does not require unconditional agreement; disagreement needs evidence.",
      ),
      defaultValue: "balanced",
      options: Object.entries(RESPONSE_TONES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "changePolicy",
      kind: "select",
      label: text("修改交付", "Revision deliverable"),
      description: text(
        "回复中的每项“已修改”必须对应真实 diff。",
        "Every claim that the manuscript was changed must map to a real diff.",
      ),
      defaultValue: "clean",
      options: Object.entries(CHANGE_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => scalar(values, "mode") !== "rebuttal",
    },
    {
      id: "mergeDuplicates",
      kind: "toggle",
      label: text("合并重复意见", "Group duplicate concerns"),
      description: text(
        "可以共享分析，但每位 reviewer 仍获得独立回应。",
        "Analysis may be shared, but every reviewer still receives an explicit response.",
      ),
      defaultValue: true,
      enabledLabel: text("建立主题映射", "Build theme map"),
      disabledLabel: text("完全逐条处理", "Process independently"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("作者立场与禁区", "Author position and boundaries"),
      description: text(
        "例如不能新增数据、不同意某项假设或必须保留某个结论。",
        "For example, no new data, a disputed premise, or a conclusion that must remain.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const mode = scalar(values, "mode");
    const venue = scalar(values, "venue");
    const evidencePolicy = scalar(values, "evidencePolicy");
    const responseLimits = scalar(values, "responseLimits");
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");

    if (language === "zh") {
      return `# 处理审稿意见并生成${labelFor(mode, REVIEW_MODES, language)}

请完整读取审稿意见、编辑决定、原投稿稿件、补充材料和真实新增证据。阶段：${labelFor(scalar(values, "decision"), DECISION_TYPES, language)}；venue：${venue || "未指定"}；回复语气：${labelFor(scalar(values, "tone"), RESPONSE_TONES, language)}。

回复限制与截止时间：${responseLimits || "未提供；先从编辑决定或投稿系统消息核查，不能凭公开页面猜测本稿件截止时间"}。若指定 venue，联网核验当前公开的回复格式、匿名、附件和可修改范围并记录 URL 与日期；用户提供的编辑决定或投稿系统消息是本稿件专属依据，来源可核验时优先于公开通用规则。

保持 reviewer 与原评论顺序，为每条意见分配稳定 ID。先提取该意见的真实诉求、严重性、需要的证据和对应稿件位置；${enabled(values, "mergeDuplicates") ? "建立跨 reviewer 主题映射以避免重复劳动，但仍逐条独立回应" : "不合并意见"}。回应必须形成“评论 → 判断 → 行动/理由 → 证据 → 修改位置”的闭环。

新增证据边界：${labelFor(evidencePolicy, EVIDENCE_POLICIES, language)}${evidencePolicy !== "existing" ? `；资源限制：${scalar(values, "resourceWindow") || "未提供，禁止作超出材料的承诺"}` : ""}。只能陈述已经实际完成并提供结果的实验或分析。计划、运行中和未完成内容必须明确标记；不得虚构数字、显著性、引用、实现或 reviewer 认同。合理异议可以礼貌反驳，但必须准确复述对方观点并用正文或证据支持。

${mode === "rebuttal" ? "生成适合限制篇幅的逐条 rebuttal，不修改论文文件，也不承诺规则不允许的新内容。" : `交付：${labelFor(scalar(values, "changePolicy"), CHANGE_POLICIES, language)}。每项“已修改”必须指向实际页码/章节/行号和真实 diff；融合修改到论证中，不在正文堆叠“为回应审稿人”的补丁句。`}

作者边界：${custom}。最后输出意见—回应—证据—修改状态矩阵，标出未解决项和下一步；不要用感谢套话掩盖未完成工作。`;
    }

    return `# Address Reviews and Produce a ${labelFor(mode, REVIEW_MODES, language)}

Read all reviews, the editor decision, submitted manuscript, supplement, and authentic new evidence. Stage: ${labelFor(scalar(values, "decision"), DECISION_TYPES, language)}; venue: ${venue || "unspecified"}; tone: ${labelFor(scalar(values, "tone"), RESPONSE_TONES, language)}.

Response limits and deadline: ${responseLimits || "not supplied; inspect the editor decision or portal message first and never infer this manuscript's deadline from a public page"}. When a venue is named, browse and verify public response-format, anonymity, attachment, and permitted-change rules and record URLs and access dates. A supplied editor decision or portal message is manuscript-specific evidence and takes priority over a public general rule when its provenance is verifiable.

Preserve reviewer and comment order and assign every comment a stable ID. Extract the real request, severity, required evidence, and manuscript location before drafting. ${enabled(values, "mergeDuplicates") ? "Build a cross-reviewer theme map to share analysis while still answering every comment explicitly" : "Keep all comments independent"}. Close the loop from comment to judgment, action or rationale, evidence, and revised location.

New-evidence boundary: ${labelFor(evidencePolicy, EVIDENCE_POLICIES, language)}${evidencePolicy !== "existing" ? `; resources: ${scalar(values, "resourceWindow") || "not supplied, so do not make commitments beyond available material"}` : ""}. Describe an experiment or analysis as completed only when its actual output is supplied. Label planned, running, and unfinished work explicitly. Never invent values, significance, citations, implementation, or reviewer agreement. A reasoned disagreement is allowed, but restate the concern fairly and support the response with manuscript evidence.

${mode === "rebuttal" ? "Produce a length-aware point-by-point rebuttal. Do not edit manuscript files or promise work the rules do not permit." : `Deliver: ${labelFor(scalar(values, "changePolicy"), CHANGE_POLICIES, language)}. Every “we revised” statement must point to a real page/section/line and diff. Integrate revisions into the scientific argument rather than appending reviewer-facing patch sentences.`}

Author boundaries: ${custom}. End with a comment–response–evidence–revision status matrix, unresolved items, and next actions. Do not let courtesy language conceal incomplete work.`;
  },
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "mode" && value === "rebuttal") {
      next.decision = "discussion";
      next.changePolicy = "responseOnly";
    }
    if (
      id === "mode" &&
      value !== "rebuttal" &&
      scalar(current, "decision") === "discussion"
    ) {
      next.decision = "major";
    }
    if (id === "decision" && value === "discussion") {
      next.mode = "rebuttal";
      next.changePolicy = "responseOnly";
    }
    if (
      id === "decision" &&
      value !== "discussion" &&
      scalar(current, "mode") === "rebuttal"
    ) {
      next.mode = "revision";
    }
    return next;
  },
} satisfies WorkbenchDefinition;
