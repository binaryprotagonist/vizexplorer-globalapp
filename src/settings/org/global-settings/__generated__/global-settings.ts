import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GlobalSettingsTimePeriodFragment = {
  __typename?: "PdTimePeriod";
  level: Types.PdTimePeriodLevel;
  count: number;
  enabled: boolean;
  default: boolean;
};

export type GlobalSettingsFragment = {
  __typename?: "PdOrgSettings";
  id: string;
  worthPercentage: number;
  guestTimePeriods: Array<{
    __typename?: "PdTimePeriod";
    level: Types.PdTimePeriodLevel;
    count: number;
    enabled: boolean;
    default: boolean;
  }>;
  hostTimePeriods: Array<{
    __typename?: "PdTimePeriod";
    level: Types.PdTimePeriodLevel;
    count: number;
    enabled: boolean;
    default: boolean;
  }>;
};

export type GlobalSettingsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GlobalSettingsQuery = {
  __typename?: "Query";
  pdOrgSettings?: {
    __typename?: "PdOrgSettings";
    id: string;
    worthPercentage: number;
    guestTimePeriods: Array<{
      __typename?: "PdTimePeriod";
      level: Types.PdTimePeriodLevel;
      count: number;
      enabled: boolean;
      default: boolean;
    }>;
    hostTimePeriods: Array<{
      __typename?: "PdTimePeriod";
      level: Types.PdTimePeriodLevel;
      count: number;
      enabled: boolean;
      default: boolean;
    }>;
  } | null;
};

export type GlobalSettingsUpdateMutationVariables = Types.Exact<{
  input: Types.PdOrgSettingsInput;
}>;

export type GlobalSettingsUpdateMutation = {
  __typename?: "Mutation";
  pdOrgSettingsUpdate?: {
    __typename?: "PdOrgSettings";
    id: string;
    worthPercentage: number;
    guestTimePeriods: Array<{
      __typename?: "PdTimePeriod";
      level: Types.PdTimePeriodLevel;
      count: number;
      enabled: boolean;
      default: boolean;
    }>;
    hostTimePeriods: Array<{
      __typename?: "PdTimePeriod";
      level: Types.PdTimePeriodLevel;
      count: number;
      enabled: boolean;
      default: boolean;
    }>;
  } | null;
};

export const GlobalSettingsTimePeriodFragmentDoc = gql`
  fragment GlobalSettingsTimePeriod on PdTimePeriod {
    level
    count
    enabled
    default
  }
`;
export const GlobalSettingsFragmentDoc = gql`
  fragment GlobalSettings on PdOrgSettings {
    id
    worthPercentage
    guestTimePeriods {
      ...GlobalSettingsTimePeriod
    }
    hostTimePeriods {
      ...GlobalSettingsTimePeriod
    }
  }
  ${GlobalSettingsTimePeriodFragmentDoc}
`;
export const GlobalSettingsDocument = gql`
  query globalSettings {
    pdOrgSettings {
      ...GlobalSettings
    }
  }
  ${GlobalSettingsFragmentDoc}
`;

/**
 * __useGlobalSettingsQuery__
 *
 * To run a query within a React component, call `useGlobalSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGlobalSettingsQuery(
  baseOptions?: Apollo.QueryHookOptions<GlobalSettingsQuery, GlobalSettingsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GlobalSettingsQuery, GlobalSettingsQueryVariables>(
    GlobalSettingsDocument,
    options
  );
}
export function useGlobalSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GlobalSettingsQuery,
    GlobalSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GlobalSettingsQuery, GlobalSettingsQueryVariables>(
    GlobalSettingsDocument,
    options
  );
}
export function useGlobalSettingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GlobalSettingsQuery,
    GlobalSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GlobalSettingsQuery, GlobalSettingsQueryVariables>(
    GlobalSettingsDocument,
    options
  );
}
export type GlobalSettingsQueryHookResult = ReturnType<typeof useGlobalSettingsQuery>;
export type GlobalSettingsLazyQueryHookResult = ReturnType<
  typeof useGlobalSettingsLazyQuery
>;
export type GlobalSettingsSuspenseQueryHookResult = ReturnType<
  typeof useGlobalSettingsSuspenseQuery
>;
export type GlobalSettingsQueryResult = Apollo.QueryResult<
  GlobalSettingsQuery,
  GlobalSettingsQueryVariables
>;
export const GlobalSettingsUpdateDocument = gql`
  mutation globalSettingsUpdate($input: PdOrgSettingsInput!) {
    pdOrgSettingsUpdate(input: $input) {
      id
      ...GlobalSettings
    }
  }
  ${GlobalSettingsFragmentDoc}
`;
export type GlobalSettingsUpdateMutationFn = Apollo.MutationFunction<
  GlobalSettingsUpdateMutation,
  GlobalSettingsUpdateMutationVariables
>;

/**
 * __useGlobalSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useGlobalSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGlobalSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [globalSettingsUpdateMutation, { data, loading, error }] = useGlobalSettingsUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGlobalSettingsUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GlobalSettingsUpdateMutation,
    GlobalSettingsUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GlobalSettingsUpdateMutation,
    GlobalSettingsUpdateMutationVariables
  >(GlobalSettingsUpdateDocument, options);
}
export type GlobalSettingsUpdateMutationHookResult = ReturnType<
  typeof useGlobalSettingsUpdateMutation
>;
export type GlobalSettingsUpdateMutationResult =
  Apollo.MutationResult<GlobalSettingsUpdateMutation>;
export type GlobalSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<
  GlobalSettingsUpdateMutation,
  GlobalSettingsUpdateMutationVariables
>;
