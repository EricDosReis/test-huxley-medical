import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { fetchEvents, fetchStudy } from "../api/mockApi";
import {
  chartConfigAtom,
  eventsAtom,
  signalsAtom,
  studyAtom,
  visibleSignalsSelector,
  windowAtom,
} from "../store/globalStore";
import MiniSignalPlot from "./MiniSignalPlot";
import SignalToggles from "./SignalToggles";
import TimelineControls from "./TimelineControls";

const AssessmentContainer = () => {
  const { studyId, loading, error, pollMs } = useRecoilValue(studyAtom);
  const setStudy = useSetRecoilState(studyAtom);
  const setSignals = useSetRecoilState(signalsAtom);
  const setEvents = useSetRecoilState(eventsAtom);
  const setWindow = useSetRecoilState(windowAtom);
  const visibleSignals = useRecoilValue(visibleSignalsSelector);
  const { width: chartWidth, height: chartHeight } =
    useRecoilValue(chartConfigAtom);
  const events = useRecoilValue(eventsAtom);

  useEffect(() => {
    let cancelled = false;
    setStudy((prev) => ({ ...prev, loading: true, error: undefined }));

    const controller = new AbortController();

    fetchStudy(studyId, controller.signal)
      .then((data) => {
        if (cancelled) return;

        setSignals(data.signals);
        setEvents(data.events);
        setWindow({
          startSec: data.metadata.study_start,
          endSec: data.metadata.study_end,
        });
        setStudy((prev) => ({
          ...prev,
          loading: false,
          error: undefined,
          lastFetchedAt: Date.now(),
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.name === "AbortError") return;

        setStudy((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "Failed to load study",
        }));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [studyId, setStudy, setSignals, setEvents, setWindow]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchEvents(studyId).then((newEvents) => {
        setEvents(newEvents);
        setStudy((prev) => ({ ...prev, lastFetchedAt: Date.now() }));
      });
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, studyId, setStudy, setEvents]);

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
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setStudy((prev) => ({ ...prev, studyId: "demo-study-001" }))
            }
          >
            Study 1
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setStudy((prev) => ({ ...prev, studyId: "demo-study-002" }))
            }
          >
            Study 2
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setStudy((prev) => ({ ...prev, studyId: "demo-study-003" }))
            }
          >
            Study 3
          </Button>
        </Stack>

        {visibleSignals.hr && (
          <Box
            sx={{
              p: 1,
              width: "200px",
              backgroundColor:
                visibleSignals.hr.values[0] === 60
                  ? "#e3f2fd"
                  : visibleSignals.hr.values[0] === 70
                  ? "#fff3e0"
                  : "#fce4ec",
              border: "2px solid",
              borderColor:
                visibleSignals.hr.values[0] === 60
                  ? "#1976d2"
                  : visibleSignals.hr.values[0] === 70
                  ? "#f57c00"
                  : "#c2185b",
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              HR baseline is {visibleSignals.hr.values[0]} bpm
            </Typography>
          </Box>
        )}

        <SignalToggles />

        <TimelineControls />

        <Typography sx={{ fontSize: 12, color: "#999" }}>
          Events in current study: {events.length}
        </Typography>

        {visibleSignals.hr && (
          <MiniSignalPlot
            title="HR"
            width={chartWidth}
            height={chartHeight}
            values={visibleSignals.hr.values}
            timestamps={visibleSignals.hr.timestamps}
            color="#1976d2"
          />
        )}
        {visibleSignals.spo2 && (
          <MiniSignalPlot
            title="SpO2"
            width={chartWidth}
            height={chartHeight}
            values={visibleSignals.spo2.values}
            timestamps={visibleSignals.spo2.timestamps}
            color="#2e7d32"
          />
        )}
        {visibleSignals.resp && (
          <MiniSignalPlot
            title="Resp"
            width={chartWidth}
            height={chartHeight}
            values={visibleSignals.resp.values}
            timestamps={visibleSignals.resp.timestamps}
            color="#9c27b0"
          />
        )}
        {visibleSignals.position && (
          <MiniSignalPlot
            title="Position"
            width={chartWidth}
            height={chartHeight}
            values={visibleSignals.position.values}
            timestamps={visibleSignals.position.timestamps}
            color="#5d4037"
          />
        )}
      </Stack>
    </Box>
  );
};

export default AssessmentContainer;
