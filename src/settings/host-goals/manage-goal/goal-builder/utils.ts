import { OrgAccessLevel } from "generated-graphql";
import { UserDisplay } from "../../../../view/user/utils";
import { GoalBuilderUserFragment } from "./__generated__/goal-builder";
import { CompletedReducerGoal, ReducerGoal } from "../manage-goal-reducer";
import { isAfter, isValid } from "date-fns";

export function isMappedAccessUser(user: GoalBuilderUserFragment) {
  return user.pdHostMappings?.length && user.accessLevel !== OrgAccessLevel.NoAccess;
}

export function sortGroupsAndUsers(users: GoalBuilderUserFragment[]) {
  return [...users].sort((userA, userB) => {
    // float users with groups above users without groups
    if (!userA.pdUserGroup && userB.pdUserGroup) return 1;
    if (userA.pdUserGroup && !userB.pdUserGroup) return -1;

    const userAName = UserDisplay.fullNameV2(userA);
    const userBName = UserDisplay.fullNameV2(userB);

    // sort users without groups alphabetically
    if (!userA.pdUserGroup && !userB.pdUserGroup) {
      return userAName.localeCompare(userBName);
    }

    // sort groups and users within the same group alphabetically
    return userA.pdUserGroup!.name === userB.pdUserGroup!.name
      ? userAName.localeCompare(userBName)
      : userA.pdUserGroup!.name.localeCompare(userB.pdUserGroup!.name);
  });
}

export function isGoalComplete(goal: ReducerGoal): goal is CompletedReducerGoal {
  if (!goal.name) return false;

  if (!goal.goalStart || !goal.goalEnd) return false;
  if (!isValid(goal.goalStart) || !isValid(goal.goalEnd)) return false;
  if (isAfter(goal.goalStart, goal.goalEnd)) return false;

  if (!goal.userIds.length) return false;
  if (!goal.metricIds.length) return false;

  return !goal.targetValues.some((users) => users.some((value) => value === null));
}
