import { ChipProps, Chip } from "@mui/material";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";

type TagProps = ChipProps;

export function Tag({ color, sx, ...rest }: TagProps) {
  const theme = useGlobalTheme();
  const colorPalette =
    !color || color === "default" ? theme.colors.grey : theme.colors[color];
  const fontColor = colorPalette[700];
  const bgcolor = colorPalette[50];

  return (
    <Chip
      sx={{
        bgcolor,
        color: fontColor,
        fontFamily: theme.fontFamily,
        fontWeight: 600,
        ...sx
      }}
      {...rest}
    />
  );
}
