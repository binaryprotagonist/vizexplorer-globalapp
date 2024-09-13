import {
  GreetRuleBuilderOrgDataDocument,
  GreetRuleBuilderOrgDataQuery,
  GreetRuleBuilderSiteDataDocument,
  GreetRuleBuilderSiteDataQuery,
  GreetRuleBuilderSiteDataQueryVariables,
  GreetRuleCreateDocument,
  GreetRuleCreateMutation,
  GreetRuleCreateMutationVariables,
  GreetRuleDeleteDocument,
  GreetRuleDeleteMutation,
  GreetRuleDeleteMutationVariables,
  GreetRuleFragment,
  GreetRuleMetricTriggerFragment,
  GreetRuleSpecialTriggerFragment,
  GreetRuleUserGroupFragment,
  GreetRulesDocument,
  GreetRulesQuery,
  GreetRulesQueryVariables,
  PdGreetAssignmentType,
  PdGreetMetricValueType,
  PdGreetRuleConditionOperator,
  PdGreetRuleCreateInput,
  PdGreetRuleTriggerType,
  PdGuestInteractionType
} from "generated-graphql";
import { GraphQLError } from "graphql";
import { generateDummyLoyaltyTiers } from "./loyalty-tiers";
import { generateDummyGreetSections } from "./greet-sections";

export function generateDummyGreetRules(
  length = 3,
  siteId?: string
): GreetRuleFragment[] {
  return Array.from({ length }, (_, i) => ({
    __typename: "PdGreetRule",
    id: `${i + 1}`,
    name: `Greet Rule ${i}`,
    priority: i + 1,
    isEnabled: true,
    isIgnoreSuppression: false,
    site: {
      __typename: "Site",
      id: `${siteId ?? i}`,
      name: `Site ${siteId ?? i}`
    },
    triggers: basicTriggers,
    assignment: null
  }));
}

export type MockGreetRulesQueryOpts = {
  rules?: GreetRuleFragment[];
  errors?: GraphQLError[];
  vars?: GreetRulesQueryVariables;
};

export function mockGreetRulesQuery({
  rules,
  errors,
  vars
}: MockGreetRulesQueryOpts = {}) {
  const variables: GreetRulesQueryVariables = {
    siteId: vars?.siteId ?? "0"
  };
  const data: GreetRulesQuery = {
    pdGreetRules: rules ?? generateDummyGreetRules()
  };

  return {
    request: {
      query: GreetRulesDocument,
      variables
    },
    result: {
      data,
      errors: errors
    }
  };
}

export function mockGreetRuleBuilderOrgData() {
  const data: GreetRuleBuilderOrgDataQuery = {
    pdGreetMetrics: [],
    pdUserGroups: generateDummyUserGroups(),
    pdOrgSettings: {
      __typename: "PdOrgSettings",
      id: "1",
      tiers: generateDummyLoyaltyTiers()
    }
  };

  return {
    request: {
      query: GreetRuleBuilderOrgDataDocument
    },
    result: {
      data
    }
  };
}

type MockGreetRuleBuilderSiteDataOpts = {
  sections?: GreetRuleBuilderSiteDataQuery["pdGreetSections"];
  rules?: GreetRuleBuilderSiteDataQuery["pdGreetRules"];
  vars?: GreetRuleBuilderSiteDataQueryVariables;
};

export function mockGreetRuleBuilderSiteData({
  vars,
  sections,
  rules
}: MockGreetRuleBuilderSiteDataOpts = {}) {
  const variables: GreetRuleBuilderSiteDataQueryVariables = {
    siteId: "0",
    ...vars
  };
  const data: GreetRuleBuilderSiteDataQuery = {
    pdGreetRules: rules ?? generateDummyGreetRules(),
    pdGreetSections: sections ?? generateDummyGreetSections()
  };

  return {
    request: {
      query: GreetRuleBuilderSiteDataDocument,
      variables
    },
    result: {
      data
    }
  };
}

export function mockGreetRuleDeleteMutation(ruleId: string, siteId: string) {
  const variables: GreetRuleDeleteMutationVariables = {
    id: ruleId,
    siteId
  };
  const data: GreetRuleDeleteMutation = {
    pdGreetRuleDelete: true
  };

  return {
    request: {
      query: GreetRuleDeleteDocument,
      variables
    },
    result: {
      data
    }
  };
}

export type MockGreetRuleCreateOpts = {
  input: PdGreetRuleCreateInput;
  error?: { graphQL?: GraphQLError[] };
};

