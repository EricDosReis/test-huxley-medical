import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const PLOT_PADDING = 24;

interface MiniSignalPlotSkeletonProps {
  width: number;
  height: number;
}

const MiniSignalPlotSkeleton = ({
  width,
  height,
}: MiniSignalPlotSkeletonProps) => (
  <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 1, p: 1 }}>
    <Skeleton variant="text" sx={{ fontSize: 16, mb: 0.5, width: "40%" }} />
    <Skeleton variant="text" sx={{ fontSize: 12, mb: 1, width: "60%" }} />
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
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
  </Box>
);

export default MiniSignalPlotSkeleton;
