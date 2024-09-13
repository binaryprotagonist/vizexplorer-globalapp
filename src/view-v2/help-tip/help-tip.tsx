import { Help } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { Tooltip, TooltipProps, useGlobalTheme } from "@vizexplorer/global-ui-v2";

type Props = Omit<TooltipProps, "children"> & {
  iconProps?: SvgIconProps;
};

export function HelpTip({ iconProps, ...tooltipProps }: Props) {
  const globalTheme = useGlobalTheme();
  const { sx: iconSx, ...restIconProps } = iconProps ?? {};

  return (
    <Tooltip {...tooltipProps}>
      <Help
        {...restIconProps}
        sx={{
          fontSize: "18px",
          color: globalTheme.colors.primary[300],
          marginLeft: "4px",
          ...iconSx
        }}
      />
    </Tooltip>
  );
}
