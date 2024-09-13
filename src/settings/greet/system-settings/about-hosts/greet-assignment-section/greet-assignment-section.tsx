import { Box, Skeleton, menuClasses, styled } from "@mui/material";
import { MenuOption, SettingActionMenu } from "../../../components";
import { SettingContent, SettingsCard } from "../../common";
import { aboutHostsSettingHelp, aboutHostsSettingTitle } from "../utils";
import { useState } from "react";
import { EnableSectionsForGreetChangeParams } from "./types";
import { ToggleButton } from "../../../../common";

const StyledSettingActionMenu = styled(SettingActionMenu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "250px"
  }
}) as typeof SettingActionMenu;

type Props = {
  loading?: boolean;
  hostEnableSections: boolean | null;
  onChange: (params: EnableSectionsForGreetChangeParams) => void;
};

export function EnalbleGreetAssignmentSection({
  hostEnableSections,
  onChange,
  loading
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"enable-section-for-greet"}
      title={aboutHostsSettingTitle("enable-section-for-greet")}
      helpText={aboutHostsSettingHelp("enable-section-for-greet")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && hostEnableSections !== null && (
          <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
            <ToggleButton
              data-testid={"enable-section-for-greet-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {MENU_OPTIONS.find((opt) => opt.value === hostEnableSections)?.label}
            </ToggleButton>
            <StyledSettingActionMenu
              data-testid={"enable-section-for-greet-action-menu"}
              anchorEl={anchorEl}
              title={"Enable sections when assigning greets"}
              selectedValue={hostEnableSections}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({
                  settingId: "enable-section-for-greet",
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
