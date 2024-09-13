import { produce } from "immer";
import { addSubscriptionReducer } from "./add-subscription-reducer";
import { ReducerAction, ReducerState } from "./types";
import { SubscriptionEnvironment } from "../../types";
import { AppId, BillingInterval } from "generated-graphql";
import { addMonths, addYears, format, startOfToday } from "date-fns";
import { mockSubBuilderSubPlans } from "../__mocks__/subscription-builder";

const initialState: ReducerState = {
  environmentOptions: [],
  draftSubscriptions: [],
  availablePlans: [],
  canAddSubscription: false,
  canSave: false
};

const initializedCloudState = runImmerReducer(initialState, {
  type: "INITIALIZE",
  payload: {
    availablePlans: mockSubBuilderSubPlans,
    environment: SubscriptionEnvironment.CLOUD
  }
});

// shortcut to completing the first subscription fields as many tests will rely on at least 1 subscription being initialized
function completeFirstSubscription() {
  let state = runImmerReducer(initializedCloudState, {
    type: "UPDATE_APP",
    payload: { subIdx: 0, appId: AppId.Sras }
  });
  state = runImmerReducer(state, {
    type: "UPDATE_PACKAGE_TYPE",
    payload: { subIdx: 0, packageType: "standard" }
  });
  state = runImmerReducer(state, {
    type: "UPDATE_BILLING_INTERVAL",
    payload: { subIdx: 0, billingInterval: BillingInterval.Annual }
  });
  return runImmerReducer(state, {
    type: "UPDATE_EXPIRATION_DATE",
    payload: { subIdx: 0, expirationDate: addYears(new Date(), 2) }
  });
}

