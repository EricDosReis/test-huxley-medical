# ADR 0001 — MiniSignalPlot rendering strategy for 10k+ samples

**Date:** 2026-06-01
**Status:** Accepted

---

## Context

The bonus task requires `MiniSignalPlot` to remain smooth with 10,000+ data points per signal (HR, SpO2) while the user toggles signals, changes the time window, and polls for new events.

The original implementation rendered each data point as part of an SVG `<path>` string built inside a `useMemo`. SVG is a retained-mode API: every element lives in the DOM and the browser must layout, paint, and composite it. At 601 samples the cost was acceptable; at 10k+ it causes measurable jank on every re-render.

The README names three candidate strategies:

1. **Virtualizing / windowing** - only render points that fall inside the current visible time window.
2. **Downsampling / decimating** - reduce the number of points passed to the renderer (e.g. Largest-Triangle-Three-Buckets).
3. **Canvas rendering** - draw the signal imperatively with the 2D context API instead of SVG.

---

## Decision

**Canvas rendering** was chosen as the primary strategy.

---

## Evaluation of alternatives

### Option 1 - Windowing

Windowing solves the problem only partially. A full study window already covering the entire recording would still pass all 10k points to the renderer. Choosing it as the sole strategy would delay, not eliminate, the need to address rendering efficiency.

### Option 2 - Downsampling

Downsampling (e.g. LTTB) reduces the number of points while preserving the visual shape of the signal. It would work with both SVG and canvas. The trade-off is lossy: clinical waveforms must not silently drop samples that could affect interpretation. Introducing a decimation algorithm also adds a non-trivial dependency or implementation surface that must be validated for correctness. For a monitoring UI where the purpose of the plot is to give clinicians a faithful at-a-glance view, fidelity beats pixel-level accuracy, and dropping points without explicit product sign-off is a liability.

### Option 3 - Canvas (chosen)

Canvas is an immediate-mode API: the browser retains no element tree. Drawing 10,001 line segments with `ctx.lineTo` is a single paint call with O(n) CPU cost and O(1) DOM overhead, regardless of n. The implementation maps directly to the existing data arrays with no lossy transformation and no additional data structures. Reactivity is handled by `useEffect` — the canvas redraws whenever `values`, `timestamps`, `color`, or dimensions change, and the rest of the React tree is unaffected.

The concrete costs of this choice are:

- Canvas content is not part of the accessibility tree. For a diagnostic mini-plot that communicates trends rather than precise values, this is acceptable; the existing `yMin`/`yMax` text labels preserve the key numerical readout.
- Canvas does not scale with CSS. The `width`/`height` attributes must match the logical pixel dimensions, which the component already controls through props.
- Hit-testing and tooltips require manual math if added later. This is a known extension point, not a current requirement.

---

## Consequences

- `MiniSignalPlot` renders 10k-sample waveforms without measurable jank on toggle or window change.
- No data is dropped or approximated, all samples are drawn.
- Windowing and downsampling remain valid future optimizations if sample counts grow further or if the time-window slice is narrowed upstream.
