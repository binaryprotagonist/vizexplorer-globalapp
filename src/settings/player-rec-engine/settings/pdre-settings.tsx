import { useMemo, useState } from "react";
import { produce } from "immer";
import { PdreSettingsTable } from "./pdre-settings-table";
import { defaultPdreSettings, PdreSetting } from "./types";
import {
  PdOrgSettingsInput,
  PdreSettingsFragment,
  useCurrentUserQuery,
  usePdreSettingsQuery,
  useUpdatePdreSettingsMutation
} from "generated-graphql";
import { assetUnreachable } from "../../../view/utils";
import { EditSettings } from "./edit-settings";

export function PdreSettings() {
  const [editSetting, setEditSetting] = useState<PdreSetting | null>(null);
  const {
    data: curUserData,
    loading: curUserLaoding,
    error: curUserErr
  } = useCurrentUserQuery();
  const {
    data: settingsData,
    loading: settingsLoading,
    error: settingsErr
  } = usePdreSettingsQuery();
  const [updateSettings, { loading: settingsUpdating, error: settingsUpdateErr }] =
    useUpdatePdreSettingsMutation();

  async function onEditSave(input: PdOrgSettingsInput) {
    await updateSettings({ variables: { input } });
    setEditSetting(null);
  }

  const currentUser = curUserData?.currentUser || null;
  const settings = useMemo(() => {
    if (settingsData?.settings) {
      return generateSettings(settingsData.settings);
    }
    return [];
  }, [settingsData?.settings]);

  if (settingsErr) throw settingsErr;
  if (curUserErr) throw curUserErr;
  if (settingsUpdateErr) throw settingsUpdateErr;

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
      <PdreSettingsTable
        currentUser={currentUser}
        settings={settings}
        loading={settingsLoading || curUserLaoding}
        onEditClick={setEditSetting}
      />
    </>
  );
}

function generateSettings(settingValueMap: PdreSettingsFragment) {
  return produce([...defaultPdreSettings], (draft) => {
    draft.forEach((setting) => {
      switch (setting.id) {
        case "lookback-period":
          setting.config.value = settingValueMap.lookbackDays;
          break;
        case "value-metric":
          setting.config.value = settingValueMap.valueMetric;
          break;
        case "max-tasks-per-host-code":
          setting.config.value = settingValueMap.maxTasksPerHost;
          break;
        case "task-fetch-limit":
          setting.config.value = settingValueMap.maxTasksPerView;
          break;
        case "task-scheduler":
          setting.config.value = settingValueMap.taskScheduler;
          break;
        default:
          // force typescript to detect if the switch is exhaustive
          assetUnreachable(setting);
      }
    });
  });
}
