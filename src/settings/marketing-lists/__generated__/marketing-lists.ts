import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { SiteSelectSiteFragmentDoc } from "../../../view-v2/site-select/__generated__/site-select";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type SitesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SitesQuery = {
  __typename?: "Query";
  sites?: Array<{ __typename?: "Site"; name: string; id: string }> | null;
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
