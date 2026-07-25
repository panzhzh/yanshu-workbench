# YanShu Prompt templates

This directory separates the original research workflow from the templates used
by the website.

- `source/` preserves the five active Markdown prompts as the canonical
  constraint source. The retired evidence-audit step has been removed.
- `templates.ts` contains the reviewed, normalized Chinese and English content
  used by four reconstruction cards and the separate submission-strategy
  card. Every template has an explicit `sourceFile` link to its corresponding
  canonical prompt.
- `constraints.ts` preserves the detailed structural, evidence, sentence,
  terminology, output, and audit contracts from those source prompts.
  Conference/journal hierarchy and section-shape branches are inserted beside
  the rule they govern. Configurable quantitative constraints are likewise
  inserted inline rather than collected in a detached block. Step-specific
  policies, including the scientific-positioning
  temporary ceiling and protected sections, are defined here as data.
- `buildPrompt.ts` compiles a selected template with the current planner state.
- `types.ts` defines the template and runtime-variable contract.
- `chatExecution.ts` defines stable ChatGPT model-policy, reasoning-preference,
  and fallback identifiers without pinning a changing GPT model name.

Runtime variables:

- `language`: prompt language, independent for every step.
- `styleId`, `styleLabel`, `styleDirective`: conference or journal mode and its
  writing emphasis.
- `hasWordLimit`: whether a main-text target exists. When false, the compiler
  omits the complete main-text and section-budget block.
- `unlimitedCoreSections`: when true, the compiler removes the main-text total
  and every Method/Experiments word cap while retaining budgets for all other
  sections.
- `targetWords`: current main-text target.
- `sectionBudgets`: current per-section allocation, including Abstract.
- `includeAppendix`, `appendixLabel`, `appendixDirective`: appendix state and
  its main-text-counting rule.
- `chatExecution`: plugin-only execution metadata. It stores
  `latest-visible-reasoning`, a stable reasoning preference, and
  `closest-lower-then-strongest`; it is exported to `.yanshu.json` but is not
  inserted into manuscript-writing prompts.
- `submissionPreferences`: OA, APC and IF ranges, review-article acceptance,
  JCR quartile, CAS zone, SCIE/SSCI/ESCI filters, and fixed publisher
  exclusions used only by the submission-strategy prompt.

Shared word-count policy lives in `wordCountPolicy.ts`. Each table or figure is
currently counted as 200 words in its section and in any applicable main-text
total.

Template-level visibility flags keep the final-refinement prompt focused on
editing and audit: it receives the paper type but omits the style directive,
appendix configuration, and all length-budget content.

The Markdown files are maintained as reviewed source references rather than
browser assets. Runtime copies are regression-tested for high-value
constraints. This keeps the workflow readable while allowing the product
templates to be bilingual, configuration-driven, and type checked.
