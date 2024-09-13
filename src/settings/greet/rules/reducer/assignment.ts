import { PdGreetAssignmentType, PdGuestInteractionType } from "generated-graphql";
import { AssignTo, OverflowAssignTo, ReducerState } from "./types";
import {
  assignmentTypeAllowsOverflow,
  isAssignmentGroupComplete,
  isGuestAndAssignmentTypeCompatible
} from "./utils";

export function updateAssignTo(
  state: ReducerState,
  value: AssignTo,
  guestType: PdGuestInteractionType | null
) {
  if (!guestType) {
    state.error = new Error("Guest type selection required");
    return;
  }

  if (!isGuestAndAssignmentTypeCompatible(value.assignmentToType, guestType)) {
    state.error = new Error(
      `Assignment type ${value.assignmentToType} is not compatible with Guest type ${guestType}`
    );
    return;
  }

  if (value.assignmentToType === PdGreetAssignmentType.AllUsers) {
    state.rule.assignment = {
      weight: state.rule.assignment.weight,
      assignTo: value
    };
    return;
  }

  // Selecting Specific User Group without a group selection disables overflow groups - clear them
  if (
    value.assignmentToType === PdGreetAssignmentType.SpecificUserGroup &&
    !value.userGroupId
  ) {
    state.rule.assignment = {
      weight: state.rule.assignment.weight,
      assignTo: value,
      overflowGroup1: undefined,
      overflowGroup2: undefined
    };
    return;
  }

  const overflow1 = state.rule.assignment.overflowGroup1;
  if (overflow1 && assignmentGroupsMatch(value, overflow1)) {
    state.rule.assignment.overflowGroup1 = undefined;
    state.rule.assignment.overflowGroup2 = undefined;
  }

  const overflow2 = state.rule.assignment.overflowGroup2;
  if (overflow2 && assignmentGroupsMatch(value, overflow2)) {
    state.rule.assignment.overflowGroup2 = undefined;
  }

  state.rule.assignment.assignTo = value;
}

export function updateOverflow1(
  state: ReducerState,
  value: OverflowAssignTo,
  guestType: PdGuestInteractionType | null
) {
  const mainAssignment = state.rule.assignment.assignTo;
  if (!mainAssignment || !isAssignmentGroupComplete(mainAssignment)) {
    state.error = new Error(
      "Cannot assign overflow group before completing main group assignment"
    );
    return;
  }

  if (!assignmentTypeAllowsOverflow(mainAssignment.assignmentToType)) {
    state.error = new Error(
      "Cannot assign overflow 1 group as the main assignment group value doesn't support overflow groups"
    );
    return;
  }

  if (value.assignmentToType === "None") {
    state.rule.assignment.overflowGroup1 = value;
    state.rule.assignment.overflowGroup2 = undefined;
    return;
  }

  // assume Guest Type is set if the main assignment is complete
  if (!isGuestAndAssignmentTypeCompatible(value.assignmentToType, guestType!)) {
    state.error = new Error(
      `Overflow assignment type ${value.assignmentToType} is not compatible with Guest type ${guestType}`
    );
    return;
  }

  const overflow2 = state.rule.assignment.overflowGroup2;
  if (
    (value.assignmentToType === PdGreetAssignmentType.SpecificUserGroup &&
      !value.userGroupId) ||
    value.assignmentToType === PdGreetAssignmentType.AllUsers ||
    (overflow2 && assignmentGroupsMatch(value, overflow2))
  ) {
    state.rule.assignment.overflowGroup2 = undefined;
  }

  state.rule.assignment.overflowGroup1 = value;
}

export function updateOverflow2(
  state: ReducerState,
  value: OverflowAssignTo,
  guestType: PdGuestInteractionType | null
) {
  const overflow1 = state.rule.assignment.overflowGroup1;
  if (!overflow1 || !isAssignmentGroupComplete(overflow1)) {
    state.error = new Error(
      "Cannot assign overflow 2 group before completing overflow 1 group assignment"
    );
    return;
  }

  if (!assignmentTypeAllowsOverflow(overflow1.assignmentToType)) {
    state.error = new Error(
      "Cannot assign overflow 2 group as the overflow 1 group value doesn't support overflow groups"
    );
    return;
  }

  if (value.assignmentToType === "None") {
    state.rule.assignment.overflowGroup2 = value;
    return;
  }

  // assume Guest Type is set if overflow1 assignment is complete
  if (!isGuestAndAssignmentTypeCompatible(value.assignmentToType, guestType!)) {
    state.error = new Error(
      `Overflow 2 assignment type ${value.assignmentToType} is not compatible with Guest type ${guestType}`
    );
    return;
  }

  state.rule.assignment.overflowGroup2 = value;
}

export function resetIncompatibleAssignments(
  state: ReducerState,
  guestType: PdGuestInteractionType
) {
  const assignToType = state.rule.assignment.assignTo?.assignmentToType;
  // Reset selected user groups when Guest Type changes as the available groups could change (except when changed to `ALL`)
  if (
    assignToType === PdGreetAssignmentType.SpecificUserGroup &&
    guestType !== PdGuestInteractionType.All
  ) {
    state.rule.assignment.assignTo!.userGroupId = undefined;
    state.rule.assignment.overflowGroup1 = undefined;
    state.rule.assignment.overflowGroup2 = undefined;
    return;
  }

  if (assignToType && !isGuestAndAssignmentTypeCompatible(assignToType, guestType)) {
    state.rule.assignment.assignTo = null;
    state.rule.assignment.overflowGroup1 = undefined;
    state.rule.assignment.overflowGroup2 = undefined;
    return;
  }

  const overflow1Type = state.rule.assignment.overflowGroup1?.assignmentToType;
  if (
    overflow1Type === PdGreetAssignmentType.SpecificUserGroup &&
    guestType !== PdGuestInteractionType.All
  ) {
    state.rule.assignment.overflowGroup1!.userGroupId = undefined;
    state.rule.assignment.overflowGroup2 = undefined;
    return;
  }

  if (overflow1Type && !isGuestAndAssignmentTypeCompatible(overflow1Type, guestType)) {
    state.rule.assignment.overflowGroup1 = undefined;
    state.rule.assignment.overflowGroup2 = undefined;
    return;
  }

  const overflow2Type = state.rule.assignment.overflowGroup2?.assignmentToType;
  if (
    overflow2Type &&
    ((overflow2Type === PdGreetAssignmentType.SpecificUserGroup &&
      guestType !== PdGuestInteractionType.All) ||
      !isGuestAndAssignmentTypeCompatible(overflow2Type, guestType))
  ) {
    state.rule.assignment.overflowGroup2 = undefined;
  }
}

function assignmentGroupsMatch(
  group1: AssignTo | OverflowAssignTo,
  group2: AssignTo | OverflowAssignTo
): boolean {
  if (
    group1.assignmentToType === PdGreetAssignmentType.SpecificUserGroup &&
    group2.assignmentToType === PdGreetAssignmentType.SpecificUserGroup
  ) {
    return group1.userGroupId === group2.userGroupId;
  }

  return group1.assignmentToType === group2.assignmentToType;
}
