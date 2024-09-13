import * as Types from "../../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type MappingSelectNativeHostFragment = {
  __typename?: "PdNativeHost";
  nativeHostId: string;
  firstName: string;
  lastName: string;
};

export const MappingSelectNativeHostFragmentDoc = gql`
  fragment MappingSelectNativeHost on PdNativeHost {
    nativeHostId
    firstName
    lastName
  }
`;
