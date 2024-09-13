import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { HostGoalUserOptionFragmentDoc } from "./user-select";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GoalBuilderGoalFragment = {
  __typename?: "PdGoalProgram";
  id: string;
  name: string;
  startDate: any;
  endDate: any;
  members: Array<{ __typename?: "User"; id: string }>;
  metrics: Array<{ __typename?: "PdGoalProgramMetric"; id: string }>;
  targets?: {
    __typename?: "PdGoalProgramTargetMatrix";
    matrix: Array<Array<number>>;
  } | null;
};

export type GoalBuilderUserFragment = {
  __typename?: "User";
  accessLevel: Types.OrgAccessLevel;
  id: string;
  firstName: string;
  lastName: string;
  pdHostMappings?: Array<{ __typename?: "PdHostMapping"; id: string }> | null;
  pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
};

export type GoalUsersQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type GoalUsersQuery = {
  __typename?: "Query";
  users?: Array<{
    __typename?: "User";
    accessLevel: Types.OrgAccessLevel;
    id: string;
    firstName: string;
    lastName: string;
    pdHostMappings?: Array<{ __typename?: "PdHostMapping"; id: string }> | null;
    pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
  }> | null;
};

export type GoalProgramsQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type GoalProgramsQuery = {
  __typename?: "Query";
  pdGoalPrograms: Array<{ __typename?: "PdGoalProgram"; id: string; name: string }>;
};

export type GoalBuilderGoalMetricFragment = {
  __typename?: "PdGoalProgramMetric";
  id: string;
  name: string;
};

export type GoalMetricsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GoalMetricsQuery = {
  __typename?: "Query";
  pdGoalMetrics: Array<{ __typename?: "PdGoalProgramMetric"; id: string; name: string }>;
};

export const GoalBuilderGoalFragmentDoc = gql`
  fragment GoalBuilderGoal on PdGoalProgram {
    id
    name
    startDate
    endDate
    members {
      id
    }
    metrics {
      id
    }
    targets {
      matrix
    }
  }
`;
export const GoalBuilderUserFragmentDoc = gql`
  fragment GoalBuilderUser on User {
    ...HostGoalUserOption
    pdHostMappings(siteId: $siteId) {
      id
    }
    accessLevel
  }
  ${HostGoalUserOptionFragmentDoc}
`;
export const GoalBuilderGoalMetricFragmentDoc = gql`
  fragment GoalBuilderGoalMetric on PdGoalProgramMetric {
    id
    name
  }
`;
export const GoalUsersDocument = gql`
  query goalUsers($siteId: ID!) {
    users {
      ...GoalBuilderUser
    }
  }
  ${GoalBuilderUserFragmentDoc}
`;

/**
 * __useGoalUsersQuery__
 *
 * To run a query within a React component, call `useGoalUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoalUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoalUsersQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGoalUsersQuery(
  baseOptions: Apollo.QueryHookOptions<GoalUsersQuery, GoalUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GoalUsersQuery, GoalUsersQueryVariables>(
    GoalUsersDocument,
    options
  );
}
export function useGoalUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GoalUsersQuery, GoalUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GoalUsersQuery, GoalUsersQueryVariables>(
    GoalUsersDocument,
    options
  );
}
export function useGoalUsersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GoalUsersQuery, GoalUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GoalUsersQuery, GoalUsersQueryVariables>(
    GoalUsersDocument,
    options
  );
}
export type GoalUsersQueryHookResult = ReturnType<typeof useGoalUsersQuery>;
export type GoalUsersLazyQueryHookResult = ReturnType<typeof useGoalUsersLazyQuery>;
export type GoalUsersSuspenseQueryHookResult = ReturnType<
  typeof useGoalUsersSuspenseQuery
>;
export type GoalUsersQueryResult = Apollo.QueryResult<
  GoalUsersQuery,
  GoalUsersQueryVariables
>;
export const GoalProgramsDocument = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      id
      name
    }
  }
`;

/**
 * __useGoalProgramsQuery__
 *
 * To run a query within a React component, call `useGoalProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoalProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoalProgramsQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGoalProgramsQuery(
  baseOptions: Apollo.QueryHookOptions<GoalProgramsQuery, GoalProgramsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GoalProgramsQuery, GoalProgramsQueryVariables>(
    GoalProgramsDocument,
    options
  );
}
export function useGoalProgramsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GoalProgramsQuery, GoalProgramsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GoalProgramsQuery, GoalProgramsQueryVariables>(
    GoalProgramsDocument,
    options
  );
}
export function useGoalProgramsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GoalProgramsQuery,
    GoalProgramsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GoalProgramsQuery, GoalProgramsQueryVariables>(
    GoalProgramsDocument,
    options
  );
}
export type GoalProgramsQueryHookResult = ReturnType<typeof useGoalProgramsQuery>;
export type GoalProgramsLazyQueryHookResult = ReturnType<typeof useGoalProgramsLazyQuery>;
export type GoalProgramsSuspenseQueryHookResult = ReturnType<
  typeof useGoalProgramsSuspenseQuery
>;
export type GoalProgramsQueryResult = Apollo.QueryResult<
  GoalProgramsQuery,
  GoalProgramsQueryVariables
>;
export const GoalMetricsDocument = gql`
  query goalMetrics {
    pdGoalMetrics {
      ...GoalBuilderGoalMetric
    }
  }
  ${GoalBuilderGoalMetricFragmentDoc}
`;

/**
 * __useGoalMetricsQuery__
 *
 * To run a query within a React component, call `useGoalMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoalMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoalMetricsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGoalMetricsQuery(
  baseOptions?: Apollo.QueryHookOptions<GoalMetricsQuery, GoalMetricsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GoalMetricsQuery, GoalMetricsQueryVariables>(
    GoalMetricsDocument,
    options
  );
}
export function useGoalMetricsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GoalMetricsQuery, GoalMetricsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GoalMetricsQuery, GoalMetricsQueryVariables>(
    GoalMetricsDocument,
    options
  );
}
export function useGoalMetricsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GoalMetricsQuery,
    GoalMetricsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GoalMetricsQuery, GoalMetricsQueryVariables>(
    GoalMetricsDocument,
    options
  );
}
export type GoalMetricsQueryHookResult = ReturnType<typeof useGoalMetricsQuery>;
export type GoalMetricsLazyQueryHookResult = ReturnType<typeof useGoalMetricsLazyQuery>;
export type GoalMetricsSuspenseQueryHookResult = ReturnType<
  typeof useGoalMetricsSuspenseQuery
>;
export type GoalMetricsQueryResult = Apollo.QueryResult<
  GoalMetricsQuery,
  GoalMetricsQueryVariables
>;
