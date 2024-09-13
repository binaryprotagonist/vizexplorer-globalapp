import { UserActionType } from "../../../view/user/types";
import { canUser, isNoAccessUser, isOrgAdmin } from "../../../view/user/utils";
import {
  HostMappingSiteFragment,
  HostMappingUsersFragment
} from "./__generated__/host-mapping";

export function sitesWithHostAccess(
  currentUser: HostMappingUsersFragment,
  sites: HostMappingSiteFragment[]
): HostMappingSiteFragment[] {
  if (isOrgAdmin(currentUser.accessLevel)) {
    return sites;
  }

  return sites.filter((site) =>
    canUser(currentUser, {
      type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
      siteId: site.id
    })
  );
}

export function buildUserMappingsTableData(
  users: HostMappingUsersFragment[],
  siteId: string
): HostMappingUsersFragment[] {
  // only list users that have PD Suite access for the provided site
  const usersForSite = users.filter((user) => {
    if (isOrgAdmin(user.accessLevel) || isNoAccessUser(user.accessLevel)) return true;

    return canUser(user, {
      type: UserActionType.ACCESS_PD_SUITE_FOR_SITE,
      siteId: siteId
    });
  });

  // only include host mappings for the provided site
  return usersForSite.map((user) => ({
    ...user,
    pdHostMappings: user.pdHostMappings?.filter((mapping) => mapping.siteId === siteId)
  }));
}
