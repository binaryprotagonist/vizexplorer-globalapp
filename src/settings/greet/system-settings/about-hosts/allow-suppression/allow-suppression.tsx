import { Box, Skeleton, menuClasses, styled } from "@mui/material";
import { MenuOption, SettingActionMenu } from "../../../components";
import { SettingContent, SettingsCard } from "../../common";
import { aboutHostsSettingHelp, aboutHostsSettingTitle } from "../utils";
import { ToggleButton } from "../../../../common";
import { AllowSuppressionChangeParams } from "./types";
import { useState } from "react";

const StyledSettingActionMenu = styled(SettingActionMenu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "250px"
  }
}) as typeof SettingActionMenu;

type Props = {
  loading?: boolean;
  hostAllowSuppression: boolean | null;
  onChange: (params: AllowSuppressionChangeParams) => void;
};

export function AllowSuppressionCompletion({
  hostAllowSuppression,
  onChange,
  loading
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"allow-suppression-without-completion"}
      title={aboutHostsSettingTitle("allow-suppression-without-completion")}
      helpText={aboutHostsSettingHelp("allow-suppression-without-completion")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && hostAllowSuppression !== null && (
          <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
            <ToggleButton
              data-testid={"allow-suppression-without-completion-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {MENU_OPTIONS.find((opt) => opt.value === hostAllowSuppression)?.label}
            </ToggleButton>
            <StyledSettingActionMenu
              data-testid={"allow-suppression-without-completion-action-menu"}
              anchorEl={anchorEl}
              title={"Enable suppression without completing a greet"}
              selectedValue={hostAllowSuppression}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({
                  settingId: "allow-suppression-without-completion",
                  value
                });
                setAnchorEl(null);
              }}
              onClose={() => setAnchorEl(null)}
            />
          </Box>
        )}
      </SettingContent>
    </SettingsCard>
  );
}

const MENU_OPTIONS: MenuOption<boolean>[] = [
  {
    value: true,
    label: "Yes"
  },
  {
    value: false,
    label: "No"
  }
];
