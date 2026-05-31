import { atom, selector } from "recoil";

import type {
  ChartConfig,
  Event,
  SignalKey,
  Signals,
  StudyState,
  WindowRange,
} from "../types";

export const studyAtom = atom<StudyState>({
  key: "studyAtom",
  default: {
    studyId: "demo-study-001",
    loading: false,
    error: undefined,
    lastFetchedAt: undefined,
    pollMs: 2000,
  },
});

export const signalsAtom = atom<Signals>({
  key: "signalsAtom",
  default: {},
});

export const visibilityAtom = atom<Set<SignalKey>>({
  key: "visibilityAtom",
  default: new Set<SignalKey>(["hr", "spo2", "resp", "position"]),
});

export const windowAtom = atom<WindowRange>({
  key: "windowAtom",
  default: { startSec: 0, endSec: 600 },
});

export const eventsAtom = atom<Event[]>({
  key: "eventsAtom",
  default: [],
});

export const chartConfigAtom = atom<ChartConfig>({
  key: "chartConfigAtom",
  default: { width: 1000, height: 300 },
});

export const visibleSignalsSelector = selector<Signals>({
  key: "visibleSignalsSelector",
  get: ({ get }) => {
    const signals = get(signalsAtom);
    const visibility = get(visibilityAtom);
    const { startSec, endSec } = get(windowAtom);

    const result: Signals = {};

    visibility.forEach((key: SignalKey) => {
      const series = signals[key];

      if (!series) return;

      if (!series.timestamps) {
        result[key] = series;
        return;
      }

      const timestamps = series.timestamps;
      const { values } = series;
      const startIndex = timestamps.findIndex((t: number) => t >= startSec);
      const rawEndIndex = timestamps.findIndex((t: number) => t > endSec);
      const endIndex = rawEndIndex === -1 ? timestamps.length : rawEndIndex;

      result[key] = {
        ...series,
        timestamps: timestamps.slice(startIndex, endIndex),
        values: values.slice(startIndex, endIndex),
      };
    });

    return result;
  },
});
