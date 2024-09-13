import { AppId } from "generated-graphql";
import { produce } from "immer";
import {
  buildAppOptions,
  buildBillingIntervalOptions,
  buildEnvOptions,
  buildExpireDateOptions,
  buildPackageTypeOptions
} from "../utils";
import { SubscriptionAction, SubscriptionReducerState } from "./types";

export function subscriptionReducer(
  state: SubscriptionReducerState,
  action: SubscriptionAction
): SubscriptionReducerState {
  switch (action.type) {
    case "application-change": {
      const payloadApp = action.payload.appId;
      const payloadPlans = action.payload.plans;
      const envOptions = buildEnvOptions(payloadApp, payloadPlans);
      const packageOptions = buildPackageTypeOptions(payloadApp, payloadPlans);
      const billingOptions = buildBillingIntervalOptions(payloadApp, payloadPlans);

      const newOptionsState = produce(state, (draft) => {
        draft.options.environmentOptions = envOptions;
        draft.options.billingIntervalOptions = billingOptions;
        draft.options.packageTypeOptions = packageOptions;
      });

      return produce(newOptionsState, (draft) => {
        draft.values = resetFormState(payloadApp);
        if (envOptions.length === 1) {
          draft.values.environment = envOptions[0].value;
        }
        if (billingOptions.length === 1) {
          draft.values.billingInterval = billingOptions[0].value;
          draft.options.expireDateOptions = buildExpireDateOptions(
            billingOptions[0].value
          );
        }
        if (packageOptions.length === 1) {
          draft.values.packageType = packageOptions[0].value;
        }
      });
    }
    case "environment-change": {
      return produce(state, (draft) => {
        draft.values.environment = action.payload;
      });
    }
    case "billing-interval-change": {
      return produce(state, (draft) => {
        draft.values.billingInterval = action.payload;
        draft.options.expireDateOptions = buildExpireDateOptions(action.payload);
      });
    }
    case "package-type-change": {
      return produce(state, (draft) => {
        draft.values.packageType = action.payload;
      });
    }
    case "expiration-date-change": {
      return produce(state, (draft) => {
        draft.values.expirationDate = action.payload;
      });
    }
    case "build-app-options": {
      return produce(state, (draft) => {
        draft.options.applicationOptions = buildAppOptions(action.payload);
      });
    }
  }
}

function resetFormState(newAppId: AppId | null): SubscriptionReducerState["values"] {
  return {
    environment: null,
    billingInterval: null,
    packageType: null,
    expirationDate: null,
    appId: newAppId
  };
}
