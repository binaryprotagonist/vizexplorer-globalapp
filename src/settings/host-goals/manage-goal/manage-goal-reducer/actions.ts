import { ReducerState, UpdateTargetValueAction } from "./types";

// Adjust target values to match the new user list, retaining values for users that are still present,
// ensuring that the order of the target values matches the order of the user list
export function syncUsersAndTargetValues(state: ReducerState, newUserIds: string[]) {
  if (!newUserIds.length) {
    state.goal.userIds = newUserIds;
    state.goal.targetValues = [[]];
    return;
  }

  const oldUserIds = state.goal.userIds;
  const newTargetValues = newUserIds.map((userId) => {
    const oldUserIdx = oldUserIds.indexOf(userId);
    return oldUserIdx === -1
      ? state.goal.metricIds.map(() => null)
      : state.goal.targetValues[oldUserIdx];
  });

  state.goal.userIds = newUserIds;
  state.goal.targetValues = newTargetValues;
}

// Same as `syncUsersAndTargetValues`, but for metrics
export function syncMetricsAndTargetValues(state: ReducerState, newMetricIds: string[]) {
  if (!state.goal.userIds.length || !newMetricIds.length) {
    state.goal.metricIds = newMetricIds;
    state.goal.targetValues = [[]];
    return;
  }

  const oldMetricIds = state.goal.metricIds;
  const newTargetValues = state.goal.targetValues.map((userTargets) => {
    return newMetricIds.map((metricId) => {
      const oldMetricIdx = oldMetricIds.indexOf(metricId);
      return oldMetricIdx === -1 ? null : userTargets[oldMetricIdx];
    });
  });

  state.goal.metricIds = newMetricIds;
  state.goal.targetValues = newTargetValues;
}

export function updateTargetValue(
  state: ReducerState,
  payload: UpdateTargetValueAction["payload"]
) {
  const { userIdx, metricIdx, value } = payload;
  const userTargets = state.goal.targetValues[userIdx];

  if (!Array.isArray(userTargets)) {
    console.error("Invalid user index for target value update");
    return;
  }

  if (metricIdx < 0 || metricIdx >= userTargets.length) {
    console.error("Invalid metric index for target value update");
    return;
  }

  userTargets[metricIdx] = value;
}
