import {
  classifyVisibleChatLabel,
  normalizeVisibleChatLabel,
} from "./chat-preferences.mjs";

const CHATGPT_CONVERSATION_PATH = /^\/c\/[^/?#]+/i;

function resultUrl(result) {
  return result?.data?.url ?? result?.context?.url ?? null;
}

function conversationIdFromUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, "https://chatgpt.com/");
    const match = url.pathname.match(CHATGPT_CONVERSATION_PATH);
    return match ? match[0].slice(3) : null;
  } catch {
    return null;
  }
}

function blocker(code, message, raw, resumable = true) {
  return {
    ok: false,
    status: "blocked",
    blocker: {
      kind: "selector_drift",
      code,
      message,
      resumable,
    },
    raw,
  };
}

function labelsMatch(actual, requested) {
  const normalizedActual = normalizeVisibleChatLabel(actual);
  const normalizedRequested = normalizeVisibleChatLabel(requested);
  if (!normalizedActual || !normalizedRequested) return false;
  if (normalizedActual === normalizedRequested) return true;

  const actualCapability = classifyVisibleChatLabel(actual).capability;
  const requestedCapability =
    classifyVisibleChatLabel(requested).capability;
  if (actualCapability && requestedCapability) {
    return actualCapability === requestedCapability;
  }

  return (
    normalizedActual.startsWith(`${normalizedRequested} `) ||
    normalizedActual.endsWith(` ${normalizedRequested}`)
  );
}

function clickedSelectionMatches(result, selectedLabel) {
  return (result?.data?.selected ?? []).some(
    (entry) =>
      ["model", "intelligence", "effort"].includes(entry.axis) &&
      labelsMatch(entry.requested, selectedLabel) &&
      labelsMatch(entry.selected, selectedLabel),
  );
}

function conflictingVisibleReadback(
  visibleModes,
  visibleOptions,
  selectedLabel,
) {
  if (!Array.isArray(visibleOptions) || visibleOptions.length === 0) {
    return null;
  }
  for (const mode of visibleModes) {
    if (labelsMatch(mode, selectedLabel)) continue;
    const option = visibleOptions.find((candidate) =>
      labelsMatch(mode, candidate),
    );
    if (option && !labelsMatch(option, selectedLabel)) {
      return { mode, option };
    }
  }
  return null;
}

export async function openFreshChatRound(chatgpt) {
  const opened = await chatgpt.experience.open({ experience: "chat" });
  if (!opened?.ok) return opened;

  const previousUrl = resultUrl(opened);
  const created = await chatgpt.threads.new();
  if (!created?.ok) return created;

  const currentUrl = resultUrl(created);
  if (!currentUrl) {
    return blocker(
      "thread_creation_unverified",
      "ChatGPT reported a new-thread action but did not expose the resulting visible URL.",
      { opened, created },
    );
  }

  const previousConversationId = conversationIdFromUrl(previousUrl);
  const currentConversationId = conversationIdFromUrl(currentUrl);
  if (
    previousConversationId &&
    previousConversationId === currentConversationId
  ) {
    return blocker(
      "thread_creation_unverified",
      "The visible ChatGPT page remained on the previous conversation after requesting a new thread.",
      { opened, created },
    );
  }

  return {
    ok: true,
    status: "ready",
    data: {
      previousUrl,
      currentUrl,
      conversationId:
        created.data?.conversationId ?? currentConversationId,
    },
    raw: { opened, created },
  };
}

export async function inspectFreshChatConfiguration(chatgpt) {
  return chatgpt.configuration.inspect({
    experience: "chat",
    includeOptions: true,
  });
}

export async function applyChatReasoningSelection(
  chatgpt,
  { selectedLabel, visibleOptions = [] },
) {
  if (typeof selectedLabel !== "string" || !selectedLabel.trim()) {
    throw new TypeError("selectedLabel must be a non-empty string.");
  }

  const applied = await chatgpt.configuration.apply({
    experience: "chat",
    desired: { intelligence: selectedLabel.trim() },
    strict: false,
  });
  if (!applied?.ok) return applied;

  const readback = await chatgpt.modes.get();
  if (
    readback?.ok === false &&
    readback.blocker?.kind !== "selector_drift"
  ) {
    return readback;
  }
  const visibleModes = readback?.ok
    ? (readback.data?.modes ?? [])
    : [];
  const verified =
    applied.data?.verified === true ||
    visibleModes.some((mode) => labelsMatch(mode, selectedLabel));
  if (verified) {
    return {
      ok: true,
      status: "applied",
      data: {
        selectedLabel,
        verification: "verified",
        visibleModes,
      },
      warnings: [...(applied.warnings ?? []), ...(readback?.warnings ?? [])],
      raw: { applied, readback },
    };
  }

  const conflict = conflictingVisibleReadback(
    visibleModes,
    visibleOptions,
    selectedLabel,
  );
  if (conflict) {
    return blocker(
      "configuration_readback_conflict",
      `ChatGPT accepted the configuration action, but the visible control reports "${conflict.mode}" instead of "${selectedLabel}".`,
      { applied, readback, conflict },
    );
  }

  if (!clickedSelectionMatches(applied, selectedLabel)) {
    return blocker(
      "configuration_click_unconfirmed",
      `YanShu could not confirm that ChatGPT accepted the "${selectedLabel}" selection.`,
      { applied, readback },
    );
  }

  return {
    ok: true,
    status: "applied",
    data: {
      selectedLabel,
      verification: "click-acknowledged",
      visibleModes,
    },
    warnings: [
      ...(applied.warnings ?? []),
      ...(readback?.warnings ?? []),
      `ChatGPT accepted the "${selectedLabel}" selection, but its current UI does not expose a reliable active-value readback. YanShu will continue with the acknowledged selection.`,
    ],
    raw: { applied, readback },
  };
}

export async function submitPreparedChatRound(
  chatgpt,
  { files = [], prompt, report = { enabled: true, includeContent: false } },
) {
  if (!Array.isArray(files)) {
    throw new TypeError("files must be an array of approved absolute paths.");
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new TypeError("prompt must be a non-empty string.");
  }
  return chatgpt.askWithFiles({
    thread: { type: "current" },
    existingTab: true,
    files,
    prompt,
    wait: false,
    read: false,
    report,
  });
}
