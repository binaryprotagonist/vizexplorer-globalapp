import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type TargetValuesUserFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
  pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
};

export type TargetValuesMetricFragment = {
  __typename?: "PdGoalProgramMetric";
  id: string;
  name: string;
};

export type TargetValuesTargetMatrixFragment = {
  __typename?: "PdGoalProgramTargetMatrix";
  matrix: Array<Array<number>>;
};

export const TargetValuesUserFragmentDoc = gql`
  fragment TargetValuesUser on User {
    id
    firstName
    lastName
    pdUserGroup {
      id
      name
    }
  }
`;
export const TargetValuesMetricFragmentDoc = gql`
  fragment TargetValuesMetric on PdGoalProgramMetric {
    id
    name
  }
`;
export const TargetValuesTargetMatrixFragmentDoc = gql`
  fragment TargetValuesTargetMatrix on PdGoalProgramTargetMatrix {
    matrix
  }
`;
