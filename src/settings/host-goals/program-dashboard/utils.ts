import { GaUserFragment } from "generated-graphql";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";

export function sitesWithPermission(user: GaUserFragment) {
  return user.accessList
    .filter((access) => {
      return canUser(user, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: access.site.id
      });
    })
    .map((access) => access.site);
}
