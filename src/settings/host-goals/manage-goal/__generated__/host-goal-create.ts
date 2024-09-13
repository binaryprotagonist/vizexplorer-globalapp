import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { GoalBuilderGoalFragmentDoc } from "../goal-builder/__generated__/goal-builder";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GoalProgramsQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type GoalProgramsQuery = {
  __typename?: "Query";
  pdGoalPrograms: Array<{
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
  }>;
};

export type GoalProgramCreateMutationVariables = Types.Exact<{
  input: Types.PdGoalProgramCreateInput;
}>;

export type GoalProgramCreateMutation = {
  __typename?: "Mutation";
  pdGoalProgramCreate?: {
    __typename?: "PdGoalProgram";
    id: string;
    name: string;
    startDate: any;
    endDate: any;
    status?: Types.PdGoalProgramStatus | null;
    site?: { __typename?: "Site"; id: string } | null;
    members: Array<{ __typename?: "User"; id: string }>;
    metrics: Array<{ __typename?: "PdGoalProgramMetric"; id: string }>;
    targets?: {
      __typename?: "PdGoalProgramTargetMatrix";
      matrix: Array<Array<number>>;
    } | null;
  } | null;
};

export const GoalProgramsDocument = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      ...GoalBuilderGoal
    }
  }
  ${GoalBuilderGoalFragmentDoc}
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
export const GoalProgramCreateDocument = gql`
  mutation goalProgramCreate($input: PdGoalProgramCreateInput!) {
    pdGoalProgramCreate(input: $input) {
      id
      name
      startDate
      endDate
      status
      site {
        id: idV2
      }
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
  }
`;
export type GoalProgramCreateMutationFn = Apollo.MutationFunction<
  GoalProgramCreateMutation,
  GoalProgramCreateMutationVariables
>;

/**
 * __useGoalProgramCreateMutation__
 *
 * To run a mutation, you first call `useGoalProgramCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoalProgramCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [goalProgramCreateMutation, { data, loading, error }] = useGoalProgramCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGoalProgramCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GoalProgramCreateMutation,
    GoalProgramCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GoalProgramCreateMutation,
    GoalProgramCreateMutationVariables
  >(GoalProgramCreateDocument, options);
}
export type GoalProgramCreateMutationHookResult = ReturnType<
  typeof useGoalProgramCreateMutation
>;
export type GoalProgramCreateMutationResult =
  Apollo.MutationResult<GoalProgramCreateMutation>;
export type GoalProgramCreateMutationOptions = Apollo.BaseMutationOptions<
  GoalProgramCreateMutation,
  GoalProgramCreateMutationVariables
>;
