import { AppId, OrgAccessLevel, PdGuestInteractionType } from "generated-graphql";
import {
  ManageUserGroupNativeHostFragment,
  ManageUserGroupVodUserFragment,
  UserGroupDocument,
  UserGroupQuery,
  UserGroupQueryVariables,
  UserGroupsDocument,
  UserGroupsQuery,
  UsersDocument,
  UsersQuery
} from "../__generated__/manage-user-group-dialog";

export const mockNativeHostA: ManageUserGroupNativeHostFragment = {
  __typename: "PdNativeHost",
  nativeHostId: "1",
  firstName: "Native A",
  lastName: "Native A",
  siteId: "1"
};

export const mockNativeHostB: ManageUserGroupNativeHostFragment = {
  __typename: "PdNativeHost",
  nativeHostId: "2",
  firstName: "Native B",
  lastName: "Native B",
  siteId: "1"
};

const vodUserAccess: ManageUserGroupVodUserFragment["accessList"] = [
  {
    __typename: "UserAppAccess",
    app: { __typename: "Application", id: AppId.Pdengage }
  }
];

export const mockVodOrgAdminUser: ManageUserGroupVodUserFragment = {
  __typename: "User",
  id: "1",
  firstName: "User A",
  lastName: "User A",
  accessLevel: OrgAccessLevel.OrgAdmin,
  accessList: vodUserAccess,
  pdHostMappings: [
    { __typename: "PdHostMapping", id: "1", siteId: "0", nativeHostId: "25" }
  ],
  pdUserGroup: null
};

export const mockVodPDEngageAccessUser: ManageUserGroupVodUserFragment = {
  __typename: "User",
  id: "2",
  firstName: "User B",
  lastName: "User B",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: vodUserAccess,
  pdHostMappings: [
    { __typename: "PdHostMapping", id: "2", siteId: "0", nativeHostId: "50" }
  ],
  pdUserGroup: null
};

export const mockVodNoAccessUser: ManageUserGroupVodUserFragment = {
  __typename: "User",
  id: "111",
  firstName: "No",
  lastName: "Access",
  accessLevel: OrgAccessLevel.NoAccess,
  accessList: [],
  pdHostMappings: [
    { __typename: "PdHostMapping", id: "111", siteId: "0", nativeHostId: "123" }
  ],
  pdUserGroup: null
};

export type MockUsersQueryOpts = {
  vodUsers?: ManageUserGroupVodUserFragment[];
  unmappedNativeHosts?: ManageUserGroupNativeHostFragment[];
};

export function mockUsersQuery({
  vodUsers,
  unmappedNativeHosts
}: MockUsersQueryOpts = {}) {
  const data: UsersQuery = {
    vodUsers: vodUsers ?? [mockVodOrgAdminUser, mockVodPDEngageAccessUser],
    unmappedNativeHosts: unmappedNativeHosts ?? [mockNativeHostA, mockNativeHostB]
  };

  return {
    request: {
      query: UsersDocument
    },
    result: {
      data
    }
  };
}

export const mockUserGroup: NonNullable<UserGroupQuery["userGroup"]> = {
  __typename: "PdUserGroup",
  id: "1",
  name: "User Group 1",
  guestInteractionType: PdGuestInteractionType.All,
  excludeFromReports: false,
  members: [
    {
      __typename: "User",
      id: mockVodOrgAdminUser.id,
      firstName: mockVodOrgAdminUser.firstName,
      lastName: mockVodOrgAdminUser.lastName,
      pdHostMappings: mockVodOrgAdminUser.pdHostMappings
    }
  ]
};

export type MockUserGroupQueryOpts = {
  vars?: UserGroupQueryVariables;
  group?: UserGroupQuery["userGroup"];
};

export function mockUserGroupQuery({ vars, group }: MockUserGroupQueryOpts = {}) {
  const variables: UserGroupQueryVariables = vars ?? {
    id: "1"
  };
  const data: UserGroupQuery = {
    userGroup: group ?? mockUserGroup
  };

  return {
    request: {
      query: UserGroupDocument,
      variables
    },
    result: {
      data
    }
  };
}

const mockUserGroups: UserGroupsQuery["userGroups"] = [
  {
    id: mockUserGroup.id,
    name: mockUserGroup.name
  }
];

export type MockUserGroupsQueryOpts = {
  groups?: UserGroupsQuery["userGroups"];
};

export function mockUserGroupsQuery({ groups }: MockUserGroupsQueryOpts = {}) {
  const data: UserGroupsQuery = {
    userGroups: groups ?? mockUserGroups
  };

  return {
    request: {
      query: UserGroupsDocument
    },
    result: {
      data
    }
  };
}
