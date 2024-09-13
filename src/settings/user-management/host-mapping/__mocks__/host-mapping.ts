import { generateDummyPdreHostAccess, generateDummySites } from "testing/mocks";
import {
  GetSitesDocument,
  HostMappingFragment,
  HostMappingSiteFragment,
  HostMappingUsersFragment,
  UsersNativeHostMappingDocument
} from "../__generated__/host-mapping";
import { OrgAccessLevel } from "generated-graphql";

export function mockSitesQuery(sites?: HostMappingSiteFragment[]) {
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

export function mockUsersNativeHostMappingQuery(mappings?: HostMappingUsersFragment[]) {
  return {
    request: {
      query: UsersNativeHostMappingDocument
    },
    result: {
      data: {
        users: mappings ?? generateDummyUserHostMapping()
      }
    }
  };
}

function generateDummyNativeHostMappings(length = 3): HostMappingFragment[] {
  return Array(length)
    .fill(null)
    .map<HostMappingFragment>((_, idx) => ({
      __typename: "PdHostMapping",
      id: `host-mapping-${idx + 1}`,
      siteId: "0",
      nativeHostId: `${idx + 1}`
    }));
}

export function generateDummyUserHostMapping(length = 3) {
  const mappings = generateDummyNativeHostMappings(length * 3); // 3 for each user

  return Array(length)
    .fill(null)
    .map<HostMappingUsersFragment>((_, idx) => ({
      __typename: "User",
      id: `${idx}`,
      firstName: `User First ${idx}`,
      lastName: `User Last ${idx}`,
      email: `User Email ${idx}`,
      phone: `123${idx}`,
      accessLevel: OrgAccessLevel.AppSpecific,
      accessList: generateDummyPdreHostAccess(),
      pdHostMappings: mappings.splice(0, 3)
    }));
}
