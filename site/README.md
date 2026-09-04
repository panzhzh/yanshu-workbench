# YanShu website

This directory contains the public YanShu website.

## Production

The only public production deployment is Cloudflare Pages:

<https://yanshu-workbench.pages.dev/>

GitHub `main` is the single source of truth. OpenAI/ChatGPT Sites versions,
preview projects, and `*.chatgpt.site` URLs are not part of the release flow.
Do not add `.openai/hosting.json` or publish this repository through Sites.

## Local development

Use Node.js 22 through `nvm` and preserve the existing project structure:

```bash
nvm use 22
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm test
npm run build:pages
```

`npm run build:pages` produces the static build used by the Cloudflare Pages
deployment. `npm run plugin:bundle` rebuilds the YanShu plugin Prompt runtime
from the same configuration source used by the website.

## Main routes

- `/` — overview
- `/draft` — paper draft generation
- `/writing/sections` — section-specific writing
- `/writing/citations` — citation review and support
- `/writing/polishing` — academic writing polishing
- `/reconstruction` — paper reconstruction
- `/reconstruction/refinement` — section-specific refinement
- `/reconstruction/audit` — selectable specialized audits
- `/figures` — research figure prompts
- `/submission` — venue targeting

The website itself does not read, upload, or store manuscript files.
