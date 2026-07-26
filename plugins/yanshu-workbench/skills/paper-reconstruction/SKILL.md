---
name: paper-reconstruction
description: Run YanShu's resumable five-round Paper Reconstruction workflow from local TeX, BibTeX, PDF, and figure inputs while delegating manuscript writing and figure generation to the user's visible ChatGPT Chat session. Use when the user asks YanShu or 研术台 to reconstruct, rewrite, continue, or recover a paper workflow.
---

# Paper Reconstruction

Paper Reconstruction is the first workflow in the extensible YanShu plugin. YanShu coordinates local paper materials, checkpoints, artifacts, compilation, and recovery. The user's visible ChatGPT Chat session writes the manuscript and generates the framework figure.

Follow the user's conversation language during onboarding and status updates. Prompt language is a separate workflow setting and may be Chinese or English.

## Non-negotiable boundary

- Do not write, rewrite, compress, or polish manuscript prose in Codex.
- Do not silently replace Chat with Work, Codex, an API model, or another model surface.
- Never pin a GPT model name in the workflow. Use the latest reasoning-capable model family visible in ChatGPT at execution time.
- Resolve the saved reasoning preference against the controls actually visible to the signed-in user. Do not infer availability from a subscription name.
- Keep all browser activity visible and user-directed. Never bypass login, CAPTCHA, confirmation, or upload permissions.
- Copy, paste, or upload only paths returned by the YanShu `next` command. Never transmit `.env` files, credentials, private keys, unrelated folders, or unapproved files.
- Prefer the run-scoped YanShu MCP workspace over browser attachments. Its original inputs are read-only, and its write tools are restricted to the current reconstruction run. Use browser attachment transfer only when the visible Chat surface cannot use the YanShu MCP connection.
- Never resubmit an original round after a timeout. Preserve the Chat thread URL and poll, wait, read, or continue that same thread.
- Store every downloaded artifact and status change inside the current YanShu run directory.
- Never apply a round's Chat configuration inside an unrelated conversation. Prepare a fresh blank Chat thread before inspecting or changing reasoning; `experience.open` alone does not create a new thread.
- After the manuscript root is unambiguous, do not ask whether the user wants automation or Prompt-only handoff. Open the bundled local page immediately; it supports both live Prompt access and full-automation launch.
- After local-page confirmation, do not ask for another summary confirmation or repeat any configured question. Pause only for a real login, CAPTCHA, permission, missing-file, or scientific decision blocker that cannot be resolved safely.

## Local runtime

Resolve the plugin root from this skill's directory, then invoke:

```text
node <plugin-root>/scripts/yanshu.mjs
```

Do not ask the user to type commands that Codex can run safely itself.

## Mandatory onboarding gate

This gate is required for every new Paper Reconstruction run. A paper directory does not imply consent to choose a manuscript or start automation.

1. Ask for the paper directory first. If it contains multiple papers or multiple plausible manuscript roots, show a compact inventory and ask the user to choose one; never select a paper at random.
2. Run `doctor --project <paper-root>` as a read-only check. If TeX, BibTeX, compiled PDF, and figures are unambiguous, do not ask the user to confirm them again; the local page displays the detected paths. Ask only when an actual ambiguity could change the selected inputs.
3. As soon as the manuscript root and inputs are unambiguous, follow **Local configuration and launch page** below. Do not ask an execution-surface question and do not collect paper type, length, appendix, figure, Prompt-language, or reasoning choices in chat.

Before the page's automation confirmation, do not run `init`, create a reconstruction directory, transmit manuscript content, open a live writing round, or submit a Prompt.

## Local configuration and launch page

After the manuscript root and inputs are unambiguous:

1. Run the local page with the exact confirmed paths:

```text
node <plugin-root>/scripts/yanshu.mjs configure-start \
  --project <paper-root> \
  --tex <confirmed-tex> \
  --bib <confirmed-bib> \
  --pdf <confirmed-pdf> \
  --figures <confirmed-figures> \
  --ui-language zh|en
```

Omit an unavailable optional input instead of inventing one. Add `--config <website-exported.yanshu.json>` when the user supplied a website configuration; the page uses it only as a prefill.

