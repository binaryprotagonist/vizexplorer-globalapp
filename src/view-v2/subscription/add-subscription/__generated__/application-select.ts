import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type ApplicationSelectAppFragment = {
  __typename?: "Application";
  id: string;
  name: string;
  icon: string;
};

export const ApplicationSelectAppFragmentDoc = gql`
  fragment ApplicationSelectApp on Application {
    id
    name
    icon
  }
`;
