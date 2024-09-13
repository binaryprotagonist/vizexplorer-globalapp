import { Box, styled } from "@mui/material";
import { AboutGuests, ReportBannedGuestDialog } from "./about-guests";
import { AboutGreets, AboutGreetsChangeParams } from "./about-greets";
import { SettingContainer } from "./common";
import {
  GreetSettingsUpdateMutationOptions,
  useGreetSettingsQuery,
  useGreetSettingsUpdateMutation
} from "generated-graphql";
import { AboutGuestsChangeParams, SettingDialogId } from "./about-guests/types";
import { useMemo, useState } from "react";
import { useAlert } from "view-v2/alert";
import { NetworkStatus } from "@apollo/client";
import {
  ALERT_SETTING_UPDATED,
  ALERT_SETTING_UPDATE_FAILED,
  aboutGreetsOptimisticInput,
  aboutHostsOptimisticInput,
  filteredGreetCategories,
  reportBannedOptimisticInput
} from "./utils";
import { OptimisticInput } from "./types";
import { AboutHosts, AboutHostsChangeParams } from "./about-hosts";
import { Search } from "../../common";
import { NoSearchResult } from "./no-search-result";
import { SomethingWentWrong } from "view-v2/page";

const Container = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 2, 2.5, 0)
}));

export function SystemSettings() {
  const { addAlert } = useAlert();
  const [showDialog, setShowDialog] = useState<SettingDialogId | null>(null);
  const [search, setSearch] = useState<string>("");

  const {
    data: settingsData,
    networkStatus: settingsNetworkStatus,
    error: settingsErr,
    refetch: refetchSettings
  } = useGreetSettingsQuery({
    fetchPolicy: "cache-and-network"
  });
  const [updateSettings, { loading: updatingSettings }] = useGreetSettingsUpdateMutation({
    onCompleted: () => {
      addAlert(ALERT_SETTING_UPDATED, true);
    },
    onError: () => {
      addAlert(ALERT_SETTING_UPDATE_FAILED, true);
      refetchSettings();
    }
  });

  const settingState = settingsData?.pdGreetSettings;
  const settingsLoading = settingsNetworkStatus === NetworkStatus.loading;
  const categories = useMemo(() => filteredGreetCategories(search), [search]);

  async function updateSettingsOptimistically(
    { input, newValue }: OptimisticInput,
    updateOpts?: GreetSettingsUpdateMutationOptions
  ) {
    await updateSettings({
      variables: { input },
      optimisticResponse: { pdGreetSettingsUpdate: { ...settingState!, ...newValue } },
      ...updateOpts
    });
  }

  function handleAboutGuestsChange({ settingId, value }: AboutGuestsChangeParams) {
    if (settingId === "report-banned-guest") {
      if (value.enabled) {
        setShowDialog("report-banned-guest-emails");
        return;
      }

      updateSettingsOptimistically(reportBannedOptimisticInput(value));
      return;
    }
  }

  function handleAboutGreetsChange(params: AboutGreetsChangeParams) {
    updateSettingsOptimistically(aboutGreetsOptimisticInput(params));
  }

  function handleAboutHostsChange(params: AboutHostsChangeParams) {
    updateSettingsOptimistically(aboutHostsOptimisticInput(params));
  }

  if (settingsErr) {
    return (
      <Container data-testid={"something-went-wrong"}>
        <SomethingWentWrong onClickRefresh={() => refetchSettings()} />
      </Container>
    );
  }

  return (
    <>
      {showDialog === "report-banned-guest-emails" && (
        <ReportBannedGuestDialog
          emails={settingState?.guestReportBanned.emailRecipients ?? []}
          onSave={(emailRecipients) => {
            // No need for optimistic update as we need to wait for a successful response before closing the dialog anyway
            updateSettings({
              variables: {
                input: { guestReportBanned: { enabled: true, emailRecipients } }
              },
              onCompleted: () => {
                addAlert(ALERT_SETTING_UPDATED, true);
                setShowDialog(null);
              }
            });
          }}
          onClose={() => setShowDialog(null)}
          disabled={updatingSettings}
        />
      )}
      <Container data-testid={"system-settings"}>
        <Search
          data-testid={"system-setting-search"}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onClickClose={() => setSearch("")}
          placeholder={"Search"}
          sx={{ width: "250px" }}
        />
        <SettingContainer>
          {categories.map((category) => {
            if (category.name === "about-guests") {
              return (
                <AboutGuests
                  key={category.name}
                  settingIds={category.settings}
                  settingData={settingState ?? null}
                  onChange={handleAboutGuestsChange}
                  onActionClick={(evt) => {
                    if (evt === "edit-report-banned-guest-email") {
                      setShowDialog("report-banned-guest-emails");
                    }
                  }}
                  loading={settingsLoading}
                />
              );
            }

            if (category.name === "about-greets") {
              return (
                <AboutGreets
                  key={category.name}
                  settingIds={category.settings}
                  settingData={settingState ?? null}
                  onChange={handleAboutGreetsChange}
                  loading={settingsLoading}
                />
              );
            }

            if (category.name === "about-hosts") {
              return (
                <AboutHosts
                  key={category.name}
                  settingIds={category.settings}
                  settingData={settingState ?? null}
                  onChange={handleAboutHostsChange}
                  loading={settingsLoading}
                />
              );
            }
          })}

          {!!search && !categories.length && (
            <NoSearchResult search={search} onClickClearSearch={() => setSearch("")} />
          )}
        </SettingContainer>
      </Container>
    </>
  );
}
