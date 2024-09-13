import { format } from "date-fns";
import { TimeTz } from "./types";
import timezones from "./timezones";

export function defaultTimezone(tz?: string) {
  const initialTz = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezones.find((tz) => tz.tzCode === initialTz) || timezones[0];
}

export function displayTimeTz(timeTz: TimeTz): string {
  const tz = timezones.find((tz) => tz.tzCode === timeTz.timezone);
  const tzLabel = tz ? ` ${tz.label}` : "";
  return `${format(timeTzAsDate(timeTz), "p")}${tzLabel}`;
}

export function timeTzAsDate(timeTz: TimeTz): Date {
  return new Date(0, 0, 0, timeTz.hour, timeTz.minute);
}
