import { produce } from "immer";
import { ReducerGoal } from "../manage-goal-reducer";
import { isGoalComplete } from "./utils";

const mockCompletedGoal: ReducerGoal = {
  name: "Goal 1",
  goalStart: new Date("2022-02-01"),
  goalEnd: new Date("2022-02-28"),
  userIds: ["1", "2"],
  metricIds: ["1", "2"],
  targetValues: [
    [1, 2],
    [3, 4]
  ]
};

describe("GoalBuilderUtils", () => {
  describe("isGoalComplete", () => {
    it("returns true if all fields are filled out and valid", () => {
      expect(isGoalComplete(mockCompletedGoal)).toBe(true);
    });

    it("returns false if name is empty", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.name = "";
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns false if goalStart is null", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.goalStart = null;
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns false if goalEnd is null", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.goalEnd = null;
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns false if goalStart is after goalEnd", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.goalStart = new Date("2022-03-01");
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns false if userIds is empty", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.userIds = [];
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns false if metricIds is empty", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.metricIds = [];
      });
      expect(isGoalComplete(goal)).toBe(false);
    });

    it("returns true if targetValues contains a 0 value", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.targetValues[0][0] = 0;
      });
      expect(isGoalComplete(goal)).toBe(true);
    });

    it("returns true if targetValues contains a negative value", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.targetValues[0][0] = -1;
      });
      expect(isGoalComplete(goal)).toBe(true);
    });

    it("returns false if a targetValues contains a null value", () => {
      const goal = produce(mockCompletedGoal, (draft) => {
        draft.targetValues[0][0] = null;
      });
      expect(isGoalComplete(goal)).toBe(false);
    });
  });
});
