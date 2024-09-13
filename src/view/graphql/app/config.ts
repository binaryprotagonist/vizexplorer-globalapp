import { defaultDataIdFromObject, InMemoryCacheConfig } from "@apollo/client";
import { StrictTypedTypePolicies } from "../generated/apollo-helpers";
import fragmentMatcher from "../generated/fragment-matcher";

export const GLOBAL_UI = "/global/api/graphql";

const typePolicies: StrictTypedTypePolicies = {
  PdRule: {
    keyFields: ["id", "siteId"]
  },
  PdNativeHost: {
    keyFields: ["nativeHostId"]
  },
  License: {
    merge: true
  },
  User: {
    fields: {
      accessList: {
        merge: false
      },
      pdHostMappings: {
        merge: false
      }
    }
  },
  OdrDataSource: {
    merge: false
  },
  DataFeedStatus: {
    merge: false
  },
  Org: {
    fields: {
      sites: {
        merge: false
      }
    }
  },
  Query: {
    fields: {
      odrDataSources: {
        merge: false
      }
    }
  }
};

export const appApolloCacheConfig: InMemoryCacheConfig = {
  typePolicies,
  possibleTypes: fragmentMatcher.possibleTypes,
  dataIdFromObject(responseObject) {
    switch (responseObject.__typename) {
      case "OrgFeatures":
        return "org-features";
      default:
        return defaultDataIdFromObject(responseObject);
    }
  }
};
