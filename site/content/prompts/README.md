# YanShu Prompt templates

This directory separates the original research workflow from the templates used
by the website.

- `source/` preserves reviewed references for the five active rounds. Round 4
  is a pointer rather than a duplicated standalone prompt: its canonical
  figure blocks live in `app/figures/promptArchitecture.ts` and
  `app/figures/config.ts`. The retired evidence-audit step has been removed.
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
- `version.ts` defines the one reconstruction workflow release shared by the
  rendered website and generated plugin runtime.
- `chatExecution.ts` defines stable ChatGPT model-policy, reasoning-preference,
  and fallback identifiers without pinning a changing GPT model name.

Runtime variables:

- `language`: prompt language, independent for every step.
- `styleId`, `styleLabel`, `styleDirective`: conference or journal mode and its
  writing emphasis.
- `hasWordLimit`: legacy-compatible flag indicating whether optional main-text
  and section length guidance is enabled. It defaults to false. When false,
  the compiler omits the complete length-guidance block.
- `unlimitedCoreSections`: when true, the compiler removes the main-text total
  and every Method/Experiments length suggestion while retaining optional
  references for all other sections.
- `targetWords`: optional main-text reference value.
- `sectionBudgets`: optional per-section reference allocation, including
  Abstract.
- `includeAppendix`, `appendixLabel`, `appendixDirective`: appendix state and
  its main-text-counting rule.
- `chatExecution`: plugin-only execution metadata. It stores
  `latest-visible-reasoning`, a stable reasoning preference, and
  `closest-lower-then-strongest`. When Pro is selected, the default policy uses
  Pro for the first effective interaction of each round and Extra High for
  later continuations, corrections, and artifact follow-ups; an explicit
  force-all-Pro flag is available with a time warning. These values are
  exported to `.yanshu.json` but are not inserted into manuscript-writing
  prompts.
- `submissionPreferences`: OA, APC and IF ranges, review-article acceptance,
  JCR quartile, CAS zone, SCIE/SSCI/AHCI/ESCI filters, and fixed publisher
  exclusions used only by the submission-strategy prompt.

Shared length-guidance policy lives in `wordCountPolicy.ts`. When guidance is
enabled, each table or figure is currently estimated as 200 words in its
section and in the optional main-text reference. These values are never hard
caps, minimums, or acceptance criteria.

Template-level visibility flags keep the final-refinement prompt focused on
editing and audit: it receives the paper type but omits the style directive,
appendix configuration, and all length-budget content.

The Markdown files are maintained as reviewed source references rather than
browser assets. The website TypeScript sources above are the executable
canonical Prompt implementation. The plugin does not maintain another Prompt
set: `npm run plugin:bundle` generates
`plugins/yanshu-workbench/runtime/prompt-engine.mjs` from these exact sources,
and `npm run plugin:check` fails when that generated runtime differs by even one
byte. The test command runs this parity check before building the website.
