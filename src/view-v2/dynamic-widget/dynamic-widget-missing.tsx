import { Box, useTheme } from "@mui/material";
import { Typography } from "@vizexplorer/global-ui-v2";

type Props = {
  title: string;
};

export function DynamicWidgetMissing({ title }: Props) {
  const theme = useTheme();

  return (
    <Box data-testid={"dynamic-widget-missing"} p={theme.spacing(2)}>
      <Typography
        color={"error"}
        align={"center"}
        fontWeight={600}
        sx={{ wordBreak: "break-word" }}
      >
        {`Unable to find '${title}' widget`}
      </Typography>
    </Box>
  );
}
