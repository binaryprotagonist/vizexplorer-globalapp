import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type HostGoalUserOptionFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
  pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
};

export const HostGoalUserOptionFragmentDoc = gql`
  fragment HostGoalUserOption on User {
    id
    firstName
    lastName
    pdUserGroup {
      id
      name
    }
  }
`;
