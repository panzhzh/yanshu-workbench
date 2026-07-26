# Third-party notices

## codex-chatgpt-control

YanShu vendors the visible ChatGPT browser-control runtime from:

- Project: `adamallcock/codex-chatgpt-control`
- Repository: https://github.com/adamallcock/codex-chatgpt-control
- Pinned commit: `73c5737f222709e324a1c7ba1637cef9966000ce`
- Vendored bundle SHA-256: `DF958256B537CC93CD7EB080F8CE38626DDF74DCC3B7A3027FDFA2EDD544B016`
- Vendored files:
  - `vendor/chatgpt-control/import-chatgpt-control.mjs`
  - `vendor/chatgpt-control/node/codex-chatgpt-control.bundle.mjs`
- Local modifications: see `vendor/chatgpt-control/PATCHES.md`
- Verification on 2026-07-25:
  - all 471 upstream Node tests passed at the pinned revision;
  - the TypeScript build and bundle completed successfully;
  - `npm audit --omit=dev` reported no runtime vulnerabilities;
  - YanShu's live read-only diagnostic detected the visible Chrome bridge, signed-in ChatGPT session, Chat experience, and configuration graph without submitting a message.
- YanShu patch verification on 2026-07-26:
  - the patched bundle passed a Node 22 syntax check and all YanShu plugin tests;
  - a native Windows file-drop clipboard smoke test preserved all seven approved
    `defertrace` files, including paths containing Chinese characters and spaces.

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

## tol_colors

YanShu's three research-figure palette groups are selected from:

- Project: `Descanonge/tol_colors`
- Repository: https://github.com/Descanonge/tol_colors
- Upstream purpose: Paul Tol color schemes for lines and maps, including
  color-vision-deficiency-safe qualitative sets
- Material used: selected HEX values from the Vibrant, Bright, and Muted sets

### BSD 3-Clause License

Copyright (c) 2019, Paul Tol, Clément Haëck

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
