import { DeepRequired } from "../../../../view/utils/types";

export type ReducerState = {
  goal: ReducerGoal;
  changed: boolean;
};

export type ReducerGoal = {
  name: string;
  goalStart: Date | null;
  goalEnd: Date | null;
  userIds: string[];
  metricIds: string[];
  targetValues: GoalTargetValues;
};

export type CompletedReducerGoal = DeepRequired<ReducerGoal>;

export type GoalTargetValues = (number | null)[][];

export type ReducerAction =
  | InitializeGoalAction
  | UpdateNameAction
  | UpdateGoalStartAction
  | UpdateGoalEndAction
  | UpdateUsersAction
  | UpdateMetricsAction
  | UpdateTargetValueAction;

export type InitializeGoalAction = {
  type: "initialize-goal";
  payload: { goal: ReducerGoal };
};
export type UpdateNameAction = { type: "update-name"; payload: { name: string } };
export type UpdateGoalStartAction = {
  type: "update-goal-start";
  payload: { date: Date | null };
};
export type UpdateGoalEndAction = {
  type: "update-goal-end";
  payload: { date: Date | null };
};
export type UpdateUsersAction = { type: "update-users"; payload: { userIds: string[] } };
export type UpdateMetricsAction = {
  type: "update-metrics";
  payload: { metricIds: string[] };
};
export type UpdateTargetValueAction = {
  type: "update-target-value";
  payload: { userIdx: number; metricIdx: number; value: number | null };
};
