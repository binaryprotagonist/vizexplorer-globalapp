import { BillingInterval } from "generated-graphql";
import { Environment } from "../../types";
import { Display } from "./utils";

describe("Subscription Form Utils", () => {
  describe("Display", () => {
    it("returns expected value for `ONPREM` environment", () => {
      expect(Display.environment(Environment.ONPREM)).toEqual("On-Premises");
    });

    it("returns expected value for `CLOUD` environment", () => {
      expect(Display.environment(Environment.CLOUD)).toEqual("Cloud");
    });

    it("returns expected value for `Monthly` billing interval", () => {
      expect(Display.billingInterval(BillingInterval.Monthly)).toEqual("Monthly");
    });

    it("returns expected value for `Annual` billing interval", () => {
      expect(Display.billingInterval(BillingInterval.Annual)).toEqual("Annual");
    });

    it("returns expected value for `premium` package type", () => {
      expect(Display.packageType("premium")).toEqual("Premium");
    });

    it("returns expected value for `standard` package type", () => {
      expect(Display.packageType("standard")).toEqual("Standard");
    });
  });
});
