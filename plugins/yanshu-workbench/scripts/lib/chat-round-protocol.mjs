import {
  mkdtemp,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  classifyVisibleChatLabel,
  normalizeVisibleChatLabel,
} from "./chat-preferences.mjs";
import {
  loadRun,
  updateExecutionMode,
} from "./run-store.mjs";

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
  {
    files = [],
    tools = [],
    prompt,
    report = { enabled: true, includeContent: false },
  },
) {
  if (!Array.isArray(files)) {
    throw new TypeError("files must be an array of approved absolute paths.");
  }
  if (!Array.isArray(tools)) {
    throw new TypeError("tools must be an array of visible ChatGPT tool selections.");
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new TypeError("prompt must be a non-empty string.");
  }
  return chatgpt.askWithFiles({
    thread: { type: "current" },
    existingTab: true,
    files,
    tools,
    prompt,
    wait: false,
    read: false,
    report,
  });
}

const MCP_HEALTH_MARKER = "YANSHU_MCP_READY";

function resultText(result) {
  const values = [
    result?.data?.text,
    result?.data?.responseText,
    result?.data?.latestAssistantPreview,
    result?.data?.markdown,
    result?.data?.content?.text,
    result?.outputText,
    result?.commandOutputText,
  ].filter((value) => typeof value === "string");
  return values.join("\n");
}

export function normalizeChatCompletion(result) {
  const data = result?.data ?? {};
  const lowLevel = data.completionState ?? null;
  const generationActive = data.generationActive === true;
  let state;
  if (generationActive || lowLevel === "generating") {
    state = "generating";
  } else if (
    result?.blocker?.kind === "captcha" ||
    result?.blocker?.kind === "login_required" ||
    result?.blocker?.kind === "permission" ||
    result?.status === "blocked"
  ) {
    state = "blocked";
  } else if (
    result?.ok === true &&
    (["complete", "completed"].includes(lowLevel) ||
      (lowLevel === "partial" &&
        data.hasResponseActions === true))
  ) {
    state = "completed";
  } else if (
    result?.status === "partial" ||
    ["partial", "stopped"].includes(lowLevel)
  ) {
    state = "needs_continuation";
  } else if (result?.ok === false) {
    state = "failed";
  } else if (result?.ok === true && resultText(result).trim()) {
    state = "completed";
  } else {
    state = "generating";
  }
  const preview = resultText(result).trim().slice(0, 500);
  return {
    state,
    generationActive,
    lowLevelState: lowLevel,
    assistantTurnCount:
      data.assistantTurnCount ?? result?.context?.assistantTurnCount ?? null,
    latestAssistantTurnIndex:
      data.latestAssistantTurnIndex ?? null,
    preview,
    artifacts: data.artifacts ?? [],
    hasResponseActions:
      data.hasResponseActions ?? null,
    blocker: result?.blocker ?? null,
  };
}

function chatWaitContract(normalized, extra = {}) {
  const nextActionByState = {
    generating: "wait-same-assistant-turn",
    completed: "collect-artifacts",
    needs_continuation: "continue-same-chat",
    blocked: "report-real-blocker",
    failed: "recover-same-chat-or-report",
  };
  return {
    ok: normalized.state === "completed",
    ...normalized,
    shouldContinueMonitoring: normalized.state === "generating",
    nextAction:
      nextActionByState[normalized.state] ??
      "recover-same-chat-or-report",
    ...extra,
  };
}

export async function waitForChatRound(
  chatgpt,
  {
    pollIntervalMs,
    maxPreviewChars = 500,
  },
) {
  if (!Number.isSafeInteger(pollIntervalMs) || pollIntervalMs <= 0) {
    throw new TypeError("pollIntervalMs must be a positive integer.");
  }
  const initial = await chatgpt.messages.status({ maxPreviewChars });
  const normalizedInitial = normalizeChatCompletion(initial);
  if (
    ["completed", "blocked", "failed"].includes(
      normalizedInitial.state,
    ) ||
    (normalizedInitial.state === "needs_continuation" &&
      normalizedInitial.lowLevelState === "stopped")
  ) {
    return chatWaitContract(normalizedInitial);
  }
  const waited = await chatgpt.messages.waitAndRead({
    timeoutMs: pollIntervalMs,
    stableMs: 1_500,
    pollMs: 750,
    role: "assistant",
    format: "markdown",
    maxChars: maxPreviewChars,
  });
  const normalized = normalizeChatCompletion(waited);
  if (
    normalized.state === "needs_continuation" &&
    normalized.lowLevelState === "partial" &&
    normalized.generationActive === false &&
    typeof chatgpt.files?.listLatest === "function"
  ) {
    const inventory = await chatgpt.files.listLatest({
      from: "latest_assistant",
      timeoutMs: Math.min(pollIntervalMs, 30_000),
    });
    const files = inventory?.ok
      ? (inventory.data?.files ?? [])
      : [];
    if (files.length > 0) {
      return chatWaitContract({
        ...normalized,
        state: "completed",
        artifacts: files,
      }, {
        completionEvidence: "stable-assistant-artifact",
      });
    }
  }
  return chatWaitContract(normalized);
}

