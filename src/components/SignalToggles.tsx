import Stack from "@mui/joy/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue } from "recoil";

import { signalsAtom, visibilityAtom } from "../store/globalStore";
import type { SignalKey } from "../types";

const SignalToggles = () => {
  const signals = useRecoilValue(signalsAtom);
  const [visibility, setVisibility] = useRecoilState(visibilityAtom);

  const handleToggle = (key: SignalKey) => {
    setVisibility((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else if (signals[key]) {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Visible signals:
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={visibility.has("hr")}
            onChange={() => handleToggle("hr")}
          />
        }
        label="HR"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={visibility.has("spo2")}
            onChange={() => handleToggle("spo2")}
          />
        }
        label="SpO2"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={visibility.has("resp")}
            onChange={() => handleToggle("resp")}
          />
        }
        label="Resp"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={visibility.has("position")}
            onChange={() => handleToggle("position")}
          />
        }
        label="Position"
      />
    </Stack>
  );
};

export default SignalToggles;
