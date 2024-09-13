import { Help } from "@mui/icons-material";
import { SvgIconProps, Tooltip, TooltipProps, useTheme } from "@mui/material";

type Props = Omit<TooltipProps, "children"> & {
  iconProps?: SvgIconProps;
};

export function HelpTip({ iconProps, ...tooltipProps }: Props) {
  const theme = useTheme();
  const { sx: iconSx, ...restIconProps } = iconProps ?? {};

  return (
    <Tooltip {...tooltipProps}>
      <Help
        {...restIconProps}
        sx={{
          fontSize: "16px",
          color: theme.palette.primary.main,
          marginLeft: "4px",
          verticalAlign: "super",
          ...iconSx
        }}
      />
    </Tooltip>
  );
}
