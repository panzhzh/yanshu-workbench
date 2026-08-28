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

const PEER_REVIEW_MODES = {
  full: text("完整同行评审", "Full peer review"),
  screening: text("快速风险筛查", "Editorial risk screening"),
  stress: text("严格压力测试", "Adversarial stress test"),
};

const PEER_REVIEW_DIMENSIONS = {
  contribution: text("问题价值与贡献", "Problem value and contribution"),
  positioning: text("文献定位与新颖性", "Positioning and novelty"),
  method: text("方法正确性", "Methodological soundness"),
  evidence: text("实验与证据充分性", "Experimental and evidential adequacy"),
  claims: text("结论边界", "Claim calibration"),
  presentation: text("结构与表达", "Structure and presentation"),
  reproducibility: text("可复现性", "Reproducibility"),
  integrity: text("伦理与研究完整性", "Ethics and research integrity"),
};

const REVIEW_MATERIAL_SCOPES = {
  manuscript: text("论文正文", "Manuscript"),
  supplement: text("正文 + 补充材料", "Manuscript and supplement"),
  artifacts: text(
    "正文 + 补充材料 + 代码/数据",
    "Manuscript, supplement, code, and data",
  ),
};

const EVIDENCE_POLICIES = {
  existing: text("仅使用现有证据", "Existing evidence only"),
  analysis: text("允许补充分析", "Allow additional analyses"),
  experiment: text("允许新增实验", "Allow new experiments"),
};

