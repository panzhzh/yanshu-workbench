import type { Language } from "../config";

export type FigureStyleId =
  | "conference-minimal"
  | "illustrated-technical";

export type FigurePromptId =
  | "introduction"
  | "method-overview"
  | "technical-detail";

export type FigurePlacementId = "single-column" | "double-column";

export type FigureAspectRatioId =
  | "landscape-4-3"
  | "portrait-3-4"
  | "landscape-16-9"
  | "portrait-9-16"
  | "custom";

export type FigureLineColorMode = "neutral" | "semantic";
export type FigureAccentColorCount = 1 | 2 | 3;
export type FigureFontSizeLevels = 2 | 3;
export type FigurePaletteId =
  | "academic-blue"
  | "blue-orange"
  | "teal-purple"
  | "warm-earth"
  | "cool-monochrome";
export type FigureFontFamilyId =
  | "times-new-roman"
  | "arial"
  | "calibri"
  | "helvetica"
  | "comic-sans";

export interface FigurePreferences {
  promptId: FigurePromptId;
  placementId: FigurePlacementId;
  aspectRatioId: FigureAspectRatioId;
  customAspectWidth: number;
  customAspectHeight: number;
  styleId: FigureStyleId;
  paletteId: FigurePaletteId;
  fontFamilyId: FigureFontFamilyId;
  lineColorMode: FigureLineColorMode;
  accentColorCount: FigureAccentColorCount;
  allowLightIllustrations: boolean;
  useCardFills: boolean;
  fontSizeLevels: FigureFontSizeLevels;
  includeLargeTitle: boolean;
}

export interface FigurePromptBuildOptions {
  accentColorMode?: "fixed" | "adaptive-2-3";
  outputFileName?: string;
}

export const FIGURE_DEFAULT_LAYOUT = {
  introduction: {
    placementId: "single-column",
    aspectRatioId: "landscape-4-3",
  },
  "method-overview": {
    placementId: "double-column",
    aspectRatioId: "landscape-16-9",
  },
  "technical-detail": {
    placementId: "single-column",
    aspectRatioId: "landscape-4-3",
  },
} as const satisfies Record<
  FigurePromptId,
  {
    placementId: FigurePlacementId;
    aspectRatioId: FigureAspectRatioId;
  }
>;

export const DEFAULT_FIGURE_PREFERENCES: FigurePreferences = {
  promptId: "introduction",
  placementId: "single-column",
  aspectRatioId: "landscape-4-3",
  customAspectWidth: 5,
  customAspectHeight: 4,
  styleId: "conference-minimal",
  paletteId: "academic-blue",
  fontFamilyId: "arial",
  lineColorMode: "neutral",
  accentColorCount: 1,
  allowLightIllustrations: false,
  useCardFills: false,
  fontSizeLevels: 2,
  includeLargeTitle: false,
};

export const RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES = {
  promptId: "method-overview",
  placementId: "double-column",
  aspectRatioId: "landscape-16-9",
  customAspectWidth: 16,
  customAspectHeight: 9,
  styleId: "conference-minimal",
  paletteId: "academic-blue",
  fontFamilyId: "arial",
  lineColorMode: "semantic",
  accentColorCount: 3,
  allowLightIllustrations: false,
  useCardFills: false,
  fontSizeLevels: 2,
  includeLargeTitle: false,
} as const satisfies FigurePreferences;

export const FIGURE_PLACEMENTS = {
  "single-column": {
    label: {
      zh: "单栏",
      en: "Single column",
    },
    shortDescription: {
      zh: "双栏论文中的一栏",
      en: "One column in a two-column paper",
    },
    directive: {
      zh: "按双栏论文中的单栏宽度设计。构图必须紧凑，缩放到最终单栏宽度后，最小文字、细线和箭头仍须清楚可辨。",
      en: "Design for the width of one column in a two-column paper. Keep the composition compact, and ensure the smallest text, thin lines, and arrows remain clear at final single-column size.",
    },
  },
  "double-column": {
    label: {
      zh: "跨双栏",
      en: "Span both columns",
    },
    shortDescription: {
      zh: "横跨双栏的通栏图",
      en: "Full-width figure across both columns",
    },
    directive: {
      zh: "按双栏论文中横跨两栏的通栏宽度设计。优先利用横向空间组织主路径，缩放到最终通栏宽度后，所有文字、细线和箭头仍须清楚可辨。",
      en: "Design for a full-width figure spanning both columns of a two-column paper. Use the horizontal space for the main reading path, and ensure all text, thin lines, and arrows remain clear at final double-column size.",
    },
  },
} as const satisfies Record<
  FigurePlacementId,
  {
    label: Record<Language, string>;
    shortDescription: Record<Language, string>;
    directive: Record<Language, string>;
  }
