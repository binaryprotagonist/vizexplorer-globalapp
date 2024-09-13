import { Box, BoxProps, useTheme } from "@mui/material";
import { mergeSx } from "view-v2/styles";

export function PageContainer({ sx, children, ...props }: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      display={"grid"}
      p={theme.spacing(4, 0)}
      gridTemplateColumns={
        "[page-start] 64px [content-start] auto [content-end] 64px [page-end]"
      }
      gridAutoRows={"max-content"}
      width={"100%"}
      {...props}
      sx={mergeSx(
        {
          ["& > *"]: {
            gridColumn: "content-start / content-end"
          }
        },
        sx
      )}
    >
      {children}
    </Box>
  );
}
