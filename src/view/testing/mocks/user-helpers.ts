import { UserPasswordResetInput } from "@vizexplorer/global-ui-core";
import {
  UserProfileUpdateDocument,
  UserProfileInput,
  EmailExistsDocument,
  UserPasswordResetDocument,
  CurrentUserMfaDocument,
  CurrentUserMfaQuery,
  GaUserFragment,
  CurrentUserDocument,
  GaAccessListFragment,
  GaUserFieldsFragment,
  AppId,
  OrgAccessLevel,
  UserProfileUpdateMutation
} from "generated-graphql";
import { produce } from "immer";

export function mockCurrentUserQuery(user?: Partial<GaUserFragment>) {
  return {
    request: {
      query: CurrentUserDocument
    },
    result: {
      data: {
        currentUser: {
          __typename: "User",
          ...mockOrgAdmin,
          ...user,
          accessList: user?.accessList || mockOrgAdmin.accessList
        } as GaUserFragment
      }
    }
  };
}

export function mockUserProfileUpdate(updatedProfile: UserProfileInput) {
  const data: UserProfileUpdateMutation = {
    userProfileUpdate: {
      __typename: "User",
      id: updatedProfile.userId,
      firstName: updatedProfile.firstName!,
      lastName: updatedProfile.lastName!,
      email: updatedProfile.email!,
      phone: updatedProfile.phone!,
      accessLevel: OrgAccessLevel.OrgAdmin,
      accessList: [],
      mfa: false
    }
  };

  return {
    request: {
      query: UserProfileUpdateDocument,
      variables: { user: updatedProfile }
    },
    result: {
      data
    }
  };
}

export function mockEmailExists(email: string, emailExists = false) {
  return {
    request: {
      query: EmailExistsDocument,
      variables: { email }
    },
    result: {
      data: { emailExists }
    }
  };
}

export function mockUserPasswordReset(user: UserPasswordResetInput) {
  return {
    request: {
      query: UserPasswordResetDocument,
      variables: { user }
    },
    result: {
      data: { userPasswordReset: true }
    }
  };
}

export function mockCurrentUserMfaQuery(mfa: boolean, userId?: string) {
  const currentUser: CurrentUserMfaQuery["currentUser"] = {
    __typename: "User",
    id: userId || mockOrgAdmin.id,
    mfa
  };
  return {
    request: {
      query: CurrentUserMfaDocument
    },
    result: {
      data: {
        currentUser
      }
    }
  };
}

export function mockUpdateMfa({
  user,
  mfa
}: {
  user: GaUserFieldsFragment;
  mfa: boolean;
}) {
  return {
    request: {
      query: UserProfileUpdateDocument,
      variables: { user: { userId: user.id, mfa } }
    },

    result: {
      data: {
        userProfileUpdate: {
          ...user,
          mfa
        }
      }
    }
  };
}

export function generateDummyUsers(length = 3): GaUserFragment[] {
  return Array(length)
    .fill(null)
    .map<GaUserFragment>((_, idx) => ({
      __typename: "User",
      id: `id-${idx}`,
      firstName: `first ${idx}`,
      lastName: `last ${idx}`,
      email: `first${idx}@test.com`,
      phone: `123${idx}`,
      accessLevel: OrgAccessLevel.OrgAdmin,
      accessList: [],
      mfa: null
    }));
}

export function generateDummyAccessList(length = 10, options = { admin: true }) {
  return new Array(length).fill(null).map<GaAccessListFragment>((_, idx) => ({
    __typename: "UserAppAccess",
    app: {
      __typename: "Application",
      id: "sras",
      name: `Slot Reports ${idx}`
    },
    role: options.admin
      ? { __typename: "AppRole", id: "admin", name: `Editor` }
      : { __typename: "AppRole", id: "viewer", name: `Viewer` },
    site: { __typename: "Site", id: `${idx}`, name: `Site ${idx}` }
  }));
}

export function generateDummyPdreHostAccess(length = 3): GaAccessListFragment[] {
  return Array(length)
    .fill(null)
    .map<GaAccessListFragment>((_, idx) => ({
      __typename: "UserAppAccess",
      app: {
        __typename: "Application",
        id: "pdre",
        name: "Player Development Recommendation Engine"
      },
      role: {
        __typename: "AppRole",
        id: "custom:host",
        name: "Host"
      },
      site: {
        __typename: "Site",
        id: `${idx}`,
        name: `Site ${idx}`
      }
    }));
}

export function generateDummyPdreHostManagerAccess(length = 3): GaAccessListFragment[] {
  return Array(length)
    .fill(null)
    .map<GaAccessListFragment>((_, idx) => ({
      __typename: "UserAppAccess",
      app: {
        __typename: "Application",
        id: "pdre",
        name: "Player Development Recommendation Engine"
      },
      role: {
        __typename: "AppRole",
        id: "custom:host-manager",
        name: "Host"
      },
      site: {
        __typename: "Site",
        id: `${idx}`,
        name: `Site ${idx}`
      }
    }));
}

export function generateDummyPdreAdminAccess(length = 3): GaAccessListFragment[] {
  const hostAccess = generateDummyPdreHostAccess(length);
  return produce(hostAccess, (draft) => {
    draft.forEach((access) => {
      access.role.id = "admin";
      access.role.name = "Admin";
    });
  });
}

export const mockPDEngageAdminAccess: GaAccessListFragment = {
  __typename: "UserAppAccess",
  app: {
    __typename: "Application",
    id: AppId.Pdengage,
    name: "Player Development Engage"
  },
  role: {
    __typename: "AppRole",
    id: "admin",
    name: "Admin"
  },
  site: {
    __typename: "Site",
    id: "0",
    name: "Site 0"
  }
};

export const mockSrasAdminAccess: GaAccessListFragment = {
  __typename: "UserAppAccess",
  app: {
    __typename: "Application",
    id: AppId.Sras,
    name: "Slot Reporting"
  },
  role: {
    __typename: "AppRole",
    id: "admin",
    name: "Admin"
  },
  site: {
    __typename: "Site",
    id: "0",
    name: "Site 0"
  }
};

export const mockOrgAdmin: GaUserFragment = {
  __typename: "User",
  id: "mock_orgAdmin",
  email: "Alice.Town@test.com",
  firstName: "Alice",
  lastName: "Town",
  phone: "+1 621 103",
  accessLevel: OrgAccessLevel.OrgAdmin,
  accessList: generateDummyAccessList(10, { admin: true }),
  mfa: null
};

export const mockAdmin: GaUserFragment = {
  __typename: "User",
  id: "mock_admin",
  email: "Janice.Claire@test.com",
  firstName: "Janice",
  lastName: "Claire",
  phone: "+1 752 219",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: generateDummyAccessList(),
  mfa: null
};

export const mockViewer: GaUserFragment = {
  __typename: "User",
  id: "mock_viewer",
  email: "Kate.Pride@test.com",
  firstName: "Kate",
  lastName: "Pride",
  phone: "+1 147 672",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: generateDummyAccessList(10, { admin: false }),
  mfa: null
};

export const mockNoAccessUser: GaUserFragment = {
  __typename: "User",
  id: "mock_noAccess",
  email: "James.Smith@test.com",
  firstName: "James",
  lastName: "Smith",
  phone: "+1 124 128",
  accessLevel: OrgAccessLevel.NoAccess,
  accessList: [],
  mfa: null
};
