import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { SubBuilderSubPlanFragmentDoc } from "../../../../view-v2/subscription/add-subscription/__generated__/subscription-builder";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type OrgsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type OrgsQuery = {
  __typename?: "Query";
  orgs: Array<{
    __typename?: "Org";
    id: string;
    company?: { __typename?: "Company"; id: string; name: string } | null;
  }>;
};

export type SubscriptionPlansQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SubscriptionPlansQuery = {
  __typename?: "Query";
  subscriptionPlans: Array<{
    __typename?: "SubscriptionPlan";
    id: string;
    appId?: Types.AppId | null;
    appName?: string | null;
    icon?: string | null;
    isOnprem?: boolean | null;
    package?: string | null;
    billingInterval: Types.BillingInterval;
  }>;
};

export type OrgCreateMutationVariables = Types.Exact<{
  input: Types.OrgCreateInput;
}>;

export type OrgCreateMutation = {
  __typename?: "Mutation";
  orgCreate?: {
    __typename?: "Org";
    id: string;
    company?: { __typename?: "Company"; id: string; name: string } | null;
  } | null;
};

export type SubscriptionCreateV2MutationVariables = Types.Exact<{
  orgId: Types.Scalars["ID"]["input"];
  subscriptions: Array<Types.SubscriptionCreateInput> | Types.SubscriptionCreateInput;
}>;

export type SubscriptionCreateV2Mutation = {
  __typename?: "Mutation";
  subscriptionCreateV2: Array<{ __typename?: "AppSubscription"; id: string }>;
};

export const OrgsDocument = gql`
  query Orgs {
    orgs {
      id
      company {
        id
        name
      }
    }
  }
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
export const SubscriptionPlansDocument = gql`
  query SubscriptionPlans {
    subscriptionPlans {
      ...SubBuilderSubPlan
    }
  }
  ${SubBuilderSubPlanFragmentDoc}
`;

/**
 * __useSubscriptionPlansQuery__
 *
 * To run a query within a React component, call `useSubscriptionPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionPlansQuery({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionPlansQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export function useSubscriptionPlansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export function useSubscriptionPlansSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export type SubscriptionPlansQueryHookResult = ReturnType<
  typeof useSubscriptionPlansQuery
>;
export type SubscriptionPlansLazyQueryHookResult = ReturnType<
  typeof useSubscriptionPlansLazyQuery
>;
export type SubscriptionPlansSuspenseQueryHookResult = ReturnType<
  typeof useSubscriptionPlansSuspenseQuery
>;
export type SubscriptionPlansQueryResult = Apollo.QueryResult<
  SubscriptionPlansQuery,
  SubscriptionPlansQueryVariables
>;
export const OrgCreateDocument = gql`
  mutation OrgCreate($input: OrgCreateInput!) {
    orgCreate(input: $input) {
      id
      company {
        id
        name
      }
    }
  }
`;
export type OrgCreateMutationFn = Apollo.MutationFunction<
  OrgCreateMutation,
  OrgCreateMutationVariables
>;

/**
 * __useOrgCreateMutation__
 *
 * To run a mutation, you first call `useOrgCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgCreateMutation, { data, loading, error }] = useOrgCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<OrgCreateMutation, OrgCreateMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OrgCreateMutation, OrgCreateMutationVariables>(
    OrgCreateDocument,
    options
  );
}
export type OrgCreateMutationHookResult = ReturnType<typeof useOrgCreateMutation>;
export type OrgCreateMutationResult = Apollo.MutationResult<OrgCreateMutation>;
export type OrgCreateMutationOptions = Apollo.BaseMutationOptions<
  OrgCreateMutation,
  OrgCreateMutationVariables
>;
export const SubscriptionCreateV2Document = gql`
  mutation subscriptionCreateV2(
    $orgId: ID!
    $subscriptions: [SubscriptionCreateInput!]!
  ) {
    subscriptionCreateV2(orgId: $orgId, subscriptions: $subscriptions) {
      id
    }
  }
`;
export type SubscriptionCreateV2MutationFn = Apollo.MutationFunction<
  SubscriptionCreateV2Mutation,
  SubscriptionCreateV2MutationVariables
>;

/**
 * __useSubscriptionCreateV2Mutation__
 *
 * To run a mutation, you first call `useSubscriptionCreateV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionCreateV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscriptionCreateV2Mutation, { data, loading, error }] = useSubscriptionCreateV2Mutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      subscriptions: // value for 'subscriptions'
 *   },
 * });
 */
export function useSubscriptionCreateV2Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubscriptionCreateV2Mutation,
    SubscriptionCreateV2MutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubscriptionCreateV2Mutation,
    SubscriptionCreateV2MutationVariables
  >(SubscriptionCreateV2Document, options);
}
export type SubscriptionCreateV2MutationHookResult = ReturnType<
  typeof useSubscriptionCreateV2Mutation
>;
export type SubscriptionCreateV2MutationResult =
  Apollo.MutationResult<SubscriptionCreateV2Mutation>;
export type SubscriptionCreateV2MutationOptions = Apollo.BaseMutationOptions<
  SubscriptionCreateV2Mutation,
  SubscriptionCreateV2MutationVariables
>;
