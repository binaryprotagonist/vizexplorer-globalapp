import {
  GreetRuleFragment,
  GreetRuleGroupAssignmentFragment,
  GroupAssignmentCreateInput,
  PdGreetAssignmentType,
  PdGreetRuleCreateInput,
  PdGreetRuleMetricTriggerInput,
  PdGreetRuleSpecialTriggerCreateInput,
  PdGreetRuleSpecialTriggerValue,
  PdGreetRuleTriggerType,
  PdGreetRuleUpdateInput,
  PdGuestInteractionType
} from "generated-graphql";
import { GreetRuleDraft, assignmentTypeAllowsOverflow, isMetricValid } from "../reducer";
import {
  AssignTo,
  DraftMultiSelectValue,
  GreetDraftMetricTrigger,
  GreetDraftSiteTriggers,
  OverflowAssignTo
} from "../reducer/types";
import { GreetRuleTrigger } from "../types";
import { isMetricValue } from "../utils";

export function draftRuleToRuleCreateInput(rule: GreetRuleDraft): PdGreetRuleCreateInput {
  const assignTo = draftAssignmentAsAssignmentInput(rule.assignment.assignTo!)!;
  const overflowGroup1 = rule.assignment.overflowGroup1
    ? draftAssignmentAsAssignmentInput(rule.assignment.overflowGroup1)
    : null;
  const overflowGroup2 = rule.assignment.overflowGroup2
    ? draftAssignmentAsAssignmentInput(rule.assignment.overflowGroup2)
    : null;

  return {
    name: rule.name,
    siteId: rule.siteId!,
    isEnabled: rule.isEnabled,
    isIgnoreSuppression: rule.isIgnoreSuppression,
    specialTriggers: draftSpecialAsSpecialInput(rule.specialTriggers),
    metricTriggers: draftMetricsAsMetricInput(rule.metricTriggers),
    assignment: {
      weight: rule.assignment.weight!,
      assignTo,
      ...(overflowGroup1 && {
        overflowAssignment1: overflowGroup1
      }),
      ...(overflowGroup2 && {
        overflowAssignment2: overflowGroup2
      })
    }
  };
}

export function draftRuleToUpdateInput(rule: GreetRuleDraft): PdGreetRuleUpdateInput {
  return {
    ...draftRuleToRuleCreateInput(rule),
    id: rule.id!
  };
}

function specialTriggerKeyAsType(
  key: keyof GreetDraftSiteTriggers
): PdGreetRuleTriggerType {
  switch (key) {
    case "daysOfWeeks":
      return PdGreetRuleTriggerType.DaysOfWeeks;
    case "guestType":
      return PdGreetRuleTriggerType.GuestType;
    case "sections":
      return PdGreetRuleTriggerType.Section;
    case "tiers":
      return PdGreetRuleTriggerType.Tier;
  }
}

function draftSpecialAsSpecialInput(
  specials: GreetDraftSiteTriggers
): PdGreetRuleSpecialTriggerCreateInput[] {
  return Object.entries(specials)
    .filter(([_, value]) => value !== "__ALL__")
    .map<PdGreetRuleSpecialTriggerCreateInput>(([key, value]) => ({
      type: specialTriggerKeyAsType(key as keyof GreetDraftSiteTriggers),
      value: value!
    }));
}

function draftMetricsAsMetricInput(
  metrics: GreetDraftMetricTrigger[]
): PdGreetRuleMetricTriggerInput[] {
  return metrics.filter(isMetricValid).map<PdGreetRuleMetricTriggerInput>((metric) => ({
    code: metric.code!,
    operator: metric.operator!,
    value: metric.value!
  }));
}

function draftAssignmentAsAssignmentInput(
  assignment: AssignTo | OverflowAssignTo
): GroupAssignmentCreateInput | undefined {
  if (assignment.assignmentToType === "None") {
    return undefined;
  }

  if (assignment.assignmentToType === PdGreetAssignmentType.SpecificUserGroup) {
    return {
      assignmentToType: assignment.assignmentToType,
      userGroupId: assignment.userGroupId
    };
  }

  return { assignmentToType: assignment.assignmentToType };
}

export function emptyGreetRuleDraft(siteId: string): GreetRuleDraft {
  return {
    name: "",
    isEnabled: true,
    siteId,
    isIgnoreSuppression: false,
    specialTriggers: {
      sections: null,
      guestType: null,
      tiers: null,
      daysOfWeeks: null
    },
    metricTriggers: [{ __typename: "PdGreetRuleMetricTrigger" }],
    assignment: {
      weight: 0,
      assignTo: null
    }
  };
}

