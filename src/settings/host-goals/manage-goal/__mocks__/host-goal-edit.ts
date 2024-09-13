import { GraphQLError } from "graphql";
import {
  GoalProgramUpdateDocument,
  GoalProgramUpdateMutation,
  GoalProgramUpdateMutationVariables,
  GoalProgramsDocument,
  GoalProgramsQuery,
  GoalProgramsQueryVariables
} from "../__generated__/host-goal-edit";
import { PdGoalProgramStatus } from "generated-graphql";
import { GoalBuilderGoalFragment } from "../goal-builder/__generated__/goal-builder";

export const mockGoalProgramUpdateInput: GoalProgramUpdateMutationVariables["input"] = {
  id: "0",
  name: "Goal Updated",
  siteId: "0",
  startDate: "2022-03-01",
  endDate: "2022-04-01",
  members: ["0"],
  metrics: ["0"],
  targetMatrix: [[1]]
};

export type MockGoalProgramEditMutationOpts = {
  vars: GoalProgramUpdateMutationVariables["input"];
  errors?: GraphQLError[];
};

export function mockGoalProgramUpdateMutation({
  vars,
  errors
}: MockGoalProgramEditMutationOpts) {
  const variables: GoalProgramUpdateMutationVariables = {
    input: vars
  };
  const data: GoalProgramUpdateMutation = {
    pdGoalProgramUpdate: {
      __typename: "PdGoalProgram",
      id: "0",
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
      query: GoalProgramUpdateDocument,
      variables
    },
    result: {
      data,
      errors
    }
  };
}

export type MockGoalEditProgramsQueryOpts = {
  programs: GoalBuilderGoalFragment[];
  vars?: GoalProgramsQueryVariables;
};

export function mockGoalEditProgramsQuery({
  programs,
  vars
}: MockGoalEditProgramsQueryOpts) {
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
