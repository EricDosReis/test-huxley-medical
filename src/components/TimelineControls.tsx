import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";

import { windowAtom } from "../store/globalStore";
import { getSelectedVariant } from "../utils/get-selected-variant";

const TimelineControls = () => {
  const [{ startSec, endSec }, setWindow] = useRecoilState(windowAtom);

  const applyWindow = (windowSizeSeconds: number) => {
    setWindow({ startSec: 0, endSec: windowSizeSeconds });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Zoom window:
      </Typography>

      <Button
        size="sm"
        variant={getSelectedVariant(endSec === 30)}
        onClick={() => applyWindow(30)}
      >
        30s
      </Button>
      <Button
        size="sm"
        variant={getSelectedVariant(endSec === 120)}
        onClick={() => applyWindow(120)}
      >
        2 min
      </Button>
      <Button
        size="sm"
        variant={getSelectedVariant(endSec === 600)}
        onClick={() => applyWindow(600)}
      >
        10 min
      </Button>

      <Typography sx={{ fontSize: 12, color: "#777", ml: 1 }}>
        Current: {startSec}s → {endSec}s
      </Typography>
    </Stack>
  );
};

export default TimelineControls;
