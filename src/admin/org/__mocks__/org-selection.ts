import {
  DeliveryMethodDocument,
  DeliveryMethodQuery,
  OrgSearchDocument,
  OrgSearchQuery,
  OrgSearchQueryVariables,
  OrgSummaryFragment,
  OrgsDocument,
  OrgsQuery
} from "../__generated__/org-selection";

export function generateDummyOrgs(length = 3): OrgSummaryFragment[] {
  return Array(length)
    .fill(null)
    .map<OrgSummaryFragment>((_, idx) => ({
      __typename: "Org",
      id: `${idx + 1}`,
      company: {
        id: `${idx + 1}`,
        name: `Org Summary ${idx + 1}`,
        email: `Org Email ${idx + 1}`
      }
    }));
}

export type MockOrgsQueryOpts = {
  orgs?: OrgSummaryFragment[];
};

export function mockOrgsQuery({ orgs }: MockOrgsQueryOpts = {}) {
  const data: OrgsQuery = {
    orgs: orgs ?? generateDummyOrgs()
  };

  return {
    request: {
      query: OrgsDocument
    },
    result: {
      data
    }
  };
}

export function mockDeliveryMethodQuery(onPrem?: boolean) {
  const data: DeliveryMethodQuery = {
    __typename: "Query",
    discovery: {
      __typename: "Discovery",
      env: {
        __typename: "Env",
        onPrem: onPrem ?? false
      }
    }
  };

  return {
    request: {
      query: DeliveryMethodDocument
    },
    result: {
      data
    }
  };
}

export type MockOrgSearchQueryOpts = {
  orgs?: OrgSummaryFragment[];
  vars?: OrgSearchQueryVariables;
};

export function mockOrgSearchQuery({ orgs, vars }: MockOrgSearchQueryOpts) {
  const data: OrgSearchQuery = { orgSearch: orgs ?? generateDummyOrgs() };
  const variables: OrgSearchQueryVariables = {
    query: vars?.query ?? "",
    limit: vars?.limit ?? 100
  };

  return {
    request: {
      query: OrgSearchDocument,
      variables
    },
    result: {
      data
    }
  };
}
