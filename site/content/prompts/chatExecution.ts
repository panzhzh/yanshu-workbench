import type { LocalizedText } from "./types";

export const CHAT_MODEL_POLICY = "latest-visible-reasoning" as const;
export const CHAT_FALLBACK_POLICY =
  "closest-lower-then-strongest" as const;
export const CHAT_PRO_FOLLOW_UP_PREFERENCE = "extra-high" as const;

export const CHAT_REASONING_PREFERENCE_IDS = [
  "strongest",
  "medium",
  "high",
  "extra-high",
  "pro",
] as const;

export type ChatReasoningPreferenceId =
  (typeof CHAT_REASONING_PREFERENCE_IDS)[number];

export const CHAT_REASONING_CAPABILITY_IDS = [
  "medium",
  "high",
  "extra-high",
  "pro",
] as const;

export type ChatReasoningCapabilityId =
  (typeof CHAT_REASONING_CAPABILITY_IDS)[number];

export const CHAT_RESULT_POLLING_POLICY = {
  strategy: "selected-reasoning-capability",
  intervalMsByCapability: {
    medium: 60_000,
    high: 60_000,
    "extra-high": 180_000,
    pro: 300_000,
  },
  unknownIntervalMs: 60_000,
} as const;

export interface ChatExecutionPreferences {
  modelPolicy: typeof CHAT_MODEL_POLICY;
  reasoningPreference: ChatReasoningPreferenceId;
  forceProForAllTurns: boolean;
  fallbackPolicy: typeof CHAT_FALLBACK_POLICY;
  pollingPolicy: typeof CHAT_RESULT_POLLING_POLICY;
}

export interface ChatReasoningPreferenceDefinition {
  id: ChatReasoningPreferenceId;
  label: LocalizedText;
  shortLabel: LocalizedText;
  description: LocalizedText;
}

export const CHAT_REASONING_PREFERENCES: Record<
  ChatReasoningPreferenceId,
  ChatReasoningPreferenceDefinition
> = {
  strongest: {
    id: "strongest",
    label: {
      zh: "自动最强",
      en: "Auto strongest",
    },
    shortLabel: {
      zh: "最强可用",
      en: "Strongest available",
    },
    description: {
      zh: "默认使用当前账号可见的最强推理档位。",
      en: "Use the strongest reasoning level currently visible for this account.",
    },
  },
  medium: {
    id: "medium",
    label: {
      zh: "Medium",
      en: "Medium",
    },
    shortLabel: {
      zh: "Medium",
      en: "Medium",
    },
    description: {
      zh: "优先匹配 Medium 或含义最接近的常规推理档位。",
      en: "Prefer Medium or the closest equivalent standard-reasoning level.",
    },
  },
  high: {
    id: "high",
    label: {
      zh: "High",
      en: "High",
    },
    shortLabel: {
      zh: "High",
      en: "High",
    },
    description: {
      zh: "优先匹配 High；不可用时回退到 Medium。",
      en: "Prefer High and fall back to Medium when High is unavailable.",
    },
  },
  "extra-high": {
    id: "extra-high",
    label: {
      zh: "Extra High",
      en: "Extra High",
    },
    shortLabel: {
      zh: "Extra High",
      en: "Extra High",
    },
    description: {
      zh: "优先匹配 Extra High（xhigh）；不可用时依次回退到 High、Medium。",
      en: "Prefer Extra High (xhigh), then fall back to High and Medium.",
    },
  },
  pro: {
    id: "pro",
    label: {
      zh: "Pro",
      en: "Pro",
    },
    shortLabel: {
      zh: "Pro",
      en: "Pro",
    },
    description: {
      zh: "默认每轮首次有效对话使用 Pro，后续继续、纠正与补交切换为 Extra High；不可用时仍按最接近档位回退。",
      en: "Use Pro for the first effective interaction of each round by default, then switch continuations, corrections, and resubmissions to Extra High; unavailable levels still fall back to the closest option.",
    },
  },
};

export const DEFAULT_CHAT_EXECUTION_PREFERENCES: ChatExecutionPreferences = {
  modelPolicy: CHAT_MODEL_POLICY,
  reasoningPreference: "strongest",
  forceProForAllTurns: false,
  fallbackPolicy: CHAT_FALLBACK_POLICY,
  pollingPolicy: CHAT_RESULT_POLLING_POLICY,
};

export function getRequestedChatPollingIntervalMs(
  preference: ChatReasoningPreferenceId,
) {
  if (preference === "strongest") return null;
  return CHAT_RESULT_POLLING_POLICY.intervalMsByCapability[preference];
}
