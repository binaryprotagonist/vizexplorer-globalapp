import { Typography } from "@vizexplorer/global-ui-v2";
import { LinkProps } from "./types";
import { linkClasses } from "@mui/material";
import { Ref, forwardRef } from "react";

// Link based on MUI implementation: https://github.com/mui/material-ui/blob/v5.15.17/packages/mui-material/src/Link/Link.js
// reimplemented to use our own Typography definition
export const Link = forwardRef((props: LinkProps, ref: Ref<HTMLAnchorElement>) => {
  const {
    underline = "always",
    variant = "regular",
    component = "a",
    sx,
    ...rest
  } = props;

  return (
    <Typography
      ref={ref}
      component={component}
      {...rest}
      sx={{
        ...(underline === "none" && { textDecoration: "none" }),
        ...(underline === "always" && { textDecoration: "underline" }),
        ...(underline === "hover" && {
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        }),
        ...(variant === "large" && {
          fontSize: "18px",
          fontWeight: 700
        }),
        ...(variant === "regular" && {
          fontSize: "16px",
          fontWeight: 700
        }),
        ...(variant === "small" && {
          fontSize: "14px",
          fontWeight: 700
        }),
        ...(variant === "extraSmall" && {
          fontSize: "12px",
          fontWeight: 700
        }),
        cursor: "pointer",
        textUnderlineOffset: "3.5px",
        ...(component === "button" && {
          position: "relative",
          WebkitTapHighlightColor: "transparent",
          backgroundColor: "transparent", // Reset default value
          // We disable the focus ring for mouse, touch and keyboard users.
          outline: 0,
          border: 0,
          margin: 0, // Remove the margin in Safari
          borderRadius: 0,
          padding: 0, // Remove the padding in Firefox
          cursor: "pointer",
          userSelect: "none",
          textAlign: "left",
          verticalAlign: "middle",
          MozAppearance: "none", // Reset
          WebkitAppearance: "none", // Reset
          "&::-moz-focus-inner": {
            borderStyle: "none" // Remove Firefox dotted outline.
          },
          [`&.${linkClasses.focusVisible}`]: {
            outline: "auto"
          }
        }),
        ...sx
      }}
    />
  );
});
