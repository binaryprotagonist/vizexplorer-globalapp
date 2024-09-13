import { GaUserFragment, OrgAccessLevel } from "generated-graphql";
import { ReducerAccess, ReducerUser } from "./manage-user-reducer/types";
import {
  ManagedSitesByApp,
  PasswordDisplay,
  UpdateOtherUserProps,
  UpdateOwnUserProps,
  UserManagement
} from "./types";
import {
  UserDisplay,
  canUser,
  isAppAdmin,
  isOrgAdmin
} from "../../../../view/user/utils";
import { UserActionType } from "../../../../view/user/types";
import {
  ManageUserAccessAppFragment,
  ManageUserAccessSiteFragment,
  UserCreateV2Mutation,
  UserCreateV2MutationVariables,
  UserUpdateMutation,
  UserUpdateMutationVariables,
  UsersQuery
} from "./__generated__/manage-user-dialog";
import {
  UserManagementUserFragment,
  UserManagementUserFragmentDoc
} from "../__generated__/users";
import { ApolloCache, FetchResult } from "@apollo/client";

const MIN_PASSWORD_LENGTH = 8;

export function accessLevelOptions(userAccessLevel: OrgAccessLevel) {
  const options = [OrgAccessLevel.AppSpecific, OrgAccessLevel.NoAccess];

  if (isOrgAdmin(userAccessLevel)) {
    options.unshift(OrgAccessLevel.OrgAdmin);
  }

  return options;
}

export function buildAppOptions(
  currentRow: ReducerAccess,
  allRows: ReducerAccess[],
  allApps: ManageUserAccessAppFragment[],
  managedSitesByApp: ManagedSitesByApp[]
): ManageUserAccessAppFragment[] {
  return allApps.filter((app) => {
    // is this app currently selected?
    if (app.id === currentRow.app?.id) return true;

    // does the user have permission to admin the app?
    const managedSitesForApp = managedSitesByApp.find((m) => m.app.id === app.id);
    if (!managedSitesForApp) return false;

    // have all properties for this app been exhausted for both existing and new access rows?
    const existingAccessForApp = allRows.filter((a) => a.app?.id === app.id);
    const usedSites = existingAccessForApp.map((access) => access.site?.id);
    if (managedSitesForApp.sites.every((site) => usedSites.includes(site.id))) {
      return false;
    }

    return true;
  });
}

export function buildSiteOptions(
  currentRow: ReducerAccess,
  allRows: ReducerAccess[],
  allSites: ManageUserAccessSiteFragment[],
  managedSitesByApp: ManagedSitesByApp[]
): ManageUserAccessSiteFragment[] {
  // don't return any options if the user hasn't selected an app first
  if (!currentRow.app?.id) return [];

  const rowAppId = currentRow.app.id;
  const managedSitesForApp = managedSitesByApp.find((m) => m.app.id === rowAppId);
  const managedSiteIds = managedSitesForApp?.sites.map((s) => s.id) ?? [];

  // only return any selected site if the user doesn't have permission to manage the app
  if (!managedSitesForApp) {
    if (currentRow.site?.id) {
      const selectedSite = allSites.find((s) => s.id === currentRow.site!.id);
      return selectedSite ? [selectedSite] : [];
    }

    return [];
  }

  const usedSiteIds = allRows
    .filter((row) => row.site?.id && row.app?.id === rowAppId)
    .map((access) => access.site!.id);

  // all sites exhausted
  if (usedSiteIds.length === allSites.length) {
    if (currentRow.site?.id) {
      const selectedSite = allSites.find((s) => s.id === currentRow.site!.id);
      return selectedSite ? [selectedSite] : [];
    }

    return [];
  }

  return allSites.filter((site) => {
    // if the site is currently selected, include it regardless of permissions
    if (site.id === currentRow.site?.id) return true;

    // does the user have admin access to the site and is it not already selected?
    return managedSiteIds.includes(site.id) && !usedSiteIds.includes(site.id);
  });
}

