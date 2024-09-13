import { Box, BoxProps } from "@mui/material";

type PageContainerBreakoutProps = {
  start?: "page-start" | "content-start";
  end?: "page-end" | "content-end";
} & BoxProps;

export function PageContainerBreakout({
  start = "content-start",
  end = "content-end",
  sx,
  ...rest
}: PageContainerBreakoutProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridColumn: `${start} / ${end}`,
        overflow: "auto",
        ...sx
      }}
      {...rest}
    />
  );
}
