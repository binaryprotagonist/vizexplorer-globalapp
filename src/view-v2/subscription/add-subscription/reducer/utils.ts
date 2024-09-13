import { AppId, BillingInterval, SubscriptionPlanFragment } from "generated-graphql";
import { SubscriptionEnvironment } from "../../types";
import { addMonths, addYears, startOfToday } from "date-fns";
import {
  CompletedReducerSubscription,
  DraftSubscription,
  DraftSubscriptionState,
  ReducerState
} from "./types";

export function buildAppOptions(
  draftSubs: DraftSubscriptionState[],
  targetSubIdx: number,
  plans: SubscriptionPlanFragment[]
): AppId[] {
  const appsInUse = draftSubs
    .filter((_, idx) => idx !== targetSubIdx)
    .map((sub) => sub.draftSubscription.appId);
  const unusedPlans = plans.filter((p) => !appsInUse.some((app) => app === p.appId));
  return appIdsFromPlans(unusedPlans);
}

export function appIdsFromPlans(plans: SubscriptionPlanFragment[]): AppId[] {
  return [...new Set(plans.map((plan) => plan.appId!).filter(Boolean))];
}

export function buildBillingIntervalOptions(
  appId: AppId | null,
  plans: SubscriptionPlanFragment[]
): BillingInterval[] {
  if (!appId) return [];

  const plansForApp = plans.filter((plan) => plan.appId === appId);
  const billingIntervals = [...new Set(plansForApp.map((plan) => plan.billingInterval))];
  return billingIntervals;
}

export function buildPackageTypeOptions(
  appId: AppId | null,
  plans: SubscriptionPlanFragment[]
): string[] {
  if (!appId) return [];

  const plansForApp = plans.filter((plan) => plan.appId === appId);
  const subPackages = [...new Set(plansForApp.map((plan) => plan.package))];
  return subPackages.filter(Boolean) as string[];
}

export function minExpireDate(billingInterval: BillingInterval | null): Date {
  switch (billingInterval) {
    case BillingInterval.Annual:
      return addYears(startOfToday(), 1);
    case BillingInterval.Monthly:
      return addMonths(startOfToday(), 1);
    default:
      return startOfToday();
  }
}

export function isDraftSubscriptionComplete(
  sub: DraftSubscription
): sub is CompletedReducerSubscription {
  return (
    !!sub.appId && !!sub.billingInterval && !!sub.packageType && !!sub.expirationDate
  );
}

export function isDraftPartiallyComplete(sub: DraftSubscription) {
  return (
    !!sub.appId || !!sub.billingInterval || !!sub.packageType || !!sub.expirationDate
  );
}

export function plansForEnvironment(
  plans: SubscriptionPlanFragment[],
  env?: SubscriptionEnvironment | null
) {
  if (!env) return plans;

  const isOnprem = env === SubscriptionEnvironment.ONPREM;
  return plans.filter((plan) => plan.isOnprem === isOnprem);
}

export function initialAddSubscriptionReducerState(): ReducerState {
  return {
    environmentOptions: [],
    draftSubscriptions: [],
    availablePlans: [],
    canAddSubscription: false,
    canSave: false
  };
}
