import { Box, Skeleton, menuClasses, styled } from "@mui/material";
import { MenuOption, SettingActionMenu } from "../../../components";
import { SettingContent, SettingsCard } from "../../common";
import { aboutGreetsSettingHelp, aboutGreetsSettingTitle } from "../utils";
import { ShowGuestActionsChangeParams } from "./types";
import { ToggleButton } from "../../../../common";
import { useState } from "react";

const StyledSettingActionMenu = styled(SettingActionMenu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "250px"
  }
}) as typeof SettingActionMenu;

type Props = {
  loading?: boolean;
  greetShowGuestActiveActions: boolean | null;
  onChange: (params: ShowGuestActionsChangeParams) => void;
};

export function ShowGuestActiveActions({
  greetShowGuestActiveActions,
  onChange,
  loading
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"show-guests-active-actions"}
      title={aboutGreetsSettingTitle("show-guests-active-actions")}
      helpText={aboutGreetsSettingHelp("show-guests-active-actions")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && greetShowGuestActiveActions !== null && (
          <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
            <ToggleButton
              data-testid={"show-guests-active-actions-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {
                MENU_OPTIONS.find((opt) => opt.value === greetShowGuestActiveActions)
                  ?.label
              }
            </ToggleButton>
            <StyledSettingActionMenu
              data-testid={"show-guests-active-actions-action-menu"}
              anchorEl={anchorEl}
              title={"Enable showing guests active actions"}
              selectedValue={greetShowGuestActiveActions}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({
                  settingId: "show-guests-active-actions",
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
