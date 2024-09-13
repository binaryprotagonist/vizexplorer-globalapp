import * as Types from "../../../../view/graphql/generated/graphql";

import { gql } from "@apollo/client";
export type SubBuilderSubPlanFragment = {
  __typename?: "SubscriptionPlan";
  id: string;
  appId?: Types.AppId | null;
  appName?: string | null;
  icon?: string | null;
  isOnprem?: boolean | null;
  package?: string | null;
  billingInterval: Types.BillingInterval;
};

export const SubBuilderSubPlanFragmentDoc = gql`
  fragment SubBuilderSubPlan on SubscriptionPlan {
    id
    appId
    appName
    icon
    isOnprem
    package
    billingInterval
  }
`;
