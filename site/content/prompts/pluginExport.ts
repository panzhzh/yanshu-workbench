import { PRODUCT_CONFIG } from "../../app/config";
import { buildPrompt } from "./buildPrompt";
import { RECONSTRUCTION_PROMPTS } from "./templates";
import type {
  Language,
  PaperStyleId,
  PromptBuildContext,
} from "./types";

export const RECONSTRUCTION_WORKFLOW_VERSION = "2026.07.2";

export interface ReconstructionWorkflowInput {
  language?: Language;
  roundLanguages?: Record<string, Language>;
  styleId?: PaperStyleId;
  hasWordLimit?: boolean;
  unlimitedCoreSections?: boolean;
  targetWords?: number;
  sectionBudgets?: Record<string, number>;
  includeAppendix?: boolean;
}

function allocateWords(
  target: number,
  sections: (typeof PRODUCT_CONFIG.paperStyles)[PaperStyleId]["sections"],
) {
  const raw = sections.map((section) => target * section.ratio);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = target - allocated.reduce((sum, value) => sum + value, 0);
  const remainderOrder = raw
    .map((value, index) => ({ index, remainder: value - allocated[index] }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let cursor = 0; remaining > 0; cursor += 1) {
    allocated[remainderOrder[cursor % remainderOrder.length].index] += 1;
    remaining -= 1;
  }

  return Object.fromEntries(
    sections.map((section, index) => [section.id, allocated[index]]),
  );
}

function normalizeInput(input: ReconstructionWorkflowInput = {}) {
  const language = input.language ?? PRODUCT_CONFIG.defaultPromptLanguage;
  if (language !== "zh" && language !== "en") {
    throw new Error(`Unsupported prompt language: ${String(language)}.`);
  }
  const styleId = input.styleId ?? PRODUCT_CONFIG.defaultPaperStyle;
  if (styleId !== "conference" && styleId !== "journal") {
    throw new Error(`Unsupported paper style: ${String(styleId)}.`);
  }
  const style = PRODUCT_CONFIG.paperStyles[styleId];
  const hasWordLimit = input.hasWordLimit ?? true;
  const unlimitedCoreSections = input.unlimitedCoreSections ?? false;
  if (
    input.targetWords !== undefined &&
    !Number.isFinite(input.targetWords)
  ) {
    throw new Error("targetWords must be a finite number.");
  }
  const targetWords = Math.min(
    PRODUCT_CONFIG.wordCount.max,
    Math.max(
      PRODUCT_CONFIG.wordCount.min,
      Math.round(input.targetWords ?? style.defaultTargetWords),
    ),
  );
  const allocated = allocateWords(targetWords, style.sections);
  const sectionBudgets = Object.fromEntries(
    style.sections.map((section) => {
      const supplied = input.sectionBudgets?.[section.id];
      if (supplied !== undefined && !Number.isFinite(supplied)) {
        throw new Error(
          `Section budget "${section.id}" must be a finite number.`,
        );
      }
      return [
        section.id,
        supplied === undefined
          ? allocated[section.id]
          : Math.max(0, Math.round(supplied)),
      ];
    }),
  );

  if (hasWordLimit && !unlimitedCoreSections && input.sectionBudgets) {
    const sectionTotal = Object.values(sectionBudgets).reduce(
      (sum, value) => sum + value,
      0,
    );
    if (sectionTotal !== targetWords) {
      throw new Error(
        `Section budgets total ${sectionTotal}, but targetWords is ${targetWords}.`,
      );
    }
  }

  return {
    language,
    roundLanguages: Object.fromEntries(
      RECONSTRUCTION_PROMPTS.map((round) => {
        const roundLanguage = input.roundLanguages?.[round.id] ?? language;
        if (roundLanguage !== "zh" && roundLanguage !== "en") {
          throw new Error(
            `Unsupported prompt language for "${round.id}": ${String(roundLanguage)}.`,
          );
        }
        return [round.id, roundLanguage];
      }),
    ),
    styleId,
    style,
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets,
    includeAppendix: input.includeAppendix ?? style.defaultAppendix,
  };
}

export function buildReconstructionWorkflow(
  input: ReconstructionWorkflowInput = {},
) {
  const normalized = normalizeInput(input);
  const {
    language,
    roundLanguages,
    styleId,
    style,
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets,
    includeAppendix,
  } = normalized;
  const contextForLanguage = (
    promptLanguage: Language,
  ): PromptBuildContext => ({
    language: promptLanguage,
    styleId,
    styleLabel: style.label[promptLanguage],
    styleDirective: style.promptDirective[promptLanguage],
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets: style.sections.map((section) => ({
      id: section.id,
      label: section.label[promptLanguage],
      words: sectionBudgets[section.id],
    })),
    includeAppendix,
    appendixLabel:
      promptLanguage === "zh"
        ? includeAppendix
          ? "允许附录"
          : "不使用附录"
        : includeAppendix
          ? "Appendix allowed"
          : "No appendix",
    appendixDirective: includeAppendix
      ? style.appendixRule.enabled[promptLanguage]
      : style.appendixRule.disabled[promptLanguage],
  });

  return {
    schemaVersion: 1,
    workflowVersion: RECONSTRUCTION_WORKFLOW_VERSION,
    workflow: "paper-reconstruction",
    config: {
      language,
      roundLanguages,
      styleId,
      hasWordLimit,
      unlimitedCoreSections,
      targetWords,
      sectionBudgets,
      includeAppendix,
    },
    rounds: RECONSTRUCTION_PROMPTS.map((round) => {
      const roundLanguage = roundLanguages[round.id];
      return {
        id: round.id,
        number: round.number,
        language: roundLanguage,
        title: round.title[roundLanguage],
        purpose: round.purpose[roundLanguage],
        sourceFile: round.sourceFile,
        prompt: buildPrompt(round, contextForLanguage(roundLanguage)),
      };
    }),
  };
}
