import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type TeamPerformanceMetricFragment = {
  __typename?: "PdGoalProgramMetric";
  id: string;
  name: string;
  sisenseTeamWidget?: { __typename?: "OdrWidget"; id: string } | null;
};

export const TeamPerformanceMetricFragmentDoc = gql`
  fragment TeamPerformanceMetric on PdGoalProgramMetric {
    id
    name
    sisenseTeamWidget {
      id
    }
  }
`;
