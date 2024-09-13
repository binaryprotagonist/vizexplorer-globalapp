import { Box, useTheme } from "@mui/material";
import { Loading } from "@vizexplorer/global-ui-core";

export function DynamicWidgetLoading() {
  const theme = useTheme();

  return (
    <Box data-testid={"dynamic-widget-loading"} p={theme.spacing(2)}>
      <Loading variant={"dot-pulse"} />
    </Box>
  );
}
