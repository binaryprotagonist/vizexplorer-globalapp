import { GaAccessListFragment } from "generated-graphql";
import { isNoAccessUser, isOrgAdmin } from "../../../view/user/utils";
import { UserManagementUserFragment } from "./__generated__/users";

export function sortUsers(
  curUser: UserManagementUserFragment,
  users: UserManagementUserFragment[]
) {
  const usersCopy = [...users];
  const sortedUsers = usersCopy.sort((a, b) => compareUsersByRole(a, b, curUser));
  return sortedUsers.map((user) => {
    const accessCopy = [...user.accessList];
    const sortedAccessList = accessCopy.sort(compareAccessList);
    return { ...user, accessList: sortedAccessList };
  });
}

function compareAccessList(a: GaAccessListFragment, b: GaAccessListFragment) {
  const accessA = `${a.app.name}${a.role.name}${a.site.name}`.toLowerCase();
  const accessB = `${b.app.name}${b.role.name}${b.site.name}`.toLowerCase();

  if (accessA > accessB) return 1;
  return accessA < accessB ? -1 : 0;
}

/**
 * Sort users
 * Current user > Org Admins > Users related to Current User by App/Site > Remaining users
 */
function compareUsersByRole(
  a: UserManagementUserFragment,
  b: UserManagementUserFragment,
  currentUser: UserManagementUserFragment
) {
  // Handle null email addresses
  if (!a.email && !b.email) return 0;
  if (!a.email) return 1; // a has null email, place it after b
  if (!b.email) return -1; // b has null email, place it after a

  // current user
  if (a.id === currentUser.id) return -1;
  if (b.id === currentUser.id) return 1;

  // org admins
  if (isOrgAdmin(a.accessLevel)) return -1;
  if (isOrgAdmin(b.accessLevel)) return 1;

  // "No Access" users to be sorted to the bottom
  if (isNoAccessUser(a.accessLevel)) return 1;
  if (isNoAccessUser(b.accessLevel)) return -1;

  // other role ordering from the perspective of an Org Admin doesn't matter
  if (isOrgAdmin(currentUser.accessLevel)) return 0;

  // users that share some permissions with the current user
  if (accessIntersects(a.accessList, currentUser.accessList)) return -1;
  if (accessIntersects(b.accessList, currentUser.accessList)) return 1;

  // default case
  return 0;
}

// does accessA share similar access with accessB based on appId and siteId
function accessIntersects(
  accessA: GaAccessListFragment[],
  accessB: GaAccessListFragment[]
) {
  return accessA.some((a) =>
    accessB.some((b) => a.app.id === b.app.id && a.site.id === b.site.id)
  );
}
