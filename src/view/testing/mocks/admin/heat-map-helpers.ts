import {
  HeatMapInventoryDocument,
  HeatMapInventoryFragment,
  HeatMapInventoryQuery,
  HeatMapInventoryQueryVariables,
  HeatMapInventorySearchDocument,
  HeatMapInventorySearchQuery,
  HeatMapInventorySearchQueryVariables,
  OrgHeatMapFragment,
  OrgHeatmapsDocument,
  OrgHeatmapsQuery
} from "generated-graphql";

export function generateDummyHeatMapInventory(length = 3): HeatMapInventoryFragment[] {
  return Array(length)
    .fill(null)
    .map<HeatMapInventoryFragment>((_, i) => ({
      __typename: "HeatMap",
      id: `s3://maps/1612171522/file${i + 1}.js`,
      uploadedAt: `2022-01-0${i + 1}`,
      attributes: {
        site_id: "1",
        floor: "1",
        date: "2022-01-01"
      }
    }));
}

export function mockHeatMapInventoryQuery(
  heatmaps?: HeatMapInventoryFragment[],
  siteId?: string
) {
  const data: HeatMapInventoryQuery = {
    heatMapInventory: heatmaps ?? generateDummyHeatMapInventory()
  };
  const variables: HeatMapInventoryQueryVariables = {
    siteId: siteId ?? "site-1"
  };

  return {
    request: {
      query: HeatMapInventoryDocument,
      variables
    },
    result: {
      data
    }
  };
}

export function mockHeatMapInventorySearchQuery(
  keyword: string,
  heatmaps?: HeatMapInventoryFragment[]
) {
  const data: HeatMapInventorySearchQuery = {
    heatMapInventorySearch: heatmaps ?? generateDummyHeatMapInventory()
  };
  const variables: HeatMapInventorySearchQueryVariables = {
    keyword
  };

  return {
    request: {
      query: HeatMapInventorySearchDocument,
      variables
    },
    result: {
      data
    }
  };
}

export function generateDummyOrgHeatMaps(length = 3): OrgHeatMapFragment[] {
  return Array(length)
    .fill(null)
    .map<OrgHeatMapFragment>((_, i) => ({
      __typename: "OrgHeatMap",
      id: `ohm-${i + 1}`,
      floorId: `floor-${i + 1}`,
      effectiveFrom: `2022-01-0${i + 1}`,
      sourceSiteId: `source-${i + 1}`,
      heatMapId: `s3://maps/1612171522/file${i + 1}.js`
    }));
}

export function mockOrgHeatMapsQuery(heatmaps?: OrgHeatMapFragment[]) {
  const data: OrgHeatmapsQuery = {
    orgHeatMaps: heatmaps ?? generateDummyOrgHeatMaps()
  };

  return {
    request: {
      query: OrgHeatmapsDocument
    },
    result: {
      data
    }
  };
}
