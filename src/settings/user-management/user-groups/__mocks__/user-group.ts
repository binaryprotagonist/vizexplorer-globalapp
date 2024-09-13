import { PdGuestInteractionType } from "generated-graphql";
import {
  UserGroupFragment,
  UserGroupMemberFragment,
  UserGroupsDocument,
  UserGroupsQuery
} from "../__generated__/user-groups";

export function generateDummyUserGroupMembers(length = 3): UserGroupMemberFragment[] {
  return Array.from({ length }, (_, idx) => ({
    __typename: "User",
    id: `${idx}`,
    firstName: `John ${idx}`,
    lastName: `Doe ${idx}`
  }));
}

export function generateDummyUserGroups(length = 3): UserGroupFragment[] {
  const members = generateDummyUserGroupMembers(length);
  return Array.from({ length }, (_, idx) => ({
    __typename: "PdUserGroup",
    id: `${idx}`,
    name: `User Group ${idx}`,
    guestInteractionType: PdGuestInteractionType.All,
    excludeFromReports: false,
    members: [members[idx]],
    usedByRules: []
  }));
}

export function mockUserGroupsQuery(userGroups?: UserGroupFragment[]) {
  const data: UserGroupsQuery = {
    pdUserGroups: userGroups ?? generateDummyUserGroups()
  };

  return {
    request: {
      query: UserGroupsDocument
    },
    result: {
      data
    }
  };
}
