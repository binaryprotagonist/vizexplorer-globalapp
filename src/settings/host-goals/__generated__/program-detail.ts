import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import {
  TargetValuesUserFragmentDoc,
  TargetValuesMetricFragmentDoc,
  TargetValuesTargetMatrixFragmentDoc
} from "./target-values-grid";
export type ProgramCardProgramDetailFragment = {
  __typename?: "PdGoalProgram";
  startDate: any;
  endDate: any;
  members: Array<{
    __typename?: "User";
    id: string;
    firstName: string;
    lastName: string;
    pdUserGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
  }>;
  metrics: Array<{ __typename?: "PdGoalProgramMetric"; id: string; name: string }>;
  targets?: {
    __typename?: "PdGoalProgramTargetMatrix";
    matrix: Array<Array<number>>;
  } | null;
};

export const ProgramCardProgramDetailFragmentDoc = gql`
  fragment ProgramCardProgramDetail on PdGoalProgram {
    startDate
    endDate
    members {
      ...TargetValuesUser
    }
    metrics {
      ...TargetValuesMetric
    }
    targets {
      ...TargetValuesTargetMatrix
    }
  }
  ${TargetValuesUserFragmentDoc}
  ${TargetValuesMetricFragmentDoc}
  ${TargetValuesTargetMatrixFragmentDoc}
`;
