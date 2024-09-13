import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type UserDeleteMutation = { __typename?: "Mutation"; userDelete?: boolean | null };

export const UserDeleteDocument = gql`
  mutation userDelete($id: String!) {
    userDelete(id: $id)
  }
`;
export type UserDeleteMutationFn = Apollo.MutationFunction<
  UserDeleteMutation,
  UserDeleteMutationVariables
>;

/**
 * __useUserDeleteMutation__
 *
 * To run a mutation, you first call `useUserDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userDeleteMutation, { data, loading, error }] = useUserDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserDeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserDeleteMutation,
    UserDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UserDeleteMutation, UserDeleteMutationVariables>(
    UserDeleteDocument,
    options
  );
}
export type UserDeleteMutationHookResult = ReturnType<typeof useUserDeleteMutation>;
export type UserDeleteMutationResult = Apollo.MutationResult<UserDeleteMutation>;
export type UserDeleteMutationOptions = Apollo.BaseMutationOptions<
  UserDeleteMutation,
  UserDeleteMutationVariables
>;
