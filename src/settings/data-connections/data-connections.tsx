import { DataConnectionsCard } from "./data-connections-card";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";

export function DataConnections() {
  return (
    <SettingsRoot>
      <SettingsGrid>
        <SettingContainer reserveActionSpace>
          <DataConnectionsCard />
        </SettingContainer>
      </SettingsGrid>
    </SettingsRoot>
  );
}
