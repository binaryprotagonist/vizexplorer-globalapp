import { OrgAccessLevel } from "generated-graphql";
import { UserManagementView } from "./types";

export function userManagementTabLabel(type: UserManagementView): string {
  switch (type) {
    case "users":
      return "Users";
    case "user-groups":
      return "User groups";
    case "host-code-mapping":
      return "Host code mapping";
  }
}

export function accessLevelLabel(level: OrgAccessLevel): string {
  switch (level) {
    case OrgAccessLevel.OrgAdmin:
      return "Org Admin";
    case OrgAccessLevel.AppSpecific:
      return "Application User";
    case OrgAccessLevel.NoAccess:
      return "No Access";
  }
}
