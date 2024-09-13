import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { UserGroupFragmentDoc } from "../../__generated__/user-groups";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ManageUserGroupVodUserFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
  accessLevel: Types.OrgAccessLevel;
  accessList: Array<{
    __typename?: "UserAppAccess";
    app: { __typename?: "Application"; id: string };
  }>;
  pdUserGroup?: { __typename?: "PdUserGroup"; id: string } | null;
  pdHostMappings?: Array<{
    __typename?: "PdHostMapping";
    id: string;
    siteId: string;
    nativeHostId: string;
  }> | null;
};

export type ManageUserGroupNativeHostFragment = {
  __typename?: "PdNativeHost";
  nativeHostId: string;
  firstName: string;
  lastName: string;
  siteId: string;
};

export type UsersQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  vodUsers?: Array<{
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    accessLevel: Types.OrgAccessLevel;
    accessList: Array<{
      __typename?: "UserAppAccess";
      app: { __typename?: "Application"; id: string };
    }>;
    pdUserGroup?: { __typename?: "PdUserGroup"; id: string } | null;
    pdHostMappings?: Array<{
      __typename?: "PdHostMapping";
      id: string;
      siteId: string;
      nativeHostId: string;
    }> | null;
  }> | null;
  unmappedNativeHosts: Array<{
    __typename?: "PdNativeHost";
    nativeHostId: string;
    firstName: string;
    lastName: string;
    siteId: string;
  }>;
};

export type ManageUserGroupUserGroupFragment = {
  __typename?: "PdUserGroup";
  id: string;
  name: string;
  guestInteractionType?: Types.PdGuestInteractionType | null;
  excludeFromReports: boolean;
  members: Array<{
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    pdHostMappings?: Array<{ __typename?: "PdHostMapping"; id: string }> | null;
  }>;
};

export type UserGroupQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type UserGroupQuery = {
  __typename?: "Query";
  userGroup?: {
    __typename?: "PdUserGroup";
    id: string;
    name: string;
    guestInteractionType?: Types.PdGuestInteractionType | null;
    excludeFromReports: boolean;
    members: Array<{
      __typename?: "User";
      id: string;
      firstName: string;
      lastName: string;
      pdHostMappings?: Array<{ __typename?: "PdHostMapping"; id: string }> | null;
    }>;
  } | null;
};

export type UserGroupsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UserGroupsQuery = {
  __typename?: "Query";
  userGroups: Array<{ __typename?: "PdUserGroup"; id: string; name: string }>;
};

export type UserGroupCreateMutationVariables = Types.Exact<{
  input: Types.PdUserGroupCreateInput;
}>;

export type UserGroupCreateMutation = {
  __typename?: "Mutation";
  pdUserGroupCreate?: {
    __typename?: "PdUserGroup";
    id: string;
    name: string;
    guestInteractionType?: Types.PdGuestInteractionType | null;
    excludeFromReports: boolean;
    members: Array<{
      __typename?: "User";
      id: string;
      firstName: string;
      lastName: string;
    }>;
    usedByRules: Array<{ __typename?: "PdGreetRule"; id: string; name: string }>;
  } | null;
};

export type UserGroupUpdateMutationVariables = Types.Exact<{
  input: Types.PdUserGroupUpdateInput;
}>;

export type UserGroupUpdateMutation = {
  __typename?: "Mutation";
  pdUserGroupUpdate?: {
    __typename?: "PdUserGroup";
    id: string;
    name: string;
    guestInteractionType?: Types.PdGuestInteractionType | null;
    excludeFromReports: boolean;
    members: Array<{
      __typename?: "User";
      id: string;
      firstName: string;
      lastName: string;
    }>;
    usedByRules: Array<{ __typename?: "PdGreetRule"; id: string; name: string }>;
  } | null;
};

export const ManageUserGroupVodUserFragmentDoc = gql`
  fragment ManageUserGroupVodUser on User {
    id
    firstName
    lastName
    accessLevel
    accessList {
      app {
        id
      }
    }
    pdUserGroup {
      id
    }
    pdHostMappings {
      id
      siteId
      nativeHostId
    }
  }
`;
export const ManageUserGroupNativeHostFragmentDoc = gql`
  fragment ManageUserGroupNativeHost on PdNativeHost {
    nativeHostId
    firstName
    lastName
    siteId
  }
`;
export const ManageUserGroupUserGroupFragmentDoc = gql`
  fragment ManageUserGroupUserGroup on PdUserGroup {
    id
    name
    guestInteractionType
    excludeFromReports
    members {
      id
      firstName
      lastName
      pdHostMappings {
        id
      }
    }
  }
`;
export const UsersDocument = gql`
  query users {
    vodUsers: users {
      ...ManageUserGroupVodUser
    }
    unmappedNativeHosts: pdNativeHosts {
      ...ManageUserGroupNativeHost
    }
  }
  ${ManageUserGroupVodUserFragmentDoc}
  ${ManageUserGroupNativeHostFragmentDoc}
`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export function useUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export function useUsersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserGroupDocument = gql`
  query userGroup($id: ID!) {
    userGroup: pdUserGroup(id: $id) {
      ...ManageUserGroupUserGroup
    }
  }
  ${ManageUserGroupUserGroupFragmentDoc}
`;

