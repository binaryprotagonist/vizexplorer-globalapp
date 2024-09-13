import * as Types from "../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type SiteSelectSiteFragment = { __typename?: "Site"; name: string; id: string };

export const SiteSelectSiteFragmentDoc = gql`
  fragment SiteSelectSite on Site {
    id: idV2
    name
  }
`;
