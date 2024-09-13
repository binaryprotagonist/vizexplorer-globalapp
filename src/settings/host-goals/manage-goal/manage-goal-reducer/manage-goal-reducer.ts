import {
  syncMetricsAndTargetValues,
  syncUsersAndTargetValues,
  updateTargetValue
} from "./actions";
import { ReducerAction, ReducerState } from "./types";

export function manageGoalReducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case "initialize-goal":
      state.goal = action.payload.goal;
      state.changed = false;
      break;
    case "update-name":
      state.goal.name = action.payload.name;
      state.changed = true;
      break;
    case "update-goal-start":
      state.goal.goalStart = action.payload.date;
      state.changed = true;
      break;
    case "update-goal-end":
      state.goal.goalEnd = action.payload.date;
      state.changed = true;
      break;
    case "update-users":
      syncUsersAndTargetValues(state, action.payload.userIds);
      state.changed = true;
      break;
    case "update-metrics":
      syncMetricsAndTargetValues(state, action.payload.metricIds);
      state.changed = true;
      break;
    case "update-target-value":
      updateTargetValue(state, action.payload);
      state.changed = true;
      break;
  }
}
