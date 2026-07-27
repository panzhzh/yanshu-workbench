import type { Language } from "../config";
import {
  COMMON_BASE,
  FIGURE_TYPE_ADAPTERS,
  OUTPUT_PROTOCOL,
} from "./promptArchitecture";
import { withPromptJudgmentDirective } from "../../content/prompts/promptAgency";

export type FigurePromptId =
  | "introduction"
  | "task-definition"
  | "method-overview"
  | "technical-detail"
  | "training-inference"
  | "algorithm-protocol"
  | "data-construction"
  | "system-deployment"
  | "theory-concept"
  | "geometry-coordinate"
  | "survey-taxonomy";

export type FigurePromptGroupId = "core" | "process" | "professional";

export const FIGURE_PROMPT_ORDER: FigurePromptId[] = [
  "introduction",
  "task-definition",
  "method-overview",
  "technical-detail",
  "training-inference",
  "algorithm-protocol",
  "data-construction",
  "system-deployment",
  "theory-concept",
  "geometry-coordinate",
  "survey-taxonomy",
];

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
export type FigureExecutionMode = "direct" | "prompt-first";
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
  executionMode: FigureExecutionMode;
  aspectRatioId: FigureAspectRatioId;
  customAspectWidth: number;
  customAspectHeight: number;
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
  aspectRatioId: FigureAspectRatioId;
  customAspectWidth: number;
  customAspectHeight: number;
}

