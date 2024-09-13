import { format } from "date-fns";
import { DataRefreshTimeFragment } from "generated-graphql";
import timezones from "../../../view/utils/timezones";

export function scheduleAsDate(schedule: DataRefreshTimeFragment): Date {
  return new Date(0, 0, 0, schedule.hour, schedule.minute);
}

/**
 * displays Schedule in time format as: `h:mm AM/PM (UTC+/-hh:mm)`
 */
export function displaySchedule(schedule: DataRefreshTimeFragment): string {
  const tz = timezones.find((tz) => tz.tzCode === schedule.timezone);
  const tzLabel = tz ? ` ${tz.label}` : "";
  return `${format(scheduleAsDate(schedule), "p")}${tzLabel}`;
}