export function convertGreetRuleToDraft(rule: GreetRuleFragment): GreetRuleDraft {
  const { specialTriggers, metricTriggers } = convertTriggersToDraft(rule.triggers);
  const { assignTo, overflowAssignment, overflowAssignment2 } = rule.assignment ?? {};

  const overflow1Allowed =
    !!assignTo?.assignmentToType &&
    assignmentTypeAllowsOverflow(assignTo.assignmentToType);
  const overflow1 = overflow1Allowed
    ? convertOverflowAssignmentToDraft(overflowAssignment ?? null)
    : null;

  const overflow2Allowed =
    !!overflow1?.assignmentToType &&
    assignmentTypeAllowsOverflow(overflow1.assignmentToType);
  const overflow2 = overflow2Allowed
    ? convertOverflowAssignmentToDraft(overflowAssignment2 ?? null)
    : null;

  return {
    id: rule.id,
    name: rule.name,
    isEnabled: rule.isEnabled,
    siteId: rule.site!.id,
    isIgnoreSuppression: rule.isIgnoreSuppression ?? false,
    specialTriggers,
    metricTriggers,
    assignment: {
      weight: rule.assignment?.weight ?? 0,
      assignTo: assignTo ? convertAssignToToDraft(assignTo) : null,
      ...(overflow1 && {
        overflowGroup1: overflow1
      }),
      ...(overflow2 && {
        overflowGroup2: overflow2
      })
    }
  };
}

function triggerGuestType(
  value: PdGreetRuleSpecialTriggerValue
): PdGuestInteractionType | null {
  const guestType = Array.isArray(value.valuesIn) ? value.valuesIn[0] : value.valuesIn;
  if (!guestType) return null;

  switch (guestType) {
    case PdGuestInteractionType.All:
    case PdGuestInteractionType.Coded:
    case PdGuestInteractionType.Uncoded:
      return guestType;
    default:
      return null;
  }
}

function triggerStringMultiselect(
  value: PdGreetRuleSpecialTriggerValue
): DraftMultiSelectValue<string> | null {
  if (value.includeAll) return "__ALL__";

  return Array.isArray(value.valuesIn)
    ? value.valuesIn
        .filter(Boolean)
        .map((val) => (typeof val !== "string" ? `${val}` : val))
    : null;
}

type DraftTriggers = {
  specialTriggers: GreetDraftSiteTriggers;
  metricTriggers: GreetDraftMetricTrigger[];
};

function convertTriggersToDraft(triggers: GreetRuleTrigger[]): DraftTriggers {
  const specialTriggers: GreetDraftSiteTriggers = {
    sections: null,
    guestType: null,
    tiers: null,
    daysOfWeeks: null
  };
  const metricTriggers: GreetDraftMetricTrigger[] = [];

  for (const trigger of triggers) {
    if (trigger.__typename === "PdGreetRuleSpecialTrigger") {
      switch (trigger.type) {
        case "SECTION":
          specialTriggers.sections = triggerStringMultiselect(trigger.specialValue);
          break;
        case "GUEST_TYPE":
          specialTriggers.guestType = triggerGuestType(trigger.specialValue);
          break;
        case "TIER":
          specialTriggers.tiers = triggerStringMultiselect(trigger.specialValue);
          break;
        case "DAYS_OF_WEEKS":
          specialTriggers.daysOfWeeks = triggerStringMultiselect(trigger.specialValue);
          break;
      }
    } else if (trigger.__typename === "PdGreetRuleMetricTrigger") {
      if (!trigger.metric || !isMetricValue(trigger.metricValue)) continue;

      metricTriggers.push({
        __typename: trigger.__typename,
        code: trigger.metric.code,
        operator: trigger.operator,
        valueType: trigger.metric.valueType,
        value: trigger.metricValue
      });
    }
  }

  if (!metricTriggers.length) {
    metricTriggers.push({ __typename: "PdGreetRuleMetricTrigger" });
  }

  return { specialTriggers, metricTriggers };
}

function convertAssignToToDraft(
  group: GreetRuleGroupAssignmentFragment
): AssignTo | null {
  if (!group.assignmentToType) return null;
  return {
    assignmentToType: group.assignmentToType,
    ...(group.userGroup ? { userGroupId: group.userGroup.id } : {})
  };
}

function convertOverflowAssignmentToDraft(
  assignment: GreetRuleGroupAssignmentFragment | null
): OverflowAssignTo | null {
  if (!assignment?.assignmentToType) {
    return { assignmentToType: "None" };
  }

  return convertAssignToToDraft(assignment);
}
