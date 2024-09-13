import { InfoOutlined, PlagiarismOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { formatISO } from "date-fns";
import {
  HeatMapInventoryFragment,
  OrgHeatMapFragment,
  OrgSitesMappingQuery,
  SiteMappingFragment,
  useHeatmapAssociateMutation,
  useHeatmapDeleteAssociationMutation,
  useHeatMapInventoryLazyQuery,
  useHeatMapInventorySearchLazyQuery,
  useOrgHeatmapsQuery,
  useOrgSitesMappingQuery
} from "generated-graphql";
import { ReactNode, useMemo, useState } from "react";
import {
  SettingContainer,
  SettingsGrid,
  SettingsRoot,
  SiteDropdown
} from "../../settings/common";
import { Card, PlainCardHeader } from "../../view/card";
import { sortArray } from "../../view/utils";
import { AllHeatMapsTable } from "./all-heat-maps-table";
import { AssociateDialog } from "./associate-dialog";
import { AssociatedHeatMapsTable } from "./associated-heat-maps-table";
import { AssociationSuccessDialog } from "./association-success-dialog";
import { AssociationToggle } from "./association-toggle";
import { DeleteAssociationDialog } from "./delete-association-dialog";
import { AssociationType, ASSOCIATION_TYPES } from "./types";
import { getAssociatedOrgHeatmaps } from "./utils";

type DisabledPropertyOptionProps = {
  liProps: React.HTMLAttributes<HTMLLIElement>;
  option: SiteMappingFragment;
};

function DisabledSiteOption({ liProps, option }: DisabledPropertyOptionProps) {
  const theme = useTheme();

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={theme.spacing(0.5, 2)}
    >
      <li {...liProps} style={{ padding: 0 }}>
        {option.name}
      </li>

      <Tooltip title={"No mapped source"} placement={"bottom-start"}>
        <InfoOutlined />
      </Tooltip>
    </Box>
  );
}

function MissingContent({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      m={theme.spacing(4, 2)}
      alignItems={"center"}
    >
      <Box
        p={"75px"}
        bgcolor={"#F9FAFB"}
        borderRadius={"50%"}
        width={"max-content"}
        mb={theme.spacing(2)}
      >
        <PlagiarismOutlined
          sx={{
            width: "140px",
            height: "140px",
            color: "#A6A6A6",
            stroke: "#ffffff",
            strokeWidth: 0.7
          }}
        />
      </Box>

      <Typography variant={"h5"} fontWeight={400}>
        {children}
      </Typography>
    </Box>
  );
}

