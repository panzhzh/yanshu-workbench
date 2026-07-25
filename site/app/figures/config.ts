import type { Language } from "../config";

export type FigureStyleId =
  | "conference-minimal"
  | "structured-technical"
  | "light-academic";

export type TechnicalFigureCount = 0 | 1 | 2;

export interface FigurePreferences {
  includeIntroductionFigure: boolean;
  includeMethodOverview: boolean;
  technicalFigureCount: TechnicalFigureCount;
  styleId: FigureStyleId;
  allowSemanticIcons: boolean;
  includeLargeTitle: boolean;
}

export const DEFAULT_FIGURE_PREFERENCES: FigurePreferences = {
  includeIntroductionFigure: true,
  includeMethodOverview: true,
  technicalFigureCount: 1,
  styleId: "conference-minimal",
  allowSemanticIcons: true,
  includeLargeTitle: false,
};

export const TECHNICAL_FIGURE_COUNTS: TechnicalFigureCount[] = [0, 1, 2];

export const FIGURE_STYLES = {
  "conference-minimal": {
    label: {
      zh: "顶会极简线稿",
      en: "Conference minimal",
    },
    shortDescription: {
      zh: "纯白底 · 窄线条 · 单一强调色",
      en: "White · thin lines · one accent",
    },
    directive: {
      zh: "纯白色背景，使用细窄深灰线条、矩形或轻圆角模块，最多一个低饱和强调色；不使用渐变、阴影、3D、纹理或装饰性 AI 视觉。",
      en: "Use a pure white background, thin dark-gray lines, rectangular or subtly rounded modules, and at most one muted accent color. Do not use gradients, shadows, 3D effects, textures, or decorative AI aesthetics.",
    },
  },
  "structured-technical": {
    label: {
      zh: "结构化技术图",
      en: "Structured technical",
    },
    shortDescription: {
      zh: "模块分区 · 轻填充 · 清晰信息流",
      en: "Grouped modules · light fills · clear flow",
    },
    directive: {
      zh: "使用白色或近白背景、清晰的模块分组和一致的箭头语义；允许两种低饱和强调色与极浅填充，以层级和对齐表达技术关系，不增加装饰性元素。",
      en: "Use a white or near-white background, clear modular grouping, and consistent arrow semantics. Up to two muted accent colors and very light fills are allowed; express technical relationships through hierarchy and alignment, not decoration.",
    },
  },
  "light-academic": {
    label: {
      zh: "轻量学术插画",
      en: "Light academic illustration",
    },
    shortDescription: {
      zh: "柔和几何 · 语义图标 · 低饱和配色",
      en: "Soft geometry · semantic icons · muted color",
    },
    directive: {
      zh: "使用白色或极浅背景、柔和圆角几何形状和克制的语义图标，配色限制为两至三种低饱和颜色；可以轻松友好，但不得呈现漫画、吉祥物或夸张卡通效果。",
      en: "Use a white or very pale background, softly rounded geometric forms, and restrained semantic pictograms with two or three muted colors. The result may feel approachable, but it must not look comic-like, mascot-driven, or exaggeratedly cartoonish.",
    },
  },
} as const satisfies Record<
  FigureStyleId,
  {
    label: Record<Language, string>;
    shortDescription: Record<Language, string>;
    directive: Record<Language, string>;
  }
>;

export const FIGURE_STYLE_IDS = Object.keys(
  FIGURE_STYLES,
) as FigureStyleId[];