function runImmerReducer(state: ReducerState, action: ReducerAction) {
  return produce(state, (draft) => addSubscriptionReducer(draft, action));
}
describe("addSubscriptionReducer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can initialize the reducer without providing an environment", () => {
    const { draftSubscriptions, availablePlans, environment, environmentOptions } =
      runImmerReducer(initialState, {
        type: "INITIALIZE",
        payload: { availablePlans: mockSubBuilderSubPlans }
      });

    expect(environment).toBeUndefined();
    expect(environmentOptions).toEqual(Object.values(SubscriptionEnvironment));
    expect(draftSubscriptions).toHaveLength(1);
    expect(availablePlans).toBe(mockSubBuilderSubPlans);
  });

  it("can initialize the reducer with Cloud environment", () => {
    const { draftSubscriptions, availablePlans, environment } = runImmerReducer(
      initialState,
      {
        type: "INITIALIZE",
        payload: {
          availablePlans: mockSubBuilderSubPlans,
          environment: SubscriptionEnvironment.CLOUD
        }
      }
    );

    expect(environment).toEqual(SubscriptionEnvironment.CLOUD);
    expect(draftSubscriptions).toHaveLength(1);
    expect(draftSubscriptions[0].options.applications).toHaveLength(11);
    expect(draftSubscriptions[0].options.billingIntervals).toHaveLength(0);
    expect(draftSubscriptions[0].options.packageTypes).toHaveLength(0);
    expect(availablePlans).toBe(mockSubBuilderSubPlans);
  });

  it("can initialize the reducer with OnPrem environment", () => {
    const { draftSubscriptions, availablePlans, environment } = runImmerReducer(
      initialState,
      {
        type: "INITIALIZE",
        payload: {
          availablePlans: mockSubBuilderSubPlans,
          environment: SubscriptionEnvironment.ONPREM
        }
      }
    );

    expect(environment).toEqual(SubscriptionEnvironment.ONPREM);
    expect(draftSubscriptions).toHaveLength(1);
    expect(draftSubscriptions[0].options.applications).toHaveLength(9);
    expect(draftSubscriptions[0].options.billingIntervals).toHaveLength(0);
    expect(draftSubscriptions[0].options.packageTypes).toHaveLength(0);
    expect(availablePlans).toBe(mockSubBuilderSubPlans);
  });

  it("can update the environment", () => {
    const { environment } = runImmerReducer(initializedCloudState, {
      type: "UPDATE_ENVIRONMENT",
      payload: { environment: SubscriptionEnvironment.ONPREM }
    });

    expect(environment).toBe(SubscriptionEnvironment.ONPREM);
  });

  it("can update application selection for a subscription", () => {
    const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
      type: "UPDATE_APP",
      payload: { appId: AppId.Sras, subIdx: 0 }
    });

    expect(draftSubscriptions[0].draftSubscription.appId).toBe(AppId.Sras);
  });

  it("can update package type selection for a subscription", () => {
    const state = runImmerReducer(initializedCloudState, {
      type: "UPDATE_APP",
      payload: { appId: AppId.Sras, subIdx: 0 }
    });
    const { draftSubscriptions } = runImmerReducer(state, {
      type: "UPDATE_PACKAGE_TYPE",
      payload: { packageType: "standard", subIdx: 0 }
    });

    expect(draftSubscriptions[0].draftSubscription.packageType).toBe("standard");
  });

  it("can update billing interval selection for a subscription", () => {
    const state = runImmerReducer(initializedCloudState, {
      type: "UPDATE_APP",
      payload: { appId: AppId.Sras, subIdx: 0 }
    });
    const { draftSubscriptions } = runImmerReducer(state, {
      type: "UPDATE_BILLING_INTERVAL",
      payload: { billingInterval: BillingInterval.Annual, subIdx: 0 }
    });

    expect(draftSubscriptions[0].draftSubscription.billingInterval).toBe(
      BillingInterval.Annual
    );
  });

  it("can update expiration date selection for a subscription", () => {
    const state = runImmerReducer(initializedCloudState, {
      type: "UPDATE_APP",
      payload: { appId: AppId.Sras, subIdx: 0 }
    });
    const { draftSubscriptions } = runImmerReducer(state, {
      type: "UPDATE_EXPIRATION_DATE",
      payload: { expirationDate: addYears(new Date(), 1), subIdx: 0 }
    });

    const { expirationDate } = draftSubscriptions[0].draftSubscription;
    const expirationDateFmt = format(expirationDate!, "yyyy-MM-dd");
    const expectedDate = format(addYears(new Date(), 1), "yyyy-MM-dd");
    expect(expirationDateFmt).toEqual(expectedDate);
  });

  describe("UPDATE_ENVIRONMENT", () => {
    it("resets reducer state if environment changes", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      state = runImmerReducer(state, {
        type: "UPDATE_ENVIRONMENT",
        payload: { environment: SubscriptionEnvironment.ONPREM }
      });

      expect(state.environment).toBe(SubscriptionEnvironment.ONPREM);
      expect(state.draftSubscriptions).toHaveLength(1);
      expect(state.draftSubscriptions[0].draftSubscription.appId).toBeNull();
      expect(state.draftSubscriptions[0].draftSubscription.billingInterval).toBeNull();
      expect(state.draftSubscriptions[0].draftSubscription.packageType).toBeNull();
      expect(state.draftSubscriptions[0].draftSubscription.expirationDate).toBeNull();
      expect(state.draftSubscriptions[0].options.applications).toHaveLength(9);
      expect(state.canAddSubscription).toBe(false);
    });
  });

  describe("UPDATE_APP", () => {
    it("updates subscription options with expected values after updating application", () => {
      const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Sras, subIdx: 0 }
      });

      const {
        applications: applicationOptions,
        billingIntervals: billingIntervalOptions,
        packageTypes: packageTypeOptions
      } = draftSubscriptions[0].options;
      expect(applicationOptions).toHaveLength(11);
      expect(billingIntervalOptions).toHaveLength(2);
      expect(packageTypeOptions).toHaveLength(3);
    });

    it("doesn't include already selected apps as options for other subscriptions", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      state = runImmerReducer(state, {
        type: "UPDATE_APP",
        payload: { subIdx: 1, appId: AppId.Sre }
      });

      const firstSub = state.draftSubscriptions[0];
      const secondSub = state.draftSubscriptions[1];
      expect(firstSub.options.applications).toHaveLength(10);
      expect(firstSub.options.applications).not.toContain(AppId.Sre);
      expect(secondSub.options.applications).toHaveLength(10);
      expect(secondSub.options.applications).not.toContain(AppId.Sras);
    });

    it("automatically sets values for fields that only have 1 option", () => {
      const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Pdereporting, subIdx: 0 }
      });

      const { packageType, billingInterval } = draftSubscriptions[0].draftSubscription;
      const { minExpireDate } = draftSubscriptions[0].options;
      const minDateFmt = format(minExpireDate, "yyyy-MM-dd");
      const expectedMinDate = format(addYears(startOfToday(), 1), "yyyy-MM-dd");

      expect(packageType).toEqual("elite");
      expect(billingInterval).toEqual(BillingInterval.Annual);
      expect(minDateFmt).toEqual(expectedMinDate);
    });

    it("doesn't automatically set package type if it has multiple options", () => {
      const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Sras, subIdx: 0 }
      });

      const { packageType } = draftSubscriptions[0].draftSubscription;
      expect(packageType).toBeNull();
    });

    it("defaults billing interval to annual if it's an option", () => {
      const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Sras, subIdx: 0 }
      });

      const { billingInterval } = draftSubscriptions[0].draftSubscription;
      expect(billingInterval).toEqual(BillingInterval.Annual);
    });

    it("resets values and selects defaults if the app changes", () => {
      // SRAS, standard, monthly
      let state = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: AppId.Sras }
      });
      state = runImmerReducer(state, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 0, packageType: "standard" }
      });
      state = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 0, billingInterval: BillingInterval.Monthly }
      });
      // PDereporting, elite (default), annual (default)
      const { draftSubscriptions } = runImmerReducer(state, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: AppId.Pdereporting }
      });

      const { packageType, billingInterval } = draftSubscriptions[0].draftSubscription;
      expect(packageType).toEqual("elite");
      expect(billingInterval).toEqual(BillingInterval.Annual);
    });

    it("console errors if the provided app id is not an available option", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: "invalid" as AppId }
      });

      expect(console.error).toHaveBeenCalledWith("'invalid' is not an available option");
    });

    it("console errors if the provided subIdx is not a valid index", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { subIdx: 1, appId: AppId.Sras }
      });

      expect(console.error).toHaveBeenCalledWith("Invalid subscription index");
    });

    it("console errors if the state is not initialized", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initialState, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: AppId.Sras }
      });

      expect(console.error).toHaveBeenCalledWith("Subscription state is not initialized");
    });
  });

  describe("UPDATE_PACKAGE_TYPE", () => {
    it("console errors if the provided package type is not an available option", () => {
      jest.spyOn(console, "error").mockImplementation();
      const state = completeFirstSubscription();
      runImmerReducer(state, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 0, packageType: "invalid" }
      });

      expect(console.error).toHaveBeenCalledWith("'invalid' is not an available option");
    });

    it("console errors if the provided subIdx is not a valid index", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initializedCloudState, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 1, packageType: "standard" }
      });

      expect(console.error).toHaveBeenCalledWith("Invalid subscription index");
    });

    it("console errors if the state is not initialized", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initialState, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 0, packageType: "standard" }
      });

      expect(console.error).toHaveBeenCalledWith("Subscription state is not initialized");
    });
  });

  describe("UPDATE_BILLING_INTERVAL", () => {
    it("sets the min expire date to 1 month from today if the billing interval is monthly", () => {
      const state = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Sras, subIdx: 0 }
      });
      const { draftSubscriptions } = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { billingInterval: BillingInterval.Monthly, subIdx: 0 }
      });

      const { minExpireDate } = draftSubscriptions[0].options;
      const minDateFmt = format(minExpireDate, "yyyy-MM-dd");
      const expectedMinDate = format(addMonths(startOfToday(), 1), "yyyy-MM-dd");
      expect(minDateFmt).toEqual(expectedMinDate);
    });

    it("sets the min expire date to 1 year from today if the billing interval is annual", () => {
      const state = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { appId: AppId.Sras, subIdx: 0 }
      });
      const { draftSubscriptions } = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { billingInterval: BillingInterval.Annual, subIdx: 0 }
      });

      const { minExpireDate } = draftSubscriptions[0].options;
      const minDateFmt = format(minExpireDate, "yyyy-MM-dd");
      const expectedMinDate = format(addYears(startOfToday(), 1), "yyyy-MM-dd");
      expect(minDateFmt).toEqual(expectedMinDate);
    });

    it("console errors if the provided billing interval is not an available option", () => {
      jest.spyOn(console, "error").mockImplementation();
      const state = completeFirstSubscription();
      runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 0, billingInterval: "invalid" as BillingInterval }
      });

      expect(console.error).toHaveBeenCalledWith("'invalid' is not an available option");
    });

    it("console errors if the provided subIdx is not a valid index", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initializedCloudState, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 1, billingInterval: BillingInterval.Annual }
      });

      expect(console.error).toHaveBeenCalledWith("Invalid subscription index");
    });

    it("console errors if the state is not initialized", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initialState, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 0, billingInterval: BillingInterval.Annual }
      });

      expect(console.error).toHaveBeenCalledWith("Subscription state is not initialized");
    });
  });

  describe("UPDATE_EXPIRATION_DATE", () => {
    it("console errors if the provided subIdx is not a valid index", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initializedCloudState, {
        type: "UPDATE_EXPIRATION_DATE",
        payload: { subIdx: 1, expirationDate: addYears(new Date(), 2) }
      });

      expect(console.error).toHaveBeenCalledWith("Invalid subscription index");
    });

    it("console errors if the state is not initialized", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initialState, {
        type: "UPDATE_EXPIRATION_DATE",
        payload: { subIdx: 0, expirationDate: addYears(new Date(), 2) }
      });

      expect(console.error).toHaveBeenCalledWith("Subscription state is not initialized");
    });
  });

  describe("ADD_SUBSCRIPTION", () => {
    it("adds a new subscription to the state", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });

      expect(state.draftSubscriptions).toHaveLength(2);
    });

    it("console errors if the last subscription is not complete", () => {
      jest.spyOn(console, "error").mockImplementation();
      const { draftSubscriptions } = runImmerReducer(initializedCloudState, {
        type: "ADD_SUBSCRIPTION"
      });

      expect(console.error).toHaveBeenCalledWith(
        "Complete the last subscription to add more"
      );
      expect(draftSubscriptions).toHaveLength(1);
    });
  });

  describe("DELETE_SUBSCRIPTION", () => {
    it("removes a subscription from the state", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      state = runImmerReducer(state, {
        type: "DELETE_SUBSCRIPTION",
        payload: { subIdx: 1 }
      });

      expect(state.draftSubscriptions).toHaveLength(1);
    });

    it("console errors if the provided subIdx is not a valid index", () => {
      jest.spyOn(console, "error").mockImplementation();
      const state = completeFirstSubscription();
      runImmerReducer(state, { type: "DELETE_SUBSCRIPTION", payload: { subIdx: 1 } });

      expect(console.error).toHaveBeenCalledWith("Invalid subscription index");
    });

    it("console errors if the state is not initialized", () => {
      jest.spyOn(console, "error").mockImplementation();
      runImmerReducer(initialState, {
        type: "DELETE_SUBSCRIPTION",
        payload: { subIdx: 0 }
      });

      expect(console.error).toHaveBeenCalledWith("Subscription state is not initialized");
    });

    it("console errors if the first subscription is deleted", () => {
      jest.spyOn(console, "error").mockImplementation();
      const state = completeFirstSubscription();
      runImmerReducer(state, { type: "DELETE_SUBSCRIPTION", payload: { subIdx: 0 } });

      expect(console.error).toHaveBeenCalledWith("Cannot delete the first subscription");
    });
  });

  describe("canAddSubscription", () => {
    it("enables canAddSubscription when all required fields are set", () => {
      let state = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: AppId.Sras }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 0, packageType: "standard" }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 0, billingInterval: BillingInterval.Annual }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_EXPIRATION_DATE",
        payload: { subIdx: 0, expirationDate: addYears(new Date(), 2) }
      });
      expect(state.canAddSubscription).toBe(true);
    });

    it("enables canAddSubscription after a second subscriptions fields are complete", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      state = runImmerReducer(state, {
        type: "UPDATE_APP",
        payload: { subIdx: 1, appId: AppId.Sre }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 1, packageType: "standard" }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 1, billingInterval: BillingInterval.Annual }
      });
      expect(state.canAddSubscription).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_EXPIRATION_DATE",
        payload: { subIdx: 1, expirationDate: addYears(new Date(), 2) }
      });
      expect(state.canAddSubscription).toBe(true);
    });
  });

  describe("canSave", () => {
    it("returns true if at least 1 subscription is complete", () => {
      let state = runImmerReducer(initializedCloudState, {
        type: "UPDATE_APP",
        payload: { subIdx: 0, appId: AppId.Sras }
      });
      expect(state.canSave).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_PACKAGE_TYPE",
        payload: { subIdx: 0, packageType: "standard" }
      });
      expect(state.canSave).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_BILLING_INTERVAL",
        payload: { subIdx: 0, billingInterval: BillingInterval.Annual }
      });
      expect(state.canSave).toBe(false);

      state = runImmerReducer(state, {
        type: "UPDATE_EXPIRATION_DATE",
        payload: { subIdx: 0, expirationDate: addYears(new Date(), 2) }
      });
      expect(state.canSave).toBe(true);
    });

    it("returns true if at least 1 subscription is complete and others have no selections", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      expect(state.canSave).toBe(true);
    });

    it("returns false if a subscription is partially complete", () => {
      let state = completeFirstSubscription();
      state = runImmerReducer(state, { type: "ADD_SUBSCRIPTION" });
      state = runImmerReducer(state, {
        type: "UPDATE_APP",
        payload: { subIdx: 1, appId: AppId.Sre }
      });

      expect(state.canSave).toBe(false);
    });
  });
});
