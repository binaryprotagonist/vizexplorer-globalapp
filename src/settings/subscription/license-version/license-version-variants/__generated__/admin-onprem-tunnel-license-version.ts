import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type AdminOnpremTunnelsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AdminOnpremTunnelsQuery = {
  __typename?: "Query";
  currentOrg?: {
    __typename?: "Org";
    id: string;
    onPremTunnels: Array<{ __typename?: "OrgOnPremTunnel"; url?: string | null }>;
  } | null;
};

export const AdminOnpremTunnelsDocument = gql`
  query adminOnpremTunnels {
    currentOrg {
      id
      onPremTunnels {
        url
      }
    }
  }
`;

/**
 * __useAdminOnpremTunnelsQuery__
 *
 * To run a query within a React component, call `useAdminOnpremTunnelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOnpremTunnelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOnpremTunnelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminOnpremTunnelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminOnpremTunnelsQuery,
    AdminOnpremTunnelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AdminOnpremTunnelsQuery, AdminOnpremTunnelsQueryVariables>(
    AdminOnpremTunnelsDocument,
    options
  );
}
export function useAdminOnpremTunnelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOnpremTunnelsQuery,
    AdminOnpremTunnelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AdminOnpremTunnelsQuery, AdminOnpremTunnelsQueryVariables>(
    AdminOnpremTunnelsDocument,
    options
  );
}
export function useAdminOnpremTunnelsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminOnpremTunnelsQuery,
    AdminOnpremTunnelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AdminOnpremTunnelsQuery,
    AdminOnpremTunnelsQueryVariables
  >(AdminOnpremTunnelsDocument, options);
}
export type AdminOnpremTunnelsQueryHookResult = ReturnType<
  typeof useAdminOnpremTunnelsQuery
>;
export type AdminOnpremTunnelsLazyQueryHookResult = ReturnType<
  typeof useAdminOnpremTunnelsLazyQuery
>;
export type AdminOnpremTunnelsSuspenseQueryHookResult = ReturnType<
  typeof useAdminOnpremTunnelsSuspenseQuery
>;
export type AdminOnpremTunnelsQueryResult = Apollo.QueryResult<
  AdminOnpremTunnelsQuery,
  AdminOnpremTunnelsQueryVariables
>;
