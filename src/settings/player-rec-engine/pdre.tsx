import { PdreRules } from "./rules";
import { PdreSettings } from "./settings";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";

export function Pdre() {
  return (
    <SettingsRoot>
      <SettingsGrid>
        <SettingContainer reserveActionSpace>
          <PdreRules />
        </SettingContainer>

        <SettingContainer reserveActionSpace>
          <PdreSettings />
        </SettingContainer>
      </SettingsGrid>
    </SettingsRoot>
  );
}
