import { useOnpremVersionCheck } from "@vizexplorer/global-ui-core";
import { VersionStatus } from "./version-status";
import { ReleaseNotes } from "./release-notes";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";

export function UpdateManagement() {
  const { currentVersion, latestVersion, remainingDays, error } = useOnpremVersionCheck();

  if (error) throw error;

  return (
    <SettingsRoot data-testid={"update-management"}>
      <SettingsGrid>
        {currentVersion && (
          <SettingContainer reserveActionSpace>
            <VersionStatus
              currentVersion={currentVersion}
              latestVersion={latestVersion}
              remainingDays={remainingDays}
            />
          </SettingContainer>
        )}
        {!!latestVersion && (
          <SettingContainer reserveActionSpace>
            <ReleaseNotes notes={latestVersion.notes} />
          </SettingContainer>
        )}
      </SettingsGrid>
    </SettingsRoot>
  );
}