2. The command starts a loopback-only page on `127.0.0.1`, opens it in the user's browser, and returns a `sessionPath`. Tell the user only that the page is open. Do not restate or ask any option in chat.
3. The page must collect every remaining workflow choice in one place:
   - conference or journal;
   - no main-text limit, or an exact target with editable section budgets;
   - whether Method and Experiments are exempt when limits are active;
   - appendix allowed or not allowed;
   - Prompt language;
   - framework-figure canvas ratio, including custom width:height;
   - ChatGPT reasoning preference: `strongest`, `medium`, `high`, `extra-high`, or `pro`.
4. Every configuration change must refresh the five generated Prompts in the page's right rail. Each Prompt supports expand/collapse, independent Chinese/English switching, and copy; the page also supports copy all. This replaces the old Prompt-only execution question: a user who wants manual handoff can copy the Prompts and select **Exit** without creating a run.
5. The page has exactly two workflow exits:
   - **Start full automation**: confirm the configuration and authorize initialization;
   - **Exit**: cancel the local session without creating a run or transmitting anything.
6. Poll without prompting:

```text
node <plugin-root>/scripts/yanshu.mjs configure-status \
  --session <sessionPath>
```

Use bounded waits and concise progress updates. Do not ask the user to report that they clicked the button.
7. If status becomes `cancelled`, stop cleanly. Do not initialize, transmit manuscript content, or ask for replacement workflow choices.
8. The page's **Start full automation** action is the explicit start authorization. When status becomes `confirmed`, use the returned `configPath`; do not display another confirmation summary and do not ask the user to type “start”.
9. Immediately run the visible Chat bridge preflight from `references/chat-bridge.md`. This checks the bridge, login, Chat configuration, and whether the visible Chat surface can use the YanShu MCP connection. Clipboard, upload, and download checks are fallback checks, not the primary paper-delivery route.
10. If preflight succeeds, run `init --config <configPath>`, start the run-scoped MCP workspace described below, and proceed directly to Round 1. If preflight returns a real blocker, report only the exact required action. After the user resolves it, repeat preflight and continue with the same confirmed configuration without reopening the page or asking workflow questions.

The page is local infrastructure, not a hosted paper service. Do not replace its loopback URL with a public callback, do not place paper paths in a remote URL, and never expose its one-time token in user-facing summaries or logs.

For `strongest`, explain in the page copy that it is the strongest reasoning level actually visible to the signed-in account, not a fixed GPT model name.

## Start a new run

Only continue here after the local page reports `confirmed`.

Run `init` with:

- `--config <confirmed.yanshu.json>` for full automation; this already contains the exact paper paths and every workflow choice
- `--project <paper-root>`
- `--tex`, `--bib`, `--pdf`, and `--figures` when available
- `--style conference|journal`
- `--word-limit <number>|none`
- `--unlimited-core true|false`
- `--appendix true|false`
- `--language zh|en`
- `--figure-ratio landscape-4-3|landscape-3-2|landscape-16-9|landscape-2-1|portrait-3-4|portrait-9-16|custom`
- `--figure-ratio-width <number>` and `--figure-ratio-height <number>` for a custom ratio
- `--reasoning strongest|medium|high|extra-high|pro`

Report the created run directory before transmitting manuscript content.

The initializer creates `yanshu-reconstruction/<run-id>/` with five round folders, generated prompts, outputs, logs, and `run.json`. It does not modify or copy the original manuscript. Round 4 reconstructs only the Method Overview figure with the shared YanShu figure prompt. The canvas ratio remains configurable. Its default visual controls use an ultra-wide `2:1` pure-white canvas, the Tol Vibrant palette with a maximum `2–3` accent budget, Calibri, dark-neutral structural lines, extremely pale fills only for key regions, three type-size levels, no large in-figure title, and restrained paper-specific scientific forms when useful.

## Run-scoped MCP paper workspace

After `init`, start one workspace for the entire five-round run:

```text
node <plugin-root>/scripts/yanshu.mjs mcp-start \
  --run <run-path>
```

The command returns a health-checked loopback session and a concise `bootstrapPrompt`. The server is bound to exactly one run. Original TeX, BibTeX, PDF, and figure inputs are read-only. Text writes are atomic, previous versions are recoverable, and compilation occurs in isolated versioned build directories.

