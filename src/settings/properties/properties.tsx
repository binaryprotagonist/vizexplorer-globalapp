import { useMemo, useState } from "react";
import { Add } from "@mui/icons-material";
import { PropertiesTable } from "./properties-table";
import {
  SiteFragment,
  useCompanyQuery,
  useCurrentOrgFeaturesQuery,
  useCurrentUserQuery,
  useGetSitesQuery
} from "generated-graphql";
import { DeleteSiteDialog, ManageSiteDialog } from "./dialog";
import { ActionType } from "./types";
import { SettingContainer, SettingsGrid, SettingsRoot, TextStyleButton } from "../common";
import { disabledAddReasoning } from "./utils";
import { Box, useTheme } from "@mui/material";
import { isAdminBuild } from "../../utils";
import { MultiPropertySwitch } from "./admin";

export function Properties() {
  const theme = useTheme();
  const { data: orgFeatures, error: orgFeatuersErr } = useCurrentOrgFeaturesQuery();
  const { data: companyData, error: companyError } = useCompanyQuery();
  const { data: currentUserData, error: curUserErr } = useCurrentUserQuery();
  const { data: sitesData, error: sitesError } = useGetSitesQuery();
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [siteToDelete, setSiteToDelete] = useState<SiteFragment | null>(null);
  const [siteToEdit, setSiteToEdit] = useState<SiteFragment | null>(null);

  function onActionClick(action: ActionType, site: SiteFragment) {
    switch (action) {
      case ActionType.DELETE:
        setSiteToDelete(site);
        break;
      case ActionType.EDIT:
        setSiteToEdit(site);
        break;
    }
  }

  if (companyError) throw companyError;
  if (sitesError) throw sitesError;
  if (curUserErr) throw curUserErr;
  if (orgFeatuersErr) throw orgFeatuersErr;

  const currentUser = currentUserData?.currentUser;
  const company = companyData?.currentOrg?.company;
  const isMultiProperty = !!orgFeatures?.currentOrg?.features.multiProperties;

  const addDisabledReasoning = useMemo(() => {
    if (!sitesData?.sites || !currentUser || !orgFeatures) {
      return "";
    }

    return disabledAddReasoning(currentUser, sitesData.sites, isMultiProperty);
  }, [sitesData, currentUser, orgFeatures]);

  return (
    <>
      <span data-testid={"properties"} />
      <SettingsRoot>
        {showAddDialog && <ManageSiteDialog onClose={() => setShowAddDialog(false)} />}
        {siteToEdit && (
          <ManageSiteDialog site={siteToEdit} onClose={() => setSiteToEdit(null)} />
        )}
        {siteToDelete && (
          <DeleteSiteDialog site={siteToDelete} onClose={() => setSiteToDelete(null)} />
        )}
        <SettingsGrid>
          {!!orgFeatures && !!sitesData && !!currentUser && !!company && (
            <SettingContainer>
              <Box
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
                margin={theme.spacing(0, 2, 1, 0)}
              >
                {isAdminBuild() && (
                  <Box mr={theme.spacing(6)}>
                    <MultiPropertySwitch enabled={isMultiProperty} />
                  </Box>
                )}
                <TextStyleButton
                  data-testid={"add-property-btn"}
                  tooltip={addDisabledReasoning}
                  startIcon={<Add />}
                  color={"primary"}
                  onClick={() => setShowAddDialog(true)}
                  disabled={!!addDisabledReasoning}
                >
                  Add Property
                </TextStyleButton>
              </Box>
              <PropertiesTable
                currentUser={currentUser}
                properties={sitesData.sites!}
                companyName={company.name}
                onActionClick={onActionClick}
              />
            </SettingContainer>
          )}
        </SettingsGrid>
      </SettingsRoot>
    </>
  );
}
