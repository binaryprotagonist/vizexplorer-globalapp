import {
  DashboardResetDocument,
  DashboardResetMutation,
  DashboardResetMutationVariables,
  SiteDocument,
  SiteQuery,
  SiteQueryVariables
} from "../__generated__/sisense-dashboard-context";

export const mockSite: SiteQuery["site"] = {
  __typename: "Site",
  id: "0",
  currency: {
    __typename: "Currency",
    code: "USD"
  }
};

export type MockSiteQueryOpts = {
  site?: SiteQuery["site"];
  vars?: SiteQueryVariables;
};

export function mockSiteQuery({ site, vars }: MockSiteQueryOpts = {}) {
  const variables: SiteQueryVariables = {
    id: "0",
    ...vars
  };
  const data: SiteQuery = { site: site ?? mockSite };

  return {
    request: { query: SiteDocument, variables },
    result: { data }
  };
}

export type MockDashboardResetMutationOpts = {
  dashboard?: DashboardResetMutation["odrDashboardReset"];
  vars?: Partial<DashboardResetMutationVariables>;
};

export function mockDashboardResetMutation({
  dashboard,
  vars
}: MockDashboardResetMutationOpts = {}) {
  const variables: DashboardResetMutationVariables = {
    id: "0",
    siteId: 0,
    ...vars
  };
  const data: DashboardResetMutation = {
    odrDashboardReset: dashboard ?? {
      __typename: "OdrDashboard",
      id: "0",
      filtersBySite: []
    }
  };

  return {
    request: { query: DashboardResetDocument, variables },
    result: { data }
  };
}
