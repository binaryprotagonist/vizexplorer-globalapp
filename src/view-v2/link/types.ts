import { LinkProps as MuiLinkProps } from "@mui/material";

export type LinkProps = {
  underline?: "none" | "hover" | "always";
  variant?: "large" | "regular" | "small" | "extraSmall";
} & Omit<MuiLinkProps, "variant">;
