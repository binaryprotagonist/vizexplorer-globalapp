import { Skeleton } from "@mui/material";
import { SettingContent, SettingsCard } from "../../common";
import { aboutHostsSettingHelp, aboutHostsSettingTitle } from "../utils";
import { MaxAssignmentsPerHostChangeParams } from "./types";
import { ToggleButton } from "../../../../common";
import { MenuOption, SettingActionMenu } from "../../../components";
import { useState } from "react";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import { Tooltip } from "@vizexplorer/global-ui-v2";

type Props = {
  numAssignments: number | null;
  onChange: (params: MaxAssignmentsPerHostChangeParams) => void;
  loading?: boolean;
};

export function MaxAssignmentPerHost({ numAssignments, onChange, loading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"max-assignment-per-host"}
      title={aboutHostsSettingTitle("max-assignment-per-host")}
      helpText={aboutHostsSettingHelp("max-assignment-per-host")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && numAssignments !== null && (
          <>
            <ToggleButton
              data-testid={"max-assignments-per-host-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={
                <Tooltip title={"Number of greets"}>
                  <WavingHandRoundedIcon data-testid={"icon"} />
                </Tooltip>
              }
            >
              {MENU_OPTIONS.find((opt) => opt.value === numAssignments)?.label}
            </ToggleButton>
            <SettingActionMenu
              data-testid={"max-assignments-per-host-menu"}
              anchorEl={anchorEl}
              titleIcon={<WavingHandRoundedIcon />}
              title={"Select the number of greets a host can be assigned"}
              selectedValue={numAssignments}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({ settingId: "max-assignment-per-host", value });
                setAnchorEl(null);
              }}
              onClose={() => setAnchorEl(null)}
            />
          </>
        )}
      </SettingContent>
    </SettingsCard>
  );
}

export const MENU_OPTIONS: MenuOption<number>[] = Array.from({ length: 5 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} greet${i === 0 ? "" : "s"}`
}));
