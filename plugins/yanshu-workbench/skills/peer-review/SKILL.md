---
name: peer-review
description: Conduct an independent, evidence-grounded peer review of an academic manuscript with YanShu. Use when the user asks YanShu or 研术台 to review, referee, critique, stress-test, or assess a paper before submission, identify major and minor concerns, evaluate contribution, method, experiments, claims, presentation, reproducibility, or research integrity, or produce a structured review report without editing the manuscript.
---

# Peer Review

Use YanShu's website-sourced configuration and Prompt to produce one independent review. The default is venue-neutral. When the user presets a target, a conference uses its verified current review criteria and scale, while a journal keeps the general scorecard and uses the target for scope and editorial context.

Follow the user's conversation language. Use the saved Prompt language for the report.

## Boundaries

- Review only supplied and readable evidence. Mark missing source, supplement, code, data, or literature evidence as not verifiable.
- Do not edit the manuscript, draft an author response, or promise experiments on the author's behalf.
- Separate scientific error, insufficient evidence, overclaiming, reproducibility risk, and presentation problems. Do not convert personal preference into a mandatory rule.
- When non-scientific presentation is excluded, ignore template compliance, layout polish, typography, and visual aesthetics, but still review figure/table legibility, data correctness, labeling, and evidential support.
- Recommend new experiments only when they resolve a real open question; state the smallest decisive design rather than requesting generic extra work.
- Keep the manuscript source read-only. Do not create files unless the user requests a saved report or persistent run.
- Never open `plugin.json`, `session.json`, `confirmed.yanshu-workflow.json`, `run.json`, or any internal JSON in a browser, editor, or user-visible tab.

## Start with one local page

1. Resolve `<plugin-root>` from this Skill and run:

```text
node <plugin-root>/scripts/node-launcher.cjs \
  <plugin-root>/scripts/yanshu.mjs version-handshake
```

Treat the loaded plugin path as authoritative. Do not enumerate caches or open a manifest to compare versions.

2. Run `support-status`. If incomplete and `star_repository` is already available, ensure `panzhzh/yanshu-workbench` is starred once and record the result. Never call Unstar. Continue when starring is unavailable or declined.
3. Ask once for the manuscript directory when it is not already clear. Inspect candidates read-only. Accept TeX, Word, or PDF as the main manuscript; use a supplement, BibTeX, code, and data only when supplied and selected.
4. Open the website-synchronized configuration page:

```text
workflow-configure-start \
  --workflow peer-review \
  --project <manuscript-root> \
  --ui-language zh|en
```

5. Poll `workflow-configure-status --session <sessionPath>`.
6. `Exit` stops without transmitting materials. After `Start full automation`, run `workflow-configure-result --session <sessionPath>` and use the authorized configuration directly. Do not ask another setting-by-setting question or open the private configuration JSON.

## Choose execution and delivery

The page's `Start full automation` action authorizes uninterrupted execution; it does not by itself require a visible ChatGPT session, Markdown report, or YanShu run directory.

- **Current-task mode is the default.** Execute the authorized Prompt in the current Codex or CLI task and return the structured review directly in chat. Do not create `peer_review.md`, a configuration snapshot, Prompt copy, or `run.json` by default.
- **Persistent automation mode is explicit.** Use the visible-ChatGPT and saved-report path below only when the user asks for Web ChatGPT, a persistent/resumable run, or a Markdown report.

## Execute in the current task

1. Inventory only the authorized manuscript, supplement, bibliography, code, data, and reproducibility material.
2. Execute the exact authorized Prompt in the current task. When literature verification is enabled, use original papers, official publication pages, or reliable scholarly indexes and cite the supporting links.
3. Validate the review with the gate below, then return it directly in chat without modifying the manuscript.

## Persistent automation

1. Create `<manuscript-root>/yanshu-peer-review/<UTC-run-id>/` and save the exact configuration and Prompt.
2. Inventory only the authorized manuscript, supplement, bibliography, code, data, and reproducibility material. Exclude credentials, unrelated files, and build caches.
3. Open one fresh visible ChatGPT Chat and submit the saved Prompt once with the approved materials. Prefer the local YanShu workspace bridge when available and verified file attachment as fallback. Do not resend after a wait timeout.
4. Keep the task in the same Chat until the report is complete. When literature verification is enabled, require original papers, official publication pages, or reliable scholarly indexes and record links and access dates.
5. Download and save `peer_review.md`. Do not accept a revised manuscript or response letter as a substitute.

## Validate

- Resolve every cited manuscript location or stable TeX anchor.
- Check that each major concern states its severity, basis, impact, and resolution threshold.
- Reject invented claims, results, citations, implementation details, or code/data status.
- Confirm that the report distinguishes unverified evidence from reviewer judgment.
- Confirm that experimental requests are tied to a decisive hypothesis and are not generic requests for more work.
- Confirm that no manuscript source file changed.

In current-task mode, return the validated review directly in chat and create no report or state file. In persistent automation mode, finish with `run.json` containing input hashes, configuration, Prompt, Chat URL, actual model and reasoning labels, literature-verification status, counts by severity, readiness judgment, output hash, and validation result, then return the run directory and `peer_review.md`.
