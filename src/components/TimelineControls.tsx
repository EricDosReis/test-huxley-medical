import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue } from "recoil";

import { assessmentGlobalState } from "../store/globalStore";
import { Signals } from "../types";

const TimelineControls = () => {
  const [state, setState] = useRecoilState(assessmentGlobalState);
  const { signals, currentStartSec, currentEndSec } = useRecoilValue(
    assessmentGlobalState,
  );

  const applyWindow = (windowSizeSeconds: number) => {
    const newSignals: Signals = {};

    const sliceSeries = (series?: {
      timestamps?: number[];
      values: number[];
    }) => {
      if (!series || !series.timestamps || series.timestamps.length === 0) {
        return series;
      }
      const { timestamps, values } = series;
      const startTs = timestamps[0];
      const endTs = timestamps[timestamps.length - 1];
      const newStart = startTs;
      const newEnd = Math.min(endTs, newStart + windowSizeSeconds);

      const startIndex = timestamps.findIndex((t) => t >= newStart);
      const endIndex = timestamps.findIndex((t) => t > newEnd);
      const lastIndex = endIndex === -1 ? timestamps.length : endIndex;

      return {
        ...series,
        timestamps: timestamps.slice(startIndex, lastIndex),
        values: values.slice(startIndex, lastIndex),
      };
    };

    newSignals.hr = sliceSeries(signals.hr);
    newSignals.spo2 = sliceSeries(signals.spo2);
    newSignals.resp = sliceSeries(signals.resp);
    newSignals.position = sliceSeries(signals.position);

    setState((prev) => ({
      ...prev,
      signals: newSignals,
      visibleSignals: newSignals,
      currentStartSec: 0,
      currentEndSec: windowSizeSeconds,
    }));
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Zoom window:
      </Typography>

      <Button size="sm" variant="outlined" onClick={() => applyWindow(30)}>
        30s
      </Button>
      <Button size="sm" variant="outlined" onClick={() => applyWindow(120)}>
        2 min
      </Button>
      <Button size="sm" variant="outlined" onClick={() => applyWindow(600)}>
        10 min
      </Button>

      <Typography sx={{ fontSize: 12, color: "#777", ml: 1 }}>
        Current: {currentStartSec}s → {currentEndSec}s
      </Typography>
    </Stack>
  );
};

export default TimelineControls;
