# Third-party notices

## codex-chatgpt-control

YanShu vendors the visible ChatGPT browser-control runtime from:

- Project: `adamallcock/codex-chatgpt-control`
- Repository: https://github.com/adamallcock/codex-chatgpt-control
- Pinned commit: `73c5737f222709e324a1c7ba1637cef9966000ce`
- Vendored bundle SHA-256: `C30632B45D38A00B648FCF15577D98D9F808ED1A6BBAD09472037F688FCF8F5F`
- Vendored files:
  - `vendor/chatgpt-control/import-chatgpt-control.mjs`
  - `vendor/chatgpt-control/node/codex-chatgpt-control.bundle.mjs`
- Local modifications: none
- Verification on 2026-07-25:
  - all 471 upstream Node tests passed at the pinned revision;
  - the TypeScript build and bundle completed successfully;
  - `npm audit --omit=dev` reported no runtime vulnerabilities;
  - YanShu's live read-only diagnostic detected the visible Chrome bridge, signed-in ChatGPT session, Chat experience, and configuration graph without submitting a message.

The runtime is unofficial prerelease software and is not affiliated with, endorsed by, or sponsored by OpenAI. YanShu pins it deliberately and does not update it automatically.

These checks are integration verification, not a formal security audit.

### MIT License

Copyright (c) 2026 Adam Allcock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
