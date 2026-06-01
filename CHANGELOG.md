# Changelog

All notable changes to this project will be documented in this file.

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
