# YanShu integration patches

The bundled runtime remains based on
`adamallcock/codex-chatgpt-control` commit
`73c5737f222709e324a1c7ba1637cef9966000ce`.

YanShu applies the following narrowly scoped integration changes:

- On Windows, approved attachment paths are written to the native clipboard as
  a `CF_HDROP` file list and pasted into ChatGPT as real file objects.
- ChatGPT's current **Add photos & files** menu structure is recognized, while
  the visible file chooser remains the cross-platform fallback.
- Chat attachment fallback no longer calls an unsupported hidden-input
  `setInputFiles` path.
- Every approved filename must be visible before a Prompt can be submitted.
  Partial attachment sets stop without retrying, which prevents duplicates.
- Upload-permission failures are distinguished from browser/UI transport
  failures so users are not incorrectly asked to change permissions.

These patches do not bypass ChatGPT login, browser permissions, attachment
limits, or user-visible controls.
