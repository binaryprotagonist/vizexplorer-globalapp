import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
import { MarketingProgramCardProgramDetailFragmentDoc } from "./marketing-program-detail";
export type MarketingProgramCardProgramFragment = {
  __typename?: "PdMarketingProgram";
  id: string;
  name: string;
  status?: Types.PdMarketingProgramStatus | null;
  startDate: any;
  dueDate: any;
  modifiedAt: any;
  guestsSelected: number;
  actionsCreated: number;
};

export const MarketingProgramCardProgramFragmentDoc = gql`
  fragment MarketingProgramCardProgram on PdMarketingProgram {
    id
    name
    status
    ...MarketingProgramCardProgramDetail
  }
  ${MarketingProgramCardProgramDetailFragmentDoc}
`;
