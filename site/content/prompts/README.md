# YanShu Prompt templates

This directory is the executable source of truth for Paper Reconstruction and
Submission Strategy prompts shared by the website and the YanShu plugin.

- `source/Paper_Reconstruction.md` documents the integrated reconstruction
  workflow. Its four steps run inside one task and never create intermediate
  manuscripts or a reconstructed figure.
- `source/Round_1_*.md` through `source/Round_3_*.md` retain the reviewed source
  material used to preserve the detailed positioning, method/experiments, and
  narrative rules inside that integrated workflow.
- `templates.ts` defines the public reconstruction Prompt and the separate
  submission-targeting Prompt.
- `constraints.ts` stores detailed, configuration-driven scientific and writing
  constraints. Conference and journal branches are inserted beside the rule
  they govern rather than collected in a detached appendix.
- `buildPrompt.ts` compiles a template from the current planner state.
- `types.ts` defines the template and runtime-variable contract.
- `version.ts` defines the workflow release shared by the website and plugin.

Paper Reconstruction produces exactly three final files:

- `<base_name>_restructured.tex`
- `<base_name>_restructured.bib`
- `<base_name>_restructuring_report_zh.md`

Length values are optional guidance rather than hard acceptance rules. When
guidance is enabled, every table or figure is estimated as 200 words for the
corresponding section. Method and Experiments & Results are unrestricted by
default, and appendix content is outside the main-text estimate.

The Markdown files are reviewed source references, not browser assets. The
TypeScript implementation is canonical, and `npm run plugin:bundle` generates
`plugins/yanshu-workbench/runtime/prompt-engine.mjs` from it. `npm run
plugin:check` fails if the generated plugin runtime is stale.
