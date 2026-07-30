import { PRODUCT_CONFIG } from "../../app/config";
import {
  CHAT_FALLBACK_POLICY,
  CHAT_MODEL_POLICY,
  CHAT_PRO_FOLLOW_UP_PREFERENCE,
  CHAT_RESULT_POLLING_POLICY,
  CHAT_REASONING_PREFERENCES,
  CHAT_REASONING_PREFERENCE_IDS,
  DEFAULT_CHAT_EXECUTION_PREFERENCES,
  type ChatExecutionPreferences,
} from "./chatExecution";
import {
  FIGURE_ASPECT_RATIO_IDS,
  FIGURE_ASPECT_RATIOS,
  RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
  type FrameworkFigureLayoutPreferences,
} from "../../app/figures/config";
import { buildPrompt } from "./buildPrompt";
import {
  normalizeCaptionWordRange,
  type CaptionWordRange,
} from "./captionLength";
import { RECONSTRUCTION_PROMPTS } from "./templates";
import { RECONSTRUCTION_WORKFLOW_VERSION } from "./version";
import type {
  Language,
  PaperStyleId,
  PromptBuildContext,
} from "./types";

export interface ReconstructionWorkflowInput {
  language?: Language;
  roundLanguages?: Record<string, Language>;
  styleId?: PaperStyleId;
  hasWordLimit?: boolean;
  unlimitedCoreSections?: boolean;
  includeSectionNavigationSentence?: boolean;
  targetWords?: number;
  sectionBudgets?: Record<string, number>;
  includeAppendix?: boolean;
  captionWordRange?: CaptionWordRange;
  frameworkFigure?: FrameworkFigureLayoutPreferences;
  chatExecution?: Partial<ChatExecutionPreferences>;
}

export function getReconstructionConfigurationModel() {
  return {
    schemaVersion: 1,
    defaultPaperStyle: PRODUCT_CONFIG.defaultPaperStyle,
    defaultPromptLanguage: PRODUCT_CONFIG.defaultPromptLanguage,
    wordCount: PRODUCT_CONFIG.wordCount,
    captionLength: PRODUCT_CONFIG.captionLength,
    paperStyles: Object.fromEntries(
      Object.entries(PRODUCT_CONFIG.paperStyles).map(([id, style]) => [
        id,
        {
          id: style.id,
          label: style.label,
          shortLabel: style.shortLabel,
          description: style.description,
          plannerSummary: style.plannerSummary,
          defaultTargetWords: style.defaultTargetWords,
          defaultAppendix: style.defaultAppendix,
          defaultIncludeSectionNavigationSentence:
            style.defaultIncludeSectionNavigationSentence,
          sections: style.sections.map((section) => ({
            id: section.id,
            label: section.label,
            shortLabel: section.shortLabel,
            description: section.description,
            ratio: section.ratio,
          })),
        },
      ]),
    ),
    frameworkFigure: {
      default: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
      aspectRatios: FIGURE_ASPECT_RATIO_IDS.map((id) => ({
        id,
        label: FIGURE_ASPECT_RATIOS[id].label,
        ratio: FIGURE_ASPECT_RATIOS[id].ratio,
        description: FIGURE_ASPECT_RATIOS[id].shortDescription,
      })),
    },
    chatExecution: {
      default: DEFAULT_CHAT_EXECUTION_PREFERENCES,
      reasoningPreferences: CHAT_REASONING_PREFERENCE_IDS.map(
        (id) => CHAT_REASONING_PREFERENCES[id],
      ),
      proFollowUpPreference: CHAT_PRO_FOLLOW_UP_PREFERENCE,
      pollingPolicy: CHAT_RESULT_POLLING_POLICY,
    },
  };
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
  const hasWordLimit =
    input.hasWordLimit ??
    (PRODUCT_CONFIG.wordCount.defaultMode === "target");
  const unlimitedCoreSections =
    input.unlimitedCoreSections ??
    PRODUCT_CONFIG.wordCount.defaultUnlimitedCoreSections;
  const includeSectionNavigationSentence =
    input.includeSectionNavigationSentence ??
    style.defaultIncludeSectionNavigationSentence;
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
          `Section length suggestion "${section.id}" must be a finite number.`,
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
        `Section length suggestions total ${sectionTotal}, but the suggested main-text reference is ${targetWords}.`,
      );
    }
  }

  const frameworkFigure = {
    aspectRatioId:
      input.frameworkFigure?.aspectRatioId ??
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
    customAspectWidth:
      input.frameworkFigure?.customAspectWidth ??
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
    customAspectHeight:
      input.frameworkFigure?.customAspectHeight ??
      RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight,
  };
  const captionWordRange = normalizeCaptionWordRange(
    input.captionWordRange,
  );

  if (!(frameworkFigure.aspectRatioId in FIGURE_ASPECT_RATIOS)) {
    throw new Error(
      `Unsupported framework figure ratio: ${String(frameworkFigure.aspectRatioId)}.`,
    );
  }
  if (
    !Number.isFinite(frameworkFigure.customAspectWidth) ||
    frameworkFigure.customAspectWidth <= 0 ||
    !Number.isFinite(frameworkFigure.customAspectHeight) ||
    frameworkFigure.customAspectHeight <= 0
  ) {
    throw new Error(
      "Framework figure custom ratio values must be positive finite numbers.",
    );
  }

  const modelPolicy =
    input.chatExecution?.modelPolicy ??
    DEFAULT_CHAT_EXECUTION_PREFERENCES.modelPolicy;
  if (modelPolicy !== CHAT_MODEL_POLICY) {
    throw new Error(
      `Unsupported ChatGPT model policy: ${String(modelPolicy)}.`,
    );
  }
  const reasoningPreference =
    input.chatExecution?.reasoningPreference ??
    DEFAULT_CHAT_EXECUTION_PREFERENCES.reasoningPreference;
  if (
    !CHAT_REASONING_PREFERENCE_IDS.includes(
      reasoningPreference as (typeof CHAT_REASONING_PREFERENCE_IDS)[number],
    )
  ) {
    throw new Error(
      `Unsupported ChatGPT reasoning preference: ${String(reasoningPreference)}.`,
    );
  }
  const forceProForAllTurns =
    input.chatExecution?.forceProForAllTurns ??
    DEFAULT_CHAT_EXECUTION_PREFERENCES.forceProForAllTurns;
  if (typeof forceProForAllTurns !== "boolean") {
    throw new Error("forceProForAllTurns must be a boolean.");
  }
  const fallbackPolicy =
    input.chatExecution?.fallbackPolicy ??
    DEFAULT_CHAT_EXECUTION_PREFERENCES.fallbackPolicy;
  if (fallbackPolicy !== CHAT_FALLBACK_POLICY) {
    throw new Error(
      `Unsupported ChatGPT fallback policy: ${String(fallbackPolicy)}.`,
    );
  }
  const chatExecution: ChatExecutionPreferences = {
    modelPolicy,
    reasoningPreference,
    forceProForAllTurns,
    fallbackPolicy,
    pollingPolicy: CHAT_RESULT_POLLING_POLICY,
  };

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
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets,
    includeAppendix: input.includeAppendix ?? style.defaultAppendix,
    captionWordRange,
    frameworkFigure,
    chatExecution,
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
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets,
    includeAppendix,
    captionWordRange,
    frameworkFigure,
    chatExecution,
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
    includeSectionNavigationSentence,
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
    captionWordRange,
    frameworkFigure,
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
      includeSectionNavigationSentence,
      targetWords,
      sectionBudgets,
      includeAppendix,
      captionWordRange,
      frameworkFigure,
      chatExecution,
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
