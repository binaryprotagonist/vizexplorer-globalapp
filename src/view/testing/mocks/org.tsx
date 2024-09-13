import {
  CurrentOrgFeaturesDocument,
  CurrentOrgFeaturesQuery,
  OrgFeatures
} from "generated-graphql";

export function mockCurrentOrgFeaturesQuery(orgId: string, features: OrgFeatures) {
  const data: CurrentOrgFeaturesQuery = {
    currentOrg: {
      __typename: "Org",
      id: orgId,
      features: {
        __typename: "OrgFeatures",
        ...features
      }
    }
  };
  return {
    request: {
      query: CurrentOrgFeaturesDocument
    },
    result: {
      data
    }
  };
}
