import { Box, BoxProps } from "@mui/material";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { DEFAULT_CELL_HEIGHT } from "../constants";

type Props = {
  width: string | number;
} & Omit<BoxProps, "width">;

export function GridCellBase({ children, ...rest }: Props) {
  const globalTheme = useGlobalTheme();

  return (
    <Box
      data-testid={"datagrid-cell"}
      display={"flex"}
      alignItems={"center"}
      padding={"0 10px"}
      flexShrink={0}
      fontSize={"14px"}
      fontFamily={globalTheme.fontFamily}
      height={DEFAULT_CELL_HEIGHT}
      borderTop={`1px solid ${globalTheme.colors.grey[200]}`}
      bgcolor={"inherit"}
      {...rest}
    >
      {children}
    </Box>
  );
}
