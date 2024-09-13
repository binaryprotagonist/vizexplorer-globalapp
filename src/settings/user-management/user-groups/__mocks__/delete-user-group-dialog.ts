import { GraphQLError } from "graphql";
import {
  UserGroupDeleteDocument,
  UserGroupDeleteMutationVariables
} from "../__generated__/delete-user-group-dialog";

export type MockUserGroupDeleteMutationOpts = {
  errors?: GraphQLError[];
};

export function mockUserGroupDeleteMutation({
  errors
}: MockUserGroupDeleteMutationOpts = {}) {
  const variables: UserGroupDeleteMutationVariables = { id: "1" };

  return {
    request: {
      query: UserGroupDeleteDocument,
      variables
    },
    result: {
      data: {
        pdUserGroupDelete: true
      },
      errors
    }
  };
}
