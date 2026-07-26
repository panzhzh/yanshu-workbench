# Bundled visible Chat bridge

Use this reference only for a live YanShu Chat round. The bridge controls the signed-in visible ChatGPT page; it is not an API client.

## Load the runtime and YanShu protocols

Resolve every URL from the installed skill path:

```js
var yanshuSkillUrl =
  "file:///absolute/path/to/plugins/yanshu-workbench/skills/paper-reconstruction/SKILL.md";
var yanshuLoaderUrl = new URL(
  "../../vendor/chatgpt-control/import-chatgpt-control.mjs",
  yanshuSkillUrl
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
  yanshuSkillUrl
);
var {
  openFreshChatRound: openYanShuFreshChatRound,
  inspectFreshChatConfiguration: inspectYanShuFreshChatConfiguration,
  applyChatReasoningSelection: applyYanShuChatReasoningSelection,
  submitPreparedChatRound: submitYanShuPreparedChatRound,
  autoSelectChatTransferMode: autoSelectYanShuTransferMode,
  waitForChatRound: waitForYanShuChatRound
} = await import(`${yanshuProtocolUrl.href}?t=${Date.now()}`);

var yanshuArtifactUrl = new URL(
  "../../scripts/lib/chat-artifact-protocol.mjs",
  yanshuSkillUrl
);
var {
  listLatestAssistantFiles: listLatestYanShuFiles,
  downloadAssistantArtifact: downloadYanShuArtifact
} = await import(`${yanshuArtifactUrl.href}?t=${Date.now()}`);
```

If `globalThis.agent` is absent, return `browser_bridge_unavailable`. Do not invent a hidden browser.

## Run the automatic transport handshake

Open a disposable fresh Chat:

```js
var yanshuDiagnosticChat =
  await openYanShuFreshChatRound(yanshuChatGPT);
var yanshuTransfer = await autoSelectYanShuTransferMode(
  yanshuChatGPT,
  { runPath: absoluteRunPath }
);
```

The helper first selects YanShu and sends a zero-sensitive health request. If the marker is not returned, it automatically checks local MIME and attaches tiny disposable `.tex` and `.bib` files. It records `mcp` or `attachments` plus the fallback reason. Show `yanshuTransfer.notice` once and continue without asking a question.

If both paths fail, preserve the run and report the exact blocker. Do not repeatedly retry the same permission.

Create a different fresh Chat for the real round:

```js
var yanshuPreparedChat =
  await openYanShuFreshChatRound(yanshuChatGPT);
```

When resuming, open the exact recorded URL instead of creating a new Chat.

## Configure visible reasoning

Inspect the prepared Chat:

```js
var yanshuCapabilities =
  await inspectYanShuFreshChatConfiguration(yanshuChatGPT);
```

Pass its exact visible reasoning labels to `chat-plan`. Apply the returned selection:

```js
var yanshuApplied = await applyYanShuChatReasoningSelection(
  yanshuChatGPT,
  {
    selectedLabel: yanshuChatPlan.selectedLabel,
    visibleOptions: exactVisibleReasoningLabels
  }
);
```

Continue on `verified` or `click-acknowledged`. An unavailable requested level automatically falls back to the closest lower visible level; notify without pausing.

## Submit once

MCP mode:

```js
var submitted = await submitYanShuPreparedChatRound(
  yanshuChatGPT,
  {
    files: [],
    tools: [{ tool: "YanShu" }],
    prompt: mcpBootstrapPrompt
  }
);
```

Attachment mode:

```js
var submitted = await submitYanShuPreparedChatRound(
  yanshuChatGPT,
  {
    files: approvedAbsolutePaths,
    prompt: completeGeneratedPrompt
  }
);
```

The attachment helper requires every approved filename to become visible before submission. ChatGPT aliases such as `main (1).tex` are accepted without changing the approved local name. A partial attachment set stops to prevent duplicates.

Record the stable `/c/...` URL immediately.

## Wait using the selected reasoning interval

```js
var yanshuWait = await waitForYanShuChatRound(
  yanshuChatGPT,
  { pollIntervalMs: yanshuChatPlan.pollIntervalMs }
);
```

The normalized state is one of:

- `generating`
- `completed`
- `needs_continuation`
- `blocked`
- `failed`

Do not expose upstream `partial` as a terminal success. Do not send a continuation solely because one bounded wait ended.

## Inventory and download exact files

Inspect the latest assistant turn first:

```js
var latestFiles = await listLatestYanShuFiles(yanshuChatGPT);
```

Download by canonical expected artifact name:

```js
var downloaded = await downloadYanShuArtifact(
  yanshuChatGPT,
  {
    artifactName: exactExpectedName,
    destDir: absoluteRoundDownloadsDirectory
  }
);
```

The helper binds the file to the latest assistant turn, uses backend filename metadata when available, captures the real browser download event, and accepts duplicate browser suffixes only after canonical normalization. Never download directly over an existing canonical output; `round-finalize --replace` owns versioning and atomic replacement.

For the Round 4 PNG, the same helper automatically falls back from named-file
inventory to the latest generated-image artifact. That path uses visible image
controls, image source data, or the bridge `pageAssets` capability in that
order. It still requires the requested PNG format and returns the canonical
artifact name separately for safe registration.

For a required ZIP, do not copy paper prose or manually extract an invalid archive. If the exact bundle is absent, ask once in the same Chat for that named downloadable bundle.

## Real blockers

Preserve and report:

- `browser_bridge_unavailable`
- `login_required`
- `captcha`
- `rate_limit`
- `permission`
- explicit contradictory configuration readback

An acknowledged exact reasoning click without readable active-state text is not a blocker.
