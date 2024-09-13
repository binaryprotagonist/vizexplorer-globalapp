import { BannedGuestChangeParams } from "./report-banned-guest";

export const aboutGuestsSettings = ["report-banned-guest"] as const;
export type AboutGuestsSettingId = (typeof aboutGuestsSettings)[number];
export type AboutGuestsChangeParams = BannedGuestChangeParams;
export type AboutGuestsActionEvt = "edit-report-banned-guest-email";
export type SettingDialogId = "report-banned-guest-emails";
