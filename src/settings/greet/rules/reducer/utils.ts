import {
  GreetRuleFragment,
  PdGreetAssignmentType,
  PdGuestInteractionType
} from "generated-graphql";
import {
  AssignTo,
  GreetDraftMetricTrigger,
  GreetRuleDraft,
  OverflowAssignTo,
  OverflowGreetAssignmentType
} from "./types";

export function isAssignmentGroupComplete(group: AssignTo | OverflowAssignTo): boolean {
  if (group.assignmentToType === PdGreetAssignmentType.SpecificUserGroup) {
    return !!group.userGroupId;
  }

  return true;
}

export function isGuestAndAssignmentTypeCompatible(
  assignmentType: OverflowGreetAssignmentType,
  guestType: PdGuestInteractionType
): boolean {
  if (guestType === PdGuestInteractionType.Coded || assignmentType === "None") {
    return true;
  }

  return (
    assignmentType === PdGreetAssignmentType.AllUsers ||
    assignmentType === PdGreetAssignmentType.SpecificUserGroup
  );
}

export function assignmentTypeAllowsOverflow(
  assignmentType: OverflowGreetAssignmentType
): boolean {
  return assignmentType !== "None" && assignmentType !== PdGreetAssignmentType.AllUsers;
}

export function isWeightValid(value: number | null): boolean {
  return value !== null && value >= 0 && value <= 100;
}

export function isMetricValid(metric: GreetDraftMetricTrigger): boolean {
  if (!metric.value) return false;
  if (metric.value[0] === null && metric.value[1] === null) return false;
  if (metric.value[0] === null && metric.value[1] !== null) return true;
  if (metric.value[0] !== null && metric.value[1] === null) return true;
  if (metric.value[0]! <= metric.value[1]!) return true;
  return false;
}

export function isNameTaken(
  existingName: string,
  newName: string,
  rules: GreetRuleFragment[]
): boolean {
  const newNameLower = newName.trim().toLowerCase();
  const existingNameLower = existingName.trim().toLowerCase();
  if (existingNameLower === newNameLower) return false;

  return rules.some((rule) => rule.name.trim().toLowerCase() === newNameLower);
}

function isRequiredFieldsComplete(rule: GreetRuleDraft): boolean {
  return (
    !!rule.name &&
    !!rule.siteId &&
    !!rule.specialTriggers.sections?.length &&
    !!rule.specialTriggers.guestType &&
    !!rule.specialTriggers.tiers?.length &&
    !!rule.specialTriggers.daysOfWeeks?.length &&
    !!rule.assignment.assignTo?.assignmentToType
  );
}

function isPartialCompleteMetric(metric: GreetDraftMetricTrigger): boolean {
  return !!metric.code && !isMetricValid(metric);
}

export function isRuleComplete(
  rule: GreetRuleDraft,
  rules: GreetRuleFragment[],
  initialRuleName: string
): boolean {
  if (!isRequiredFieldsComplete(rule)) return false;
  if (isNameTaken(initialRuleName, rule.name, rules)) return false;
  if (rule.metricTriggers.some(isPartialCompleteMetric)) return false;
  if (!isWeightValid(rule.assignment.weight)) return false;
  // Validated non-null in `isRequiredFieldsComplete`
  if (!isAssignmentGroupComplete(rule.assignment.assignTo!)) return false;
  const overflow1 = rule.assignment.overflowGroup1;
  if (overflow1 && !isAssignmentGroupComplete(overflow1)) return false;
  const overflow2 = rule.assignment.overflowGroup2;
  if (overflow2 && !isAssignmentGroupComplete(overflow2)) return false;

  return true;
}
