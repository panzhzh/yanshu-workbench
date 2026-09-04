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

function enabled(values: Readonly<WorkbenchValues>, id: string) {
  return values[id] === true;
}

function workbenchCopy(
  seed: Record<
    Language,
    Pick<
      WorkbenchCopy,
      | "eyebrow"
      | "title"
      | "subtitle"
      | "preset"
      | "inputTitle"
      | "inputItems"
      | "inputHint"
      | "promptTitle"
      | "promptPurpose"
    >
  >,
) {
  return {
    zh: {
      ...seed.zh,
      reset: "恢复默认配置",
      resetHint: "恢复 1:1 复刻推荐值。",
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
      resetHint: "Restore the recommended 1:1 reconstruction settings.",
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

function buildImageToSvgPrompt(
  values: Readonly<WorkbenchValues>,
  language: Language,
) {
  const vectorMode = scalar(values, "vectorMode") || "pure";
  const backgroundMode = scalar(values, "backgroundMode") || "preserve";
  const custom = scalar(values, "custom");

  const modeZh =
    vectorMode === "hybrid"
      ? "使用混合保真模式。只有连续色调的照片或复杂纹理区域可以作为局部位图嵌入；文字、线条、箭头、边框、图标、图表标记和规则形状必须重建为矢量，并在交付摘要中列出所有保留的位图区域。"
      : "使用纯矢量模式。SVG 中不得出现 `<image>`、Base64、外链位图、`foreignObject`、整图描摹蒙版或其他把原图直接包入 SVG 的做法；使用 SVG 原生图形、路径、文字、渐变、蒙版与滤镜重建。";
  const modeEn =
    vectorMode === "hybrid"
      ? "Use hybrid-fidelity mode. Only continuous-tone photographic or complex-texture regions may remain as local embedded rasters. Rebuild all text, lines, arrows, borders, icons, chart marks, and regular shapes as vectors, and list every retained raster region in the delivery summary."
      : "Use pure-vector mode. The SVG must contain no `<image>`, Base64 data, linked bitmap, `foreignObject`, whole-image tracing mask, or other method that merely wraps the source raster. Reconstruct it with native SVG shapes, paths, text, gradients, masks, and filters.";
  const backgroundZh =
    backgroundMode === "transparent"
      ? "移除且只移除原图的背景，使画布透明；前景对象、边缘和原始留白关系保持不变。"
      : "完整保留原图背景、画布边界与留白。";
  const backgroundEn =
    backgroundMode === "transparent"
      ? "Remove only the source background to make the canvas transparent; preserve all foreground objects, edges, and whitespace relationships."
      : "Preserve the source background, canvas boundary, and whitespace exactly.";
  const validationZh = enabled(values, "keepValidationPreview")
    ? "除 SVG 外，保留一张原图与最终回渲染结果的并排校验图；差异图可作为辅助产物。"
    : "校验用回渲染图和差异图只作内部迭代，最终不额外交付。";
  const validationEn = enabled(values, "keepValidationPreview")
    ? "In addition to the SVG, retain one side-by-side validation image of the source and final render; a difference image may be included as a supporting artifact."
    : "Use render and difference images only for internal iteration and do not retain them as deliverables.";

  if (language === "zh") {
    return `# 图片转 SVG · 1:1 视觉复刻

你是一名精确的 SVG 重建工程师。我会提供一张 PNG、JPG/JPEG、WebP、BMP 或 TIFF 图片。请将其重建为可编辑 SVG；目标是在原图像素尺寸下回渲染时，视觉上尽可能达到 1:1 一致。质量优先，不要因为耗时较长而停在粗略版本。

## 重建要求
- 先读取原始像素宽高，并以相同宽高和比例设置 SVG 的画布与 \`viewBox\`。保留裁切、留白、构图、位置、尺寸、对齐、层级和遮挡关系。
- 逐项复刻形状、边框、线宽、圆角、箭头、图标、颜色、透明度、渐变、阴影和可见纹理；不美化、不重排、不简化、不补全，也不擅自删除或新增内容。
- 准确识别全部文字，保留原文、大小写、标点和换行，不翻译、不纠错。所有文字使用可编辑的 SVG \`<text>\`，并统一声明 \`font-family="Calibri"\`；通过字号、字重、字距、锚点和基线匹配原图。若运行环境没有 Calibri，仍保留该字体声明并明确报告无法完成字体度量核验，不得静默替换或分发字体文件。
- ${modeZh}
- ${backgroundZh}
${custom ? `- 补充要求：${custom}\n` : ""}
## 校验与交付
完成初稿后，将 SVG 按原始像素尺寸回渲染，与原图进行叠加和差异检查，至少核对画布、几何边界、文字位置、线条、颜色、透明度和层级；根据差异持续迭代，直到不存在可辨认且可修正的偏差。不得以处理时间作为停止理由。

先验证 SVG/XML 可解析、无断裂引用、无意外裁切，且所有可见文字确实为 Calibri 声明。${validationZh}

最终交付一个完整、可直接打开和继续编辑的 \`.svg\` 文件，以及一段简短校验摘要。若原图分辨率不足、内容不可辨认，或所选模式无法诚实达到 1:1，请指出精确区域和原因，不要猜测或伪装成功。`;
  }

  return `# Image to SVG · 1:1 visual reconstruction

Act as a precision SVG reconstruction engineer. I will provide one PNG, JPG/JPEG, WebP, BMP, or TIFF image. Rebuild it as an editable SVG whose render at the source pixel dimensions is visually as close to 1:1 as possible. Quality takes priority; do not stop at a rough version merely because the reconstruction takes time.

## Reconstruction requirements
- Read the source pixel dimensions first and use the same width, height, aspect ratio, and matching SVG \`viewBox\`. Preserve crop, whitespace, composition, position, size, alignment, stacking, and occlusion.
- Reproduce shapes, borders, stroke widths, corner radii, arrows, icons, colors, opacity, gradients, shadows, and visible texture. Do not beautify, rearrange, simplify, complete, remove, or invent content.
- Recognize all text exactly, preserving wording, case, punctuation, and line breaks without translation or correction. Use editable SVG \`<text>\` throughout and declare \`font-family="Calibri"\`; match the source through font size, weight, letter spacing, anchors, and baselines. If Calibri is unavailable, retain the declaration and report that font-metric validation could not be completed; never silently substitute or redistribute font files.
- ${modeEn}
- ${backgroundEn}
${custom ? `- Additional requirement: ${custom}\n` : ""}
## Validation and delivery
After the first reconstruction, render the SVG at the exact source pixel dimensions and compare it with the source using overlays and visual differences. Check at least the canvas, geometric boundaries, text placement, strokes, colors, opacity, and stacking, then iterate until no visible and correctable discrepancy remains. Elapsed time is not a stopping criterion.

Validate that the SVG/XML parses, has no broken references or unintended clipping, and declares Calibri for every visible text element. ${validationEn}

Deliver one complete, directly openable and editable \`.svg\` file plus a concise validation summary. If low source resolution, illegible content, or the selected mode prevents an honest 1:1 result, identify the exact region and reason rather than guessing or claiming success.`;
}

export const IMAGE_TO_SVG_WORKBENCH = {
  id: "image-to-svg-workbench",
  activePage: "image-to-svg",
  copy: workbenchCopy({
    zh: {
      eyebrow: "IMAGE TO SVG",
      title: "图片转 SVG",
      subtitle:
        "将 PNG、JPG 等位图按原尺寸重建为可编辑 SVG，并通过回渲染差异迭代逼近 1:1 视觉一致。",
      preset: "1:1 视觉复刻 · 纯矢量 · Calibri · 回渲染校验",
      inputTitle: "准备材料",
      inputItems: ["一张清晰的原始 PNG、JPG/JPEG、WebP、BMP 或 TIFF 图片"],
      inputHint:
        "请优先提供原始分辨率文件。低清截图、压缩伪影和无法辨认的文字会限制可验证精度。",
      promptTitle: "图片转 SVG Prompt",
      promptPurpose:
        "锁定原图画布、构图与文字，生成真正可编辑并经过回渲染核验的 SVG。",
    },
    en: {
      eyebrow: "IMAGE TO SVG",
      title: "Image to SVG",
      subtitle:
        "Reconstruct a PNG, JPG, or other raster image as an editable SVG at its original dimensions, iterating against rendered differences toward 1:1 visual fidelity.",
      preset: "1:1 visual reconstruction · pure vector · Calibri · render validation",
      inputTitle: "Prepare material",
      inputItems: ["One clear source PNG, JPG/JPEG, WebP, BMP, or TIFF image"],
      inputHint:
        "Prefer the original-resolution file. Low-resolution screenshots, compression artifacts, and illegible text limit verifiable precision.",
      promptTitle: "Image-to-SVG prompt",
      promptPurpose:
        "Lock the source canvas, composition, and text, then deliver a genuinely editable, render-validated SVG.",
    },
  }),
  controls: [
    {
      id: "vectorMode",
      kind: "segmented",
      label: text("矢量策略", "Vector strategy"),
      description: text(
        "纯矢量禁止包入原图；照片或复杂纹理可按需选择混合保真。",
        "Pure vector forbids wrapping the source; hybrid fidelity is available for photographs or complex textures.",
      ),
      defaultValue: "pure",
      options: [
        {
          value: "pure",
          label: text("纯矢量", "Pure vector"),
          description: text("全部元素重新构建", "Rebuild every element"),
        },
        {
          value: "hybrid",
          label: text("混合保真", "Hybrid fidelity"),
          description: text(
            "仅照片或复杂纹理可局部嵌入",
            "Only photos or complex textures may remain raster",
          ),
        },
      ],
      span: "full",
    },
    {
      id: "backgroundMode",
      kind: "segmented",
      label: text("背景", "Background"),
      description: text(
        "默认保留原背景；透明模式只移除背景。",
        "Preserve the source by default; transparent mode removes only the background.",
      ),
      defaultValue: "preserve",
      options: [
        { value: "preserve", label: text("保留原背景", "Preserve source") },
        { value: "transparent", label: text("透明背景", "Transparent") },
      ],
      span: "full",
    },
    {
      id: "keepValidationPreview",
      kind: "toggle",
      label: text("保留校验图", "Keep validation image"),
      description: text(
        "无论是否保留，都会先回渲染校验；开启后额外交付并排对照图。",
        "Render validation always runs; enable this only to retain a side-by-side comparison.",
      ),
      defaultValue: false,
      enabledLabel: text("保留对照图", "Keep comparison"),
      disabledLabel: text("只交付 SVG", "SVG only"),
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("补充要求（可选）", "Additional requirements (optional)"),
      description: text(
        "只写确实需要覆盖默认规则的内容。",
        "Add only requirements that genuinely override a default.",
      ),
      defaultValue: "",
      placeholder: text(
        "例如：保留所有图层 ID；图标必须可单独编辑",
        "e.g. preserve all layer IDs; keep each icon independently editable",
      ),
      span: "full",
    },
  ],
  buildPrompt: buildImageToSvgPrompt,
} satisfies WorkbenchDefinition;
