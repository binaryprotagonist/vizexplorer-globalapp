import { SiteSelectSiteFragment } from "view-v2/site-select";
import {
  GoalProgramDeleteDocument,
  GoalProgramDeleteMutation,
  GoalProgramDeleteMutationVariables,
  GoalProgramsDocument,
  GoalProgramsQuery,
  GoalProgramsQueryVariables,
  SitesDocument
} from "../__generated__/host-goals";
import { ProgramCardProgramFragment } from "../__generated__/program-card";
import { OrgAccessLevel, PdGoalProgramStatus } from "generated-graphql";
import {
  TargetValuesMetricFragment,
  TargetValuesUserFragment
} from "../__generated__/target-values-grid";
import { GraphQLError } from "graphql";

export function generateDummyGoalMetrics(length = 10): TargetValuesMetricFragment[] {
  return new Array(length).fill(null).map<TargetValuesMetricFragment>((_, idx) => ({
    __typename: "PdGoalProgramMetric",
    id: `${idx}`,
    name: `Metric ${idx}`
  }));
}

export function generateDummyUsers(length = 10): TargetValuesUserFragment[] {
  return new Array(length).fill(null).map<TargetValuesUserFragment>((_, idx) => ({
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

export function generateDummySites(length: number): SiteSelectSiteFragment[] {
  return Array(length)
    .fill(null)
    .map<SiteSelectSiteFragment>((_, idx) => ({
      __typename: "Site",
      id: `${idx}`,
      name: `Site ${idx}`,
      currency: {
        __typename: "Currency",
        code: "USD"
      },
      tz: "UTC"
    }));
}

export function generateDummyPrograms(length: number): ProgramCardProgramFragment[] {
  return Array(length)
    .fill(null)
    .map<ProgramCardProgramFragment>((_, idx) => ({
      __typename: "PdGoalProgram",
      id: `${idx}`,
      name: `Program ${idx}`,
      status: idx % 2 === 0 ? PdGoalProgramStatus.Current : PdGoalProgramStatus.History,
      endDate: "2022-01-01",
      startDate: "2021-01-01",
      members: generateDummyUsers(1),
      metrics: generateDummyGoalMetrics(1),
      targets: {
        __typename: "PdGoalProgramTargetMatrix",
        matrix: [[1, 2]]
      }
    }));
}

export function mockSitesQuery(sites?: SiteSelectSiteFragment[]) {
  const userSites = sites || generateDummySites(3);

  return {
    request: {
      query: SitesDocument
    },
    result: {
      data: {
        sites: userSites
      }
    }
  };
}

export type MockGoalProgramsQueryOpts = {
  programs?: ProgramCardProgramFragment[];
  errors?: GraphQLError[];
  vars?: GoalProgramsQueryVariables;
};

export function mockGoalProgramsQuery({
  programs,
  errors,
  vars
}: MockGoalProgramsQueryOpts = {}) {
  const variables: GoalProgramsQueryVariables = {
    siteId: vars?.siteId ?? "0"
  };
  const data: GoalProgramsQuery = {
    pdGoalPrograms: programs ?? generateDummyPrograms(3)
  };

  return {
    request: {
      query: GoalProgramsDocument,
      variables
    },
    result: {
      data,
      errors: errors
    }
  };
}

export function mockGoalProgramDeleteMutation(programId: string, siteId: string) {
  const variables: GoalProgramDeleteMutationVariables = {
    input: { id: programId, siteId }
  };
  const data: GoalProgramDeleteMutation = {
    pdGoalProgramDelete: true
  };

  return {
    request: {
      query: GoalProgramDeleteDocument,
      variables
    },
    result: {
      data
    }
  };
}
