import { OrgCreateFormInput } from "./types";
import { isFormValid } from "./utils";

describe("OrgCreate utils", () => {
  describe("isFormValid", () => {
    const completedOrgCreateForm: OrgCreateFormInput = {
      name: "My Org",
      email: "myorg@test.com",
      phone: "+12015550123",
      addressLine1: "123 Fake St",
      addressLine2: "",
      city: "Springfield",
      state: "Some State",
      zip: "123",
      country: "us"
    };
    const emptyTakenNames: Set<string> = new Set();

    it("returns true for a completed form", () => {
      expect(isFormValid(completedOrgCreateForm, emptyTakenNames)).toBe(true);
    });

    it("returns false if `name` is empty", () => {
      const form = { ...completedOrgCreateForm, name: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("returns false if `email` is empty", () => {
      const form = { ...completedOrgCreateForm, email: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("returns false if `phone` is empty", () => {
      const form = { ...completedOrgCreateForm, phone: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("returns false if `addressLine1` is empty", () => {
      const form = { ...completedOrgCreateForm, addressLine1: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("returns false if `city` is empty", () => {
      const form = { ...completedOrgCreateForm, city: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("returns false if `zip` is empty", () => {
      const form = { ...completedOrgCreateForm, zip: " " };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });

    it("doesn't require `addressLine2` to be filled", () => {
      const form = { ...completedOrgCreateForm, addressLine2: "" };
      expect(isFormValid(form, emptyTakenNames)).toBe(true);
    });

    it("doesn't require `state` to be filled", () => {
      const form = { ...completedOrgCreateForm, state: "" };
      expect(isFormValid(form, emptyTakenNames)).toBe(true);
    });

    it("returns false if `name` is taken", () => {
      const form = { ...completedOrgCreateForm };
      const takenOrgNames = new Set([form.name.toLowerCase()]);
      expect(isFormValid(form, takenOrgNames)).toBe(false);
    });

    it("returns false if trimmed `name` is taken", () => {
      const form = { ...completedOrgCreateForm, name: " My Org " };
      const takenOrgNames = new Set([form.name.trim().toLowerCase()]);
      expect(isFormValid(form, takenOrgNames)).toBe(false);
    });

    it("returns false if `email` is invalid", () => {
      const form = { ...completedOrgCreateForm, email: "not-an-email" };
      expect(isFormValid(form, emptyTakenNames)).toBe(false);
    });
  });
});
