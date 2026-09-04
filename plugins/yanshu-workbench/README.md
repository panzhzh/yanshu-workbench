# YanShu

YanShu is the installable execution layer for the [YanShu Workbench](https://yanshu-workbench.pages.dev/). The website is useful for inspecting and copying configurable Prompts; the plugin reads the same Prompt source and executes directly against local materials in the current Codex or CLI task.

The Cloudflare Pages URL above is the only public website deployment. `*.chatgpt.site` addresses are not release targets.

## Workflows

| Workflow | Invoke with |
| --- | --- |
| Idea Discovery | `$idea-discovery` |
| Paper Drafting | `$paper-drafting` |
| Citation Audit | `$citation-audit` |
| Paper Reconstruction | `$paper-reconstruction` |
| Scientific Figure | `$scientific-figure` |
| Image to SVG | `$image-to-svg` |
| Experimental Plotting | `$experimental-plotting` |
| Peer Review | `$peer-review` |
| Revision Planning | `$revision-planning` |
| Revision Audit | `$revision-audit` |

These are independent sub-skills, not modes within one Skill. Their public names and technical identifiers are English; conversation and Prompt language may be Chinese or English.

## Install or update

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

For an existing installation:

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

Create a new Codex task after installation or update so the current Skill snapshot is loaded. Then use one sentence:

```text
Use $idea-discovery to find research ideas in this workspace.
Use $paper-drafting to draft a paper from this experiment directory.
Use $citation-audit to verify and strengthen citations in this manuscript.
Use $paper-reconstruction to reconstruct this paper directory.
Use $scientific-figure to create one research figure for this paper.
Use $image-to-svg to reconstruct this raster image as an editable SVG.
Use $experimental-plotting to create a publication plot from this experiment directory.
Use $peer-review to review this manuscript independently.
Use $revision-planning to organize these reviews into a revision plan.
Use $revision-audit to verify this response and revised manuscript.
```

Chinese requests work equally well.

## Direct execution model

Every Skill:

1. performs an automatic version handshake through the compatibility launcher;
2. identifies the real workspace and approved evidence;
3. infers preferences explicitly stated by the user and applies website defaults to everything else;
4. calls `workflow-resolve` internally to obtain the canonical website-sourced Prompt;
5. executes that Prompt in the current task and returns only real deliverables or a concise in-chat result.

Skills do not open a local configuration page, internal JSON file, browser bridge, visible ChatGPT session, or nested Codex process. When a missing choice would materially change the result and cannot be inferred, YanShu groups it into one compact question.

Analysis workflows—Peer Review, Revision Planning, Revision Audit, and audit-only Citation Audit—return their result in chat by default. Creation and repair workflows keep only their real artifacts, such as bilingual Idea reports, LaTeX/PDF, revised TeX/BibTeX, PNG, editable SVG, plotting code, and derived data. No Prompt copy, configuration snapshot, generic report, or `run.json` is created merely for bookkeeping.

Paper Reconstruction is one external task with four internal steps: scientific positioning and structure, Method and Experiments, narrative refinement, and source-aware quality regression. It creates no round folders, intermediate manuscripts, or framework image and delivers exactly:

```text
<base_name>_restructured.tex
<base_name>_restructured.bib
<base_name>_restructuring_report_zh.md
```

## Optional external Skills

Paper Drafting may use the single `research-paper-writing` sub-skill, and Experimental Plotting may use the single `nature-figure` sub-skill. YanShu asks for one consent covering only those allowlisted subdirectories and never installs either complete third-party repository. Scientific Figure does not use these external Skills.

If an already-connected GitHub capability exposes an additive, idempotent Star action, YanShu may ensure that the public `panzhzh/yanshu-workbench` repository is starred once and record a local receipt. It never calls Unstar, reads unrelated repositories, or blocks research work when the capability is unavailable or declined.

## Development synchronization

Website configuration and Prompt builders are canonical. The plugin runtimes are generated from them:

```bash
cd site
nvm use 22
npm run plugin:bundle
npm run plugin:check
```

The compatibility launcher selects Node 22 or newer and handles Windows, paths with spaces, and non-ASCII workspace paths. Internal resolver JSON is consumed programmatically and is never opened in a user-visible tab.

See [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for vendored and referenced open-source licenses.
