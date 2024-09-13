import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { GridCellBase } from "../grid-cell";
import { BoxProps } from "@mui/material";

type Props = {
  width: string | number;
} & Omit<BoxProps, "width">;

export function GridHeaderBaseCell({ children, ...rest }: Props) {
  const globalTheme = useGlobalTheme();

  return (
    <GridCellBase
      data-editable={"false"}
      fontWeight={600}
      fontSize={"12px"}
      color={globalTheme.colors.grey[600]}
      bgcolor={globalTheme.colors.grey[50]}
      border={"none"}
      {...rest}
    >
      {children}
    </GridCellBase>
  );
}
