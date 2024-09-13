import { Skeleton } from "@mui/material";
import { SettingContent, SettingsCard } from "../../common";
import { aboutHostsSettingHelp, aboutHostsSettingTitle } from "../utils";
import { MaxMissedGreetsChangeParams } from "./types";
import { ToggleButton } from "../../../../common";
import { MenuOption, SettingActionMenu } from "../../../components";
import { Tooltip } from "@vizexplorer/global-ui-v2";
import { useState } from "react";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";

type Props = {
  maxGreets: number | null;
  onChange: (params: MaxMissedGreetsChangeParams) => void;
  loading?: boolean;
};

export function MaxMissedGreets({ maxGreets, onChange, loading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"max-missed-greets"}
      title={aboutHostsSettingTitle("max-missed-greets")}
      helpText={aboutHostsSettingHelp("max-missed-greets")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && maxGreets !== null && (
          <>
            <ToggleButton
              data-testid={"max-missed-greets-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={
                <Tooltip title={"Number of greets"}>
                  <WavingHandRoundedIcon data-testid={"icon"} />
                </Tooltip>
              }
            >
              {MENU_OPTIONS.find((opt) => opt.value === maxGreets)?.label}
            </ToggleButton>
            <SettingActionMenu
              data-testid={"max-missed-greets-menu"}
              anchorEl={anchorEl}
              titleIcon={<WavingHandRoundedIcon />}
              title={
                "Select the number of hosts missed greets before changing status to unavailable"
              }
              selectedValue={maxGreets}
              options={MENU_OPTIONS}
              onChange={(value) => {
                onChange({ settingId: "max-missed-greets", value });
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
