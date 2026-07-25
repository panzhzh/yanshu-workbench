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
export type FigureAccentColorRangeId = "2-3" | "2-4" | "3-4";
export type FigureFontSizeLevels = 2 | 3;
export type FigurePaletteId =
  | "tol-vibrant"
  | "tol-bright"
  | "tol-muted";
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
  accentColorRangeId: FigureAccentColorRangeId;
  allowLightIllustrations: boolean;
  useCardFills: boolean;
  fontSizeLevels: FigureFontSizeLevels;
  includeLargeTitle: boolean;
}

export interface FigurePromptBuildOptions {
  outputFileName?: string;
}

export interface FrameworkFigureLayoutPreferences {
  placementId: FigurePlacementId;
  aspectRatioId: FigureAspectRatioId;
  customAspectWidth: number;
  customAspectHeight: number;
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
  promptId: "method-overview",
  placementId: "double-column",
  aspectRatioId: "landscape-16-9",
  customAspectWidth: 16,
  customAspectHeight: 9,
  styleId: "conference-minimal",
  paletteId: "tol-vibrant",
  fontFamilyId: "calibri",
  lineColorMode: "neutral",
  accentColorRangeId: "2-4",
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
  paletteId: "tol-vibrant",
  fontFamilyId: "calibri",
  lineColorMode: "semantic",
  accentColorRangeId: "2-4",
  allowLightIllustrations: true,
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
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    useCardFills: false,
    fontSizeLevels: 2,
  },
  "illustrated-technical": {
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    useCardFills: true,
    fontSizeLevels: 3,
  },
} as const satisfies Record<
  FigureStyleId,
  {
    lineColorMode: FigureLineColorMode;
    accentColorRangeId: FigureAccentColorRangeId;
    allowLightIllustrations: boolean;
    useCardFills: boolean;
    fontSizeLevels: FigureFontSizeLevels;
  }
>;

export const FIGURE_ACCENT_COLOR_RANGES = {
  "2-3": {
    min: 2,
    max: 3,
    label: "2–3",
  },
  "2-4": {
    min: 2,
    max: 4,
    label: "2–4",
  },
  "3-4": {
    min: 3,
    max: 4,
    label: "3–4",
  },
} as const satisfies Record<
  FigureAccentColorRangeId,
  {
    min: number;
    max: number;
    label: string;
  }
>;

export const FIGURE_ACCENT_COLOR_RANGE_IDS = Object.keys(
  FIGURE_ACCENT_COLOR_RANGES,
) as FigureAccentColorRangeId[];

// Paul Tol color schemes via Descanonge/tol_colors (BSD-3-Clause):
// https://github.com/Descanonge/tol_colors
export const FIGURE_COLOR_PALETTES = {
  "tol-vibrant": {
    label: { zh: "Tol 鲜明 · 蓝橙", en: "Tol Vibrant · blue–orange" },
    colors: ["#0077BB", "#EE7733", "#009988", "#CC3311"],
  },
  "tol-bright": {
    label: { zh: "Tol 明亮 · 蓝红绿黄", en: "Tol Bright · blue–red–green–yellow" },
    colors: ["#4477AA", "#EE6677", "#228833", "#CCBB44"],
  },
  "tol-muted": {
    label: { zh: "Tol 柔和 · 靛玫瑰青沙", en: "Tol Muted · indigo–rose–teal–sand" },
    colors: ["#332288", "#CC6677", "#44AA99", "#DDCC77"],
  },
} as const satisfies Record<
  FigurePaletteId,
  {
    label: Record<Language, string>;
    colors: readonly [string, string, string, string];
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
  label: Record<Language, string>;
  purpose: Record<Language, string>;
  brief: Record<Language, string>;
  rules: Record<Language, readonly string[]>;
}

