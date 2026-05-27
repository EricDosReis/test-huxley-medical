import { atom } from "recoil";

import { GlobalState } from "../types";

export const assessmentGlobalState = atom<GlobalState>({
  key: "assessmentGlobalState",
  default: {
    studyId: "demo-study-001",
    loading: false,
    error: undefined,
    signals: {},
    visibleSignals: {},
    events: [],
    yMin: undefined,
    yMax: undefined,
    chartWidth: 1000,
    chartHeight: 300,
    autoScale: true,
    lastFetchedAt: undefined,
    pollMs: 2000,
    currentStartSec: 0,
    currentEndSec: 600,
  },
});