>;

export const FIGURE_PLACEMENT_IDS = Object.keys(
  FIGURE_PLACEMENTS,
) as FigurePlacementId[];

export const FIGURE_ASPECT_RATIOS = {
  "landscape-4-3": {
    label: {
      zh: "横版 4:3",
      en: "Landscape 4:3",
    },
    ratio: "4:3",
    shortDescription: {
      zh: "紧凑、均衡，适合引言图",
      en: "Compact and balanced; suited to introductions",
    },
    directive: {
      zh: "画布固定为横版 4:3，按这一比例从一开始组织内容，不得先生成其他比例再裁切。",
      en: "Use a fixed landscape 4:3 canvas and compose for that ratio from the start; do not generate another ratio and crop afterward.",
    },
  },
  "portrait-3-4": {
    label: {
      zh: "竖版 3:4",
      en: "Portrait 3:4",
    },
    ratio: "3:4",
    shortDescription: {
      zh: "适合纵向层级与上下关系",
      en: "Suited to vertical hierarchy and top-down relations",
    },
    directive: {
      zh: "画布固定为竖版 3:4，只在内容本身适合纵向层级或上下阅读时采用；不得旋转文字，也不得先生成其他比例再裁切。",
      en: "Use a fixed portrait 3:4 canvas only when the content naturally supports a vertical hierarchy or top-down reading path. Do not rotate text or generate another ratio and crop afterward.",
    },
  },
  "landscape-16-9": {
    label: {
      zh: "横版 16:9",
      en: "Landscape 16:9",
    },
    ratio: "16:9",
    shortDescription: {
      zh: "适合方法总览与完整横向流程",
      en: "Suited to method overviews and complete horizontal flows",
    },
    directive: {
      zh: "画布固定为横版 16:9，利用横向空间建立一条清楚主路径，减少纵向堆叠；不得先生成其他比例再裁切。",
      en: "Use a fixed landscape 16:9 canvas, using the horizontal space for one clear main path while minimizing vertical stacking. Do not generate another ratio and crop afterward.",
    },
  },
  "portrait-9-16": {
    label: {
      zh: "竖版 9:16",
      en: "Portrait 9:16",
    },
    ratio: "9:16",
    shortDescription: {
      zh: "适合较深的纵向流程，注意版面高度",
      en: "Suited to deep vertical flows; watch page height",
    },
    directive: {
      zh: "画布固定为竖版 9:16，只在较深的纵向流程确有必要时采用，并严格控制总高度和标签数量；不得旋转文字，也不得先生成其他比例再裁切。",
      en: "Use a fixed portrait 9:16 canvas only when a deep vertical flow genuinely requires it, and tightly control overall height and label count. Do not rotate text or generate another ratio and crop afterward.",
    },
  },
  custom: {
    label: {
      zh: "自定义",
      en: "Custom",
    },
    ratio: null,
    shortDescription: {
      zh: "输入任意宽高比例",
      en: "Enter any width-to-height ratio",
    },
    directive: {
      zh: "画布固定为当前设置的自定义宽高比，从一开始按该比例组织内容，不得先生成其他比例再裁切。",
      en: "Use the current custom width-to-height ratio as the fixed canvas. Compose for it from the start; do not generate another ratio and crop afterward.",
    },
  },
} as const satisfies Record<
  FigureAspectRatioId,
  {
    label: Record<Language, string>;
    ratio: string | null;
    shortDescription: Record<Language, string>;
    directive: Record<Language, string>;
  }
>;

export const FIGURE_ASPECT_RATIO_IDS = Object.keys(
  FIGURE_ASPECT_RATIOS,
) as FigureAspectRatioId[];

function greatestCommonDivisor(left: number, right: number) {
  let a = Math.max(1, Math.round(Math.abs(left)));
  let b = Math.max(1, Math.round(Math.abs(right)));

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a;
}

