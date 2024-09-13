import { IconButtonProps as MuiIconButtonProps } from "@mui/material";
import { BaseComponentColor } from "@vizexplorer/global-ui-v2";

export type IconButtonProps = Omit<MuiIconButtonProps, "color"> & {
  color?: BaseComponentColor;
};
