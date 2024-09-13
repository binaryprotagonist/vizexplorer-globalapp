import {
  PdreRuleConfigUpdateDocument,
  PdreRuleConfigUpdateMutation,
  PdreRuleConfigUpdateMutationVariables,
  PdreRuleFragment,
  PdreRulesDocument,
  PdreRulesQuery
} from "generated-graphql";

export function mockPdreRulesQuery(siteId?: string, rules?: PdreRuleFragment[]) {
  const data: PdreRulesQuery = {
    pdreRules: rules ?? generateDummyPdreRules()
  };

  return {
    request: {
      query: PdreRulesDocument,
      variables: { siteId: siteId || "0" }
    },
    result: {
      data
    }
  };
}

export function mockPdreRuleConfigUpdate(updatedRule: PdreRuleFragment) {
  const input: PdreRuleConfigUpdateMutationVariables["input"] = {
    ruleCode: updatedRule.code,
    siteId: updatedRule.siteId!,
    enabled: updatedRule.config!.enabled,
    weight: updatedRule.config!.weight
  };

  const data: PdreRuleConfigUpdateMutation = {
    pdreRuleConfigUpdate: {
      __typename: "PdRuleConfig",
      id: updatedRule.config!.id,
      enabled: updatedRule.config!.enabled,
      weight: updatedRule.config!.weight
    }
  };

  return {
    request: {
      query: PdreRuleConfigUpdateDocument,
      variables: { input }
    },
    result: {
      data
    }
  };
}

export function generateDummyPdreRules(length = 3, siteId = "1"): PdreRuleFragment[] {
  return Array(length)
    .fill(null)
    .map<PdreRuleFragment>((_, idx) => ({
      __typename: "PdRule",
      id: `${idx + 1}`,
      siteId,
      code: `RuleCode${idx + 1}`,
      name: `Rule ${idx + 1}`,
      description: `Rule ${idx + 1} Description`,
      config: {
        __typename: "PdRuleConfig",
        id: `${idx + 1}`,
        enabled: true,
        weight: (idx + 1) * 10
      }
    }));
}
