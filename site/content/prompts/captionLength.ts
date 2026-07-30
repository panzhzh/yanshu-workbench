import type { Language } from "./types";

export type CaptionWordRange = readonly [number, number];

export const CAPTION_LENGTH_POLICY = {
  defaultRange: [10, 40] as CaptionWordRange,
  min: 1,
  max: 120,
  step: 1,
} as const;

export function normalizeCaptionWordRange(
  value: unknown,
): CaptionWordRange {
  if (!Array.isArray(value) || value.length < 2) {
    return CAPTION_LENGTH_POLICY.defaultRange;
  }

  const parsedMinimum = Number(value[0]);
  const parsedMaximum = Number(value[1]);
  if (
    !Number.isFinite(parsedMinimum) ||
    !Number.isFinite(parsedMaximum)
  ) {
    return CAPTION_LENGTH_POLICY.defaultRange;
  }

  const first = Math.min(
    CAPTION_LENGTH_POLICY.max,
    Math.max(CAPTION_LENGTH_POLICY.min, Math.round(parsedMinimum)),
  );
  const second = Math.min(
    CAPTION_LENGTH_POLICY.max,
    Math.max(CAPTION_LENGTH_POLICY.min, Math.round(parsedMaximum)),
  );

  return [Math.min(first, second), Math.max(first, second)];
}

export function buildCaptionLengthGuidance(
  value: unknown,
  language: Language,
) {
  const [minimum, maximum] = normalizeCaptionWordRange(value);
  return language === "zh"
    ? `每条 Caption 建议约 ${minimum}–${maximum} words。该区间只用于平衡简洁与自包含性，不是硬性限制；当说明子图、对象、条件、指标或必要统计语义确有需要时可以超出，也不要为凑足下限机械补写。`
    : `Aim for roughly ${minimum}–${maximum} words per caption. This range is advisory, balancing concision with self-containment rather than imposing a hard limit. Exceed it when panels, objects, conditions, metrics, or essential statistical semantics genuinely require more explanation, and never pad a caption merely to reach the lower bound.`;
}
