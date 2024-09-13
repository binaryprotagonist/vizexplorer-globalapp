import { AppId, GaUserFragment } from "generated-graphql";
import { canUser, isOrgAdmin } from "../user/utils";
import { SRAS_HEATMAP_APP_IDS } from "./application";
import { UserActionType } from "../user/types";

// TODO move this and other utility functions in `/settings/users` to a more global space to be reused throughout the app without creating circular dependency issues

// app route potection for normal users
type ProtectedAppRoutes =
  | "user-groups"
  | "greet-settings"
  | "host-goals"
  | "org-settings"
  | "data-connections"
  | "pdre-settings"
  | "marketing-lists";

// admin app route potection for viz admins
type ProctectAdminRoutes = "admin-heat-map-associations";

export type ProtectedRoute = ProtectedAppRoutes | ProctectAdminRoutes;

export function userHasRouteAuth(user: GaUserFragment, route: ProtectedRoute): boolean {
  switch (route) {
    case "user-groups":
      return userHasAuthorization(user, [{ appId: AppId.Pdengage }], true);
    case "greet-settings":
      return userHasAuthorization(user, [{ appId: AppId.Pdengage, role: "admin" }]);
    case "host-goals":
      return canUser(user, { type: UserActionType.MANAGE_PD_SUITE });
    case "org-settings":
      return canUser(user, { type: UserActionType.ACCESS_PD_SUITE });
    case "data-connections":
      return canUser(user, { type: UserActionType.ACCESS_DATA_CONN });
    case "pdre-settings":
      return user.accessList.some(({ app }) => app && app.id === AppId.Pdre);
    case "admin-heat-map-associations": {
      const srasHeatmapRoles: AppRole[] = SRAS_HEATMAP_APP_IDS.map((appId) => ({
        appId,
        role: "admin"
      }));
      return userHasAuthorization(user, srasHeatmapRoles);
    }
    case "marketing-lists":
      return canUser(user, { type: UserActionType.MANAGE_PD_SUITE });
  }
}

type AppRole = { appId: AppId | string; role?: string };

type UserAppAccessShape = {
  app: { id: string };
  role: { id: string };
};

function userHasAuthorization(
  user: GaUserFragment,
  requiredRoles: AppRole[],
  orgAdminOnly = false
): boolean {
  if (orgAdminOnly && !isOrgAdmin(user.accessLevel)) return false;
  if (!requiredRoles.length) return true;

  // valid roles even for Org Admin as a means of also validating subscriptions
  return userRolesContainsAppRoles(user.accessList, requiredRoles);
}

function userRolesContainsAppRoles(
  userRoles: UserAppAccessShape[],
  requiredRoles: AppRole[]
) {
  return requiredRoles.some((requiredRole) => {
    return userRoles.some(
      (userRole) =>
        userRole.app.id === requiredRole.appId &&
        (!requiredRole.role || userRole.role.id === requiredRole.role)
    );
  });
}
