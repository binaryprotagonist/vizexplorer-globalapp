import { PdTimePeriodLevel } from "generated-graphql";
import { assetUnreachable } from "../../../view/utils";
import { GlobalSetting, defaultGlobalSettings } from "./types";
import {
  GlobalSettingsFragment,
  GlobalSettingsTimePeriodFragment
} from "./__generated__/global-settings";
import { produce } from "immer";

export function settingValueSearch(search: string, setting: GlobalSetting): boolean {
  if (setting.id === "worth-pct") {
    return setting.config.value.toString().toLowerCase().includes(search.toLowerCase());
  }

  if (setting.id === "guest-time-periods" || setting.id === "host-time-periods") {
    return setting.config.value.some((period) =>
      timePeriodLabel(period).toLocaleLowerCase().includes(search.toLowerCase())
    );
  }

  return assetUnreachable(setting);
}

export function timePeriodLabel(timePeriod: GlobalSettingsTimePeriodFragment): string {
  switch (timePeriod.level) {
    case PdTimePeriodLevel.YearToDate:
      return "Year to date";
    case PdTimePeriodLevel.Days:
      return timePeriod.count === 1 ? "Last day" : `Last ${timePeriod.count} days`;
    case PdTimePeriodLevel.PriorDays:
      return timePeriod.count === 1 ? "Prior day" : `Prior ${timePeriod.count} days`;
    case PdTimePeriodLevel.Trips:
      return timePeriod.count === 1 ? "Last trip" : `Last ${timePeriod.count} trips`;
    case PdTimePeriodLevel.PriorMonths:
      return timePeriod.count === 1 ? "Last month" : `Last ${timePeriod.count} months`;
    case PdTimePeriodLevel.MonthToDate:
      return "Month to date";
    case PdTimePeriodLevel.PriorQuarters:
      return timePeriod.count === 1
        ? "Last quarter"
        : `Last ${timePeriod.count} quarters`;
    case PdTimePeriodLevel.QuarterToDate:
      return "Quarter to date";
  }
}

export function generateSettings(settingValueMap: GlobalSettingsFragment) {
  return produce([...defaultGlobalSettings], (draft) => {
    draft.forEach((setting) => {
      switch (setting.id) {
        case "worth-pct":
          setting.config.value = settingValueMap.worthPercentage;
          break;
        case "guest-time-periods":
          setting.config.value = settingValueMap.guestTimePeriods;
          break;
        case "host-time-periods":
          setting.config.value = settingValueMap.hostTimePeriods;
          break;
        default:
          // force typescript to detect if the switch is exhaustive
          assetUnreachable(setting);
      }
    });
  });
}

export function isMatchingTimePeriod(
  period1: GlobalSettingsTimePeriodFragment,
  period2: GlobalSettingsTimePeriodFragment
): boolean {
  return period1.level === period2.level && period1.count === period2.count;
}
