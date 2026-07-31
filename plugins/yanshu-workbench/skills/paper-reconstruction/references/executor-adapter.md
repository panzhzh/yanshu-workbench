# Paper Reconstruction executor adapter

Use this contract when the user explicitly selects Current CLI or another host. YanShu keeps one workflow and one validation path; adapters replace transport, not scientific rules.

## Adapter choices

- `visible-chatgpt`: explicitly selected browser bridge with MCP or verified attachments; requires a signed-in ChatGPT session and the necessary browser and file/upload authorizations.
- `codex-host`: current Codex CLI task reads approved local files and writes artifacts directly inside the run.
- `external`: user-maintained bridge for Claude CLI or another product.

Never infer an executor from the host environment. Record the user's explicit choice with `execution-adapter` and retain it for all five rounds unless the user later chooses to change it after an irrecoverable failure.
For `codex-host`, do not begin manuscript generation until `init` has created the run and `next` has returned the current round workspace.

## Required contract

For every round, an adapter must:

1. Read the exact `promptPath`, `approvedAttachments`, and `artifactBundle` returned by `next`.
2. Use one isolated conversation or execution context per round and submit the Prompt only once.
3. Report executor identity, model/reasoning metadata when available, and one normalized state: `generating`, `completed`, `needs_continuation`, `blocked`, or `failed`.
4. Produce complete files with the canonical artifact names. Never return patches in place of TeX, BibTeX, reports, or the Round 4 image.
5. Register or import artifacts through YanShu and call `round-finalize`; never bypass compilation or deterministic validation.
6. Resume from the saved checkpoint without resubmitting completed work.

The adapter may read only approved materials and registered round outputs. Original manuscript files remain read-only.

## Codex CLI

In `codex-host` mode:

- use the strongest available reasoning level compatible with the user's setting;
- use the already-running Codex CLI task; never launch `codex`, `codex exec`, `codex exec resume`, a background self-resume loop, or a visible ChatGPT page;
- before any work, set the process CWD and every file-edit workdir to `round.executorWorkspace.workingDirectory`;
- write every scratch file and complete artifact only inside that workspace; the paper root, run metadata, prior rounds, and canonical `output/` directories are read-only;
- read TeX, BibTeX, PDF pages, and referenced figures before changing evidence-bearing prose;
- match every suffix in `round.executorWorkspace.expectedArtifactSuffixes`, using one shared non-empty `<base_name>`;
- call `round-finalize` to import workspace artifacts atomically into the managed round `output/`, compile, and validate;
- use an available image-generation tool for Round 4 and register exactly one canonical PNG;
- if image generation is unavailable, create a faithful vector schematic and render it to the required PNG inside the same workspace rather than opening visible ChatGPT.

Do not use the shell's original paper-directory CWD for generation, and do not open a visible ChatGPT page after the user selected Current CLI.

## External hosts

Claude CLI or another host may implement this same contract around its own submit, wait, file, and image tools. YanShu does not promise selectors, authentication, reasoning labels, or image APIs for third-party products. Keep those details outside the core repository and return only the normalized state and canonical artifacts.
