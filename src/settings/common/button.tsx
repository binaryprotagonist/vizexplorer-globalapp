import { Button, ButtonProps, Tooltip } from "@mui/material";

export type TextButtonProps = {
  tooltip?: string;
} & ButtonProps;

export function TextStyleButton({
  tooltip = "",
  children,
  sx,
  ...rest
}: TextButtonProps) {
  return (
    <Tooltip title={tooltip} placement={"top"}>
      <span>
        <Button
          disableRipple
          sx={{
            textTransform: "none",
            lineHeight: "13px",
            ["&:hover"]: {
              background: "none"
            },
            ...sx
          }}
          {...rest}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
}
