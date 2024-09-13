import { produce } from "immer";
import { mockAdmin, mockOrgAdmin, mockViewer } from "../../view/testing/mocks";
import { UserActionTypePd } from "./types";

jest.mock("../../utils", () => ({
  isAdminBuild: jest.fn(),
  baseUrl: jest.fn()
}));

describe("App Build - PDRE Utils", () => {
  let canUserPdre: any;
  let isAdminBuild: any;

  beforeAll(() => {
    jest.resetModules();

    jest.mock("../../utils", () => ({
      isAdminBuild: jest.fn().mockImplementation(() => false),
      baseUrl: jest.fn()
    }));

    jest.isolateModules(async () => {
      const pdreUtils = await import("./utils");
      const generalUtils = await import("../../utils");
      canUserPdre = pdreUtils.canUserPdre;
      isAdminBuild = generalUtils.isAdminBuild;
    });
  });

  it("is app build", () => {
    expect(isAdminBuild()).toEqual(false);
  });

  describe("canUserPdre - EDIT_RULE", () => {
    it("returns true for OrgAdmin", () => {
      expect(
        canUserPdre(mockOrgAdmin, {
          type: UserActionTypePd.EDIT_RULE,
          siteId: 0
        })
      ).toBeTruthy();
    });

    it("returns true for a site admin with `pdre` access", () => {
      // add pdre access for accessList[0] which is site_id = 0
      const adminPdre = produce(mockAdmin, (draft) => {
        draft.accessList[0].app.id = "pdre";
      });
      expect(
        canUserPdre(adminPdre, { type: UserActionTypePd.EDIT_RULE, siteId: "0" })
      ).toBeTruthy();
    });

    it("returns false for a site admin without `pdre` access", () => {
      expect(
        canUserPdre(mockAdmin, { type: UserActionTypePd.EDIT_RULE, siteId: "0" })
      ).toBeFalsy();
    });

    it("returns false for a viewer with `pdre` access", () => {
      // add pdre access for accessList[0] which is site_id = 0
      const viewerPdre = produce(mockViewer, (draft) => {
        draft.accessList[0].app.id = "pdre";
      });
      expect(
        canUserPdre(viewerPdre, { type: UserActionTypePd.EDIT_RULE, siteId: "0" })
      ).toBeFalsy();
    });

    it("returns false for a viewer without `pdre` access", () => {
      expect(
        canUserPdre(mockViewer, { type: UserActionTypePd.EDIT_RULE, siteId: "0" })
      ).toBeFalsy();
    });
  });
});

describe("Admin Build - PDRE Utils", () => {
  let canUserPdre: any;
  let isAdminBuild: any;

  beforeAll(() => {
    jest.resetModules();

    jest.mock("../../utils", () => ({
      isAdminBuild: jest.fn().mockImplementation(() => true),
      baseUrl: jest.fn()
    }));

    jest.isolateModules(async () => {
      const pdreUtils = await import("./utils");
      const generalUtils = await import("../../utils");
      canUserPdre = pdreUtils.canUserPdre;
      isAdminBuild = generalUtils.isAdminBuild;
    });
  });

  it("is admin build", () => {
    expect(isAdminBuild()).toBeTruthy();
  });

  describe("canUserPdre - EDIT_RULE", () => {
    it("returns true regardless of user permission", () => {
      expect(
        canUserPdre(mockViewer, {
          type: UserActionTypePd.EDIT_RULE,
          siteId: 99
        })
      ).toBeTruthy();
    });
  });
});
