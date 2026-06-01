import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

type MiniSignalPlotProps = {
  title: string;
  width: number;
  height: number;
  color?: string;
  values: number[];
  timestamps?: number[];
};

const PLOT_PADDING = 24;

const MiniSignalPlot = ({
  title,
  width,
  height,
  color = "#1976d2",
  values,
  timestamps,
}: MiniSignalPlotProps) => {
  const innerW = Math.max(1, width - PLOT_PADDING * 2);
  const innerH = Math.max(1, height - PLOT_PADDING * 2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<{ yMin: number; yMax: number }>({
    yMin: NaN,
    yMax: NaN,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, innerW, innerH);

    if (!values?.length) {
      setLabels({ yMin: NaN, yMax: NaN });
      return;
    }

    const n = values.length;
    const domainMin = values.reduce(
      (m, v) => (v < m ? v : m),
      Number.POSITIVE_INFINITY,
    );
    const domainMax = values.reduce(
      (m, v) => (v > m ? v : m),
      Number.NEGATIVE_INFINITY,
    );
    const yRange = Math.max(1e-6, domainMax - domainMin);

    setLabels({ yMin: domainMin, yMax: domainMax });

    const xAt = (i: number) => {
      if (timestamps && timestamps.length === n) {
        const t0 = timestamps[0];
        const t1 = timestamps[n - 1];
        const tRange = Math.max(1e-6, t1 - t0);
        return ((timestamps[i] - t0) / tRange) * innerW;
      }
      return (i / Math.max(1, n - 1)) * innerW;
    };
    const yAt = (v: number) => {
      const rel = (v - domainMin) / yRange;
      // Canvas y grows down; invert to match chart convention
      return innerH - rel * innerH;
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(xAt(0), yAt(values[0]));
    for (let i = 1; i < n; i++) {
      ctx.lineTo(xAt(i), yAt(values[i]));
    }
    ctx.stroke();
  }, [values, timestamps, innerW, innerH, color]);

  return (
    <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 1, p: 1 }}>
      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontSize: 12, color: "#666", mb: 1 }}>
        yMin: {Number.isFinite(labels.yMin) ? labels.yMin.toFixed(2) : "—"} |
        yMax: {Number.isFinite(labels.yMax) ? labels.yMax.toFixed(2) : "—"}
      </Typography>

      <Box
        sx={{
          width,
          height,
          padding: `${PLOT_PADDING}px`,
          background: "#fafafa",
          border: "1px solid #eee",
          boxSizing: "border-box",
        }}
      >
        <canvas
          ref={canvasRef}
          width={innerW}
          height={innerH}
          style={{ display: "block" }}
        />
      </Box>
    </Box>
  );
};

export default MiniSignalPlot;
