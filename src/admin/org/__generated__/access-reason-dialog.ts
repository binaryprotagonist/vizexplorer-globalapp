import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type ImpersonateOrgV2MutationVariables = Types.Exact<{
  orgId: Types.Scalars["ID"]["input"];
  reason: Types.Scalars["String"]["input"];
}>;

export type ImpersonateOrgV2Mutation = {
  __typename?: "Mutation";
  sudoImpersonateOrgV2?: string | null;
};

export const ImpersonateOrgV2Document = gql`
  mutation impersonateOrgV2($orgId: ID!, $reason: String!) {
    sudoImpersonateOrgV2(orgId: $orgId, reason: $reason)
  }
`;
export type ImpersonateOrgV2MutationFn = Apollo.MutationFunction<
  ImpersonateOrgV2Mutation,
  ImpersonateOrgV2MutationVariables
>;

/**
 * __useImpersonateOrgV2Mutation__
 *
 * To run a mutation, you first call `useImpersonateOrgV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImpersonateOrgV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [impersonateOrgV2Mutation, { data, loading, error }] = useImpersonateOrgV2Mutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useImpersonateOrgV2Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    ImpersonateOrgV2Mutation,
    ImpersonateOrgV2MutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ImpersonateOrgV2Mutation, ImpersonateOrgV2MutationVariables>(
    ImpersonateOrgV2Document,
    options
  );
}
export type ImpersonateOrgV2MutationHookResult = ReturnType<
  typeof useImpersonateOrgV2Mutation
>;
export type ImpersonateOrgV2MutationResult =
  Apollo.MutationResult<ImpersonateOrgV2Mutation>;
export type ImpersonateOrgV2MutationOptions = Apollo.BaseMutationOptions<
  ImpersonateOrgV2Mutation,
  ImpersonateOrgV2MutationVariables
>;
