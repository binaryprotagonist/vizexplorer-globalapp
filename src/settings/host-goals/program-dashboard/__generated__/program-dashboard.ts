import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { ProgramDashboardHeaderMetaFragmentDoc } from "./program-dashboard-header";
import { TeamPerformanceMetricFragmentDoc } from "./team-performance";
import { IndividualPerformanceMetricFragmentDoc } from "./individual-performance";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ProgramDashboardProgramFragment = {
  __typename?: "PdGoalProgram";
  id: string;
  name: string;
  status?: Types.PdGoalProgramStatus | null;
  startDate: any;
  endDate: any;
  createdAt: any;
  modifiedAt: any;
  sisenseDashboardTeamPerformance?: { __typename?: "OdrDashboard"; id: string } | null;
  sisenseDashboardIndividualPerformance?: {
    __typename?: "OdrDashboard";
    id: string;
  } | null;
  metrics: Array<{
    __typename?: "PdGoalProgramMetric";
    id: string;
    name: string;
    sisenseTeamWidget?: { __typename?: "OdrWidget"; id: string } | null;
    sisenseIndividualWidget?: { __typename?: "OdrWidget"; id: string } | null;
  }>;
};

export type DashboardProgramQueryVariables = Types.Exact<{
  programId: Types.Scalars["ID"]["input"];
  siteId: Types.Scalars["ID"]["input"];
}>;

export type DashboardProgramQuery = {
  __typename?: "Query";
  pdGoalProgram?: {
    __typename?: "PdGoalProgram";
    id: string;
    name: string;
    status?: Types.PdGoalProgramStatus | null;
    startDate: any;
    endDate: any;
    createdAt: any;
    modifiedAt: any;
    sisenseDashboardTeamPerformance?: { __typename?: "OdrDashboard"; id: string } | null;
    sisenseDashboardIndividualPerformance?: {
      __typename?: "OdrDashboard";
      id: string;
    } | null;
    metrics: Array<{
      __typename?: "PdGoalProgramMetric";
      id: string;
      name: string;
      sisenseTeamWidget?: { __typename?: "OdrWidget"; id: string } | null;
      sisenseIndividualWidget?: { __typename?: "OdrWidget"; id: string } | null;
    }>;
  } | null;
};

export const ProgramDashboardProgramFragmentDoc = gql`
  fragment ProgramDashboardProgram on PdGoalProgram {
    id
    ...ProgramDashboardHeaderMeta
    sisenseDashboardTeamPerformance {
      id
    }
    sisenseDashboardIndividualPerformance {
      id
    }
    metrics {
      ...TeamPerformanceMetric
      ...IndividualPerformanceMetric
    }
  }
  ${ProgramDashboardHeaderMetaFragmentDoc}
  ${TeamPerformanceMetricFragmentDoc}
  ${IndividualPerformanceMetricFragmentDoc}
`;
export const DashboardProgramDocument = gql`
  query dashboardProgram($programId: ID!, $siteId: ID!) {
    pdGoalProgram(programId: $programId, siteId: $siteId) {
      ...ProgramDashboardProgram
    }
  }
  ${ProgramDashboardProgramFragmentDoc}
`;

/**
 * __useDashboardProgramQuery__
 *
 * To run a query within a React component, call `useDashboardProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardProgramQuery({
 *   variables: {
 *      programId: // value for 'programId'
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useDashboardProgramQuery(
  baseOptions: Apollo.QueryHookOptions<
    DashboardProgramQuery,
    DashboardProgramQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DashboardProgramQuery, DashboardProgramQueryVariables>(
    DashboardProgramDocument,
    options
  );
}
export function useDashboardProgramLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DashboardProgramQuery,
    DashboardProgramQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DashboardProgramQuery, DashboardProgramQueryVariables>(
    DashboardProgramDocument,
    options
  );
}
export function useDashboardProgramSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DashboardProgramQuery,
    DashboardProgramQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<DashboardProgramQuery, DashboardProgramQueryVariables>(
    DashboardProgramDocument,
    options
  );
}
export type DashboardProgramQueryHookResult = ReturnType<typeof useDashboardProgramQuery>;
export type DashboardProgramLazyQueryHookResult = ReturnType<
  typeof useDashboardProgramLazyQuery
>;
export type DashboardProgramSuspenseQueryHookResult = ReturnType<
  typeof useDashboardProgramSuspenseQuery
>;
export type DashboardProgramQueryResult = Apollo.QueryResult<
  DashboardProgramQuery,
  DashboardProgramQueryVariables
>;
