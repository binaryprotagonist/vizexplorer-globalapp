import { renderHook } from "@testing-library/react";
import { ReducerAction, ReducerState } from "./types";
import { useImmerReducer } from "use-immer";
import { manageGoalReducer } from "./manage-goal-reducer";
import { act } from "react-dom/test-utils";
import { createReducerGoal } from "./utils";
import { produce } from "immer";

const mockState: ReducerState = {
  goal: createReducerGoal(),
  changed: false
};

describe("manageGoalReducer", () => {
  it("can initialize a goal", () => {
    const partialState: ReducerState = {
      goal: { ...mockState.goal, name: "Test 123" },
      changed: true
    };
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, partialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "initialize-goal", payload: { goal: mockState.goal } });
    });

    const [newState] = result.current;
    expect(curState.goal.name).toEqual("Test 123");
    expect(newState.goal.name).toEqual("");
    // verify `changed` is reset to false
    expect(newState.changed).toEqual(false);
  });

  it("can update goal name", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-name", payload: { name: "Goal Name" } });
    });

    const [newState] = result.current;
    expect(curState.goal.name).toEqual("");
    expect(newState.goal.name).toEqual("Goal Name");
  });

  it("can update goal period start", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-goal-start",
        payload: { date: new Date("2021-01-01") }
      });
    });

    const [newState] = result.current;
    expect(curState.goal.goalStart).toEqual(null);
    expect(newState.goal.goalStart).toEqual(new Date("2021-01-01"));
  });

  it("can update goal period end", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-goal-end", payload: { date: new Date("2021-01-01") } });
    });

    const [newState] = result.current;
    expect(curState.goal.goalEnd).toEqual(null);
    expect(newState.goal.goalEnd).toEqual(new Date("2021-01-01"));
  });

  it("can add a single user with no metric selection", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual([]);
    expect(newState.goal.userIds).toEqual(["1"]);
    expect(newState.goal.targetValues).toEqual([[]]);
  });

  it("can add a multiple users with no metric selection", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1", "2"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual([]);
    expect(newState.goal.userIds).toEqual(["1", "2"]);
    expect(newState.goal.targetValues).toEqual([[], []]);
  });

  it("can add a single user with existing metric selection", () => {
    const withMetricsState = produce(mockState, (draft) => {
      draft.goal.metricIds = ["theo-win", "actual-win"];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, withMetricsState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual([]);
    expect(newState.goal.userIds).toEqual(["1"]);
    expect(newState.goal.targetValues).toEqual([[null, null]]);
  });

  it("can add a multiple users with existing metric selection", () => {
    const withMetricsState = produce(mockState, (draft) => {
      draft.goal.metricIds = ["theo-win", "actual-win"];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, withMetricsState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1", "2"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual([]);
    expect(newState.goal.userIds).toEqual(["1", "2"]);
    expect(newState.goal.targetValues).toEqual([
      [null, null],
      [null, null]
    ]);
  });

  it("can add users with existing metric and other user selection", () => {
    const withMetricsAndUsersState = produce(mockState, (draft) => {
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.userIds = ["2"];
      draft.goal.targetValues = [[100, 50]];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(
        manageGoalReducer,
        withMetricsAndUsersState
      )
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["2", "1", "3"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual(["2"]);
    expect(newState.goal.userIds).toEqual(["2", "1", "3"]);
    expect(newState.goal.targetValues).toEqual([
      [100, 50],
      [null, null],
      [null, null]
    ]);
  });

  it("syncs target values if the user list order changes", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2", "3"];
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.targetValues = [
        [100, 50],
        [200, 100],
        [300, 150]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["3", "2", "1"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual(["1", "2", "3"]);
    expect(newState.goal.userIds).toEqual(["3", "2", "1"]);
    expect(newState.goal.targetValues).toEqual([
      [300, 150],
      [200, 100],
      [100, 50]
    ]);
  });

  it("can remove a user and the associated target values", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2", "3"];
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.targetValues = [
        [100, 50],
        [200, 100],
        [300, 150]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1", "3"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual(["1", "2", "3"]);
    expect(newState.goal.userIds).toEqual(["1", "3"]);
    expect(newState.goal.targetValues).toEqual([
      [100, 50],
      [300, 150]
    ]);
  });

  it("can remove all users and associated target values", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2"];
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.targetValues = [
        [100, 50],
        [200, 100]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: [] } });
    });

    const [newState] = result.current;
    expect(curState.goal.userIds).toEqual(["1", "2"]);
    expect(newState.goal.userIds).toEqual([]);
    expect(newState.goal.targetValues).toEqual([[]]);
  });

  it("can add a metric prior to adding users", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-metrics", payload: { metricIds: ["theo-win"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.metricIds).toEqual([]);
    expect(newState.goal.metricIds).toEqual(["theo-win"]);
    expect(newState.goal.targetValues).toEqual([[]]);
  });

  it("can add a metric after adding users", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1", "2"] } });
      dispatch({ type: "update-metrics", payload: { metricIds: ["theo-win"] } });
    });

    const [newState] = result.current;
    expect(curState.goal.metricIds).toEqual([]);
    expect(newState.goal.metricIds).toEqual(["theo-win"]);
    expect(newState.goal.targetValues).toEqual([[null], [null]]);
  });

  it("syncs target values if the metric list order changes", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2"];
      draft.goal.metricIds = ["theo-win", "actual-win", "theo-loss"];
      draft.goal.targetValues = [
        [100, 50, 200],
        [200, 100, 300]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-metrics",
        payload: { metricIds: ["theo-loss", "theo-win", "actual-win"] }
      });
    });

    const [newState] = result.current;
    expect(curState.goal.metricIds).toEqual(["theo-win", "actual-win", "theo-loss"]);
    expect(newState.goal.metricIds).toEqual(["theo-loss", "theo-win", "actual-win"]);
    expect(newState.goal.targetValues).toEqual([
      [200, 100, 50],
      [300, 200, 100]
    ]);
  });

  it("can remove a metric and the associated target values", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2"];
      draft.goal.metricIds = ["theo-win", "actual-win", "theo-loss"];
      draft.goal.targetValues = [
        [100, 50, 200],
        [200, 100, 300]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-metrics",
        payload: { metricIds: ["theo-win", "theo-loss"] }
      });
    });

    const [newState] = result.current;
    expect(curState.goal.metricIds).toEqual(["theo-win", "actual-win", "theo-loss"]);
    expect(newState.goal.metricIds).toEqual(["theo-win", "theo-loss"]);
    expect(newState.goal.targetValues).toEqual([
      [100, 200],
      [200, 300]
    ]);
  });

  it("can remove all metrics and associated target values", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2"];
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.targetValues = [
        [100, 50],
        [200, 100]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-metrics", payload: { metricIds: [] } });
    });

    const [newState] = result.current;
    expect(curState.goal.metricIds).toEqual(["theo-win", "actual-win"]);
    expect(newState.goal.metricIds).toEqual([]);
    expect(newState.goal.targetValues).toEqual([[]]);
  });

  it("can update target value for a user and metric", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1", "2"];
      draft.goal.metricIds = ["theo-win", "actual-win"];
      draft.goal.targetValues = [
        [null, 50],
        [200, null]
      ];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 0, metricIdx: 1, value: 250 }
      });
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 1, metricIdx: 1, value: 150 }
      });
    });

    const [newState] = result.current;
    expect(curState.goal.targetValues).toEqual([
      [null, 50],
      [200, null]
    ]);
    expect(newState.goal.targetValues).toEqual([
      [null, 250],
      [200, 150]
    ]);
  });

  it("can update a target value to null", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1"];
      draft.goal.metricIds = ["theo-win"];
      draft.goal.targetValues = [[100]];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 0, metricIdx: 0, value: null }
      });
    });

    const [newState] = result.current;
    expect(curState.goal.targetValues).toEqual([[100]]);
    expect(newState.goal.targetValues).toEqual([[null]]);
  });

  it("updates `changed` to true if name is changed", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-name", payload: { name: "Goal Name" } });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("updates `changed` to true if goal start date is changed", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-goal-start",
        payload: { date: new Date("2021-01-01") }
      });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("updates `changed` to true if goal end date is changed", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-goal-end", payload: { date: new Date("2021-01-01") } });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("updates `changed` to true if users are changed", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-users", payload: { userIds: ["1"] } });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("updates `changed` to true if metrics are changed", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, mockState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-metrics", payload: { metricIds: ["theo-win"] } });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("updates `changed` to true if target value is changed", () => {
    const initialState = produce(mockState, (draft) => {
      draft.goal.userIds = ["1"];
      draft.goal.metricIds = ["theo-win"];
      draft.goal.targetValues = [[null]];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 0, metricIdx: 0, value: 250 }
      });
    });

    const [newState] = result.current;
    expect(newState.changed).toEqual(true);
  });

  it("console errors when updating target value with invalid user index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const initialState = produce(mockState, (draft) => {
      draft.changed = true;
      draft.goal.userIds = ["1"];
      draft.goal.metricIds = ["theo-win"];
      draft.goal.targetValues = [[null]];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 1, metricIdx: 0, value: 250 }
      });
    });

    const [newState] = result.current;
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(newState).toEqual(initialState);
  });

  it("console errors when updating target value with invalid metric index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const initialState = produce(mockState, (draft) => {
      draft.changed = true;
      draft.goal.userIds = ["1"];
      draft.goal.metricIds = ["theo-win"];
      draft.goal.targetValues = [[null]];
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageGoalReducer, initialState)
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-target-value",
        payload: { userIdx: 0, metricIdx: 1, value: 250 }
      });
    });

    const [newState] = result.current;
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(newState).toEqual(initialState);
  });
});
