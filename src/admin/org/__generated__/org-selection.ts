import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type OrgSummaryFragment = {
  __typename?: "Org";
  id: string;
  company?: { __typename?: "Company"; id: string; name: string; email: string } | null;
};

export type OrgsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type OrgsQuery = {
  __typename?: "Query";
  orgs: Array<{
    __typename?: "Org";
    id: string;
    company?: { __typename?: "Company"; id: string; name: string; email: string } | null;
  }>;
};

export type DeliveryMethodQueryVariables = Types.Exact<{ [key: string]: never }>;

export type DeliveryMethodQuery = {
  __typename?: "Query";
  discovery: {
    __typename?: "Discovery";
    env?: { __typename?: "Env"; onPrem?: boolean | null } | null;
  };
};

export type OrgSearchQueryVariables = Types.Exact<{
  query: Types.Scalars["String"]["input"];
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
}>;

export type OrgSearchQuery = {
  __typename?: "Query";
  orgSearch?: Array<{
    __typename?: "Org";
    id: string;
    company?: { __typename?: "Company"; id: string; name: string; email: string } | null;
  }> | null;
};

export const OrgSummaryFragmentDoc = gql`
  fragment OrgSummary on Org {
    id
    company {
      id
      name
      email
    }
  }
`;
export const OrgsDocument = gql`
  query orgs {
    orgs {
      ...OrgSummary
    }
  }
  ${OrgSummaryFragmentDoc}
`;

/**
 * __useOrgsQuery__
 *
 * To run a query within a React component, call `useOrgsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgsQuery(
  baseOptions?: Apollo.QueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options);
}
export function useOrgsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options);
}
export function useOrgsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options);
}
export type OrgsQueryHookResult = ReturnType<typeof useOrgsQuery>;
export type OrgsLazyQueryHookResult = ReturnType<typeof useOrgsLazyQuery>;
export type OrgsSuspenseQueryHookResult = ReturnType<typeof useOrgsSuspenseQuery>;
export type OrgsQueryResult = Apollo.QueryResult<OrgsQuery, OrgsQueryVariables>;
export const DeliveryMethodDocument = gql`
  query deliveryMethod {
    discovery {
      env {
        onPrem
      }
    }
  }
`;

/**
 * __useDeliveryMethodQuery__
 *
 * To run a query within a React component, call `useDeliveryMethodQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeliveryMethodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeliveryMethodQuery({
 *   variables: {
 *   },
 * });
 */
export function useDeliveryMethodQuery(
  baseOptions?: Apollo.QueryHookOptions<DeliveryMethodQuery, DeliveryMethodQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DeliveryMethodQuery, DeliveryMethodQueryVariables>(
    DeliveryMethodDocument,
    options
  );
}
export function useDeliveryMethodLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DeliveryMethodQuery,
    DeliveryMethodQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DeliveryMethodQuery, DeliveryMethodQueryVariables>(
    DeliveryMethodDocument,
    options
  );
}
export function useDeliveryMethodSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DeliveryMethodQuery,
    DeliveryMethodQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<DeliveryMethodQuery, DeliveryMethodQueryVariables>(
    DeliveryMethodDocument,
    options
  );
}
export type DeliveryMethodQueryHookResult = ReturnType<typeof useDeliveryMethodQuery>;
export type DeliveryMethodLazyQueryHookResult = ReturnType<
  typeof useDeliveryMethodLazyQuery
>;
export type DeliveryMethodSuspenseQueryHookResult = ReturnType<
  typeof useDeliveryMethodSuspenseQuery
>;
export type DeliveryMethodQueryResult = Apollo.QueryResult<
  DeliveryMethodQuery,
  DeliveryMethodQueryVariables
>;
export const OrgSearchDocument = gql`
  query orgSearch($query: String!, $limit: Int) {
    orgSearch(query: $query, limit: $limit) {
      ...OrgSummary
    }
  }
  ${OrgSummaryFragmentDoc}
`;

/**
 * __useOrgSearchQuery__
 *
 * To run a query within a React component, call `useOrgSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useOrgSearchQuery(
  baseOptions: Apollo.QueryHookOptions<OrgSearchQuery, OrgSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgSearchQuery, OrgSearchQueryVariables>(
    OrgSearchDocument,
    options
  );
}
export function useOrgSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OrgSearchQuery, OrgSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgSearchQuery, OrgSearchQueryVariables>(
    OrgSearchDocument,
    options
  );
}
export function useOrgSearchSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<OrgSearchQuery, OrgSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgSearchQuery, OrgSearchQueryVariables>(
    OrgSearchDocument,
    options
  );
}
export type OrgSearchQueryHookResult = ReturnType<typeof useOrgSearchQuery>;
export type OrgSearchLazyQueryHookResult = ReturnType<typeof useOrgSearchLazyQuery>;
export type OrgSearchSuspenseQueryHookResult = ReturnType<
  typeof useOrgSearchSuspenseQuery
>;
export type OrgSearchQueryResult = Apollo.QueryResult<
  OrgSearchQuery,
  OrgSearchQueryVariables
>;
