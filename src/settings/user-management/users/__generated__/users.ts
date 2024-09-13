import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserManagementUserFragment = {
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
};

export type UserManagementUsersQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UserManagementUsersQuery = {
  __typename?: "Query";
  users?: Array<{
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
  }> | null;
};

export const UserManagementUserFragmentDoc = gql`
  fragment UserManagementUser on User {
    id
    firstName
    lastName
    email
    phone
    accessLevel
    accessList {
      app {
        id
        name
      }
      role {
        id
        name
      }
      site {
        id: idV2
        name
      }
    }
    pdUserGroup {
      id
      name
    }
    pdHostMappings {
      id
      nativeHostId
    }
  }
`;
export const UserManagementUsersDocument = gql`
  query userManagementUsers {
    users {
      ...UserManagementUser
    }
  }
  ${UserManagementUserFragmentDoc}
`;

/**
 * __useUserManagementUsersQuery__
 *
 * To run a query within a React component, call `useUserManagementUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserManagementUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserManagementUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserManagementUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserManagementUsersQuery,
    UserManagementUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserManagementUsersQuery, UserManagementUsersQueryVariables>(
    UserManagementUsersDocument,
    options
  );
}
export function useUserManagementUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserManagementUsersQuery,
    UserManagementUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserManagementUsersQuery, UserManagementUsersQueryVariables>(
    UserManagementUsersDocument,
    options
  );
}
export function useUserManagementUsersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    UserManagementUsersQuery,
    UserManagementUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UserManagementUsersQuery,
    UserManagementUsersQueryVariables
  >(UserManagementUsersDocument, options);
}
export type UserManagementUsersQueryHookResult = ReturnType<
  typeof useUserManagementUsersQuery
>;
export type UserManagementUsersLazyQueryHookResult = ReturnType<
  typeof useUserManagementUsersLazyQuery
>;
export type UserManagementUsersSuspenseQueryHookResult = ReturnType<
  typeof useUserManagementUsersSuspenseQuery
>;
export type UserManagementUsersQueryResult = Apollo.QueryResult<
  UserManagementUsersQuery,
  UserManagementUsersQueryVariables
>;
