# Round 4 — Method Overview Figure Reconstruction

Round 4 intentionally does not maintain a second standalone figure prompt.
The website and reconstruction workflow compile the same source of truth:

```text
COMMON_BASE
+
FIGURE_TYPE_ADAPTERS["method-overview"]
+
COMPILED_VISUAL_CONFIGURATION
+
OUTPUT_PROTOCOL
```

The canonical blocks live in:

- `app/figures/promptArchitecture.ts` for shared evidence rules, the Method
  Overview Adapter, and the execution protocol;
- `app/figures/config.ts` for the user-selected visual configuration and the
  reconstruction default.

The reconstruction default is an ultra-wide `2:1` Method Overview on a
pure-white canvas, using the Tol Vibrant palette with a `2–4` accent range,
Calibri prose labels, dark-neutral structural lines, pale fills only for key
regions, three type-size levels, restrained paper-specific scientific forms
when useful, and no large in-figure title. A user-selected aspect ratio replaces
only that rendering setting.

Runtime output first reviews transferable visual patterns in closely related
top-venue figures, then uses the same concise architecture as `/figures/`.
Round 4 defaults to direct ultra-high-resolution generation after sufficient
internal visual reasoning, without an intermediate confirmation step, and saves the image as
`<base_name>_round_4_framework_reconstruction.png`.
