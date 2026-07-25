# YanShu

YanShu is an extensible research-workflow plugin. It is the installable layer
behind the [YanShu website](https://yanshu-workbench.pages.dev/): the website
configures a workflow, while the plugin coordinates local materials, visible
ChatGPT sessions, checkpoints, artifacts, compilation, and recovery.

The technical package ID remains `yanshu-workbench` for repository and install
compatibility. The product shown to users is **YanShu**.

## Workflows

| Workflow | Skill ID | Status |
| --- | --- | --- |
| **Paper Reconstruction** | `paper-reconstruction` | Developer preview |

Paper Reconstruction runs five resumable rounds, including a dedicated Method
Overview figure round. More YanShu workflows can be added later without turning
each workflow into a separate plugin.

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

For an existing preview installation, refresh and reinstall it:

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

Then start a **new Codex task** so the installed skill is loaded. Ask:

```text
Use YanShu → Paper Reconstruction.
```

The current preview starts from Codex; an ordinary Chat conversation does not
load this local plugin directly. Once started, YanShu delegates manuscript
writing to a visible ChatGPT Chat session through its bridge.

Chinese is equally valid:

```text
使用 YanShu 的 Paper Reconstruction 重构这个论文目录。
```

YanShu asks for the paper directory first and confirms the detected TeX,
BibTeX, PDF, and figures. After the user selects full automation, YanShu opens a
loopback-only setup page on `127.0.0.1`. Paper type, length and section budgets,
appendix, Prompt language, framework figure, and ChatGPT reasoning are selected
once on that page. **Confirm and start automation** is the sole start
authorization: YanShu then checks the visible ChatGPT/Chrome permissions and
continues without repeating configuration questions in chat.

Once YanShu is accepted into the public directory, installation can use the
normal **Plugins → search “YanShu” → + → new task** flow described in the
[OpenAI plugin guide](https://learn.chatgpt.com/docs/plugins).

## ChatGPT execution policy

YanShu stores capability intent rather than a brittle GPT model string:

- **Model policy:** latest visible reasoning-capable model
- **Default reasoning:** strongest visible level
- **Selectable preferences:** Medium, High, Extra High, and Pro
- **Fallback:** closest lower supported level, then strongest visible when
  labels cannot be interpreted

For example, if Extra High or Pro is requested but the signed-in account exposes
only Medium and High, YanShu announces the fallback and selects High. It inspects
the live picker every round and records the actual visible labels in `run.json`.
This keeps the workflow stable when OpenAI changes model or reasoning-level
names.

The website's Paper Reconstruction page can export these settings in a
`.yanshu.json` file. Without an exported configuration, the plugin asks during
onboarding. Runtime inspection is always the source of truth.

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

The first real upload may require the user to enable Chrome file-URL access and
the Codex Chrome upload permission. YanShu never bypasses login, CAPTCHA,
permissions, or confirmation.

## Developer commands

From `site/`, rebuild the committed Prompt runtime after changing templates or
shared workflow configuration:

```bash
npm run plugin:bundle
```

Validate the skill and plugin with the OpenAI plugin and skill validators before
distribution.
