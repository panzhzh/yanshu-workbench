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
```

If `globalThis.agent` is absent, do not run this import from an ordinary shell and do not invent a hidden browser session. Load the supported Chrome-control runtime when available; otherwise return `browser_bridge_unavailable`.

## Preflight

Run the visible diagnostic before the first paper upload:

```js
var yanshuChatDoctor = await yanshuChatGPT.doctor({
  check: ["bridge", "login", "upload", "download", "clipboard"]
});
```

Stop on a failed check. File uploads require:

1. `Allow access to file URLs` for the Codex/browser bridge extension in Chrome.
2. Google Chrome upload permission in Codex settings.

Do not repeatedly retry the same missing permission.

## Open Chat and select capability

YanShu paper prose always uses Chat:

```js
var yanshuOpenedChat = await yanshuChatGPT.experience.open({
  experience: "chat"
});
var yanshuChatCapabilities = await yanshuChatGPT.configuration.inspect({
  experience: "chat"
});
```

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

Apply the returned `selectedLabel` strictly and verify the postcondition:

```js
var yanshuAppliedConfiguration =
  await yanshuChatGPT.configuration.apply({
    experience: "chat",
    desired: { intelligence: "<selectedLabel from chat-plan>" },
    strict: true
  });
```

Use the latest visible reasoning-capable model family. When a separate model or
model-version axis is visible, choose its newest reasoning-capable entry only
when the visible ordering or version is unambiguous. Otherwise keep Chat's
latest/default reasoning family. Do not infer a subscription plan or hidden
model identifier from a visible label. Record the visible labels and
verification result only.

## Submit one round exactly once

Read the generated prompt file locally and pass its full text with only the approved attachment paths returned by `yanshu next`:

```js
var yanshuSubmittedRound = await yanshuChatGPT.askWithFiles({
  thread: { type: "new" },
  files: approvedAbsolutePaths,
  prompt: completeGeneratedPrompt,
  wait: false,
  read: false,
  report: { enabled: true, includeContent: false }
});
```

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
