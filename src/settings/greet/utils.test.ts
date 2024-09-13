import { mockAdmin, mockOrgAdmin, mockPDEngageAdminAccess } from "testing/mocks";
import { canAccessGreetView } from "./utils";
import { produce } from "immer";

describe("Greet Utils", () => {
  describe("canAccessGreetView", () => {
    it("returns true for greet-rules", () => {
      expect(canAccessGreetView("greet-rules", mockAdmin)).toEqual(true);
    });

    it("returns true for system-settings for Org Admin", () => {
      expect(canAccessGreetView("system-settings", mockOrgAdmin)).toEqual(true);
    });

    it("returns false for system-settings for non-Org Admin", () => {
      const pdengageAdmin = produce(mockAdmin, (draft) => {
        draft.accessList = [mockPDEngageAdminAccess];
      });
      expect(canAccessGreetView("system-settings", pdengageAdmin)).toEqual(false);
    });
  });
});
