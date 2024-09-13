import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type MarketingProgramCardProgramDetailFragment = {
  __typename?: "PdMarketingProgram";
  startDate: any;
  dueDate: any;
  modifiedAt: any;
  guestsSelected: number;
  actionsCreated: number;
};

export const MarketingProgramCardProgramDetailFragmentDoc = gql`
  fragment MarketingProgramCardProgramDetail on PdMarketingProgram {
    startDate
    dueDate
    modifiedAt
    guestsSelected
    actionsCreated
  }
`;
