import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type SiteQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type SiteQuery = {
  __typename?: "Query";
  site?: {
    __typename?: "Site";
    id: string;
    currency?: { __typename?: "Currency"; code?: any | null } | null;
  } | null;
};

export type DashboardResetMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
  siteId: Types.Scalars["Int"]["input"];
}>;

export type DashboardResetMutation = {
  __typename?: "Mutation";
  odrDashboardReset?: {
    __typename?: "OdrDashboard";
    id: string;
    filtersBySite: Array<{
      __typename?: "OdrSiteFilter";
      variant: Types.OdrFilterVariant;
    }>;
  } | null;
};

export const SiteDocument = gql`
  query site($id: ID!) {
    site(idV2: $id) {
      id: idV2
      currency {
        code
      }
    }
  }
`;

/**
 * __useSiteQuery__
 *
 * To run a query within a React component, call `useSiteQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSiteQuery(
  baseOptions: Apollo.QueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export function useSiteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export function useSiteSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export type SiteQueryHookResult = ReturnType<typeof useSiteQuery>;
export type SiteLazyQueryHookResult = ReturnType<typeof useSiteLazyQuery>;
export type SiteSuspenseQueryHookResult = ReturnType<typeof useSiteSuspenseQuery>;
export type SiteQueryResult = Apollo.QueryResult<SiteQuery, SiteQueryVariables>;
export const DashboardResetDocument = gql`
  mutation dashboardReset($id: ID!, $siteId: Int!) {
    odrDashboardReset(id: $id) {
      id
      filtersBySite(siteId: $siteId) {
        variant
      }
    }
  }
`;
export type DashboardResetMutationFn = Apollo.MutationFunction<
  DashboardResetMutation,
  DashboardResetMutationVariables
>;

/**
 * __useDashboardResetMutation__
 *
 * To run a mutation, you first call `useDashboardResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDashboardResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dashboardResetMutation, { data, loading, error }] = useDashboardResetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useDashboardResetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DashboardResetMutation,
    DashboardResetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DashboardResetMutation, DashboardResetMutationVariables>(
    DashboardResetDocument,
    options
  );
}
export type DashboardResetMutationHookResult = ReturnType<
  typeof useDashboardResetMutation
>;
export type DashboardResetMutationResult = Apollo.MutationResult<DashboardResetMutation>;
export type DashboardResetMutationOptions = Apollo.BaseMutationOptions<
  DashboardResetMutation,
  DashboardResetMutationVariables
>;