export const PEER_REVIEW_WORKBENCH = {
  id: "peer-review-workbench",
  activePage: "peer-review",
  copy: sharedCopy({
    zh: {
      eyebrow: "PEER REVIEW",
      title: "审稿",
      subtitle:
        "以独立审稿人的视角检查论文贡献、方法与证据，区分真正的科学风险和可修复的表达问题。",
      preset: "证据优先 · 问题分级 · 建议可执行",
      inputTitle: "准备材料",
      inputItems: [
        "完整论文或当前投稿稿",
        "补充材料（如有）",
        "代码、数据与复现说明（按配置选用）",
        "希望额外检查的问题（可选）",
      ],
      inputHint:
        "本页不区分会议或期刊，也不修改论文；如提供具体评审标准，可写入补充要求。",
      promptTitle: "论文审稿 Prompt",
      promptPurpose: "生成证据可追溯、轻重分明且能指导后续修改的独立审稿报告。",
    },
    en: {
      eyebrow: "PEER REVIEW",
      title: "Peer review",
      subtitle:
        "Review contribution, method, and evidence independently while separating scientific risks from repairable presentation issues.",
      preset: "Evidence-first · severity-aware · actionable guidance",
      inputTitle: "Prepare materials",
      inputItems: [
        "Complete manuscript or current submission",
        "Supplementary material, if available",
        "Code, data, and reproducibility notes when selected",
        "Any additional questions to inspect",
      ],
      inputHint:
        "This page does not distinguish conferences from journals and never edits the manuscript. Add any specific review standard under additional requirements.",
      promptTitle: "Peer-review prompt",
      promptPurpose:
        "Produce an independent review whose evidence, severity, and recommendations remain traceable.",
    },
  }),
  controls: [
    {
      id: "mode",
      kind: "segmented",
      label: text("评审方式", "Review mode"),
      description: text(
        "完整评审为默认；筛查更关注阻塞风险，压力测试更强调最强反例。",
        "Full review is the default; screening prioritizes blockers, while stress testing seeks the strongest counterarguments.",
      ),
      defaultValue: "full",
      options: Object.entries(PEER_REVIEW_MODES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "materialScope",
      kind: "select",
      label: text("评审材料范围", "Review materials"),
      description: text(
        "只评价实际提供且能够读取的材料。",
        "Evaluate only materials that are actually supplied and readable.",
      ),
      defaultValue: "supplement",
      options: Object.entries(REVIEW_MATERIAL_SCOPES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "dimensions",
      kind: "multi",
      label: text("评审维度", "Review dimensions"),
      description: text(
        "默认覆盖决定论文可信度与可读性的主要维度。",
        "Defaults cover the main dimensions that determine credibility and readability.",
      ),
      defaultValue: Object.keys(PEER_REVIEW_DIMENSIONS),
      minSelected: 1,
      options: Object.entries(PEER_REVIEW_DIMENSIONS).map(
        ([value, label]) => ({ value, label }),
      ),
      span: "full",
    },
    {
      id: "browseLiterature",
      kind: "toggle",
      label: text("联网核查相关文献", "Verify related literature online"),
      description: text(
        "核查新颖性、定位和重要引用时使用原始论文与可靠出版记录。",
        "Use original papers and reliable publication records when checking novelty, positioning, and important citations.",
      ),
      defaultValue: true,
      enabledLabel: text("核查文献", "Verify literature"),
      disabledLabel: text("只用提供材料", "Use supplied materials only"),
    },
    {
      id: "scorecard",
      kind: "toggle",
      label: text("通用评分卡", "General scorecard"),
      description: text(
        "使用跨 venue 的 1–5 分维度评分，不套用某个投稿系统的量表。",
        "Use a venue-neutral 1–5 dimensional scorecard rather than a portal-specific scale.",
      ),
      defaultValue: true,
      enabledLabel: text("输出评分卡", "Include scorecard"),
      disabledLabel: text("只输出文字判断", "Narrative judgment only"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充评审要求", "Additional review requirements"),
      description: text(
        "例如重点检查某项理论假设、应用风险或特定评审标准。",
        "For example, inspect a theoretical assumption, deployment risk, or specific review criterion.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const mode = scalar(values, "mode");
    const materialScope = scalar(values, "materialScope");
    const dimensions = labelsFor(
      values,
      "dimensions",
      PEER_REVIEW_DIMENSIONS,
      language,
    );
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");

    if (language === "zh") {
      return `# 对论文进行独立同行评审

你是一名严格、建设性且熟悉学术评审逻辑的独立审稿人。先从论文中判断研究领域、论文类型、核心问题、主要贡献与证据链，不预设其属于会议或期刊，也不套用某个投稿系统的评分尺度。

评审方式：${labelFor(mode, PEER_REVIEW_MODES, language)}；材料范围：${labelFor(materialScope, REVIEW_MATERIAL_SCOPES, language)}；评审维度：${dimensions}。只评价实际提供且能够读取的材料，缺失材料标为“无法核验”，不得反向猜测。

${enabled(values, "browseLiterature") ? "联网核查文献定位、新颖性和关键引用。优先使用原始论文、官方出版页或可靠索引，给出链接与核查日期；区分已核验事实与审稿判断。" : "不联网扩展文献，只依据提供材料判断；涉及新颖性或文献完整性的结论须说明证据范围。"}

先用简短文字复述论文试图解决的问题、核心主张与证据路径，再评估优点和问题。每个问题分配稳定 ID，并写明：严重性（阻塞 / 主要 / 次要）、论文位置、依据、为何重要、达到何种证据或修改标准才算解决。区分科学错误、证据不足、结论越界、可复现性风险和表达不清，避免把个人偏好包装成硬性要求。

实验建议必须回答一个真实未决问题；不要习惯性要求更多数据、更多 baseline 或更大模型。若现有分析即可解决，优先提出最小充分方案；若新实验对核心结论确有必要，说明其假设、对照、指标和能够改变判断的结果。不得虚构论文内容、结果、引用或代码状态。

按以下结构输出：
1. 论文主张与总体判断；
2. 值得保留的优点；
3. 主要问题表（ID、严重性、位置、证据、影响、解决标准）；
4. 次要问题与可直接修正项；
5. 需要作者澄清的问题；
${enabled(values, "scorecard") ? "6. 通用 1–5 分评分卡：问题价值、贡献清晰度、方法正确性、证据充分性、表达质量和可复现性，并给出评审置信度；\n7. 就绪度：可继续投稿 / 小幅修改 / 重大修改 / 存在基础性风险，以及最可能影响判断的 3 个问题。" : "6. 就绪度：可继续投稿 / 小幅修改 / 重大修改 / 存在基础性风险，以及最可能影响判断的 3 个问题。"}

补充要求：${custom}。当前任务只输出审稿报告，不修改论文，不撰写作者回复，也不替作者作出不存在证据支持的承诺。`;
    }

    return `# Conduct an Independent Peer Review

Act as a rigorous, constructive independent reviewer familiar with scholarly evaluation. Infer the paper's field, contribution type, central problem, main claims, and evidence chain from the manuscript. Do not assume a conference or journal category and do not imitate a submission portal's rating scale.

Review mode: ${labelFor(mode, PEER_REVIEW_MODES, language)}; materials: ${labelFor(materialScope, REVIEW_MATERIAL_SCOPES, language)}; dimensions: ${dimensions}. Evaluate only supplied and readable materials. Mark missing evidence as “not verifiable” rather than inferring it.

${enabled(values, "browseLiterature") ? "Browse to verify positioning, novelty, and important citations. Prefer original papers, official publication pages, and reliable indexes; provide links and access dates and distinguish verified facts from reviewer judgment." : "Use only supplied materials. State the evidence boundary for any judgment about novelty or literature coverage."}

Briefly reconstruct the paper's problem, central claim, and evidence path before assessing strengths and weaknesses. Give every concern a stable ID and state its severity (blocking, major, or minor), manuscript location, basis, importance, and the evidence or change required for resolution. Distinguish scientific error, insufficient evidence, overclaiming, reproducibility risk, and unclear exposition. Do not present personal preference as a mandatory rule.

Recommend an experiment only when it resolves a genuine open question; do not reflexively demand more data, baselines, or larger models. Prefer the smallest sufficient analysis when it can resolve the concern. When a new experiment is essential to the central claim, specify its hypothesis, comparison, metric, and what result would change the judgment. Never invent manuscript content, results, citations, or code status.

Return:
1. Paper claim and overall assessment;
2. Strengths worth preserving;
3. Major-concern table (ID, severity, location, evidence, impact, resolution threshold);
4. Minor concerns and directly repairable issues;
5. Questions requiring author clarification;
${enabled(values, "scorecard") ? "6. Venue-neutral 1–5 scorecard for problem value, contribution clarity, methodological soundness, evidence adequacy, presentation, and reproducibility, plus review confidence;\n7. Readiness: ready to proceed / minor revision / major revision / foundational risk, with the three issues most likely to affect the judgment." : "6. Readiness: ready to proceed / minor revision / major revision / foundational risk, with the three issues most likely to affect the judgment."}

Additional requirements: ${custom}. Produce only the review report. Do not edit the manuscript, draft an author response, or make unsupported commitments on the author's behalf.`;
  },
} satisfies WorkbenchDefinition;

export const REVISION_PLANNING_WORKBENCH = {
  id: "revision-planning-workbench",
  activePage: "revision-planning",
  copy: sharedCopy({
    zh: {
      eyebrow: "REVISION PLANNING",
      title: "返修规划",
      subtitle:
        "先把多位审稿人的意见拆分、去重和分级，再决定哪些问题需要实验、分析、解释或收缩结论。",
      preset: "意见去重 · P0/P1/P2 · A/B/C/D 分类",
      inputTitle: "准备材料",
      inputItems: [
        "全部审稿意见与编辑决定",
        "审稿时提交的论文与补充材料",
        "已有新增分析或实验结果（如有）",
        "现实资源、截止时间与作者边界",
      ],
      inputHint:
        "请保留 reviewer 编号和评论原文。当前阶段只形成修改计划，不直接写回复信或修改论文。",
      promptTitle: "返修规划 Prompt",
      promptPurpose: "把审稿意见转化为可排序、可判断、可执行的修改任务。",
    },
    en: {
      eyebrow: "REVISION PLANNING",
      title: "Revision planning",
      subtitle:
        "Split, deduplicate, and prioritize multiple reviews before deciding which concerns need experiments, analysis, explanation, or claim narrowing.",
      preset: "Deduplicated concerns · P0/P1/P2 · A/B/C/D classes",
      inputTitle: "Prepare materials",
      inputItems: [
        "All reviews and the editor decision",
        "The reviewed manuscript and supplement",
        "Any completed additional analyses or experiments",
        "Real resource limits, deadline, and author boundaries",
      ],
      inputHint:
        "Preserve reviewer identifiers and original wording. This stage creates a revision plan only; it does not draft the response letter or edit the manuscript.",
      promptTitle: "Revision-planning prompt",
      promptPurpose:
        "Convert reviews into ordered, classifiable, and executable revision tasks.",
    },
  }),
  controls: [
    {
      id: "evidencePolicy",
      kind: "segmented",
      label: text("可考虑的新增证据", "Permitted new evidence"),
      description: text(
        "这是规划上限，不代表默认需要补实验。",
        "This is the planning ceiling, not a default requirement to add experiments.",
      ),
      defaultValue: "analysis",
      options: Object.entries(EVIDENCE_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "resourceWindow",
      kind: "text",
      label: text("资源与时间窗口", "Resource and time window"),
      description: text(
        "用于判断最小可行实验和修改顺序，不用来掩盖关键证据缺口。",
        "Use this to scope minimum viable experiments and ordering, not to conceal critical evidence gaps.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：14 天，2×A100，不能新增人工标注",
        "For example: 14 days, 2×A100, no new manual annotation",
      ),
      visibleWhen: (values) => scalar(values, "evidencePolicy") !== "existing",
    },
    {
      id: "executionPlan",
      kind: "toggle",
      label: text("任务依赖与执行批次", "Dependencies and execution batches"),
      description: text(
        "在推荐顺序之外，标出可并行任务和必须等待的依赖。",
        "Beyond the recommended order, identify parallel tasks and blocking dependencies.",
      ),
      defaultValue: true,
      enabledLabel: text("输出执行批次", "Include execution batches"),
      disabledLabel: text("只给推荐顺序", "Recommended order only"),
    },
    {
      id: "decisionContext",
      kind: "textarea",
      label: text("编辑决定与本轮背景", "Decision and revision context"),
      description: text(
        "可填写编辑摘要、截止时间、回复篇幅或本轮必须处理的事项。",
        "Optionally include the editor summary, deadline, response limit, or mandatory items for this round.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("作者资源与边界", "Author resources and boundaries"),
      description: text(
        "例如无法获取新数据、某项实验已失败，或某个结论允许主动收缩。",
        "For example, unavailable new data, a failed experiment, or a claim that may be narrowed.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const evidencePolicy = scalar(values, "evidencePolicy");
    const resourceWindow = scalar(values, "resourceWindow");
    const decisionContext =
      scalar(values, "decisionContext") ||
      (language === "zh" ? "未提供" : "Not supplied");
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");

    if (language === "zh") {
      return `# 整理审稿意见并制定返修计划

你是一名经验丰富的论文返修规划顾问。请完整阅读论文、补充材料、编辑决定和多位审稿人的原始意见。当前阶段先不要写回复信，也不要修改论文；目标是把意见整理成一份清晰、可执行且证据诚实的修改计划。

编辑决定与本轮背景：${decisionContext}。可考虑的新增证据：${labelFor(evidencePolicy, EVIDENCE_POLICIES, language)}${evidencePolicy !== "existing" ? `；现实资源与时间：${resourceWindow || "未提供，方案须保守并标出依赖作者确认的资源"}` : "；即使发现核心结论必须补实验，也要如实标为阻塞项，不得假装可由文字解决"}。作者资源与边界：${custom}。

请完成：
1. 按 reviewer 和原始评论顺序拆分独立问题，为原评论建立稳定引用（如 R1-C1），不要把一条复合意见漏掉子问题。
2. 将不同审稿人的相同或相似问题合并为主题问题，同时保留全部来源和原评论映射；相似但证据要求不同的问题不要强行合并。
3. 标注优先级：P0＝影响核心结论或接收判断，必须优先；P1＝重要问题，需要认真修改或解释；P2＝文字、格式、图表、引用等次要问题。
4. 标注分类：A＝无需补实验，可通过解释、正文修改、补充分析或文献解决；B＝必须补实验或数据，否则核心结论难以成立；C＝审稿人要求实验，但可通过明确范围、补充讨论、降低结论强度或解释现实限制争取不补；D＝信息不足，暂时无法判断。
5. 对需要实验的问题，给出最小可行实验或分析：待验证假设、最小对照、数据、指标、判断标准和关键资源。不要扩张成新的研究项目，也不要虚构预期结果。
6. 对建议不补实验的问题，说明不补理由、残余风险，以及正文和未来回复信分别应如何处理。信息不足时写“需要作者确认”，不要自行假设。

请输出：

| 编号 | 问题 | 来源 | 优先级 | 分类 | 是否影响核心结论 | 建议解决方式 | 是否补实验 | 最小实验/分析方案 | 不补实验的理由与风险 | 修改位置 |
| -- | -- | -- | --- | -- | -------- | ------ | ----- | --------- | ---------- | ---- |

表格后总结：
1. 不补实验即可解决的问题；
2. 必须补实验的问题；
3. 审稿人要求实验但可以争取不补的问题；
4. 多位审稿人重复提出的问题；
5. 最可能影响论文接收的 3 个问题；
6. 推荐的修改顺序。${enabled(values, "executionPlan") ? "\n7. 任务依赖与执行批次：标出可并行任务、前置依赖和阻塞点。" : ""}

不要默认所有实验都必须补，也不要为了减少工作量而拒绝支撑核心结论所必需的实验。若意见可能来自论文表达不清，指出最需要澄清的位置和误读路径。所有“已有结果”“已完成修改”或“文献支持”都必须来自实际材料；当前只交付修改计划，不生成完整回复信、修改稿或虚构承诺。`;
    }

    return `# Organize Reviews and Build a Revision Plan

Act as an experienced manuscript-revision planning advisor. Read the paper, supplement, editor decision, and every review in full. Do not draft the response letter or edit the manuscript at this stage. Build a clear, executable, and evidence-honest revision plan first.

Decision and revision context: ${decisionContext}. Permitted new evidence: ${labelFor(evidencePolicy, EVIDENCE_POLICIES, language)}${evidencePolicy !== "existing" ? `; real resources and time: ${resourceWindow || "not supplied, so keep plans conservative and mark resource assumptions for author confirmation"}` : "; if the central claim truly requires a new experiment, mark it as a blocker rather than pretending prose can resolve it"}. Author resources and boundaries: ${custom}.

Complete these tasks:
1. Split every review into independent concerns in reviewer and original-comment order. Give each source comment a stable reference such as R1-C1, and preserve every sub-question in a compound comment.
2. Merge genuinely identical or similar concerns across reviewers into thematic issues while preserving every source and source-comment mapping. Do not merge concerns whose evidence requirements differ materially.
3. Assign priority: P0 affects the central conclusion or acceptance judgment and must be handled first; P1 is important and requires substantive revision or explanation; P2 covers secondary wording, format, figure, table, or citation issues.
4. Assign class: A needs no new experiment and can be handled through explanation, manuscript revision, additional analysis, or literature; B requires an experiment or data because the central conclusion otherwise fails; C requests an experiment but may be resolved by clarifying scope, expanding discussion, narrowing claims, or explaining a real constraint; D lacks enough information to judge.
5. For experimental concerns, give the minimum viable experiment or analysis: hypothesis, smallest meaningful comparison, data, metric, decision criterion, and critical resources. Do not expand it into a new research project or invent expected results.
6. When recommending no new experiment, state the rationale, residual risk, and how the manuscript and a future response letter should each handle the concern. Mark insufficient information as “author confirmation required” rather than guessing.

Return this table:

| ID | Concern | Source | Priority | Class | Affects central conclusion? | Recommended resolution | New experiment? | Minimum experiment/analysis | Rationale and risk of no experiment | Revision location |
| -- | -- | -- | --- | -- | -------- | ------ | ----- | --------- | ---------- | ---- |

Then summarize:
1. Concerns resolvable without new experiments;
2. Concerns that require experiments;
3. Experiment requests that may reasonably be declined;
4. Concerns repeated by multiple reviewers;
5. The three issues most likely to affect acceptance;
6. Recommended revision order.${enabled(values, "executionPlan") ? "\n7. Dependencies and execution batches, including parallel tasks, prerequisites, and blockers." : ""}

Do not assume every requested experiment is necessary, but do not reject evidence essential to the central claim merely to reduce workload. When a concern may arise from unclear writing, identify the likely location and misreading path. Every statement that a result exists, a change is complete, or literature supports a claim must come from supplied evidence. Deliver only the revision plan—no full response letter, revised manuscript, or invented commitment.`;
  },
} satisfies WorkbenchDefinition;

const REVISION_AUDIT_SCENARIOS = {
  auto: text("自动判断", "Infer automatically"),
  journal: text("期刊返修", "Journal revision"),
  conference: text("会议 Rebuttal / Discussion", "Conference rebuttal or discussion"),
};

export const REVISION_AUDIT_WORKBENCH = {
  id: "revision-audit-workbench",
  activePage: "revision-audit",
  copy: sharedCopy({
    zh: {
      eyebrow: "REVISION AUDIT",
      title: "返修稿审查",
      subtitle: "逐条核验回复与实际修改是否闭环，定位重新提交前仍可能被追问的问题。",
      preset: "逐条映射 · 修改取证 · 最小修正",
      inputTitle: "准备材料",
      inputItems: [
        "Reviewer comments 与编辑决定",
        "Response Letter 或 rebuttal",
        "Revised manuscript",
        "Original manuscript 与 diff manuscript（强烈建议）",
      ],
      inputHint: "材料不完整时仍可审查，但无法完成的核验会被明确标出。",
      promptTitle: "返修稿审查 Prompt",
      promptPurpose: "从审稿人和编辑视角核验每条意见是否被真实、充分且一致地解决。",
    },
    en: {
      eyebrow: "REVISION AUDIT",
      title: "Revision Audit",
      subtitle: "Verify each response against the actual revision and identify concerns likely to survive resubmission.",
      preset: "Comment mapping · change verification · minimum correction",
      inputTitle: "Prepare materials",
      inputItems: [
        "Reviewer comments and editor decision",
        "Response letter or rebuttal",
        "Revised manuscript",
        "Original manuscript and diff manuscript (strongly recommended)",
      ],
      inputHint: "The audit can proceed with incomplete materials, but unverifiable checks will be stated explicitly.",
      promptTitle: "Revision-audit prompt",
      promptPurpose: "Verify from a reviewer and editor perspective whether every concern was actually and sufficiently resolved.",
    },
  }),
  controls: [
    {
      id: "scenario",
      kind: "segmented",
      label: text("返修场景（可选）", "Revision context (optional)"),
      description: text("不确定时保持自动判断。", "Keep automatic inference when uncertain."),
      defaultValue: "auto",
      options: Object.entries(REVISION_AUDIT_SCENARIOS).map(([value, label]) => ({ value, label })),
      span: "full",
    },
    {
      id: "venue",
      kind: "text",
      label: text("期刊或会议（可选）", "Journal or conference (optional)"),
      description: text("仅用于理解本轮规则与决策语境。", "Used only to understand the rules and decision context."),
      defaultValue: "",
      placeholder: text("例如：IEEE TPAMI / NeurIPS 2027", "For example: IEEE TPAMI / NeurIPS 2027"),
    },
    {
      id: "decisionContext",
      kind: "textarea",
      label: text("本轮规则与背景", "Round rules and context"),
      description: text("可填写 major/minor revision、rebuttal 篇幅、允许修改范围或截止时间。", "Optionally include major/minor revision, rebuttal limit, permitted changes, or deadline."),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("特别关注", "Special focus"),
      description: text("例如重点核查新增实验、降级 claim 或某位 reviewer。", "For example, focus on new experiments, narrowed claims, or one reviewer."),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const scenario = scalar(values, "scenario") || "auto";
    const venue = scalar(values, "venue") || (language === "zh" ? "未指定" : "Not specified");
    const decisionContext = scalar(values, "decisionContext") || (language === "zh" ? "未提供；依据材料自动判断" : "Not supplied; infer from the materials");
    const custom = scalar(values, "custom") || (language === "zh" ? "无" : "None");
    const scenarioLabel = labelFor(scenario, REVISION_AUDIT_SCENARIOS, language);

    if (language === "zh") {
      return `# 审查返修稿是否充分回应审稿意见

你是一名经验丰富的论文返修审查顾问。请站在审稿人以及期刊编辑或会议领域主席的角度，逐条核验现有回复和修改是否真实、准确、充分地解决了本轮意见，而不是重新独立审稿。

返修场景：${scenarioLabel}；目标期刊或会议：${venue}；本轮规则与背景：${decisionContext}。若场景为“自动判断”，请从决定信、意见和材料中判断期刊返修、会议 rebuttal/discussion 或允许修改的会议阶段；能够可靠判断时直接继续并说明依据，不要要求作者确认。

请完整读取 reviewer comments、编辑决定、Response Letter 或 rebuttal、revised manuscript、original manuscript 和 diff manuscript。先建立 reviewer—comment—response—change 的完整映射，保留原始编号；缺失或无法读取的材料标为“无法核验”，不得猜测，也不得因为回复信写了“we have revised”就默认修改成立。

对每条 comment 同时检查：
1. 审稿人真正关心的问题及其解决标准；
2. 回复是否直接、完整且证据充分，是否遗漏子问题或答非所问；
3. 回复声称的每项修改能否在 revised manuscript 与 diff 中定位，位置、内容和强度是否一致；
4. 修改是否真正解决 concern，而非只做措辞回应；新增实验、分析、引用或降级 claim 是否支持回复中的结论；
5. 是否存在过度声称、前后矛盾、跨 reviewer 回复不一致或容易引发继续追问的残余风险。

期刊返修应以修改稿、diff 和回复信的闭环为核心。会议 rebuttal/discussion 若规则不允许改稿，不要因缺少正文修改而扣分；此时核查 rebuttal 是否在允许篇幅和证据边界内充分回答，并把“当前稿件已有证据”“澄清”与“承诺未来修改”分开。若会议阶段允许改稿，则按修改稿同样取证。编辑决定或投稿系统的明确规则优先于一般惯例。

逐条输出：

| 编号 | 来源 | 核心关切 | Response 核验 | 稿件与 diff 证据 | 判断 | 遗留风险 | 最小修正 | 位置 |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |

“判断”只能使用 **Adequately addressed / Partially addressed / Not adequately addressed**。充分解决的问题简要说明闭环证据；其余问题明确区分 Response Letter/rebuttal 与 manuscript 各自最小需要修改什么。不得借机扩写全文或提出与原 comment 无直接关系的新要求；只有返修造成的直接矛盾或新风险可以记录。

表格后给出：已安全解决的问题；仍为高风险的问题；遗漏或无法核验的问题；跨意见不一致；重新提交前最值得优先修正的事项；以及整体结论 **Ready to resubmit / Ready after minor correction / Not ready to resubmit**。特别关注：${custom}。只输出审查报告，不直接改稿或代写完整回复信。`;
    }

    return `# Audit Whether the Revision Adequately Addresses the Reviews

Act as an experienced revision-audit advisor. From the perspective of a reviewer and a journal editor or conference area chair, verify comment by comment whether the existing response and revision genuinely, accurately, and sufficiently resolve this round of concerns. Do not conduct a new independent review of the paper.

Revision context: ${scenarioLabel}; target journal or conference: ${venue}; round rules and context: ${decisionContext}. When automatic inference is selected, infer journal revision, conference rebuttal/discussion, or a revision-enabled conference phase from the decision, reviews, and supplied files. Proceed without author confirmation when the evidence is sufficient and state the basis.

Read the reviewer comments, editor decision, response letter or rebuttal, revised manuscript, original manuscript, and diff manuscript in full. Build a complete reviewer–comment–response–change map while preserving source IDs. Mark missing or unreadable evidence as “not verifiable”; never infer it, and never accept “we have revised” without locating the change in the manuscript.

For every comment, verify: the reviewer's actual concern and resolution threshold; whether the response directly and completely addresses every sub-question; whether each claimed change exists at a traceable location in the revised manuscript and diff; whether the substantive change resolves the concern rather than merely acknowledging it; and whether overclaiming, contradictions, inconsistent cross-reviewer responses, or residual follow-up risk remains.

For journal revisions, center the audit on closure across the response letter, revised manuscript, and diff. For conference rebuttal or discussion phases that prohibit manuscript changes, do not penalize the absence of edits; instead verify that the rebuttal resolves the concern within the permitted scope and distinguish existing manuscript evidence, clarification, and promises of future revision. When manuscript revision is allowed, verify changes exactly as for a journal. Explicit editor or submission-system instructions override generic practice.

Return:

| ID | Source | Core concern | Response verification | Manuscript and diff evidence | Judgment | Residual risk | Minimum correction | Location |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |

The judgment must be exactly **Adequately addressed / Partially addressed / Not adequately addressed**. Briefly state the closure evidence for adequately resolved concerns. Otherwise separate the minimum correction needed in the response letter/rebuttal from the minimum manuscript correction. Do not rewrite the paper or introduce concerns unrelated to the source comments; report only direct contradictions or risks created by the revision itself.

After the table, summarize safely resolved comments, high-risk comments, omissions or unverifiable claims, cross-comment inconsistencies, resubmission priorities, and one overall verdict: **Ready to resubmit / Ready after minor correction / Not ready to resubmit**. Special focus: ${custom}. Produce only the audit report; do not directly edit the manuscript or draft a full replacement response letter.`;
  },
} satisfies WorkbenchDefinition;
