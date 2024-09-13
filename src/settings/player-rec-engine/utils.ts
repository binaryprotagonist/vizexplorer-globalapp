import { AppId, GaUserFragment } from "generated-graphql";
import { isAdminBuild } from "../../utils";
import { isOrgAdmin } from "../../view/user/utils";
import { UserActionPd, UserActionTypePd } from "./types";

export let canUserPdre: (user: GaUserFragment, action: UserActionPd) => boolean;
if (isAdminBuild()) {
  canUserPdre = (_user: GaUserFragment, _action: UserActionPd): boolean => {
    return true;
  };
} else {
  canUserPdre = (user: GaUserFragment, action: UserActionPd): boolean => {
    switch (action.type) {
      case UserActionTypePd.EDIT_RULE:
        return (
          isOrgAdmin(user.accessLevel) ||
          user.accessList.find(
            (access) => access.app.id === AppId.Pdre && access.site.id === action.siteId
          )?.role.id === "admin"
        );
    }
  };
}
