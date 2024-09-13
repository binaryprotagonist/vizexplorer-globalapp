import { ReducerAction, ReducerState } from "./types";
import {
  isValidAppAction,
  isValidBillingIntervalAction,
  isValidDeleteAction,
  isValidExpirationDateAction,
  isValidPackageTypeAction
} from "./action-validation";
import {
  addDraftSubscription,
  initializeState,
  updateDefaultSelections,
  updateAppAndResetSelections,
  updateBillingInterval,
  updateCanAddSubscription,
  updateCanSave,
  updateOptionsForSubIdx
} from "./actions";

export function addSubscriptionReducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case "INITIALIZE": {
      initializeState(state, action.payload);
      break;
    }
    case "UPDATE_ENVIRONMENT": {
      const { environment } = action.payload;
      const availablePlans = state.availablePlans;
      initializeState(state, { availablePlans, environment });
      break;
    }
    case "UPDATE_APP": {
      if (!isValidAppAction(state, action)) return;

      const { subIdx, appId } = action.payload;
      const targetSubDraft = state.draftSubscriptions[subIdx];
      updateAppAndResetSelections(targetSubDraft.draftSubscription, appId);
      state.draftSubscriptions.forEach((_sub, idx) => {
        updateOptionsForSubIdx(state, idx);
      });
      updateDefaultSelections(targetSubDraft);
      break;
    }
    case "UPDATE_PACKAGE_TYPE": {
      if (!isValidPackageTypeAction(state, action)) return;

      const { subIdx, packageType } = action.payload;
      const targetSub = state.draftSubscriptions[subIdx];
      targetSub.draftSubscription.packageType = packageType;
      break;
    }
    case "UPDATE_BILLING_INTERVAL": {
      if (!isValidBillingIntervalAction(state, action)) return;

      const { subIdx, billingInterval } = action.payload;
      const targetSub = state.draftSubscriptions[subIdx];
      updateBillingInterval(targetSub, billingInterval);
      break;
    }
    case "UPDATE_EXPIRATION_DATE": {
      if (!isValidExpirationDateAction(state, action)) {
        return;
      }

      const { subIdx, expirationDate } = action.payload;
      const targetSub = state.draftSubscriptions[subIdx];
      targetSub.draftSubscription.expirationDate = expirationDate;
      break;
    }
    case "ADD_SUBSCRIPTION": {
      if (!state.canAddSubscription) {
        console.error("Complete the last subscription to add more");
        return;
      }

      addDraftSubscription(state);
      break;
    }
    case "DELETE_SUBSCRIPTION": {
      if (!isValidDeleteAction(state, action)) return;

      const { subIdx } = action.payload;
      state.draftSubscriptions.splice(subIdx, 1);
    }
  }

  updateCanAddSubscription(state);
  updateCanSave(state);
}
