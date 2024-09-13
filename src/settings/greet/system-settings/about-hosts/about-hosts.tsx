import { AboutHostsSettingId, AboutHostsChangeParams } from "./types";
import { CategoryLabel, SettingContainer } from "../common";
import { EnalbleGreetAssignmentSection } from "./greet-assignment-section";
import { AllowSuppressionCompletion } from "./allow-suppression";
import { MaxAssignmentPerHost } from "./max-host-assignment";
import { MaxMissedGreets } from "./max-missed-greets";
import { GreetSettingsFragment } from "generated-graphql";

type Props = {
  settingIds: AboutHostsSettingId[];
  settingData: GreetSettingsFragment | null;
  onChange: (params: AboutHostsChangeParams) => void;
  loading?: boolean;
};

export function AboutHosts({ settingIds, settingData, onChange, loading }: Props) {
  return (
    <SettingContainer data-testid={"about-hosts"}>
      <CategoryLabel>ABOUT HOSTS</CategoryLabel>
      {settingIds.map((setting) => {
        switch (setting) {
          case "enable-section-for-greet":
            return (
              <EnalbleGreetAssignmentSection
                key={setting}
                loading={loading}
                hostEnableSections={settingData?.hostEnableSections ?? null}
                onChange={onChange}
              />
            );
          case "allow-suppression-without-completion":
            return (
              <AllowSuppressionCompletion
                key={setting}
                loading={loading}
                hostAllowSuppression={settingData?.hostAllowSuppression ?? null}
                onChange={onChange}
              />
            );
          case "max-assignment-per-host":
            return (
              <MaxAssignmentPerHost
                key={setting}
                numAssignments={settingData?.hostMaxAssignments ?? null}
                onChange={onChange}
                loading={loading}
              />
            );
          case "max-missed-greets":
            return (
              <MaxMissedGreets
                key={setting}
                maxGreets={settingData?.hostMaxMissedGreets ?? null}
                onChange={onChange}
                loading={loading}
              />
            );
          default:
            throw Error(`Unexpected setting: ${setting}`);
        }
      })}
    </SettingContainer>
  );
}
