import type { Language, LocalizedText } from "./types";

export const PROMPT_JUDGMENT_DIRECTIVE = {
  zh: "请从整体理解本 Prompt 的目标、证据边界与交付要求；在不改变事实和硬性约束的前提下，主动采用你判断更严谨、更有效的方案，并在有助于提升结果时比字面要求思考得更深入。",
  en: "Understand this Prompt's objectives, evidence boundaries, and deliverables as a whole. Without changing facts or hard constraints, use any more rigorous and effective approach you judge appropriate, and reason beyond the literal wording when that improves the result.",
} satisfies LocalizedText;

export function withPromptJudgmentDirective(
  prompt: string,
  language: Language,
) {
  return `${PROMPT_JUDGMENT_DIRECTIVE[language]}\n\n${prompt}`;
}
