# Bundled visible Chat bridge

Use this reference only while executing or diagnosing a YanShu Chat round. The bundled runtime controls the user-visible ChatGPT page; it is not an API client.

## Load the pinned runtime

Use the persistent Codex Node runtime that exposes the browser bridge. Resolve the loader from this skill:

```js
var yanshuLoaderUrl = new URL(
  "../../vendor/chatgpt-control/import-chatgpt-control.mjs",
  "file:///absolute/path/to/plugins/yanshu-workbench/skills/paper-reconstruction/SKILL.md"
);
var { importChatGPTControl: importYanShuChatControl } =
  await import(`${yanshuLoaderUrl.href}?t=${Date.now()}`);
var { createChatGPT: createYanShuChatGPT } =
  await importYanShuChatControl();
var yanshuChatGPT = createYanShuChatGPT({
  agent: globalThis.agent,
  reporting: { enabled: true, includeContent: false }
});
var yanshuProtocolUrl = new URL(
  "../../scripts/lib/chat-round-protocol.mjs",
  "file:///absolute/path/to/plugins/yanshu-workbench/skills/paper-reconstruction/SKILL.md"
);
var {
  openFreshChatRound: openYanShuFreshChatRound,
  inspectFreshChatConfiguration: inspectYanShuFreshChatConfiguration,
  applyChatReasoningSelection: applyYanShuChatReasoningSelection,
  submitPreparedChatRound: submitYanShuPreparedChatRound
} = await import(`${yanshuProtocolUrl.href}?t=${Date.now()}`);
```

If `globalThis.agent` is absent, do not run this import from an ordinary shell and do not invent a hidden browser session. Load the supported Chrome-control runtime when available; otherwise return `browser_bridge_unavailable`.

## Preflight

Run the visible diagnostic before the first paper delivery:

```js
var yanshuChatDoctor = await yanshuChatGPT.doctor({
  check: ["bridge", "login", "download", "clipboard", "modes"]
});
```

Stop on a failed required check. On Windows, YanShu's default attachment path
copies the approved file objects to the native file clipboard and pastes them
into ChatGPT. This preserves real `.tex`, `.bib`, `.pdf`, and image files
without converting their contents to message text.

The visible file chooser fallback may require:

1. `Allow access to file URLs` for the Codex/browser bridge extension in Chrome.
2. Google Chrome upload permission in Codex settings.

Do not repeatedly retry the same missing permission. A file-chooser failure is
not proof that native file clipboard paste is unavailable.

## Prepare the round thread

YanShu paper prose always uses Chat. For a round without a recorded thread URL,
prepare a blank thread before inspecting or changing configuration:

```js
var yanshuPreparedChat =
  await openYanShuFreshChatRound(yanshuChatGPT);
```

This helper calls `experience.open({ experience: "chat" })` and then
`threads.new()`. A successful `experience.open` by itself is not a new
conversation and must never authorize configuration changes in the user's
previously selected chat. Stop before configuration or manuscript delivery if
`yanshuPreparedChat.ok` is false.

For a round that already records a stable conversation URL, reopen that exact
thread instead:

```js
var yanshuPreparedChat = await yanshuChatGPT.threads.open({
  url: recordedThreadUrl
});
```

After the target thread is prepared, inspect its visible configuration:

```js
var yanshuChatCapabilities =
  await inspectYanShuFreshChatConfiguration(yanshuChatGPT);
```

## Resolve and apply capability

Keep the exact intelligence/reasoning candidates in their visible order. Resolve
the saved YanShu preference before applying anything:

```text
node <plugin-root>/scripts/yanshu.mjs chat-plan \
  --run <run-path> \
  --visible "Medium|High|Extra High|Pro"
```

The example labels are illustrative only. Pass exactly the labels returned by
the live inspection. The resolver never assumes a plan or a fixed model name.
If it reports a fallback, tell the user which visible level will be used before
submitting the round.

Apply the returned `selectedLabel` with the YanShu protocol:

```js
var yanshuVisibleReasoningOptions = (
  yanshuChatCapabilities.data.options.intelligence ??
  yanshuChatCapabilities.data.options.effort ??
  []
).map((option) => option.label);
var yanshuAppliedConfiguration =
  await applyYanShuChatReasoningSelection(yanshuChatGPT, {
    selectedLabel: "<selectedLabel from chat-plan>",
    visibleOptions: yanshuVisibleReasoningOptions
  });
```

