import {
  AboutGuestsActionEvt,
  AboutGuestsChangeParams,
  AboutGuestsSettingId
} from "./types";
import { CategoryLabel, SettingContainer } from "../common";
import { ReportBannedGuest } from "./report-banned-guest";
import { GreetSettingsFragment } from "generated-graphql";

type Props = {
  settingIds: AboutGuestsSettingId[];
  settingData: GreetSettingsFragment | null;
  onChange: (params: AboutGuestsChangeParams) => void;
  onActionClick: (evt: AboutGuestsActionEvt) => void;
  loading?: boolean;
};

export function AboutGuests({
  settingIds,
  settingData,
  onChange,
  onActionClick,
  loading
}: Props) {
  return (
    <SettingContainer data-testid={"about-guests"}>
      <CategoryLabel>ABOUT GUESTS</CategoryLabel>
      {settingIds.map((setting) => {
        switch (setting) {
          case "report-banned-guest": {
            return (
              <ReportBannedGuest
                key={setting}
                config={settingData?.guestReportBanned ?? null}
                onChange={onChange}
                onClickEditEmails={() => onActionClick("edit-report-banned-guest-email")}
                loading={loading}
              />
            );
          }
          default: {
            throw Error(`Unexpected setting: ${setting}`);
          }
        }
      })}
    </SettingContainer>
  );
}
