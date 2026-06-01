import { Box, Typography } from "@mui/material";
import { SignalSeries } from "../types";

interface HRBaselineDisplayProps {
  signalSeries: SignalSeries;
}

export const HRBaselineDisplay = ({ signalSeries }: HRBaselineDisplayProps) => {
  return (
    <Box
      sx={{
        p: 1,
        width: "200px",
        backgroundColor:
          signalSeries.values[0] === 60
            ? "#e3f2fd"
            : signalSeries.values[0] === 70
            ? "#fff3e0"
            : "#fce4ec",
        border: "2px solid",
        borderColor:
          signalSeries.values[0] === 60
            ? "#1976d2"
            : signalSeries.values[0] === 70
            ? "#f57c00"
            : "#c2185b",
        borderRadius: 1,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
        HR baseline is {signalSeries.values[0]} bpm
      </Typography>
    </Box>
  );
};
