import { ReducerGoal } from "./types";

export function createReducerGoal(): ReducerGoal {
  return {
    name: "",
    goalStart: null,
    goalEnd: null,
    userIds: [],
    metricIds: [],
    targetValues: [[]]
  };
}
