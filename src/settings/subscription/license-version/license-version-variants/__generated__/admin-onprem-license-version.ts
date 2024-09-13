import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type AdminOnpremLicenseQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AdminOnpremLicenseQuery = {
  __typename?: "Query";
  license?: {
    __typename?: "License";
    status?: { __typename?: "LicenseStatus"; isValid: boolean } | null;
  } | null;
};

export type AdminOnpremVersionsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type AdminOnpremVersionsQuery = {
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

export const AdminOnpremLicenseDocument = gql`
  query adminOnpremLicense {
    license {
      status {
        isValid
      }
    }
  }
`;

/**
 * __useAdminOnpremLicenseQuery__
 *
 * To run a query within a React component, call `useAdminOnpremLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOnpremLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOnpremLicenseQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminOnpremLicenseQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminOnpremLicenseQuery,
    AdminOnpremLicenseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AdminOnpremLicenseQuery, AdminOnpremLicenseQueryVariables>(
    AdminOnpremLicenseDocument,
    options
  );
}
export function useAdminOnpremLicenseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOnpremLicenseQuery,
    AdminOnpremLicenseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AdminOnpremLicenseQuery, AdminOnpremLicenseQueryVariables>(
    AdminOnpremLicenseDocument,
    options
  );
}
export function useAdminOnpremLicenseSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminOnpremLicenseQuery,
    AdminOnpremLicenseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AdminOnpremLicenseQuery,
    AdminOnpremLicenseQueryVariables
  >(AdminOnpremLicenseDocument, options);
}
export type AdminOnpremLicenseQueryHookResult = ReturnType<
  typeof useAdminOnpremLicenseQuery
>;
export type AdminOnpremLicenseLazyQueryHookResult = ReturnType<
  typeof useAdminOnpremLicenseLazyQuery
>;
export type AdminOnpremLicenseSuspenseQueryHookResult = ReturnType<
  typeof useAdminOnpremLicenseSuspenseQuery
>;
export type AdminOnpremLicenseQueryResult = Apollo.QueryResult<
  AdminOnpremLicenseQuery,
  AdminOnpremLicenseQueryVariables
>;
export const AdminOnpremVersionsDocument = gql`
  query adminOnpremVersions {
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
 * __useAdminOnpremVersionsQuery__
 *
 * To run a query within a React component, call `useAdminOnpremVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOnpremVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOnpremVersionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminOnpremVersionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminOnpremVersionsQuery,
    AdminOnpremVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AdminOnpremVersionsQuery, AdminOnpremVersionsQueryVariables>(
    AdminOnpremVersionsDocument,
    options
  );
}
export function useAdminOnpremVersionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOnpremVersionsQuery,
    AdminOnpremVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AdminOnpremVersionsQuery, AdminOnpremVersionsQueryVariables>(
    AdminOnpremVersionsDocument,
    options
  );
}
export function useAdminOnpremVersionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AdminOnpremVersionsQuery,
    AdminOnpremVersionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AdminOnpremVersionsQuery,
    AdminOnpremVersionsQueryVariables
  >(AdminOnpremVersionsDocument, options);
}
export type AdminOnpremVersionsQueryHookResult = ReturnType<
  typeof useAdminOnpremVersionsQuery
>;
export type AdminOnpremVersionsLazyQueryHookResult = ReturnType<
  typeof useAdminOnpremVersionsLazyQuery
>;
export type AdminOnpremVersionsSuspenseQueryHookResult = ReturnType<
  typeof useAdminOnpremVersionsSuspenseQuery
>;
export type AdminOnpremVersionsQueryResult = Apollo.QueryResult<
  AdminOnpremVersionsQuery,
  AdminOnpremVersionsQueryVariables
>;
