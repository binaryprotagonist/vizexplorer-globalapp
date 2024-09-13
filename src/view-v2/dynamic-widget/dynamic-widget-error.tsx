import { Box, useTheme } from "@mui/material";
import { Tooltip, Typography } from "@vizexplorer/global-ui-v2";

type Props = {
  message: string;
};

export function DynamicWidgetError({ message }: Props) {
  const theme = useTheme();

  return (
    <Box data-testid={"dynamic-widget-error"} p={theme.spacing(2)}>
      <Tooltip title={message}>
        <Typography color={"error"} align={"center"} fontWeight={600}>
          Widget Error
        </Typography>
      </Tooltip>
    </Box>
  );
}