The helper deliberately calls the upstream selector with `strict: false`, then
classifies the available evidence:

- `verified`: a visible active-value readback matches the selected label;
- `click-acknowledged`: the exact option was found and clicked, but ChatGPT's
  current composer exposes no reliable active-value readback. Continue and
  record this verification level;
- a blocker: the option could not be found or clicked, the visible readback
  explicitly reports a different option, or a fresh thread was not established.

Do not turn `click-acknowledged` into `selector_drift`. Tell the user once that
the visible option was accepted but the UI cannot expose a reliable readback,
then continue. Do stop on explicit contradictory readback.

Before submission, record the prepared round and the returned verification level:

```text
node <plugin-root>/scripts/yanshu.mjs mark \
  --run <run-path> \
  --round <round-number> \
  --status running \
  --experience chat \
  --effort "<selectedLabel from chat-plan>" \
  --configuration-verification verified|click-acknowledged
```

Use the latest visible reasoning-capable model family. When a separate model or
model-version axis is visible, choose its newest reasoning-capable entry only
when the visible ordering or version is unambiguous. Otherwise keep Chat's
latest/default reasoning family. Do not infer a subscription plan or hidden
model identifier from a visible label. Record the visible labels and
`yanshuAppliedConfiguration.data.verification` only.

## Submit one round exactly once

Read the generated prompt file locally and pass its full text with only the
approved source paths returned by `yanshu next`:

```js
var yanshuSubmittedRound = await submitYanShuPreparedChatRound(
  yanshuChatGPT,
  {
    files: approvedAbsolutePaths,
    prompt: completeGeneratedPrompt
  }
);
```

On Windows, the helper first places the approved paths on the OS clipboard as a
real file-drop list, focuses the blank ChatGPT composer, and presses `Ctrl+V`.
It verifies that every approved filename appears before submitting the Prompt.
If nothing was pasted, it may fall back to ChatGPT's visible file chooser. If
only part of the file list appears, it stops instead of retrying and creating
duplicate attachments. Other host platforms currently use the visible chooser
fallback.

The helper uses `thread: { type: "current" }` with `existingTab: true`. This is
intentional: the round already owns the blank configured thread. Do not pass
`thread: { type: "new" }` here, because that would create a second thread after
configuration.

Immediately preserve the returned thread or conversation URL in `run.json` through the `yanshu mark` command. If submission returns a partial result, timeout, or active-generation state, assume the prompt may already be running.

## Wait without resubmitting

Use compact metadata polling:

```js
var yanshuRoundStatus = await yanshuChatGPT.messages.status({
  maxPreviewChars: 500
});
var yanshuRoundResult = await yanshuChatGPT.messages.waitAndRead({
  timeoutMs: 25_000,
  stableMs: 1_500,
  pollMs: 750,
  role: "assistant",
  format: "markdown"
});
```

For a recorded conversation URL after restart:

```js
var yanshuContinuedRound = await yanshuChatGPT.askInThread({
  thread: { type: "url", url: recordedThreadUrl },
  existingTab: true,
  prompt: "Continue from the latest unfinished work without restarting the round.",
  wait: false,
  read: false
});
```

Send a continuation only when the visible conversation genuinely requires it. Do not use a continuation merely because a local wait timed out.

## Download exact artifacts

When the prompt names an expected file, use an exact case-insensitive filename expression and the round output directory:

```js
var yanshuDownloadedArtifact =
  await yanshuChatGPT.files.downloadLatest({
    destDir: absoluteRoundOutputDirectory,
    filenamePattern: "^expected-name\\.tex$"
  });
```

A filename mismatch, older artifact, image fallback, or missing download is not success. Register every accepted file with the YanShu `artifact` command.

If Chat returns paper prose only in the conversation, request the named downloadable artifact in the same thread. Do not copy the manuscript through Codex.

## Structured blockers

Preserve and report the runtime's real status for:

- `browser_bridge_unavailable`
- `login_required`
- `captcha`
- `rate_limit`
- `permission`
- `needs_confirmation`
- `selector_drift`

Never convert one of these into a successful round or bypass it with another model surface.
An absent active-value label after an acknowledged exact configuration click is
not, by itself, `selector_drift`; the YanShu protocol reports it as
`click-acknowledged`. Missing options, failed clicks, stale-thread evidence, and
contradictory readback remain real blockers.
