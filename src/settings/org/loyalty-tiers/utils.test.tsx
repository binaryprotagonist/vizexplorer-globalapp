import {
  generateDummyLoyaltyTiers,
  mockAdmin,
  mockOrgAdmin,
  mockViewer
} from "../../../view/testing/mocks";
import { disableManageTiersReasoning } from "./utils";

const mockTiers = generateDummyLoyaltyTiers();

describe("Loyalty Tiers Utils", () => {
  describe("disableManageTiersReasoning", () => {
    it("returns empty string if user is OrgAdmin, tiers are available and loading is false", () => {
      const reasoning = disableManageTiersReasoning(mockOrgAdmin, mockTiers, false);
      expect(reasoning).toEqual("");
    });

    it("returns expected reasoning if user is Admin", () => {
      const reasoning = disableManageTiersReasoning(mockAdmin, mockTiers, false);
      expect(reasoning).toEqual(
        "You don't have permission to add new tiers. Please contact an Admin"
      );
    });

    it("returns expected reasoning if user is Viewer", () => {
      const reasoning = disableManageTiersReasoning(mockViewer, mockTiers, false);
      expect(reasoning).toEqual(
        "You don't have permission to add new tiers. Please contact an Admin"
      );
    });

    it("returns expected reasoning if user is null", () => {
      const reasoning = disableManageTiersReasoning(null, mockTiers, false);
      expect(reasoning).toEqual("Loading...");
    });

    it("returns expected reasoning if tiers is empty", () => {
      const reasoning = disableManageTiersReasoning(mockOrgAdmin, [], false);
      expect(reasoning).toEqual("No Loyalty Tiers to manage");
    });

    it("returns expected reasoning if loading is true", () => {
      const reasoning = disableManageTiersReasoning(mockOrgAdmin, mockTiers, true);
      expect(reasoning).toEqual("Loading...");
    });
  });
});
