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
  Overview Adapter, and the two-step output protocol;
- `app/figures/config.ts` for the user-selected visual configuration and the
  reconstruction default.

The reconstruction default is a double-column, ultra-wide `2:1` Method
Overview using minimal paper linework, the Tol Vibrant palette with a `2–3`
accent budget, Calibri prose labels, dark-neutral structural lines, pale fills
only for key regions, three type-size levels, no decorative icons, and no large
in-figure title. A user-selected placement or aspect ratio replaces only that
corresponding rendering setting.

Runtime output must use the same two-step confirmation protocol as `/figures/`
and save the confirmed image as
`<base_name>_round_4_framework_reconstruction.png`.
