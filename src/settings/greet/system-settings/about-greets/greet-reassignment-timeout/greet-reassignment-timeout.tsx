import { Skeleton } from "@mui/material";
import { SettingContent, SettingsCard } from "../../common";
import { aboutGreetsSettingHelp, aboutGreetsSettingTitle } from "../utils";
import { AlarmIcon, ToggleButton } from "../../../../common";
import { GreetTimeoutFragment } from "generated-graphql";
import { GreetReassignmentTimeoutChangeParams } from "./types";
import { MenuOption, SettingActionMenu } from "../../../components";
import { useState } from "react";

type Props = {
  timeout: GreetTimeoutFragment | null;
  onChange: (params: GreetReassignmentTimeoutChangeParams) => void;
  loading?: boolean;
};

export function GreetReassignmentTimeout({ timeout, onChange, loading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const value = `${timeout?.hours}.${timeout?.minutes}`;

  return (
    <>
      <SettingsCard
        data-testid={"greet-reassignment-timeout"}
        title={aboutGreetsSettingTitle("greet-reassignment-timeout")}
        helpText={aboutGreetsSettingHelp("greet-reassignment-timeout")}
      >
        <SettingContent>
          {loading && (
            <Skeleton variant={"rounded"}>
              <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
            </Skeleton>
          )}
          {!loading && !!timeout && (
            <>
              <ToggleButton
                data-testid={"reassignment-timeout-action"}
                selected={!!anchorEl}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<AlarmIcon />}
              >
                {MENU_OPTIONS.find((opt) => opt.value === value)?.label}
              </ToggleButton>
              <SettingActionMenu
                data-testid={"reassignment-timeout-menu"}
                anchorEl={anchorEl}
                titleIcon={<AlarmIcon />}
                title={"Select the greet timeout before reassignment"}
                selectedValue={value}
                options={MENU_OPTIONS}
                onChange={(value) => {
                  const [hours, minutes] = value.split(".");
                  onChange({
                    settingId: "greet-reassignment-timeout",
                    value: {
                      __typename: "PdGreetTimeout",
                      hours: Number(hours),
                      minutes: Number(minutes)
                    }
                  });
                  setAnchorEl(null);
                }}
                onClose={() => setAnchorEl(null)}
              />
            </>
          )}
        </SettingContent>
      </SettingsCard>
    </>
  );
}

export const MENU_OPTIONS: MenuOption<string>[] = [
  {
    value: "0.5",
    label: "5 minutes"
  },
  {
    value: "0.10",
    label: "10 minutes"
  },
  {
    value: "0.15",
    label: "15 minutes"
  },
  {
    value: "0.20",
    label: "20 minutes"
  },
  {
    value: "0.25",
    label: "25 minutes"
  },
  {
    value: "0.30",
    label: "30 minutes"
  }
];
