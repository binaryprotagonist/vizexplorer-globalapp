import {
  GaUserFragment,
  GreetRuleFragment,
  GreetRuleMetricTriggerFragment,
  GreetRuleSpecialTriggerFragment,
  PdGreetAssignmentType,
  PdGreetMetricValueType,
  PdGreetRuleConditionOperator,
  PdGreetRuleSpecialTriggerValue,
  PdGreetRuleTriggerType,
  PdGuestInteractionType,
  Scalars,
  SiteFragment
} from "generated-graphql";
import {
  GreetRuleTrigger,
  METRIC_DATE_OPTIONS,
  MetricDateOption,
  MetricValue,
  SpecialTriggerObj
} from "./types";
import { canUser, isOrgAdmin } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";

export function ruleMatchesSearch(rule: GreetRuleFragment, search: string): boolean {
  return rule.name.toLowerCase().includes(search.toLowerCase());
}

export function isSpecialTrigger(
  trigger: GreetRuleTrigger
): trigger is GreetRuleSpecialTriggerFragment {
  return trigger.__typename === "PdGreetRuleSpecialTrigger";
}

export function isMetricTrigger(
  trigger: GreetRuleTrigger
): trigger is GreetRuleMetricTriggerFragment {
  return trigger.__typename === "PdGreetRuleMetricTrigger";
}

export function buildSpecialTriggerObj(
  triggers: GreetRuleSpecialTriggerFragment[]
): SpecialTriggerObj {
  return triggers.reduce<SpecialTriggerObj>((acc, cur) => {
    switch (cur.type) {
      case PdGreetRuleTriggerType.Section:
        acc.sections = cur.specialValue;
        break;
      case PdGreetRuleTriggerType.GuestType:
        acc.guestType = cur.specialValue;
        break;
      case PdGreetRuleTriggerType.Tier:
        acc.tiers = cur.specialValue;
        break;
      case PdGreetRuleTriggerType.DaysOfWeeks:
        acc.daysOfWeeks = cur.specialValue;
        break;
    }

    return acc;
  }, {});
}

export function greetAssignmentTypeLabel(type: PdGreetAssignmentType): string {
  switch (type) {
    case PdGreetAssignmentType.GuestHost:
      return "Guest Host Only";
    case PdGreetAssignmentType.GuestHostUserGroup:
      return "Guest Coded User Group";
    case PdGreetAssignmentType.SpecificUserGroup:
      return "Specific User Group";
    case PdGreetAssignmentType.AllUsers:
      return "All Hosts";
  }
}

export function specialTriggerValueLabel(
  value: PdGreetRuleSpecialTriggerValue,
  customAllText: string
): string {
  if (value.includeAll) return customAllText;
  if (!value.valuesIn) return "Invalid value";

  if (!Array.isArray(value.valuesIn)) {
    return `${value.valuesIn}`;
  }

  return value.valuesIn.join(", ");
}

export function guestTypeValueLabel(value: PdGreetRuleSpecialTriggerValue): string {
  const guestType = Array.isArray(value.valuesIn) ? value.valuesIn[0] : value.valuesIn;
  if (!guestType) return "Unknown";

  switch (guestType) {
    case PdGuestInteractionType.All:
      return "All guests";
    case PdGuestInteractionType.Coded:
      return "Coded";
    case PdGuestInteractionType.Uncoded:
      return "Uncoded";
    default:
      return `${guestType}`;
  }
}

export function metricTriggerValueLabel(trigger: GreetRuleMetricTriggerFragment): string {
  switch (trigger.metric?.valueType) {
    case PdGreetMetricValueType.Numeric:
      return numericTriggerValueLabel(trigger);
    case PdGreetMetricValueType.Date:
      return dateMetricValueLabel(trigger);
    default:
      return "Unknown metric type";
  }
}

function numericTriggerValueLabel(trigger: GreetRuleMetricTriggerFragment): string {
  const value = trigger.metricValue;

  switch (trigger.operator) {
    case PdGreetRuleConditionOperator.Range: {
      const range = Array.isArray(value) ? value : [];
      const min = range[0] ?? null;
      const max = range[1] ?? null;

      if (min === null && max === null) {
        return "Invalid range value";
      }

      const minLabel = `Min ${min}`;
      const maxLabel = `Max ${max}`;
      return min !== null && max !== null
        ? `${minLabel} ${maxLabel}`
        : min !== null
          ? minLabel
          : maxLabel;
    }
    case PdGreetRuleConditionOperator.Equal: {
      const eqValue = Array.isArray(value) ? value[0] : value;
      return eqValue ? `${eqValue}` : "Invalid value";
    }
    case PdGreetRuleConditionOperator.GreaterOrEqual: {
      const geValue = Array.isArray(value) ? value[0] : value;
      return geValue ? `Min ${geValue}` : "Invalid value";
    }
    case PdGreetRuleConditionOperator.LessOrEqual: {
      const leValue = Array.isArray(value) ? value[0] : value;
      return leValue ? `Max ${leValue}` : "Invalid value";
    }
    case PdGreetRuleConditionOperator.In: {
      if (!Array.isArray(value) || !value.length) {
        return "Invalid value";
      }
      return value.join(", ");
    }
  }
}

function dateMetricValueLabel(trigger: GreetRuleMetricTriggerFragment): string {
  const value = Array.isArray(trigger.metricValue) ? trigger.metricValue : [];

  if (isMetricValue(value)) {
    return findMetricDateByRawValue(value)?.label ?? "Invalid date value";
  }

  return "Invalid date value";
}

export function findSpecialTrigger(
  triggers: GreetRuleTrigger[],
  type: PdGreetRuleTriggerType
): GreetRuleSpecialTriggerFragment | undefined {
  return triggers.find(
    (trigger) => isSpecialTrigger(trigger) && trigger.type === type
  ) as GreetRuleSpecialTriggerFragment | undefined;
}

export function sitesManageableByUser(sites: SiteFragment[], user: GaUserFragment) {
  if (isOrgAdmin(user.accessLevel)) {
    return sites;
  }

  return sites.filter((site) =>
    canUser(user, { type: UserActionType.MANAGE_GREET_RULES, siteId: site.id })
  );
}

export function findMetricDateByRawValue(
  rawValue: MetricValue
): MetricDateOption | undefined {
  if (typeof rawValue[0] !== "number" || typeof rawValue[1] !== "number") return;

  return METRIC_DATE_OPTIONS.find((option) => {
    return option.rawValue[0] === rawValue[0] && option.rawValue[1] === rawValue[1];
  });
}

export function isMetricValue(
  value: Scalars["PdGreetRuleConditionValue"]["input"]
): value is MetricValue {
  if (!Array.isArray(value)) return false;
  if (value.length !== 2) return false;
  if (typeof value[0] !== "number" && value[0] !== null) return false;
  if (typeof value[1] !== "number" && value[1] !== null) return false;
  return true;
}