export function buildRoleOptions(
  currentRow: ReducerAccess,
  apps: ManageUserAccessAppFragment[]
): ManageUserAccessAppFragment["roles"] {
  // don't return any options if the user hasn't selected an app and site first
  if (!currentRow.app?.id || !currentRow.site?.id) return [];

  // return all roles for the selected app
  const selectedApp = apps.find((app) => app.id === currentRow.app!.id);
  return selectedApp?.roles ?? [];
}

export function buildManagedSitesByApp(
  currentUser: GaUserFragment,
  apps: ManageUserAccessAppFragment[],
  sites: ManageUserAccessSiteFragment[]
): ManagedSitesByApp[] {
  const managedApps = apps.filter((app) => {
    return app.status.isValid && isAppAdmin(currentUser, app.id);
  });

  return managedApps.map<ManagedSitesByApp>((app) => ({
    app,
    sites: sites.filter((site) =>
      canUser(currentUser, {
        type: UserActionType.MANAGE_APP_PROPERTY,
        appId: app.id,
        siteId: site.id
      })
    )
  }));
}

export function canEditAccessRow(
  currentUser: GaUserFragment,
  access: ReducerAccess
): boolean {
  if (isOrgAdmin(currentUser.accessLevel)) {
    return true;
  }

  // is app/site administrator?
  if (access.app?.id && access.site?.id) {
    return canUser(currentUser, {
      type: UserActionType.MANAGE_APP_PROPERTY,
      appId: access.app.id,
      siteId: access.site.id
    });
  }

  // is app administrator?
  if (access.app?.id) {
    return isAppAdmin(currentUser, access.app.id);
  }

  // no access defined, allow editing
  return true;
}

export function isFormComplete(
  formState: ReducerUser,
  // the access level of the user being edited before any changes to the form occurred, if applicable
  originalAccessLevel?: OrgAccessLevel
): boolean {
  const { firstName, lastName, phone, email, accessLevel, accessList } =
    trimUserWhitespace(formState);

  if (accessLevel === OrgAccessLevel.NoAccess) {
    return !!firstName && !!lastName;
  }

  const validPassword = isPasswordValid(formState, originalAccessLevel);
  const validAccess =
    accessLevel !== OrgAccessLevel.AppSpecific || isAccessListValid(accessList);

  return (
    validPassword &&
    validAccess &&
    !!accessLevel &&
    !!firstName &&
    !!lastName &&
    !!phone &&
    !!email
  );
}

function isAccessListValid(access: ReducerAccess[]): boolean {
  if (!access.length) return false;

  if (access.length === 1) {
    return isAccessComplete(access[0]);
  }

  // ignore empty access rows. only if some selection is made should it be validated
  return access.filter((row) => !isEmptyAccess(row)).every(isAccessComplete);
}

function isAccessComplete(access: ReducerAccess): boolean {
  return !!access.app?.id && !!access.site?.id && !!access.role?.id;
}

function isEmptyAccess(access: ReducerAccess): boolean {
  return !access.app?.id && !access.site?.id && !access.role?.id;
}

function isPasswordValid(
  formState: ReducerUser,
  originalAccessLevel?: OrgAccessLevel
): boolean {
  if (!formState.accessLevel) return false;

  const passwordDisplayType = passwordDisplay(formState.accessLevel, originalAccessLevel);
  switch (passwordDisplayType) {
    case "none":
      return formState.password === "";
    case "update":
      return !formState.password || formState.password.length >= MIN_PASSWORD_LENGTH;
    case "new":
      return formState.password.length >= MIN_PASSWORD_LENGTH;
  }
}

