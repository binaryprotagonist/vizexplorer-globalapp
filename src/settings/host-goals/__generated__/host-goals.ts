import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { SiteSelectSiteFragmentDoc } from "../../../view-v2/site-select/__generated__/site-select";
import { ProgramCardProgramFragmentDoc } from "./program-card";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type SitesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SitesQuery = {
  __typename?: "Query";
  sites?: Array<{ __typename?: "Site"; name: string; id: string }> | null;
};

export type GoalProgramsQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type GoalProgramsQuery = {
  __typename?: "Query";
  pdGoalPrograms: Array<{
    __typename?: "PdGoalProgram";
    id: string;
    name: string;
    status?: Types.PdGoalProgramStatus | null;
    startDate: any;
    endDate: any;
    members: Array<{
      __typename?: "User";
      id: string;
      firstName: string;
      lastName: string;
      pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    }>;
    metrics: Array<{ __typename?: "PdGoalProgramMetric"; id: string; name: string }>;
    targets?: {
      __typename?: "PdGoalProgramTargetMatrix";
      matrix: Array<Array<number>>;
    } | null;
  }>;
};

export type GoalProgramDeleteMutationVariables = Types.Exact<{
  input: Types.PdGoalProgramDeleteInput;
}>;

export type GoalProgramDeleteMutation = {
  __typename?: "Mutation";
  pdGoalProgramDelete?: boolean | null;
};

export const SitesDocument = gql`
  query sites {
    sites {
      ...SiteSelectSite
    }
  }
  ${SiteSelectSiteFragmentDoc}
`;

/**
 * __useSitesQuery__
 *
 * To run a query within a React component, call `useSitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSitesQuery(
  baseOptions?: Apollo.QueryHookOptions<SitesQuery, SitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SitesQuery, SitesQueryVariables>(SitesDocument, options);
}
export function useSitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SitesQuery, SitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SitesQuery, SitesQueryVariables>(SitesDocument, options);
}
export function useSitesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SitesQuery, SitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SitesQuery, SitesQueryVariables>(SitesDocument, options);
}
export type SitesQueryHookResult = ReturnType<typeof useSitesQuery>;
export type SitesLazyQueryHookResult = ReturnType<typeof useSitesLazyQuery>;
export type SitesSuspenseQueryHookResult = ReturnType<typeof useSitesSuspenseQuery>;
export type SitesQueryResult = Apollo.QueryResult<SitesQuery, SitesQueryVariables>;
export const GoalProgramsDocument = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      ...ProgramCardProgram
    }
  }
  ${ProgramCardProgramFragmentDoc}
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
export const GoalProgramDeleteDocument = gql`
  mutation goalProgramDelete($input: PdGoalProgramDeleteInput!) {
    pdGoalProgramDelete(input: $input)
  }
`;
export type GoalProgramDeleteMutationFn = Apollo.MutationFunction<
  GoalProgramDeleteMutation,
  GoalProgramDeleteMutationVariables
>;

/**
 * __useGoalProgramDeleteMutation__
 *
 * To run a mutation, you first call `useGoalProgramDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoalProgramDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [goalProgramDeleteMutation, { data, loading, error }] = useGoalProgramDeleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGoalProgramDeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GoalProgramDeleteMutation,
    GoalProgramDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GoalProgramDeleteMutation,
    GoalProgramDeleteMutationVariables
  >(GoalProgramDeleteDocument, options);
}
export type GoalProgramDeleteMutationHookResult = ReturnType<
  typeof useGoalProgramDeleteMutation
>;
export type GoalProgramDeleteMutationResult =
  Apollo.MutationResult<GoalProgramDeleteMutation>;
export type GoalProgramDeleteMutationOptions = Apollo.BaseMutationOptions<
  GoalProgramDeleteMutation,
  GoalProgramDeleteMutationVariables
>;
