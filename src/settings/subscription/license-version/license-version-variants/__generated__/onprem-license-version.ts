import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type OnpremLicenseQueryVariables = Types.Exact<{ [key: string]: never }>;

export type OnpremLicenseQuery = {
  __typename?: "Query";
  license?: {
    __typename?: "License";
    status?: { __typename?: "LicenseStatus"; isValid: boolean } | null;
  } | null;
};

export const OnpremLicenseDocument = gql`
  query onpremLicense {
    license {
      status {
        isValid
      }
    }
  }
`;

/**
 * __useOnpremLicenseQuery__
 *
 * To run a query within a React component, call `useOnpremLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useOnpremLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnpremLicenseQuery({
 *   variables: {
 *   },
 * });
 */
export function useOnpremLicenseQuery(
  baseOptions?: Apollo.QueryHookOptions<OnpremLicenseQuery, OnpremLicenseQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OnpremLicenseQuery, OnpremLicenseQueryVariables>(
    OnpremLicenseDocument,
    options
  );
}
export function useOnpremLicenseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OnpremLicenseQuery,
    OnpremLicenseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OnpremLicenseQuery, OnpremLicenseQueryVariables>(
    OnpremLicenseDocument,
    options
  );
}
export function useOnpremLicenseSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OnpremLicenseQuery,
    OnpremLicenseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OnpremLicenseQuery, OnpremLicenseQueryVariables>(
    OnpremLicenseDocument,
    options
  );
}
export type OnpremLicenseQueryHookResult = ReturnType<typeof useOnpremLicenseQuery>;
export type OnpremLicenseLazyQueryHookResult = ReturnType<
  typeof useOnpremLicenseLazyQuery
>;
export type OnpremLicenseSuspenseQueryHookResult = ReturnType<
  typeof useOnpremLicenseSuspenseQuery
>;
export type OnpremLicenseQueryResult = Apollo.QueryResult<
  OnpremLicenseQuery,
  OnpremLicenseQueryVariables
>;
