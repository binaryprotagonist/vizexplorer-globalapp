import { ReducerAction, ReducerState } from "./types";
import {
  resetIncompatibleAssignments,
  updateAssignTo,
  updateOverflow1,
  updateOverflow2
} from "./assignment";
import { PdGreetRuleConditionOperator } from "generated-graphql";
import { isWeightValid } from "./utils";

export function greetRuleReducer(draft: ReducerState, action: ReducerAction) {
  // assume we'll hit a switch case indicating the rule was modified, but set to false if we don't
  let ruleChanged = true;
  draft.error = null;

  switch (action.type) {
    case "UPDATE_NAME": {
      draft.rule.name = action.payload.name;
      break;
    }
    case "UPDATE_PROPERTY": {
      draft.rule.siteId = action.payload.siteId;
      draft.rule.specialTriggers.sections = [];
      break;
    }
    case "UPDATE_SECTIONS": {
      draft.rule.specialTriggers.sections = action.payload.sections;
      break;
    }
    case "UPDATE_ENABLED": {
      draft.rule.isEnabled = action.payload.enabled;
      break;
    }
    case "UPDATE_GUEST_TYPE": {
      const { guestType } = action.payload;
      draft.rule.specialTriggers.guestType = guestType;
      resetIncompatibleAssignments(draft, guestType);
      break;
    }
    case "UPDATE_TIERS": {
      draft.rule.specialTriggers.tiers = action.payload.tiers;
      break;
    }
    case "UPDATE_DAYS_OF_WEEKS": {
      draft.rule.specialTriggers.daysOfWeeks = action.payload.daysOfWeek;
      break;
    }
    case "ADD_EMPTY_METRIC": {
      draft.rule.metricTriggers.push({ __typename: "PdGreetRuleMetricTrigger" });
      break;
    }
    case "UPDATE_METRIC_SELECTION": {
      const { index, code, valueType } = action.payload;
      const trigger = draft.rule.metricTriggers[index];
      if (!trigger) {
        draft.error = new Error(`Invalid metric trigger index: ${index}`);
        break;
      }

      if (trigger.valueType !== valueType) {
        trigger.value = [null, null];
      }

      trigger.operator = PdGreetRuleConditionOperator.Range;
      trigger.code = code;
      trigger.valueType = valueType;
      break;
    }
    case "UPDATE_METRIC_VALUE": {
      const { index, value } = action.payload;
      const trigger = draft.rule.metricTriggers[index];
      if (!trigger) {
        draft.error = new Error(`Invalid metric trigger index: ${index}`);
        break;
      }

      trigger.value = value;
      break;
    }
    case "DELETE_METRIC": {
      const triggers = draft.rule.metricTriggers;
      if (!triggers[action.payload.index]) {
        draft.error = new Error(`Invalid metric trigger index: ${action.payload.index}`);
        break;
      }

      if (triggers.length > 1) {
        triggers.splice(action.payload.index, 1);
      } else {
        triggers[0] = { __typename: "PdGreetRuleMetricTrigger" };
      }
      break;
    }
    case "UPDATE_IGNORE_SUPPRESSION": {
      draft.rule.isIgnoreSuppression = action.payload.ignoreSuppression;
      break;
    }
    case "UPDATE_WEIGHT": {
      if (!isWeightValid(action.payload.weight)) {
        draft.error = new Error("Weight must be between 0 and 100");
        draft.rule.assignment.weight = null;
        break;
      }

      draft.rule.assignment.weight = action.payload.weight;
      break;
    }
    case "UPDATE_ASSIGN_TO": {
      const guestType = draft.rule.specialTriggers.guestType;
      updateAssignTo(draft, action.payload, guestType);
      break;
    }
    case "UPDATE_OVERFLOW1": {
      const guestType = draft.rule.specialTriggers.guestType;
      updateOverflow1(draft, action.payload, guestType);
      break;
    }
    case "UPDATE_OVERFLOW2": {
      const guestType = draft.rule.specialTriggers.guestType;
      updateOverflow2(draft, action.payload, guestType);
      break;
    }
    default:
      ruleChanged = false;
      break;
  }

  if (ruleChanged) {
    draft.ruleChanged = true;
  }

  return draft;
}
