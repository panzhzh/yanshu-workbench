import type { Language } from "../config";
import {
  COMMON_BASE,
  FIGURE_TYPE_ADAPTERS,
  OUTPUT_PROTOCOL,
} from "./promptArchitecture";

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
  | "landscape-3-2"
  | "landscape-16-9"
  | "landscape-2-1"
  | "portrait-3-4"
  | "portrait-9-16"
  | "custom";

export type FigureLineColorMode = "neutral" | "semantic";
export type FigureAccentColorRangeId = "1-2" | "2-3" | "2-4" | "3-4";
export type FigureCardFillPolicyId =
  | "white"
  | "key-regions"
  | "semantic-regions";
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
  cardFillPolicyId: FigureCardFillPolicyId;
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

export const FIGURE_TYPE_RECOMMENDATIONS = {
  introduction: {
    promptId: "introduction",
    placementId: "double-column",
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    styleId: "illustrated-technical",
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "method-overview": {
    promptId: "method-overview",
    placementId: "double-column",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    styleId: "conference-minimal",
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "2-3",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "technical-detail": {
    promptId: "technical-detail",
    placementId: "single-column",
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    styleId: "conference-minimal",
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "1-2",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
} as const satisfies Record<FigurePromptId, FigurePreferences>;

export const FIGURE_DEFAULT_LAYOUT = {
  introduction: {
    placementId: FIGURE_TYPE_RECOMMENDATIONS.introduction.placementId,
    aspectRatioId: FIGURE_TYPE_RECOMMENDATIONS.introduction.aspectRatioId,
  },
  "method-overview": {
    placementId:
      FIGURE_TYPE_RECOMMENDATIONS["method-overview"].placementId,
    aspectRatioId:
      FIGURE_TYPE_RECOMMENDATIONS["method-overview"].aspectRatioId,
  },
  "technical-detail": {
    placementId:
      FIGURE_TYPE_RECOMMENDATIONS["technical-detail"].placementId,
    aspectRatioId:
      FIGURE_TYPE_RECOMMENDATIONS["technical-detail"].aspectRatioId,
  },
} as const satisfies Record<
  FigurePromptId,
  {
    placementId: FigurePlacementId;
    aspectRatioId: FigureAspectRatioId;
  }
>;

export const DEFAULT_FIGURE_PREFERENCES: FigurePreferences = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"],
};

export const RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"],
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
  },
} as const satisfies Record<
  FigurePlacementId,
  {
    label: Record<Language, string>;
    shortDescription: Record<Language, string>;
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
      zh: "紧凑对照与局部机制",
      en: "Compact comparisons and local mechanisms",
    },
  },
  "landscape-3-2": {
    label: {
      zh: "横版 3:2",
      en: "Landscape 3:2",
    },
    ratio: "3:2",
    shortDescription: {
      zh: "平衡横向流程与机制层级",
      en: "Balances horizontal flow and mechanism depth",
    },
  },
  "landscape-16-9": {
    label: {
      zh: "横版 16:9",
      en: "Landscape 16:9",
    },
    ratio: "16:9",
    shortDescription: {
      zh: "引言叙事与横向转折",
      en: "Introduction narratives and horizontal transitions",
    },
  },
  "landscape-2-1": {
    label: {
      zh: "超宽 2:1",
      en: "Ultra-wide 2:1",
    },
    ratio: "2:1",
    shortDescription: {
      zh: "跨双栏方法总览首选",
      en: "Preferred for double-column method overviews",
    },
  },
  "portrait-3-4": {
    label: {
      zh: "竖版 3:4",
      en: "Portrait 3:4",
    },
    ratio: "3:4",
    shortDescription: {
      zh: "纵向层级与机制剖面",
      en: "Vertical hierarchy and mechanism anatomy",
    },
  },
  "portrait-9-16": {
    label: {
      zh: "竖版 9:16",
      en: "Portrait 9:16",
    },
    ratio: "9:16",
    shortDescription: {
      zh: "较深纵向流程，慎用",
      en: "Deep vertical flows; use sparingly",
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
  },
} as const satisfies Record<
  FigureAspectRatioId,
  {
    label: Record<Language, string>;
    ratio: string | null;
    shortDescription: Record<Language, string>;
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
      zh: "科学结构 · 细线 · 强留白",
      en: "Scientific structure · thin lines · strong whitespace",
    },
    compiledValue:
      "Minimal paper linework on a pure-white canvas, using thin print-safe structure, disciplined alignment, and no decorative effects",
  },
  "illustrated-technical": {
    label: {
      zh: "轻插图技术图",
      en: "Light illustrated technical",
    },
    shortDescription: {
      zh: "技术图骨架 · 论文对象科学图形",
      en: "Technical structure · paper-specific scientific forms",
    },
    compiledValue:
      "A structured technical figure that may use simplified scientific forms, examples, and scene elements directly corresponding to the paper; never character cartoons, mascots, or marketing illustration",
  },
} as const satisfies Record<
  FigureStyleId,
  {
    label: Record<Language, string>;
    shortDescription: Record<Language, string>;
    compiledValue: string;
  }
