import { useMemo, useState } from "react";
import { GlobalSettingsTable } from "./global-settings-table";
import { GlobalSetting } from "./types";
import { PdOrgSettingsInput, useCurrentUserQuery } from "generated-graphql";
import { EditSettings } from "./edit-settings";
import { gql } from "@apollo/client";
import {
  useGlobalSettingsQuery,
  useGlobalSettingsUpdateMutation
} from "./__generated__/global-settings";
import { generateSettings } from "./utils";

export function GlobalSettings() {
  const [editSetting, setEditSetting] = useState<GlobalSetting | null>(null);
  const {
    data: curUserData,
    loading: curUserLoading,
    error: curUserErr
  } = useCurrentUserQuery();
  const {
    data: settingsData,
    loading: settingsLoading,
    error: settingsErr
  } = useGlobalSettingsQuery();
  const [updateSettings, { loading: settingsUpdating, error: settingsUpdateErr }] =
    useGlobalSettingsUpdateMutation();

  async function onEditSave(input: PdOrgSettingsInput) {
    await updateSettings({ variables: { input } });
    setEditSetting(null);
  }

  if (curUserErr) throw curUserErr;
  if (settingsErr) throw settingsErr;
  if (settingsUpdateErr) throw settingsUpdateErr;

  const currentUser = curUserData?.currentUser;
  const settings = useMemo(() => {
    if (settingsData?.pdOrgSettings) {
      return generateSettings(settingsData?.pdOrgSettings);
    }
    return [];
  }, [settingsData?.pdOrgSettings]);

  return (
    <>
      {editSetting && (
        <EditSettings
          setting={editSetting}
          onSave={onEditSave}
          onClose={() => setEditSetting(null)}
          disabled={settingsUpdating}
        />
      )}
      <GlobalSettingsTable
        currentUser={currentUser || null}
        settings={settings}
        loading={curUserLoading || settingsLoading}
        onEditClick={setEditSetting}
      />
    </>
  );
}

// don't include `id` to avoid cache overwrites for time periods used by different settings
const GLOBAL_SETTINGS_TIME_PERIOD_FRAGMENT = gql`
  fragment GlobalSettingsTimePeriod on PdTimePeriod {
    level
    count
    enabled
    default
  }
`;

const GLOBAL_SETTINGS_FRAGMENT = gql`
  fragment GlobalSettings on PdOrgSettings {
    id
    worthPercentage
    guestTimePeriods {
      ...GlobalSettingsTimePeriod
    }
    hostTimePeriods {
      ...GlobalSettingsTimePeriod
    }
  }
  ${GLOBAL_SETTINGS_TIME_PERIOD_FRAGMENT}
`;

const _GLOBAL_SETTINGS_QUERY = gql`
  query globalSettings {
    pdOrgSettings {
      ...GlobalSettings
    }
  }
  ${GLOBAL_SETTINGS_FRAGMENT}
`;

const _GLOBAL_SETTINGS_UPDATE_MUTATION = gql`
  mutation globalSettingsUpdate($input: PdOrgSettingsInput!) {
    pdOrgSettingsUpdate(input: $input) {
      id
      ...GlobalSettings
    }
  }
  ${GLOBAL_SETTINGS_FRAGMENT}
`;
