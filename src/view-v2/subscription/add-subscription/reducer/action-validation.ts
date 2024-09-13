import {
  DeleteSubscriptionAction,
  ReducerState,
  UpdateAppAction,
  UpdateBillingIntervalAction,
  UpdateExpirationDateAction,
  UpdatePackageTypeAction
} from "./types";

export function isValidAppAction(state: ReducerState, action: UpdateAppAction): boolean {
  const { appId, subIdx } = action.payload;
  if (!isStateInitialized(state) || !isSubIndexInBounds(state, subIdx)) {
    return false;
  }

  const targetSub = state.draftSubscriptions[subIdx];
  if (!targetSub.options.applications.includes(appId)) {
    console.error(`'${appId}' is not an available option`);
    return false;
  }

  return true;
}

export function isValidPackageTypeAction(
  state: ReducerState,
  action: UpdatePackageTypeAction
): boolean {
  const { packageType, subIdx } = action.payload;
  if (!isStateInitialized(state) || !isSubIndexInBounds(state, subIdx)) {
    return false;
  }

  const targetSub = state.draftSubscriptions[subIdx];
  if (!targetSub.options.packageTypes.includes(packageType)) {
    console.error(`'${packageType}' is not an available option`);
    return false;
  }

  return true;
}

export function isValidBillingIntervalAction(
  state: ReducerState,
  action: UpdateBillingIntervalAction
): boolean {
  const { subIdx, billingInterval } = action.payload;
  if (!isStateInitialized(state) || !isSubIndexInBounds(state, subIdx)) {
    return false;
  }

  const targetSub = state.draftSubscriptions[subIdx];
  if (!targetSub.options.billingIntervals.includes(billingInterval)) {
    console.error(`'${billingInterval}' is not an available option`);
    return false;
  }

  return true;
}

// don't validate against minExpireDate as we want the user input to be flexible
export function isValidExpirationDateAction(
  state: ReducerState,
  action: UpdateExpirationDateAction
): boolean {
  const { subIdx } = action.payload;
  if (!isStateInitialized(state) || !isSubIndexInBounds(state, subIdx)) {
    return false;
  }

  return true;
}

export function isValidDeleteAction(
  state: ReducerState,
  action: DeleteSubscriptionAction
): boolean {
  const { subIdx } = action.payload;
  if (!isStateInitialized(state) || !isSubIndexInBounds(state, subIdx)) {
    return false;
  }

  if (subIdx === 0) {
    console.error("Cannot delete the first subscription");
    return false;
  }

  return true;
}

function isStateInitialized(state: ReducerState): boolean {
  if (!state.draftSubscriptions.length) {
    console.error("Subscription state is not initialized");
    return false;
  }

  return true;
}

function isSubIndexInBounds(state: ReducerState, subIdx: number): boolean {
  if (subIdx < 0 || subIdx >= state.draftSubscriptions.length) {
    console.error("Invalid subscription index");
    return false;
  }

  return true;
}
