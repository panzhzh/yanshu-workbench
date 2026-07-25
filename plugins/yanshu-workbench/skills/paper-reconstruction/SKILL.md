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
- Upload only paths returned by the YanShu `next` command. Never upload `.env` files, credentials, private keys, unrelated folders, or unapproved files.
- Never resubmit an original round after a timeout. Preserve the Chat thread URL and poll, wait, read, or continue that same thread.
- Store every downloaded artifact and status change inside the current YanShu run directory.

## Local runtime

Resolve the plugin root from this skill's directory, then invoke:

```text
node <plugin-root>/scripts/yanshu.mjs
```

Do not ask the user to type commands that Codex can run safely itself.

## Mandatory onboarding gate

This gate is required for every new Paper Reconstruction run. A paper directory does not imply consent to use defaults.

1. Ask for the paper directory first. If it contains multiple papers or multiple plausible manuscript roots, show a compact inventory and ask the user to choose one; never select a paper at random.
2. Run `doctor --project <paper-root>` as a read-only check. Show the detected TeX, BibTeX, compiled PDF, and figures paths. Ask the user to resolve any ambiguity that could change the run.
3. Collect explicit choices for:
   - execution surface: visible ChatGPT Chat through the automated bridge, or prompt-only manual handoff for an unsupported chat surface;
   - paper type: conference or journal;
   - main-text word limit: disabled, or enabled with an exact target;
   - whether Method and Experiments are exempt from word limits;
   - appendix: allowed or not allowed;
   - Prompt language;
   - overall framework figure: single-column or double-column, plus canvas ratio (`4:3`, `3:4`, `16:9`, `9:16`, or a custom width:height ratio);
   - ChatGPT reasoning preference: `strongest`, `medium`, `high`, `extra-high`, or `pro`.
4. Describe `strongest` as the default. Explain that this is a stable capability preference, not a fixed GPT model name.
5. Ask these questions in a short, readable sequence instead of presenting a command or silently filling gaps.
6. Display one concise confirmation summary with the exact paper paths and every selected option.
7. Wait for an explicit start confirmation such as “开始”, “确认开始”, or “start”.

Before that confirmation, do not run `init`, create a reconstruction directory, upload a file, open a live writing round, or submit a Prompt. A website-exported configuration may prefill the choices, but the user must still see and confirm the summary.

## Start a new run

Only continue here after the onboarding gate is confirmed.

Run `init` with:

- `--config <path-to-exported.yanshu.json>` when the user supplied a website configuration
- `--project <paper-root>`
- `--tex`, `--bib`, `--pdf`, and `--figures` when available
- `--style conference|journal`
- `--word-limit <number>|none`
- `--unlimited-core true|false`
- `--appendix true|false`
- `--language zh|en`
- `--figure-placement single-column|double-column`
- `--figure-ratio landscape-4-3|portrait-3-4|landscape-16-9|portrait-9-16|custom`
- `--figure-ratio-width <number>` and `--figure-ratio-height <number>` for a custom ratio
- `--reasoning strongest|medium|high|extra-high|pro`

Report the created run directory before uploading anything.

The initializer creates `yanshu-reconstruction/<run-id>/` with five round folders, generated prompts, outputs, logs, and `run.json`. It does not modify or copy the original manuscript. Round 4 reconstructs only the Method Overview figure with the shared YanShu figure prompt. The confirmed placement and ratio remain configurable. Its other visual rules remain fixed: minimal paper linework; the Tol Vibrant palette with explicit HEX/RGB references and two-to-four accents selected by Chat according to semantics; Calibri; a pure-white canvas and pure-white module cards; exactly two type-size levels; no large in-figure title; dark-neutral lines by default, with semantic line colors only when needed; and restrained light illustrations or icons only when useful.

## Resolve the live ChatGPT configuration

Read `references/chat-bridge.md` before the first live Chat operation. YanShu includes a pinned visible Chat-control runtime, so users do not need a second delegation plugin.

For every round:

1. Open the Chat experience and run `configuration.inspect` with visible options included.
2. Keep the model policy `latest-visible-reasoning`. If Chat exposes a model or model-version axis and its ordering is unambiguous, select the newest visible reasoning-capable family. Otherwise keep Chat's current latest/default reasoning family; never guess a hidden identifier.
3. Preserve the exact visible intelligence/reasoning labels in their displayed order.
4. Run:

```text
node <plugin-root>/scripts/yanshu.mjs chat-plan \
  --run <run-path> \
  --visible "<first label>|<second label>|<third label>"
```

5. Apply the returned `selectedLabel` strictly through `configuration.apply`.
6. If `fallbackApplied` is true, tell the user before submission in one sentence. For example: “Extra High is not available for this account, so YanShu will use High for this round.”
7. Record the actual visible model and reasoning labels, not assumed backend identifiers.

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
3. Provide the manual prompt path as a fallback.
4. Do not continue the writing round in Codex.

## Execute each round

For every round:

1. Run `next --run <run-path>`.
2. Read only the returned prompt and approved attachment list.
3. Open a new visible Chat conversation for that round unless the run already records a thread URL.
4. Resolve and apply the saved ChatGPT configuration as described above.
5. Mark the round `running`, recording the visible thread URL, experience, model label, and reasoning label.
6. Upload only the approved attachments and submit the generated prompt exactly once.
7. For long responses, keep the same thread and use bounded waits or status checks. Give the user a concise progress update at least once per minute while actively monitoring.
8. Download every generated `.tex`, `.bib`, `.md`, PDF, PNG, or other explicit artifact into the round output directory. Register files with the `artifact` command.
9. If Chat returns essential result text without a downloadable file, ask Chat in the same thread to provide the required artifact instead of copying paper prose through Codex.
10. Mark the round `completed` only after required artifacts are present and readable.
11. Move to the next round. Later rounds may receive registered outputs from completed rounds in addition to the original approved inputs.

## Compilation and correction

After a round produces TeX:

1. Compile it with the project's existing TeX toolchain in the round output directory or an isolated validation directory.
2. Treat build logs as diagnostics, not authorization for Codex to rewrite the manuscript.
3. For a compilation error, upload only the relevant log and affected files to the same Chat thread, then ask Chat to return corrected artifacts.
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
