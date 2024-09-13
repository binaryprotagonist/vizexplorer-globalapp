import { GraphQLError } from "graphql";
import {
  ImpersonateOrgV2Document,
  ImpersonateOrgV2Mutation,
  ImpersonateOrgV2MutationVariables
} from "../__generated__/access-reason-dialog";

export type MockImpersonateOrgV2MutationOpts = {
  vars?: ImpersonateOrgV2MutationVariables;
  errors?: GraphQLError[];
};

export function mockImpersonateOrgV2Mutation({
  vars,
  errors
}: MockImpersonateOrgV2MutationOpts) {
  const variables: ImpersonateOrgV2MutationVariables = {
    orgId: vars?.orgId ?? "1",
    reason: vars?.reason ?? "Valid reason"
  };

  const data: ImpersonateOrgV2Mutation = {
    __typename: "Mutation",
    sudoImpersonateOrgV2: "1"
  };

  return {
    request: {
      query: ImpersonateOrgV2Document,
      variables
    },
    result: {
      data,
      errors
    }
  };
}
