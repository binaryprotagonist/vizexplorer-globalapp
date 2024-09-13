import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type AdminCloudVersionsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AdminCloudVersionsQuery = {
  __typename?: "Query";
  discovery: {
    __typename?: "Discovery";
    env?: {
      __typename?: "Env";
      versions?: {
        __typename?: "Versions";
        apps?: string | null;
        sisenseDataObject?: { __typename?: "SisenseDataObject"; version: string } | null;
      } | null;
    } | null;
  };
};

export const AdminCloudVersionsDocument = gql`
  query adminCloudVersions {
    discovery {
      env {
        versions {
          apps
          sisenseDataObject {
            version
          }
        }
      }
    }
  }
`;

/**
 * __useAdminCloudVersionsQuery__
 *
 * To run a query within a React component, call `useAdminCloudVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCloudVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCloudVersionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminCloudVersionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminCloudVersionsQuery,
    AdminCloudVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AdminCloudVersionsQuery, AdminCloudVersionsQueryVariables>(
    AdminCloudVersionsDocument,
    options
  );
}
export function useAdminCloudVersionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminCloudVersionsQuery,
    AdminCloudVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AdminCloudVersionsQuery, AdminCloudVersionsQueryVariables>(
    AdminCloudVersionsDocument,
    options
  );
}
export function useAdminCloudVersionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminCloudVersionsQuery,
    AdminCloudVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AdminCloudVersionsQuery,
    AdminCloudVersionsQueryVariables
  >(AdminCloudVersionsDocument, options);
}
export type AdminCloudVersionsQueryHookResult = ReturnType<
  typeof useAdminCloudVersionsQuery
>;
export type AdminCloudVersionsLazyQueryHookResult = ReturnType<
  typeof useAdminCloudVersionsLazyQuery
>;
export type AdminCloudVersionsSuspenseQueryHookResult = ReturnType<
  typeof useAdminCloudVersionsSuspenseQuery
>;
export type AdminCloudVersionsQueryResult = Apollo.QueryResult<
  AdminCloudVersionsQuery,
  AdminCloudVersionsQueryVariables
>;