export const FIGURE_PROMPTS = {
  introduction: {
    label: {
      zh: "引言图",
      en: "Introduction figure",
    },
    purpose: {
      zh: "让读者迅速理解问题为何重要、今天仍卡在哪里，以及本文带来什么核心洞察。",
      en: "Show why the problem matters, what still blocks progress today, and the paper’s core insight.",
    },
    brief: {
      zh: "本次只设计引言图：用一条清楚的视觉论证呈现研究场景、今天仍存在的关键障碍、直接后果与本文核心洞察，让读者迅速理解研究为什么重要。",
      en: "Design the Introduction figure only: use one clear visual argument to show the setting, the key obstacle that still exists today, its direct consequence, and the paper’s core insight so readers immediately understand why the research matters.",
    },
    rules: {
      zh: [
        "根据论文证据选择最自然的单一阅读路径，不机械套用固定模板；本文方法只出现到核心洞察，不展开组件、训练步骤或实现流程。",
        "把现有方法的不足写成今天仍未解决的具体矛盾，标签保持简短；默认不放实验数字，确有必要时只保留论文明确支持的极少量数字。",
        "不加入完整方法架构、公式、超参数、消融或结果榜单，不压入全部贡献，也不夸大影响或补造因果关系。",
      ],
      en: [
        "Choose the most natural single reading path supported by the paper rather than forcing a template. Show the proposed work only at the level of its core insight, without modules, training steps, or an implementation pipeline.",
        "State the limitation of current approaches as a concrete problem that still exists today and keep labels short. Omit experimental numbers by default; if indispensable, retain only a very small number explicitly supported by the paper.",
        "Do not include the full architecture, equations, hyperparameters, ablations, or a leaderboard; do not squeeze in every contribution, exaggerate impact, or invent causal relationships.",
      ],
    },
  },
  "method-overview": {
    label: {
      zh: "方法总览图",
      en: "Method overview",
    },
    purpose: {
      zh: "在读者进入方法细节前，建立输入、核心阶段、信息流与输出的整体心智地图。",
      en: "Give readers a stable mental model of inputs, major stages, information flow, and outputs before method details.",
    },
    brief: {
      zh: "本次只设计方法总览图：让读者沿一条清楚路径理解输入、主要阶段或组件、关键信息流与输出，并带着这张整体心智地图阅读 Method。",
      en: "Design the Method Overview only: give readers one clear path through the inputs, major stages or components, essential information flow, and outputs so they can read the Method with a stable system-level mental model.",
    },
    rules: {
      zh: [
        "从 TeX 中确认正式定义的输入、输出、主要组件与接口；每个组件只出现一次，用层级、分组和箭头表达关系，并清楚标出输入与输出边界。",
        "优先呈现决定整体理解的主路径；只有论文真实依赖时才显示分支、共享、循环、反馈、多模态交互或训练/推理差异。",
        "不重复引言动机，不放实验结果、性能数字、消融或研究影响；不展开每个子操作、完整公式、损失推导、超参数或代码，也不为对称虚构组件。",
      ],
      en: [
        "Use the TeX to verify formally defined inputs, outputs, major components, and interfaces. Show each component once, express relations through hierarchy, grouping, and arrows, and mark clear input and output boundaries.",
        "Prioritize the main path needed for system-level understanding. Show branches, sharing, loops, feedback, multimodal interaction, or training/inference differences only when the paper genuinely depends on them.",
        "Do not repeat the Introduction’s motivation or include results, performance numbers, ablations, or research impact. Omit every sub-operation, full equations, loss derivations, hyperparameters, and code-level details, and never invent a component for symmetry.",
      ],
    },
  },
  "technical-detail": {
    label: {
      zh: "关键技术细节图",
      en: "Key technical-detail figure",
    },
    purpose: {
      zh: "自动选择区别于总览、最需要视觉解释的一项核心机制，并只生成这一张图。",
      en: "Select the single mechanism most in need of visual explanation, distinct from the overview, and generate only that figure.",
    },
    brief: {
      zh: "本次只设计一张关键技术细节图：选择区别于方法总览、最难仅靠正文或公式理解的一项核心机制，讲清它的输入或状态、关键变换、中间表示与输出或接口。",
      en: "Design one Key Technical-Detail figure only: select a core mechanism distinct from the Method Overview that is hardest to understand from prose or equations alone, then make its input or state, key transformation, intermediate representation, and output or interface clear.",
    },
    rules: {
      zh: [
        "只选择同时属于核心贡献、难以仅靠文字理解、能与总览明确分工且有充分论文证据的一项机制；没有合适对象时说明证据不足并停止。",
        "只保留理解该机制必需的操作顺序、实体关系与状态变化；局部公式最多一个，且必须来自论文并确实不可替代。",
        "不重画完整流水线，不混入研究动机、实验结果、性能比较或第二个机制，也不使用装饰图标代替核心计算或交互。",
      ],
      en: [
        "Select exactly one mechanism that is central to the contribution, difficult to understand from prose alone, clearly separable from the overview, and fully supported by the paper. If none qualifies, state that the evidence is insufficient and stop.",
        "Keep only the operation sequence, entity relations, and state changes needed to understand that mechanism. Include at most one local equation, copied exactly from the paper, and only when indispensable.",
        "Do not redraw the full pipeline or mix in motivation, experimental results, performance comparisons, or a second mechanism. Decorative icons must never replace the core computation or interaction.",
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
    subtitle:
      "先生成一份基于论文证据的详细英文制图 Prompt；确认后再生成一张图。",
    preset: "论文取证 → 英文制图 Prompt → 确认生成",
    reset: "恢复默认配置",
    resetHint:
      "恢复默认图型、占栏、画布比例和视觉规范；保留当前语言。",
    inputTitle: "论文材料",
    inputSource: "论文源文件",
    inputPdf: "可选编译稿",
    inputHint:
      "复制当前 Prompt 后，在同一个 GPT 对话中上传可用论文材料；优先提供 .tex，可附 .pdf。本站不读取或保存论文。",
    figureTasks: "选择绘图 Prompt",
    figureTasksHint:
      "三选一，默认方法总览图；切换图型会载入推荐占栏和画布比例，之后仍可手动修改。",
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
      "强调色由 GPT 在所选区间内按语义取最少够用的数量；白底、黑字和深色中性线不计入。",
    lineColors: "线条颜色",
    lineColorsNeutral: "统一深色",
    lineColorsSemantic: "按语义区分",
    lineColorsNeutralHint: "边框、箭头与连接线统一使用深色中性线。",
    lineColorsSemanticHint:
      "深色中性线仍是默认；仅在信息流或实体类别确需区分时使用强调色线条。",
    accentColors: "强调色范围",
    colorPalette: "色系",
    colorPaletteHint:
      "三组均来自 Paul Tol 科研配色；Prompt 会写入每个候选色的 HEX 与 RGB，所有正文仍为黑色。",
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
    switchPromptLanguage: "切换说明语言",
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
      "First derive a detailed English image prompt from the paper; generate one figure only after confirmation.",
    preset: "Read evidence → English image prompt → confirm & generate",
    reset: "Restore defaults",
    resetHint:
      "Restores the default figure type, placement, canvas ratio, and visual specification while keeping the current language.",
    inputTitle: "Paper materials",
    inputSource: "Paper source",
    inputPdf: "Optional compiled paper",
    inputHint:
      "After copying the current prompt, upload the available paper materials in the same GPT conversation. Prefer the .tex and optionally attach the .pdf. This site never reads or stores the paper.",
    figureTasks: "Select a figure prompt",
    figureTasksHint:
      "Choose one of three; Method Overview is the default. Changing the figure type loads its recommended placement and canvas ratio, which you can then override.",
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
      "GPT uses the smallest sufficient number of accents within the selected range. White, black, and dark neutral lines do not count.",
    lineColors: "Line colors",
    lineColorsNeutral: "One dark color",
    lineColorsSemantic: "Semantic colors",
    lineColorsNeutralHint:
      "Use one dark neutral color for borders, arrows, and connectors.",
    lineColorsSemanticHint:
      "Dark neutral remains the default; use accent-colored lines only when flows or entity types genuinely need distinction.",
    accentColors: "Accent range",
    colorPalette: "Color palette",
    colorPaletteHint:
      "All three are Paul Tol research palettes. The prompt includes HEX and RGB references for every candidate color; all body text remains black.",
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
    switchPromptLanguage: "Switch instruction language",
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

function formatPaletteColor(hex: string) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `${hex} / RGB(${red}, ${green}, ${blue})`;
}

// The two-step semantic-analysis → image-prompt workflow is informed by
// LigphiDonk/academic-figure-generator (MIT) and independently rewritten for
// YanShu's configuration-driven figure controls:
// https://github.com/LigphiDonk/academic-figure-generator
export function buildFigurePrompt(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
  language: Language,
  options: FigurePromptBuildOptions = {},
) {
  const spec = FIGURE_PROMPTS[promptId];
  const style = FIGURE_STYLES[preferences.styleId];
  const placement = FIGURE_PLACEMENTS[preferences.placementId];
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const accentColorRange =
    FIGURE_ACCENT_COLOR_RANGES[preferences.accentColorRangeId];
  const activePalette = palette.colors
    .slice(0, accentColorRange.max)
    .map(formatPaletteColor)
    .join(", ");
  const outputFileRule = options.outputFileName
    ? language === "zh"
      ? `，文件名必须为 \`${options.outputFileName}\``
      : ` named \`${options.outputFileName}\``
    : "";

  if (language === "zh") {
    const lineColorRule =
      preferences.lineColorMode === "semantic"
        ? "边框与箭头默认使用深色中性细线，只在语义确需区分时使用强调色线；相同语义必须同色。"
        : "边框、箭头和连接线统一使用深色中性细线；需要区分时使用形状、线型或直接标签。";
    const colorRule = `候选色仅使用“${palette.label.zh}”中的 ${activePalette}，按真实语义选取 ${accentColorRange.label} 种内最少够用的颜色；白底、黑字和深色结构线不计入，关键区别不能只依赖颜色。`;
    const illustrationRule = preferences.allowLightIllustrations
      ? "可按需使用克制的轻量技术插图或语义图标，但只能表示论文中的真实对象或过程，不能代替核心机制，也不能漫画化或营销化。"
      : "不使用插图、图标或拟物对象，只用模块、线条、箭头、简单几何形状和必要文字表达关系。";
    const cardFillRule = preferences.useCardFills
      ? "主要模块可使用来自强调色的极浅低饱和底色，相同角色保持一致；文字始终为黑色。"
      : "模块保持纯白或透明，只用细边框、对齐、间距和分组标题建立层级。";
    const typographyRule =
      preferences.fontSizeLevels === 2
        ? "只使用正文/标签与标题两级字号，最大不超过最小的 1.25 倍。"
        : "只使用标签、子标题与主标题三级字号，最大不超过最小的 1.35 倍。";
    const titleRule = preferences.includeLargeTitle
      ? "可使用一个由论文原有术语组成的 3–7 词英文标题，不使用营销措辞。"
      : "不使用图内大标题，只保留必要的 panel 标题或步骤标签。";

    return `# ${spec.label.zh}

你是一名擅长从 CS 论文中提炼科学逻辑、信息流与视觉层级的学术配图专家。我会提供已完成的论文材料，通常包含主 \`.tex\`，也可能包含编译后的 \`.pdf\` 或其他附件。完整阅读可用材料；有 TeX 时以其中的正式术语、符号和结构为准，PDF 用于理解上下文与已有版面。材料冲突会影响图义时只问一个必要问题，不得猜测。

${spec.brief.zh}
${buildList(spec.rules.zh)}

图内标题、模块名、箭头标签、缩写和符号必须逐字匹配论文，保留原有大小写、连字符与记号。不得发明模块、数据流、公式、结果或因果关系；文字放不下时调整布局，不得擅自缩写。

## 视觉要求
- 按${placement.label.zh}与 ${selectedAspectRatio} 画布构图，从一开始适配该比例，不裁切、不画论文栏线；缩放到目标栏宽后仍须清楚。官方模板另有尺寸时，以模板为准并重新排版。
- ${style.directive.zh}
- ${colorRule} ${lineColorRule}
- ${fontFamily.directive.zh} ${typographyRule} 所有文字使用实黑或近黑色，不使用浅灰、低透明度或不可读小字。${titleRule}
- ${cardFillRule} ${illustrationRule}

## 两步执行

### 1. 先生成英文生图 Prompt
本轮不要生成图片。先在内部完成论文语义拆解：确定唯一主旨、命名区域、区域内部结构，以及每条连接的源、目标、方向、标签和分支/合并/反馈语义。公式、维度或微型示例只在论文明确支持且确有助益时使用；不要输出推理过程或备选方案。

只输出一个置于 \`text\` 代码块中的 \`FINAL IMAGE PROMPT\`。它必须是可独立生图的完整英文指令，写入论文中的精确内容与当前视觉设置，不使用 \`[Module A]\`、\`TBD\` 或“参考论文”等占位表达，并依次包含：

- \`GLOBAL COMPOSITION\`：唯一主旨、${selectedAspectRatio} 画布、${placement.label.zh}意图、阅读方向与区域布局。
- \`CONTENT AND REGIONS\`：各区域的位置、相对尺寸、内部内容、精确标签与视觉含义。
- \`CONNECTIONS AND ANNOTATIONS\`：逐条列明源 → 目标、箭头语义及必要的公式、维度、图例或标注。
- \`STYLE SPECIFICATION\`：完整写入本 Prompt 中已经确定的配色、线条、字体、字号、卡片、插图和可读性要求。
- \`NEGATIVE CONSTRAINTS\`：写入本图边界，并禁止补造、空框、错拼、重复模块、含糊或交叉箭头、渐变、阴影、3D、低对比文字和微型文字。

英文 Prompt 必须具体到图像模型无需猜测模块、布局、标签或箭头语义。代码块后只写：

\`详细英文制图 Prompt 已准备好。输入“开始绘图”生成这张图；如需调整，请直接说明修改项。\`

然后停止，不得在同一回复中生成图片。

### 2. 确认后生成
用户输入“开始绘图”、\`Start drawing\` 或明确同义指令后，严格使用最新英文 Prompt，只生成一张 ${selectedAspectRatio} 高分辨率 PNG${outputFileRule}，不再给方案或备选，不添加水印、作者、论文完整标题或 caption。生成后核对术语、拼写、组件、箭头、颜色和缩小可读性；有误只修正受影响部分。若用户先提出修改，则更新并重新输出完整英文 Prompt，再次等待确认。`;
  }

  const lineColorRule =
    preferences.lineColorMode === "semantic"
      ? "Use thin dark-neutral borders and arrows by default; use accent-colored lines only when semantics require them, with identical semantics in identical colors."
      : "Use one dark neutral color for borders, arrows, and connectors; distinguish meaning through shape, line style, or direct labels.";
  const colorRule = `Use only these candidate colors from “${palette.label.en}”: ${activePalette}. Select the smallest sufficient number within the ${accentColorRange.label} range according to real semantic groups. White, black, and dark structural lines do not count, and color alone must never carry a critical distinction.`;
  const illustrationRule = preferences.allowLightIllustrations
    ? "Restrained technical illustrations or semantic icons are allowed only for real objects or processes in the paper. They must not replace the mechanism or look comic-like or promotional."
    : "Do not use illustrations, icons, or skeuomorphic objects; express relations with modules, lines, arrows, simple geometry, and necessary text.";
  const cardFillRule = preferences.useCardFills
    ? "Major modules may use extremely pale muted fills derived from the accents; keep identical roles consistent and all text black."
    : "Keep modules white or transparent and establish hierarchy through thin borders, alignment, spacing, and group headings.";
  const typographyRule =
    preferences.fontSizeLevels === 2
      ? "Use exactly two sizes—body/labels and headings—with the largest no more than 1.25× the smallest."
      : "Use exactly three sizes—labels, subheadings, and main headings—with the largest no more than 1.35× the smallest.";
  const titleRule = preferences.includeLargeTitle
    ? "Allow one 3–7-word English title built only from the paper’s terminology, with no promotional wording."
    : "Do not use a large in-figure title; retain only necessary panel headings or step labels.";

  return `# ${spec.label.en}

You are an academic-figure specialist skilled at extracting scientific logic, information flow, and visual hierarchy from CS papers. I will provide a completed manuscript, usually the main \`.tex\` and sometimes a compiled \`.pdf\` or other attachments. Read all available material. When TeX is present, treat its terminology, notation, and structure as authoritative; use the PDF for context and existing layout. If a conflict would make the figure inaccurate, ask one necessary question instead of guessing.

${spec.brief.en}
${buildList(spec.rules.en)}

Every title, module name, arrow label, abbreviation, and symbol must match the paper exactly, including capitalization, hyphenation, and notation. Never invent modules, flows, equations, results, or causal claims. Reflow the layout rather than abbreviating an exact label.

## Visual requirements
- Compose for ${placement.label.en} on an exact ${selectedAspectRatio} canvas from the start; do not crop or draw paper-column guides. Everything must remain legible at the target column width. If the official venue template differs, follow it and reflow the design.
- ${style.directive.en}
- ${colorRule} ${lineColorRule}
- ${fontFamily.directive.en} ${typographyRule} Use solid black or near-black text—never light gray, low opacity, or microtext. ${titleRule}
- ${cardFillRule} ${illustrationRule}

## Two-step execution

### 1. Produce the English image prompt first
Do not generate an image in this response. Internally determine the single take-home message, named regions, each region’s meaningful internal structure, and every connection’s source, target, direction, label, and branch/merge/feedback semantics. Use equations, dimensions, or miniature examples only when explicitly supported and genuinely useful. Do not expose reasoning or alternatives.

Output only one \`FINAL IMAGE PROMPT\` inside a \`text\` code block. It must be a self-contained English generation instruction containing exact paper-derived content and the active visual settings—never placeholders such as \`[Module A]\`, \`TBD\`, or “refer to the paper.” Use these sections in order:

- \`GLOBAL COMPOSITION\`: the single thesis, ${selectedAspectRatio} canvas, ${placement.label.en} intent, reading direction, and region layout.
- \`CONTENT AND REGIONS\`: each region’s position, relative size, internal content, exact labels, and visual meaning.
- \`CONNECTIONS AND ANNOTATIONS\`: every source → target link, arrow semantics, and any necessary equation, dimension, legend, or annotation.
- \`STYLE SPECIFICATION\`: all palette, line, typeface, type-size, card, illustration, and legibility decisions fixed above.
- \`NEGATIVE CONSTRAINTS\`: the figure’s content boundaries plus no invention, empty boxes, misspellings, duplicated modules, ambiguous or crossing arrows, gradients, shadows, 3D, low-contrast text, or microtext.

Be specific enough that the image model never has to guess the modules, layout, labels, or arrow semantics. After the code block, write only:

\`The detailed English image prompt is ready. Type "Start drawing" to generate this figure, or describe any changes you want.\`

Then stop. Do not generate an image in the same response.

### 2. Generate after confirmation
After the user types \`Start drawing\`, “开始绘图,” or an unambiguous equivalent, use the latest English prompt exactly and generate one high-resolution ${selectedAspectRatio} PNG${outputFileRule}. Do not offer alternatives or add watermarks, authors, the full paper title, or a caption. Audit terminology, spelling, components, arrows, colors, and reduced-size legibility; correct only the affected part. If the user requests changes first, update and return the complete English prompt, then wait again.`;
}

export function buildFrameworkFigureReconstructionPrompt(
  language: Language,
  layout: FrameworkFigureLayoutPreferences = {
    placementId:
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.placementId,
    aspectRatioId:
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
    customAspectWidth:
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
    customAspectHeight:
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight,
  },
) {
  return buildFigurePrompt(
    "method-overview",
    {
      ...RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
      ...layout,
    },
    language,
    {
      outputFileName:
        "<base_name>_round_4_framework_reconstruction.png",
    },
  );
}
