# YanShu

YanShu is an extensible research-workflow plugin. It is the installable layer
behind the [YanShu website](https://yanshu-workbench.pages.dev/): the website
configures a workflow, while the plugin coordinates local materials, visible
ChatGPT sessions, an MCP paper workspace, checkpoints, artifacts, compilation,
and recovery.

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
| **Paper Reconstruction** | `$paper-reconstruction` | Developer preview |
| **Scientific Figure** | `$scientific-figure` | Developer preview |

These are four independent sub-skills in the YanShu plugin, not modes inside
one skill. Every workflow supports direct `$skill-name` invocation and opens
one loopback-only configuration page before execution.
Idea Discovery, Paper Drafting, and Scientific Figure are bundled directly from
the website's canonical configuration and Prompt builders. Paper Reconstruction
runs five resumable rounds, including a dedicated Method Overview figure round.
The sync check fails when any bundled plugin runtime is stale.

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
Use $paper-reconstruction to reconstruct this paper directory.
Use $scientific-figure to create one research figure for this paper.
```

The current preview starts from Codex; an ordinary Chat conversation does not
load this local plugin directly. Once started, YanShu delegates manuscript
writing to a visible ChatGPT Chat session through its bridge.

Chinese is equally valid:

```text
使用 $idea-discovery 在当前工作区查找研究 Idea。
使用 $paper-drafting 根据这个实验目录撰写论文初稿。
使用 $paper-reconstruction 重构这个论文目录。
使用 $scientific-figure 为这个论文目录绘制一张科研配图。
```

YanShu asks for the workspace once and asks the user to choose only when it
contains multiple plausible paper roots. It then opens a setup page on
`127.0.0.1` instead of collecting options one by one in chat. The right rail
shows the exact website-sourced Prompt live. Paper Reconstruction shows all
five round Prompts. **Start full automation** is the sole launch authorization;
**Exit** closes the page without creating a run or transmitting files.

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

The website's Paper Reconstruction page can export these settings in a
`.yanshu.json` file and use them to prefill the same local launch page. Without
an export, every setting remains available on the local page; YanShu does not
collect those choices one by one in chat. Runtime inspection is always the
source of truth.

## Trust boundary

YanShu never receives hidden ChatGPT access and does not use an API key. It
includes a pinned copy of the unofficial `codex-chatgpt-control` visible-session
runtime, with its source revision, checksum, and MIT notice recorded in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). Full automation still
requires a signed-in visible ChatGPT session and a compatible Codex/Chrome
browser bridge.

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
