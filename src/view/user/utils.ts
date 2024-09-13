import { AppId, OrgAccessLevel } from "generated-graphql";
import { isAdminBuild } from "../../utils";
import { PD_DATA_CONN_APP_IDS, PD_SUITE_APP_IDS } from "../utils";
import { UserAction, UserActionType } from "./types";

type UserNameShapedObj = {
  firstName?: string;
  lastName?: string;
};

export class UserDisplay {
  static fullName(first?: string, last?: string) {
    if (!first && !last) return "Users name missing";
    if (!first) return `${last}`;
    if (!last) return `${first}`;
    return `${first} ${last}`;
  }

  static fullNameV2({ firstName, lastName }: UserNameShapedObj) {
    if (!firstName && !lastName) return "Unknown";
    if (!firstName) return `${lastName}`;
    if (!lastName) return `${firstName}`;
    return `${firstName} ${lastName}`;
  }

  static accessLevel(accessLevel: OrgAccessLevel) {
    switch (accessLevel) {
      case OrgAccessLevel.OrgAdmin:
        return "Org Admin";
      case OrgAccessLevel.AppSpecific:
        return "App Specific";
      case OrgAccessLevel.NoAccess:
        return "No Access";
      default:
        return accessLevel;
    }
  }
}

type UserPermissionObj = {
  id: string;
  accessLevel: OrgAccessLevel;
  accessList: {
    app?: { id: string };
    site?: { id: string };
    role?: { id: string };
  }[];
};

function appBuildCanUser(user: UserPermissionObj, action: UserAction): boolean {
  switch (action.type) {
    case UserActionType.ADD_USER:
      return isOrgAdmin(user.accessLevel) || isAdmin(user);
    case UserActionType.DELETE_USER:
      return isOrgAdmin(user.accessLevel) && user.id !== action.otherUserId;
    case UserActionType.EDIT_PROFILE:
      return isOrgAdmin(user.accessLevel) || user.id === action.otherUserId;
    case UserActionType.EDIT_USER:
      if (user.id === action.otherUser.id) return true;

      return (
        isOrgAdmin(user.accessLevel) ||
        (isAdmin(user) && !isOrgAdmin(action.otherUser.accessLevel))
      );
    case UserActionType.MANAGE_SUBSCRIPTION:
    case UserActionType.MANAGE_PAYMENT:
    case UserActionType.MANAGE_LICENSE:
    case UserActionType.MANAGE_PROPERTIES:
      return isOrgAdmin(user.accessLevel);
    case UserActionType.MANAGE_APP_PROPERTY:
      return (
        isOrgAdmin(user.accessLevel) ||
        isAppAdminForSite(user, action.appId, action.siteId)
      );
    case UserActionType.ACCESS_APP:
      return user.accessList.some((access) => access.app?.id === action.appId);
    case UserActionType.ACCESS_PD_SUITE:
      return PD_SUITE_APP_IDS.some((appId) => {
        return canUser(user, { type: UserActionType.ACCESS_APP, appId });
      });
    case UserActionType.ACCESS_PD_SUITE_FOR_SITE:
      return user.accessList.some((access) => {
        if (!PD_SUITE_APP_IDS.includes(access.app!.id)) return false;
        return access.site?.id === action.siteId;
      });
    case UserActionType.MANAGE_PD_SUITE:
      return user.accessList.some((access) => {
        if (!PD_SUITE_APP_IDS.includes(access.app!.id)) return false;
        return access.role?.id !== "viewer" && access.role?.id !== "custom:host";
      });
    case UserActionType.MANAGE_PD_SUITE_FOR_SITE:
      return user.accessList.some((access) => {
        if (!PD_SUITE_APP_IDS.includes(access.app!.id)) return false;

        return (
          access.site?.id === action.siteId &&
          access.role?.id !== "viewer" &&
          access.role?.id !== "custom:host"
        );
      });
    case UserActionType.ACCESS_PDR_DATA_CONN:
      return user.accessList.some(
        ({ app }) => app && PD_DATA_CONN_APP_IDS.includes(app.id)
      );
    case UserActionType.ACCESS_DATA_CONN: {
      const actionTypes = [UserActionType.ACCESS_PDR_DATA_CONN] as const;
      return actionTypes.some((type) => canUser(user, { type }));
    }
    case UserActionType.MANAGE_DATA_CONN:
      return (
        isOrgAdmin(user.accessLevel) ||
        isAppAdminForSite(user, action.appId, action.siteId)
      );
    case UserActionType.EDIT_HOST_MAPPING:
      return canUser(user, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: action.siteId
      });
    case UserActionType.MANAGE_GREET_RULES:
      return (
        isOrgAdmin(user.accessLevel) ||
        isAppAdminForSite(user, AppId.Pdengage, action.siteId)
      );
    default:
      throw Error(`Unknown action: ${action}`);
  }
}

export let canUser: (user: UserPermissionObj, action: UserAction) => boolean;

if (isAdminBuild()) {
  canUser = (user: UserPermissionObj, action: UserAction) => {
    switch (action.type) {
      case UserActionType.EDIT_PROFILE:
      case UserActionType.ACCESS_PDR_DATA_CONN:
      case UserActionType.ACCESS_DATA_CONN:
      case UserActionType.ACCESS_PD_SUITE:
      case UserActionType.ACCESS_PD_SUITE_FOR_SITE:
        return appBuildCanUser(user, action);
      default:
        return true;
    }
  };
} else {
  canUser = appBuildCanUser;
}

/**
 * Admin of entire organization (across all apps and properties)
 */
export function isOrgAdmin(accessLevel: OrgAccessLevel) {
  return accessLevel === OrgAccessLevel.OrgAdmin;
}

export function isNoAccessUser(accessLevel: OrgAccessLevel) {
  return accessLevel === OrgAccessLevel.NoAccess;
}

/**
 * Admin of some App/Property combination
 */
export function isAdmin(user: UserPermissionObj) {
  return (
    isOrgAdmin(user.accessLevel) ||
    user.accessList.some((access) => access.role?.id === "admin")
  );
}

/**
 * Admin of a property for the specified App
 */
export function isAppAdmin(user: UserPermissionObj, appId: string) {
  return (
    isOrgAdmin(user.accessLevel) ||
    user.accessList.some(
      (access) => access.app?.id === appId && access.role?.id === "admin"
    )
  );
}

/**
 * Admin of the specified app/site combination
 */
function isAppAdminForSite(user: UserPermissionObj, appId: string, siteId: string) {
  return (
    isOrgAdmin(user.accessLevel) ||
    user.accessList.some(
      (access) =>
        access.app?.id === appId &&
        access.site?.id === siteId &&
        access.role?.id === "admin"
    )
  );
}
