import { GraphQLError } from "graphql";
import {
  GoalProgramCreateDocument,
  GoalProgramCreateMutation,
  GoalProgramCreateMutationVariables,
  GoalProgramsDocument,
  GoalProgramsQuery,
  GoalProgramsQueryVariables
} from "../__generated__/host-goal-create";
import { PdGoalProgramStatus } from "generated-graphql";
import { GoalBuilderGoalFragment } from "../goal-builder/__generated__/goal-builder";

export type MockGoalCreateProgramsQueryOpts = {
  programs: GoalBuilderGoalFragment[];
  vars?: GoalProgramsQueryVariables;
};

export function mockGoalCreateProgramsQuery({
  programs,
  vars
}: MockGoalCreateProgramsQueryOpts) {
  const variables: GoalProgramsQueryVariables = { siteId: "0", ...vars };
  const data: GoalProgramsQuery = { pdGoalPrograms: programs };

  return {
    request: {
      query: GoalProgramsDocument,
      variables
    },
    result: {
      data
    }
  };
}

export const mockGoalProgramCreateInput: GoalProgramCreateMutationVariables["input"] = {
  name: "New Goal",
  siteId: "0",
  startDate: "2022-03-01",
  endDate: "2022-04-01",
  members: ["0"],
  metrics: ["0"],
  targetMatrix: [[1]]
};

export type MockGoalProgramCreateMutationOpts = {
  vars: GoalProgramCreateMutationVariables["input"];
  errors?: GraphQLError[];
};

export function mockGoalProgramCreateMutation({
  vars,
  errors
}: MockGoalProgramCreateMutationOpts) {
  const variables: GoalProgramCreateMutationVariables = {
    input: vars
  };
  const data: GoalProgramCreateMutation = {
    pdGoalProgramCreate: {
      __typename: "PdGoalProgram",
      id: "1",
      name: vars.name,
      site: { __typename: "Site", id: vars.siteId },
      startDate: vars.startDate,
      endDate: vars.endDate,
      status: PdGoalProgramStatus.Current,
      members: vars.members.map((id) => ({ __typename: "User", id: id })),
      metrics: vars.metrics.map((id) => ({ __typename: "PdGoalProgramMetric", id: id })),
      targets: {
        __typename: "PdGoalProgramTargetMatrix",
        matrix: vars.targetMatrix
      }
    }
  };

  return {
    request: {
      query: GoalProgramCreateDocument,
      variables
    },
    result: {
      data,
      errors
    }
  };
}
