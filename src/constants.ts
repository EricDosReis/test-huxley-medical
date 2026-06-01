import type { SignalKey } from "./types";

export const SIGNAL_OPTIONS = [
  { key: "hr", label: "HR" },
  { key: "spo2", label: "SpO2" },
  { key: "resp", label: "Resp" },
  { key: "position", label: "Position" },
] as const satisfies readonly { key: SignalKey; label: string }[];

export const STUDY_OPTIONS = [
  { id: "demo-study-001", label: "Study 1" },
  { id: "demo-study-002", label: "Study 2" },
  { id: "demo-study-003", label: "Study 3" },
] as const satisfies readonly { id: string; label: string }[];

export const SIGNAL_PLOTS = [
  { key: "hr", title: "HR", color: "#1976d2" },
  { key: "spo2", title: "SpO2", color: "#2e7d32" },
  { key: "resp", title: "Resp", color: "#9c27b0" },
  { key: "position", title: "Position", color: "#5d4037" },
] as const satisfies readonly {
  key: SignalKey;
  title: string;
  color: string;
}[];
