import { GlobalSettingsTimePeriodFragment } from "./__generated__/global-settings";

type SettingBase = {
  name: string;
  description: string;
  additionalInfo?: string[];
};

export type PercentSetting = {
  variant: "numeric";
  id: "worth-pct";
  config: {
    value: number;
    min: number;
    max: number;
  };
} & SettingBase;

export type GuestTimePeriodsSetting = {
  variant: "guest-time-periods";
  id: "guest-time-periods";
  config: {
    value: GlobalSettingsTimePeriodFragment[];
  };
} & SettingBase;

export type HostTimePeriodsSetting = {
  variant: "host-time-periods";
  id: "host-time-periods";
  config: {
    value: GlobalSettingsTimePeriodFragment[];
  };
} & SettingBase;

export type GlobalSetting =
  | PercentSetting
  | GuestTimePeriodsSetting
  | HostTimePeriodsSetting;

export const defaultWorthPctSetting: Readonly<PercentSetting> = {
  variant: "numeric",
  id: "worth-pct",
  name: "Worth Percent",
  description:
    "Multiplied to Actual Win values when comparing to Theo Win for Worth calculation",
  additionalInfo: [
    "Recommendations: Changes to this parameter will not take effect until the next scheduled generation.",
    "Reporting: Changes to this parameter will take effect immediately."
  ],
  config: {
    value: 40,
    min: 1,
    max: 100
  }
};

export const defaultGuestTimePeriodsSetting: Readonly<GuestTimePeriodsSetting> = {
  variant: "guest-time-periods",
  id: "guest-time-periods",
  name: "Guest Summary Time Period Selection",
  description:
    "Select which time periods will be displayed in PD Engage Guest Summary to check guest's historyical activity metrics",
  config: {
    value: []
  }
};

export const defaultHostTimePeriodsSetting: Readonly<HostTimePeriodsSetting> = {
  variant: "host-time-periods",
  id: "host-time-periods",
  name: "Host Summary Time Period Selection",
  description:
    "Select which time periods will be displayed in PD Engage Host Summary to check host's historyical activity metrics",
  config: {
    value: []
  }
};

export const defaultGlobalSettings = [
  defaultWorthPctSetting,
  defaultGuestTimePeriodsSetting,
  defaultHostTimePeriodsSetting
] as const;
