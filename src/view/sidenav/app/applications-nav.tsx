import { Box, useTheme } from "@mui/material";
import { LayeredNavItem, NavItem } from "@vizexplorer/global-ui-core";
import { AppSettingsIcon } from "../shared";

type NavItemProps = {
  pdre?: {
    hide?: boolean;
  };
};

type Props = {
  navProps?: NavItemProps;
  isActiveMenuItem: (path: string) => boolean;
  onClick: (path: string) => void;
};

export function ApplicationsNav({ navProps = {}, isActiveMenuItem, onClick }: Props) {
  const theme = useTheme();
  const { pdre } = navProps;

  if (pdre?.hide) {
    return null;
  }

  return (
    <Box sx={{ marginTop: theme.spacing(1) }}>
      <LayeredNavItem title={"Applications"}>
        <NavItem
          icon={<AppSettingsIcon />}
          label={"Player Recommendation Engine"}
          onClick={() => onClick("pdre")}
          active={isActiveMenuItem("/settings/pdre")}
        />
      </LayeredNavItem>
    </Box>
  );
}
