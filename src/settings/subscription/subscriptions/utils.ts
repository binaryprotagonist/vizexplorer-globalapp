import { format, toDate } from "date-fns";
import { Environment } from "./types";
import { capitalize } from "../../../view/utils/capitalize";

const INVALID_DATE = "Invalid Date";

export class Display {
  static package(packageName: string) {
    return capitalize(packageName);
  }

  static environment(isOnprem: boolean) {
    return isOnprem ? "On-Premises" : "Cloud";
  }

  static date(dateStr: string) {
    try {
      return format(toDate(new Date(dateStr)), "MMM dd, yyyy");
    } catch (_) {
      return INVALID_DATE;
    }
  }
}

export function isCloud(environment?: Environment | null): boolean {
  return environment === Environment.CLOUD;
}

export function isOnprem(environment?: Environment | null): boolean {
  return environment === Environment.ONPREM;
}
