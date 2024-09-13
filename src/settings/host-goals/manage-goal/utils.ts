import {
  GaUserFragment,
  PdGoalProgramCreateInput,
  PdGoalProgramUpdateInput
} from "generated-graphql";
import { CompletedReducerGoal, ReducerGoal } from "./manage-goal-reducer";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";
import { GoalBuilderGoalFragment } from "./goal-builder/__generated__/goal-builder";
import { parseISO } from "date-fns";

export function reducerGoalAsGoalCreateInput(
  goal: CompletedReducerGoal,
  siteId: string
): PdGoalProgramCreateInput {
  return {
    name: goal.name,
    siteId,
    startDate: formatInputDate(goal.goalStart),
    endDate: formatInputDate(goal.goalEnd),
    members: goal.userIds,
    metrics: goal.metricIds,
    targetMatrix: goal.targetValues
  };
}

export function reducerGoalAsGoalUpdateInput(
  goal: CompletedReducerGoal,
  goalId: string,
  siteId: string
): PdGoalProgramUpdateInput {
  return {
    id: goalId,
    siteId,
    name: goal.name,
    startDate: formatInputDate(goal.goalStart),
    endDate: formatInputDate(goal.goalEnd),
    members: goal.userIds,
    metrics: goal.metricIds,
    targetMatrix: goal.targetValues
  };
}

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

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

export function goBackUrl(siteId?: string) {
  return siteId ? `..?siteId=${siteId}` : "..";
}

export function builderGoalAsReducerGoal(goal: GoalBuilderGoalFragment): ReducerGoal {
  const userIds = goal.members.map((member) => member.id);
  const metricIds = goal.metrics.map((metric) => metric.id);

  function buildDefaultTargetValues() {
    const defaultMetrics = new Array(metricIds.length).fill(null);
    return new Array(userIds.length).fill(null).map(() => defaultMetrics);
  }

  return {
    name: goal.name,
    goalStart: parseISO(goal.startDate),
    goalEnd: parseISO(goal.endDate),
    userIds,
    metricIds,
    targetValues: goal.targets?.matrix || buildDefaultTargetValues()
  };
}

export function duplicateBuilderGoalAsReducerGoal(
  goal: GoalBuilderGoalFragment
): ReducerGoal {
  const reducerGoal = builderGoalAsReducerGoal(goal);
  return { ...reducerGoal, name: "" };
}
