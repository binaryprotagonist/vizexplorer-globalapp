import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { ManageLicenseLicenseStatusFragmentDoc } from "./manage-license-card";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type LicenseQueryVariables = Types.Exact<{ [key: string]: never }>;

export type LicenseQuery = {
  __typename?: "Query";
  license?: {
    __typename?: "License";
    status?: {
      __typename?: "LicenseStatus";
      isValid: boolean;
      error?: { __typename?: "LicenseError"; code: string } | null;
    } | null;
  } | null;
};

export const LicenseDocument = gql`
  query license {
    license {
      status {
        ...ManageLicenseLicenseStatus
      }
    }
  }
  ${ManageLicenseLicenseStatusFragmentDoc}
`;

/**
 * __useLicenseQuery__
 *
 * To run a query within a React component, call `useLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLicenseQuery({
 *   variables: {
 *   },
 * });
 */
export function useLicenseQuery(
  baseOptions?: Apollo.QueryHookOptions<LicenseQuery, LicenseQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LicenseQuery, LicenseQueryVariables>(LicenseDocument, options);
}
export function useLicenseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LicenseQuery, LicenseQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LicenseQuery, LicenseQueryVariables>(
    LicenseDocument,
    options
  );
}
export function useLicenseSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<LicenseQuery, LicenseQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<LicenseQuery, LicenseQueryVariables>(
    LicenseDocument,
    options
  );
}
export type LicenseQueryHookResult = ReturnType<typeof useLicenseQuery>;
export type LicenseLazyQueryHookResult = ReturnType<typeof useLicenseLazyQuery>;
export type LicenseSuspenseQueryHookResult = ReturnType<typeof useLicenseSuspenseQuery>;
export type LicenseQueryResult = Apollo.QueryResult<LicenseQuery, LicenseQueryVariables>;
