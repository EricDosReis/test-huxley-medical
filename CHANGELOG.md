# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - feat: canvas rendering for `MiniSignalPlot` with HR/SpO2 10k samples

### Changed

- `MiniSignalPlot` replaces SVG `<path>` renderer with HTML Canvas. Drawing is handled via the 2D context API in a `useEffect`, so memory and paint cost stay flat regardless of sample count. `yMin`/`yMax` labels are now tracked in local state. See [ADR 0001](docs/adr/0001-mini-signal-plot-rendering-strategy.md) for the rationale and alternatives considered.
- `mockData` bumpes HR and SpO2 mock signals from 601 to 10,001 samples, with timestamps distributed proportionally across the 600 s study window.

## [1.0.1] - refactor: decompose `AssessmentContainer` into focused hooks and components

### Added

- `useStudyLoader` hook in `src/hooks/useStudyLoader.ts` encapsulates the `fetchStudy` call that was previously inline in `AssessmentContainer`
- `useEventPoll` hook in `src/hooks/useEventPoll.ts` encapsulates the `fetchEvents` call that was previously inline in `AssessmentContainer`
- `HRBaselineDisplay` component in `src/components/HRBaselineDisplay.tsx` accepts a `SignalSeries` prop and renders the HR baseline info, replacing an anonymous inline `Box` block in `AssessmentContainer`
- `src/constants.ts` with three typed constant arrays (`SIGNAL_OPTIONS`, `SIGNAL_PLOTS`, and `STUDY_OPTIONS`), each typed via `satisfies` against the relevant domain types

### Changed

- **`AssessmentContainer` simplification:** side-effect logic replaced with `useStudyLoader()` and `useEventPoll()` hook calls; the hardcoded per-signal plot blocks and per-study button blocks replaced with `.map()` over `SIGNAL_PLOTS` and `STUDY_OPTIONS` respectively; the inline HR baseline `Box` replaced with `<HRBaselineDisplay />`
- **`SignalToggles` simplification:** four hardcoded `FormControlLabel`/`Checkbox` blocks replaced with a single `.map()` over `SIGNAL_OPTIONS`

## [1.0.0] - fix: study viewer reliability and store refactor

### Added

- `SignalKey` union type (`"hr" | "spo2" | "resp" | "position"`) extracted to `src/types.ts` for reuse across the store and components
- `visibleSignalsSelector` in `globalStore.ts`, a derived selector that reactively computes the windowed, visibility-filtered signal view, centralising logic that was previously scattered across components

### Changed

- **Store refactor:** replaced the single `assessmentGlobalState` atom with six focused atoms, `studyAtom`, `signalsAtom`, `visibilityAtom`, `windowAtom`, `eventsAtom`, and `chartConfigAtom`, each owning a single domain of state
- **Type refactor:** replaced the god-object `GlobalState` interface with smaller, purpose-scoped interfaces: `StudyState`, `WindowRange`, and `ChartConfig`
- `SignalToggles` now tracks visibility as `Set<SignalKey>` via `visibilityAtom` instead of duplicating signal data into a parallel `visibleSignals` object
- `TimelineControls` no longer slices signal arrays in the component, it writes only `windowAtom` and the selector handles the rest
- Debug logs added to `fetchStudy` abort and event poll cleanup callbacks

### Fixed

- **Memory leak:** poll interval (`setInterval`) in `AssessmentContainer` was never cleared on unmount; `useEffect` now returns `clearInterval` as its cleanup
- **Stale data race:** switching studies did not cancel the in-flight `fetchStudy` request, allowing a slow response to overwrite state for the newly selected study, an `AbortController` is now wired to each fetch and `abort()` is called on cleanup
- **Unhandled promise rejection:** the `fetchEvents` poll had no `.catch` handler, causing network or server errors to surface as unhandled rejections with no visibility; errors are now logged to the console
- **Invalid `useMemo` dependency:** `MiniSignalPlot` included `Math.random()` as a dependency to force re-renders
