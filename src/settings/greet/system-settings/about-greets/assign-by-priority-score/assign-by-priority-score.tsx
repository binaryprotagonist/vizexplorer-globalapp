import { SettingContent, SettingsCard } from "../../common";
import { aboutGreetsSettingHelp, aboutGreetsSettingTitle } from "../utils";
import { ToggleButton } from "../../../../common";
import { MenuOption, SettingActionMenu } from "../../../components";
import { Box, Skeleton, menuClasses, styled } from "@mui/material";
import { useState } from "react";
import { AssignByPriorityScoreChangeParams } from "./types";

const StyledSettingActionMenu = styled(SettingActionMenu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "250px"
  }
}) as typeof SettingActionMenu;

type Props = {
  loading?: boolean;
  greetAssignment: boolean | null;
  onChange: (params: AssignByPriorityScoreChangeParams) => void;
};

export function AssignByPriorityScore({ greetAssignment, onChange, loading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"assign-by-priority-score"}
      title={aboutGreetsSettingTitle("assign-by-priority-score")}
      helpText={aboutGreetsSettingHelp("assign-by-priority-score")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && greetAssignment !== null && (
          <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
            <ToggleButton
              data-testid={"assign-by-priority-score-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {MENU_OPTIONS.find((opt) => opt.value === greetAssignment)?.label}
            </ToggleButton>
            <StyledSettingActionMenu
              data-testid={"assign-by-priority-score-action-menu"}
              anchorEl={anchorEl}
              title={"Enable assignment by priority score"}
              selectedValue={greetAssignment}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({
                  settingId: "assign-by-priority-score",
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
