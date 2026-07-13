# Tool components — when to use what

For single-purpose utilities (converter, generator, calculator): centered, minimal chrome, the tool itself above the fold.

- **ToolShell** — page frame: title, one-line description, the tool, then supporting content. No nav sprawl.
- **ToolPanels + InputPanel + OutputPanel** — side-by-side input → output (stacks ≤768px).
- **RangeSlider / Stepper** — numeric inputs with immediate feedback; prefer these over bare number inputs in tools.
- **FileDropzone** — file input; states for drag-over, uploading, done.
- **ResultCard + CopyButton + ShareExportRow** — the output with one-click copy; export options in one row.
- **CodeBlock** — mono output/snippets. Also the right block for docs-style pages until a docs category exists.
- **HowItWorks** — 3 steps max, below the tool, factual.
- **RelatedToolsGrid** — bottom cross-links; real tools only.

The tool works before any scrolling; explanation comes after the tool, never before.
