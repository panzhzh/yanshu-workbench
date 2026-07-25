# 研术台 · YanShu Workbench plugin

This plugin is the local coordinator for YanShu's CS-paper workflows. It keeps a recoverable run directory, generates the same configuration-driven reconstruction prompts as the website, delegates manuscript writing to the user's visible ChatGPT Chat session, and reserves Codex for file operations, checkpoints, compilation, and error handoff.

## Current scope

- Five-round paper reconstruction, including a dedicated Method Overview figure round
- Conference and journal structures
- Optional main-text and section budgets
- Optional unlimited Method and Experiments mode
- Appendix policy
- Chinese or English prompts
- Resumable round and Chat-thread state
- Explicit attachment allowlist

## Trust boundary

The plugin never receives hidden ChatGPT access and does not use an API key. It includes a pinned copy of the unofficial `codex-chatgpt-control` visible-session runtime, with its source revision, checksum, and MIT notice recorded in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). Full automation still requires a signed-in visible ChatGPT session and a compatible Codex/Chrome browser bridge.

The bridge adapter remains replaceable so YanShu can adopt an official handoff mechanism later without changing its workflow or run format.

The original manuscript remains in place. Generated prompts, downloaded artifacts, logs, and status are stored under:

```text
<paper-root>/yanshu-reconstruction/<run-id>/
```

## Developer-preview install

After this plugin version is published to the repository:

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

Start a new Codex task after installation, then ask:

```text
用研术台重构这个论文目录，并优先使用当前账号可用的最强 Chat 配置。
```

YanShu performs a read-only preflight before creating a run or uploading a file. The first real upload may still require the user to enable the Chrome file-URL permission and the Codex Chrome upload permission.

## Developer commands

From `site/`, rebuild the committed prompt runtime after changing prompt templates:

```bash
npm run plugin:bundle
```

Validate the plugin with the OpenAI plugin creator validator before distribution.
