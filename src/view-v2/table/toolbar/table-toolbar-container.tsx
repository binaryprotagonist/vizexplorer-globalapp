import { Box } from "@mui/material";
import { TableToolbarContainerProps } from "./types";

export function TableToolbarContainer({ children, ...rest }: TableToolbarContainerProps) {
  return (
    <Box
      data-testid={"table-toolbar"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={"20px 24px"}
      {...rest}
    >
      {children}
    </Box>
  );
}
