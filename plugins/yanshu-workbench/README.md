# YanShu

YanShu is an extensible research-workflow plugin. It is the installable layer
behind the [YanShu website](https://yanshu-workbench.pages.dev/): the website
configures a workflow, while the plugin executes against local materials in the
current Codex or CLI task by default. Visible ChatGPT sessions, an MCP paper
workspace, checkpoints, and persistent run records remain available for
explicit full-automation use.

The Cloudflare Pages URL above is the only public website deployment. Saved
ChatGPT Sites versions and `*.chatgpt.site` URLs are not YanShu release
targets.

The technical package ID remains `yanshu-workbench` for repository and install
compatibility. The product shown to users is **YanShu**.

## Workflows

| Workflow | Direct invocation | Status |
| --- | --- | --- |
| **Idea Discovery** | `$idea-discovery` | Developer preview |
| **Paper Drafting** | `$paper-drafting` | Developer preview |
| **Writing Diagnosis** | `$writing-diagnosis` | Developer preview |
| **Paper Reconstruction** | `$paper-reconstruction` | Developer preview |
| **Scientific Figure** | `$scientific-figure` | Developer preview |
| **Experimental Plotting** | `$experimental-plotting` | Developer preview |
| **Peer Review** | `$peer-review` | Developer preview |
| **Revision Planning** | `$revision-planning` | Developer preview |
| **Revision Audit** | `$revision-audit` | Developer preview |

These are nine independent sub-skills in the YanShu plugin, not modes inside
one skill. Every workflow supports direct `$skill-name` invocation and a
loopback-only desktop configuration page. Paper Reconstruction first asks the
user to choose Web ChatGPT or Current CLI; the CLI choice uses one compact
inline configuration.
Idea Discovery, Paper Drafting, Writing Diagnosis, Scientific Figure,
Experimental Plotting, Peer Review, Revision Planning, and Revision Audit are
bundled directly from the website's canonical configuration and Prompt
builders. Paper Reconstruction runs five resumable rounds, including a
dedicated Method Overview figure round. The sync check fails when any bundled
plugin runtime is stale.

## Language

The plugin manifest, workflow name, skill instructions, and internal identifiers
are written in English for public distribution. YanShu follows the user's
conversation language during onboarding, and Paper Reconstruction supports
independent Chinese or English Prompt output.

## Install the GitHub preview

YanShu is not yet listed in the universal public Plugins Directory. Install the
repository marketplace once:

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

The install surface groups YanShu's optional GitHub connection with its other
dependencies, so the user decides once and every YanShu workflow can reuse the
same connection. On first use, YanShu uses GitHub's dedicated additive,
idempotent action to ensure the public `panzhzh/yanshu-workbench` repository is
starred, then stores a local receipt. An existing star is never removed;
YanShu never calls Unstar or reads unrelated repositories for this action.
Skipping or declining the connection never blocks a research workflow and is
not asked again inside later workflows.

Connector sign-in and host action approval are separate platform layers.
YanShu consolidates the install-time connection and avoids its own repeated
requests, but it never changes the user's global Codex approval policy. If the
host still requests one write confirmation, the permission mode selected by
the user remains authoritative.

For an existing preview installation, refresh and reinstall it:

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

Then start a **new Codex task** so the installed skills are loaded. Ask for any
core workflow:

```text
Use $idea-discovery to find research ideas in this workspace.
Use $paper-drafting to draft a paper from this experiment directory.
Use $writing-diagnosis to diagnose recurring writing problems in this manuscript.
Use $paper-reconstruction to reconstruct this paper directory.
Use $scientific-figure to create one research figure for this paper.
Use $experimental-plotting to create a publication plot from this experiment directory.
Use $peer-review to review the manuscript in this directory.
Use $revision-planning to organize these reviews and build a revision plan.
```

```text
Use $revision-audit to audit this revised manuscript and response.
```

The current preview starts from Codex; an ordinary Chat conversation does not
load this local plugin directly. Configurable Skills execute in the current
Codex or CLI task by default. Visible ChatGPT and persistent run records are
used only when the user explicitly requests them. Paper Reconstruction never
guesses its executor from the environment: the user explicitly selects Web
ChatGPT or the current CLI before configuration.

Chinese is equally valid:

```text
使用 $idea-discovery 在当前工作区查找研究 Idea。
使用 $paper-drafting 根据这个实验目录撰写论文初稿。
使用 $writing-diagnosis 诊断这个论文目录中的学术写作问题。
使用 $paper-reconstruction 重构这个论文目录。
使用 $scientific-figure 为这个论文目录绘制一张科研配图。
使用 $experimental-plotting 根据这个实验目录绘制论文实验图。
使用 $peer-review 审稿这个论文目录。
使用 $revision-planning 整理这些审稿意见并制定返修计划。
使用 $revision-audit 审查这份返修稿和回复信。
```

For configurable Skills, **Start full automation** authorizes uninterrupted
execution and returns control to the current task. The default delivery is
lightweight: analysis appears in chat, safe repairs update only approved files,
and creation workflows keep only real artifacts such as Markdown idea reports,
LaTeX/PDF, PNG, plotting code, and necessary derived data. YanShu does not add
Prompt copies, configuration snapshots, generic Markdown reports, or
`run.json` files merely for bookkeeping. A visible ChatGPT executor, saved
report, or persistent run directory is enabled only when the user asks for it.
Idea Discovery's bilingual Markdown and Paper Reconstruction's round artifacts
remain required core deliverables.

Paper Reconstruction first asks once which executor to use. Web ChatGPT
usually provides stronger academic writing, but requires an active ChatGPT
login and authorization for browser control plus the required file
access/uploads. Current CLI is more convenient and browser-free, but its
academic writing may be weaker. YanShu then asks for the workspace once and
requests a paper choice only when it contains multiple plausible manuscript
roots. After the paper is fixed, Web ChatGPT opens the setup page on
`127.0.0.1`; Current CLI asks once for conference/journal, appendix allowance,
and optional main-text word guidance, then executes in the current task without
spawning a nested Codex process.
**Start full automation** or the compact CLI configuration reply is the sole
launch authorization; **Exit** closes the page path without creating a run or
transmitting files.
Configuration receipts and machine state remain private to the runtime:
YanShu consumes the confirmed session directly and never opens internal JSON
files in Chrome, the in-app browser, or an editor.

Once YanShu is accepted into the public directory, installation can use the
normal **Plugins → search “YanShu” → + → new task** flow described in the
[OpenAI plugin guide](https://learn.chatgpt.com/docs/plugins).

## ChatGPT execution policy

YanShu stores capability intent rather than a brittle GPT model string:

- **Model policy:** latest visible reasoning-capable model
- **Default reasoning:** strongest visible level
- **Selectable preferences:** Medium, High, Extra High, and Pro
- **Default Pro policy:** Pro for the first effective interaction of each round,
  then Extra High for continuations, corrections, and artifact follow-ups
- **Optional override:** force every interaction to Pro, with an explicit
  long-runtime warning
- **Fallback:** closest lower supported level, then strongest visible when
  labels cannot be interpreted

For example, if Extra High or Pro is requested but the signed-in account exposes
only Medium and High, YanShu announces the fallback and selects High. It inspects
the live picker every round and records the actual visible labels in `run.json`.
This keeps the workflow stable when OpenAI changes model or reasoning-level
names.

Each round explicitly creates a blank Chat thread before changing reasoning or
pasting approved files, so YanShu never reconfigures the conversation the user
happened to have open. A matching visible readback is recorded as `verified`. If ChatGPT
accepts the exact visible option but its current UI exposes no reliable active
label, YanShu records `click-acknowledged` and continues; missing clicks, stale
threads, and explicit contradictory readback remain blockers.

Waiting is owned by the YanShu runtime rather than repeated manual checks:
Medium and High use 60-second heartbeats, Extra High uses 180 seconds, and Pro
uses 300 seconds. Under the default Pro policy, only each round's first
effective interaction uses the Pro interval; follow-ups use the Extra High
interval. A heartbeat timeout never resubmits a Prompt. Browser states
are normalized to `generating`, `completed`, `needs_continuation`, `blocked`,
or `failed` using generation signals, stable assistant turns, and artifact
presence.

A `generating` heartbeat keeps the same Codex task active and starts the next
bounded wait automatically; it never produces a final response or asks the user
to reply “continue.” After each finalized round, YanShu immediately starts the
next one. When persistent goals are available, the confirmed full-automation
action keeps that five-round objective alive across ordinary turn boundaries
and context compaction.

## Thin executor adapters

Paper Reconstruction keeps one workflow and three small transport choices:

- `visible-chatgpt` is the user's Web ChatGPT choice and retains the browser behavior;
- `codex-host` lets Codex CLI execute the saved Prompts and local artifacts
  directly. Round 4 uses an available image generator or renders a vector
  schematic locally when none is available. Every round receives
  an isolated `workspace/`; Codex writes only there, and YanShu atomically imports
  complete artifacts into the managed `output/`;
- `external` exposes the same Prompt, material, state, and artifact contract for
  a user-maintained Claude CLI or other integration.

New runs do not use environment-based `auto` selection. YanShu records the
user's Web ChatGPT or Current CLI choice before creating a run. YanShu does not
maintain product-specific Claude selectors or APIs. Every adapter must return
the same canonical files and pass the same compilation, reference, figure, and
recovery gates.

Before Round 5, the runtime also generates an automation-only Prompt handoff
that names the exact Round 4 PNG and every identifiable stale framework
reference. This requirement is intentionally absent from the generic website
Prompt.

The website's Paper Reconstruction page can export these settings in a
`.yanshu.json` file and use them to prefill the Web ChatGPT launch page. Current
CLI deliberately asks only the three compact configuration fields. Runtime
inspection is always the source of truth.

## Trust boundary

YanShu never receives hidden ChatGPT access and does not use an API key. Its
Web ChatGPT adapter includes a pinned copy of the unofficial
`codex-chatgpt-control` visible-session runtime, with its source revision,
checksum, and MIT notice recorded in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). That adapter requires a
signed-in ChatGPT session and a compatible Codex/Chrome bridge; Codex CLI and
external adapters use their own host capabilities instead.

The original manuscript remains in place. Generated prompts, downloaded
artifacts, logs, and status are stored under:

```text
<paper-root>/yanshu-reconstruction/<run-id>/
```

`STATUS.md` in that directory is the canonical human-readable progress view.
`run.json` and `events.jsonl` retain machine-readable checkpoints such as
`submitted`, `generating`, `artifact-ready`, `artifact-imported`,
`correction-requested`, `compiled`, `validated`, and `finalized`.

The preferred execution path is the bundled **YanShu Paper Workspace** MCP
server. It exposes only the selected run and provides focused tools to:

- read the exact round Prompt and approved TeX/BibTeX sources;
- index TeX figure/table labels, captions, section context, and graphic paths;
- return TeX-referenced PNG/JPEG/WebP/SVG/PDF/EPS figures as image content even
  when a compiled paper PDF is also present;
- render PDF pages and PDF figures through Poppler, and EPS figures through
  Ghostscript, so Chat can inspect actual pixels before writing experiments;
- search PDF text to locate a table, figure, metric, or section before
  rendering the relevant page;
- save versioned round artifacts without overwriting the original paper;
- compile LaTeX in an isolated build directory and return a focused error log.

Start the run-scoped local endpoint with:

```bash
node scripts/node-launcher.cjs scripts/yanshu.mjs mcp-start --run <run-path>
```

The returned loopback URL is private to the current computer. A compatible
local plugin host can use the bundled MCP companion directly. External
`chatgpt.com` needs an authenticated HTTPS MCP connection or supported secure
tunnel; a loopback URL alone is not remotely reachable. When that connection is
unavailable, YanShu first performs a zero-sensitive visible `yanshu_health`
handshake, then automatically tests a real two-file `.tex`/`.bib` attachment
fallback. A successful fallback hands only the latest necessary `.tex`,
complete current `.bib`, and `.pdf` artifacts to ChatGPT as real files; Round 4 needs no BibTeX,
and Round 5 adds only the reconstructed PNG. It does not accumulate old reports,
superseded rounds, or source figures already rendered in the PDF. It prefers
the visible file chooser and keeps native Windows file-object clipboard paste
as the final fallback. Text-output rounds return complete TeX, report, and
current BibTeX files in one validated ZIP for a single download and deterministic
import. Generated files are inventoried by assistant turn and downloaded by
canonical artifact name through the real browser download event. Browser aliases
such as `file (1).zip` are normalized only at import.

Imports and replacements are atomic. Superseded artifacts move into visible
`revisions/` folders with SHA-256, Chat turn, timestamp, and reason. LaTeX and
PDF tools use an ephemeral ASCII staging directory for Windows paths containing
spaces or Chinese characters, while logs, staging records, PDFs, and progress
remain in the paper's YanShu run directory. `round-finalize` imports, compiles,
checks graphics, citations, BibTeX continuity, appendix policy, word budgets,
framework integration, and compile diagnostics before completion. The final
round writes `final-manifest.json` with hashes, Chat URLs, actual reasoning
labels, transfer mode, validation results, and the revision chain.

YanShu never bypasses login, CAPTCHA, permissions, or confirmation.

## Runtime compatibility and updates

Use the compatibility launcher rather than invoking the ESM entry directly:

```bash
node scripts/node-launcher.cjs scripts/yanshu.mjs doctor --project <paper-root>
```

It selects Node 22 or newer, including the bundled Codex runtime on Windows,
and loads Windows drive paths through `file://` URLs. `version-handshake`
refreshes a stale marketplace/plugin automatically. New runs use the latest
Prompt snapshot; resumed runs retain their saved Prompt files and workflow
version while using the current compatible execution runtime.

## Developer commands

From `site/`, rebuild the committed Prompt runtime after changing templates or
shared workflow configuration:

```bash
npm run plugin:bundle
npm run plugin:check
```

`plugin:check` compares the generated runtime byte for byte with the website's
canonical TypeScript Prompt sources and runs before the website test build.
Validate the skill and plugin with the OpenAI plugin and skill validators before
distribution.