The bundled local MCP companion can be used directly by a compatible local ChatGPT/Codex plugin host. An external `chatgpt.com` conversation can use it only when the user has connected YanShu through an authenticated HTTPS MCP endpoint or supported secure tunnel. A loopback URL by itself is not remotely reachable. Do not pretend that the browser can call it, and never expose the unprotected local listener publicly. If the visible Chat surface has no YanShu MCP connection, continue through the approved real-file attachment route as a fallback.

When MCP is connected, the visible Chat model must follow this evidence sequence:

1. Call `yanshu_get_round_manifest` and read the exact Prompt artifact.
2. Read the latest relevant TeX and BibTeX artifacts.
3. Before Method, Experiments, Discussion, or any numeric claim, call `yanshu_get_evidence_index`.
4. Call `yanshu_view_image` for every result-bearing figure. For tables or visuals in the manuscript PDF, use `yanshu_search_pdf` to locate the page and `yanshu_view_image` to inspect that rendered page. Captions and filenames are navigation aids, not sufficient evidence.
5. Save complete outputs with `yanshu_write_round_artifact`, compile with `yanshu_compile_latex`, repair failures in the same Chat thread, and visually inspect relevant pages of the compiled PDF.
6. Call `yanshu_complete_round` only after required artifacts and compilation checks pass.

PDF rendering uses Poppler and returns actual page images to the model. PDF figures are rendered page by page; EPS figures use Ghostscript; PNG, JPEG, WebP, and SVG inputs are returned directly. The TeX evidence index preserves figure/table labels, captions, section context, table source, and the artifact id of each resolvable graphic. Missing or unreadable visual evidence must be reported, never guessed.

## Resolve the live ChatGPT configuration

Read `references/chat-bridge.md` before the first live Chat operation. YanShu includes a pinned visible Chat-control runtime, so users do not need a second delegation plugin.

For every round:

1. Prepare the target thread before touching configuration:
   - if the round already records a thread URL, reopen that exact URL;
   - otherwise call the YanShu `openFreshChatRound` helper from `references/chat-bridge.md`, which opens Chat and then explicitly calls `threads.new`.
   - never treat `experience.open` as proof that a new conversation exists, and never configure whatever conversation happened to be selected previously.
2. Run `configuration.inspect` with visible options included on that prepared thread.
3. Keep the model policy `latest-visible-reasoning`. If Chat exposes a model or model-version axis and its ordering is unambiguous, select the newest visible reasoning-capable family. Otherwise keep Chat's current latest/default reasoning family; never guess a hidden identifier.
4. Preserve the exact visible intelligence/reasoning labels in their displayed order and run:

```text
node <plugin-root>/scripts/yanshu.mjs chat-plan \
  --run <run-path> \
  --visible "<first label>|<second label>|<third label>"
```

5. Apply the returned `selectedLabel` through the YanShu `applyChatReasoningSelection` helper. It requests a non-strict upstream apply and then classifies the evidence:
   - `verified`: the active value is visibly readable and matches;
   - `click-acknowledged`: ChatGPT accepted the exact visible option, but its current UI exposes no reliable active-value readback. Continue with one concise warning; this alone is not a blocker;
   - block only when the option was not found or clicked, the new thread was not established, or visible readback explicitly contradicts the requested value.
6. If `fallbackApplied` is true, tell the user before submission in one sentence. For example: “Extra High is not available for this account, so YanShu will use High for this round.”
7. Record the actual visible model and reasoning labels plus `--configuration-verification verified|click-acknowledged`, not assumed backend identifiers.

The resolver uses these stable semantics:

- `strongest`: strongest visible option;
- `medium`: Medium-equivalent, otherwise strongest visible;
- `high`: High-equivalent → Medium-equivalent → strongest visible;
- `extra-high`: Extra High/xhigh-equivalent → High → Medium → strongest visible;
- `pro`: strongest Pro-equivalent → Extra High → High → Medium → strongest visible.

It recognizes current labels and common equivalents such as Thinking Standard, Thinking Extended, Thinking Heavy, Max, and Ultra. If renamed labels cannot be classified, it chooses the strongest option by the visible picker order. Never block a round solely because the requested level is unavailable.