export function userToCreateUserV2Input(
  formState: ReducerUser
): UserCreateV2MutationVariables["input"] {
  const { firstName, lastName, phone, email, password, accessLevel, accessList } =
    trimUserWhitespace(formState);

  if (accessLevel === OrgAccessLevel.NoAccess) {
    return {
      firstName,
      lastName,
      phone,
      email: email ? email : null,
      accessLevel: accessLevel
    };
  }

  const accessForLevel = accessLevel === OrgAccessLevel.AppSpecific ? accessList : [];
  const completeAccess = accessForLevel.filter(isAccessComplete);

  return {
    firstName,
    lastName,
    phone,
    email,
    password,
    accessLevel: accessLevel!,
    accessList: completeAccess.map((access) => ({
      appId: access.app!.id!,
      siteId: access.site!.id!,
      roleId: access.role!.id!
    }))
  };
}

export function userToUserUpdateInput(
  currentUser: GaUserFragment,
  editUserId: string,
  formState: ReducerUser,
  userManagement: UpdateOtherUserProps | UpdateOwnUserProps
): UserUpdateMutationVariables["input"] {
  if (userManagement.type === "update-own-user") {
    return userToUserProfileUpdateInput(editUserId, formState);
  }

  if (isOrgAdmin(currentUser.accessLevel)) {
    return orgAdminUserToUserUpdateInput(editUserId, formState);
  } else {
    return appAdminUserToUserUpdateInput(editUserId, formState.accessList);
  }
}

function orgAdminUserToUserUpdateInput(
  userId: string,
  formState: ReducerUser
): UserUpdateMutationVariables["input"] {
  const { firstName, lastName, phone, email, password, accessLevel, accessList } =
    trimUserWhitespace(formState);

  if (accessLevel === OrgAccessLevel.NoAccess) {
    return {
      userId,
      firstName,
      lastName,
      phone,
      email,
      accessLevel: accessLevel
    };
  }

  const accessForLevel = accessLevel === OrgAccessLevel.AppSpecific ? accessList : [];
  const completeAccess = accessForLevel.filter(isAccessComplete);

  return {
    userId,
    firstName,
    lastName,
    phone,
    email,
    password: password !== "" ? password : null,
    accessLevel: accessLevel!,
    accessList: completeAccess.map((access) => ({
      appId: access.app!.id!,
      siteId: access.site!.id!,
      roleId: access.role!.id!
    }))
  };
}

function appAdminUserToUserUpdateInput(
  userId: string,
  updatedAccessList: ReducerUser["accessList"]
): UserUpdateMutationVariables["input"] {
  const completeAccess = updatedAccessList.filter(isAccessComplete);

  return {
    userId,
    accessList: completeAccess.map((access) => ({
      appId: access.app!.id,
      siteId: access.site!.id,
      roleId: access.role!.id
    }))
  };
}

function userToUserProfileUpdateInput(
  userId: string,
  formState: ReducerUser
): UserUpdateMutationVariables["input"] {
  const { firstName, lastName, phone, email, password } = trimUserWhitespace(formState);

  return {
    userId,
    firstName,
    lastName,
    phone,
    email,
    password: password !== "" ? password : null
  };
}

function trimUserWhitespace(user: ReducerUser): ReducerUser {
  return {
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    phone: user.phone.trim(),
    email: user.email.trim(),
    password: user.password.trim(),
    accessLevel: user.accessLevel,
    accessList: user.accessList
  };
}

export function isNameTaken(user: ReducerUser, takenNames: string[]): boolean {
  if (user.accessLevel !== OrgAccessLevel.NoAccess) {
    return false;
  }

  const usersName = UserDisplay.fullName(user.firstName.trim(), user.lastName.trim());
  return takenNames.includes(usersName);
}

export function userManagementUserAsReducerUser(
  user: UserManagementUserFragment
): ReducerUser {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    accessLevel: user.accessLevel,
    email: user.email,
    phone: user.phone,
    accessList: user.accessList,
    password: ""
  };
}

export function noAccessUsersNames(
  users: NonNullable<UsersQuery["users"]>,
  excludeUserIds: string[]
): string[] {
  return users
    .filter((user) => {
      if (excludeUserIds.includes(user.id)) {
        return false;
      }

      return user.accessLevel === OrgAccessLevel.NoAccess;
    })
    .map(UserDisplay.fullNameV2);
}

