import {
  GreetRuleMetricTriggerFragment,
  GreetRuleSpecialTriggerFragment,
  PdGreetRuleSpecialTriggerValue
} from "generated-graphql";
import { SelectOption } from "../components";

export type RuleActionType = "edit" | "delete" | "expand-collapse";

export type GreetRuleTrigger =
  | GreetRuleSpecialTriggerFragment
  | GreetRuleMetricTriggerFragment;

export type SpecialTriggerObj = {
  sections?: PdGreetRuleSpecialTriggerValue;
  guestType?: PdGreetRuleSpecialTriggerValue;
  tiers?: PdGreetRuleSpecialTriggerValue;
  daysOfWeeks?: PdGreetRuleSpecialTriggerValue;
};

export type MetricValue = [min: number | null, max: number | null];
type MetricDateValue = "today" | "yesterday" | "week" | "month";
export type MetricDateOption = SelectOption<MetricDateValue, { rawValue: MetricValue }>;

export const METRIC_DATE_OPTIONS: MetricDateOption[] = [
  { label: "Today", value: "today", rawValue: [0, 0] },
  { label: "Yesterday", value: "yesterday", rawValue: [-1, 1] },
  { label: "This Week", value: "week", rawValue: [-7, 7] },
  { label: "This Month", value: "month", rawValue: [-31, 31] }
];