export const FIGURE_COPY = {
  zh: {
    eyebrow: "RESEARCH FIGURES",
    title: "科研绘图",
    subtitle:
      "让 GPT 先理解论文，再规划并逐张生成引言图、方法总览和技术细节图。",
    preset: "论文理解 → 方案确认 → 分图生成",
    reset: "恢复默认配置",
    resetHint: "恢复默认图型、风格、语义图标和标题设置；保留当前语言。",
    inputTitle: "论文材料",
    inputSource: "论文源文件",
    inputPdf: "最新编译稿",
    inputHint:
      "复制 Prompt 后，在同一个 GPT 对话中上传 .tex 与 .pdf；本站不读取或保存论文。",
    figureTasks: "绘图任务",
    figureTasksHint: "至少保留一类图；技术细节图可选择 0–2 张。",
    introductionFigure: "引言图",
    introductionFigureHint: "场景、仍存在的问题、核心洞察与作用。",
    methodOverview: "方法 Overview",
    methodOverviewHint: "输入、主要阶段、信息流和输出。",
    technicalFigures: "技术细节图",
    technicalFiguresHint: "区别于 Overview，每张只解释一个局部机制。",
    figuresUnit: "张",
    visualStyle: "视觉风格",
    visualStyleHint: "三种风格均以论文可读性为先，不使用花哨 AI 视觉。",
    semanticIcons: "语义图标",
    semanticIconsOn: "克制使用",
    semanticIconsOff: "不使用",
    semanticIconsOnHint:
      "只在图标能表示论文中的真实对象时使用，不能代替技术机制。",
    semanticIconsOffHint: "仅使用模块、线条、箭头与必要文字。",
    largeTitle: "图内大标题",
    largeTitleOn: "使用大标题",
    largeTitleOff: "不使用",
    largeTitleOnHint: "仅允许一个来自论文术语的简短标题。",
    largeTitleOffHint: "推荐设置；只保留必要的 panel 标题或步骤标签。",
    promptEyebrow: "FIGURE PROMPT",
    promptTitle: "论文绘图 Prompt",
    promptBody:
      "Prompt 会先要求一份极简方案和术语清单；确认后再逐张生成可下载 PNG。",
    livePrompt: "实时 Prompt",
    selectedFigures: "计划图数",
    selectedStyle: "当前风格",
    promptLanguage: "Prompt 语言",
    switchPromptLanguage: "切换 Prompt 语言",
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "收起",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    eyebrow: "RESEARCH FIGURES",
    title: "Research figures",
    subtitle:
      "Let GPT understand the paper before planning and generating an introduction figure, method overview, and technical-detail figures.",
    preset: "Understand paper → approve plan → generate separately",
    reset: "Restore defaults",
    resetHint:
      "Restores the default figure set, style, semantic-icon, and title settings while keeping the current language.",
    inputTitle: "Paper materials",
    inputSource: "Paper source",
    inputPdf: "Latest compiled paper",
    inputHint:
      "After copying the prompt, upload the .tex and .pdf in the same GPT conversation. This site never reads or stores the paper.",
    figureTasks: "Figure set",
    figureTasksHint:
      "Keep at least one figure type. Choose zero to two technical-detail figures.",
    introductionFigure: "Introduction figure",
    introductionFigureHint:
      "Scenario, current problem, core insight, and intended role.",
    methodOverview: "Method overview",
    methodOverviewHint: "Inputs, main stages, information flow, and outputs.",
    technicalFigures: "Technical-detail figures",
    technicalFiguresHint:
      "Distinct from the overview; each explains one local mechanism.",
    figuresUnit: "figure(s)",
    visualStyle: "Visual style",
    visualStyleHint:
      "All three styles prioritize paper readability and avoid flashy AI aesthetics.",
    semanticIcons: "Semantic icons",
    semanticIconsOn: "Use sparingly",
    semanticIconsOff: "Do not use",
    semanticIconsOnHint:
      "Use icons only for real entities in the paper; never replace a technical mechanism.",
    semanticIconsOffHint:
      "Use only modules, lines, arrows, and necessary text.",
    largeTitle: "Large in-figure title",
    largeTitleOn: "Use a title",
    largeTitleOff: "No title",
    largeTitleOnHint:
      "Allow one short title composed only of terminology from the paper.",
    largeTitleOffHint:
      "Recommended; retain only necessary panel headings or step labels.",
    promptEyebrow: "FIGURE PROMPT",
    promptTitle: "Paper-figure prompt",
    promptBody:
      "The prompt first requests a concise plan and terminology list, then generates downloadable PNGs one at a time after approval.",
    livePrompt: "Live prompt",
    selectedFigures: "Planned figures",
    selectedStyle: "Current style",
    promptLanguage: "Prompt language",
    switchPromptLanguage: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

function buildChineseTasks(preferences: FigurePreferences) {
  const tasks: string[] = [];

  if (preferences.includeIntroductionFigure) {
    tasks.push(
      "引言图：用一张可快速理解的概念图连接研究场景、今天仍存在的关键问题、论文核心洞察及其作用；不要塞入完整方法流程，也不要堆砌实验数字。",
    );
  }

  if (preferences.includeMethodOverview) {
    tasks.push(
      "方法 Overview：呈现输入、主要阶段、关键数据或信息流和输出，突出整体逻辑与各部分关系；保持总体层级，不展开局部实现细节。",
    );
  }

  if (preferences.technicalFigureCount > 0) {
    tasks.push(
      `${preferences.technicalFigureCount} 张技术细节图：从方法中选择最需要视觉解释且证据充分的 ${preferences.technicalFigureCount} 个局部机制。每张只解释一个机制的输入、操作、关系与输出，不得复述 Overview；两张图之间也不得重复。`,
    );
  }

  return tasks;
}

function buildEnglishTasks(preferences: FigurePreferences) {
  const tasks: string[] = [];

  if (preferences.includeIntroductionFigure) {
    tasks.push(
      "Introduction figure: connect the research setting, the key problem that still exists today, the paper’s core insight, and its intended role in one quickly understandable concept figure. Do not compress the full method pipeline into this figure or overload it with experimental numbers.",
    );
  }

  if (preferences.includeMethodOverview) {
    tasks.push(
      "Method overview: show the inputs, main stages, essential data or information flow, and outputs while emphasizing the overall logic and relationships. Stay at the overview level and leave local implementation details to dedicated figures.",
    );
  }

  if (preferences.technicalFigureCount > 0) {
    const count = preferences.technicalFigureCount;
    tasks.push(
      `${count} technical-detail figure${count === 1 ? "" : "s"}: select ${count === 1 ? "the" : "the two"} most visually important and sufficiently supported local mechanism${count === 1 ? "" : "s"}. Each figure must explain one mechanism’s inputs, operations, relationships, and outputs without repeating the overview${count === 2 ? " or the other technical figure" : ""}.`,
    );
  }

  return tasks;
}

export function buildFigurePrompt(
  preferences: FigurePreferences,
  language: Language,
) {
  const style = FIGURE_STYLES[preferences.styleId];

  if (language === "zh") {
    const iconRule = preferences.allowSemanticIcons
      ? "仅在图标能明确表示数据、用户、设备、模型、服务器等论文真实对象时克制使用；每个图标都必须有明确语义，不得代替关键机制或用于装饰。"
      : "不使用图标、卡通物件或类比插画；所有技术关系都用模块、线条、箭头和必要文字表达。";
    const titleRule = preferences.includeLargeTitle
      ? "允许一个 3–7 个英文单词的图内大标题，但必须直接使用论文已有术语，不得使用营销式措辞；论文完整标题、作者和 caption 不放入图片。"
      : "不使用图内大标题；只保留必要的 panel 标题或步骤标签，论文标题、作者和 caption 均不放入图片。";
    const tasks = buildChineseTasks(preferences)
      .map((task, index) => `${index + 1}. ${task}`)
      .join("\n");

    return `# CS 论文科研绘图

## 输入
在同一对话中提供本 Prompt、论文主 \`.tex\` 源文件和最新编译的 \`.pdf\`。先完整阅读两份材料：用 \`.tex\` 确认术语、公式与结构，用 \`.pdf\` 确认论文上下文和现有图表。若两者存在会实质影响绘图的冲突，只提出必要问题，不要猜测。

## 绘图任务
${tasks}

## 统一约束
- 图中所有文字——包括标题、模块名、箭头标签、图例、缩写和变量符号——必须与论文中的术语完全一致，保留原有大小写、连字符和符号。不得翻译、改写或自造近义词；只能使用论文已经定义的缩写。若文字放不下，应调整版式，不能擅自缩写。
- 不得发明论文中不存在的模块、数据流、公式、指标、实验结果或因果关系。证据不足的内容先询问，不要补全。
- Overview 与技术细节图必须分工明确；每张图聚焦一个叙事目标，避免段落式文字和重复信息。
- 视觉风格：${style.directive.zh}
- 语义图标：${iconRule}
- 大标题：${titleRule}
- 按论文单双栏缩放后的可读性设计，保持字号、线宽、箭头和颜色语义一致；任何文字出现拼写、截断或术语不一致时必须重新生成。

## 工作顺序
先输出一份不超过 8 行的绘图计划，列出每张图的目的、主要面板或信息流，以及拟使用的论文术语；此时不要生成图片。等我确认后，一次只生成一张，并在生成前后核对术语、结构和图间分工。

## 输出
每张图分别生成一个可下载的高分辨率 PNG，不要合成联系表，不要添加水印、作者信息或图片 caption。`;
  }

  const iconRule = preferences.allowSemanticIcons
    ? "Use pictograms sparingly and only when they clearly represent real entities in the paper, such as data, users, devices, models, or servers. Every icon must carry meaning; never use an icon as decoration or as a substitute for a technical mechanism."
    : "Do not use icons, cartoon objects, or analogy illustrations. Express all technical relationships with modules, lines, arrows, and necessary text.";
  const titleRule = preferences.includeLargeTitle
    ? "One large in-figure title of 3–7 English words is allowed, but every word must come directly from the paper’s terminology and the title must not sound promotional. Do not place the full paper title, authors, or caption inside the image."
    : "Do not use a large in-figure title. Retain only necessary panel headings or step labels, and do not place the paper title, authors, or caption inside the image.";
  const tasks = buildEnglishTasks(preferences)
    .map((task, index) => `${index + 1}. ${task}`)
    .join("\n");

  return `# Research Figures for a CS Paper

## Inputs
Provide this prompt, the paper’s main \`.tex\` source, and the latest compiled \`.pdf\` in the same conversation. Read both in full: use the \`.tex\` to verify terminology, equations, and structure, and use the \`.pdf\` to understand context and existing figures. If a material conflict would affect the figures, ask only the necessary question instead of guessing.

## Figure set
${tasks}

## Shared constraints
- Every piece of in-figure text—including titles, module names, arrow labels, legends, abbreviations, and variable symbols—must exactly match the paper’s terminology, capitalization, hyphenation, and notation. Do not translate, paraphrase, or invent synonyms. Use only abbreviations already defined in the paper. If a label does not fit, revise the layout rather than shortening it.
- Do not invent modules, data flows, equations, metrics, experimental results, or causal relationships that are absent from the paper. Ask before visualizing anything unsupported.
- Keep the overview and technical-detail figures complementary. Give each figure one narrative purpose, with no paragraph-like text or repeated information.
- Visual style: ${style.directive.en}
- Semantic icons: ${iconRule}
- Large title: ${titleRule}
- Design for legibility at the paper’s final one- or two-column size. Keep typography, line weights, arrows, and color semantics consistent. Regenerate any image containing misspelled, truncated, or inconsistent terminology.

## Workflow
First provide a figure plan in no more than eight lines, listing each figure’s purpose, main panels or information flow, and the exact paper terms that will appear. Do not generate an image yet. After I confirm the plan, generate one figure at a time and check terminology, structure, and division of responsibility before and after each generation.

## Output
Generate every figure as a separate downloadable high-resolution PNG. Do not create a contact sheet or add watermarks, author information, or the figure caption inside the image.`;
}
