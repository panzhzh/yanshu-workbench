---
name: paper-reconstruction
description: Run a resumable five-round CS-paper reconstruction workflow from local TeX, BibTeX, PDF, and figure inputs while delegating manuscript writing and figure generation to the user's visible ChatGPT Chat session. Use when the user asks YanShu or 研术台 to reconstruct, rewrite, continue, or recover a paper workflow.
---

# YanShu paper reconstruction

Use YanShu as the coordinator for a local paper reconstruction. The manuscript writer is the user's visible ChatGPT Chat session; Codex owns local file selection, checkpoints, artifact handling, compilation, and error handoff.

## Non-negotiable boundary

- Do not write, rewrite, compress, or polish manuscript prose in Codex.
- Do not silently replace Chat with Work, Codex, an API model, or another model surface.
- Use the strongest visible Chat configuration actually available to the signed-in user. Inspect controls instead of assuming plan names or fixed model labels.
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

This gate is required for every new reconstruction run. Do not infer that the
user wants defaults merely because a paper directory is available.

1. Ask for the paper directory first. If the supplied directory contains
   multiple papers or multiple plausible manuscript roots, show a compact
   inventory and ask the user to choose one; never select a paper at random.
2. Run `doctor --project <paper-root>` as a read-only check. Show the detected
   TeX, BibTeX, compiled PDF, and figures paths, and ask the user to resolve any
   ambiguity that could change the run.
3. Collect explicit choices for:
   - execution surface: visible ChatGPT Chat for the automated bridge, or a
     prompt-only manual handoff for another unsupported chat surface;
   - paper type: conference or journal;
   - main-text word limit: disabled, or enabled with an exact target;
   - whether Method and Experiments are exempt from word limits;
   - appendix: allowed or not allowed;
   - Prompt language;
   - overall framework figure: single-column or double-column, plus canvas
     ratio (`4:3`, `3:4`, `16:9`, `9:16`, or a custom width:height ratio);
   - visible Chat model and reasoning effort when the user wants to override
     the strongest available setting.
4. Ask these questions in a short, readable sequence instead of presenting a
   command or silently filling gaps.
5. Display one concise confirmation summary with the exact paper paths and
   every selected option.
6. Wait for an explicit start confirmation such as “开始” or “确认开始”.

Before that confirmation, do not run `init`, create a reconstruction directory,
upload a file, open a live writing round, or submit a Prompt. A website-exported
configuration may prefill the choices, but the user must still see and confirm
the summary.

## Start a new run

Only continue here after the mandatory onboarding gate is confirmed.

1. Run `init` with:
   - `--project <paper-root>`
   - `--tex`, `--bib`, `--pdf`, and `--figures` when available
   - `--style conference|journal`
   - `--word-limit <number>|none`
   - `--unlimited-core true|false`
   - `--appendix true|false`
   - `--language zh|en`
   - `--figure-placement single-column|double-column`
   - `--figure-ratio landscape-4-3|portrait-3-4|landscape-16-9|portrait-9-16|custom`
   - `--figure-ratio-width <number>` and `--figure-ratio-height <number>` for
     a custom ratio
2. Report the created run directory before uploading anything.

The initializer creates a visible `yanshu-reconstruction/<run-id>/` directory with five round folders, generated prompts, outputs, logs, and `run.json`. It does not modify or copy the original manuscript. Round 4 reconstructs only the Method Overview figure with the shared YanShu figure prompt. The figure placement and ratio follow the confirmed choices. All other Round 4
visual rules are fixed: minimal paper linework; the Tol Vibrant palette with
explicit HEX/RGB references and two-to-four accents selected by Chat according
to semantics; Calibri; a pure-white canvas and pure-white module cards; exactly
two type-size levels; no large in-figure title; dark-neutral lines by default,
with semantic line colors only when needed; and restrained light illustrations
or icons only when useful.

## Chat bridge selection

Read `references/chat-bridge.md` before the first live Chat operation. YanShu includes a pinned visible Chat-control runtime, so users do not need to install a second delegation plugin. Use that runtime from a compatible Codex/Chrome bridge host.

The bundled runtime does not contain credentials, a ChatGPT account, or a Chrome bridge. If no compatible bridge exists:

1. Leave the initialized run intact.
2. Mark the current round `blocked` with the exact missing prerequisite.
3. Provide the manual prompt path as a fallback.
4. Do not continue the writing round in Codex.

## Execute each round

For every round:

1. Run `next --run <run-path>`.
2. Read only the returned prompt and approved attachment list.
3. Open a new visible Chat conversation for that round unless the run already records a thread URL.
4. Inspect the user's available Chat controls and select the strongest available reasoning configuration. If the user specified a lower setting, follow the user's choice.
5. Mark the round `running`, recording the visible thread URL, experience, model label, and effort label.
6. Upload only the approved attachments and submit the generated prompt exactly once.
7. For long responses, keep the same thread and use bounded waits or status checks. Give the user concise progress updates at least once per minute while actively monitoring.
8. Download every generated `.tex`, `.bib`, `.md`, PDF, PNG, or other explicit artifact into the round output directory. Register files with the `artifact` command.
9. If Chat returns essential result text without a downloadable file, ask Chat in the same thread to provide the required artifact instead of copying the paper prose through Codex.
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