export function HeatMapAssociations() {
  const theme = useTheme();
  const [selectedSite, setSelectedSite] = useState<SiteMappingFragment | null>(null);
  const [siteOptions, setSiteOptions] = useState<SiteMappingFragment[]>([]);
  const [associationType, setAssociationType] = useState<AssociationType>(
    ASSOCIATION_TYPES[0]
  );
  const [associationSuccess, setAssociationSuccess] = useState<boolean>(false);
  const [associateHeatMap, setAssociateHeatMap] = useState<HeatMapInventoryFragment>();
  const [deleteAssociation, setDeleteAssociation] = useState<OrgHeatMapFragment>();
  const [inventorySearch, setInventorySearch] = useState<string>("");
  const [associationSearch, setAssociationSearch] = useState<string>("");

  const { loading: sitesLoading, error: sitesErr } = useOrgSitesMappingQuery({
    onCompleted: handleSitesLoaded
  });
  const [
    loadInventory,
    {
      data: heatMapData,
      error: heatMapInventoryErr,
      loading: loadingHeatmapInventory,
      refetch: refetchHeatmapInventory
    }
  ] = useHeatMapInventoryLazyQuery();
  const [
    searchInventory,
    { data: inventorySearchData, loading: searchingInventory, error: searchInventoryErr }
  ] = useHeatMapInventorySearchLazyQuery();
  const {
    data: orgHeatmapData,
    error: orgHeatmapErr,
    loading: loadingOrgHeatmaps,
    refetch: refetchOrgHeatmaps
  } = useOrgHeatmapsQuery();

  const [
    createHeatmapAssociation,
    { loading: creatingHeatmapAssociation, error: heatmapAssociationErr }
  ] = useHeatmapAssociateMutation({ onCompleted: onAssociateHeatpmapComplete });
  const [
    deleteHeatmapAssociation,
    { loading: deletingAssociation, error: associationDeletionErr }
  ] = useHeatmapDeleteAssociationMutation();

  function handleSitesLoaded(data: OrgSitesMappingQuery) {
    const sites = data?.org?.sites;
    if (!sites) {
      setSiteOptions([]);
      return;
    }

    const sortedSites = sortArray(sites, true, (site) => site.name);
    const enabledSites = sortedSites.filter((site) => !isSiteOptionDisabled(site));
    const disabledSites = sortedSites.filter(isSiteOptionDisabled);
    setSiteOptions(enabledSites.concat(disabledSites));
  }

  async function onAssociateHeatpmapComplete() {
    refetchOrgHeatmaps();
    refetchHeatmapInventory();
    setAssociateHeatMap(undefined);
    setAssociationSuccess(true);
  }

  async function handleAssociateHeatmap(
    effectiveFrom: Date,
    floorId: string,
    overwrite: boolean
  ) {
    // convert datetime to naivedate
    const isoEffectiveFrom = formatISO(effectiveFrom, {
      representation: "date"
    });
    await createHeatmapAssociation({
      variables: {
        input: {
          effectiveFrom: isoEffectiveFrom,
          floorId,
          heatMapId: associateHeatMap!.id,
          sourceSiteId: selectedSite!.dataFeedMapping!.sourceSiteId!.toString(),
          overwrite
        }
      }
    });
  }

  async function handleDeleteAssociation(id: string) {
    await deleteHeatmapAssociation({
      variables: {
        id
      }
    });

    refetchOrgHeatmaps();
    refetchHeatmapInventory();
    setDeleteAssociation(undefined);
  }

  async function onSiteChange(site: SiteMappingFragment) {
    if (isSiteOptionDisabled(site)) return;
    setSelectedSite(site);
    loadInventory({
      variables: { siteId: site.dataFeedMapping!.sourceSiteId! }
    });
  }

  async function handleSearchInventory(keyword: string) {
    setInventorySearch(keyword);
    if (keyword) {
      searchInventory({ variables: { keyword } });
    }
  }

  function isSiteOptionDisabled(site: SiteMappingFragment): boolean {
    return !site.dataFeedMapping?.sourceSiteId;
  }

  if (sitesErr) throw sitesErr;
  if (heatMapInventoryErr) throw heatMapInventoryErr;
  if (searchInventoryErr) throw searchInventoryErr;
  if (heatmapAssociationErr) throw heatmapAssociationErr;
  if (orgHeatmapErr) throw orgHeatmapErr;
  if (associationDeletionErr) throw associationDeletionErr;

  const associatedHeatmaps = useMemo(() => {
    if (!selectedSite || !orgHeatmapData?.orgHeatMaps) return [];
    return getAssociatedOrgHeatmaps(selectedSite, orgHeatmapData.orgHeatMaps);
  }, [selectedSite, orgHeatmapData?.orgHeatMaps]);

  const inventory = inventorySearch
    ? inventorySearchData?.heatMapInventorySearch
    : heatMapData?.heatMapInventory;
  const availableHeatmaps = useMemo(() => {
    if (!inventory) return [];

    return inventory.filter((hmi) => {
      return !associatedHeatmaps.some((ahm) => ahm.heatMapId === hmi.id);
    });
  }, [inventory, associatedHeatmaps]);

  return (
    <>
      {associateHeatMap && (
        <AssociateDialog
          heatmap={associateHeatMap}
          onAssociate={handleAssociateHeatmap}
          onCancel={() => setAssociateHeatMap(undefined)}
          disabled={creatingHeatmapAssociation}
          existingAssociations={associatedHeatmaps.map((heatmap) => ({
            date: heatmap.effectiveFrom,
            floorId: heatmap.floorId
          }))}
        />
      )}
      {deleteAssociation && (
        <DeleteAssociationDialog
          association={deleteAssociation}
          onDelete={handleDeleteAssociation}
          onCancel={() => setDeleteAssociation(undefined)}
          disabled={deletingAssociation}
        />
      )}
      {associationSuccess && (
        <AssociationSuccessDialog onClose={() => setAssociationSuccess(false)} />
      )}
      <SettingsRoot data-testid={"heat-map-associations"}>
        <SettingsGrid>
          <SettingContainer reserveActionSpace>
            <Card sx={{ minHeight: "650px" }}>
              <PlainCardHeader>
                <Typography variant={"h6"}>Heat Map Associations</Typography>
              </PlainCardHeader>
              <Box>
                <SiteDropdown
                  value={selectedSite}
                  options={siteOptions}
                  onChange={onSiteChange}
                  loading={sitesLoading}
                  getOptionDisabled={isSiteOptionDisabled}
                  renderOption={(props, option) => {
                    return isSiteOptionDisabled(option) ? (
                      <DisabledSiteOption
                        key={`site-${option.id}`}
                        liProps={props}
                        option={option}
                      />
                    ) : (
                      <li {...props} key={`site-${option.id}`}>
                        {option.name}
                      </li>
                    );
                  }}
                />
              </Box>

              {!!selectedSite && (
                <Box margin={theme.spacing(3)}>
                  <AssociationToggle
                    value={associationType}
                    onChange={setAssociationType}
                  />

                  {associationType === "all" && (
                    <AllHeatMapsTable
                      data={availableHeatmaps}
                      onClickSelect={setAssociateHeatMap}
                      search={inventorySearch}
                      onSearchChange={handleSearchInventory}
                      loading={
                        loadingHeatmapInventory ||
                        searchingInventory ||
                        loadingOrgHeatmaps
                      }
                    />
                  )}

                  {associationType === "associated" &&
                    (associatedHeatmaps.length ? (
                      <AssociatedHeatMapsTable
                        data={associatedHeatmaps}
                        onClickDelete={setDeleteAssociation}
                        loading={loadingHeatmapInventory || loadingOrgHeatmaps}
                        search={associationSearch}
                        onSearchChange={setAssociationSearch}
                      />
                    ) : (
                      <MissingContent>
                        There are no files associated for this property yet
                      </MissingContent>
                    ))}
                </Box>
              )}
            </Card>
          </SettingContainer>
        </SettingsGrid>
      </SettingsRoot>
    </>
  );
}
