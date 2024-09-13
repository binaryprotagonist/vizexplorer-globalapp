import { AppId, BillingInterval } from "generated-graphql";
import {
  buildAppOptions,
  buildBillingIntervalOptions,
  buildPackageTypeOptions,
  isDraftPartiallyComplete,
  isDraftSubscriptionComplete,
  minExpireDate,
  plansForEnvironment
} from "./utils";
import {
  DraftSubscription,
  DraftSubscriptionState,
  InitializeAction,
  ReducerState
} from "./types";
import { SubscriptionEnvironment } from "../../types";
import { isBefore, isValid } from "date-fns";

export function initializeState(
  state: ReducerState,
  payload: InitializeAction["payload"]
) {
  const { environment, availablePlans } = payload;
  state.environment = environment;
  state.environmentOptions = Object.values(SubscriptionEnvironment);
  state.availablePlans = availablePlans;
  state.canAddSubscription = false;
  state.draftSubscriptions = [];
  addDraftSubscription(state);
}

export function addDraftSubscription(state: ReducerState) {
  const envPlans = plansForEnvironment(state.availablePlans, state.environment);
  const applications = buildAppOptions(
    state.draftSubscriptions,
    state.draftSubscriptions.length,
    envPlans
  );

  state.draftSubscriptions.push({
    draftSubscription: {
      appId: null,
      billingInterval: null,
      expirationDate: null,
      packageType: null
    },
    options: {
      applications,
      billingIntervals: [],
      packageTypes: [],
      minExpireDate: new Date()
    }
  });
}

export function updateAppAndResetSelections(draftSub: DraftSubscription, appId: AppId) {
  draftSub.appId = appId;
  draftSub.packageType = null;
  draftSub.billingInterval = null;
  draftSub.expirationDate = null;
}

export function updateOptionsForSubIdx(state: ReducerState, subIdx: number) {
  const targetSub = state.draftSubscriptions[subIdx];
  const targetAppId = targetSub.draftSubscription.appId;
  const envPlans = plansForEnvironment(state.availablePlans, state.environment);
  targetSub.options.applications = buildAppOptions(
    state.draftSubscriptions,
    subIdx,
    envPlans
  );
  targetSub.options.packageTypes = buildPackageTypeOptions(targetAppId, envPlans);
  targetSub.options.billingIntervals = buildBillingIntervalOptions(targetAppId, envPlans);
}

export function updateDefaultSelections(targetSub: DraftSubscriptionState) {
  const { billingIntervals, packageTypes } = targetSub.options;

  if (billingIntervals.length === 1) {
    updateBillingInterval(targetSub, billingIntervals[0]);
  } else if (billingIntervals.includes(BillingInterval.Annual)) {
    updateBillingInterval(targetSub, BillingInterval.Annual);
  }

  if (packageTypes.length === 1) {
    targetSub.draftSubscription.packageType = packageTypes[0];
  }
}

export function updateBillingInterval(
  targetSub: DraftSubscriptionState,
  billingInterval: BillingInterval
) {
  targetSub.draftSubscription.billingInterval = billingInterval;
  targetSub.options.minExpireDate = minExpireDate(billingInterval);
}

export function updateCanAddSubscription(state: ReducerState) {
  if (!state.draftSubscriptions.length) {
    state.canAddSubscription = false;
    return;
  }

  const lastSub = state.draftSubscriptions.at(-1)!;
  state.canAddSubscription = isDraftSubscriptionComplete(lastSub.draftSubscription);
}

export function updateCanSave(state: ReducerState) {
  if (!state.draftSubscriptions.length) {
    state.canSave = false;
    return;
  }

  state.canSave = state.draftSubscriptions.every((sub, idx) => {
    if (idx === 0 && !isDraftSubscriptionComplete(sub.draftSubscription)) {
      return false;
    }

    if (!isDraftPartiallyComplete(sub.draftSubscription)) {
      return true;
    }

    const expireDate = sub.draftSubscription.expirationDate;
    const minExpireDate = sub.options.minExpireDate;
    if (!expireDate || !isValid(expireDate) || isBefore(expireDate, minExpireDate)) {
      return false;
    }

    return true;
  });
}
