import { IconButton as MuiIconButton } from "@mui/material";
import { IconButtonProps } from "./types";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { Ref, forwardRef } from "react";

export const IconButton = forwardRef(function IconButton(
  { color = "primary", sx, children, ...rest }: IconButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const globalTheme = useGlobalTheme();

  return (
    <MuiIconButton
      ref={ref}
      color={color === "neutral" ? undefined : color}
      {...rest}
      sx={{
        ...(color === "neutral" && {
          color: "#000"
        }),
        ...(color === "primary" && {
          color: globalTheme.colors.primary[500]
        }),
        ...sx
      }}
    >
      {children}
    </MuiIconButton>
  );
});
