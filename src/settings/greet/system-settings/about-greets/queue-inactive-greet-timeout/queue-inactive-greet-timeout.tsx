import { useState } from "react";
import { AlarmIcon, ToggleButton } from "../../../../common";
import { MenuOption, SettingActionMenu } from "../../../components";
import { SettingContent, SettingsCard } from "../../common";
import { aboutGreetsSettingHelp, aboutGreetsSettingTitle } from "../utils";
import { GreetTimeoutFragment } from "generated-graphql";
import { QueueInactiveGreetTimeoutChangeParams } from "./types";
import { Skeleton } from "@mui/material";

type Props = {
  timeout: GreetTimeoutFragment | null;
  onChange: (params: QueueInactiveGreetTimeoutChangeParams) => void;
  loading?: boolean;
};

export function QueueInactiveTimeout({ timeout, onChange, loading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const value = `${timeout?.hours}.${timeout?.minutes}`;

  return (
    <>
      <SettingsCard
        data-testid={"queue-inactive-greet-timeout"}
        title={aboutGreetsSettingTitle("queue-inactive-greet-timeout")}
        helpText={aboutGreetsSettingHelp("queue-inactive-greet-timeout")}
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
                data-testid={"queue-inactive-timeout-action"}
                selected={!!anchorEl}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<AlarmIcon />}
              >
                {MENU_OPTIONS.find((opt) => opt.value === value)?.label}
              </ToggleButton>
              <SettingActionMenu
                data-testid={"queue-inactive-timeout-menu"}
                anchorEl={anchorEl}
                titleIcon={<AlarmIcon />}
                title={"Select the inactive greet timeout before removal"}
                selectedValue={value}
                options={MENU_OPTIONS}
                onChange={(value) => {
                  const [hours, minutes] = value.split(".");
                  onChange({
                    settingId: "queue-inactive-greet-timeout",
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

const MENU_OPTIONS: MenuOption<string>[] = [
  {
    value: "1.0",
    label: "1 hour"
  },
  {
    value: "1.15",
    label: "1h 15min"
  },
  {
    value: "1.30",
    label: "1h 30min"
  },
  {
    value: "1.45",
    label: "1h 45min"
  },
  {
    value: "2.0",
    label: "2 hours"
  }
];
