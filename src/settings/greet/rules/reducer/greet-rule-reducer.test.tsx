import { GreetDraftMetricTrigger, ReducerAction, ReducerState } from "./types";
import { greetRuleReducer } from "./greet-rule-reducer";
import {
  PdGreetAssignmentType,
  PdGreetMetricValueType,
  PdGuestInteractionType
} from "generated-graphql";
import { produce } from "immer";
import { emptyGreetRuleDraft } from "../dialog";

const initialState: ReducerState = {
  rule: emptyGreetRuleDraft("0"),
  error: null,
  ruleChanged: false
};

const stateWithAssignmentComplete: ReducerState = produce(initialState, (draft) => {
  draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
  draft.rule.assignment = {
    weight: 0,
    assignTo: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroupId: "1"
    },
    overflowGroup1: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroupId: "2"
    },
    overflowGroup2: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroupId: "3"
    }
  };
});

function runImmerReducer(state: ReducerState, action: ReducerAction) {
  return produce(state, (draft) => greetRuleReducer(draft, action));
}

describe("greet-rule-reducer", () => {
  it("can update the rule name", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_NAME",
      payload: { name: "new name" }
    });

    expect(rule.name).toEqual("new name");
  });

  it("can update property", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_PROPERTY",
      payload: { siteId: "1" }
    });

    expect(rule.siteId).toEqual("1");
  });

  it("can update sections with multiple values", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_SECTIONS",
      payload: { sections: ["01", "02"] }
    });

    expect(rule.specialTriggers.sections).toEqual(["01", "02"]);
  });

  it("can update sections to include all", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_SECTIONS",
      payload: { sections: "__ALL__" }
    });

    expect(rule.specialTriggers.sections).toEqual("__ALL__");
  });

  it("resets sections if property selection changes", () => {
    const sectionsSet = runImmerReducer(initialState, {
      type: "UPDATE_SECTIONS",
      payload: { sections: ["01", "02"] }
    });

    const propertySet = runImmerReducer(sectionsSet, {
      type: "UPDATE_PROPERTY",
      payload: { siteId: "2" }
    });

    expect(propertySet.rule.specialTriggers.sections).toEqual([]);
  });

  it("can update toggle enabled", () => {
    const disabled = runImmerReducer(initialState, {
      type: "UPDATE_ENABLED",
      payload: { enabled: false }
    });

    expect(disabled.rule.isEnabled).toEqual(false);

    const enabled = runImmerReducer(disabled, {
      type: "UPDATE_ENABLED",
      payload: { enabled: true }
    });

    expect(enabled.rule.isEnabled).toEqual(true);
  });

  it("can update guest type", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.Coded }
    });

    expect(rule.specialTriggers.guestType).toEqual(PdGuestInteractionType.Coded);
  });

  it("doesn't reset assignments compatible with the new guest type", () => {
    const { rule } = runImmerReducer(stateWithAssignmentComplete, {
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.All }
    });

    expect(rule.assignment.assignTo?.assignmentToType).toEqual(
      PdGreetAssignmentType.SpecificUserGroup
    );
    expect(rule.assignment.overflowGroup1?.assignmentToType).toEqual(
      PdGreetAssignmentType.SpecificUserGroup
    );
    expect(rule.assignment.overflowGroup2?.assignmentToType).toEqual(
      PdGreetAssignmentType.SpecificUserGroup
    );
  });

  it("resets all assignments if the main assignment type is incompatible with the new guest type", () => {
    const incompatibleAssignments = produce(stateWithAssignmentComplete, (draft) => {
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { rule } = runImmerReducer(incompatibleAssignments, {
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.All }
    });

    expect(rule.assignment.assignTo?.assignmentToType).not.toBeDefined();
    expect(rule.assignment.overflowGroup1).not.toBeDefined();
    expect(rule.assignment.overflowGroup2).not.toBeDefined();
  });

  it("resets overflow assignments if the overflow1 assignment type is incompatible with the new guest type", () => {
    const incompatibleAssignments = produce(stateWithAssignmentComplete, (draft) => {
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { rule } = runImmerReducer(incompatibleAssignments, {
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.All }
    });

    expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
    expect(rule.assignment.overflowGroup1?.assignmentToType).not.toBeDefined();
    expect(rule.assignment.overflowGroup2).not.toBeDefined();
  });

  it("resets overflow2 assignment if the overflow2 assignment type is incompatible with the new guest type", () => {
    const incompatibleAssignments = produce(stateWithAssignmentComplete, (draft) => {
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { rule } = runImmerReducer(incompatibleAssignments, {
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.All }
    });

    expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
    expect(rule.assignment.overflowGroup1?.assignmentToType).toBeDefined();
    expect(rule.assignment.overflowGroup2?.assignmentToType).not.toBeDefined();
  });

  it("can update tiers with multiple values", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_TIERS",
      payload: { tiers: ["Platinum", "Gold"] }
    });

    expect(rule.specialTriggers.tiers).toEqual(["Platinum", "Gold"]);
  });

  it("can update tiers to include all", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_TIERS",
      payload: { tiers: "__ALL__" }
    });

    expect(rule.specialTriggers.tiers).toEqual("__ALL__");
  });

  it("can update days of weeks with multiple values", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_DAYS_OF_WEEKS",
      payload: { daysOfWeek: ["Monday", "Wednesday"] }
    });

    expect(rule.specialTriggers.daysOfWeeks).toEqual(["Monday", "Wednesday"]);
  });

  it("can update days of weeks to include all", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_DAYS_OF_WEEKS",
      payload: { daysOfWeek: "__ALL__" }
    });

    expect(rule.specialTriggers.daysOfWeeks).toEqual("__ALL__");
  });

  it("can update a metric code with null values", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 0,
        code: "new_metric_code",
        valueType: PdGreetMetricValueType.Numeric
      }
    });

    expect(rule.metricTriggers[0].code).toEqual("new_metric_code");
    expect(rule.metricTriggers[0].value).toEqual([null, null]);
  });

  it("can update a metric with valid values", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_VALUE",
      payload: {
        index: 0,
        value: [1, 2]
      }
    });

    expect(rule.metricTriggers[0].value).toEqual([1, 2]);
  });

  it("can add a new empty metric", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "ADD_EMPTY_METRIC"
    });

    expect(rule.metricTriggers.length).toEqual(2);
    expect(rule.metricTriggers[1]).toEqual<GreetDraftMetricTrigger>({
      __typename: "PdGreetRuleMetricTrigger"
    });
  });

  it("can manage different metrics without interfering with each other", () => {
    const updatedFirstMetric = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 0,
        code: "metric_code_1",
        valueType: PdGreetMetricValueType.Numeric
      }
    });
    const addNewMetric = runImmerReducer(updatedFirstMetric, {
      type: "ADD_EMPTY_METRIC"
    });
    const updateSecondMetric = runImmerReducer(addNewMetric, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 1,
        code: "metric_code_2",
        valueType: PdGreetMetricValueType.Numeric
      }
    });

    const { rule } = updateSecondMetric;
    expect(rule.metricTriggers[0].code).toEqual("metric_code_1");
    expect(rule.metricTriggers[1].code).toEqual("metric_code_2");
  });

  it("can delete a metric when there is more than 1 metric", () => {
    const updatedFirstMetric = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 0,
        code: "metric_code_1",
        valueType: PdGreetMetricValueType.Numeric
      }
    });
    const addNewMetric = runImmerReducer(updatedFirstMetric, {
      type: "ADD_EMPTY_METRIC"
    });
    const updateSecondMetric = runImmerReducer(addNewMetric, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 1,
        code: "metric_code_2",
        valueType: PdGreetMetricValueType.Numeric
      }
    });
    const deleteFirstMetric = runImmerReducer(updateSecondMetric, {
      type: "DELETE_METRIC",
      payload: { index: 0 }
    });

    const { rule } = deleteFirstMetric;
    expect(rule.metricTriggers.length).toEqual(1);
    expect(rule.metricTriggers[0].code).toEqual("metric_code_2");
  });

  it("clears a metric instead of deleting it when there is only 1 metric", () => {
    const updatedMetric = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 0,
        code: "metric_code_1",
        valueType: PdGreetMetricValueType.Numeric
      }
    });
    const deleteMetric = runImmerReducer(updatedMetric, {
      type: "DELETE_METRIC",
      payload: { index: 0 }
    });

    const { rule } = deleteMetric;
    expect(rule.metricTriggers.length).toEqual(1);
    expect(rule.metricTriggers[0]).toEqual<GreetDraftMetricTrigger>({
      __typename: "PdGreetRuleMetricTrigger"
    });
  });

  it("sets the error state if update metric index is out of bounds", () => {
    const { error } = runImmerReducer(initialState, {
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 1,
        code: "metric_code_1",
        valueType: PdGreetMetricValueType.Numeric
      }
    });

    expect(error!.message).toEqual("Invalid metric trigger index: 1");
  });

  it("sets the error state if delete metric index is out of bounds", () => {
    const { error } = runImmerReducer(initialState, {
      type: "DELETE_METRIC",
      payload: { index: 1 }
    });

    expect(error!.message).toEqual("Invalid metric trigger index: 1");
  });

  it("can update ignore suppression", () => {
    const { rule } = runImmerReducer(initialState, {
      type: "UPDATE_IGNORE_SUPPRESSION",
      payload: { ignoreSuppression: true }
    });

    expect(rule.isIgnoreSuppression).toEqual(true);
  });

  it("can update weight within valid bounds", () => {
    const zeroWeight = runImmerReducer(initialState, {
      type: "UPDATE_WEIGHT",
      payload: { weight: 0 }
    });
    expect(zeroWeight.rule.assignment.weight).toEqual(0);

    const fiftyWeight = runImmerReducer(zeroWeight, {
      type: "UPDATE_WEIGHT",
      payload: { weight: 50 }
    });
    expect(fiftyWeight.rule.assignment.weight).toEqual(50);

    const hundredWeight = runImmerReducer(fiftyWeight, {
      type: "UPDATE_WEIGHT",
      payload: { weight: 100 }
    });
    expect(hundredWeight.rule.assignment.weight).toEqual(100);
  });

  it("doesn't update weight and sets the error state if weight is less than 0", () => {
    const { rule, error } = runImmerReducer(initialState, {
      type: "UPDATE_WEIGHT",
      payload: { weight: -1 }
    });

    expect(error?.message).toEqual("Weight must be between 0 and 100");
    expect(rule.assignment.weight).toEqual(null);
  });

  it("doesn't update weight and sets the error state if weight is greater than 100", () => {
    const { rule, error } = runImmerReducer(initialState, {
      type: "UPDATE_WEIGHT",
      payload: { weight: 101 }
    });

    expect(error?.message).toEqual("Weight must be between 0 and 100");
    expect(rule.assignment.weight).toEqual(null);
  });

  it("can update assignment types with valid configuration", () => {
    // guest type required to set assignment
    const codedGuestType = produce(initialState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
    });
    const mainGroupAssigned = runImmerReducer(codedGuestType, {
      type: "UPDATE_ASSIGN_TO",
      payload: {
        assignmentToType: PdGreetAssignmentType.GuestHost
      }
    });
    const overflow1Assigned = runImmerReducer(mainGroupAssigned, {
      type: "UPDATE_OVERFLOW1",
      payload: {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: "1"
      }
    });
    const { rule } = runImmerReducer(overflow1Assigned, {
      type: "UPDATE_OVERFLOW2",
      payload: {
        assignmentToType: PdGreetAssignmentType.AllUsers
      }
    });

    expect(rule.assignment.assignTo?.assignmentToType).toEqual(
      PdGreetAssignmentType.GuestHost
    );
    expect(rule.assignment.overflowGroup1?.assignmentToType).toEqual(
      PdGreetAssignmentType.SpecificUserGroup
    );
    expect(rule.assignment.overflowGroup2?.assignmentToType).toEqual(
      PdGreetAssignmentType.AllUsers
    );
  });

  it("updates ruleChanged when an action is dispatched", () => {
    const { ruleChanged } = runImmerReducer(initialState, {
      type: "UPDATE_NAME",
      payload: { name: "new name" }
    });

    expect(ruleChanged).toEqual(true);
  });

  describe("AssignTo group", () => {
    it("resets overflow groups if assignmentType is AllUsers", () => {
      const { rule } = runImmerReducer(stateWithAssignmentComplete, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.AllUsers
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toEqual(
        PdGreetAssignmentType.AllUsers
      );
      expect(rule.assignment.overflowGroup1).not.toBeDefined();
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("resets overflow groups if assignmentType is Specific User Group", () => {
      const { rule } = runImmerReducer(stateWithAssignmentComplete, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toEqual(
        PdGreetAssignmentType.SpecificUserGroup
      );
      expect(rule.assignment.overflowGroup1).not.toBeDefined();
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("resets overflow groups if assigned the same value as overflow1", () => {
      const state = produce(stateWithAssignmentComplete, (draft) => {
        draft.rule.assignment.overflowGroup1 = {
          assignmentToType: PdGreetAssignmentType.GuestHost
        };
      });
      const { rule } = runImmerReducer(state, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup1).not.toBeDefined();
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("resets overflow2 group if assigned the same value as overflow2", () => {
      const state = produce(stateWithAssignmentComplete, (draft) => {
        draft.rule.assignment.overflowGroup2 = {
          assignmentToType: PdGreetAssignmentType.GuestHost
        };
      });
      const { rule } = runImmerReducer(state, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup1).toBeDefined();
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("sets error state if guest type is not set", () => {
      const { error } = runImmerReducer(initialState, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });

      expect(error?.message).toEqual("Guest type selection required");
    });

    it("sets error state for GuestHost and GuestHostUserGroup assignmentTypes with Guest Type All", () => {
      const guestTypeAll = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });

    it("sets error state for GuestHost and GuestHostUserGroup assignmentTypes with Guest Type Uncoded", () => {
      const guestTypeUncoded = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.Uncoded;
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_ASSIGN_TO",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });
  });

  describe("Overflow1 group", () => {
    it("resets overflow2 group if assigned the same value as overflow2", () => {
      const { rule } = runImmerReducer(stateWithAssignmentComplete, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
          userGroupId: "3"
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup1?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("resets overflow2 group if set as None", () => {
      const { rule } = runImmerReducer(stateWithAssignmentComplete, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: "None"
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup1?.assignmentToType).toEqual("None");
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("sets error state if the main group hasn't been assigned", () => {
      const { rule, error } = runImmerReducer(initialState, {
        type: "UPDATE_OVERFLOW1",
        payload: { assignmentToType: PdGreetAssignmentType.GuestHostUserGroup }
      });

      expect(error?.message).toContain("before completing main group assignment");
      expect(rule.assignment.overflowGroup1).not.toBeDefined();
    });

    it("sets error state if the main group assignment AllUsers", () => {
      const allUsersMainGroup = produce(initialState, (draft) => {
        draft.rule.assignment.assignTo = {
          assignmentToType: PdGreetAssignmentType.AllUsers
        };
      });
      const { rule, error } = runImmerReducer(allUsersMainGroup, {
        type: "UPDATE_OVERFLOW1",
        payload: { assignmentToType: PdGreetAssignmentType.GuestHostUserGroup }
      });

      expect(error?.message).toContain(
        "main assignment group value doesn't support overflow groups"
      );
      expect(rule.assignment.overflowGroup1).not.toBeDefined();
    });

    it("sets error state for GuestHost and GuestHostUserGroup assignmentTypes with Guest Type All", () => {
      const guestTypeAll = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
        draft.rule.assignment.assignTo = {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
          userGroupId: "1"
        };
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });

    it("sets error state for GuestHost and GuestHostUserGroup with Guest Type Uncoded", () => {
      const guestTypeUncoded = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.Uncoded;
        draft.rule.assignment.assignTo = {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
          userGroupId: "1"
        };
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_OVERFLOW1",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });
  });

  describe("Overflow2 group", () => {
    it("can set assignmentType to None", () => {
      const { rule } = runImmerReducer(stateWithAssignmentComplete, {
        type: "UPDATE_OVERFLOW2",
        payload: {
          assignmentToType: "None"
        }
      });

      expect(rule.assignment.assignTo?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup1?.assignmentToType).toBeDefined();
      expect(rule.assignment.overflowGroup2?.assignmentToType).toEqual("None");
    });

    it("sets error state if overflow1 hasn't been assigned", () => {
      const { rule, error } = runImmerReducer(initialState, {
        type: "UPDATE_OVERFLOW2",
        payload: { assignmentToType: PdGreetAssignmentType.GuestHostUserGroup }
      });

      expect(error?.message).toContain("before completing overflow 1 group assignment");
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("sets error state if overflow 1 is set as None", () => {
      const overflow1None = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
        draft.rule.assignment.overflowGroup1 = {
          assignmentToType: "None"
        };
      });
      const { rule, error } = runImmerReducer(overflow1None, {
        type: "UPDATE_OVERFLOW2",
        payload: { assignmentToType: PdGreetAssignmentType.GuestHostUserGroup }
      });

      expect(error?.message).toContain(
        "overflow 1 group value doesn't support overflow groups"
      );
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("sets error state if overflow 1 is set as AllUsers", () => {
      const overflow1AllUsers = produce(initialState, (draft) => {
        draft.rule.assignment.overflowGroup1 = {
          assignmentToType: PdGreetAssignmentType.AllUsers
        };
      });
      const { rule, error } = runImmerReducer(overflow1AllUsers, {
        type: "UPDATE_OVERFLOW2",
        payload: { assignmentToType: PdGreetAssignmentType.GuestHostUserGroup }
      });

      expect(error?.message).toContain(
        "overflow 1 group value doesn't support overflow groups"
      );
      expect(rule.assignment.overflowGroup2).not.toBeDefined();
    });

    it("sets error state for GuestHost and GuestHostUserGroup assignmentTypes with Guest Type All", () => {
      const guestTypeAll = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
        draft.rule.assignment.overflowGroup1 = {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
          userGroupId: "1"
        };
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_OVERFLOW2",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeAll, {
        type: "UPDATE_OVERFLOW2",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });

    it("sets error state for GuestHost and GuestHostUserGroup with Guest Type Uncoded", () => {
      const guestTypeUncoded = produce(initialState, (draft) => {
        draft.rule.specialTriggers.guestType = PdGuestInteractionType.Uncoded;
        draft.rule.assignment.overflowGroup1 = {
          assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
          userGroupId: "1"
        };
      });
      const { error: guestHostErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_OVERFLOW2",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHost
        }
      });
      const { error: guestHostUserGroupErr } = runImmerReducer(guestTypeUncoded, {
        type: "UPDATE_OVERFLOW2",
        payload: {
          assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
        }
      });

      expect(guestHostErr?.message).toContain("not compatible with Guest type");
      expect(guestHostUserGroupErr?.message).toContain("not compatible with Guest type");
    });
  });
});