## Chat bridge selection

Use the bundled runtime from a compatible Codex/Chrome bridge host. It does not contain credentials, a ChatGPT account, or a hidden browser session. If no compatible bridge exists:

1. Leave the initialized run intact.
2. Mark the current round `blocked` with the exact missing prerequisite.
3. Provide the manual prompt path and approved attachment list as a fallback.
4. Do not continue the writing round in Codex.

## Execute each round

For every round:

1. Run `next --run <run-path>`.
2. Run `mcp-status --run <run-path>`. Reuse the healthy run-scoped workspace; do not create another server for each round.
3. Prepare a fresh blank Chat thread before configuration unless the round already records a thread URL. A successful `experience.open` without `threads.new` is insufficient.
4. Resolve and apply the saved ChatGPT configuration as described above.
5. Mark the round `running`, recording the experience, model label, reasoning label, and configuration-verification level. A fresh blank thread may not receive its stable `/c/...` URL until the first message is submitted.
6. If the visible Chat thread has the YanShu MCP connection, submit only the `bootstrapPrompt` returned by `mcp-start`, with an empty file list. The model reads the round Prompt and all approved evidence through MCP and writes/compiles through MCP. Do not also upload the same sources.
7. If the visible Chat thread cannot use the MCP connection, submit the full generated Prompt and exactly the fallback `approvedAttachments` through `submitPreparedChatRound` from `references/chat-bridge.md`. It transfers approved `.tex`, `.bib`, `.pdf`, image, and other inputs as real files rather than pasting their contents as text. Prefer ChatGPT's visible file chooser and use native Windows file-object paste only as a fallback. The helper targets `thread: { type: "current" }` so the configured blank thread is reused; do not request another new thread at submission time.
8. Immediately record the returned `/c/...` thread URL. If submission returns no stable URL, preserve its partial result and stop instead of guessing a thread.
9. For long responses, keep the same thread and use bounded waits or status checks. Give the user a concise progress update at least once per minute while actively monitoring.
10. In MCP mode, treat successfully written YanShu artifacts as the source of truth; do not require duplicate downloads. In fallback mode, download and register every generated `.tex`, `.bib`, `.md`, PDF, PNG, or other explicit artifact.
11. If fallback Chat returns essential result text without a downloadable file, ask Chat in the same thread to provide the required artifact instead of copying paper prose through Codex.
12. Mark the round `completed` only after required artifacts are present and readable. In MCP mode, prefer the model's `yanshu_complete_round` call; verify local state rather than trusting conversational prose.
13. Move to the next fresh Chat thread. Later rounds read registered outputs and compiled PDFs from the same MCP run without re-uploading them.

## Compilation and correction

After a round produces TeX:

1. In MCP mode, the visible Chat model calls `yanshu_compile_latex`; the tool compiles in an isolated versioned workspace, registers the PDF, and returns a focused log tail. In attachment fallback mode, compile with the project's existing TeX toolchain in the round output directory or an isolated validation directory.
2. Treat build logs as diagnostics, not authorization for Codex to rewrite the manuscript.
3. For an MCP compilation error, Chat reads the returned log, writes a corrected artifact, and compiles again in the same thread. In fallback mode, copy and paste only the relevant log and affected files into the same Chat thread, then ask Chat to return corrected artifacts.
4. Register the corrected artifact without overwriting an existing file unless the replacement is explicit and recoverable.
5. Repeat until the document compiles or the workflow reaches a genuine user-input blocker.

## Resume an interrupted run

When the user asks to continue:

1. Locate `run.json` under the paper's `yanshu-reconstruction/` directory.
2. Run `status --run <run-path>`.
3. If a round has a recorded thread URL, reopen or reuse that exact visible Chat thread.
4. Run `next` and continue from the recorded state. Never create a duplicate round merely because Codex or the browser restarted.

## Completion

Finish only when all five rounds are completed, required artifacts are stored, the Round 4 PNG is readable, and the latest TeX artifact has been compilation-checked when a TeX engine is available. Return the run directory, final artifact paths, compilation result, and any remaining author decisions. Do not claim success based only on a Chat response.
