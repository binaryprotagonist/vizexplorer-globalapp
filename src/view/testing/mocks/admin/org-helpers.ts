import {
  OrgSummaryFragment,
  DataAdapterEnableDocument,
  DataAdapterStageDb,
  DataFeedSourceSiteIdsDocument,
  DataFeedSourceSiteIdsQuery,
  DataFeedStatusDocument,
  DataFeedStatusQuery,
  OrgDataAdapterEnabledDocument,
  OrgDataAdapterEnabledQuery,
  OrgSitesMappingDocument,
  OrgSitesMappingQuery,
  OrgStageDatabaseDocument,
  OrgStageDatabaseQuery,
  SiteMappingFragment,
  CurrentOrgSummaryDocument,
  OrgFeaturesUpdateInput,
  OrgFeaturesUpdateMutation,
  OrgFeaturesUpdateDocument,
  DataAdapterEnableMutation
} from "generated-graphql";

export function mockCurrentOrgSummaryQuery(org?: OrgSummaryFragment) {
  return {
    request: {
      query: CurrentOrgSummaryDocument
    },
    result: {
      data: {
        currentOrg: org ?? generateDummyOrgSummaries()[0]
      }
    }
  };
}

export const mockStageDatabase: DataAdapterStageDb = {
  __typename: "DataAdapterStageDb",
  host: "stage host",
  port: 123,
  databaseName: "stage db",
  username: "stage user",
  password: "stage pass"
};

export function mockOrgDataAdapterEnabled(org: OrgSummaryFragment, enabled: boolean) {
  const data: OrgDataAdapterEnabledQuery = {
    org: {
      __typename: "Org",
      id: org.id,
      dataAdapterEnabled: enabled
    }
  };

  return {
    request: {
      query: OrgDataAdapterEnabledDocument
    },
    result: {
      data
    }
  };
}

export function mockDataFeedStatus() {
  const data: DataFeedStatusQuery = {
    dataFeedStatus: {
      __typename: "DataFeedStatus",
      maxDate: "2022-01-01"
    }
  };

  return {
    request: {
      query: DataFeedStatusDocument
    },
    result: {
      data
    }
  };
}

export function mockDataFeedSourceSitesIds(siteIds?: string[]) {
  const data: DataFeedSourceSiteIdsQuery = {
    dataFeedStatus: {
      __typename: "DataFeedStatus",
      sourceSiteIds: siteIds || ["1", "2", "3"]
    }
  };

  return {
    request: {
      query: DataFeedSourceSiteIdsDocument
    },
    result: {
      data
    }
  };
}

export function mockOrgStageDatabaseQuery(orgId: string, stageDb: DataAdapterStageDb) {
  const data: OrgStageDatabaseQuery = {
    org: {
      __typename: "Org",
      id: orgId,
      dataAdapter: {
        __typename: "DataAdapter",
        id: "1",
        stageDb: { ...stageDb }
      }
    }
  };

  return {
    request: {
      query: OrgStageDatabaseDocument
    },
    result: {
      data
    }
  };
}

export function mockOrgSitesMapping(orgId: string, siteMappings?: SiteMappingFragment[]) {
  const data: OrgSitesMappingQuery = {
    org: {
      __typename: "Org",
      id: orgId,
      sites: siteMappings || generateDummySitesMappings()
    }
  };

  return {
    request: {
      query: OrgSitesMappingDocument
    },
    result: {
      data
    }
  };
}

export function mockDataAdapterEnableMutation(orgId: string) {
  const data: DataAdapterEnableMutation = {
    dataAdapterEnable: {
      __typename: "DataAdapter",
      id: orgId
    }
  };

  return {
    request: {
      query: DataAdapterEnableDocument
    },
    result: {
      data
    }
  };
}

export function mockOrgFeaturesUpdateMutation(
  orgSettings: OrgFeaturesUpdateInput["orgSettings"]
) {
  const input: OrgFeaturesUpdateInput = {
    orgSettings
  };
  const data: OrgFeaturesUpdateMutation = {
    orgFeaturesUpdate: {
      __typename: "OrgFeatures",
      multiProperties: orgSettings.multiProperties || false
    }
  };

  return {
    request: {
      query: OrgFeaturesUpdateDocument,
      variables: { input }
    },
    result: {
      data
    }
  };
}

export function generateDummySitesMappings(length = 3) {
  return Array(length)
    .fill(null)
    .map<SiteMappingFragment>((_, idx) => ({
      __typename: "Site",
      id: idx + 1,
      name: `site ${idx + 1}`,
      dataFeedMapping: {
        __typename: "FeedSiteMapping",
        id: `${idx + 1}`,
        sourceSiteId: `source-${idx + 1}`
      }
    }));
}

export function generateDummyOrgSummaries(length = 3): OrgSummaryFragment[] {
  return Array(length)
    .fill(null)
    .map<OrgSummaryFragment>((_, idx) => ({
      __typename: "Org",
      id: `${idx + 1}`,
      company: {
        id: `${idx + 1}`,
        name: `Org Summary ${idx + 1}`,
        email: `Org Email ${idx + 1}`
      },
      dataAdapterAllowed: false
    }));
}
