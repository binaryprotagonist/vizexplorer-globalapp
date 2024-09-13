import { OrgAccessLevel } from "generated-graphql";
import {
  GoalBuilderGoalMetricFragment,
  GoalMetricsDocument,
  GoalMetricsQuery,
  GoalBuilderUserFragment,
  GoalUsersDocument,
  GoalUsersQuery,
  GoalUsersQueryVariables,
  GoalBuilderGoalFragment
} from "../__generated__/goal-builder";

export function generateDummyUsers(length = 10): GoalBuilderUserFragment[] {
  return new Array(length).fill(null).map<GoalBuilderUserFragment>((_, idx) => ({
    __typename: "User",
    id: `${idx}`,
    firstName: `User ${idx}`,
    lastName: `Last ${idx}`,
    accessLevel: OrgAccessLevel.AppSpecific,
    pdUserGroup: {
      __typename: "PdUserGroup",
      id: idx < 5 ? "1" : "2",
      name: `Group ${idx < 5 ? 1 : 2}`
    },
    pdHostMappings: [{ __typename: "PdHostMapping", id: `${idx}` }]
  }));
}

type MockUsersQueryOpts = {
  users?: GoalBuilderUserFragment[];
  vars?: GoalUsersQueryVariables;
};

export function mockGoalUsersQuery({ users, vars }: MockUsersQueryOpts = {}) {
  const data: GoalUsersQuery = {
    users: users ?? generateDummyUsers()
  };
  const variables: GoalUsersQueryVariables = { siteId: "0", ...vars };

  return {
    request: {
      query: GoalUsersDocument,
      variables
    },
    result: {
      data
    }
  };
}

export function generateDummyGoalBuilderGoals(length = 3): GoalBuilderGoalFragment[] {
  return new Array(length).fill(null).map<GoalBuilderGoalFragment>((_, idx) => ({
    __typename: "PdGoalProgram",
    id: `${idx}`,
    name: `Goal ${idx}`,
    startDate: "2022-03-01",
    endDate: "2022-04-01",
    members: generateDummyUsers(1),
    metrics: generateDummyGoalMetrics(1),
    targets: {
      __typename: "PdGoalProgramTargetMatrix",
      matrix: [[1]]
    }
  }));
}

export function generateDummyGoalMetrics(length = 10): GoalBuilderGoalMetricFragment[] {
  return new Array(length).fill(null).map<GoalBuilderGoalMetricFragment>((_, idx) => ({
    __typename: "PdGoalProgramMetric",
    id: `${idx}`,
    name: `Metric ${idx}`
  }));
}

type MockGoalMetricsQueryOpts = {
  metrics?: GoalBuilderGoalMetricFragment[];
};

export function mockGoalMetricsQuery({ metrics }: MockGoalMetricsQueryOpts = {}) {
  const data: GoalMetricsQuery = { pdGoalMetrics: metrics ?? generateDummyGoalMetrics() };

  return {
    request: {
      query: GoalMetricsDocument
    },
    result: {
      data
    }
  };
}
