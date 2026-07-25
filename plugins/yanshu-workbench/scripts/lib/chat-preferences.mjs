import { CliError } from "./cli.mjs";

export const CHAT_REASONING_PREFERENCES = [
  "strongest",
  "medium",
  "high",
  "extra-high",
  "pro",
];

const PREFERENCE_LABELS = {
  strongest: "strongest available",
  medium: "Medium",
  high: "High",
  "extra-high": "Extra High",
  pro: "Pro",
};

const FALLBACK_ORDER = {
  strongest: [],
  medium: ["medium"],
  high: ["high", "medium"],
  "extra-high": ["extra-high", "high", "medium"],
  pro: ["pro", "extra-high", "high", "medium"],
};

function normalizeLabel(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyVisibleLabel(label) {
  const normalized = normalizeLabel(label);
  if (
    normalized.includes("pro extended") ||
    normalized.includes("extended pro") ||
    normalized === "ultra"
  ) {
    return { capability: "pro", score: 52 };
  }
  if (
    normalized.includes("pro standard") ||
    normalized.includes("standard pro")
  ) {
    return { capability: "pro", score: 51 };
  }
  if (
    normalized === "pro" ||
    normalized.startsWith("pro ") ||
    normalized.endsWith(" pro")
  ) {
    return { capability: "pro", score: 50 };
  }
  if (
    normalized.includes("extra high") ||
    normalized.includes("xhigh") ||
    normalized.includes("thinking heavy") ||
    normalized === "heavy" ||
    normalized === "max"
  ) {
    return { capability: "extra-high", score: 40 };
  }
  if (
    normalized === "high" ||
    normalized.startsWith("high ") ||
    normalized.endsWith(" high") ||
    normalized.includes("thinking extended") ||
    normalized === "extended"
  ) {
    return { capability: "high", score: 30 };
  }
  if (
    normalized === "medium" ||
    normalized.startsWith("medium ") ||
    normalized.endsWith(" medium") ||
    normalized.includes("thinking standard") ||
    normalized === "standard"
  ) {
    return { capability: "medium", score: 20 };
  }
  return { capability: null, score: null };
}

function strongestVisible(options) {
  const hasUnknown = options.some((option) => option.capability === null);
  if (hasUnknown) {
    return {
      option: options.at(-1),
      source: "visible-order",
    };
  }
  return {
    option: options.reduce((best, option) =>
      option.score > best.score ? option : best,
    ),
    source: "recognized-capability",
  };
}

export function parseVisibleChatOptions(rawValue) {
  if (!rawValue) {
    throw new CliError(
      "No visible ChatGPT reasoning options were supplied.",
      "missing_visible_options",
    );
  }
  let values;
  if (rawValue.trim().startsWith("[")) {
    try {
      values = JSON.parse(rawValue);
    } catch {
      throw new CliError(
        "--visible must be a JSON array or a pipe-separated list.",
      );
    }
  } else {
    values = rawValue.split("|");
  }
  if (!Array.isArray(values)) {
    throw new CliError(
      "--visible must be a JSON array or a pipe-separated list.",
    );
  }
  const options = values
    .map((value) => String(value).trim())
    .filter(Boolean);
  if (options.length === 0) {
    throw new CliError(
      "No visible ChatGPT reasoning options were supplied.",
      "missing_visible_options",
    );
  }
  return options;
}

export function resolveChatPreference({
  requested = "strongest",
  visibleOptions,
}) {
  if (!CHAT_REASONING_PREFERENCES.includes(requested)) {
    throw new CliError(
      `Unknown ChatGPT reasoning preference: ${requested}.`,
    );
  }
  if (!Array.isArray(visibleOptions) || visibleOptions.length === 0) {
    throw new CliError(
      "At least one visible ChatGPT reasoning option is required.",
      "missing_visible_options",
    );
  }

  const options = visibleOptions.map((label, index) => ({
    label: String(label).trim(),
    index,
    ...classifyVisibleLabel(String(label)),
  }));
  if (options.some((option) => option.label.length === 0)) {
    throw new CliError("Visible ChatGPT reasoning labels cannot be empty.");
  }

  let selected;
  let source;
  if (requested !== "strongest") {
    const exactMatches = options.filter(
      (option) => option.capability === requested,
    );
    if (exactMatches.length > 0) {
      selected = exactMatches.reduce((best, option) =>
        option.score > best.score ? option : best,
      );
      source = "requested-capability";
    }
  }

  const hasUnknown = options.some((option) => option.capability === null);
  if (!selected && requested !== "strongest" && !hasUnknown) {
    for (const capability of FALLBACK_ORDER[requested].slice(1)) {
      const matches = options.filter(
        (option) => option.capability === capability,
      );
      if (matches.length > 0) {
        selected = matches.reduce((best, option) =>
          option.score > best.score ? option : best,
        );
        source = "closest-lower-capability";
        break;
      }
    }
  }

  if (!selected) {
    const strongest = strongestVisible(options);
    selected = strongest.option;
    source =
      requested === "strongest"
        ? `strongest-${strongest.source}`
        : `fallback-strongest-${strongest.source}`;
  }

  const fallbackApplied =
    requested !== "strongest" && selected.capability !== requested;
  const requestedLabel = PREFERENCE_LABELS[requested];
  const notice = fallbackApplied
    ? `Requested ${requestedLabel}; selected ${selected.label} because the requested level was not visible.`
    : requested === "strongest"
      ? `Selected the strongest visible reasoning level: ${selected.label}.`
      : `Selected the requested reasoning level: ${selected.label}.`;

  return {
    modelPolicy: "latest-visible-reasoning",
    requested,
    requestedLabel,
    selectedLabel: selected.label,
    selectedCapability: selected.capability,
    fallbackApplied,
    source,
    notice,
  };
}
