import type { Language } from "../config";
import type {
  LocalizedText,
  NumberRange,
  WorkbenchCopy,
  WorkbenchControl,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../workbench/types";
import { FIGURE_COLOR_PALETTES } from "./config";
import {
  CAPTION_LENGTH_POLICY,
  buildCaptionLengthGuidance,
} from "../../content/prompts/captionLength";

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

function rangeValue(
  values: Readonly<WorkbenchValues>,
  id: string,
  fallback: NumberRange,
): NumberRange {
  const value = values[id];
  return Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === "number")
    ? [value[0], value[1]]
    : fallback;
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

const PLOT_GOALS = {
  comparison: text("方法比较", "Method comparison"),
  trend: text("趋势与收敛", "Trend or convergence"),
  distribution: text("分布与稳健性", "Distribution or robustness"),
  relationship: text("变量关系", "Variable relationship"),
  ablation: text("消融与敏感性", "Ablation or sensitivity"),
};

const DATA_STATES = {
  raw: text("逐次实验原始数据", "Run-level raw data"),
  summary: text("汇总统计与样本量", "Summary statistics and sample sizes"),
  table: text("论文表格或已有图", "Paper table or existing plot"),
};

const UNCERTAINTY_POLICIES = {
  infer: text("按实验设计判断", "Infer from the experimental design"),
  confidence: text("置信区间", "Confidence intervals"),
  variation: text("标准差或标准误", "Standard deviation or standard error"),
  none: text("不适用", "Not applicable"),
};

const STATISTICAL_LAYERS = {
  points: text("显示独立重复点", "Show independent replicate points"),
  interval: text("显示不确定性区间", "Show uncertainty intervals"),
  effect: text("报告效应量", "Report effect size"),
  test: text("显著性检验", "Significance testing"),
};

const MULTIPLICITY_POLICIES = {
  holm: text("Holm", "Holm"),
  bh: text("Benjamini–Hochberg", "Benjamini–Hochberg"),
  bonferroni: text("Bonferroni", "Bonferroni"),
  justify: text("由分析设计判断并说明", "Choose from the design and justify"),
};

const PLOT_OUTPUTS = {
  code: text("可复现绘图代码", "Reproducible plotting code"),
  pdf: text("矢量 PDF", "Vector PDF"),
  svg: text("SVG", "SVG"),
  png: text("高清 PNG", "High-resolution PNG"),
  data: text("派生数据表", "Derived data table"),
};

const PLOT_PALETTES = {
  "tol-vibrant": text("Tol 鲜明 · 蓝橙", "Tol Vibrant · blue–orange"),
  "tol-bright": text(
    "Tol 明亮 · 蓝红绿黄",
    "Tol Bright · blue–red–green–yellow",
  ),
  "tol-muted": text(
    "Tol 柔和 · 靛玫瑰青沙",
    "Tol Muted · indigo–rose–teal–sand",
  ),
  grayscale: text("灰度优先", "Grayscale-first"),
  venue: text("沿用论文现有配色", "Match the manuscript palette"),
};

const PLOT_PALETTE_COLORS: Record<string, readonly string[] | null> = {
  "tol-vibrant": FIGURE_COLOR_PALETTES["tol-vibrant"].colors,
  "tol-bright": FIGURE_COLOR_PALETTES["tol-bright"].colors,
  "tol-muted": FIGURE_COLOR_PALETTES["tol-muted"].colors,
  grayscale: ["#111111", "#666666", "#A6A6A6", "#D9D9D9"],
  venue: null,
};

const PLOT_WIDTHS = {
  single: text("单栏", "Single column"),
  double: text("双栏", "Double column"),
  auto: text("由数据密度判断", "Infer from data density"),
};

const PANEL_POLICIES = {
  single: text("单图", "Single panel"),
  facets: text("小多图", "Faceted panels"),
  auto: text("由比较任务判断", "Infer from the comparison task"),
};

export const EXPERIMENTAL_PLOTS_WORKBENCH = {
  id: "experimental-plots-workbench",
  activePage: "experimental-plots",
  copy: sharedCopy({
    zh: {
      eyebrow: "EXPERIMENTAL PLOTS",
      title: "实验绘图",
      subtitle:
        "从真实实验数据生成可复现、统计含义清楚且适合论文版面的图，而不是让生图模型画一张相似图片。",
      preset: "数据驱动 · 统计透明 · 代码可复现",
      inputTitle: "准备材料",
      inputItems: [
        "CSV / Excel / JSON 或统计结果",
        "指标定义与比较问题",
        "独立重复、随机种子与样本量",
        "目标论文模板或现有配色（可选）",
      ],
      inputHint:
        "优先提供逐次实验数据；只有汇总值时，请同时提供样本量与误差含义。",
      promptTitle: "实验绘图 Prompt",
      promptPurpose: "选择正确图型，保留统计语义，并交付可复现代码与出版级文件。",
    },
    en: {
      eyebrow: "EXPERIMENTAL PLOTS",
      title: "Experimental plots",
      subtitle:
        "Turn authentic experimental data into reproducible, statistically explicit, publication-ready plots—not look-alike generated images.",
      preset: "Data-led · statistically transparent · reproducible",
      inputTitle: "Prepare materials",
      inputItems: [
        "CSV, Excel, JSON, or statistical outputs",
        "Metric definitions and comparison question",
        "Independent runs, random seeds, and sample sizes",
        "Target template or existing palette (optional)",
      ],
      inputHint:
        "Run-level data is preferred. If only summaries exist, include sample sizes and define every error quantity.",
      promptTitle: "Experimental plotting prompt",
      promptPurpose:
        "Choose the right plot, preserve statistical meaning, and deliver reproducible code plus publication assets.",
    },
  }),
  controls: [
    {
      id: "plotGoal",
      kind: "segmented",
      label: text("分析任务", "Analysis task"),
      description: text(
        "先确定图要回答的科学问题，而不是先选图形。",
        "Start from the scientific question rather than a chart type.",
      ),
      defaultValue: "comparison",
      options: Object.entries(PLOT_GOALS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "dataState",
      kind: "select",
      label: text("可用数据", "Available data"),
      description: text(
        "数据粒度决定可以计算哪些统计量。",
        "Data granularity determines which statistics are defensible.",
      ),
      defaultValue: "raw",
      options: Object.entries(DATA_STATES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "encourageAdvancedCharts",
      kind: "toggle",
      label: text("鼓励非基础图型", "Encourage richer chart types"),
      description: text(
        "当分布、关系或不确定性需要时，允许选择比柱状图或折线图更合适的图型；不为新奇而复杂化。",
        "Allow a richer chart than bars or lines when distribution, relationships, or uncertainty require it; never add complexity for novelty.",
      ),
      defaultValue: true,
      enabledLabel: text("按数据鼓励", "Encourage when justified"),
      disabledLabel: text("优先基础图型", "Prefer basic charts"),
    },
    {
      id: "uncertainty",
      kind: "select",
      label: text("不确定性表达", "Uncertainty"),
      description: text(
        "误差条必须对应明确的重复单位和估计量。",
        "Every error bar must have a defined replicate unit and estimator.",
      ),
      defaultValue: "infer",
      options: Object.entries(UNCERTAINTY_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "statistics",
      kind: "multi",
      label: text("统计信息层", "Statistical layers"),
      description: text(
        "只展示数据真正支持的信息。",
        "Show only layers supported by the supplied data.",
      ),
      defaultValue: ["points", "interval", "effect"],
      options: Object.entries(STATISTICAL_LAYERS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "multiplicity",
      kind: "select",
      label: text("多重比较校正", "Multiplicity correction"),
      description: text(
        "存在多次显著性检验时再使用。",
        "Apply only when multiple significance tests are performed.",
      ),
      defaultValue: "holm",
      options: Object.entries(MULTIPLICITY_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => selected(values, "statistics").includes("test"),
    },
    {
      id: "allowComposite",
      kind: "toggle",
      label: text("支持组合图", "Allow composite figures"),
      description: text(
        "只在多个子图共同回答同一科学问题时组合。",
        "Combine panels only when they jointly answer one scientific question.",
      ),
      defaultValue: true,
      enabledLabel: text("允许组合", "Composite allowed"),
      disabledLabel: text("仅单图", "Single panel only"),
    },
    {
      id: "panelCount",
      kind: "range",
      label: text("子图数量", "Subpanel count"),
      description: text(
        "默认 1–3；使用最少且足以完成比较的子图。",
        "Default 1–3; use the fewest panels sufficient for the comparison.",
      ),
      defaultValue: [1, 3],
      min: 1,
      max: 8,
      step: 1,
      suffix: text("个", "panels"),
      visibleWhen: (values) => enabled(values, "allowComposite"),
    },
    {
      id: "panels",
      kind: "select",
      label: text("面板组织", "Panel structure"),
      description: text(
        "避免把尺度或语义不同的结果强塞进同一坐标系。",
        "Do not force results with different scales or semantics onto one axis.",
      ),
      defaultValue: "auto",
      options: Object.entries(PANEL_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => enabled(values, "allowComposite"),
    },
    {
      id: "width",
      kind: "segmented",
      label: text("版面宽度", "Layout width"),
      description: text(
        "按最终论文版面设计字号、线宽和图例。",
        "Size typography, lines, and legends for the final paper layout.",
      ),
      defaultValue: "auto",
      options: Object.entries(PLOT_WIDTHS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "palette",
      kind: "select",
      label: text("颜色策略", "Color strategy"),
      description: text(
        "颜色只编码稳定语义，并保证打印和常见色觉差异下可辨。",
        "Use color for stable semantics and preserve print and color-vision legibility.",
      ),
      defaultValue: "tol-vibrant",
      options: Object.entries(PLOT_PALETTES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "outputs",
      kind: "multi",
      label: text("交付文件", "Deliverables"),
      description: text(
        "代码是默认核心产物；图像文件由同一代码生成。",
        "Code is the primary artifact; every figure file must be generated from it.",
      ),
      defaultValue: ["code", "pdf", "png", "data"],
      minSelected: 1,
      options: Object.entries(PLOT_OUTPUTS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text("Caption 建议长度", "Suggested caption length"),
      description: text(
        "默认 10–40 words；为保证自包含性，必要时允许超出。",
        "Defaults to 10–40 words and may be exceeded when self-containment requires it.",
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text("words", "words"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充要求", "Additional requirements"),
      description: text(
        "例如指定指标顺序、品牌颜色或必须保留的基线。",
        "For example, metric order, an existing palette, or baselines that must remain.",
      ),
      defaultValue: "",
      placeholder: text(
        "可留空；不要在这里粘贴数据。",
        "Optional; do not paste the dataset here.",
      ),
      span: "full",
    },
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "uncertainty" && value === "none") {
      next.statistics = selected(next, "statistics").filter(
        (item) => item !== "interval" && item !== "test",
      );
    }
    if (id === "dataState" && value === "table") {
      next.statistics = selected(next, "statistics").filter(
        (item) => item !== "points" && item !== "test",
      );
    }
    if (id === "statistics") {
      const layers = selected(next, "statistics");
      if (
        (layers.includes("interval") || layers.includes("test")) &&
        scalar(next, "uncertainty") === "none"
      ) {
        next.uncertainty = "infer";
      }
    }
    if (id === "allowComposite" && value === false) {
      next.panels = "single";
    }
    if (
      id === "allowComposite" &&
      value === true &&
      scalar(current, "panels") === "single"
    ) {
      next.panels = "auto";
    }
    return next;
  },
  buildPrompt(values, language) {
    const goal = labelFor(scalar(values, "plotGoal"), PLOT_GOALS, language);
    const dataState = labelFor(
      scalar(values, "dataState"),
      DATA_STATES,
      language,
    );
    const uncertainty = labelFor(
      scalar(values, "uncertainty"),
      UNCERTAINTY_POLICIES,
      language,
    );
    const statistics =
      labelsFor(values, "statistics", STATISTICAL_LAYERS, language) ||
      (language === "zh" ? "不额外展示" : "none");
    const outputs = labelsFor(
      values,
      "outputs",
      PLOT_OUTPUTS,
      language,
    );
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange,
      ),
      language,
    );
    const multiplicity = selected(values, "statistics").includes("test")
      ? labelFor(
          scalar(values, "multiplicity"),
          MULTIPLICITY_POLICIES,
          language,
        )
      : language === "zh"
        ? "不进行显著性检验"
        : "no significance testing";
    const includesCode = selected(values, "outputs").includes("code");
    const allowComposite = enabled(values, "allowComposite");
    const [panelMin, panelMax] = rangeValue(
      values,
      "panelCount",
      [1, 3],
    );
    const paletteId = scalar(values, "palette");
    const paletteColors = PLOT_PALETTE_COLORS[paletteId];
    const palette = `${labelFor(
      paletteId,
      PLOT_PALETTES,
      language,
    )}${
      paletteColors
        ? ` (${paletteColors.join(", ")})`
        : language === "zh"
          ? "（从论文中核验并保持语义一致）"
          : " (verify from the manuscript and preserve its semantics)"
    }`;
    const panelPolicy = allowComposite
      ? language === "zh"
        ? `允许组合图，使用 ${panelMin}–${panelMax} 个子图；${labelFor(scalar(values, "panels"), PANEL_POLICIES, language)}`
        : `composite allowed with ${panelMin}–${panelMax} subpanels; ${labelFor(scalar(values, "panels"), PANEL_POLICIES, language)}`
      : language === "zh"
        ? "仅单图，不生成组合图"
        : "single panel only; do not create a composite";
    const chartPolicy = enabled(values, "encourageAdvancedCharts")
      ? language === "zh"
        ? "当数据语义确实更适合时，鼓励使用超越基础柱状图/折线图的图型，但不为新奇增加复杂度"
        : "consider richer alternatives to basic bars or lines when the data semantics justify them, without adding novelty-driven complexity"
      : language === "zh"
        ? "优先使用清楚的基础图型，除非它们会遮蔽关键分布或关系"
        : "prefer clear basic chart types unless they would hide a material distribution or relationship";

    if (language === "zh") {
      return `# 生成可复现的论文实验图

请读取我提供的数据、指标定义、实验协议与论文上下文。你是科研数据可视化与统计分析专家；本任务使用代码绘图，不使用生图模型。若当前环境可用，鼓励使用 \`$nature-figure\` 辅助图型选择、代码绘制和出版级核验；本页配置与数据证据始终优先，Skill 的默认值不得覆盖颜色、子图数量、统计语义或交付格式。若该 Skill 不可用，直接按本 Prompt 继续。

## 配置
- 分析任务：${goal}
- 数据状态：${dataState}
- 不确定性：${uncertainty}
- 统计信息：${statistics}
- 多重比较：${multiplicity}
- 图型策略：${chartPolicy}
- 面板组织：${panelPolicy}
- 版面宽度：${labelFor(scalar(values, "width"), PLOT_WIDTHS, language)}
- 颜色：${palette}
- Caption 建议：${captionGuidance}
- 交付：${outputs}
- 补充要求：${custom}

先核对列、单位、重复单位、缺失值与指标方向，再选择最能回答研究问题的图型。不得补造数据、把不独立的 seed 或样本伪装成独立重复、用双轴制造趋势，或用显著性替代效应量；应明确真正的重复单位。误差、区间和检验必须写明定义、样本量与计算方式；数据不足时保留缺口并说明不能支持的结论。

使用确定性代码生成图片，固定环境与随机性，保持方法颜色跨面板一致，并按最终栏宽检查缩小后的字号、线型、标记和图例。${includesCode ? "交付可复现脚本及运行说明；" : "代码只作为生成过程，不额外交付源文件，但需记录软件、版本和关键参数；"}只交付所选文件与所需派生数据。caption 只说明图展示什么和统计量如何计算，不越过数据作结论。`;
    }

    return `# Produce a Reproducible Experimental Plot

Read the supplied data, metric definitions, protocol, and manuscript context. Act as a scientific visualization and statistical analysis expert. This is a code-based plotting task; do not use an image-generation model. When available, use \`$nature-figure\` to support chart selection, code generation, and publication-level QA. The configuration and data evidence in this prompt take precedence: never let skill defaults override the palette, subpanel count, statistical semantics, or deliverables. If that skill is unavailable, continue directly from this prompt.

## Configuration
- Analysis task: ${goal}
- Data state: ${dataState}
- Uncertainty: ${uncertainty}
- Statistical layers: ${statistics}
- Multiplicity: ${multiplicity}
- Chart policy: ${chartPolicy}
- Panel structure: ${panelPolicy}
- Layout width: ${labelFor(scalar(values, "width"), PLOT_WIDTHS, language)}
- Color: ${palette}
- Caption guidance: ${captionGuidance}
- Deliverables: ${outputs}
- Additional requirements: ${custom}

Audit columns, units, replicate units, missing values, and metric direction before choosing the plot that best answers the research question. Never invent data, treat non-independent seeds or samples as independent replicates, manufacture trends with dual axes, or substitute significance for effect size; define the actual replicate unit. Define every error quantity, interval, test, sample size, and computation; when the data are insufficient, preserve the gap and state which inference is unsupported.

Generate the figure with deterministic code and pinned dependencies and randomness. Keep method colors stable across panels and inspect typography, line styles, markers, and legends at final publication width. ${includesCode ? "Deliver the reproducible script and run instructions; " : "Use code as the generation process without delivering source, but record software, versions, and key parameters; "}return only the selected assets and required derived data. The caption should explain what is shown and how statistics were computed without claiming more than the data support.`;
  },
} satisfies WorkbenchDefinition;

export function getDefaultExperimentalPlotValues(): WorkbenchValues {
  return Object.fromEntries(
    EXPERIMENTAL_PLOTS_WORKBENCH.controls.map((control) => [
      control.id,
      Array.isArray(control.defaultValue)
        ? [...control.defaultValue]
        : control.defaultValue,
    ]),
  );
}

export function normalizeExperimentalPlotValues(
  input: Record<string, unknown> = {},
): WorkbenchValues {
  const values = getDefaultExperimentalPlotValues();
  const controls: readonly WorkbenchControl[] =
    EXPERIMENTAL_PLOTS_WORKBENCH.controls;
  for (const control of controls) {
    const value = input[control.id];
    if (value === undefined) continue;
    if (control.kind === "toggle") {
      if (typeof value === "boolean") values[control.id] = value;
      continue;
    }
    if (control.kind === "number") {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        values[control.id] = Math.min(
          control.max,
          Math.max(control.min, numeric),
        );
      }
      continue;
    }
    if (control.kind === "range") {
      if (Array.isArray(value) && value.length === 2) {
        const left = Math.min(
          control.max,
          Math.max(control.min, Number(value[0])),
        );
        const right = Math.min(
          control.max,
          Math.max(control.min, Number(value[1])),
        );
        if (Number.isFinite(left) && Number.isFinite(right)) {
          values[control.id] = [
            Math.min(left, right),
            Math.max(left, right),
          ];
        }
      }
      continue;
    }
    if (control.kind === "multi") {
      if (Array.isArray(value)) {
        const allowed = new Set(
          control.options.map((option) => option.value),
        );
        const next = value
          .map(String)
          .filter((item) => allowed.has(item));
        if (next.length >= (control.minSelected ?? 0)) {
          values[control.id] = next;
        }
      }
      continue;
    }
    if (control.kind === "select" || control.kind === "segmented") {
      const next = String(value);
      if (control.options.some((option) => option.value === next)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "text" || control.kind === "textarea") {
      values[control.id] = String(value);
    }
  }

  if (scalar(values, "uncertainty") === "none") {
    values.statistics = selected(values, "statistics").filter(
      (item) => item !== "interval" && item !== "test",
    );
  }
  if (scalar(values, "dataState") === "table") {
    values.statistics = selected(values, "statistics").filter(
      (item) => item !== "points" && item !== "test",
    );
  }
  if (!enabled(values, "allowComposite")) {
    values.panels = "single";
  }
  return values;
}

export function buildExperimentalPlotPrompt(
  input: Record<string, unknown>,
  language: Language,
) {
  const values = normalizeExperimentalPlotValues(input);
  return EXPERIMENTAL_PLOTS_WORKBENCH.buildPrompt(values, language);
}

const TABLE_PURPOSES = {
  main: text("主结果比较", "Main comparison"),
  ablation: text("消融研究", "Ablation study"),
  efficiency: text("效率与资源", "Efficiency and resources"),
  dataset: text("数据集与统计", "Dataset and statistics"),
  setup: text("实验配置", "Experimental setup"),
};

const TABLE_INPUTS = {
  raw: text("原始结果文件", "Raw result files"),
  existing: text("已有表格", "Existing table"),
  mixed: text("原始结果 + 已有表格", "Raw results plus existing table"),
};

const METRIC_DIRECTIONS = {
  explicit: text("按我提供的方向", "Use supplied directions"),
  infer: text("由指标定义核验", "Verify from metric definitions"),
  none: text("不排名", "No ranking"),
};

const EMPHASIS_POLICIES = {
  bestSecond: text("最佳粗体、次佳下划线", "Bold best, underline second-best"),
  best: text("仅突出最佳", "Emphasize best only"),
  none: text("不突出", "No emphasis"),
};

const TABLE_WIDTHS = {
  single: text("单栏", "Single column"),
  double: text("双栏", "Double column"),
  landscape: text("横向附录页", "Landscape appendix page"),
  auto: text("由列语义判断", "Infer from column semantics"),
};

const TABLE_DENSITIES = {
  compact: text("紧凑", "Compact"),
  balanced: text("平衡", "Balanced"),
  readable: text("可读性优先", "Readability-first"),
};

const TABLE_OUTPUTS = {
  latex: text("LaTeX", "LaTeX"),
  markdown: text("Markdown 预览", "Markdown preview"),
  csv: text("核对用 CSV", "Verification CSV"),
};

export const PAPER_TABLES_WORKBENCH = {
  id: "paper-tables-workbench",
  activePage: "paper-tables",
  copy: sharedCopy({
    zh: {
      eyebrow: "PAPER TABLES",
      title: "论文表格",
      subtitle:
        "把真实结果整理为列语义清楚、排名正确且能在目标栏宽中阅读的论文表格。",
      preset: "数字忠实 · 语义清楚 · 版面可读",
      inputTitle: "准备材料",
      inputItems: [
        "原始结果或已有表格",
        "指标定义、单位与方向",
        "方法分组与比较协议",
        "目标模板或栏宽",
      ],
      inputHint:
        "请保留完整精度和实验标识；模型会在核对后决定展示精度。",
      promptTitle: "论文表格 Prompt",
      promptPurpose: "重组列与分组，但绝不为了版面或排名改动实验数字。",
    },
    en: {
      eyebrow: "PAPER TABLES",
      title: "Paper tables",
      subtitle:
        "Turn authentic results into semantically clear, correctly ranked tables that remain legible at the target width.",
      preset: "Faithful values · clear semantics · readable layout",
      inputTitle: "Prepare materials",
      inputItems: [
        "Raw results or an existing table",
        "Metric definitions, units, and directions",
        "Method groups and comparison protocol",
        "Target template or column width",
      ],
      inputHint:
        "Preserve full precision and experiment identifiers; display precision is chosen only after verification.",
      promptTitle: "Paper table prompt",
      promptPurpose:
        "Reorganize columns and groups without changing experimental values for layout or ranking.",
    },
  }),
  controls: [
    {
      id: "purpose",
      kind: "segmented",
      label: text("表格用途", "Table purpose"),
      description: text(
        "用途决定列顺序、分组与 caption 的信息重点。",
        "Purpose determines column order, grouping, and caption emphasis.",
      ),
      defaultValue: "main",
      options: Object.entries(TABLE_PURPOSES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "inputState",
      kind: "select",
      label: text("输入状态", "Input state"),
      description: text(
        "原始结果优先；已有表格需回溯数字来源。",
        "Prefer raw results; trace every existing cell to its source.",
      ),
      defaultValue: "mixed",
      options: Object.entries(TABLE_INPUTS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "metricDirection",
      kind: "select",
      label: text("指标方向", "Metric direction"),
      description: text(
        "最佳/次佳必须按每一列的真实方向计算。",
        "Best and second-best must follow the true direction of each metric.",
      ),
      defaultValue: "infer",
      options: Object.entries(METRIC_DIRECTIONS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "showUncertainty",
      kind: "toggle",
      label: text("展示不确定性", "Show uncertainty"),
      description: text(
        "仅在重复单位和误差定义可核验时展示。",
        "Show only when replicate units and error definitions are verifiable.",
      ),
      defaultValue: true,
      enabledLabel: text("均值与误差", "Mean and error"),
      disabledLabel: text("仅点估计", "Point estimates only"),
    },
    {
      id: "emphasis",
      kind: "select",
      label: text("排名强调", "Ranking emphasis"),
      description: text(
        "排名只在协议、数据集和指标可直接比较时使用。",
        "Rank only values that share a directly comparable protocol, dataset, and metric.",
      ),
      defaultValue: "bestSecond",
      options: Object.entries(EMPHASIS_POLICIES).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => scalar(values, "metricDirection") !== "none",
    },
    {
      id: "width",
      kind: "segmented",
      label: text("目标宽度", "Target width"),
      description: text(
        "优先重组信息，不使用不可读的整体缩放。",
        "Reorganize information before resorting to unreadable scaling.",
      ),
      defaultValue: "auto",
      options: Object.entries(TABLE_WIDTHS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "density",
      kind: "select",
      label: text("信息密度", "Information density"),
      description: text(
        "按正文角色平衡完整性与浏览效率。",
        "Balance completeness and scanability for the table's manuscript role.",
      ),
      defaultValue: "balanced",
      options: Object.entries(TABLE_DENSITIES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "groupMethods",
      kind: "toggle",
      label: text("方法分组", "Method grouping"),
      description: text(
        "仅按真实类别分组，例如监督信号或外部资源。",
        "Group only by meaningful categories such as supervision or external resources.",
      ),
      defaultValue: true,
      enabledLabel: text("保留语义分组", "Use semantic groups"),
      disabledLabel: text("单一列表", "Single list"),
    },
    {
      id: "outputs",
      kind: "multi",
      label: text("交付格式", "Output formats"),
      description: text(
        "LaTeX 为主，CSV 用于逐格复核。",
        "LaTeX is primary; CSV supports cell-by-cell verification.",
      ),
      defaultValue: ["latex", "markdown", "csv"],
      minSelected: 1,
      options: Object.entries(TABLE_OUTPUTS).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text("Caption 建议长度", "Suggested caption length"),
      description: text(
        "默认 10–40 words；为保证自包含性，必要时允许超出。",
        "Defaults to 10–40 words and may be exceeded when self-containment requires it.",
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text("words", "words"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充要求", "Additional requirements"),
      description: text(
        "例如固定行顺序、必须保留的列或模板禁用宏包。",
        "For example, a fixed row order, required columns, or packages forbidden by the template.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "metricDirection" && value === "none") {
      next.emphasis = "none";
    }
    if (
      id === "metricDirection" &&
      value !== "none" &&
      scalar(current, "emphasis") === "none"
    ) {
      next.emphasis = "bestSecond";
    }
    return next;
  },
  buildPrompt(values, language) {
    const purpose = labelFor(
      scalar(values, "purpose"),
      TABLE_PURPOSES,
      language,
    );
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");
    const metricDirection = scalar(values, "metricDirection");
    const emphasis =
      metricDirection === "none" ? "none" : scalar(values, "emphasis");
    const includesLatex = selected(values, "outputs").includes("latex");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange,
      ),
      language,
    );

    if (language === "zh") {
      return `# 生成忠实且可读的论文表格

请读取我提供的结果文件、现有表格、指标定义和论文上下文。你的任务是整理一张${purpose}表格，不是改写实验结果。

## 配置
- 输入：${labelFor(scalar(values, "inputState"), TABLE_INPUTS, language)}
- 指标方向：${labelFor(metricDirection, METRIC_DIRECTIONS, language)}
- 不确定性：${enabled(values, "showUncertainty") ? "展示，但必须核验误差定义与重复单位" : "只展示点估计"}
- 排名强调：${labelFor(emphasis, EMPHASIS_POLICIES, language)}
- 宽度：${labelFor(scalar(values, "width"), TABLE_WIDTHS, language)}
- 密度：${labelFor(scalar(values, "density"), TABLE_DENSITIES, language)}
- 方法分组：${enabled(values, "groupMethods") ? "按真实语义分组" : "单一列表"}
- Caption 建议：${captionGuidance}
- 交付：${labelsFor(values, "outputs", TABLE_OUTPUTS, language)}
- 补充要求：${custom}

建立逐格数据核对表，确认来源、指标方向、单位、尺度、样本量、误差含义和可比范围。不得改变数值、符号或精度来制造排名；缺失值、未运行和不适用必须区分。${metricDirection === "none" ? "本表不做方法排名或最佳值强调。" : "最佳/次佳只在同一协议内逐列计算，ties 使用一致规则。"}

用清楚的分组表头、单位与方向标记组织列。优先删去重复标签、拆分语义不同的面板或移至附录，不要靠缩小字体或压扁间距塞入栏宽。${includesLatex ? "LaTeX 应兼容目标模板，并只使用必要宏包。" : "未选择 LaTeX，不输出 LaTeX 代码或模板依赖。"}只交付所选格式、简洁 caption、逐格核对结果以及任何无法核验的单元格；caption 不重复所有数字，也不引入表中没有的 claim。`;
    }

    return `# Produce a Faithful, Readable Paper Table

Read the supplied result files, existing tables, metric definitions, and manuscript context. Create a ${purpose.toLowerCase()} table; do not rewrite the experimental record.

## Configuration
- Input: ${labelFor(scalar(values, "inputState"), TABLE_INPUTS, language)}
- Metric direction: ${labelFor(metricDirection, METRIC_DIRECTIONS, language)}
- Uncertainty: ${enabled(values, "showUncertainty") ? "show only after verifying the error definition and replicate unit" : "point estimates only"}
- Ranking emphasis: ${labelFor(emphasis, EMPHASIS_POLICIES, language)}
- Width: ${labelFor(scalar(values, "width"), TABLE_WIDTHS, language)}
- Density: ${labelFor(scalar(values, "density"), TABLE_DENSITIES, language)}
- Method grouping: ${enabled(values, "groupMethods") ? "meaningful semantic groups" : "one list"}
- Caption guidance: ${captionGuidance}
- Deliverables: ${labelsFor(values, "outputs", TABLE_OUTPUTS, language)}
- Additional requirements: ${custom}

Build a cell-level verification ledger covering source, direction, unit, scale, sample size, error meaning, and comparability. Never change values, signs, or precision to manufacture a ranking. Distinguish missing, not run, and not applicable. ${metricDirection === "none" ? "Do not rank methods or emphasize best values in this table." : "Compute best and second-best per column only within a common protocol, with a consistent tie rule."}

Use clear grouped headers, units, and direction marks. Remove duplicate labels, split semantically different panels, or move secondary detail to an appendix before shrinking typography or spacing. ${includesLatex ? "Keep LaTeX compatible with the target template and use only necessary packages." : "LaTeX is not selected, so return no LaTeX code or template dependency."} Return only the selected formats, a concise caption, cell-level checks, and every unverifiable cell. The caption should not restate all values or add unsupported claims.`;
  },
} satisfies WorkbenchDefinition;

const AUDIT_MODES = {
  audit: text("仅审计", "Audit only"),
  repair: text("审计并安全修复", "Audit and safely repair"),
};

const AUDIT_SCOPES = {
  data: text("图表与原始数据", "Figures/tables versus source data"),
  manuscript: text("正文引用与结论", "Manuscript references and claims"),
  semantics: text("术语、单位与图例", "Terms, units, and legends"),
  statistics: text("统计表达", "Statistical reporting"),
  accessibility: text("可读性与无障碍", "Legibility and accessibility"),
  layout: text("版面与浮动体", "Layout and floats"),
  provenance: text("来源与可复现性", "Provenance and reproducibility"),
};

const AUDIT_SOURCES = {
  complete: text("源数据 + 源码 + PDF", "Source data, code, and PDF"),
  manuscript: text("TeX + PDF", "TeX and PDF"),
  rendered: text("仅 PDF / 图片", "PDF or rendered assets only"),
};

const REPAIR_TARGETS = {
  source: text("修改源文件并重新生成", "Repair source and regenerate"),
  report: text("只给精确补丁建议", "Return exact patch instructions only"),
};

export const FIGURE_TABLE_AUDIT_WORKBENCH = {
  id: "figure-table-audit-workbench",
  activePage: "figure-table-audit",
  copy: sharedCopy({
    zh: {
      eyebrow: "FIGURE & TABLE AUDIT",
      title: "图表审计",
      subtitle:
        "逐项核对数据、正文、caption、统计含义和版面；安全修复时只改确定错误。",
      preset: "证据定位 · 最小修复 · 可回溯差异",
      inputTitle: "准备材料",
      inputItems: [
        "论文 TeX 与编译 PDF",
        "图表源文件与生成代码",
        "原始数据或结果表",
        "目标 venue 规则（可选）",
      ],
      inputHint:
        "材料不完整时仍可审计，但必须把“无法核验”与“确认错误”分开。",
      promptTitle: "图表审计 Prompt",
      promptPurpose: "找出真实错误与表达风险；修复不扩写、不重绘无关内容。",
    },
    en: {
      eyebrow: "FIGURE & TABLE AUDIT",
      title: "Figure and table audit",
      subtitle:
        "Cross-check data, prose, captions, statistics, and layout; in repair mode, change confirmed errors only.",
      preset: "Evidence-located · minimal repair · traceable diff",
      inputTitle: "Prepare materials",
      inputItems: [
        "Manuscript TeX and compiled PDF",
        "Figure/table sources and generation code",
        "Raw data or result sheets",
        "Target venue rules (optional)",
      ],
      inputHint:
        "Incomplete material can still be audited, but unverifiable items must remain distinct from confirmed errors.",
      promptTitle: "Figure and table audit prompt",
      promptPurpose:
        "Find real errors and communication risks without expanding or redesigning unrelated content.",
    },
  }),
  controls: [
    {
      id: "mode",
      kind: "segmented",
      label: text("执行模式", "Mode"),
      description: text(
        "安全修复严格限制修改范围。",
        "Safe repair strictly limits the change surface.",
      ),
      defaultValue: "audit",
      options: Object.entries(AUDIT_MODES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "sourceLevel",
      kind: "select",
      label: text("可用材料", "Available sources"),
      description: text(
        "决定哪些问题能被确定性核验。",
        "Determines which checks can be conclusive.",
      ),
      defaultValue: "complete",
      options: Object.entries(AUDIT_SOURCES).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      id: "scopes",
      kind: "multi",
      label: text("审计范围", "Audit scope"),
      description: text(
        "可一次完成多项，但每项独立报告证据。",
        "Audit multiple areas in one run while reporting evidence separately.",
      ),
      defaultValue: [
        "data",
        "manuscript",
        "semantics",
        "statistics",
        "accessibility",
      ],
      minSelected: 1,
      options: Object.entries(AUDIT_SCOPES).map(([value, label]) => ({
        value,
        label,
      })),
      span: "full",
    },
    {
      id: "checkOrphans",
      kind: "toggle",
      label: text("孤儿图表", "Orphaned visuals"),
      description: text(
        "检查未被正文引用、引用不存在或编号错位的图表。",
        "Check unreferenced visuals, missing targets, and numbering drift.",
      ),
      defaultValue: true,
      enabledLabel: text("检查", "Check"),
      disabledLabel: text("不检查", "Skip"),
    },
    {
      id: "venueCompliance",
      kind: "toggle",
      label: text("目标规则", "Venue compliance"),
      description: text(
        "联网核验当前官方图表、匿名与补充材料规则。",
        "Verify current official rules for visuals, anonymity, and supplements.",
      ),
      defaultValue: false,
      enabledLabel: text("联网核验", "Verify online"),
      disabledLabel: text("不核验", "Skip"),
    },
    {
      id: "venue",
      kind: "text",
      label: text("目标 venue", "Target venue"),
      description: text(
        "填写会议/期刊全称及届次。",
        "Provide the full venue name and edition.",
      ),
      defaultValue: "",
      placeholder: text("例如：NeurIPS 2026", "For example: NeurIPS 2026"),
      visibleWhen: (values) => enabled(values, "venueCompliance"),
    },
    {
      id: "repairTarget",
      kind: "select",
      label: text("修复交付", "Repair deliverable"),
      description: text(
        "优先修改可追溯源文件，不直接涂改渲染图。",
        "Prefer traceable source changes over editing rendered pixels.",
      ),
      defaultValue: "source",
      options: Object.entries(REPAIR_TARGETS).map(([value, label]) => ({
        value,
        label,
      })),
      visibleWhen: (values) => scalar(values, "mode") === "repair",
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充重点", "Additional focus"),
      description: text(
        "例如重点检查某张主结果表或某个统计定义。",
        "For example, prioritize a main-results table or a statistical definition.",
      ),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "sourceLevel" && value === "rendered") {
      next.repairTarget = "report";
    }
    return next;
  },
  buildPrompt(values, language) {
    const repair = scalar(values, "mode") === "repair";
    const sourceLevel = scalar(values, "sourceLevel");
    const requestedRepairTarget = scalar(values, "repairTarget");
    const sourceRepair =
      repair &&
      sourceLevel !== "rendered" &&
      requestedRepairTarget === "source";
    const venue = scalar(values, "venue");
    const scopes = selected(values, "scopes");
    const custom =
      scalar(values, "custom") ||
      (language === "zh" ? "无" : "None");
    const scopeInstructions = {
      zh: [
        scopes.includes("data")
          ? "核对源数据与图表中的数值、单位、方向和聚合；没有源数据时标为无法核验"
          : "",
        scopes.includes("manuscript")
          ? "核对 caption、正文引用与 claim 是否准确对应图表证据"
          : "",
        scopes.includes("semantics")
          ? "核对术语、符号、单位、图例与跨图表颜色语义"
          : "",
        scopes.includes("statistics")
          ? "核对重复单位、误差定义、样本量、检验与显著性表达"
          : "",
        scopes.includes("accessibility")
          ? "检查缩小后的字号、颜色区分、图例和常见色觉差异下可读性"
          : "",
        scopes.includes("layout")
          ? "检查栏宽、浮动体位置、分页和 caption 占用"
          : "",
        scopes.includes("provenance")
          ? "追踪生成代码、版本、输入文件与可重复生成路径"
          : "",
      ]
        .filter(Boolean)
        .join("；"),
      en: [
        scopes.includes("data")
          ? "trace values, units, direction, and aggregation from source data to visuals, marking them unverifiable when data are absent"
          : "",
        scopes.includes("manuscript")
          ? "check captions, prose references, and claims against visual evidence"
          : "",
        scopes.includes("semantics")
          ? "check terminology, symbols, units, legends, and cross-visual color semantics"
          : "",
        scopes.includes("statistics")
          ? "check replicate units, error definitions, sample sizes, tests, and significance reporting"
          : "",
        scopes.includes("accessibility")
          ? "check final-size typography, color distinctions, legends, and common color-vision differences"
          : "",
        scopes.includes("layout")
          ? "check column width, float placement, page breaks, and caption footprint"
          : "",
        scopes.includes("provenance")
          ? "trace generation code, versions, input files, and the reproducible regeneration path"
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    };
    const repairInstruction = sourceRepair
      ? {
          zh: "修改可追溯源文件并重新生成受影响图表。只改已确认错误及其直接依赖；其余文字、数字、版式、图表和代码保持不变。若正确修复必然改变科学结论、大范围结构或非局部版式，停止自动修改并把它升级为 high-risk 决策。交付逐项 diff 与验证结果。",
          en: "Repair traceable source files and regenerate affected assets. Change only confirmed errors and their direct dependencies; preserve all other prose, values, layout, visuals, and code. If a correct fix necessarily changes a scientific conclusion, broad structure, or nonlocal layout, stop automatic repair and escalate it as a high-risk decision. Return an itemized diff and validation result.",
        }
      : {
          zh: "不修改任何文件，只给定位到源文件/页码/图表编号的精确修复建议与验证步骤；仅有渲染文件时禁止涂改像素或声称已经修复。",
          en: "Modify no file. Return exact remediation and validation steps located to source file, page, and visual ID. When only rendered assets exist, do not edit pixels or claim that a repair was completed.",
        };

    if (language === "zh") {
      return `# 审计论文图表${repair ? "并安全修复" : ""}

请完整读取提供的论文、图表源文件、生成代码与数据。逐项审计：${labelsFor(values, "scopes", AUDIT_SCOPES, language)}${enabled(values, "checkOrphans") ? "，并检查孤儿图表、断裂引用和编号错位" : ""}。

- 材料层级：${labelFor(scalar(values, "sourceLevel"), AUDIT_SOURCES, language)}
- 官方规则：${enabled(values, "venueCompliance") ? `联网核验 ${venue || "用户指定 venue"} 当前官方页面，记录届次、核验日期与 URL` : "不作为本轮范围"}
- 补充重点：${custom}

把发现分为“确认错误、较高风险、改进建议、材料不足无法核验”，并为每项给出文件/页码/图表编号、证据、影响与最小处理方式。本轮只执行所选范围：${scopeInstructions.zh || "无有效范围"}。${enabled(values, "checkOrphans") ? "另检查孤儿图表、断裂引用和编号错位。" : ""}不得把审美偏好写成错误。

${repair ? repairInstruction.zh : "只输出结构化审计报告，不修改任何文件。"}

未知项保持未知，不推测缺失数据，也不虚构重新计算结果。`;
    }

    return `# Audit Paper Figures and Tables${repair ? " and Repair Them Safely" : ""}

Read the manuscript, visual sources, generation code, and data in full. Audit: ${labelsFor(values, "scopes", AUDIT_SCOPES, language)}${enabled(values, "checkOrphans") ? ", including orphaned visuals, broken references, and numbering drift" : ""}.

- Source level: ${labelFor(scalar(values, "sourceLevel"), AUDIT_SOURCES, language)}
- Official rules: ${enabled(values, "venueCompliance") ? `browse and verify the current official ${venue || "target venue"} pages, recording the edition, access date, and URLs` : "out of scope"}
- Additional focus: ${custom}

Classify every finding as confirmed error, material risk, optional improvement, or unverifiable due to missing evidence. Give the file/page/visual ID, evidence, impact, and smallest remedy. Perform only the selected scope: ${scopeInstructions.en || "no valid scope"}. ${enabled(values, "checkOrphans") ? "Also check orphaned visuals, broken references, and numbering drift." : ""} Never report an aesthetic preference as an error.

${repair ? repairInstruction.en : "Return a structured audit report only and do not modify any file."}

Keep unknowns unknown; never infer missing data or fabricate recomputed results.`;
  },
} satisfies WorkbenchDefinition;
