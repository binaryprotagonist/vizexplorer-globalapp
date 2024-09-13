import { PdGoalProgramStatus } from "generated-graphql";
import {
  DashboardProgramDocument,
  DashboardProgramQuery,
  DashboardProgramQueryVariables,
  ProgramDashboardProgramFragment
} from "../__generated__/program-dashboard";

export const mockDashboardProgram: ProgramDashboardProgramFragment = {
  __typename: "PdGoalProgram",
  id: "0",
  name: "Goal 0",
  status: PdGoalProgramStatus.Current,
  startDate: "2022-01-01",
  endDate: "2022-02-01",
  createdAt: "2021-12-01",
  modifiedAt: "2021-12-15",
  sisenseDashboardTeamPerformance: {
    __typename: "OdrDashboard",
    id: "0"
  },
  sisenseDashboardIndividualPerformance: {
    __typename: "OdrDashboard",
    id: "1"
  },
  metrics: []
};

export type MockDashboardGoalProgramsQueryOpts = {
  program?: ProgramDashboardProgramFragment | null;
  vars?: DashboardProgramQueryVariables;
};

export function mockDashboardGoalProgramsQuery({
  program,
  vars
}: MockDashboardGoalProgramsQueryOpts = {}) {
  const variables: DashboardProgramQueryVariables = {
    programId: "0",
    siteId: "0",
    ...vars
  };
  const data: DashboardProgramQuery = {
    pdGoalProgram: program
  };

  return {
    request: {
      query: DashboardProgramDocument,
      variables
    },
    result: {
      data
    }
  };
}
