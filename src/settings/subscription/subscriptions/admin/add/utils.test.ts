import { addMonths, addYears, startOfToday, subDays } from "date-fns";
import { AppId, BillingInterval } from "generated-graphql";
import { produce } from "immer";
import { generateDummyAppSubscriptions } from "testing/mocks";
import { mockSrePremiumCloudAnnual, mockSubscriptionPlans } from "testing/mocks/admin";
import {
  billingIntervalAsOption,
  environmentAsOption,
  FormOptions,
  FormValues,
  packageTypeAsOption
} from "../../shared";
import { fixtSreForm } from "../../shared/form/__fixtures__";
import { Environment } from "../../types";
import {
  buildBillingIntervalOptions,
  buildEnvOptions,
  buildExpireDateOptions,
  buildPackageTypeOptions,
  findAvailablePlans,
  isFormValid,
  subscriptionPlanFromForm
} from "./utils";

// used in `isFormValid` which only cares about the expireDateOptions currently
const dummyFormOptions: FormOptions = {
  expireDateOptions: { min: new Date() }
} as FormOptions;

describe("SubscriptionAdd Utils", () => {
  describe("buildEnvOptions", () => {
    it("returns all environment options if the application supports it", () => {
      const envOptions = buildEnvOptions(AppId.Sre, mockSubscriptionPlans);
      const cloud = environmentAsOption(Environment.CLOUD);
      const onprem = environmentAsOption(Environment.ONPREM);
      expect(envOptions).toEqual([cloud, onprem]);
    });

    it("returns only `Cloud` for cloud only apps", () => {
      const envOptions = buildEnvOptions(AppId.Mar, mockSubscriptionPlans);
      expect(envOptions).toEqual([environmentAsOption(Environment.CLOUD)]);
    });
  });

  describe("buildBillingIntervalOptions", () => {
    it("returns all billing interval options if the application supports it", () => {
      const intervalOptions = buildBillingIntervalOptions(
        AppId.Sre,
        mockSubscriptionPlans
      );
      const annual = billingIntervalAsOption(BillingInterval.Annual);
      const monthly = billingIntervalAsOption(BillingInterval.Monthly);
      expect(intervalOptions).toEqual([annual, monthly]);
    });

    it("returns only `Annual` for apps which only support annual billing", () => {
      const intervalOptions = buildBillingIntervalOptions(
        AppId.Mar,
        mockSubscriptionPlans
      );
      const annual = billingIntervalAsOption(BillingInterval.Annual);
      expect(intervalOptions).toEqual([annual]);
    });
  });

  describe("buildPackageTypeOptions", () => {
    it("returns all package type options if the application supports it", () => {
      const packageOptions = buildPackageTypeOptions(AppId.Sre, mockSubscriptionPlans);
      const premium = packageTypeAsOption("premium");
      const standard = packageTypeAsOption("standard");
      expect(packageOptions).toEqual([premium, standard]);
    });

    it("returns only `Premium` for apps which only support premium", () => {
      const packageOptions = buildPackageTypeOptions(AppId.Mar, mockSubscriptionPlans);
      const premium = packageTypeAsOption("premium");
      expect(packageOptions).toEqual([premium]);
    });
  });

  describe("buildExpireDateOptions", () => {
    it("sets `min` to today + 1 month if `Montly` billing is provided", () => {
      const options = buildExpireDateOptions(BillingInterval.Monthly);
      expect(options.min).toEqual(addMonths(startOfToday(), 1));
    });

    it("sets `min` to today + 1 year if `Annual` billing is provided", () => {
      const options = buildExpireDateOptions(BillingInterval.Annual);
      expect(options.min).toEqual(addYears(startOfToday(), 1));
    });
  });

  describe("subscriptionPlanFromForm", () => {
    it("returns matching plan", () => {
      const matchedPlan = subscriptionPlanFromForm(fixtSreForm, mockSubscriptionPlans);
      expect(matchedPlan).toEqual(mockSrePremiumCloudAnnual);
    });

    it("throws an error if it matches multiple plans", () => {
      const duplicatePlans = [...mockSubscriptionPlans, ...mockSubscriptionPlans];
      expect(() => subscriptionPlanFromForm(fixtSreForm, duplicatePlans)).toThrowError(
        "Found multiple plans matching provided parameters"
      );
    });

    it("throws an error if it fails to match any plan", () => {
      const invalidForm = { ...fixtSreForm, appId: "_invalid_" as any };
      expect(() =>
        subscriptionPlanFromForm(invalidForm, mockSubscriptionPlans)
      ).toThrowError("Failed to find plan matching provided parameters");
    });
  });

  describe("isFormValid", () => {
    it("returns true if the form is valid", () => {
      expect(isFormValid(fixtSreForm, dummyFormOptions)).toBeTruthy();
    });

    it("returns false if `appId` is null", () => {
      const invalid: FormValues = { ...fixtSreForm, appId: null };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `billingInterval` is null", () => {
      const invalid: FormValues = { ...fixtSreForm, billingInterval: null };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `environment` is null", () => {
      const invalid: FormValues = { ...fixtSreForm, environment: null };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `packageType` is null", () => {
      const invalid: FormValues = { ...fixtSreForm, packageType: null };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `expirationDate` is null", () => {
      const invalid: FormValues = { ...fixtSreForm, expirationDate: null };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `expirationDate` is not a Date", () => {
      const invalid: FormValues = {
        ...fixtSreForm,
        expirationDate: new Date("")
      };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });

    it("returns false if `expirationDate` is before the `min` allowed date", () => {
      const invalid: FormValues = {
        ...fixtSreForm,
        expirationDate: subDays(new Date(), 1)
      };
      expect(isFormValid(invalid, dummyFormOptions)).toBeFalsy();
    });
  });

  describe("findAvailablePlans", () => {
    it("returns all plans if no apps are provided", () => {
      expect(findAvailablePlans(mockSubscriptionPlans, [])).toHaveLength(
        mockSubscriptionPlans.length
      );
    });

    it("only returns plans for apps that aren't already subscribed and valid", () => {
      const appSubs = produce(generateDummyAppSubscriptions(2), (draft) => {
        draft[0].id = "sre"; // valid sre subscription (can't be re-added)
        draft[1].id = "mar"; // invalid mar subscription (can be renewed)
        draft[1].subscription!.isValid = false;
      });
      const availablePlans = findAvailablePlans(mockSubscriptionPlans, appSubs);
      expect(availablePlans).toHaveLength(1);
      expect(availablePlans[0].appId).toEqual(AppId.Mar);
    });

    it("only returns On-Prem plans if an existing On-Prem subscription is valid", () => {
      const appSubs = produce(generateDummyAppSubscriptions(1), (draft) => {
        draft[0].id = "mar";
        draft[0].subscription!.isOnprem = true;
      });

      const availablePlans = findAvailablePlans(mockSubscriptionPlans, appSubs);
      // 2x SRE onprem plans
      expect(availablePlans).toHaveLength(2);
      availablePlans.forEach((plan) => {
        expect(plan.isOnprem).toBeTruthy();
      });
    });

    it("only returns Cloud plans if an existing Cloud subscription is valid", () => {
      const appSubs = produce(generateDummyAppSubscriptions(1), (draft) => {
        draft[0].id = "mar";
        draft[0].subscription!.isOnprem = false;
      });

      const availablePlans = findAvailablePlans(mockSubscriptionPlans, appSubs);
      // 4x SRE Cloud plans
      expect(availablePlans).toHaveLength(4);
      availablePlans.forEach((plan) => {
        expect(plan.isOnprem).toBeFalsy();
      });
    });

    it("doesn't filter plans by Environment if existing subscriptions are not valid", () => {
      const appSubs = produce(generateDummyAppSubscriptions(1), (draft) => {
        draft[0].id = "mar";
        draft[0].subscription!.isOnprem = false;
        draft[0].subscription!.isValid = false;
      });

      const availablePlans = findAvailablePlans(mockSubscriptionPlans, appSubs);
      // All plans
      expect(availablePlans).toHaveLength(mockSubscriptionPlans.length);
    });
  });
});