export function getFigureAspectRatio(preferences: FigurePreferences) {
  const presetRatio = FIGURE_ASPECT_RATIOS[preferences.aspectRatioId].ratio;
  if (presetRatio) return presetRatio;

  const width = Math.max(1, Math.round(preferences.customAspectWidth));
  const height = Math.max(1, Math.round(preferences.customAspectHeight));
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export const FIGURE_STYLES = {
  "conference-minimal": {
    label: {
      zh: "极简论文线稿",
      en: "Minimal paper linework",
    },
    shortDescription: {
      zh: "纯白底 · 细线 · 无装饰",
      en: "Pure white · thin lines · no decoration",
    },
    directive: {
      zh: "使用纯白画布、细而可印刷的结构线、矩形或轻圆角模块，以对齐、留白和清楚的信息流建立层级；不使用渐变、阴影、3D、纹理或装饰性 AI 视觉。",
      en: "Use a pure-white canvas, thin but print-safe structural lines, and rectangular or subtly rounded modules. Build hierarchy through alignment, whitespace, and clear information flow; do not use gradients, shadows, 3D, textures, or decorative AI aesthetics.",
    },
  },
  "illustrated-technical": {
    label: {
      zh: "轻插图技术图",
      en: "Light illustrated technical",
    },
    shortDescription: {
      zh: "技术图骨架 · 可用轻卡通插图",
      en: "Technical structure · light illustrative elements",
    },
    directive: {
      zh: "保持纯白画布、细结构线、明确的模块分组和一致的箭头语义；以结构化技术图为骨架，在当前视觉约束允许时加入克制的轻卡通技术插图、图标与略圆润字体，不得做成漫画、吉祥物或营销插画。",
      en: "Keep a pure-white canvas, thin structural lines, clear module grouping, and consistent arrow semantics. Use a structured technical diagram as the foundation; when allowed by the active visual controls, add restrained light-cartoon technical illustrations, icons, and subtly rounded type without becoming comic-like, mascot-driven, or promotional.",
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

export const FIGURE_STYLE_DEFAULTS = {
  "conference-minimal": {
    lineColorMode: "neutral",
    accentColorCount: 1,
    allowLightIllustrations: false,
    useCardFills: false,
    fontSizeLevels: 2,
  },
  "illustrated-technical": {
    lineColorMode: "semantic",
    accentColorCount: 2,
    allowLightIllustrations: true,
    useCardFills: true,
    fontSizeLevels: 3,
  },
} as const satisfies Record<
  FigureStyleId,
  {
    lineColorMode: FigureLineColorMode;
    accentColorCount: FigureAccentColorCount;
    allowLightIllustrations: boolean;
    useCardFills: boolean;
    fontSizeLevels: FigureFontSizeLevels;
  }
>;

export const FIGURE_COLOR_PALETTES = {
  "academic-blue": {
    label: { zh: "学术蓝", en: "Academic blue" },
    colors: ["#24495F", "#4F7D86", "#9A7444"],
  },
  "blue-orange": {
    label: { zh: "蓝橙对照", en: "Blue–orange" },
    colors: ["#2F5D8A", "#D27A35", "#6F8C73"],
  },
  "teal-purple": {
    label: { zh: "青紫结构", en: "Teal–purple" },
    colors: ["#2F7775", "#7467A2", "#AA7E42"],
  },
  "warm-earth": {
    label: { zh: "暖色大地", en: "Warm earth" },
    colors: ["#7A5541", "#B07D3C", "#456D78"],
  },
  "cool-monochrome": {
    label: { zh: "冷调单色", en: "Cool monochrome" },
    colors: ["#294B5A", "#607D88", "#91A6AE"],
  },
} as const satisfies Record<
  FigurePaletteId,
  {
    label: Record<Language, string>;
    colors: readonly [string, string, string];
  }
>;

export const FIGURE_COLOR_PALETTE_IDS = Object.keys(
  FIGURE_COLOR_PALETTES,
) as FigurePaletteId[];

export const FIGURE_FONT_FAMILIES = {
  "times-new-roman": {
    label: "Times New Roman",
    directive: {
      zh: "全图统一使用 Times New Roman，不混用其他字体。",
      en: "Use Times New Roman throughout the figure and do not mix typefaces.",
    },
  },
  arial: {
    label: "Arial",
    directive: {
      zh: "全图统一使用 Arial，不混用其他字体。",
      en: "Use Arial throughout the figure and do not mix typefaces.",
    },
  },
  calibri: {
    label: "Calibri",
    directive: {
      zh: "全图统一使用 Calibri，不混用其他字体。",
      en: "Use Calibri throughout the figure and do not mix typefaces.",
    },
  },
  helvetica: {
    label: "Helvetica",
    directive: {
      zh: "全图统一使用 Helvetica，不混用其他字体。",
      en: "Use Helvetica throughout the figure and do not mix typefaces.",
    },
  },
  "comic-sans": {
    label: "Comic Sans MS",
    directive: {
      zh: "全图统一使用 Comic Sans MS（不可用时使用 Comic Neue），只用于轻量科研漫画或示意图气质，仍须克制、清晰且易印刷，不混用其他字体。",
      en: "Use Comic Sans MS throughout the figure (Comic Neue only as a fallback) for a restrained scientific-cartoon or schematic character. Keep it clear and print-safe, and do not mix typefaces.",
    },
  },
} as const satisfies Record<
  FigureFontFamilyId,
  {
    label: string;
    directive: Record<Language, string>;
  }
>;

export const FIGURE_FONT_FAMILY_IDS = Object.keys(
  FIGURE_FONT_FAMILIES,
) as FigureFontFamilyId[];

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
        "让图的阅读顺序、箭头方向和颜色语义全局一致；输入与输出必须有清楚边界。",
      ],
      en: [
        "Use the .tex to verify formally defined inputs, outputs, major components, and interfaces. Show each major component once and express relationships through hierarchy, grouping, and arrows.",
        "Prioritize the main path needed for system-level understanding. Show branches, shared parameters, loops, cross-stage feedback, or multimodal interaction only when the paper actually depends on them.",
        "Separate training from inference only when that distinction is material to understanding the method; do not add parallel flows merely to make the figure look complex.",
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
        "若没有任何机制同时满足四项条件，直接说明证据不足并停止，不得为了完成任务而发明一张技术图。",
        "围绕这一项机制展示必要的输入或状态、操作顺序、实体间关系、中间表示与输出；每个元素都必须直接服务于机制理解。",
        "只在公式对机制不可替代且能以论文原式清晰呈现时保留一个局部公式；否则使用准确的结构与信息流表达。",
        "明确检查与方法总览的差异：总览给出系统位置与接口，本图放大局部运作；不得重新绘制整条方法流水线。",
      ],
      en: [
        "Compare candidate mechanisms and select exactly one that meets all four conditions: central to the contribution, hard to understand from prose or equations alone, clearly separable from the overview, and sufficiently supported by both the .tex and .pdf.",
        "If no mechanism meets all four conditions, state that the evidence is insufficient and stop. Do not invent a technical figure merely to complete the task.",
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
    preset: "论文取证 → 直接生成最终单图",
    reset: "恢复默认配置",
    resetHint:
      "恢复默认图型、占栏、画布比例和视觉规范；保留当前语言。",
    inputTitle: "论文材料",
    inputSource: "论文源文件",
    inputPdf: "最新编译稿",
    inputHint:
      "复制任一 Prompt 后，在同一个 GPT 对话中上传 .tex 与 .pdf；本站不读取或保存论文。",
    figureTasks: "选择绘图 Prompt",
    figureTasksHint:
      "三选一；切换图型时会载入推荐占栏和画布比例，之后仍可手动修改。",
    canvas: "论文占栏与画布",
    paperPlacement: "论文占栏",
    aspectRatio: "画布比例",
    customRatioWidth: "比例宽度",
    customRatioHeight: "比例高度",
    customRatioCurrent: "当前比例",
    customRatioHint: "填写比例数值而非像素；系统会自动约分并写入 Prompt。",
    canvasHint:
      "占栏决定图在双栏论文中的宽度；可选择常用画布或自定义宽高比。最终仍以目标 venue 模板为准。",
    recommended: "推荐",
    visualStyle: "视觉风格",
    visualStyleHint:
      "两种风格都使用纯白画布、细线和黑色文字；选择风格会载入一组推荐视觉约束，之后可以逐项修改。",
    visualRules: "视觉约束",
    visualRulesHint:
      "颜色数只计算有彩色相，不计白底、黑字和深色中性线；全图禁止浅灰文字。",
    lineColors: "线条颜色",
    lineColorsNeutral: "统一深色",
    lineColorsSemantic: "按语义区分",
    lineColorsNeutralHint: "边框、箭头与连接线统一使用深色中性线。",
    lineColorsSemanticHint:
      "仅在信息流或实体类别确需区分时使用强调色线条。",
    accentColors: "强调色数量",
    colorPalette: "色系",
    colorPaletteHint:
      "下拉选择全图强调色系；实际只使用前述数量的颜色，所有正文仍为黑色。",
    fontFamily: "全图字体",
    fontFamilyHint:
      "全图只使用一种字体；Comic Sans MS 仅适合轻量科研漫画或示意图。",
    lightIllustrations: "轻插图与图标",
    lightIllustrationsOn: "允许轻卡通",
    lightIllustrationsOff: "不使用",
    lightIllustrationsOnHint:
      "允许克制的技术插图、icon 与略圆润字体，不得漫画化。",
    lightIllustrationsOffHint: "只使用模块、线条、箭头与必要文字。",
    cardFills: "模块卡片底色",
    cardFillsOn: "允许极浅底色",
    cardFillsOff: "保持纯白",
    cardFillsOnHint: "只使用强调色的极浅低饱和填充，文字仍为黑色。",
    cardFillsOffHint: "模块不填色，仅用边框、对齐和留白分组。",
    fontSizes: "字号层级",
    fontSizesTwo: "2 级字号",
    fontSizesThree: "3 级字号",
    fontSizesTwoHint: "正文/标签与标题两级；最大字号不超过最小字号的 1.25 倍。",
    fontSizesThreeHint:
      "标签、子标题、主标题三级；最大字号不超过最小字号的 1.35 倍。",
    textContrastRule:
      "所有文字使用实黑或近黑色；不得使用浅灰、低透明度或缩小后难以辨认的文字。",
    largeTitle: "图内大标题",
    largeTitleOn: "使用大标题",
    largeTitleOff: "不使用",
    largeTitleOnHint: "仅允许一个来自论文术语的简短标题。",
    largeTitleOffHint: "推荐设置；只保留必要的 panel 标题或步骤标签。",
    promptEyebrow: "INDEPENDENT FIGURE PROMPTS",
    promptTitle: "当前绘图 Prompt",
    promptBody: "当前只显示一项完整的单图任务；切换上方图型即可替换。",
    currentPrompt: "当前图型",
    selectedCanvas: "占栏与画布",
    selectedStyle: "当前风格",
    visualSummary: "视觉约束",
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
    preset: "Read evidence → generate the final figure",
    reset: "Restore defaults",
    resetHint:
      "Restores the default figure type, placement, canvas ratio, and visual specification while keeping the current language.",
    inputTitle: "Paper materials",
    inputSource: "Paper source",
    inputPdf: "Latest compiled paper",
    inputHint:
      "After copying any prompt, upload the .tex and .pdf in the same GPT conversation. This site never reads or stores the paper.",
    figureTasks: "Select a figure prompt",
    figureTasksHint:
      "Choose one of three. Changing the figure type loads its recommended placement and canvas ratio, which you can then override.",
    canvas: "Paper placement & canvas",
    paperPlacement: "Paper placement",
    aspectRatio: "Canvas ratio",
    customRatioWidth: "Ratio width",
    customRatioHeight: "Ratio height",
    customRatioCurrent: "Current ratio",
    customRatioHint:
      "Enter ratio values, not pixels. The ratio is reduced automatically and written into the prompt.",
    canvasHint:
      "Placement controls paper width. Choose a common canvas or enter a custom width-to-height ratio. Follow the target venue template when it differs.",
    recommended: "Recommended",
    visualStyle: "Visual style",
    visualStyleHint:
      "Both styles use a pure-white canvas, thin lines, and black text. Selecting a style loads recommended visual controls that remain editable.",
    visualRules: "Visual controls",
    visualRulesHint:
      "The color count includes chromatic accents only—not the white canvas, black text, or dark neutral lines. Never use light-gray text.",
    lineColors: "Line colors",
    lineColorsNeutral: "One dark color",
    lineColorsSemantic: "Semantic colors",
    lineColorsNeutralHint:
      "Use one dark neutral color for borders, arrows, and connectors.",
    lineColorsSemanticHint:
      "Use accent-colored lines only when flows or entity types genuinely need distinction.",
    accentColors: "Accent colors",
    colorPalette: "Color palette",
    colorPaletteHint:
      "Choose the accent palette. Use only the selected number of colors; all body text remains black.",
    fontFamily: "Global typeface",
    fontFamilyHint:
      "Use one typeface throughout. Comic Sans MS is reserved for restrained scientific cartoons or schematics.",
    lightIllustrations: "Light illustrations & icons",
    lightIllustrationsOn: "Allow light-cartoon",
    lightIllustrationsOff: "Do not use",
    lightIllustrationsOnHint:
      "Allow restrained technical illustrations, icons, and subtly rounded type without becoming comic-like.",
    lightIllustrationsOffHint:
      "Use only modules, lines, arrows, and necessary text.",
    cardFills: "Module card fills",
    cardFillsOn: "Allow pale fills",
    cardFillsOff: "Keep pure white",
    cardFillsOnHint:
      "Use only very pale, muted tints derived from accent colors; keep all text black.",
    cardFillsOffHint:
      "Do not fill modules; group them with borders, alignment, and whitespace.",
    fontSizes: "Type-size levels",
    fontSizesTwo: "2 size levels",
    fontSizesThree: "3 size levels",
    fontSizesTwoHint:
      "Use body/label and heading sizes; the largest may be at most 1.25× the smallest.",
    fontSizesThreeHint:
      "Use label, subheading, and main-heading sizes; the largest may be at most 1.35× the smallest.",
    textContrastRule:
      "Use solid black or near-black for all text. Never use light-gray, low-opacity, or illegible small text.",
    largeTitle: "Large in-figure title",
    largeTitleOn: "Use a title",
    largeTitleOff: "No title",
    largeTitleOnHint:
      "Allow one short title composed only of terminology from the paper.",
    largeTitleOffHint:
      "Recommended; retain only necessary panel headings or step labels.",
    promptEyebrow: "INDEPENDENT FIGURE PROMPTS",
    promptTitle: "Current figure prompt",
    promptBody:
      "Only one complete single-figure task is shown. Change the figure type above to replace it.",
    currentPrompt: "Current figure",
    selectedCanvas: "Placement & canvas",
    selectedStyle: "Current style",
    visualSummary: "Visual controls",
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

function buildList(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildFigurePrompt(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
  language: Language,
  options: FigurePromptBuildOptions = {},
) {
  const spec = FIGURE_PROMPTS[promptId];
  const style = FIGURE_STYLES[preferences.styleId];
  const placement = FIGURE_PLACEMENTS[preferences.placementId];
  const aspectRatio = FIGURE_ASPECT_RATIOS[preferences.aspectRatioId];
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const adaptiveAccentColors =
    options.accentColorMode === "adaptive-2-3";
  const activePalette = palette.colors
    .slice(
      0,
      adaptiveAccentColors ? 3 : preferences.accentColorCount,
    )
    .join(", ");
  const outputFileRule = options.outputFileName
    ? language === "zh"
      ? `，文件名必须为 \`${options.outputFileName}\``
      : ` named \`${options.outputFileName}\``
    : "";

  if (language === "zh") {
    const lineColorRule =
      preferences.lineColorMode === "semantic"
        ? "只在不同信息流、实体类别或状态确实需要区分时，才让边框、箭头或连接线使用强调色；相同语义必须使用相同颜色，不得为了好看制造彩虹线条。"
        : "所有边框、箭头和连接线统一使用深色中性细线，不用线条颜色区分语义；需要区分时改用形状、线型或直接标签。";
    const colorRule = adaptiveAccentColors
      ? `使用“${palette.label.zh}”色系，候选强调色依次为 ${activePalette}；根据真实信息流和语义分组自行判断使用 2 种还是 3 种有彩色相，能用 2 种说清时不要使用第 3 种。这一数量不包括纯白背景、黑色文字和深色中性结构线。不得自行替换或增加颜色；任何关键区别都不能只依赖颜色。`
      : `使用“${palette.label.zh}”色系，允许的强调色依次为 ${activePalette}；全图最多使用 ${preferences.accentColorCount} 种有彩色相。这一数量不包括纯白背景、黑色文字和深色中性结构线。不得自行替换或增加颜色；任何关键区别都不能只依赖颜色。`;
    const illustrationRule = preferences.allowLightIllustrations
      ? "允许克制的轻卡通技术插图、语义 icon 和略带圆润感的无衬线字体，但它们只能表示论文中的真实对象或过程，不得代替核心机制，也不得呈现漫画、吉祥物、手写体、气泡字或营销插画效果。"
      : "不使用轻卡通插图、icon、拟物对象或装饰字体；所有关系只用模块、线条、箭头、简单几何形状和必要文字表达。";
    const cardFillRule = preferences.useCardFills
      ? "主要模块卡片允许使用取自强调色的极浅、低饱和底色；相同角色使用相同底色，文字始终为黑色，不使用渐变、阴影或深色卡片。"
      : "所有模块卡片保持纯白或透明，不设置底色；仅依靠细边框、对齐、间距和分组标题建立层级。";
    const typographyRule =
      preferences.fontSizeLevels === 2
        ? "全图严格只使用两级字号：正文/标签与标题；最大字号不得超过最小字号的 1.25 倍。不得另加微型注释、超大标题或第三种字号。"
        : "全图严格只使用三级字号：标签、子标题与主标题；最大字号不得超过最小字号的 1.35 倍。不得另加微型注释或夸张超大标题。";
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
- 生成前在内部建立精确标签清单，并逐字符核对冷门方法名或自造词；不要向我输出这份清单。若文字放不下，调整版式，不得擅自缩写。
- 不得发明论文中不存在的模块、数据流、公式、指标、实验结果或因果关系。证据不足的内容先询问，不要补全。
- 论文占栏：${placement.directive.zh}
- 画布比例：${aspectRatio.directive.zh}
- 生成前先把图像工具的比例选择器设为 ${selectedAspectRatio}；若当前界面没有该预设或比例选择器，也必须在生成指令中严格执行 ${selectedAspectRatio}（宽:高）。画布比例描述的是导出图片本身，不得在图中绘制论文栏线。
- 若目标 venue 的正式模板另有尺寸要求，以正式模板为准，但必须重新排版以保持当前占栏意图，不得直接压缩文字或线条。
- 视觉风格：${style.directive.zh}
- 线条颜色：${lineColorRule}
- 强调色：${colorRule}
- 全图字体：${fontFamily.directive.zh}
- 轻插图与图标：${illustrationRule}
- 模块卡片底色：${cardFillRule}
- 字号层级：${typographyRule}
- 所有文字统一使用实黑或近黑色；禁止浅灰色、低透明度或低对比度文字。最小一级字号在最终目标栏宽下必须清楚可读，若放不下就删减标签或重排，不能缩成小字。
- 大标题：${titleRule}
- 文字短而清晰，不写段落。严格服从所选画布比例与目标栏宽，保持一条清楚的阅读路径；避免垂直文字、交叉箭头和无意义留白。

## 直接生成
材料足够时直接生成最终图片，不先输出方案、标签清单、配色说明、备选版本，也不征求设计确认。生成时在内部逐项核对术语、拼写、结构、箭头语义和缩小后的可读性；若发现错误，只修正受影响部分，不改变其余设计。

## 输出
生成一个画布比例严格为 ${selectedAspectRatio}、可直接下载的高分辨率 PNG${outputFileRule}。不要生成联系表，不要添加水印、作者信息、论文完整标题或图片 caption。图片之后只附一行核对结果。`;
  }

  const lineColorRule =
    preferences.lineColorMode === "semantic"
      ? "Use accent-colored borders, arrows, or connectors only when different information flows, entity types, or states genuinely need distinction. Keep identical semantics in the same color and never add rainbow lines for decoration."
      : "Use one dark neutral color for all borders, arrows, and connectors. Do not distinguish meaning through line color; use shape, line style, or direct labels instead.";
  const colorRule = adaptiveAccentColors
    ? `Use the “${palette.label.en}” palette with candidate accent colors ${activePalette}, in that order. Decide from the real information flows and semantic groups whether the figure needs two or three chromatic accents; do not use the third when two communicate every distinction clearly. This count excludes the pure-white canvas, black text, and dark neutral structural lines. Do not substitute or add colors, and never rely on color alone for a critical distinction.`
    : `Use the “${palette.label.en}” palette with the allowed accent colors ${activePalette}, in that order. Use at most ${preferences.accentColorCount} chromatic accent color${preferences.accentColorCount === 1 ? "" : "s"} across the entire figure. This count excludes the pure-white canvas, black text, and dark neutral structural lines. Do not substitute or add colors, and never rely on color alone for a critical distinction.`;
  const illustrationRule = preferences.allowLightIllustrations
    ? "Restrained light-cartoon technical illustrations, semantic icons, and subtly rounded sans-serif type are allowed only when they represent real objects or processes in the paper. They must not replace the core mechanism or look comic-like, mascot-driven, handwritten, bubbly, or promotional."
    : "Do not use light-cartoon illustrations, icons, skeuomorphic objects, or decorative type. Express all relationships with modules, lines, arrows, simple geometry, and necessary text.";
  const cardFillRule = preferences.useCardFills
    ? "Major module cards may use extremely pale, muted fills derived from the accent colors. Keep identical roles in identical fills, keep all text black, and do not use gradients, shadows, or dark cards."
    : "Keep every module card pure white or transparent with no fill. Establish hierarchy only through thin borders, alignment, spacing, and group headings.";
  const typographyRule =
    preferences.fontSizeLevels === 2
      ? "Use exactly two type-size levels across the figure: body/labels and headings. The largest size must be no more than 1.25× the smallest. Do not introduce micro-annotations, an oversized title, or a third size."
      : "Use exactly three type-size levels across the figure: labels, subheadings, and main headings. The largest size must be no more than 1.35× the smallest. Do not introduce micro-annotations or an exaggerated oversized title.";
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
- Before generation, build an internal exact-label list and check uncommon method names and coined terms character by character; do not output that list. If a label does not fit, revise the layout rather than shortening it.
- Do not invent modules, data flows, equations, metrics, experimental results, or causal relationships that are absent from the paper. Ask before visualizing anything unsupported.
- Paper placement: ${placement.directive.en}
- Canvas ratio: ${aspectRatio.directive.en}
- Before generation, set the image tool’s aspect-ratio picker to ${selectedAspectRatio}. If the current interface does not offer that preset or has no ratio picker, enforce ${selectedAspectRatio} (width:height) directly in the generation instruction. The ratio describes the exported image canvas; do not draw paper column guides inside the figure.
- If the target venue’s official template specifies a different size, follow it and reflow the design while preserving the selected placement intent. Never solve the mismatch by compressing text or lines.
- Visual style: ${style.directive.en}
- Line colors: ${lineColorRule}
- Accent colors: ${colorRule}
- Global typeface: ${fontFamily.directive.en}
- Light illustrations and icons: ${illustrationRule}
- Module card fills: ${cardFillRule}
- Type-size hierarchy: ${typographyRule}
- Use solid black or near-black for every piece of text. Light-gray, low-opacity, and low-contrast text are prohibited. The smallest size must remain clearly legible at the final target column width; if content does not fit, remove labels or reflow the layout rather than shrinking the text.
- Large title: ${titleRule}
- Keep text short and avoid paragraphs. Follow the selected canvas ratio and target column width exactly. Maintain one clear reading path and avoid vertical text, crossing arrows, and meaningless whitespace.

## Generate directly
When the materials are sufficient, generate the final image immediately. Do not first output a plan, label list, palette explanation, alternative design, or confirmation request. During generation, internally audit terminology, spelling, structure, arrow semantics, and reduced-size legibility. If anything is wrong, correct only the affected part while preserving the rest of the design.

## Output
Generate one downloadable high-resolution PNG with an exact ${selectedAspectRatio} canvas${outputFileRule}. Do not create a contact sheet or add watermarks, author information, the full paper title, or the figure caption inside the image. After the image, provide only a one-line audit result.`;
}

export function buildFrameworkFigureReconstructionPrompt(
  language: Language,
) {
  return buildFigurePrompt(
    "method-overview",
    RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
    language,
    {
      accentColorMode: "adaptive-2-3",
      outputFileName:
        "<base_name>_round_4_framework_reconstruction.png",
    },
  );
}
