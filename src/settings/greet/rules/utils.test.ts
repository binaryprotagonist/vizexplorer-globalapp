import { GreetRuleFragment, PdGreetRuleConditionOperator } from "generated-graphql";
import { isMetricTrigger, metricTriggerValueLabel, ruleMatchesSearch } from "./utils";
import { mockGreetRuleWithMultiselectedOptions } from "testing/mocks";
import { produce } from "immer";

const mockRule = mockGreetRuleWithMultiselectedOptions;

describe("Greet Utils", () => {
  describe("ruleMatchesSearch", () => {
    const mockRules: GreetRuleFragment[] = [
      { ...mockRule, id: "1", name: "High value customers" },
      { ...mockRule, id: "2", name: "Low value customers" },
      { ...mockRule, id: "3", name: "Middle Market" }
    ];

    it("returns rules matching search", () => {
      const res = mockRules.filter((rule) => ruleMatchesSearch(rule, "customers"));
      expect(res).toHaveLength(2);
      expect(res[0].id).toEqual(mockRules[0].id);
      expect(res[1].id).toEqual(mockRules[1].id);
    });

    it("returns all rules if search is empty", () => {
      const res = mockRules.filter((rule) => ruleMatchesSearch(rule, ""));
      expect(res).toHaveLength(mockRules.length);
    });

    it("returns no rules if no rules match search", () => {
      const res = mockRules.filter((rule) => ruleMatchesSearch(rule, "foo"));
      expect(res).toHaveLength(0);
    });

    it("matches rules case-insensitively", () => {
      const res = mockRules.filter((rule) => ruleMatchesSearch(rule, "market"));
      expect(res).toHaveLength(1);
      expect(res[0].id).toEqual(mockRules[2].id);
    });
  });

  describe("metricTriggerValueLabel", () => {
    const metricTrigger = mockRule.triggers.find(isMetricTrigger)!;

    it("returns expected label for a `rg` Metric Trigger", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [1, 2];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Min 1 Max 2");
    });

    it("returns expected label for a `rg` Metric Trigger with only min value", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [1, null];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Min 1");
    });

    it("returns expected label for a `rg` Metric Trigger with only max value", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [null, 2];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Max 2");
    });

    it("returns expected label for a `rg` Metric Trigger with a range starting 0", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [0, 2];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Min 0 Max 2");
    });

    it("returns expected label for a `rg` Metric Trigger with a range ending 0", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [-100, 0];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Min -100 Max 0");
    });

    it("returns Invalid value for a `rg` Metric Trigger with no values", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = [];
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Invalid range value");
    });

    it("returns Invalid value for a `rg` Metric Trigger with a non-array value", () => {
      const rngTigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Range;
        draft!.metricValue = 1;
      });
      expect(metricTriggerValueLabel(rngTigger)).toEqual("Invalid range value");
    });

    it("returns expected label for an `eq` Metric Trigger with a non-array value", () => {
      const eqTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Equal;
        draft!.metricValue = 1;
      });
      expect(metricTriggerValueLabel(eqTrigger)).toEqual("1");
    });

    it("returns expected label for an `eq` Metric Trigger with an array value", () => {
      const eqTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Equal;
        draft!.metricValue = [1];
      });
      expect(metricTriggerValueLabel(eqTrigger)).toEqual("1");
    });

    it("returns Invalid value for an `eq` Metric Trigger with no values", () => {
      const eqTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.Equal;
        draft!.metricValue = [];
      });
      expect(metricTriggerValueLabel(eqTrigger)).toEqual("Invalid value");
    });

    it("returns expected label for a `ge` Metric Trigger with a non-array value", () => {
      const geTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.GreaterOrEqual;
        draft!.metricValue = 1;
      });
      expect(metricTriggerValueLabel(geTrigger)).toEqual("Min 1");
    });

    it("returns expected label for a `ge` Metric Trigger with an array value", () => {
      const geTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.GreaterOrEqual;
        draft!.metricValue = [1];
      });
      expect(metricTriggerValueLabel(geTrigger)).toEqual("Min 1");
    });

    it("returns Invalid value for a `ge` Metric Trigger with no values", () => {
      const geTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.GreaterOrEqual;
        draft!.metricValue = [];
      });
      expect(metricTriggerValueLabel(geTrigger)).toEqual("Invalid value");
    });

    it("returns expected label for a `le` Metric Trigger with a non-array value", () => {
      const leTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.LessOrEqual;
        draft!.metricValue = 1;
      });
      expect(metricTriggerValueLabel(leTrigger)).toEqual("Max 1");
    });

    it("returns expected label for a `le` Metric Trigger with an array value", () => {
      const leTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.LessOrEqual;
        draft!.metricValue = [1];
      });
      expect(metricTriggerValueLabel(leTrigger)).toEqual("Max 1");
    });

    it("returns Invalid value for a `le` Metric Trigger with no values", () => {
      const leTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.LessOrEqual;
        draft!.metricValue = [];
      });
      expect(metricTriggerValueLabel(leTrigger)).toEqual("Invalid value");
    });

    it("returns expected label for an `in` Metric Trigger with a array value", () => {
      const inTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.In;
        draft!.metricValue = [1, 2];
      });
      expect(metricTriggerValueLabel(inTrigger)).toEqual("1, 2");
    });

    it("returns Invalid value for an `in` Metric Trigger with no values", () => {
      const inTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.In;
        draft!.metricValue = [];
      });
      expect(metricTriggerValueLabel(inTrigger)).toEqual("Invalid value");
    });

    it("returns Invalid value for an `in` Metric Trigger with a non-array value", () => {
      const inTrigger = produce(metricTrigger, (draft) => {
        draft!.operator = PdGreetRuleConditionOperator.In;
        draft!.metricValue = 1;
      });
      expect(metricTriggerValueLabel(inTrigger)).toEqual("Invalid value");
    });
  });
});
