import { useEffect } from "react";
import { Credentials } from "./credentials";
import { FeedStatus } from "./status";
import { useOrgDataAdapterEnabledLazyQuery } from "generated-graphql";
import { Enable } from "./enable";
import { SiteMapping } from "./site-mapping";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../../settings/common";

export function DataFeed() {
  const [
    loadDataAdapterEnabled,
    { data: daEnabled, loading: loadingDaEnabled, error: daEnabledErr }
  ] = useOrgDataAdapterEnabledLazyQuery();

  useEffect(() => {
    loadDataAdapterEnabled();
  }, []);

  if (daEnabledErr) throw daEnabledErr;

  return (
    <SettingsRoot data-testid={"feed-configuration"}>
      {!daEnabled?.org?.dataAdapterEnabled && (
        <SettingContainer reserveActionSpace>
          <Enable
            onEnable={loadDataAdapterEnabled}
            loading={loadingDaEnabled}
            disabled={loadingDaEnabled}
          />
        </SettingContainer>
      )}
      <SettingsGrid>
        {!loadingDaEnabled && !!daEnabled?.org?.dataAdapterEnabled && (
          <>
            <SettingContainer reserveActionSpace>
              <Credentials />
            </SettingContainer>

            <SettingContainer reserveActionSpace>
              <SiteMapping />
            </SettingContainer>

            <SettingContainer reserveActionSpace>
              <FeedStatus />
            </SettingContainer>
          </>
        )}
      </SettingsGrid>
    </SettingsRoot>
  );
}
