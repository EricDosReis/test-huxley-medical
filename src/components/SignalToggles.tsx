import Stack from "@mui/joy/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue } from "recoil";

import { signalsAtom, visibilityAtom } from "../store/globalStore";
import type { SignalKey } from "../types";

interface SignalOption {
  key: SignalKey;
  label: string;
}

type SignalOptions = SignalOption[];

const SIGNAL_OPTIONS: SignalOptions = [
  { key: "hr", label: "HR" },
  { key: "spo2", label: "SpO2" },
  { key: "resp", label: "Resp" },
  { key: "position", label: "Position" },
];

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

      {SIGNAL_OPTIONS.map(({ key, label }) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={visibility.has(key)}
              onChange={() => handleToggle(key)}
            />
          }
          label={label}
        />
      ))}
    </Stack>
  );
};

export default SignalToggles;
