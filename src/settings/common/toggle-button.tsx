import { ToggleChip, ToggleChipProps } from "view-v2/toggle-chip";
import ExpandLessRounded from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { buttonClasses } from "@mui/material";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";

export function ToggleButton({ endIcon, sx, ...rest }: ToggleChipProps) {
  const theme = useGlobalTheme();

  return (
    <ToggleChip
      endIcon={endIcon ?? <DefaultToggleIcon selected={rest.selected} />}
      sx={{
        width: "max-content",
        [`& .${buttonClasses.startIcon}`]: {
          color: theme.colors.grey[500],
          ...(rest.disabled && {
            color: "inherit"
          })
        },
        ...sx
      }}
      {...rest}
    />
  );
}

function DefaultToggleIcon({ selected = false }: { selected?: boolean }) {
  return selected ? <ExpandLessRounded /> : <ExpandMoreRounded />;
}