export const FIGURE_TYPE_RECOMMENDATIONS = {
  introduction: {
    promptId: "introduction",
    executionMode: "direct",
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "task-definition": {
    promptId: "task-definition",
    executionMode: "direct",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "method-overview": {
    promptId: "method-overview",
    executionMode: "direct",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "technical-detail": {
    promptId: "technical-detail",
    executionMode: "direct",
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "training-inference": {
    promptId: "training-inference",
    executionMode: "direct",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "algorithm-protocol": {
    promptId: "algorithm-protocol",
    executionMode: "direct",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "data-construction": {
    promptId: "data-construction",
    executionMode: "direct",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "system-deployment": {
    promptId: "system-deployment",
    executionMode: "direct",
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "theory-concept": {
    promptId: "theory-concept",
    executionMode: "direct",
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-muted",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "geometry-coordinate": {
    promptId: "geometry-coordinate",
    executionMode: "direct",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
  "survey-taxonomy": {
    promptId: "survey-taxonomy",
    executionMode: "direct",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false,
  },
} as const satisfies Record<FigurePromptId, FigurePreferences>;

export const FIGURE_DEFAULT_LAYOUT = Object.fromEntries(
  FIGURE_PROMPT_ORDER.map((promptId) => [
    promptId,
    {
      aspectRatioId:
        FIGURE_TYPE_RECOMMENDATIONS[promptId].aspectRatioId,
    },
  ]),
) as Record<
  FigurePromptId,
  {
    aspectRatioId: FigureAspectRatioId;
  }
>;

export const DEFAULT_FIGURE_PREFERENCES: FigurePreferences = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"],
};

export const RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"],
} as const satisfies FigurePreferences;

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
      zh: "超宽方法总览首选",
      en: "Preferred for ultra-wide method overviews",
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
  intent: Record<Language, string>;
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
    intent: {
      zh: "为什么现有理解或方法不够？",
      en: "Why is the current understanding or method insufficient?",
    },
  },
  "task-definition": {
    label: {
      zh: "任务定义图",
      en: "Task definition",
    },
    purpose: {
      zh: "形式化说明研究对象、输入输出、实体关系和任务边界。",
      en: "Formalize the research objects, inputs, outputs, entity relations, and task boundary.",
    },
    intent: {
      zh: "研究任务究竟是什么？",
      en: "What exactly is the research task?",
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
    intent: {
      zh: "整体方法怎样运行？",
      en: "How does the overall method run?",
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
    intent: {
      zh: "局部核心机制怎样工作？",
      en: "How does the local core mechanism work?",
    },
  },
  "training-inference": {
    label: {
      zh: "训练–推理图",
      en: "Training–inference",
    },
    purpose: {
      zh: "区分训练专属、推理专属与共享部分，说明参数和信息在两个阶段如何流动。",
      en: "Separate training-only, inference-only, and shared elements while tracing parameters and information across both phases.",
    },
    intent: {
      zh: "方法怎样训练，又怎样推理？",
      en: "How is the method trained and then used for inference?",
    },
  },
  "algorithm-protocol": {
    label: {
      zh: "算法／协议图",
      en: "Algorithm / protocol",
    },
    purpose: {
      zh: "说明过程如何初始化、观察、决策、更新、反馈并满足停止条件。",
      en: "Show how a process initializes, observes, decides, updates, feeds back, and reaches a stopping condition.",
    },
    intent: {
      zh: "过程怎样迭代、决策与停止？",
      en: "How does the process iterate, decide, and stop?",
    },
  },
  "data-construction": {
    label: {
      zh: "数据构建图",
      en: "Data construction",
    },
    purpose: {
      zh: "呈现数据来源、清洗转换、标注协作、质量控制和最终样本结构。",
      en: "Trace data provenance, cleaning and transformation, annotation, quality control, and the final sample schema.",
    },
    intent: {
      zh: "数据从哪里来、怎样构建？",
      en: "Where does the data come from and how is it constructed?",
    },
  },
  "system-deployment": {
    label: {
      zh: "系统／部署图",
      en: "System / deployment",
    },
    purpose: {
      zh: "表达运行实体、部署边界、通信语义，以及离线准备和在线服务的分离。",
      en: "Map runtime entities, deployment boundaries, communication semantics, and the separation of offline preparation from online serving.",
    },
    intent: {
      zh: "系统在哪里运行、怎样通信？",
      en: "Where does the system run and how does it communicate?",
    },
  },
  "theory-concept": {
    label: {
      zh: "理论／概念关系图",
      en: "Theory / concept relations",
    },
    purpose: {
      zh: "准确表达形式对象之间的包含、依赖、等价、分解、约束或推导关系。",
      en: "Represent inclusion, dependency, equivalence, decomposition, constraint, or derivation among formal objects.",
    },
    intent: {
      zh: "形式对象与概念之间是什么关系？",
      en: "How are the formal objects and concepts related?",
    },
  },
  "geometry-coordinate": {
    label: {
      zh: "几何／坐标关系图",
      en: "Geometry / coordinates",
    },
    purpose: {
      zh: "准确展示坐标系、空间实体、已知与未知变换、投影关系和估计目标。",
      en: "Show coordinate frames, spatial entities, known and unknown transforms, projections, and the estimation target.",
    },
    intent: {
      zh: "空间、坐标与变换关系是什么？",
      en: "What are the spatial, coordinate, and transformation relations?",
    },
  },
  "survey-taxonomy": {
    label: {
      zh: "综述／分类体系图",
      en: "Survey / taxonomy",
    },
    purpose: {
      zh: "组织综述中的分类轴、类别关系、研究路线和由正文支持的版图空白。",
      en: "Organize survey dimensions, category relations, research paths, and evidence-backed gaps in the landscape.",
    },
    intent: {
      zh: "文献应当如何分类与关联？",
      en: "How should the literature be classified and connected?",
    },
  },
} as const satisfies Record<FigurePromptId, FigurePromptSpec>;

interface FigurePromptGroupSpec {
  label: Record<Language, string>;
  description: Record<Language, string>;
  promptIds: readonly FigurePromptId[];
}

export const FIGURE_PROMPT_GROUPS = {
  core: {
    label: {
      zh: "核心论文图",
      en: "Core paper figures",
    },
    description: {
      zh: "为什么、是什么、整体怎样运行，以及局部怎样工作",
      en: "Why, what, the overall method, and its local mechanism",
    },
    promptIds: [
      "introduction",
      "task-definition",
      "method-overview",
      "technical-detail",
    ],
  },
  process: {
    label: {
      zh: "过程与系统",
      en: "Processes & systems",
    },
    description: {
      zh: "训练、迭代、数据构建和真实运行边界",
      en: "Training, iteration, data construction, and runtime boundaries",
    },
    promptIds: [
      "training-inference",
      "algorithm-protocol",
      "data-construction",
      "system-deployment",
    ],
  },
  professional: {
    label: {
      zh: "更多专业图型",
      en: "More specialized figures",
    },
    description: {
      zh: "形式关系、空间几何与综述分类体系",
      en: "Formal relations, spatial geometry, and survey taxonomies",
    },
    promptIds: [
      "theory-concept",
      "geometry-coordinate",
      "survey-taxonomy",
    ],
  },
} as const satisfies Record<FigurePromptGroupId, FigurePromptGroupSpec>;

export const FIGURE_PROMPT_GROUP_ORDER: FigurePromptGroupId[] = [
  "core",
  "process",
  "professional",
];

export const FIGURE_COPY = {
  zh: {
    eyebrow: "RESEARCH FIGURES",
    title: "科研绘图",
    subtitle:
      "先参考同类顶会与顶刊图片，再依据论文证据生成高清科研配图。",
    preset: "同类图参考 → 论文取证 → 单图生成",
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
      "11 种图型分别保存自己的设置；首次切换载入推荐配置，手动修改后再切换不会丢失。",
    executionMode: "执行方式",
    executionDirect: "直接绘图",
    executionDirectHint:
      "默认。内部完成风格总结与英文生图 Prompt，充分推敲后生成高清图片。",
    executionPromptFirst: "先看英文 Prompt",
    executionPromptFirstHint:
      "先输出简短参考总结和英文生图 Prompt，等你输入“开始绘图”。",
    executionHint: "两种方式使用同一份图型与视觉配置。",
    intentQuestion: "这张图主要需要回答什么？",
    intentQuestionHint:
      "选择科学问题后会自动定位到最合适的图型，不会覆盖该图型已经手动修改的设置。",
    scopeBoundaryTitle: "此页负责科学示意图，不负责实验数据图",
    scopeBoundaryBody:
      "适合论文叙事、任务定义、方法机制、系统关系与分类体系。柱线散点图、消融与敏感性、ROC/PR、真实 attention 或 feature heatmap、定量与定性结果应由代码或专用实验绘图工具生成；机制图中的示意 matrix、mask 与 token heatmap 仍可使用。",
    professionalClosedHint: "展开 3 种专业图型",
    professionalOpenHint: "收起专业图型",
    canvas: "画布比例",
    aspectRatio: "画布比例",
    customRatioWidth: "比例宽度",
    customRatioHeight: "比例高度",
    customRatioCurrent: "当前比例",
    customRatioHint: "填写比例数值而非像素；系统会自动约分并写入 Prompt。",
    canvasHint:
      "画布比例是硬布局约束。方法总览默认使用超宽 2:1，仍可按 venue 模板调整。",
    recommended: "推荐",
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
    largeTitleOffHint: "所有图型的推荐设置；保留必要 panel 标题或机制名称。",
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
      "Reference comparable top-venue figures, then create a high-resolution scientific figure from the paper evidence.",
    preset: "Figure references → paper evidence → one figure",
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
      "All 11 figure types keep independent settings. Recommendations load on first use, and manual changes survive later switches.",
    executionMode: "Execution",
    executionDirect: "Draw directly",
    executionDirectHint:
      "Default. Build the reference summary and English image prompt internally, then render a high-resolution figure after careful consideration.",
    executionPromptFirst: "Review prompt first",
    executionPromptFirstHint:
      "Show a short reference summary and the English image prompt, then wait for “Start drawing”.",
    executionHint: "Both modes use the same figure-type and visual settings.",
    intentQuestion: "What does this figure mainly need to answer?",
    intentQuestionHint:
      "Choosing the scientific question locates the best-matched figure type without overwriting any settings already edited for that type.",
    scopeBoundaryTitle:
      "This page is for scientific schematics, not experimental data plots",
    scopeBoundaryBody:
      "Use it for paper narrative, task definitions, method mechanisms, system relations, and taxonomies. Bar, line, and scatter plots, ablations, sensitivity analyses, ROC/PR curves, real attention or feature heatmaps, and quantitative or qualitative results belong in code-based or dedicated experiment plotting. Schematic matrices, masks, and token heatmaps inside mechanism figures remain allowed.",
    professionalClosedHint: "Expand 3 specialized figure types",
    professionalOpenHint: "Collapse specialized figure types",
    canvas: "Canvas ratio",
    aspectRatio: "Canvas ratio",
    customRatioWidth: "Ratio width",
    customRatioHeight: "Ratio height",
    customRatioCurrent: "Current ratio",
    customRatioHint:
      "Enter ratio values, not pixels. The ratio is reduced automatically and written into the prompt.",
    canvasHint:
      "The canvas ratio is a hard layout constraint. Method Overview defaults to ultra-wide 2:1 but remains editable for the venue template.",
    recommended: "Recommended",
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
      "Recommended for every figure type; retain only necessary panel headings or mechanism names.",
    switchPromptLanguage: "Switch instruction language",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
    clipboardError:
      "Copy failed. Expand the card and select the text manually.",
  },
} as const;

function buildVisualConfiguration(
  preferences: FigurePreferences,
  language: Language,
) {
  const selectedAspectRatio = getFigureAspectRatio(preferences);
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
      ? language === "zh"
        ? "结构线以深色中性线为主，少量信息流可按语义着色"
        : "mostly dark-neutral structural lines, with semantic colors only for a few information flows"
      : language === "zh"
        ? "边框、箭头和连接线统一使用深色中性线"
        : "one dark-neutral color for borders, arrows, and connectors";
  const iconPolicy = preferences.allowLightIllustrations
    ? language === "zh"
      ? "可使用与论文对象直接相关的轻量科学图形或图标"
      : "paper-specific lightweight scientific forms or icons are allowed"
    : language === "zh"
      ? "不使用装饰图标，但可使用 matrix、token、graph 等科学表示"
      : "no decorative icons; scientific forms such as matrices, tokens, and graphs remain allowed";
  const typeHierarchy =
    preferences.fontSizeLevels === 2
      ? language === "zh"
        ? "2 级字号，比例约 1.00 : 1.30"
        : "2 type-size levels at about 1.00 : 1.30"
      : language === "zh"
        ? "3 级字号，比例约 1.00 : 1.22 : 1.50"
        : "3 type-size levels at about 1.00 : 1.22 : 1.50";
  const titlePolicy = preferences.includeLargeTitle
    ? language === "zh"
      ? "允许一个来自论文术语的简短图内标题"
      : "allow one short in-figure title drawn from the paper terminology"
    : language === "zh"
      ? "不使用图内大标题"
      : "no large in-figure title";
  const cardPolicy =
    language === "zh"
      ? cardFillPolicy.label.zh
      : cardFillPolicy.label.en;

  if (language === "zh") {
    return `视觉设置：${selectedAspectRatio} 画布，纯白背景；从 ${palette.label.zh}（${candidateColors}）中使用 ${accentRange.label} 种强调色；${linePolicy}；字体 ${fontFamily.label}，${typeHierarchy}，文字使用黑色或近黑色；容器底色采用“${cardPolicy}”；${iconPolicy}；${titlePolicy}。`;
  }

  return `Visual settings: ${selectedAspectRatio} canvas on pure white; use ${accentRange.label} accent colors from ${palette.label.en} (${candidateColors}); ${linePolicy}; ${fontFamily.label}, ${typeHierarchy}, with black or near-black text; container fill policy: ${cardPolicy}; ${iconPolicy}; ${titlePolicy}.`;
}

export function buildFigurePrompt(
  promptId: FigurePromptId,
  preferences: FigurePreferences,
  language: Language,
  options: FigurePromptBuildOptions = {},
) {
  return withPromptJudgmentDirective([
    COMMON_BASE[language](FIGURE_PROMPTS[promptId].label[language]),
    FIGURE_TYPE_ADAPTERS[promptId][language],
    buildVisualConfiguration(preferences, language),
    OUTPUT_PROTOCOL[language]({
      executionMode: preferences.executionMode,
      outputFileName: options.outputFileName,
    }),
  ].join("\n\n"), language);
}

export function buildFrameworkFigureReconstructionPrompt(
  language: Language,
  layout: FrameworkFigureLayoutPreferences = {
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