export async function probeVisibleYanShuMcp(chatgpt) {
  const selected = await chatgpt.tools.select({ tool: "YanShu" });
  if (!selected?.ok) {
    return {
      available: false,
      reason:
        selected?.blocker?.code ??
        selected?.blocker?.kind ??
        "yanshu_tool_not_visible",
      selected,
    };
  }
  const asked = await chatgpt.messages.ask({
    text:
      "Call yanshu_health now. Do not read any paper file or run manifest. If it returns ready=true, reply exactly YANSHU_MCP_READY.",
    wait: false,
    read: false,
  });
  if (!asked?.ok) {
    return {
      available: false,
      reason: asked?.blocker?.code ?? "mcp_health_prompt_failed",
      selected,
      asked,
    };
  }
  const result = await chatgpt.messages.waitAndRead({
    timeoutMs: 60_000,
    stableMs: 1_500,
    pollMs: 750,
    role: "assistant",
    format: "normalized_text",
    maxChars: 1_000,
  });
  const ready = resultText(result).includes(MCP_HEALTH_MARKER);
  return {
    available: ready,
    reason: ready ? null : "visible_mcp_health_unverified",
    selected,
    result: {
      ...normalizeChatCompletion(result),
      markerObserved: ready,
    },
  };
}

export async function probeRealAttachmentTransport(chatgpt) {
  const directory = await mkdtemp(
    path.join(tmpdir(), "yanshu-attachment-probe-"),
  );
  try {
    const tex = path.join(directory, "yanshu-probe.tex");
    const bib = path.join(directory, "yanshu-probe.bib");
    await writeFile(
      tex,
      "\\documentclass{article}\\begin{document}YanShu probe\\end{document}\n",
      "utf8",
    );
    await writeFile(
      bib,
      "@misc{yanshu_probe,title={YanShu Probe}}\n",
      "utf8",
    );
    const preflight = await chatgpt.files.preflight({
      paths: [tex, bib],
    });
    if (!preflight?.ok) {
      return {
        available: false,
        reason:
          preflight?.blocker?.code ?? "attachment_mime_preflight_failed",
        preflight,
      };
    }
    const mimeTypes = new Map(
      (preflight.data?.files ?? []).map((file) => [
        file.name,
        file.mimeType,
      ]),
    );
    if (
      mimeTypes.get("yanshu-probe.tex") !== "text/plain" ||
      mimeTypes.get("yanshu-probe.bib") !== "text/plain"
    ) {
      return {
        available: false,
        reason: "attachment_mime_mismatch",
        preflight,
      };
    }
    const attached = await chatgpt.files.attach({
      paths: [tex, bib],
    });
    return {
      available: attached?.ok === true,
      reason: attached?.ok
        ? null
        : attached?.blocker?.code ?? "attachment_transport_failed",
      preflight: {
        ok: true,
        files: [...mimeTypes.entries()].map(([name, mimeType]) => ({
          name,
          mimeType,
        })),
      },
      attached,
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export async function autoSelectChatTransferMode(
  chatgpt,
  {
    runPath,
  } = {},
) {
  const handshake = await probeVisibleYanShuMcp(chatgpt);
  let attachmentProbe = null;
  let transferMode = "mcp";
  let fallbackReason = null;
  if (!handshake.available) {
    transferMode = "attachments";
    fallbackReason = handshake.reason;
    attachmentProbe = await probeRealAttachmentTransport(chatgpt);
  }

  if (runPath) {
    const state = await loadRun(runPath);
    await updateExecutionMode(state, {
      transferMode,
      fallbackReason,
      mcpHandshake: handshake,
      attachmentProbe,
    });
  }

  const usable =
    transferMode === "mcp" || attachmentProbe?.available === true;
  return {
    ok: usable,
    transferMode,
    fallbackReason,
    notice:
      transferMode === "mcp"
        ? "YanShu MCP is available and will be used."
        : attachmentProbe?.available
          ? `YanShu MCP is unavailable (${fallbackReason}); verified file attachment fallback will be used automatically.`
          : `YanShu MCP is unavailable (${fallbackReason}) and the attachment fallback probe failed (${attachmentProbe?.reason ?? "unknown"}).`,
    mcpHandshake: handshake,
    attachmentProbe,
  };
}
