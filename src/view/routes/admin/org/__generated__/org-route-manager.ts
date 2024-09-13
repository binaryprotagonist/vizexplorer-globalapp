import * as Types from "../../../../graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type CurrentOrgQueryVariables = Types.Exact<{ [key: string]: never }>;

export type CurrentOrgQuery = {
  __typename?: "Query";
  currentOrg?: { __typename?: "Org"; id: string } | null;
};

export const CurrentOrgDocument = gql`
  query currentOrg {
    currentOrg {
      id
    }
  }
`;

/**
 * __useCurrentOrgQuery__
 *
 * To run a query within a React component, call `useCurrentOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentOrgQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentOrgQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentOrgQuery, CurrentOrgQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentOrgQuery, CurrentOrgQueryVariables>(
    CurrentOrgDocument,
    options
  );
}
export function useCurrentOrgLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CurrentOrgQuery, CurrentOrgQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentOrgQuery, CurrentOrgQueryVariables>(
    CurrentOrgDocument,
    options
  );
}
export function useCurrentOrgSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentOrgQuery, CurrentOrgQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CurrentOrgQuery, CurrentOrgQueryVariables>(
    CurrentOrgDocument,
    options
  );
}
export type CurrentOrgQueryHookResult = ReturnType<typeof useCurrentOrgQuery>;
export type CurrentOrgLazyQueryHookResult = ReturnType<typeof useCurrentOrgLazyQuery>;
export type CurrentOrgSuspenseQueryHookResult = ReturnType<
  typeof useCurrentOrgSuspenseQuery
>;
export type CurrentOrgQueryResult = Apollo.QueryResult<
  CurrentOrgQuery,
  CurrentOrgQueryVariables
>;
