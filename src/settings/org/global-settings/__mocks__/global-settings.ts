import { PdTimePeriodLevel } from "generated-graphql";
import { GlobalSettingsTimePeriodFragment } from "../__generated__/global-settings";

export const mockTimePeriods: GlobalSettingsTimePeriodFragment[] = [
  {
    level: PdTimePeriodLevel.Trips,
    count: 6,
    enabled: true,
    default: false
  },
  {
    level: PdTimePeriodLevel.Days,
    count: 30,
    enabled: true,
    default: false
  },
  {
    level: PdTimePeriodLevel.Days,
    count: 60,
    enabled: true,
    default: false
  },
  {
    level: PdTimePeriodLevel.Days,
    count: 90,
    enabled: true,
    default: false
  },
  {
    level: PdTimePeriodLevel.YearToDate,
    count: 1,
    enabled: true,
    default: false
  }
];
