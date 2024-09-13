import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type HostMappingFragment = {
  __typename?: "PdHostMapping";
  id: string;
  siteId: string;
  nativeHostId: string;
};

export type HostMappingUsersFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accessLevel: Types.OrgAccessLevel;
  accessList: Array<{
    __typename?: "UserAppAccess";
    app: { __typename?: "Application"; id: string };
    site: { __typename?: "Site"; id: string };
    role: { __typename?: "AppRole"; id: string };
  }>;
  pdHostMappings?: Array<{
    __typename?: "PdHostMapping";
    id: string;
    siteId: string;
    nativeHostId: string;
  }> | null;
};

export type UsersNativeHostMappingQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UsersNativeHostMappingQuery = {
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
      app: { __typename?: "Application"; id: string };
      site: { __typename?: "Site"; id: string };
      role: { __typename?: "AppRole"; id: string };
    }>;
    pdHostMappings?: Array<{
      __typename?: "PdHostMapping";
      id: string;
      siteId: string;
      nativeHostId: string;
    }> | null;
  }> | null;
};

export type HostMappingSiteFragment = { __typename?: "Site"; name: string; id: string };

export type GetSitesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSitesQuery = {
  __typename?: "Query";
  sites?: Array<{ __typename?: "Site"; name: string; id: string }> | null;
};

export const HostMappingFragmentDoc = gql`
  fragment HostMapping on PdHostMapping {
    id
    siteId
    nativeHostId
  }
`;
export const HostMappingUsersFragmentDoc = gql`
  fragment HostMappingUsers on User {
    id
    firstName
    lastName
    email
    phone
    accessLevel
    accessList {
      app {
        id
      }
      site {
        id: idV2
      }
      role {
        id
      }
    }
    pdHostMappings {
      ...HostMapping
    }
  }
  ${HostMappingFragmentDoc}
`;
export const HostMappingSiteFragmentDoc = gql`
  fragment HostMappingSite on Site {
    id: idV2
    name
  }
`;
export const UsersNativeHostMappingDocument = gql`
  query usersNativeHostMapping {
    users {
      ...HostMappingUsers
    }
  }
  ${HostMappingUsersFragmentDoc}
`;

/**
 * __useUsersNativeHostMappingQuery__
 *
 * To run a query within a React component, call `useUsersNativeHostMappingQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersNativeHostMappingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersNativeHostMappingQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersNativeHostMappingQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >(UsersNativeHostMappingDocument, options);
}
export function useUsersNativeHostMappingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >(UsersNativeHostMappingDocument, options);
}
export function useUsersNativeHostMappingSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UsersNativeHostMappingQuery,
    UsersNativeHostMappingQueryVariables
  >(UsersNativeHostMappingDocument, options);
}
export type UsersNativeHostMappingQueryHookResult = ReturnType<
  typeof useUsersNativeHostMappingQuery
>;
export type UsersNativeHostMappingLazyQueryHookResult = ReturnType<
  typeof useUsersNativeHostMappingLazyQuery
>;
export type UsersNativeHostMappingSuspenseQueryHookResult = ReturnType<
  typeof useUsersNativeHostMappingSuspenseQuery
>;
export type UsersNativeHostMappingQueryResult = Apollo.QueryResult<
  UsersNativeHostMappingQuery,
  UsersNativeHostMappingQueryVariables
>;
export const GetSitesDocument = gql`
  query getSites {
    sites {
      ...HostMappingSite
    }
  }
  ${HostMappingSiteFragmentDoc}
`;

/**
 * __useGetSitesQuery__
 *
 * To run a query within a React component, call `useGetSitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSitesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export function useGetSitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export function useGetSitesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export type GetSitesQueryHookResult = ReturnType<typeof useGetSitesQuery>;
export type GetSitesLazyQueryHookResult = ReturnType<typeof useGetSitesLazyQuery>;
export type GetSitesSuspenseQueryHookResult = ReturnType<typeof useGetSitesSuspenseQuery>;
export type GetSitesQueryResult = Apollo.QueryResult<
  GetSitesQuery,
  GetSitesQueryVariables
>;
