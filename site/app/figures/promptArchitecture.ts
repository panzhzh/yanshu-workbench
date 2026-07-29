import type { Language } from "../config";
import type {
  FigureExecutionMode,
  FigurePromptId,
} from "./config";
import { EXTENDED_FIGURE_TYPE_ADAPTERS } from "./extendedFigureAdapters";

type LocalizedPromptBlock = Record<Language, string>;
type LocalizedPromptBuilder = Record<
  Language,
  (figureTypeLabel: string, hasReferenceImage: boolean) => string
>;

export const COMMON_BASE: LocalizedPromptBuilder = {
  zh: (figureTypeLabel, hasReferenceImage) => `你是一名面向计算机科学论文的科研配图专家。我会提供论文的 \`.tex\` 和可选的 \`.pdf\`。${
    hasReferenceImage
      ? "我还会另行提供参考图片或明确标注的绘图草稿。"
      : ""
  }

开始前，请联网核查与本论文主题最接近的顶会或顶刊论文，重点观察其中与本次任务相同的“${figureTypeLabel}”。用 2–4 点总结可借鉴的构图、信息层级和视觉语法；只吸收通用表达方法，不复制具体内容或品牌视觉。若当前无法联网，请明确说明，并仅依据已提供材料继续。

${hasReferenceImage ? "如有另行提供的图片，默认仅作为视觉样式参考：概括其构图、配色、线条、字体与整体视觉语言，并在与当前视觉配置兼容时借鉴；只有当我明确标注某张图片为“绘图草稿”时，才可将其内部结构作为内容线索，并仍须依据论文材料逐项核验。\n\n" : ""}完整阅读材料后再设计。以 \`.tex\` 为方法名、模块名、缩写、数学符号和结构的主要依据，以 \`.pdf\` 理解上下文和现有图表。图中术语必须与论文逐字符一致，只呈现论文证据支持的关系。

先确定这张图的唯一主旨和主要阅读路径，再选择最符合论文对象的视觉表达，例如 token、matrix、graph、feature map、state、timeline、coordinate frame 或代表性样例。不要把整张图画成文字卡片；标签使用简短英文，保证缩小到论文尺寸后仍清楚，并让画面紧凑而不过度拥挤。`,
  en: (figureTypeLabel, hasReferenceImage) => `You are a scientific-figure specialist for computer-science papers. I will provide the paper's \`.tex\` and, when available, its \`.pdf\`.${
    hasReferenceImage
      ? " I will also supply reference images or an explicitly labeled figure draft."
      : ""
  }

Before designing, browse leading conference or journal papers closest to this paper's topic and inspect figures serving the same “${figureTypeLabel}” role. Summarize 2–4 transferable observations about composition, information hierarchy, and visual grammar. Borrow only general presentation patterns, never specific content or brand styling. If browsing is unavailable, say so and continue only from the supplied materials.

${hasReferenceImage ? "Treat any separately supplied image only as a visual-style reference by default: summarize its composition, palette, line work, typography, and overall visual language, and borrow compatible elements within the current visual configuration. Only when I explicitly label an image as a “figure draft” may its internal structure be used as a content cue, and every such cue must still be verified against the paper.\n\n" : ""}Read the materials before designing. Treat the \`.tex\` as the primary source for method names, module names, abbreviations, mathematical symbols, and structure; use the \`.pdf\` for context and existing figures. Every term in the image must match the paper exactly, and every relationship must be supported by the paper.

Choose one visual thesis and one main reading path, then use visual objects that fit the paper—such as tokens, matrices, graphs, feature maps, states, timelines, coordinate frames, or representative examples. Do not reduce the figure to text boxes. Use short English labels, keep it legible at paper size, and compose a compact but uncrowded canvas.`,
};

const CORE_FIGURE_TYPE_ADAPTERS = {
  introduction: {
    zh: `本次绘制引言图：让读者直观看到研究场景、当前仍存在的关键问题，以及本文带来的新观察或解决原则。

围绕一组清楚的“现状／失败情形 → 问题本质 → 本文转变”组织画面。优先使用代表性场景或对比关系，不展开完整方法流水线，也不放实验结果。`,
    en: `Create an Introduction figure that makes the research setting, the key problem that still exists today, and the paper's new observation or solution principle immediately clear.

Organize the image around one readable “current situation or failure → underlying problem → paper's shift” story. Prefer representative scenes or a meaningful comparison. Do not expand the full method pipeline or include experimental results.`,
  },
  "method-overview": {
    zh: `本次绘制方法总览图：回答输入是什么、主要阶段或组件如何协作、信息怎样流动，以及输出是什么。

先根据论文判断它更适合 pipeline、分层架构、双流交互、迭代环、共享骨干或其他真实结构。只保留一条主要阅读路径；让入口、输出和论文中有证据支持的 novel module 成为三个清楚的视觉锚点，其中 novel module 获得最明确的视觉强调。通用组件弱化，容器嵌套不超过两层。`,
    en: `Create a Method Overview figure that answers what enters the method, how the main stages or components work together, how information moves, and what is produced.

Infer the truthful visual form from the paper: a pipeline, layered architecture, dual-stream interaction, iterative loop, shared backbone, or another real structure. Keep one main reading path with three clear anchors: entry, output, and the paper-supported novel module. Give the novel module the clearest visual emphasis, de-emphasize routine components, and keep container nesting to at most two levels.`,
  },
  "technical-detail": {
    zh: `本次绘制核心机制细节图：从论文中选择一个区别于方法总览、最值得单独解释的创新机制。

聚焦该机制的局部输入、中间表示、关键操作和局部输出。把最难仅靠一句话解释的变换或交互画清楚；只补充理解该机制所必需的公式或符号，不重复整篇方法流程。`,
    en: `Create a Core Mechanism Detail figure for the single most important novel mechanism that deserves explanation beyond the Method Overview.

Focus on its local input, intermediate representation, decisive operation, and local output. Visualize the transformation or interaction that prose alone cannot explain well. Include only the equations or symbols needed to understand this mechanism, and do not repeat the full method pipeline.`,
  },
} as const satisfies Partial<
  Record<FigurePromptId, LocalizedPromptBlock>