/**
 * __useUserGroupQuery__
 *
 * To run a query within a React component, call `useUserGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserGroupQuery(
  baseOptions: Apollo.QueryHookOptions<UserGroupQuery, UserGroupQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserGroupQuery, UserGroupQueryVariables>(
    UserGroupDocument,
    options
  );
}
export function useUserGroupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserGroupQuery, UserGroupQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserGroupQuery, UserGroupQueryVariables>(
    UserGroupDocument,
    options
  );
}
export function useUserGroupSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<UserGroupQuery, UserGroupQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<UserGroupQuery, UserGroupQueryVariables>(
    UserGroupDocument,
    options
  );
}
export type UserGroupQueryHookResult = ReturnType<typeof useUserGroupQuery>;
export type UserGroupLazyQueryHookResult = ReturnType<typeof useUserGroupLazyQuery>;
export type UserGroupSuspenseQueryHookResult = ReturnType<
  typeof useUserGroupSuspenseQuery
>;
export type UserGroupQueryResult = Apollo.QueryResult<
  UserGroupQuery,
  UserGroupQueryVariables
>;
export const UserGroupsDocument = gql`
  query userGroups {
    userGroups: pdUserGroups {
      id
      name
    }
  }
`;

/**
 * __useUserGroupsQuery__
 *
 * To run a query within a React component, call `useUserGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserGroupsQuery(
  baseOptions?: Apollo.QueryHookOptions<UserGroupsQuery, UserGroupsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserGroupsQuery, UserGroupsQueryVariables>(
    UserGroupsDocument,
    options
  );
}
export function useUserGroupsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserGroupsQuery, UserGroupsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserGroupsQuery, UserGroupsQueryVariables>(
    UserGroupsDocument,
    options
  );
}
export function useUserGroupsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<UserGroupsQuery, UserGroupsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<UserGroupsQuery, UserGroupsQueryVariables>(
    UserGroupsDocument,
    options
  );
}
export type UserGroupsQueryHookResult = ReturnType<typeof useUserGroupsQuery>;
export type UserGroupsLazyQueryHookResult = ReturnType<typeof useUserGroupsLazyQuery>;
export type UserGroupsSuspenseQueryHookResult = ReturnType<
  typeof useUserGroupsSuspenseQuery
>;
export type UserGroupsQueryResult = Apollo.QueryResult<
  UserGroupsQuery,
  UserGroupsQueryVariables
>;
export const UserGroupCreateDocument = gql`
  mutation userGroupCreate($input: PdUserGroupCreateInput!) {
    pdUserGroupCreate(input: $input) {
      ...UserGroup
    }
  }
  ${UserGroupFragmentDoc}
`;
export type UserGroupCreateMutationFn = Apollo.MutationFunction<
  UserGroupCreateMutation,
  UserGroupCreateMutationVariables
>;

/**
 * __useUserGroupCreateMutation__
 *
 * To run a mutation, you first call `useUserGroupCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserGroupCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userGroupCreateMutation, { data, loading, error }] = useUserGroupCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserGroupCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserGroupCreateMutation,
    UserGroupCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserGroupCreateMutation, UserGroupCreateMutationVariables>(
    UserGroupCreateDocument,
    options
  );
}
export type UserGroupCreateMutationHookResult = ReturnType<
  typeof useUserGroupCreateMutation
>;
export type UserGroupCreateMutationResult =
  Apollo.MutationResult<UserGroupCreateMutation>;
export type UserGroupCreateMutationOptions = Apollo.BaseMutationOptions<
  UserGroupCreateMutation,
  UserGroupCreateMutationVariables
>;
export const UserGroupUpdateDocument = gql`
  mutation userGroupUpdate($input: PdUserGroupUpdateInput!) {
    pdUserGroupUpdate(input: $input) {
      ...UserGroup
    }
  }
  ${UserGroupFragmentDoc}
`;
export type UserGroupUpdateMutationFn = Apollo.MutationFunction<
  UserGroupUpdateMutation,
  UserGroupUpdateMutationVariables
>;

/**
 * __useUserGroupUpdateMutation__
 *
 * To run a mutation, you first call `useUserGroupUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserGroupUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userGroupUpdateMutation, { data, loading, error }] = useUserGroupUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserGroupUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserGroupUpdateMutation,
    UserGroupUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserGroupUpdateMutation, UserGroupUpdateMutationVariables>(
    UserGroupUpdateDocument,
    options
  );
}
export type UserGroupUpdateMutationHookResult = ReturnType<
  typeof useUserGroupUpdateMutation
>;
export type UserGroupUpdateMutationResult =
  Apollo.MutationResult<UserGroupUpdateMutation>;
export type UserGroupUpdateMutationOptions = Apollo.BaseMutationOptions<
  UserGroupUpdateMutation,
  UserGroupUpdateMutationVariables
>;
