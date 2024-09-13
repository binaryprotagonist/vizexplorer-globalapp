import { OrgAccessLevel } from "generated-graphql";
import { generateDummyAccessList } from "testing/mocks";
import {
  UserManagementUserFragment,
  UserManagementUsersDocument,
  UserManagementUsersQuery
} from "../__generated__/users";
import { GraphQLError } from "graphql";

function generateDummyUserManagementUsers(length = 3): UserManagementUserFragment[] {
  return Array(length)
    .fill(null)
    .map<UserManagementUserFragment>((_, idx) => ({
      __typename: "User",
      id: `id-${idx}`,
      firstName: `first ${idx}`,
      lastName: `last ${idx}`,
      email: `first${idx}@test.com`,
      phone: `123${idx}`,
      accessLevel: OrgAccessLevel.OrgAdmin,
      accessList: [],
      mfa: null,
      pdUserGroups: [],
      pdHostMappings: []
    }));
}

export type MockUserManagementUsersQueryOpts = {
  users?: UserManagementUserFragment[];
  errors?: GraphQLError[];
};

export function mockUserManagementUsersQuery({
  users,
  errors
}: MockUserManagementUsersQueryOpts) {
  const data: UserManagementUsersQuery = {
    users: users || generateDummyUserManagementUsers()
  };

  return {
    request: {
      query: UserManagementUsersDocument
    },
    result: {
      data,
      errors
    }
  };
}

export function generateDummyHostCodeList(
  length = 5
): UserManagementUserFragment["pdHostMappings"] {
  return new Array(length).fill(null).map((_, idx) => ({
    __typename: "PdHostMapping",
    id: `host-mapping-${idx}`,
    nativeHostId: `${idx}`
  }));
}

export const mockUserManagementOrgAdmin: UserManagementUserFragment = {
  __typename: "User",
  id: "mock_orgAdmin",
  email: "Alice.Town@test.com",
  firstName: "Alice",
  lastName: "Town",
  phone: "+1 621 103",
  accessLevel: OrgAccessLevel.OrgAdmin,
  accessList: generateDummyAccessList(),
  pdUserGroup: { id: "1", name: "User Group 1" },
  pdHostMappings: generateDummyHostCodeList()
};

export const mockUserManagementAdmin: UserManagementUserFragment = {
  __typename: "User",
  id: "mock_admin",
  email: "Janice.Claire@test.com",
  firstName: "Janice",
  lastName: "Claire",
  phone: "+1 752 219",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: generateDummyAccessList(),
  pdUserGroup: { id: "1", name: "User Group 1" },
  pdHostMappings: generateDummyHostCodeList()
};

export const mockUserManagementViewer: UserManagementUserFragment = {
  __typename: "User",
  id: "mock_viewer",
  email: "Kate.Pride@test.com",
  firstName: "Kate",
  lastName: "Pride",
  phone: "+1 147 672",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: generateDummyAccessList(10, { admin: false }),
  pdUserGroup: { id: "1", name: "User Group 1" },
  pdHostMappings: generateDummyHostCodeList()
};
