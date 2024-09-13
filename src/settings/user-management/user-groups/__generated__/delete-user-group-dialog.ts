import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserGroupDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type UserGroupDeleteMutation = {
  __typename?: "Mutation";
  pdUserGroupDelete?: boolean | null;
};

export const UserGroupDeleteDocument = gql`
  mutation userGroupDelete($id: ID!) {
    pdUserGroupDelete(id: $id)
  }
`;
export type UserGroupDeleteMutationFn = Apollo.MutationFunction<
  UserGroupDeleteMutation,
  UserGroupDeleteMutationVariables
>;

/**
 * __useUserGroupDeleteMutation__
 *
 * To run a mutation, you first call `useUserGroupDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserGroupDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userGroupDeleteMutation, { data, loading, error }] = useUserGroupDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserGroupDeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserGroupDeleteMutation,
    UserGroupDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserGroupDeleteMutation, UserGroupDeleteMutationVariables>(
    UserGroupDeleteDocument,
    options
  );
}
export type UserGroupDeleteMutationHookResult = ReturnType<
  typeof useUserGroupDeleteMutation
>;
export type UserGroupDeleteMutationResult =
  Apollo.MutationResult<UserGroupDeleteMutation>;
export type UserGroupDeleteMutationOptions = Apollo.BaseMutationOptions<
  UserGroupDeleteMutation,
  UserGroupDeleteMutationVariables
>;