// control whether we need to display `Change password` button, show `Password` field, or display no field
export function passwordDisplay(
  selectedAccessLevel: OrgAccessLevel,
  originalAccessLevel?: OrgAccessLevel
): PasswordDisplay {
  if (selectedAccessLevel === OrgAccessLevel.NoAccess) return "none";

  return !originalAccessLevel || originalAccessLevel === OrgAccessLevel.NoAccess
    ? "new"
    : "update";
}

export function requireEmailValidation(formState: ReducerUser, originalEmail?: string) {
  if (originalEmail && formState.email === originalEmail) {
    return false;
  }

  return formState.accessLevel !== OrgAccessLevel.NoAccess || !!formState.email;
}

export function hasFormChanged(
  formState: ReducerUser,
  originalUser: UserManagementUserFragment
): boolean {
  const trimmedFormState = trimUserWhitespace(formState);
  const trimmedOriginalState = trimUserWhitespace(
    userManagementUserAsReducerUser(originalUser)
  );

  if (trimmedFormState.firstName !== trimmedOriginalState.firstName) return true;
  if (trimmedFormState.lastName !== trimmedOriginalState.lastName) return true;
  if (trimmedFormState.phone !== trimmedOriginalState.phone) return true;
  if (trimmedFormState.email !== trimmedOriginalState.email) return true;
  if (trimmedFormState.accessLevel !== trimmedOriginalState.accessLevel) return true;
  if (trimmedFormState.password.length >= MIN_PASSWORD_LENGTH) return true;

  return hasAccessChanged(trimmedFormState.accessList, trimmedOriginalState.accessList);
}

function hasAccessChanged(
  newAccess: ReducerAccess[],
  originalAccess: ReducerAccess[]
): boolean {
  const completeAccess = newAccess.filter(isAccessComplete);
  if (completeAccess.length !== originalAccess.length) {
    return true;
  }

  return !completeAccess.every((newA) => {
    return originalAccess.some((originalA) => {
      return (
        newA.app?.id === originalA.app?.id &&
        newA.site?.id === originalA.site?.id &&
        newA.role?.id === originalA.role?.id
      );
    });
  });
}

export function showAccessLevel(userManagementType: UserManagement["type"]): boolean {
  return userManagementType !== "update-own-user";
}

export function showAccessList(
  userManagementType: UserManagement["type"],
  accessLevel: OrgAccessLevel | null
): boolean {
  return (
    userManagementType !== "update-own-user" && accessLevel === OrgAccessLevel.AppSpecific
  );
}

export function userCreateCacheUpdate(
  cache: ApolloCache<UserCreateV2Mutation>,
  { data }: FetchResult<UserCreateV2Mutation>
) {
  if (!data?.userCreateV2) return;

  cache.modify({
    fields: {
      users(existing = []) {
        const newUser = cache.writeFragment({
          data: data.userCreateV2,
          fragment: UserManagementUserFragmentDoc,
          fragmentName: "UserManagementUser"
        });
        return [...existing, newUser];
      }
    }
  });
}

export function userUpdateCacheUpdate(
  user: UserManagementUserFragment,
  cache: ApolloCache<UserUpdateMutation>,
  { data }: FetchResult<UserUpdateMutation>
) {
  // If the userId hasn't changed, cache will be automatically updated
  if (!data?.userUpdate || data.userUpdate.id === user.id) return;

  cache.evict({ id: cache.identify(user) });
  cache.gc();

  // UserID change occurs when changing a user between No Access and some Access. The user is recreated in BE, with a new ID
  // If the userId changed, remove the old user and insert a new user record
  cache.modify({
    fields: {
      users(existing = []) {
        const newUser = cache.writeFragment({
          data: data.userUpdate,
          fragment: UserManagementUserFragmentDoc,
          fragmentName: "UserManagementUser"
        });
        return [...existing, newUser];
      }
    }
  });
}
