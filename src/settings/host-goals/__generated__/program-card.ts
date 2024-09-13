import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { ProgramCardProgramDetailFragmentDoc } from "./program-detail";
export type ProgramCardProgramFragment = {
  __typename?: "PdGoalProgram";
  id: string;
  name: string;
  status?: Types.PdGoalProgramStatus | null;
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

export const ProgramCardProgramFragmentDoc = gql`
  fragment ProgramCardProgram on PdGoalProgram {
    id
    name
    status
    ...ProgramCardProgramDetail
  }
  ${ProgramCardProgramDetailFragmentDoc}
`;
