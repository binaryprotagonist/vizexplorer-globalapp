import { AboutGuestsSettingId } from "./types";

export function aboutGuestsSettingTitle(settingId: AboutGuestsSettingId): string {
  switch (settingId) {
    case "report-banned-guest":
      return "Report banned guest";
  }
}

export function aboutGuestsSettingHelp(settingId: AboutGuestsSettingId): string {
  switch (settingId) {
    case "report-banned-guest":
      return "If a Banned Guest cards in, report it to someone.";
  }
}