export function mockGreetRuleCreateMutation({ input, error }: MockGreetRuleCreateOpts) {
  const variables: GreetRuleCreateMutationVariables = {
    input
  };
  const data: GreetRuleCreateMutation = {
    pdGreetRuleCreate: {
      __typename: "PdGreetRule",
      id: "100",
      name: input.name,
      priority: 1,
      isEnabled: input.isEnabled,
      isIgnoreSuppression: false,
      site: {
        __typename: "Site",
        id: input.siteId,
        name: `Site ${input.siteId}`
      },
      triggers: [],
      assignment: {
        __typename: "PdGreetRuleAssignment",
        id: "100",
        overflowAssignment: null,
        overflowAssignment2: null,
        ...input.assignment
      }
    }
  };

  return {
    request: {
      query: GreetRuleCreateDocument,
      variables
    },
    result: {
      data,
      errors: error?.graphQL
    }
  };
}

export const mockGreetRuleWithMultiselectedOptions: GreetRuleFragment = {
  id: "1",
  name: "JL Test",
  priority: 1,
  isEnabled: true,
  isIgnoreSuppression: false,
  site: {
    __typename: "Site",
    id: "0",
    name: "Site 0"
  },
  triggers: [
    {
      type: PdGreetRuleTriggerType.Section,
      specialValue: {
        includeAll: false,
        valuesIn: ["01", "02"],
        __typename: "PdGreetRuleSpecialTriggerValue"
      },
      __typename: "PdGreetRuleSpecialTrigger"
    },
    {
      type: PdGreetRuleTriggerType.GuestType,
      specialValue: {
        includeAll: false,
        valuesIn: [PdGuestInteractionType.All],
        __typename: "PdGreetRuleSpecialTriggerValue"
      },
      __typename: "PdGreetRuleSpecialTrigger"
    },
    {
      type: PdGreetRuleTriggerType.Tier,
      specialValue: {
        includeAll: false,
        valuesIn: ["Platinum", "Gold"],
        __typename: "PdGreetRuleSpecialTriggerValue"
      },
      __typename: "PdGreetRuleSpecialTrigger"
    },
    {
      type: PdGreetRuleTriggerType.DaysOfWeeks,
      specialValue: {
        includeAll: false,
        valuesIn: ["Sunday", "Tuesday", "Thursday", "Saturday"],
        __typename: "PdGreetRuleSpecialTriggerValue"
      },
      __typename: "PdGreetRuleSpecialTrigger"
    },
    {
      metric: {
        label: "Today Actual Win",
        code: "todayActualWin",
        valueType: PdGreetMetricValueType.Numeric,
        __typename: "PdGreetMetricDefinition"
      },
      metricValue: [100, 200],
      operator: PdGreetRuleConditionOperator.Range,
      __typename: "PdGreetRuleMetricTrigger"
    }
  ],
  assignment: {
    id: "17",
    weight: 75,
    assignTo: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroup: {
        id: "39",
        name: "JL 1",
        __typename: "PdUserGroup"
      },
      __typename: "PdGreetRuleGroupAssignment"
    },
    overflowAssignment: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroup: {
        id: "40",
        name: "JL 2",
        __typename: "PdUserGroup"
      },
      __typename: "PdGreetRuleGroupAssignment"
    },
    overflowAssignment2: {
      assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
      userGroup: {
        id: "47",
        name: "JL 3",
        __typename: "PdUserGroup"
      },
      __typename: "PdGreetRuleGroupAssignment"
    },
    __typename: "PdGreetRuleAssignment"
  },
  __typename: "PdGreetRule"
};

const basicTriggers: (
  | GreetRuleSpecialTriggerFragment
  | GreetRuleMetricTriggerFragment
)[] = [
  {
    __typename: "PdGreetRuleSpecialTrigger",
    type: PdGreetRuleTriggerType.Section,
    specialValue: {
      __typename: "PdGreetRuleSpecialTriggerValue",
      includeAll: true,
      valuesIn: null
    }
  },
  {
    __typename: "PdGreetRuleSpecialTrigger",
    type: PdGreetRuleTriggerType.GuestType,
    specialValue: {
      __typename: "PdGreetRuleSpecialTriggerValue",
      includeAll: true,
      valuesIn: null
    }
  },
  {
    __typename: "PdGreetRuleSpecialTrigger",
    type: PdGreetRuleTriggerType.Tier,
    specialValue: {
      __typename: "PdGreetRuleSpecialTriggerValue",
      includeAll: true,
      valuesIn: null
    }
  },
  {
    __typename: "PdGreetRuleSpecialTrigger",
    type: PdGreetRuleTriggerType.DaysOfWeeks,
    specialValue: {
      __typename: "PdGreetRuleSpecialTriggerValue",
      includeAll: true,
      valuesIn: null
    }
  }
];

function generateDummyUserGroups(length = 3): GreetRuleUserGroupFragment[] {
  return Array.from({ length }, (_, idx) => ({
    __typename: "PdUserGroup",
    id: `${idx}`,
    name: `User Group ${idx}`,
    guestInteractionType: PdGuestInteractionType.All
  }));
}