>;

export const FIGURE_STYLE_IDS = Object.keys(
  FIGURE_STYLES,
) as FigureStyleId[];

export const FIGURE_ACCENT_COLOR_RANGES = {
  "1-2": {
    min: 1,
    max: 2,
    label: "1–2",
  },
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
    label: {
      zh: "Tol 明亮 · 蓝红绿黄",
      en: "Tol Bright · blue–red–green–yellow",
    },
    colors: ["#4477AA", "#EE6677", "#228833", "#CCBB44"],
  },
  "tol-muted": {
    label: {
      zh: "Tol 柔和 · 靛玫瑰青沙",
      en: "Tol Muted · indigo–rose–teal–sand",
    },
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
  },
  arial: {
    label: "Arial",
  },
  calibri: {
    label: "Calibri",
  },
  helvetica: {
    label: "Helvetica",
  },
  "comic-sans": {
    label: "Comic Sans MS",
  },
} as const satisfies Record<
  FigureFontFamilyId,
  {
    label: string;
  }
>;

export const FIGURE_FONT_FAMILY_IDS = Object.keys(
  FIGURE_FONT_FAMILIES,
) as FigureFontFamilyId[];

export const FIGURE_CARD_FILL_POLICIES = {
  white: {
    label: {
      zh: "全部纯白",
      en: "All white",
    },
    shortDescription: {
      zh: "容器只用边框、对齐和留白分组。",
      en: "Group containers only with borders, alignment, and whitespace.",
    },
    compiledValue:
      "Keep every container card pure white; organize containers with borders, alignment, spacing, and group headings",
  },
  "key-regions": {
    label: {
      zh: "关键区域浅底",
      en: "Pale key regions",
    },
    shortDescription: {
      zh: "只为视觉焦点使用极浅语义底色。",
      en: "Use extremely pale semantic tints only at the visual focus.",
    },
    compiledValue:
      "Use extremely pale semantic tints only for key regions, intermediate states, or the core operator; keep all other container cards white",
  },
  "semantic-regions": {
    label: {
      zh: "按语义区域浅底",
      en: "Pale semantic regions",
    },
    shortDescription: {
      zh: "以极浅底色区分少量真实语义区域。",
      en: "Separate a few real semantic regions with extremely pale tints.",
    },
    compiledValue:
      "Use extremely pale tints to distinguish a small number of real semantic regions; keep identical roles consistent and ordinary containers white",
  },
} as const satisfies Record<
  FigureCardFillPolicyId,
  {
    label: Record<Language, string>;
    shortDescription: Record<Language, string>;
    compiledValue: string;
  }
>;

export const FIGURE_CARD_FILL_POLICY_IDS = Object.keys(
  FIGURE_CARD_FILL_POLICIES,
) as FigureCardFillPolicyId[];

interface FigurePromptSpec {
  label: Record<Language, string>;
  purpose: Record<Language, string>;
}

