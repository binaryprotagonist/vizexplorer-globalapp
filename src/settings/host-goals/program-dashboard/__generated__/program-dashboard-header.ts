import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type ProgramDashboardHeaderMetaFragment = {
  __typename?: "PdGoalProgram";
  name: string;
  status?: Types.PdGoalProgramStatus | null;
  startDate: any;
  endDate: any;
  createdAt: any;
  modifiedAt: any;
};

export const ProgramDashboardHeaderMetaFragmentDoc = gql`
  fragment ProgramDashboardHeaderMeta on PdGoalProgram {
    name
    status
    startDate
    endDate
    createdAt
    modifiedAt
  }
`;
