import { AppId, GaAccessListFragment, GaUserFragment } from "generated-graphql";
import { mockAdmin, mockPDEngageAdminAccess, mockSrasAdminAccess } from "testing/mocks";
import {
  ManageUserAccessAppFragment,
  ManageUserAccessSiteFragment,
  UserAccessRowOptionsDocument,
  UserAccessRowOptionsQuery,
  UserCreateV2Document,
  UserCreateV2Mutation,
  UserCreateV2MutationVariables,
  UsersDocument,
  UsersQuery
} from "../__generated__/manage-user-dialog";
import { GraphQLError } from "graphql";

export function mockUserAccessRowOptionsQuery(
  provided?: Partial<UserAccessRowOptionsQuery>
) {
  const data: UserAccessRowOptionsQuery = {
    applications: provided?.applications ?? [
      mockManageUserSrasApp,
      mockManageUserPDengageApp
    ],
    sites: provided?.sites ?? generateDummyManageUserSites()
  };

  return {
    request: {
      query: UserAccessRowOptionsDocument
    },
    result: {
      data
    }
  };
}

type MockUsersQueryOpts = {
  users: UsersQuery["users"];
};

export function mockUsersQuery({ users }: MockUsersQueryOpts) {
  const data: UsersQuery = { users };

  return {
    request: {
      query: UsersDocument
    },
    result: {
      data
    }
  };
}

export type MockCreateUserV2MutationOpts = {
  vars: UserCreateV2MutationVariables["input"];
  errors?: GraphQLError[];
};

export function mockCreateUserV2Mutation({ vars, errors }: MockCreateUserV2MutationOpts) {
  const variables: UserCreateV2MutationVariables = {
    input: vars
  };
  const data: UserCreateV2Mutation = {
    userCreateV2: {
      __typename: "User",
      id: "999",
      firstName: vars.firstName,
      lastName: vars.lastName,
      email: vars.email ?? "",
      phone: vars.phone ?? "",
      accessLevel: vars.accessLevel,
      accessList: vars.accessList!.map((access) => ({
        __typename: "UserAppAccess",
        app: { __typename: "Application", id: access.appId, name: "" },
        site: { __typename: "Site", id: access.siteId, name: "" },
        role: { __typename: "AppRole", id: access.roleId, name: "" }
      })),
      pdHostMappings: [],
      pdUserGroup: null
    }
  };

  return {
    request: {
      query: UserCreateV2Document,
      variables
    },
    result: {
      data,
      errors
    }
  };
}

export const mockManageUserSrasApp: ManageUserAccessAppFragment = {
  __typename: "Application",
  id: AppId.Sras,
  name: "Slot Reporting",
  status: {
    __typename: "Status",
    isValid: true
  },
  roles: [
    {
      __typename: "AppRole",
      id: "admin",
      name: "Admin"
    },
    {
      __typename: "AppRole",
      id: "viewer",
      name: "Viewer"
    }
  ]
};

export const mockManageUserPDengageApp: ManageUserAccessAppFragment = {
  __typename: "Application",
  id: AppId.Pdengage,
  name: "PD Engage",
  status: {
    __typename: "Status",
    isValid: true
  },
  roles: [
    {
      __typename: "AppRole",
      id: "admin",
      name: "Admin"
    },
    {
      __typename: "AppRole",
      id: "host-manager",
      name: "Host Manager"
    },
    {
      __typename: "AppRole",
      id: "host",
      name: "Host"
    }
  ]
};

// create a user that is an admin across defined applications and properties
export function createDummyManageUserAdmin(numSites = 3): GaUserFragment {
  const sites = generateDummyManageUserSites(numSites);
  const appAccess = [mockSrasAdminAccess, mockPDEngageAdminAccess];
  const appSitesAccess: GaAccessListFragment[] = appAccess
    .map((access) => {
      return sites.map<GaAccessListFragment>((site) => ({
        __typename: "UserAppAccess",
        app: access.app,
        site,
        role: access.role
      }));
    })
    .flat();

  return { ...mockAdmin, accessList: appSitesAccess };
}

export function generateDummyManageUserSites(length = 3): ManageUserAccessSiteFragment[] {
  return Array.from({ length }, (_, i) => ({
    __typename: "Site",
    id: `${i}`,
    name: `Site ${i}`
  }));
}
