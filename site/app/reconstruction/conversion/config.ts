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

const TARGET_STAGES = {
  submission: text("投稿 / 审稿版", "Submission / review version"),
  camera: text("Camera-ready / 正式版", "Camera-ready / final version"),
};

const TEMPLATE_SOURCES = {
  official: text("联网获取最新官方模板", "Fetch the latest official template"),
  provided: text("使用用户提供的官方模板", "Use an official template supplied by the user"),
};

function sharedCopy(seed: Record<Language, Pick<WorkbenchCopy, "eyebrow" | "title" | "subtitle" | "preset" | "inputTitle" | "inputItems" | "inputHint" | "promptTitle" | "promptPurpose">>) {
  return {
    zh: {
      ...seed.zh,
      reset: "恢复默认配置",
      resetHint: "恢复投稿版与最新官方模板。",
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
      resetHint: "Restore submission stage and latest official template.",
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

export const VERSION_CONVERSION_WORKBENCH = {
  id: "tex-template-migration",
  activePage: "version-conversion",
  copy: sharedCopy({
    zh: {
      eyebrow: "TEX TEMPLATE MIGRATION",
      title: "TeX 模板迁移",
      subtitle: "将现有论文无损迁移到目标 venue 的最新官方 LaTeX 模板，不修改论文内容。",
      preset: "最新官方模板 · 原稿只读 · 内容零改写",
      inputTitle: "准备材料",
      inputItems: ["完整论文 TeX 工程", "BibTeX 与 figures/", "当前可编译 PDF", "目标 venue 与年份"],
      inputHint: "转换在新目录完成；原论文目录和文件保持不变。",
      promptTitle: "TeX 模板迁移 Prompt",
      promptPurpose: "获取并核验最新官方模板，只完成模板必需的 LaTeX 结构映射。",
    },
    en: {
      eyebrow: "TEX TEMPLATE MIGRATION",
      title: "TeX Template Migration",
      subtitle: "Migrate an existing paper losslessly into the target venue's latest official LaTeX template without editing its content.",
      preset: "Latest official template · read-only source · zero prose edits",
      inputTitle: "Prepare materials",
      inputItems: ["Complete TeX project", "BibTeX and figures/", "Current compiled PDF", "Target venue and year"],
      inputHint: "Perform the migration in a new directory and leave the original manuscript untouched.",
      promptTitle: "TeX-template migration prompt",
      promptPurpose: "Fetch and verify the latest official template and perform only required LaTeX structure mapping.",
    },
  }),
  controls: [
    {
      id: "targetVenue",
      kind: "text",
      label: text("目标 venue 与年份", "Target venue and year"),
      description: text("用于定位对应届次或当前有效的官方模板。", "Used to identify the correct edition or currently effective official template."),
      defaultValue: "",
      placeholder: text("例如：ACL 2027 / IEEE TPAMI", "For example: ACL 2027 / IEEE TPAMI"),
      span: "full",
    },
    {
      id: "targetStage",
      kind: "segmented",
      label: text("目标阶段", "Target stage"),
      description: text("决定采用匿名投稿模板还是正式出版模板。", "Determines whether to use the anonymous submission or final publication template."),
      defaultValue: "submission",
      options: Object.entries(TARGET_STAGES).map(([value, label]) => ({ value, label })),
      span: "full",
    },
    {
      id: "templateSource",
      kind: "segmented",
      label: text("模板来源", "Template source"),
      description: text("默认只从 venue 或出版方官方页面获取。", "By default, use only the venue or publisher's official source."),
      defaultValue: "official",
      options: Object.entries(TEMPLATE_SOURCES).map(([value, label]) => ({ value, label })),
      span: "full",
    },
    {
      id: "customInstructions",
      kind: "textarea",
      label: text("补充要求", "Additional requirements"),
      description: text("可填写官方模板链接、特殊编译方式或必须保留的工程约定。", "Optionally provide an official template link, special build command, or project convention to preserve."),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const venue = scalar(values, "targetVenue");
    const stage = scalar(values, "targetStage") || "submission";
    const source = scalar(values, "templateSource") || "official";
    const custom = scalar(values, "customInstructions");

    if (language === "zh") {
      return `# 将论文迁移到目标 TeX 模板

你需要把我现有的完整论文工程无损迁移到目标 venue 的 LaTeX 模板中。这是纯模板迁移，不是论文修改、精修、压缩、扩写或重构。

目标 venue 与年份：${venue || "未填写；请先从材料判断，无法唯一判断时只询问这一项"}。目标阶段：${TARGET_STAGES[stage as keyof typeof TARGET_STAGES]?.zh ?? stage}。模板来源：${TEMPLATE_SOURCES[source as keyof typeof TEMPLATE_SOURCES]?.zh ?? source}。${custom ? `补充要求：${custom}。` : ""}

## 获取并核验模板

${source === "official" ? "联网访问目标 venue 或出版方的官方作者页面，下载当前目标阶段最新且适用的完整 TeX 模板包。优先使用官方作者指南、官方模板下载页或官方 Overleaf 链接；不要以博客、第三方镜像、历史缓存或其他年份模板替代。记录模板名称、适用年份或版本、官方 URL、下载日期和文件哈希。" : "使用我提供的模板包，但仍需联网核对它是否来自官方来源、是否适用于目标阶段以及是否仍为当前版本；发现不一致时停止迁移并在报告中说明。"}

先阅读模板 README、示例 TeX、document class、bibliography 样式和官方编译说明，确认必需文件、编译引擎、匿名规则、作者区、附录和补充材料的组织方式。不要仅凭模板外观猜测用法。

## 绝对内容保护

原论文目录只读。先建立源文件清单并成功编译当前基线，再在新的迁移目录中工作。

坚决不修改论文的标题、摘要、关键词、正文、章节顺序、段落顺序、句子、术语、缩写、claim、数字、引用、公式、算法、表格内容、caption、图片内容、附录内容、致谢或作者提供的元数据。不得删减、补写、润色、改写、概括、扩展或为了页数和版面重新组织科学内容。

只允许完成目标模板实际要求的机械映射，例如：

- 替换 documentclass，并加载目标模板要求的官方 style/class 文件；
- 把标题、作者、单位、摘要和关键词原样放入目标模板对应字段；
- 按目标阶段应用官方匿名或正式作者格式，但不得猜测缺失信息；
- 映射模板要求的 section、bibliography、appendix、supplement 和浮动体外壳；
- 在语义完全不变时处理目标模板不兼容的 LaTeX 命令、宏定义、路径或 package 冲突；
- 保持所有 label、ref、eqref、cite key、公式、表格、图片及其源代码内容不变。

若目标模板或官方限制与当前稿件冲突，例如超页、超字数、图表过宽、附录不允许或某个 package 不兼容，不得擅自压缩或改写正文。先完成能够安全完成的迁移，再把冲突、位置、官方依据和最小候选处理方式写入报告，由作者另行决定。

## 迁移与验收

1. 复制源工程到新的目标目录并引入完整官方模板；不得覆盖原稿。
2. 建立“源文件/命令 → 目标文件/命令”映射，只执行模板必需变化。
3. 使用官方要求的编译引擎完成干净编译，修复模板兼容错误，但不能通过删除内容规避错误。
4. 对比迁移前后的正文抽取结果，核查标题、摘要、各段文本、数字、cite key、label/ref、公式、表格、图、caption、附录和 bibliography 是否逐项等价。
5. 核查没有未解析引用、缺图、缺失文献、静默 package 降级或模板示例占位内容残留。

## 交付

返回一个完整、独立、可编译的目标模板工程及编译 PDF，并提供简洁的 \`template_migration_report.md\`，记录官方模板来源与版本、编译命令、仅涉及模板的文件变化、内容一致性检查结果、尚未解决的官方规则冲突以及需要作者填写的信息。

报告必须明确确认原始论文未被修改，并区分“模板机械变化”和“未执行的内容候选变化”。不要返回经过润色、压缩或重写的论文。`;
    }

    return `# Migrate a Paper into the Target TeX Template

Migrate my complete manuscript project losslessly into the target venue's LaTeX template. This is template migration only—not manuscript editing, polishing, compression, expansion, or reconstruction.

Target venue and year: ${venue || "not provided; infer it from the materials when unique, otherwise ask only for this item"}. Target stage: ${TARGET_STAGES[stage as keyof typeof TARGET_STAGES]?.en ?? stage}. Template source: ${TEMPLATE_SOURCES[source as keyof typeof TEMPLATE_SOURCES]?.en ?? source}.${custom ? ` Additional requirements: ${custom}.` : ""}

${source === "official" ? "Browse the official venue or publisher author site and download the latest complete TeX template applicable to this stage. Prefer the official author instructions, official download, or official Overleaf link. Do not substitute a blog, third-party mirror, cache, historical edition, or another year's template. Record the template name, version or applicable year, official URL, download date, and file hash." : "Use the supplied template package, but verify online that it is official, applicable to this stage, and current. Stop and report any mismatch before migration."}

Read the template README, example TeX, document class, bibliography style, and official build instructions before acting. Keep the original project read-only, inventory it, and compile a source baseline. Work only in a new migration directory.

Do not change the title, abstract, keywords, prose, section order, paragraph order, sentences, terminology, acronyms, claims, values, citations, equations, algorithms, table content, captions, image content, appendix, acknowledgments, or author-supplied metadata. Do not delete, add, polish, paraphrase, summarize, expand, or reorganize scientific content for length or layout.

Only mechanical mappings required by the target template are allowed: document class and official style files; verbatim placement of title, author, affiliation, abstract, and keywords into target fields; official anonymous or final-author formatting without guessing missing data; required section, bibliography, appendix, supplement, and float wrappers; and semantics-preserving fixes for incompatible commands, macros, paths, or package conflicts. Preserve every label, ref, eqref, cite key, equation, table, figure, caption, and source-code payload.

When an official limit or template rule conflicts with the manuscript—page or word excess, wide displays, appendix restrictions, or package incompatibility—do not rewrite or compress content. Complete only safe migration work and report the conflict, location, official basis, and minimum candidate resolution for the author to decide.

Migration and validation: copy the source into a new target directory and add the complete official template; create a source-to-target command/file map; compile cleanly with the official toolchain without deleting content to suppress errors; compare extracted manuscript text and verify title, abstract, paragraphs, values, cite keys, labels/refs, equations, tables, figures, captions, appendix, and bibliography for equivalence; and check unresolved references, missing figures or citations, silent package fallback, and leftover template examples.

Deliver a complete standalone compilable target-template project, its PDF, and a concise \`template_migration_report.md\` recording the official template source and version, build command, template-only file changes, content-equivalence checks, unresolved official-rule conflicts, and missing author inputs. Explicitly confirm that the original manuscript was not modified and separate mechanical template changes from unexecuted content-change candidates. Do not return a polished, compressed, or rewritten paper.`;
  },
} satisfies WorkbenchDefinition;
