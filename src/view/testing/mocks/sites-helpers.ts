import {
  CreateSiteDocument,
  DeleteSiteDocument,
  GetSitesDocument,
  SiteCreateInput,
  SiteFragment,
  UpdateSiteDocument
} from "generated-graphql";
import { GraphQLError } from "graphql";

export function mockSitesQuery(sites?: SiteFragment[]) {
  const userSites = sites || generateDummySites(3);

  return {
    request: {
      query: GetSitesDocument
    },
    result: {
      data: {
        sites: userSites
      }
    }
  };
}

function mockNetworkError(error: GraphQLError | string | undefined) {
  if (error && !(error instanceof GraphQLError)) {
    return Error(error);
  } else {
    return undefined;
  }
}

export function mockCreateSiteMutation(
  site: SiteFragment = { __typename: "Site", id: "1", name: "new site 1", tz: "UTC" },
  error?: string | GraphQLError
) {
  const input: SiteCreateInput = {
    name: site.name,
    currencyCode: site.currency?.code,
    tz: site.tz
  };

  return {
    request: {
      query: CreateSiteDocument,
      variables: { input }
    },
    result: {
      data: {
        siteCreateV2: {
          ...site
        } as SiteFragment
      },
      errors: error instanceof GraphQLError ? [error] : []
    },
    error: mockNetworkError(error)
  };
}

export function mockUpdateSiteMutation(
  newValues: SiteFragment = {
    __typename: "Site",
    id: "1",
    name: "new name",
    currency: null,
    tz: "UTC"
  },
  error?: string | GraphQLError
) {
  return {
    request: {
      query: UpdateSiteDocument,
      variables: {
        id: newValues.id,
        site: {
          name: newValues.name,
          currencyCode: newValues.currency?.code,
          tz: newValues.tz
        }
      }
    },
    result: {
      data: {
        siteUpdate: {
          ...newValues
        } as SiteFragment
      },
      errors: error instanceof GraphQLError ? [error] : []
    },
    error: mockNetworkError(error)
  };
}

export function mockDeleteSiteMutation(siteId = "1") {
  return {
    request: {
      query: DeleteSiteDocument,
      variables: { id: siteId }
    },
    result: {
      data: { siteDelete: true }
    }
  };
}

export function generateDummySites(length: number): SiteFragment[] {
  return Array(length)
    .fill(null)
    .map<SiteFragment>((_, idx) => ({
      __typename: "Site",
      id: `${idx}`,
      name: `Site ${idx}`,
      currency: {
        __typename: "Currency",
        code: "USD"
      },
      tz: "UTC"
    }));
}
