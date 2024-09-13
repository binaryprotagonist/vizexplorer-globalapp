import {
  AppId,
  BillingInterval,
  SubscriptionPlanFragment,
  SubscriptionPlansDocument,
  SubscriptionPlansQuery
} from "generated-graphql";
import { dummyAppFullName } from "../application-helpers";

export function mockSubscriptionPlansQuery(plans?: SubscriptionPlanFragment[]) {
  const data: SubscriptionPlansQuery = {
    subscriptionPlans: plans ?? mockSubscriptionPlans
  };

  return {
    request: {
      query: SubscriptionPlansDocument
    },
    result: {
      data
    }
  };
}

function buildSubscriptionPlan(
  appId: AppId,
  billingInterval: BillingInterval,
  packageType: string,
  isOnprem = false
): SubscriptionPlanFragment {
  return {
    __typename: "SubscriptionPlan",
    id: `${appId}-${billingInterval}-${isOnprem}-${packageType}`,
    appId,
    appName: dummyAppFullName(appId),
    billingInterval,
    isOnprem,
    package: packageType
  };
}

const { Annual, Monthly } = BillingInterval;
export const mockSrePremiumCloudAnnual = buildSubscriptionPlan(
  AppId.Sre,
  Annual,
  "premium"
);
const mockSreStandardCloudAnnual = buildSubscriptionPlan(AppId.Sre, Annual, "standard");
const mockSrePremiumCloudMonthly = buildSubscriptionPlan(AppId.Sre, Monthly, "premium");
const mockSreStandardCloudMonthly = buildSubscriptionPlan(AppId.Sre, Annual, "standard");
const mockSrePremiumOnpremAnnual = buildSubscriptionPlan(
  AppId.Sre,
  Annual,
  "premium",
  true
);
const mockSreStandardOnpremAnnual = buildSubscriptionPlan(
  AppId.Sre,
  Annual,
  "standard",
  true
);

const mockMarPremiumCloudAnnual = buildSubscriptionPlan(AppId.Mar, Annual, "premium");

export const mockSubscriptionPlans = [
  mockSrePremiumCloudAnnual,
  mockSreStandardCloudAnnual,
  mockSrePremiumCloudMonthly,
  mockSreStandardCloudMonthly,
  mockSrePremiumOnpremAnnual,
  mockSreStandardOnpremAnnual,
  mockMarPremiumCloudAnnual
];
