import type { Language } from "../config";

export type FigureStyleId =
  | "conference-minimal"
  | "structured-technical"
  | "light-academic";

export type FigurePromptId =
  | "introduction"
  | "method-overview"
  | "technical-detail";

export interface FigurePreferences {
  includeIntroductionFigure: boolean;
  includeMethodOverview: boolean;
  includeTechnicalDetailFigure: boolean;
  styleId: FigureStyleId;
  allowSemanticIcons: boolean;
  includeLargeTitle: boolean;
}

export const DEFAULT_FIGURE_PREFERENCES: FigurePreferences = {
  includeIntroductionFigure: true,
  includeMethodOverview: true,
  includeTechnicalDetailFigure: true,
  styleId: "conference-minimal",
  allowSemanticIcons: true,
  includeLargeTitle: false,
};

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

interface FigurePromptSpec {
  number: string;
  label: Record<Language, string>;
  tag: Record<Language, string>;
  purpose: Record<Language, string>;
  heading: Record<Language, string>;
  objective: Record<Language, string>;
  successCriterion: Record<Language, string>;
  designRules: Record<Language, readonly string[]>;
  exclusions: Record<Language, readonly string[]>;
}

export const FIGURE_PROMPTS = {
  introduction: {
    number: "01",
    label: {
      zh: "引言图",
      en: "Introduction figure",
    },
    tag: {
      zh: "问题与意义",
      en: "Problem & significance",
    },
    purpose: {
      zh: "让读者迅速理解问题为何重要、今天仍卡在哪里，以及本文带来什么核心洞察。",
      en: "Show why the problem matters, what still blocks progress today, and the paper’s core insight.",
    },
    heading: {
      zh: "为 CS 论文生成一张引言图",
      en: "Generate One Introduction Figure for a CS Paper",
    },
    objective: {
      zh: "这张图位于 Introduction，用视觉论证引出研究问题与必要性。它不是方法流程图，也不是把全文压缩成一张 graphical abstract。",
      en: "This figure belongs in the Introduction and visually establishes the research problem and its significance. It is neither a method pipeline nor a graphical abstract that compresses the whole paper.",
    },
    successCriterion: {
      zh: "第一次接触该主题的 CS 读者应能在 10–15 秒内说清：研究场景是什么、今天仍存在什么关键障碍、为什么值得解决，以及本文核心洞察可能改变什么。",
      en: "Within 10–15 seconds, a CS reader new to the topic should be able to state the setting, the key obstacle that still exists today, why it matters, and what the paper’s core insight is intended to change.",
    },
    designRules: {
      zh: [
        "从论文中提取一个唯一的视觉主旨；优先呈现任务或应用场景、今天仍存在的关键障碍、障碍造成的直接后果、本文核心洞察及其预期作用。",
        "选择最适合论文证据的单一阅读路径。只有在内容确实适合时才采用“场景 → 障碍 → 后果 → 核心洞察”的结构，不要机械套模板。",
        "把现有方法的不足表达为当前仍未解决的具体矛盾，不使用空泛的“性能有限”“仍具挑战”等占位表述。",
        "本文方法只出现到核心洞察或概念性改变这一层，不展开模块、训练步骤或实现流水线。",
        "图中文字只保留读者理解问题与意义所必需的短标签；默认不放实验数字，确有必要时也只能使用论文明确支持的极少量关键数字。",
      ],
      en: [
        "Extract one visual take-home message from the paper. Prioritize the task or application setting, the key obstacle that still exists today, its immediate consequence, the paper’s core insight, and the change that insight is intended to enable.",
        "Choose one reading path that fits the paper’s evidence. Use a setting → obstacle → consequence → core insight structure only when it is genuinely suitable; do not force a template.",
        "State the limitation of current approaches as a concrete present-day tension, not a placeholder such as “limited performance” or “still challenging.”",
        "Show the proposed work only at the level of its core insight or conceptual change; do not unfold modules, training steps, or an implementation pipeline.",
        "Keep only the short labels needed to understand the problem and its significance. Omit experimental numbers by default; if one is indispensable, use only a very small number explicitly supported by the paper.",
      ],
    },
    exclusions: {
      zh: [
        "不得加入完整方法架构、模块清单、训练/推理流程、公式、超参数、消融实验或表格与图片编号。",
        "不得用结果榜单或密集数字替代研究动机，也不得把论文的所有贡献同时塞进一张图。",
        "不得夸大影响、补造因果关系，或承诺论文证据没有支持的改进。",
      ],
      en: [
        "Do not include the full architecture, a module inventory, training or inference flow, equations, hyperparameters, ablations, or table and figure references.",
        "Do not replace research motivation with a leaderboard or dense numbers, and do not squeeze every contribution into the figure.",
        "Do not exaggerate impact, invent causal relationships, or promise improvements unsupported by the paper.",
      ],
    },
  },
  "method-overview": {
    number: "02",
    label: {
      zh: "方法总览图",
      en: "Method overview",
    },
    tag: {
      zh: "整体心智地图",
      en: "System mental model",
    },
    purpose: {
      zh: "在读者进入方法细节前，建立输入、核心阶段、信息流与输出的整体心智地图。",
      en: "Give readers a stable mental model of inputs, major stages, information flow, and outputs before method details.",
    },
    heading: {
      zh: "为 CS 论文生成一张方法总览图",
      en: "Generate One Method Overview Figure for a CS Paper",
    },
    objective: {
      zh: "这张图是论文方法的总体框架图。它回答“整个方法如何组织并运转”，不负责重新论证研究意义，也不展开某个局部机制。",
      en: "This is the paper’s overall framework figure. It answers how the method is organized and operates as a whole; it does not re-argue the motivation or unpack a local mechanism.",
    },
    successCriterion: {
      zh: "读者看图后应能沿一条明确路径说清：输入是什么、主要阶段或组件如何连接、关键信息如何流动、最终输出是什么，并能带着这个心智地图阅读 Method。",
      en: "After viewing the figure, a reader should be able to follow one clear path through the inputs, major stages or components, essential information flow, and outputs, then use that mental model while reading the Method section.",
    },
    designRules: {
      zh: [
        "从 .tex 中确认正式定义的输入、输出、主要组件与接口；每个主要组件只出现一次，并用层级、分组和箭头表达关系。",
        "优先呈现决定整体理解的主路径。仅当论文确实依赖分支、共享参数、循环、跨阶段反馈或多模态交互时，才显示这些结构。",
        "只有在训练与推理的差异影响方法理解时才明确区分两者；不得为了画面复杂而增加并行流程。",
        "保持 Overview 粒度：组件内部只保留一句话无法替代的结构关系，局部计算交给技术细节图。",
        "让图的阅读顺序、箭头方向和颜色语义全局一致；输入与输出必须有清楚边界。",
      ],
      en: [
        "Use the .tex to verify formally defined inputs, outputs, major components, and interfaces. Show each major component once and express relationships through hierarchy, grouping, and arrows.",
        "Prioritize the main path needed for system-level understanding. Show branches, shared parameters, loops, cross-stage feedback, or multimodal interaction only when the paper actually depends on them.",
        "Separate training from inference only when that distinction is material to understanding the method; do not add parallel flows merely to make the figure look complex.",
        "Stay at overview granularity. Keep only internal structure that cannot be replaced by one sentence, and leave local computation to the technical-detail figure.",
        "Use a consistent reading order, arrow direction, and color semantics throughout. Inputs and outputs must have clear boundaries.",
      ],
    },
    exclusions: {
      zh: [
        "不得重复引言图中的场景—问题叙事，也不得加入实验结果、性能数字、消融结论或研究影响。",
        "不得塞入每个子操作、完整公式、损失项推导、超参数、代码级实现或长段说明文字。",
        "不得为了视觉对称虚构模块、复制同一组件，或隐藏论文真实存在的关键依赖。",
      ],
      en: [
        "Do not repeat the setting–problem narrative of the Introduction figure or add results, performance numbers, ablation conclusions, or research impact.",
        "Do not include every sub-operation, full equations, loss derivations, hyperparameters, code-level implementation, or paragraph-like explanations.",
        "Do not invent modules for visual symmetry, duplicate the same component, or hide a real dependency in the paper.",
      ],
    },
  },
  "technical-detail": {
    number: "03",
    label: {
      zh: "关键技术细节图",
      en: "Key technical-detail figure",
    },
    tag: {
      zh: "唯一关键机制",
      en: "One key mechanism",
    },
    purpose: {
      zh: "自动选择区别于总览、最需要视觉解释的一项核心机制，并只生成这一张图。",
      en: "Select the single mechanism most in need of visual explanation, distinct from the overview, and generate only that figure.",
    },
    heading: {
      zh: "为 CS 论文生成一张关键技术细节图",
      en: "Generate One Key Technical-Detail Figure for a CS Paper",
    },
    objective: {
      zh: "这张图只解释方法中最关键、最难仅靠正文或公式理解的一项局部机制。它必须区别于方法总览，并把“这一机制具体如何工作”讲清楚。",
      en: "This figure explains exactly one local mechanism that is central to the method and difficult to understand from prose or equations alone. It must be distinct from the overview and make clear how that mechanism actually works.",
    },
    successCriterion: {
      zh: "读者应能从图中追踪该机制的输入或状态、关键变换或交互、中间表示以及输出或接口，同时不会误以为这是整篇方法的总览图。",
      en: "A reader should be able to trace the mechanism’s input or state, key transformation or interaction, intermediate representation, and output or interface without mistaking the figure for the full method overview.",
    },
    designRules: {
      zh: [
        "先比较论文中的候选机制，只选择同时满足四项条件的一项：属于核心贡献；仅靠文字或公式较难理解；能够与 Overview 明确分工；在 .tex 与 .pdf 中有充分证据。",
        "若没有任何机制同时满足四项条件，先说明原因并请求我确认，不得为了完成任务而发明一张技术图。",
        "围绕这一项机制展示必要的输入或状态、操作顺序、实体间关系、中间表示与输出；每个元素都必须直接服务于机制理解。",
        "只在公式对机制不可替代且能以论文原式清晰呈现时保留一个局部公式；否则使用准确的结构与信息流表达。",
        "明确检查与方法总览的差异：总览给出系统位置与接口，本图放大局部运作；不得重新绘制整条方法流水线。",
      ],
      en: [
        "Compare candidate mechanisms and select exactly one that meets all four conditions: central to the contribution, hard to understand from prose or equations alone, clearly separable from the overview, and sufficiently supported by both the .tex and .pdf.",
        "If no mechanism meets all four conditions, explain why and ask for confirmation before drawing. Do not invent a technical figure merely to complete the task.",
        "Show only the input or state, operation sequence, entity relationships, intermediate representation, and output needed to understand this mechanism. Every element must serve that explanation.",
        "Include at most one local equation, and only when it is indispensable and can be reproduced exactly from the paper; otherwise use precise structure and information flow.",
        "Explicitly check the division of labor with the Method Overview: the overview establishes system position and interfaces, while this figure magnifies local operation. Do not redraw the full pipeline.",
      ],
    },
    exclusions: {
      zh: [
        "只生成一张技术细节图，不得提供第二个机制、多个备选图、联系表或同图多方案。",
        "不得重复完整输入—输出流水线，也不得混入研究动机、实验结果、性能比较或未被论文定义的类比。",
        "不得用装饰性图标替代核心计算、交互或状态变化。",
      ],
      en: [
        "Generate one technical-detail figure only: no second mechanism, alternative figures, contact sheet, or multiple designs in one image.",
        "Do not repeat the full input-to-output pipeline or mix in motivation, experimental results, performance comparisons, or analogies not defined by the paper.",
        "Do not use decorative icons as substitutes for the core computation, interaction, or state transition.",
      ],
    },
  },
} as const satisfies Record<FigurePromptId, FigurePromptSpec>;

