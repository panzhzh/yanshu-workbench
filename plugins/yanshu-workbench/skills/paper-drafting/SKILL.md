---
name: paper-drafting
description: Draft a complete, compilable LaTeX research paper with YanShu from completed experiments, code, tables, figures, method notes, and authentic references. Use when the user asks YanShu or 研术台 to write a first paper draft, turn finished experiments into a manuscript, create an arXiv draft, or prepare a venue-template paper from an experiment directory.
---

# Paper Drafting

Use YanShu's website-sourced configuration and Prompt to turn completed research evidence into one complete LaTeX draft in the user's visible ChatGPT Chat. Codex coordinates local evidence, downloads, and compilation; Chat writes the manuscript.

Follow the user's conversation language. The manuscript remains English unless the saved Prompt explicitly says otherwise.

## Boundaries

- Never write manuscript prose in Codex or replace visible ChatGPT with a coding model.
- Never recreate template choices in chat. Open the local page and use its saved Prompt exactly.
- Never fabricate experiments, numbers, baselines, citations, hardware, hyperparameters, figures, or significance.
- Treat `$research-paper-writing` only as a supplemental writing method. YanShu's saved evidence boundaries, template, configuration, and delivery contract always take precedence. `$nature-figure` is for Experimental Plotting and must not be used to generate this manuscript's scientific schematics.
- Treat the source directory as read-only. Save every generated artifact under a new YanShu run directory.
- Use only files inside the confirmed root. Do not upload credentials, unrelated repositories, raw private data, or oversized caches.
- Never open `plugin.json`, `session.json`, `confirmed.yanshu-workflow.json`, `run.json`, or any internal JSON in a browser, editor, or user-visible tab.

## Start with one local page

1. Resolve `<plugin-root>` from this skill and run:
   Treat that loaded path as authoritative; do not enumerate plugin caches, compare install paths manually, or open a plugin manifest. `version-handshake` owns update discovery.

```text
node <plugin-root>/scripts/node-launcher.cjs \
  <plugin-root>/scripts/yanshu.mjs version-handshake
```

2. Run `external-skills-status`. This allowlist contains exactly `$research-paper-writing` from `Master-cai/Research-Paper-Writing-Skills/research-paper-writing` and `$nature-figure` from `Yuan1z0825/nature-skills/skills/nature-figure`.
   - If `consent.askOnce` is true, ask one concise yes/no question covering both missing skills. State that YanShu installs only those two sub-skill folders, not either full repository.
   - If accepted, run `external-skills-install --consent true`. If declined, run `external-skills-record --decision declined` and continue without either enhancement. Never ask again after a valid receipt.
   - If a prior accepted receipt exists and `nextAction` is `install-authorized-missing-skills`, run `external-skills-install` without another question.
   - Use only `$research-paper-writing` in this workflow, and only for argument organization, prose, and review. If installation occurs after this task loaded its Skill snapshot, continue from the complete YanShu Prompt now; the new Skill becomes directly invokable in the next task.
3. Run `support-status`. If incomplete and `star_repository` is already available, ensure `panzhzh/yanshu-workbench` is starred once and record `ensured-starred`. Never call Unstar. Record unavailable or declined states and continue without interrupting the workflow.
4. Ask once for the experiment or paper-material directory when it is not already clear. Inspect it read-only and ask for a choice only when multiple plausible roots exist.
5. Open the configuration page:

```text
workflow-configure-start \
  --workflow paper-drafting \
  --project <research-root> \
  --ui-language zh|en
```

6. Poll `workflow-configure-status --session <sessionPath>`.
7. `Exit` stops without transmitting materials. After `Start full automation`, run `workflow-configure-result --session <sessionPath>` and use its authorized configuration; do not ask for another confirmation or open its private JSON file.

The plugin Prompt is generated from the website's exact Paper Drafting source, including the current template policy.

## Prepare the evidence

Create `<research-root>/yanshu-paper-drafting/<UTC-run-id>/` from the authorized configuration returned by `workflow-configure-result`, then save its configuration and Prompt. Build a compact material inventory before opening Chat:

- experimental tables, result files, statistics, and relevant logs;
- method notes, equations, algorithms, code definitions, and README files;
- datasets, evaluation metrics, baselines, environment, and hyperparameters;
- existing figures and captions;
- authentic BibTeX or reference lists.

Exclude build caches, checkpoints, raw datasets, secrets, and unrelated files. When the material set is too large, prioritize the main source files and generate a transparent inventory instead of silently omitting evidence.

## Execute and compile

1. Open a fresh visible ChatGPT Chat and select the latest visible reasoning-capable model with the strongest available reasoning. Fall back automatically when necessary and record the actual visible labels.
2. Submit the saved Prompt once with the approved evidence files. Do not resend after a wait timeout.
3. Download the complete LaTeX project archive and PDF into the run directory.
4. Unpack into a versioned output directory, never over the research source.
5. Compile in an isolated build directory. Return compilation errors to the same Chat and request only the necessary correction; do not restart the draft.
6. Preserve every replaced archive or source file in `revisions/`.

## Completion gate

Finish only when:

- the archive contains TeX, BibTeX, template provenance, figures or a missing-figure manifest, and the compiled PDF;
- all citations, graphics, bibliography names, and cross-references resolve;
- every reported result traces to provided evidence or a precise TODO;
- the selected template source and retrieval status are recorded;
- the manuscript does not omit unfavorable supplied results or invent missing evidence.

Write `run.json` with input hashes, Chat URL, actual model/reasoning labels, template source, output hashes, compilation status, and remaining TODOs. Return the run directory and compiled PDF.
