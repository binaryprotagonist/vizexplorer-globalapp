import { AppId, SubscriptionCreateInput } from "generated-graphql";
import { SubBuilderSubPlanFragment } from "./__generated__/subscription-builder";
import { ApplicationSelectAppFragment } from "./__generated__/application-select";
import {
  CompletedReducerState,
  CompletedReducerSubscription,
  ReducerState
} from "./reducer";
import { SubscriptionEnvironment } from "../types";
import { isDraftSubscriptionComplete } from "./reducer/utils";

export function applicationSelectAppFragmentFromPlan(
  appId: AppId | null,
  subPlans: SubBuilderSubPlanFragment[]
): ApplicationSelectAppFragment | null {
  if (!appId) return null;

  const app = subPlans.find((plan) => plan.appId === appId);
  if (!app?.appId || !app.appName || !app.icon) return null;

  return {
    id: app.appId,
    name: app.appName,
    icon: app.icon
  };
}

export function isCompletedReducerState(
  state: ReducerState
): state is CompletedReducerState {
  return state.environment !== undefined && state.canSave;
}

function planMatchingReducerSubscription(
  environment: SubscriptionEnvironment,
  subscription: CompletedReducerSubscription,
  plans: SubBuilderSubPlanFragment[]
): SubBuilderSubPlanFragment | undefined {
  const { appId, billingInterval, packageType } = subscription;
  const isOnprem = environment === SubscriptionEnvironment.ONPREM;

  return plans.find(
    (plan) =>
      plan.appId === appId &&
      plan.billingInterval === billingInterval &&
      plan.isOnprem === isOnprem &&
      plan.package === packageType
  );
}

export function reducerStateAsSubscriptionCreateInput(
  reducerState: CompletedReducerState,
  plans: SubBuilderSubPlanFragment[]
): SubscriptionCreateInput[] {
  const { environment, draftSubscriptions } = reducerState;

  const draftSubs = draftSubscriptions.map(({ draftSubscription }) => draftSubscription);
  const completedSubs = draftSubs.filter(isDraftSubscriptionComplete);
  return completedSubs.map((subscription) => {
    const matchingPlan = planMatchingReducerSubscription(
      environment,
      subscription,
      plans
    );

    if (!matchingPlan) {
      throw Error(
        `No matching plan found for subscription: ${JSON.stringify(subscription)}`
      );
    }

    return {
      planId: matchingPlan.id,
      periodEndDate: subscription.expirationDate
    };
  });
}
