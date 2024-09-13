import { LoyaltyTiers } from "./loyalty-tiers";
import { GlobalSettings } from "./global-settings";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";

export function OrgSettings() {
  return (
    <SettingsRoot>
      <SettingsGrid>
        <SettingContainer>
          <LoyaltyTiers />
        </SettingContainer>

        <SettingContainer reserveActionSpace>
          <GlobalSettings />
        </SettingContainer>
      </SettingsGrid>
    </SettingsRoot>
  );
}
