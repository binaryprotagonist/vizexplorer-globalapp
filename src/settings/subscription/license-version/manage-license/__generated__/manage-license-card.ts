import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ManageLicenseLicenseStatusFragment = {
  __typename?: "LicenseStatus";
  isValid: boolean;
  error?: { __typename?: "LicenseError"; code: string } | null;
};

export type LicenseValidateQueryVariables = Types.Exact<{
  key: Types.Scalars["String"]["input"];
}>;

export type LicenseValidateQuery = {
  __typename?: "Query";
  licenseValidate?: {
    __typename?: "LicenseStatus";
    isValid: boolean;
    error?: { __typename?: "LicenseError"; code: string } | null;
  } | null;
};

export type LicenseUpdateMutationVariables = Types.Exact<{
  key: Types.Scalars["String"]["input"];
}>;

export type LicenseUpdateMutation = {
  __typename?: "Mutation";
  licenseUpdate?: {
    __typename?: "LicenseStatus";
    isValid: boolean;
    error?: { __typename?: "LicenseError"; code: string } | null;
  } | null;
};

export const ManageLicenseLicenseStatusFragmentDoc = gql`
  fragment ManageLicenseLicenseStatus on LicenseStatus {
    isValid
    error {
      code
    }
  }
`;
export const LicenseValidateDocument = gql`
  query licenseValidate($key: String!) {
    licenseValidate(key: $key) {
      ...ManageLicenseLicenseStatus
    }
  }
  ${ManageLicenseLicenseStatusFragmentDoc}
`;

/**
 * __useLicenseValidateQuery__
 *
 * To run a query within a React component, call `useLicenseValidateQuery` and pass it any options that fit your needs.
 * When your component renders, `useLicenseValidateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLicenseValidateQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useLicenseValidateQuery(
  baseOptions: Apollo.QueryHookOptions<
    LicenseValidateQuery,
    LicenseValidateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LicenseValidateQuery, LicenseValidateQueryVariables>(
    LicenseValidateDocument,
    options
  );
}
export function useLicenseValidateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LicenseValidateQuery,
    LicenseValidateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LicenseValidateQuery, LicenseValidateQueryVariables>(
    LicenseValidateDocument,
    options
  );
}
export function useLicenseValidateSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    LicenseValidateQuery,
    LicenseValidateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<LicenseValidateQuery, LicenseValidateQueryVariables>(
    LicenseValidateDocument,
    options
  );
}
export type LicenseValidateQueryHookResult = ReturnType<typeof useLicenseValidateQuery>;
export type LicenseValidateLazyQueryHookResult = ReturnType<
  typeof useLicenseValidateLazyQuery
>;
export type LicenseValidateSuspenseQueryHookResult = ReturnType<
  typeof useLicenseValidateSuspenseQuery
>;
export type LicenseValidateQueryResult = Apollo.QueryResult<
  LicenseValidateQuery,
  LicenseValidateQueryVariables
>;
export const LicenseUpdateDocument = gql`
  mutation licenseUpdate($key: String!) {
    licenseUpdate(key: $key) {
      ...ManageLicenseLicenseStatus
    }
  }
  ${ManageLicenseLicenseStatusFragmentDoc}
`;
export type LicenseUpdateMutationFn = Apollo.MutationFunction<
  LicenseUpdateMutation,
  LicenseUpdateMutationVariables
>;

/**
 * __useLicenseUpdateMutation__
 *
 * To run a mutation, you first call `useLicenseUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLicenseUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [licenseUpdateMutation, { data, loading, error }] = useLicenseUpdateMutation({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useLicenseUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LicenseUpdateMutation,
    LicenseUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LicenseUpdateMutation, LicenseUpdateMutationVariables>(
    LicenseUpdateDocument,
    options
  );
}
export type LicenseUpdateMutationHookResult = ReturnType<typeof useLicenseUpdateMutation>;
export type LicenseUpdateMutationResult = Apollo.MutationResult<LicenseUpdateMutation>;
export type LicenseUpdateMutationOptions = Apollo.BaseMutationOptions<
  LicenseUpdateMutation,
  LicenseUpdateMutationVariables
>;
