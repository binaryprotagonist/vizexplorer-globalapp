import { AppId, BillingInterval, SubscriptionPlanFragment } from "generated-graphql";
import { FormOptions, FormValues } from "../../../shared";
import { Environment } from "../../../types";

export type SubscriptionAction =
  | AppChangeAction
  | EnvironmentChange
  | BillingIntervalChange
  | PackageTypeChange
  | ExpirationDateChange
  | BuildAppOptions;

type AppChangeAction = {
  type: "application-change";
  payload: {
    appId: AppId | null;
    plans: SubscriptionPlanFragment[];
  };
};
type EnvironmentChange = {
  type: "environment-change";
  payload: Environment | null;
};

type BillingIntervalChange = {
  type: "billing-interval-change";
  payload: BillingInterval | null;
};

type PackageTypeChange = {
  type: "package-type-change";
  payload: string | null;
};

type ExpirationDateChange = {
  type: "expiration-date-change";
  payload: Date | null;
};

type BuildAppOptions = {
  type: "build-app-options";
  payload: SubscriptionPlanFragment[];
};

export type SubscriptionReducerState = {
  values: FormValues;
  options: FormOptions;
};
