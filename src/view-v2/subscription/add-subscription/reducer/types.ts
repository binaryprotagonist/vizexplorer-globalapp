import { AppId, BillingInterval } from "generated-graphql";
import { SubscriptionEnvironment } from "../../types";
import { SubBuilderSubPlanFragment } from "../__generated__/subscription-builder";
import { DeepRequired } from "../../../../view/utils";

export type ReducerState = {
  environment?: SubscriptionEnvironment;
  environmentOptions: SubscriptionEnvironment[];
  draftSubscriptions: DraftSubscriptionState[];
  // available plans should exclude plans the org already has an active subscription to
  availablePlans: SubBuilderSubPlanFragment[];
  canAddSubscription: boolean;
  canSave: boolean;
};

export type CompletedReducerState = DeepRequired<ReducerState>;

export type DraftSubscription = {
  appId: AppId | null;
  billingInterval: BillingInterval | null;
  packageType: string | null;
  expirationDate: Date | null;
};

export type CompletedReducerSubscription = DeepRequired<DraftSubscription>;

export type DraftSubscriptionFieldOptions = {
  applications: AppId[];
  billingIntervals: BillingInterval[];
  packageTypes: string[];
  minExpireDate: Date;
};

export type DraftSubscriptionState = {
  draftSubscription: DraftSubscription;
  options: DraftSubscriptionFieldOptions;
};

export type InitializeAction = {
  type: "INITIALIZE";
  payload: {
    // environment should be provided for orgs with existing valid subscriptions
    environment?: SubscriptionEnvironment;
    availablePlans: SubBuilderSubPlanFragment[];
  };
};

export type UpdateEnvironmentAction = {
  type: "UPDATE_ENVIRONMENT";
  payload: { environment: SubscriptionEnvironment };
};

export type UpdateAppAction = {
  type: "UPDATE_APP";
  payload: { subIdx: number; appId: AppId };
};

export type UpdatePackageTypeAction = {
  type: "UPDATE_PACKAGE_TYPE";
  payload: { subIdx: number; packageType: string };
};

export type UpdateBillingIntervalAction = {
  type: "UPDATE_BILLING_INTERVAL";
  payload: { subIdx: number; billingInterval: BillingInterval };
};

export type UpdateExpirationDateAction = {
  type: "UPDATE_EXPIRATION_DATE";
  payload: { subIdx: number; expirationDate: Date | null };
};

export type AddSubscriptionAction = {
  type: "ADD_SUBSCRIPTION";
};

export type DeleteSubscriptionAction = {
  type: "DELETE_SUBSCRIPTION";
  payload: { subIdx: number };
};

export type ReducerAction =
  | InitializeAction
  | UpdateEnvironmentAction
  | UpdateAppAction
  | UpdatePackageTypeAction
  | UpdateBillingIntervalAction
  | UpdateExpirationDateAction
  | AddSubscriptionAction
  | DeleteSubscriptionAction;
