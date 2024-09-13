import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { MappingSelectNativeHostFragmentDoc } from "./host-code-select";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserMappingFragment = {
  __typename?: "PdHostMapping";
  id: string;
  siteId: string;
  nativeHost?: {
    __typename?: "PdNativeHost";
    nativeHostId: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type UserQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    pdHostMappings?: Array<{
      __typename?: "PdHostMapping";
      id: string;
      siteId: string;
      nativeHost?: {
        __typename?: "PdNativeHost";
        nativeHostId: string;
        firstName: string;
        lastName: string;
      } | null;
    }> | null;
  } | null;
};

export type SiteQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type SiteQuery = {
  __typename?: "Query";
  site?: { __typename?: "Site"; name: string; id: string } | null;
};

export type UnmappedNativeHostsQueryVariables = Types.Exact<{
  siteId: Types.Scalars["ID"]["input"];
}>;

export type UnmappedNativeHostsQuery = {
  __typename?: "Query";
  pdNativeHosts: Array<{
    __typename?: "PdNativeHost";
    nativeHostId: string;
    firstName: string;
    lastName: string;
  }>;
};

export type HostMappingUpdateMutationVariables = Types.Exact<{
  input: Types.PdHostMappingUpdateInput;
}>;

export type HostMappingUpdateMutation = {
  __typename?: "Mutation";
  pdHostMappingUpdate?: Array<{
    __typename?: "PdHostMapping";
    id: string;
    siteId: string;
    nativeHost?: {
      __typename?: "PdNativeHost";
      nativeHostId: string;
      firstName: string;
      lastName: string;
    } | null;
  }> | null;
};

export const UserMappingFragmentDoc = gql`
  fragment UserMapping on PdHostMapping {
    id
    siteId
    nativeHost {
      ...MappingSelectNativeHost
    }
  }
  ${MappingSelectNativeHostFragmentDoc}
`;
export const UserDocument = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      pdHostMappings {
        ...UserMapping
      }
    }
  }
  ${UserMappingFragmentDoc}
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const SiteDocument = gql`
  query site($id: ID!) {
    site(idV2: $id) {
      id: idV2
      name
    }
  }
`;

/**
 * __useSiteQuery__
 *
 * To run a query within a React component, call `useSiteQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSiteQuery(
  baseOptions: Apollo.QueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export function useSiteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export function useSiteSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SiteQuery, SiteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SiteQuery, SiteQueryVariables>(SiteDocument, options);
}
export type SiteQueryHookResult = ReturnType<typeof useSiteQuery>;
export type SiteLazyQueryHookResult = ReturnType<typeof useSiteLazyQuery>;
export type SiteSuspenseQueryHookResult = ReturnType<typeof useSiteSuspenseQuery>;
export type SiteQueryResult = Apollo.QueryResult<SiteQuery, SiteQueryVariables>;
export const UnmappedNativeHostsDocument = gql`
  query unmappedNativeHosts($siteId: ID!) {
    pdNativeHosts(siteId: $siteId) {
      ...MappingSelectNativeHost
    }
  }
  ${MappingSelectNativeHostFragmentDoc}
`;

/**
 * __useUnmappedNativeHostsQuery__
 *
 * To run a query within a React component, call `useUnmappedNativeHostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnmappedNativeHostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnmappedNativeHostsQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useUnmappedNativeHostsQuery(
  baseOptions: Apollo.QueryHookOptions<
    UnmappedNativeHostsQuery,
    UnmappedNativeHostsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UnmappedNativeHostsQuery, UnmappedNativeHostsQueryVariables>(
    UnmappedNativeHostsDocument,
    options
  );
}
export function useUnmappedNativeHostsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UnmappedNativeHostsQuery,
    UnmappedNativeHostsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UnmappedNativeHostsQuery, UnmappedNativeHostsQueryVariables>(
    UnmappedNativeHostsDocument,
    options
  );
}
export function useUnmappedNativeHostsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    UnmappedNativeHostsQuery,
    UnmappedNativeHostsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UnmappedNativeHostsQuery,
    UnmappedNativeHostsQueryVariables
  >(UnmappedNativeHostsDocument, options);
}
export type UnmappedNativeHostsQueryHookResult = ReturnType<
  typeof useUnmappedNativeHostsQuery
>;
export type UnmappedNativeHostsLazyQueryHookResult = ReturnType<
  typeof useUnmappedNativeHostsLazyQuery
>;
export type UnmappedNativeHostsSuspenseQueryHookResult = ReturnType<
  typeof useUnmappedNativeHostsSuspenseQuery
>;
export type UnmappedNativeHostsQueryResult = Apollo.QueryResult<
  UnmappedNativeHostsQuery,
  UnmappedNativeHostsQueryVariables
>;
export const HostMappingUpdateDocument = gql`
  mutation hostMappingUpdate($input: PdHostMappingUpdateInput!) {
    pdHostMappingUpdate(input: $input) {
      ...UserMapping
    }
  }
  ${UserMappingFragmentDoc}
`;
export type HostMappingUpdateMutationFn = Apollo.MutationFunction<
  HostMappingUpdateMutation,
  HostMappingUpdateMutationVariables
>;

/**
 * __useHostMappingUpdateMutation__
 *
 * To run a mutation, you first call `useHostMappingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHostMappingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hostMappingUpdateMutation, { data, loading, error }] = useHostMappingUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHostMappingUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HostMappingUpdateMutation,
    HostMappingUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    HostMappingUpdateMutation,
    HostMappingUpdateMutationVariables
  >(HostMappingUpdateDocument, options);
}
export type HostMappingUpdateMutationHookResult = ReturnType<
  typeof useHostMappingUpdateMutation
>;
export type HostMappingUpdateMutationResult =
  Apollo.MutationResult<HostMappingUpdateMutation>;
export type HostMappingUpdateMutationOptions = Apollo.BaseMutationOptions<
  HostMappingUpdateMutation,
  HostMappingUpdateMutationVariables
>;
