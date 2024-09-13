import { addYears, startOfToday } from "date-fns";
import { AppId, BillingInterval, SubscriptionPlanFragment } from "generated-graphql";
import {
  buildAppOptions,
  buildBillingIntervalOptions,
  buildEnvOptions,
  buildExpireDateOptions,
  buildPackageTypeOptions
} from "../../../admin/add/utils";
import { Environment } from "../../../types";
import { FormOptions, FormValues } from "../types";

export const fixtSreForm: FormValues = {
  appId: AppId.Sre,
  billingInterval: BillingInterval.Annual,
  environment: Environment.CLOUD,
  packageType: "premium",
  expirationDate: addYears(startOfToday(), 1)
};

export const fixtEmptyForm: FormValues = {
  appId: null,
  billingInterval: null,
  environment: null,
  packageType: null,
  expirationDate: null
};

export function generateDummyFormOptions(
  appId: AppId,
  plans: SubscriptionPlanFragment[],
  billingInterval?: BillingInterval
): FormOptions {
  const billingIntervals = buildBillingIntervalOptions(appId, plans);

  return {
    applicationOptions: buildAppOptions(plans),
    billingIntervalOptions: billingIntervals,
    environmentOptions: buildEnvOptions(appId, plans),
    packageTypeOptions: buildPackageTypeOptions(appId, plans),
    expireDateOptions: buildExpireDateOptions(
      billingInterval ?? billingIntervals[0].value
    )
  };
}