>;

export const FIGURE_TYPE_ADAPTERS = {
  ...CORE_FIGURE_TYPE_ADAPTERS,
  ...EXTENDED_FIGURE_TYPE_ADAPTERS,
} as const satisfies Record<FigurePromptId, LocalizedPromptBlock>;

interface OutputProtocolOptions {
  executionMode: FigureExecutionMode;
  hasReferenceImage: boolean;
  outputFileName?: string;
}

function buildDirectProtocol(
  language: Language,
  hasReferenceImage: boolean,
  outputFileName?: string,
) {
  if (language === "zh") {
    return `执行方式：直接绘图。先在内部完成同类论文图${hasReferenceImage ? "与参考图" : ""}的视觉总结，并据此形成一份详细、完整的英文生图 Prompt；科学内容只取自论文证据${hasReferenceImage ? "或明确标注且经核验的绘图草稿" : ""}。不要输出该 Prompt，也不要等待确认。请充分思考论文内容、信息层级、构图与视觉细节，再绘制一张文字清晰、细节锐利、适合论文排版的超高清科研配图。生成后核对术语、箭头方向、结构关系和缩小后的可读性。${
      outputFileName
        ? ` 最终图片保存为 \`${outputFileName}\`。`
        : ""
    }`;
  }

  return `Execution mode: draw directly. Internally summarize visual patterns from comparable papers${hasReferenceImage ? " and the supplied reference images" : ""}, then form one detailed, self-contained English image-generation prompt. Derive scientific content only from paper evidence${hasReferenceImage ? " or an explicitly labeled and verified figure draft" : ""}. Do not print that prompt or wait for confirmation. Think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then render an ultra-high-resolution scientific figure with crisp details and legible text for publication. After generation, verify terminology, arrow directions, structural relationships, and legibility at paper size.${
    outputFileName ? ` Save it as \`${outputFileName}\`.` : ""
  }`;
}

function buildPromptFirstProtocol(
  language: Language,
  hasReferenceImage: boolean,
  outputFileName?: string,
) {
  if (language === "zh") {
    return `执行方式：先看 Prompt，本轮不要生成图片。只输出两部分：

REFERENCE STYLE SUMMARY
用 2–4 点概括同类顶会或顶刊图片${hasReferenceImage ? "以及所提供参考图" : ""}中可借鉴的视觉方法。

FINAL IMAGE PROMPT
在一个 \`text\` 代码块中给出完整英文生图 Prompt，只需依次写清：图的主旨与构图、科学对象与信息流、精确标签、视觉设置。不要输出推理过程或备选方案。

然后停止，等待我输入“开始绘图”。收到后请充分思考论文内容、信息层级、构图与视觉细节，再依据这份 Prompt 绘制一张文字清晰、细节锐利、适合论文排版的超高清科研配图，并核对术语、结构、箭头和可读性。${
      outputFileName
        ? ` 最终图片保存为 \`${outputFileName}\`。`
        : ""
    }`;
  }

  return `Execution mode: prompt first. Do not generate an image in this response. Output only:

REFERENCE STYLE SUMMARY
Give 2–4 transferable observations from comparable figures in leading conference or journal papers${hasReferenceImage ? " and the supplied reference images" : ""}.

FINAL IMAGE PROMPT
Provide one complete English image-generation prompt in a \`text\` code block. Cover only the visual thesis and composition, scientific objects and flow, exact labels, and visual settings. Do not expose reasoning or alternatives.

Then stop and wait for “Start drawing” or “开始绘图”. After that instruction, think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then use this prompt to render an ultra-high-resolution scientific figure with crisp details and legible text for publication; verify terminology, structure, arrows, and legibility.${
    outputFileName ? ` Save it as \`${outputFileName}\`.` : ""
  }`;
}

export const OUTPUT_PROTOCOL = {
  zh: ({
    executionMode,
    hasReferenceImage,
    outputFileName,
  }: OutputProtocolOptions) =>
    executionMode === "direct"
      ? buildDirectProtocol("zh", hasReferenceImage, outputFileName)
      : buildPromptFirstProtocol("zh", hasReferenceImage, outputFileName),
  en: ({
    executionMode,
    hasReferenceImage,
    outputFileName,
  }: OutputProtocolOptions) =>
    executionMode === "direct"
      ? buildDirectProtocol("en", hasReferenceImage, outputFileName)
      : buildPromptFirstProtocol("en", hasReferenceImage, outputFileName),
} as const;
