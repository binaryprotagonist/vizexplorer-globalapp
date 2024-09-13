import { AppId, BillingInterval } from "generated-graphql";
import { Environment } from "../../types";

export type SelectOption<L, V> = { label: L; value: V };
export type ApplicationOption = SelectOption<string, AppId>;
export type EnvironmentOption = SelectOption<string, Environment>;
export type BillingIntervalOption = SelectOption<string, BillingInterval>;
export type PackageTypeOption = SelectOption<string, string>;
export type ExpirationDateOption = {
  min: Date;
};

type AppChange = {
  field: "application";
  value: AppId | null;
};
type EnvChange = {
  field: "environment";
  value: Environment | null;
};
type BillingChange = {
  field: "billing-interval";
  value: BillingInterval | null;
};
type PackageChange = {
  field: "package-type";
  value: string | null;
};
type ExpireDateChange = {
  field: "expiration-date";
  value: Date | null;
};

export type FormChangeAction =
  | AppChange
  | EnvChange
  | BillingChange
  | PackageChange
  | ExpireDateChange;

export type FormState = {
  environment: Environment | null;
  billingInterval: BillingInterval | null;
  packageType: string | null;
  expirationDate: Date | null;
  appId: AppId | null;
};

export type FormValues = FormState;
export type FormOptions = {
  applicationOptions: ApplicationOption[];
  environmentOptions: EnvironmentOption[];
  billingIntervalOptions: BillingIntervalOption[];
  packageTypeOptions: PackageTypeOption[];
  expireDateOptions: ExpirationDateOption;
};
