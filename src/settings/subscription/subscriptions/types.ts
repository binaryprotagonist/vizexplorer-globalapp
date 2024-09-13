import { Action } from "@material-table/core";
import { AppSubscriptionFragment, GaUserFragment } from "generated-graphql";

export type SubscriptionsProps = {
  currentUser: GaUserFragment;
  appSubscriptions: AppSubscriptionFragment[];
  companyName: string;
};

export type SubscriptionAction = (
  rowData: AppSubscriptionFragment
) => Action<AppSubscriptionFragment>;

// TODO eventually replace with SubscriptionEnvironment from view-v2
export enum Environment {
  CLOUD = "cloud",
  ONPREM = "on-premises"
}