export const FIGURE_PROMPTS = {
  introduction: {
    label: {
      zh: "引言图",
      en: "Introduction figure",
    },
    purpose: {
      zh: "呈现现有理解的关键不足，以及本文带来的科学观察或解决原则。",
      en: "Show the decisive limitation in current understanding and the paper’s new observation or solution principle.",
    },
  },
  "method-overview": {
    label: {
      zh: "方法总览图",
      en: "Method overview",
    },
    purpose: {
      zh: "建立从输入、共享计算与核心阶段到正式输出的整体心智地图。",
      en: "Build a system-level map from input and shared computation through the core stages to the formal output.",
    },
  },
  "technical-detail": {
    label: {
      zh: "核心机制细节图",
      en: "Core mechanism detail",
    },
    purpose: {
      zh: "剖开展示一个最关键的新机制内部如何变换、选择、交互或更新。",
      en: "Open up one decisive new mechanism to show how it transforms, selects, interacts, or updates internally.",
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
      "先从论文证据提炼一份视觉导演级英文 Prompt；确认后再生成一张图。",
    preset: "论文取证 → 图型语义 → 视觉配置 → 确认生成",
    reset: "恢复当前图型推荐配置",
    resetHint:
      "只恢复当前图型的推荐占栏、比例与视觉设置；其他图型中已修改的设置会保留。",
    inputTitle: "论文材料",
    inputSource: "论文源文件",
    inputPdf: "可选编译稿",
    inputHint:
      "复制当前 Prompt 后，在同一个 GPT 对话中上传可用论文材料；优先提供 .tex，可附 .pdf。本站不读取或保存论文。",
    figureTasks: "选择绘图 Prompt",
    figureTasksHint:
      "三种图型分别保存自己的设置；首次切换载入推荐配置，手动修改后再切换不会丢失。",
    canvas: "论文占栏与画布",
    paperPlacement: "论文占栏",
    aspectRatio: "画布比例",
    customRatioWidth: "比例宽度",
    customRatioHeight: "比例高度",
    customRatioCurrent: "当前比例",
    customRatioHint: "填写比例数值而非像素；系统会自动约分并写入 Prompt。",
    canvasHint:
      "占栏决定最终论文尺寸，比例是硬布局约束。方法总览默认使用超宽 2:1，仍可按 venue 模板调整。",
    recommended: "推荐",
    visualStyle: "视觉风格",
    visualStyleHint:
      "视觉风格只改变渲染语言，不会重置配色、线条、卡片或其他已修改设置。",
    visualRules: "视觉约束",
    visualRulesHint:
      "颜色范围是语义预算上限，不是必须用满的任务指标；始终使用最少够用的颜色。",
    lineColors: "线条颜色",
    lineColorsNeutral: "统一深色",
    lineColorsSemantic: "按语义区分",
    lineColorsNeutralHint: "边框、箭头与连接线统一使用深色中性线。",
    lineColorsSemanticHint:
      "深色中性线仍是默认；只为少量定义清楚的信息流使用强调色线。",
    accentColors: "强调色范围",
    colorPalette: "色系",
    colorPaletteHint:
      "三组均来自 Paul Tol 科研配色；Prompt 只写 HEX 候选色，不重复 RGB。",
    fontFamily: "全图字体",
    fontFamilyHint:
      "普通标签使用所选字体；数学表达可使用兼容数学字体以保证记号正确。",
    lightIllustrations: "技术图形与图标",
    lightIllustrationsOn: "允许论文对象图形",
    lightIllustrationsOff: "不使用装饰图标",
    lightIllustrationsOnHint:
      "可使用与论文对象直接对应的简化科学图形、样例或场景；不使用人物漫画、吉祥物或营销插画。",
    lightIllustrationsOffHint:
      "仍可使用 token、matrix、mask、graph、feature map、gate 等科学表示；它们不是 icon。",
    cardFills: "容器卡片底色",
    fontSizes: "字号层级",
    fontSizesTwo: "2 级字号",
    fontSizesThree: "3 级字号",
    fontSizesTwoHint: "正文/标签与标题两级，比例为 1.00 : 1.30。",
    fontSizesThreeHint:
      "标签、子标题、主标题三级，比例为 1.00 : 1.22 : 1.50。",
    textContrastRule:
      "所有文字使用实黑或近黑色；内容超预算时删减或重排，不得缩成微型文字。",
    largeTitle: "图内大标题",
    largeTitleOn: "使用大标题",
    largeTitleOff: "不使用",
    largeTitleOnHint: "仅允许一个来自论文术语的简短标题。",
    largeTitleOffHint: "三类图的推荐设置；保留必要 panel 标题或机制名称。",
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
      "First distill a visual-director-grade English prompt from paper evidence; generate one figure only after confirmation.",
    preset: "Paper evidence → figure semantics → visual controls → confirm",
    reset: "Restore this figure’s recommendations",
    resetHint:
      "Restores only the current figure type’s recommended placement, ratio, and visual settings. Changes saved for other figure types remain intact.",
    inputTitle: "Paper materials",
    inputSource: "Paper source",
    inputPdf: "Optional compiled paper",
    inputHint:
      "After copying the current prompt, upload the available paper materials in the same GPT conversation. Prefer the .tex and optionally attach the .pdf. This site never reads or stores the paper.",
    figureTasks: "Select a figure prompt",
    figureTasksHint:
      "Each figure type keeps its own settings. Its recommendation loads on first use, and manual changes survive later switches.",
    canvas: "Paper placement & canvas",
    paperPlacement: "Paper placement",
    aspectRatio: "Canvas ratio",
    customRatioWidth: "Ratio width",
    customRatioHeight: "Ratio height",
    customRatioCurrent: "Current ratio",
    customRatioHint:
      "Enter ratio values, not pixels. The ratio is reduced automatically and written into the prompt.",
    canvasHint:
      "Placement controls final paper size, and ratio is a hard layout constraint. Method Overview defaults to ultra-wide 2:1 but remains editable for the venue template.",
    recommended: "Recommended",
    visualStyle: "Visual style",
    visualStyleHint:
      "Visual style changes rendering language only; it does not reset palette, lines, cards, or any other edited control.",
    visualRules: "Visual controls",
    visualRulesHint:
      "The color range is a maximum semantic budget, not a target. Always use the smallest sufficient number.",
    lineColors: "Line colors",
    lineColorsNeutral: "One dark color",
    lineColorsSemantic: "Semantic colors",
    lineColorsNeutralHint:
      "Use one dark neutral color for borders, arrows, and connectors.",
    lineColorsSemanticHint:
      "Dark neutral remains the default; use accent-colored lines only for a few clearly defined information streams.",
    accentColors: "Accent range",
    colorPalette: "Color palette",
    colorPaletteHint:
      "All three are Paul Tol research palettes. The prompt includes HEX candidates only and does not repeat RGB values.",
    fontFamily: "Global typeface",
    fontFamilyHint:
      "Use the selected typeface for prose labels; use a compatible mathematical typeface when needed for correct notation.",
    lightIllustrations: "Technical forms & icons",
    lightIllustrationsOn: "Allow paper-specific forms",
    lightIllustrationsOff: "No decorative icons",
    lightIllustrationsOnHint:
      "Allow simplified scientific forms, examples, or scenes directly tied to the paper; never character cartoons, mascots, or marketing illustration.",
    lightIllustrationsOffHint:
      "Token strips, matrices, masks, graphs, feature maps, and gates remain allowed scientific representations; they are not icons.",
    cardFills: "Container card fills",
    fontSizes: "Type-size levels",
    fontSizesTwo: "2 size levels",
    fontSizesThree: "3 size levels",
    fontSizesTwoHint:
      "Use body/label and heading sizes at a 1.00 : 1.30 ratio.",
    fontSizesThreeHint:
      "Use label, subheading, and main-heading sizes at 1.00 : 1.22 : 1.50.",
    textContrastRule:
      "Use solid black or near-black text. When content exceeds the budget, remove or reflow it instead of creating microtext.",
    largeTitle: "Large in-figure title",
    largeTitleOn: "Use a title",
    largeTitleOff: "No title",
    largeTitleOnHint:
      "Allow one short title composed only of terminology from the paper.",
    largeTitleOffHint:
      "Recommended for all three figure types; retain only necessary panel headings or mechanism names.",
    switchPromptLanguage: "Switch instruction language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

function buildVisualConfiguration(preferences: FigurePreferences) {
  const placement = FIGURE_PLACEMENTS[preferences.placementId];
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const style = FIGURE_STYLES[preferences.styleId];
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const accentRange =
    FIGURE_ACCENT_COLOR_RANGES[preferences.accentColorRangeId];
  const cardFillPolicy =
    FIGURE_CARD_FILL_POLICIES[preferences.cardFillPolicyId];
  const candidateColors = palette.colors
    .slice(0, accentRange.max)
    .join(", ");
  const linePolicy =
    preferences.lineColorMode === "semantic"
      ? "Dark-neutral structural lines by default; accent-colored lines only for a small number of clearly defined information streams"
      : "One dark-neutral color for borders, arrows, and connectors; distinguish semantics with shape, line style, or direct labels";
  const iconPolicy = preferences.allowLightIllustrations
    ? "Allow restrained, paper-specific scientific forms and semantic icons; no character cartoons, mascots, or promotional imagery"
    : "No decorative or pictorial icons; scientific representations such as tokens, matrices, masks, graphs, feature maps, gates, selectors, traces, and state diagrams remain allowed";
  const typeHierarchy =
    preferences.fontSizeLevels === 2
      ? "Two levels at 1.00 : 1.30 for labels/body and headings"
      : "Three levels at 1.00 : 1.22 : 1.50 for labels, subheadings, and main headings";
  const titlePolicy = preferences.includeLargeTitle
    ? "Allow one short in-figure title using only terminology from the paper"
    : "No large in-figure title; retain only necessary panel headings, stage labels, or mechanism names";

  return `# User-Selected Visual Configuration

Treat the following settings as the authoritative rendering configuration for this figure.

- Target paper placement: ${placement.label.en}
- Export aspect ratio: ${selectedAspectRatio}
- Visual style preset: ${style.compiledValue}
- Accent palette: ${palette.label.en}; candidate accents ${candidateColors}
- Preferred prose typeface: ${fontFamily.label}
- Structural line policy: ${linePolicy}
- Allowed accent-color range: ${accentRange.label}; this is a maximum semantic budget, not a target
- Technical illustrations and icons: ${iconPolicy}
- Container-card fill policy: ${cardFillPolicy.compiledValue}
- Type hierarchy: ${typeHierarchy}
- Large in-figure title: ${titlePolicy}

Interpret these settings as follows:

1. The aspect ratio is a hard layout constraint. Compose directly for this ratio and do not describe a different ratio elsewhere.

2. The allowed accent-color range is a maximum semantic budget, not a requirement to use every available color. Use the smallest sufficient number.

3. The visual style changes rendering only. It must not change the scientific modules, data flow, labels, formulas, or causal structure.

4. “No icons” forbids decorative or pictorial icons, but it does not forbid scientific visual representations such as token stacks, matrices, masks, graphs, feature maps, nested bands, gates, selectors, traces, or state diagrams.

5. “Pure-white cards” applies to container cards. It does not require every scientific object, representation band, token, matrix cell, or semantic marker to be white.

6. When pale card fills are enabled, use only extremely light semantic tints. Never use gradients, shadows, dark cards, glow, glass effects, or 3D.

7. Use the selected prose typeface for ordinary labels. Mathematical expressions may use a compatible clean mathematical typeface when necessary to preserve correct notation.

8. Structural lines should normally remain dark neutral. When semantic line differentiation is enabled, use colored lines only for a small number of clearly defined information streams; do not create rainbow arrows.

9. When a large in-figure title is disabled, retain only necessary panel headings, stage labels, or mechanism names.

10. Every label must remain legible at the selected final paper placement. Remove or reflow secondary content rather than shrinking it into microtext.`;
}

export function buildFigurePrompt(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
  language: Language,
  options: FigurePromptBuildOptions = {},
) {
  return [
    COMMON_BASE[language],
    FIGURE_TYPE_ADAPTERS[promptId][language],
    buildVisualConfiguration(preferences),
    OUTPUT_PROTOCOL[language](options.outputFileName),
  ].join("\n\n");
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
