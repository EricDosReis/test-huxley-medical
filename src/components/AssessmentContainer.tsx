import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { useEventPoll } from "../hooks/useEventPoll";
import { useStudyLoader } from "../hooks/useStudyLoader";
import {
  chartConfigAtom,
  eventsAtom,
  studyAtom,
  visibleSignalsSelector,
} from "../store/globalStore";
import type { SignalKey } from "../types";
import { HRBaselineDisplay } from "./HRBaselineDisplay";
import MiniSignalPlot from "./MiniSignalPlot";
import SignalToggles from "./SignalToggles";
import TimelineControls from "./TimelineControls";

const STUDY_OPTIONS: { id: string; label: string }[] = [
  { id: "demo-study-001", label: "Study 1" },
  { id: "demo-study-002", label: "Study 2" },
  { id: "demo-study-003", label: "Study 3" },
];

const SIGNAL_PLOTS: { key: SignalKey; title: string; color: string }[] = [
  { key: "hr", title: "HR", color: "#1976d2" },
  { key: "spo2", title: "SpO2", color: "#2e7d32" },
  { key: "resp", title: "Resp", color: "#9c27b0" },
  { key: "position", title: "Position", color: "#5d4037" },
];

const AssessmentContainer = () => {
  useStudyLoader();
  useEventPoll();

  const { studyId, loading, error } = useRecoilValue(studyAtom);
  const setStudy = useSetRecoilState(studyAtom);
  const visibleSignals = useRecoilValue(visibleSignalsSelector);
  const { width: chartWidth, height: chartHeight } =
    useRecoilValue(chartConfigAtom);
  const events = useRecoilValue(eventsAtom);

  return (
    <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
      <Stack spacing={2}>
        <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 600 }}>
          Assessment: Mini Study Viewer
        </Typography>
        <Typography sx={{ color: "#555" }}>Check the README.</Typography>

        <Typography sx={{ fontSize: 13, color: "#777" }}>
          Study: <b>{studyId}</b> |{" "}
          {loading ? "Loading..." : error ? `Error: ${error}` : "Loaded"}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            Switch study:
          </Typography>

          {STUDY_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              variant="outlined"
              onClick={() => setStudy((prev) => ({ ...prev, studyId: id }))}
            >
              {label}
            </Button>
          ))}
        </Stack>

        {visibleSignals.hr && (
          <HRBaselineDisplay signalSeries={visibleSignals.hr} />
        )}

        <SignalToggles />

        <TimelineControls />

        <Typography sx={{ fontSize: 12, color: "#999" }}>
          Events in current study: {events.length}
        </Typography>

        {SIGNAL_PLOTS.map(({ key, title, color }) =>
          visibleSignals[key] ? (
            <MiniSignalPlot
              key={key}
              title={title}
              width={chartWidth}
              height={chartHeight}
              values={visibleSignals[key].values}
              timestamps={visibleSignals[key].timestamps}
              color={color}
            />
          ) : null,
        )}
      </Stack>
    </Box>
  );
};

export default AssessmentContainer;
