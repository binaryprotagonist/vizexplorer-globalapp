import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { UserManagementUserFragmentDoc } from "../../__generated__/users";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ManageUserAccessAppFragment = {
  __typename?: "Application";
  id: string;
  name: string;
  status: { __typename?: "Status"; isValid: boolean };
  roles: Array<{ __typename?: "AppRole"; id: string; name: string }>;
};

export type ManageUserAccessSiteFragment = {
  __typename?: "Site";
  name: string;
  id: string;
};

export type UserAccessRowOptionsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UserAccessRowOptionsQuery = {
  __typename?: "Query";
  applications: Array<{
    __typename?: "Application";
    id: string;
    name: string;
    status: { __typename?: "Status"; isValid: boolean };
    roles: Array<{ __typename?: "AppRole"; id: string; name: string }>;
  }>;
  sites?: Array<{ __typename?: "Site"; name: string; id: string }> | null;
};

export type UsersQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  users?: Array<{
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    accessLevel: Types.OrgAccessLevel;
  }> | null;
};

export type UserCreateV2MutationVariables = Types.Exact<{
  input: Types.NewUserInputV2;
}>;

export type UserCreateV2Mutation = {
  __typename?: "Mutation";
  userCreateV2?: {
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accessLevel: Types.OrgAccessLevel;
    accessList: Array<{
      __typename?: "UserAppAccess";
      app: { __typename?: "Application"; id: string; name: string };
      role: { __typename?: "AppRole"; id: string; name: string };
      site: { __typename?: "Site"; name: string; id: string };
    }>;
    pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    pdHostMappings?: Array<{
      __typename?: "PdHostMapping";
      id: string;
      nativeHostId: string;
    }> | null;
  } | null;
};

export type UserUpdateMutationVariables = Types.Exact<{
  input: Types.UserProfileInput;
}>;

export type UserUpdateMutation = {
  __typename?: "Mutation";
  userUpdate?: {
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accessLevel: Types.OrgAccessLevel;
    accessList: Array<{
      __typename?: "UserAppAccess";
      app: { __typename?: "Application"; id: string; name: string };
      role: { __typename?: "AppRole"; id: string; name: string };
      site: { __typename?: "Site"; name: string; id: string };
    }>;
    pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    pdHostMappings?: Array<{
      __typename?: "PdHostMapping";
      id: string;
      nativeHostId: string;
    }> | null;
  } | null;
};

export const ManageUserAccessAppFragmentDoc = gql`
  fragment ManageUserAccessApp on Application {
    id
    name
    status {
      isValid
    }
    roles {
      id
      name
    }
  }
`;
export const ManageUserAccessSiteFragmentDoc = gql`
  fragment ManageUserAccessSite on Site {
    id: idV2
    name
  }
`;
export const UserAccessRowOptionsDocument = gql`
  query userAccessRowOptions {
    applications {
      ...ManageUserAccessApp
    }
    sites {
      ...ManageUserAccessSite
    }
  }
  ${ManageUserAccessAppFragmentDoc}
  ${ManageUserAccessSiteFragmentDoc}
`;

/**
 * __useUserAccessRowOptionsQuery__
 *
 * To run a query within a React component, call `useUserAccessRowOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAccessRowOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAccessRowOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserAccessRowOptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserAccessRowOptionsQuery,
    UserAccessRowOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserAccessRowOptionsQuery, UserAccessRowOptionsQueryVariables>(
    UserAccessRowOptionsDocument,
    options
  );
}
export function useUserAccessRowOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserAccessRowOptionsQuery,
    UserAccessRowOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserAccessRowOptionsQuery,
    UserAccessRowOptionsQueryVariables
  >(UserAccessRowOptionsDocument, options);
}
export function useUserAccessRowOptionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    UserAccessRowOptionsQuery,
    UserAccessRowOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UserAccessRowOptionsQuery,
    UserAccessRowOptionsQueryVariables
  >(UserAccessRowOptionsDocument, options);
}
export type UserAccessRowOptionsQueryHookResult = ReturnType<
  typeof useUserAccessRowOptionsQuery
>;
export type UserAccessRowOptionsLazyQueryHookResult = ReturnType<
  typeof useUserAccessRowOptionsLazyQuery
>;
export type UserAccessRowOptionsSuspenseQueryHookResult = ReturnType<
  typeof useUserAccessRowOptionsSuspenseQuery
>;
export type UserAccessRowOptionsQueryResult = Apollo.QueryResult<
  UserAccessRowOptionsQuery,
  UserAccessRowOptionsQueryVariables
>;
export const UsersDocument = gql`
  query users {
    users {
      id
      firstName
      lastName
      accessLevel
    }
  }
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
export const UserCreateV2Document = gql`
  mutation userCreateV2($input: NewUserInputV2!) {
    userCreateV2(user: $input) {
      ...UserManagementUser
    }
  }
  ${UserManagementUserFragmentDoc}
`;
export type UserCreateV2MutationFn = Apollo.MutationFunction<
  UserCreateV2Mutation,
  UserCreateV2MutationVariables
>;

/**
 * __useUserCreateV2Mutation__
 *
 * To run a mutation, you first call `useUserCreateV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserCreateV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userCreateV2Mutation, { data, loading, error }] = useUserCreateV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserCreateV2Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserCreateV2Mutation,
    UserCreateV2MutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserCreateV2Mutation, UserCreateV2MutationVariables>(
    UserCreateV2Document,
    options
  );
}
export type UserCreateV2MutationHookResult = ReturnType<typeof useUserCreateV2Mutation>;
export type UserCreateV2MutationResult = Apollo.MutationResult<UserCreateV2Mutation>;
export type UserCreateV2MutationOptions = Apollo.BaseMutationOptions<
  UserCreateV2Mutation,
  UserCreateV2MutationVariables
>;
export const UserUpdateDocument = gql`
  mutation userUpdate($input: UserProfileInput!) {
    userUpdate(user: $input) {
      ...UserManagementUser
    }
  }
  ${UserManagementUserFragmentDoc}
`;
export type UserUpdateMutationFn = Apollo.MutationFunction<
  UserUpdateMutation,
  UserUpdateMutationVariables
>;

/**
 * __useUserUpdateMutation__
 *
 * To run a mutation, you first call `useUserUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateMutation, { data, loading, error }] = useUserUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserUpdateMutation,
    UserUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserUpdateMutation, UserUpdateMutationVariables>(
    UserUpdateDocument,
    options
  );
}
export type UserUpdateMutationHookResult = ReturnType<typeof useUserUpdateMutation>;
export type UserUpdateMutationResult = Apollo.MutationResult<UserUpdateMutation>;
export type UserUpdateMutationOptions = Apollo.BaseMutationOptions<
  UserUpdateMutation,
  UserUpdateMutationVariables
>;
