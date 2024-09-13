import {
  PdGreetAssignmentType,
  PdGreetMetricValueType,
  PdGreetRuleConditionOperator,
  PdGuestInteractionType
} from "generated-graphql";
import { MetricValue } from "../types";

export type GreetRuleDraft = {
  id?: string;
  name: string;
  isEnabled: boolean;
  siteId: string | null;
  isIgnoreSuppression: boolean;
  specialTriggers: GreetDraftSiteTriggers;
  metricTriggers: GreetDraftMetricTrigger[];
  assignment: AssignmentDraft;
};

export type GreetDraftSiteTriggers = {
  sections: DraftMultiSelectValue<string> | null;
  guestType: PdGuestInteractionType | null;
  tiers: DraftMultiSelectValue<string> | null;
  daysOfWeeks: DraftMultiSelectValue<string> | null;
};

export type GreetDraftMetricTrigger = {
  __typename: "PdGreetRuleMetricTrigger";
  code?: string;
  operator?: PdGreetRuleConditionOperator;
  valueType?: PdGreetMetricValueType;
  value?: MetricValue;
};

export type DraftSelectAll = "__ALL__";
export type DraftMultiSelectValue<T extends string | number> = DraftSelectAll | T[];

export type OverflowGreetAssignmentType = PdGreetAssignmentType | "None";

export type AssignTo =
  | {
      assignmentToType:
        | PdGreetAssignmentType.AllUsers
        | PdGreetAssignmentType.GuestHost
        | PdGreetAssignmentType.GuestHostUserGroup;
    }
  | {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup;
      userGroupId?: string;
    };

export type OverflowAssignTo =
  | AssignTo
  | {
      assignmentToType: "None";
    };

type AssignmentDraft = {
  weight: number | null;
  assignTo: AssignTo | null;
  overflowGroup1?: OverflowAssignTo;
  overflowGroup2?: OverflowAssignTo;
};

export type ReducerState = {
  rule: GreetRuleDraft;
  error: Error | null;
  ruleChanged: boolean;
};

type UpdateName = {
  type: "UPDATE_NAME";
  payload: { name: string };
};

type UpdateProperty = {
  type: "UPDATE_PROPERTY";
  payload: { siteId: string };
};

type UpdateSections = {
  type: "UPDATE_SECTIONS";
  payload: { sections: DraftMultiSelectValue<string> };
};

type ToggleEnabled = {
  type: "UPDATE_ENABLED";
  payload: { enabled: boolean };
};

type UpdateGuestType = {
  type: "UPDATE_GUEST_TYPE";
  payload: { guestType: PdGuestInteractionType };
};

type UpdateTiers = {
  type: "UPDATE_TIERS";
  payload: { tiers: DraftMultiSelectValue<string> };
};

type UpdateDaysOfWeeks = {
  type: "UPDATE_DAYS_OF_WEEKS";
  payload: { daysOfWeek: DraftMultiSelectValue<string> };
};

type AddEmptyMetric = {
  type: "ADD_EMPTY_METRIC";
};

type UpdateMetricSelection = {
  type: "UPDATE_METRIC_SELECTION";
  payload: {
    index: number;
    code: string;
    valueType: PdGreetMetricValueType;
  };
};

type UpdateMetricValue = {
  type: "UPDATE_METRIC_VALUE";
  payload: {
    index: number;
    value: MetricValue;
  };
};

type DeleteMetric = {
  type: "DELETE_METRIC";
  payload: { index: number };
};

type UpdateIgnoreSuppression = {
  type: "UPDATE_IGNORE_SUPPRESSION";
  payload: { ignoreSuppression: boolean };
};

type UpdateWeight = {
  type: "UPDATE_WEIGHT";
  payload: { weight: number | null };
};

type UpdateAssignTo = {
  type: "UPDATE_ASSIGN_TO";
  payload: AssignTo;
};

type UpdateOverflow1 = {
  type: "UPDATE_OVERFLOW1";
  payload: OverflowAssignTo;
};

type UpdateOverflow2 = {
  type: "UPDATE_OVERFLOW2";
  payload: OverflowAssignTo;
};

export type ReducerAction =
  | UpdateName
  | UpdateProperty
  | UpdateSections
  | ToggleEnabled
  | UpdateGuestType
  | UpdateTiers
  | UpdateDaysOfWeeks
  | AddEmptyMetric
  | UpdateMetricSelection
  | UpdateMetricValue
  | DeleteMetric
  | UpdateIgnoreSuppression
  | UpdateWeight
  | UpdateAssignTo
  | UpdateOverflow1
  | UpdateOverflow2;