export const FIGURE_PROMPT_ORDER: FigurePromptId[] = [
  "introduction",
  "method-overview",
  "technical-detail",
];

export const FIGURE_COPY = {
  zh: {
    eyebrow: "RESEARCH FIGURES",
    title: "科研绘图",
    subtitle: "选择什么，就得到什么独立 Prompt；一次只让 GPT 生成一张图。",
    preset: "论文取证 → 单图方案 → 确认后生成",
    reset: "恢复默认配置",
    resetHint: "恢复默认图型、风格、语义图标和标题设置；保留当前语言。",
    inputTitle: "论文材料",
    inputSource: "论文源文件",
    inputPdf: "最新编译稿",
    inputHint:
      "复制任一 Prompt 后，在同一个 GPT 对话中上传 .tex 与 .pdf；本站不读取或保存论文。",
    figureTasks: "选择绘图 Prompt",
    figureTasksHint: "选择什么，就显示什么 Prompt；至少保留一种。",
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
    promptEyebrow: "INDEPENDENT FIGURE PROMPTS",
    promptTitle: "独立绘图 Prompt",
    promptBody: "每张卡片都是一项完整的单图任务。建议逐个复制，每次只生成一张。",
    selectedPrompts: "已选 Prompt",
    promptUnit: "份",
    selectedStyle: "当前风格",
    generationMode: "生成方式",
    onePromptOneFigure: "1 Prompt · 1 张图",
    independentPrompt: "独立 Prompt",
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
      "Select a figure type to get its independent prompt. GPT generates one image at a time.",
    preset: "Read evidence → plan one figure → generate after approval",
    reset: "Restore defaults",
    resetHint:
      "Restores the default figure set, style, semantic-icon, and title settings while keeping the current language.",
    inputTitle: "Paper materials",
    inputSource: "Paper source",
    inputPdf: "Latest compiled paper",
    inputHint:
      "After copying any prompt, upload the .tex and .pdf in the same GPT conversation. This site never reads or stores the paper.",
    figureTasks: "Select figure prompts",
    figureTasksHint:
      "Only selected prompts appear below. Keep at least one selected.",
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
    promptEyebrow: "INDEPENDENT FIGURE PROMPTS",
    promptTitle: "Independent figure prompts",
    promptBody:
      "Each card is a complete single-figure task. Copy them separately and generate one image at a time.",
    selectedPrompts: "Selected prompts",
    promptUnit: "prompt(s)",
    selectedStyle: "Current style",
    generationMode: "Generation mode",
    onePromptOneFigure: "1 prompt · 1 figure",
    independentPrompt: "Independent prompt",
    switchPromptLanguage: "Switch prompt language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

export function isFigurePromptSelected(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
) {
  if (promptId === "introduction") {
    return preferences.includeIntroductionFigure;
  }
  if (promptId === "method-overview") {
    return preferences.includeMethodOverview;
  }
  return preferences.includeTechnicalDetailFigure;
}

function buildList(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildFigurePrompt(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
  language: Language,
) {
  const spec = FIGURE_PROMPTS[promptId];
  const style = FIGURE_STYLES[preferences.styleId];

  if (language === "zh") {
    const iconRule = preferences.allowSemanticIcons
      ? "仅在图标能明确表示数据、用户、设备、模型、服务器等论文真实对象时克制使用；每个图标都必须承载信息，不得用于装饰或代替技术机制。"
      : "不使用图标、卡通物件或类比插画；所有关系都用模块、线条、箭头和必要文字表达。";
    const titleRule = preferences.includeLargeTitle
      ? "允许一个 3–7 个英文单词的图内大标题，但必须直接使用论文已有术语且不得带有营销措辞；论文完整标题、作者和 caption 不放入图片。"
      : "不使用图内大标题；只保留必要的 panel 标题或步骤标签，论文标题、作者和 caption 均不放入图片。";

    return `# ${spec.heading.zh}

## 目标
${spec.objective.zh}

成功标准：${spec.successCriterion.zh}

## 输入与取证
在同一对话中提供本 Prompt、论文主 \`.tex\` 源文件和最新编译的 \`.pdf\`。先完整阅读两份材料：以 \`.tex\` 为术语、公式、符号和结构依据，以 \`.pdf\` 理解上下文、版面与现有图表。若两者存在会影响绘图的冲突，只提出必要问题，不要猜测。

## 这张图必须完成
${buildList(spec.designRules.zh)}

## 不得混入
${buildList(spec.exclusions.zh)}

## 统一视觉与文字约束
- 图中所有文字——包括标题、模块名、箭头标签、图例、缩写和变量符号——必须与论文中的术语完全一致，保留原有大小写、连字符和符号。不得翻译、改写或自造近义词；只能使用论文已经定义的缩写。
- 规划时把拟出现在图中的每个标签逐项放在引号中；冷门方法名或自造词须逐字符核对，但最终图片中显示正常写法。若文字放不下，调整版式，不得擅自缩写。
- 不得发明论文中不存在的模块、数据流、公式、指标、实验结果或因果关系。证据不足的内容先询问，不要补全。
- 视觉风格：${style.directive.zh}
- 语义图标：${iconRule}
- 大标题：${titleRule}
- 面向论文最终单双栏尺寸设计；文字短而清晰，不写段落。颜色必须有明确语义，重要区分不能只依赖颜色，还应结合形状、线型或直接标签。
- 根据内容和目标栏宽选择横向或纵向布局，保持一条清楚的阅读路径；避免垂直文字、交叉箭头和无意义留白。

## 工作顺序
1. 先输出不超过 6 行的单图方案：唯一主旨、构图与阅读顺序、拟使用的全部精确标签，以及任何证据不足之处。此时不要生成图片。
2. 等我确认方案后，只生成这一张图，不提供备选版本或第二张图。
3. 生成后逐项核对图片中的术语、拼写、结构、箭头语义和缩小后的可读性；如有错误，只修正受影响部分，不改变已确认的其余设计。

## 输出
生成一个可直接下载的高分辨率 PNG。不要生成联系表，不要添加水印、作者信息、论文完整标题或图片 caption。图片之后只附一行核对结果。`;
  }

  const iconRule = preferences.allowSemanticIcons
    ? "Use pictograms sparingly and only when they clearly represent real entities in the paper, such as data, users, devices, models, or servers. Every icon must carry information; never use one as decoration or as a substitute for a technical mechanism."
    : "Do not use icons, cartoon objects, or analogy illustrations. Express all relationships with modules, lines, arrows, and necessary text.";
  const titleRule = preferences.includeLargeTitle
    ? "One large in-figure title of 3–7 English words is allowed, but every word must come directly from the paper’s terminology and the title must not sound promotional. Do not place the full paper title, authors, or caption inside the image."
    : "Do not use a large in-figure title. Retain only necessary panel headings or step labels, and do not place the paper title, authors, or caption inside the image.";

  return `# ${spec.heading.en}

## Objective
${spec.objective.en}

Success criterion: ${spec.successCriterion.en}

## Inputs and evidence
Provide this prompt, the paper’s main \`.tex\` source, and the latest compiled \`.pdf\` in the same conversation. Read both in full: treat the \`.tex\` as authoritative for terminology, equations, symbols, and structure, and use the \`.pdf\` for context, layout, and existing figures. If a conflict would materially affect the figure, ask only the necessary question instead of guessing.

## What this figure must do
${buildList(spec.designRules.en)}

## Do not include
${buildList(spec.exclusions.en)}

## Shared visual and text constraints
- Every piece of in-figure text—including titles, module names, arrow labels, legends, abbreviations, and variable symbols—must exactly match the paper’s terminology, capitalization, hyphenation, and notation. Do not translate, paraphrase, or invent synonyms. Use only abbreviations already defined in the paper.
- In the plan, place every proposed in-figure label in quotation marks. Check uncommon method names and coined terms character by character, while displaying their normal spelling in the final image. If a label does not fit, revise the layout rather than shortening it.
- Do not invent modules, data flows, equations, metrics, experimental results, or causal relationships that are absent from the paper. Ask before visualizing anything unsupported.
- Visual style: ${style.directive.en}
- Semantic icons: ${iconRule}
- Large title: ${titleRule}
- Design for the paper’s final one- or two-column size. Keep text short and avoid paragraphs. Color must encode meaning, and important distinctions must also use shape, line style, or direct labels rather than color alone.
- Choose landscape or portrait orientation from the content and target column width. Maintain one clear reading path and avoid vertical text, crossing arrows, and meaningless whitespace.

## Workflow
1. First provide a single-figure plan in no more than six lines: the one take-home message, composition and reading order, every exact label to be used, and any evidence gap. Do not generate an image yet.
2. After I approve the plan, generate exactly this one image—no alternative design and no second image.
3. Audit terminology, spelling, structure, arrow semantics, and legibility at reduced size. If anything is wrong, correct only the affected part while preserving the rest of the approved design.

## Output
Generate one downloadable high-resolution PNG. Do not create a contact sheet or add watermarks, author information, the full paper title, or the figure caption inside the image. After the image, provide only a one-line audit result.`;
}
