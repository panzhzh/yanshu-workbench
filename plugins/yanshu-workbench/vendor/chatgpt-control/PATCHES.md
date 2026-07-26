# YanShu integration patches

The bundled runtime remains based on
`adamallcock/codex-chatgpt-control` commit
`73c5737f222709e324a1c7ba1637cef9966000ce`.

YanShu applies the following narrowly scoped integration changes:

- ChatGPT's current **Add photos & files** menu structure is recognized, while
  its visible file chooser is the preferred cross-platform route.
- On Windows, approved attachment paths can also be written to the native
  clipboard as a `CF_HDROP` file list and pasted into ChatGPT as real file
  objects when chooser routes are unavailable.
- Chat attachment fallback no longer calls an unsupported hidden-input
  `setInputFiles` path.
- Every approved filename must be visible before a Prompt can be submitted.
  Verification accepts ChatGPT's duplicate-name display aliases such as
  `main (1).tex` and `main.tex (1)` without changing the approved local name.
- Clipboard paste and every visible file-chooser route share the same observable
  postcondition. A route with no attachment evidence falls through to the next
  route; a partial attachment set stops without retrying, which prevents
  duplicates.
- Upload-permission failures are distinguished from browser/UI transport
  failures so users are not incorrectly asked to change permissions.

These patches do not bypass ChatGPT login, browser permissions, attachment
limits, or user-visible controls.
