import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserGroupMemberFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
};

export type UserGroupFragment = {
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
};

export type UserGroupsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UserGroupsQuery = {
  __typename?: "Query";
  pdUserGroups: Array<{
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
  }>;
};

export const UserGroupMemberFragmentDoc = gql`
  fragment UserGroupMember on User {
    id
    firstName
    lastName
  }
`;
export const UserGroupFragmentDoc = gql`
  fragment UserGroup on PdUserGroup {
    id
    name
    guestInteractionType
    excludeFromReports
    members {
      ...UserGroupMember
    }
    usedByRules {
      id
      name
    }
  }
  ${UserGroupMemberFragmentDoc}
`;
export const UserGroupsDocument = gql`
  query userGroups {
    pdUserGroups {
      ...UserGroup
    }
  }
  ${UserGroupFragmentDoc}
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
