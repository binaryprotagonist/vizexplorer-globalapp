import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type IndividualPerformanceMetricFragment = {
  __typename?: "PdGoalProgramMetric";
  id: string;
  name: string;
  sisenseIndividualWidget?: { __typename?: "OdrWidget"; id: string } | null;
};

export const IndividualPerformanceMetricFragmentDoc = gql`
  fragment IndividualPerformanceMetric on PdGoalProgramMetric {
    id
    name
    sisenseIndividualWidget {
      id
    }
  }
`;
