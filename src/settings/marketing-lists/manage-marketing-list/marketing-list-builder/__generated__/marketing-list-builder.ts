import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type MarketingProgramsQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type MarketingProgramsQuery = {
  __typename?: "Query";
  pdMarketingPrograms: Array<{
    __typename?: "PdMarketingProgram";
    id: string;
    name: string;
  }>;
};

export const MarketingProgramsDocument = gql`
  query marketingPrograms($siteId: ID!) {
    pdMarketingPrograms(siteId: $siteId) {
      id
      name
    }
  }
`;

/**
 * __useMarketingProgramsQuery__
 *
 * To run a query within a React component, call `useMarketingProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketingProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketingProgramsQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useMarketingProgramsQuery(
  baseOptions: Apollo.QueryHookOptions<
    MarketingProgramsQuery,
    MarketingProgramsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MarketingProgramsQuery, MarketingProgramsQueryVariables>(
    MarketingProgramsDocument,
    options
  );
}
export function useMarketingProgramsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MarketingProgramsQuery,
    MarketingProgramsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MarketingProgramsQuery, MarketingProgramsQueryVariables>(
    MarketingProgramsDocument,
    options
  );
}
export function useMarketingProgramsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MarketingProgramsQuery,
    MarketingProgramsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MarketingProgramsQuery, MarketingProgramsQueryVariables>(
    MarketingProgramsDocument,
    options
  );
}
export type MarketingProgramsQueryHookResult = ReturnType<
  typeof useMarketingProgramsQuery
>;
export type MarketingProgramsLazyQueryHookResult = ReturnType<
  typeof useMarketingProgramsLazyQuery
>;
export type MarketingProgramsSuspenseQueryHookResult = ReturnType<
  typeof useMarketingProgramsSuspenseQuery
>;
export type MarketingProgramsQueryResult = Apollo.QueryResult<
  MarketingProgramsQuery,
  MarketingProgramsQueryVariables
>;
