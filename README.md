# Mini Study Viewer Assessment

This folder contains an intentionally problematic "Study Viewer" built with React + Recoil. It simulates loading study signals and rendering a basic chart. The code purposefully includes bad state management and performance pitfalls.

## Your Tasks

1. **Identify and explain the state-management problems**
2. **Propose an improved state model** (document your reasoning)
3. **Refactor to a modern approach** (implement your solution)

## What we evaluate

- Reasoning about state boundaries, performance, and readability
- Ability to explain trade-offs and justify choices
- Clean code and architectural thinkin

## How to run

```bash
yarn install
yarn start
```

Then open `http://localhost:3000` in your browser.

## Success Criteria

Your refactored solution should:

1. **Eliminate memory leaks** - Demonstrate that cleanup is working properly
2. **Reduce unnecessary re-renders** - Components should only re-render when their data actually changes
3. **Fix data integrity issues** - Ensure the app displays correct data even when interactions happen rapidly
4. **Improve maintainability**

As a bonus task, you can:

- Increase the number of data points in one or more signals
  (e.g. HR / SpO2) to 10,000+ samples.
- Make the UI remain smooth when:
  - Toggling signals on/off
  - Changing the time window / zoom
  - Polling for new events

You are free to choose the strategy, for example:

- Virtualizing / windowing the data you actually render
- Downsampling / decimating points for visualization
- Using a more efficient drawing strategy (e.g. canvas instead of mapping thousands of SVG `<path>` segments)

If you do this, please add a short note in your README explaining:

- What you changed
- Why you chose that approach
- How it improves performance

## Final Solution

The final solution is documented in the [CHANGELOG](CHANGELOG.md) file. The solution
was applied following a development workflow: problem/task -> code analysis ->
development -> manual test (it could have been automated test) -> code review ->
documentation -> merge to main branch (production). I followed trunk based
development version control to manage the changes.

The idea was to keep the change as minimal as possible, but consistently solving
the issues, improving app performance and code readability.

Six defects were eliminated without redesigning the architecture. These are the key changes:

- The monolithic Recoil atom was split into six focused atoms and a derived selector, which in
  turn fixed destructive zoom (signals are never mutated), duplicated visibility data
  (the toggle set holds keys only)
- Redundant subscriptions, and the broken memoization caused by an unstable dep array.
- The race condition on rapid study switching was closed with a `cancelled` flag plus `AbortController`,
  and the interval memory leak was sealed by returning `clearInterval` from the polling effect.
- A single targeted refactor extracted the two `useEffect` calls from `AssessmentContainer` into `useStudyLoader`
  and `useEventPoll`, leaving the component as a pure rendering function with no async concerns.
- As a bonus, `MiniSignalPlot` was migrated from an SVG path string to a Canvas `useEffect` draw loop,
  and HR/SpO2 mock data was expanded to 10,001 samples, toggling or zooming at that density now completes
  well within a single 16 ms frame budget.

For more details, check the [CHANGELOG](CHANGELOG.md).

## Improvements

- [ ] Add unit and integration tests to improve application reliability
- [x] Improve UI feedback for loading state and active filters
- [ ] Migrate from Recoil to Zustand, since Recoil is abandoned (Meta
  archived the experimental Recoil repository)
