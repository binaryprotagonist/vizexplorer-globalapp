import { produce } from "immer";
import { defaultWorthPctSetting } from "../types";
import { globalSettingInputFromNumericValue, inputLabel } from "./utils";

describe("EditGlobalSettings Utils", () => {
  describe("inputLabel", () => {
    it("returns expected label for `worth-pct` setting", () => {
      expect(inputLabel("worth-pct")).toEqual("Worth Percentage");
    });

    it("throws an error if a setting with an invalid setting ID is provided", () => {
      expect(() => inputLabel("invalid" as any)).toThrow();
    });
  });

  describe("globalSettingInputFromNumericValue", () => {
    it("returns expected Input for `worth-pct` setting", () => {
      expect(globalSettingInputFromNumericValue(defaultWorthPctSetting, 10)).toEqual({
        worthPercentage: 10
      });
    });

    it("throws an error a setting with an invalid variant is provided", () => {
      const invalidVariant = produce(defaultWorthPctSetting, (draft) => {
        draft.variant = "invalid" as any;
      });
      expect(() => globalSettingInputFromNumericValue(invalidVariant, 10)).toThrow();
    });

    it("throws an error if a setting with an invalid setting ID is provided", () => {
      const invalidId = produce(defaultWorthPctSetting, (draft) => {
        draft.id = "invalid" as any;
      });
      expect(() => globalSettingInputFromNumericValue(invalidId, 10)).toThrow();
    });
  });
});
