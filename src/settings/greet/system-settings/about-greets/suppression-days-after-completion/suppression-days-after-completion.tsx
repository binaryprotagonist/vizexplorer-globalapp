import { GreetSuppressionDaysFragment } from "generated-graphql";
import { SettingContent, SettingsCard } from "../../common";
import { aboutGreetsSettingHelp, aboutGreetsSettingTitle } from "../utils";
import { SuppressionDaysChangeParams } from "./types";
import { Skeleton } from "@mui/material";
import { ToggleButton } from "../../../../common";
import { MenuOption, SettingActionMenu } from "../../../components";
import { ReactNode, useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import { Tooltip } from "@vizexplorer/global-ui-v2";

type Props = {
  suppressionDays: GreetSuppressionDaysFragment | null;
  onChange: (params: SuppressionDaysChangeParams) => void;
  loading?: boolean;
};

export function SuppressionDaysAfterCompletion({
  suppressionDays,
  onChange,
  loading
}: Props) {
  function handleChange(field: "coded" | "uncoded", value: number) {
    onChange({
      settingId: "suppression-days-after-completion",
      value: {
        __typename: "PdGreetSuppressionDays",
        coded: field === "coded" ? value : suppressionDays!.coded,
        uncoded: field === "uncoded" ? value : suppressionDays!.uncoded
      }
    });
  }

  return (
    <SettingsCard
      data-testid={"suppression-days-after-completion"}
      title={aboutGreetsSettingTitle("suppression-days-after-completion")}
      helpText={aboutGreetsSettingHelp("suppression-days-after-completion")}
    >
      <SettingContent columnGap={"32px"}>
        {loading && <LoadingActions />}
        {!loading && !!suppressionDays && (
          <>
            <CodedDays
              value={suppressionDays.coded}
              onChange={(value) => handleChange("coded", value)}
            />
            <UnCodedDays
              value={suppressionDays.uncoded}
              onChange={(value) => handleChange("uncoded", value)}
            />
          </>
        )}
      </SettingContent>
    </SettingsCard>
  );
}

function LoadingActions() {
  return (
    <>
      <Skeleton data-testid={"coded-suppression-loading"} variant={"rounded"}>
        <CodedDays value={2} />
      </Skeleton>
      <Skeleton data-testid={"uncoded-suppression-loading"} variant={"rounded"}>
        <CodedDays value={2} />
      </Skeleton>
    </>
  );
}

type CodedDaysProps = {
  value: number;
  onChange?: (value: number) => void;
};

function CodedDays({ value, onChange }: CodedDaysProps) {
  return (
    <Action
      id={"coded-suppression-days"}
      value={value}
      options={CODED_MENU_OPTIONS}
      menuTitle={"Select the number of days for coded guests suppression"}
      startIcon={
        <Tooltip title={"Coded guests"}>
          <PersonRoundedIcon data-testid={"coded-action-icon"} />
        </Tooltip>
      }
      onChange={onChange}
    />
  );
}

type UnCodedDaysProps = {
  value: number;
  onChange?: (value: number) => void;
};

function UnCodedDays({ value, onChange }: UnCodedDaysProps) {
  return (
    <Action
      id={"uncoded-suppression-days"}
      value={value}
      options={UNCODED_MENU_OPTIONS}
      menuTitle={"Select the number of days for uncoded guests suppression"}
      startIcon={
        <Tooltip title={"Uncoded guests"}>
          <PersonOffRoundedIcon data-testid={"uncoded-action-icon"} />
        </Tooltip>
      }
      onChange={onChange}
    />
  );
}

type ActionProps = {
  id: string;
  startIcon: ReactNode;
  menuTitle: string;
  value: number;
  options: MenuOption<number>[];
  onChange?: (value: number) => void;
};

function Action({ id, startIcon, menuTitle, value, options, onChange }: ActionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <ToggleButton
        data-testid={`${id}-action`}
        selected={!!anchorEl}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={startIcon}
      >
        {options.find((opt) => opt.value === value)?.label}
      </ToggleButton>
      <SettingActionMenu
        data-testid={`${id}-menu`}
        anchorEl={anchorEl}
        titleIcon={startIcon}
        title={menuTitle}
        selectedValue={value}
        options={options}
        onChange={(value) => {
          onChange?.(value);
          setAnchorEl(null);
        }}
        onClose={() => setAnchorEl(null)}
      />
    </>
  );
}

const CODED_MENU_OPTIONS: MenuOption<number>[] = Array.from({ length: 14 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} day${i === 0 ? "" : "s"}`
}));
const UNCODED_MENU_OPTIONS: MenuOption<number>[] = Array.from({ length: 14 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} day${i === 0 ? "" : "s"}`
}));
