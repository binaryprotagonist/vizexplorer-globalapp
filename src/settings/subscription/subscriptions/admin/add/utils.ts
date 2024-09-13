import { addMonths, addYears, isBefore, startOfToday, isValid } from "date-fns";
import {
  AppId,
  AppSubscriptionFragment,
  BillingInterval,
  SubscriptionPlanFragment
} from "generated-graphql";
import {
  ApplicationOption,
  billingIntervalAsOption,
  BillingIntervalOption,
  environmentAsOption,
  EnvironmentOption,
  ExpirationDateOption,
  FormOptions,
  FormValues,
  packageTypeAsOption,
  PackageTypeOption
} from "../../shared";
import { Environment } from "../../types";

export function buildAppOptions(plans: SubscriptionPlanFragment[]) {
  return plans.reduce<ApplicationOption[]>((acc, cur) => {
    if (!!cur.appId && !acc.some((acc) => acc.value === cur.appId)) {
      acc.push({
        label: cur.appName!,
        value: cur.appId!
      });
    }
    return acc;
  }, []);
}

export function buildEnvOptions(
  appId: AppId | null,
  plans: SubscriptionPlanFragment[]
): EnvironmentOption[] {
  if (!appId) return [];
  const plansForApp = plans.filter((plan) => plan.appId === appId);
  const isOnpremAsString = [...new Set(plansForApp.map((plan) => `${plan.isOnprem}`))];
  return isOnpremAsString.map((env) => {
    const environment = env === "true" ? Environment.ONPREM : Environment.CLOUD;
    return environmentAsOption(environment);
  });
}

export function buildBillingIntervalOptions(
  appId: AppId | null,
  plans: SubscriptionPlanFragment[]
): BillingIntervalOption[] {
  if (!appId) return [];
  const plansForApp = plans.filter((plan) => plan.appId === appId);
  const billingIntervals = [...new Set(plansForApp.map((plan) => plan.billingInterval))];
  return billingIntervals.map(billingIntervalAsOption);
}

export function buildPackageTypeOptions(
  appId: AppId | null,
  plans: SubscriptionPlanFragment[]
): PackageTypeOption[] {
  if (!appId) return [];
  const plansForApp = plans.filter((plan) => plan.appId === appId);
  const subPackages = [...new Set(plansForApp.map((plan) => plan.package))];
  return (subPackages.filter(Boolean) as string[]).map(packageTypeAsOption);
}

export function buildExpireDateOptions(
  billingInterval: BillingInterval | null
): ExpirationDateOption {
  return {
    min:
      billingInterval === BillingInterval.Annual
        ? addYears(startOfToday(), 1)
        : addMonths(startOfToday(), 1)
  };
}

export function subscriptionPlanFromForm(
  form: FormValues,
  subscriptionPlans: SubscriptionPlanFragment[]
): SubscriptionPlanFragment {
  const foundPlans = subscriptionPlans.filter((sub) => {
    return (
      sub.appId === form.appId &&
      sub.billingInterval === form.billingInterval &&
      sub.isOnprem === (form.environment === Environment.ONPREM) &&
      sub.package === form.packageType
    );
  });
  if (!foundPlans.length) {
    throw Error("Failed to find plan matching provided parameters");
  }
  if (foundPlans.length > 1) {
    throw Error("Found multiple plans matching provided parameters");
  }
  return foundPlans[0];
}

export function isFormValid(form: FormValues, options: FormOptions): boolean {
  if (!form.appId) return false;
  if (!form.billingInterval) return false;
  if (!form.environment) return false;
  if (!form.packageType) return false;
  if (!isValidExpirationDate(form.expirationDate, options.expireDateOptions.min)) {
    return false;
  }
  return true;
}

function isValidExpirationDate(expireDate: Date | null, minDate: Date): boolean {
  return !!expireDate && isValid(expireDate) && !isBefore(expireDate, minDate);
}

export function findAvailablePlans(
  plans: SubscriptionPlanFragment[],
  apps: AppSubscriptionFragment[]
): SubscriptionPlanFragment[] {
  const appsWithValidSub = apps.filter((app) => !!app.subscription?.isValid);
  if (!appsWithValidSub.length) {
    return plans;
  }

  const isOnprem = appsWithValidSub.some((app) => !!app.subscription?.isOnprem);
  return plans.filter(
    (plan) =>
      plan.isOnprem === isOnprem && !appsWithValidSub.some((app) => app.id === plan.appId)
  );
}
