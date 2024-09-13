import { UserActionType } from "./types";
import { canUser, isAdmin, isOrgAdmin, UserDisplay } from "./utils";
import {
  generateDummyPdreHostAccess,
  generateDummyPdreHostManagerAccess,
  generateDummyUsers,
  mockOrgAdmin
} from "../testing/mocks";
import { produce } from "immer";
import { AppId, GaUserFragment, OrgAccessLevel } from "generated-graphql";

const appAdmin: GaUserFragment = {
  ...generateDummyUsers(1)[0],
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: { id: "sras", name: "Slot Reports" },
      role: { id: "admin", name: "Property Manager" },
      site: { id: "1", name: "Site 1" }
    }
  ]
};
const appViewer: GaUserFragment = {
  ...generateDummyUsers(1)[0],
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: { id: "sras", name: "Slot Reports" },
      role: { id: "viewer", name: "Property Viewer" },
      site: { id: "1", name: "Site 1" }
    }
  ]
};
const noAccess: GaUserFragment = {
  ...generateDummyUsers(1)[0],
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: []
};

describe("User Management Utils", () => {
  describe("canUser - ADD_USER", () => {
    it("returns true for OrgAdmin", () => {
      const res = canUser(mockOrgAdmin, { type: UserActionType.ADD_USER });
      expect(res).toBeTruthy();
    });

    it("returns true for Admin", () => {
      const res = canUser(appAdmin, { type: UserActionType.ADD_USER });
      expect(res).toBeTruthy();
    });

    it("returns false for Viewer", () => {
      const res = canUser(appViewer, { type: UserActionType.ADD_USER });
      expect(res).toBeFalsy();
    });

    it("returns false for user with no access", () => {
      const res = canUser(noAccess, { type: UserActionType.ADD_USER });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - DELETE_USER", () => {
    it("returns true for OrgAdmin if `otherUserId` is not their own", () => {
      const otherUserId = "_";
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.DELETE_USER,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns false for OrgAdmin if `otherUserId` is their own", () => {
      const otherUserId = mockOrgAdmin.id;
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.DELETE_USER,
        otherUserId
      });
      expect(res).toBeFalsy();
    });

    it("returns false for Admin", () => {
      const otherUserId = "_";
      const res = canUser(appAdmin, {
        type: UserActionType.DELETE_USER,
        otherUserId
      });
      expect(res).toBeFalsy();
    });

    it("returns false for Viewer", () => {
      const otherUserId = "_";
      const res = canUser(appViewer, {
        type: UserActionType.DELETE_USER,
        otherUserId
      });
      expect(res).toBeFalsy();
    });

    it("returns false for user with no access", () => {
      const otherUserId = "_";
      const res = canUser(noAccess, {
        type: UserActionType.DELETE_USER,
        otherUserId
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - EDIT_PROFILE", () => {
    it("returns true for OrgAdmin if `otherUserId` is not their own", () => {
      const otherUserId = "_";
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns true for OrgAdmin if `otherUserId` is their own", () => {
      const otherUserId = mockOrgAdmin.id;
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns true for Admin if `otherUserId` is their own", () => {
      const otherUserId = appAdmin.id;
      const res = canUser(appAdmin, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns false for Admin if `otherUserId` is not their own", () => {
      const otherUserId = "_";
      const res = canUser(appAdmin, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeFalsy();
    });

    it("returns true for Viewer if `otherUserId` is their own", () => {
      const otherUserId = appViewer.id;
      const res = canUser(appViewer, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns false for Viewer if `otherUserId` is not their own", () => {
      const otherUserId = "_";
      const res = canUser(appViewer, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeFalsy();
    });

    it("returns true for user with no access if `otherUserId` is their own", () => {
      const otherUserId = noAccess.id;
      const res = canUser(noAccess, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeTruthy();
    });

    it("returns false for user with no access if `otherUserId` is not their own", () => {
      const otherUserId = "_";
      const res = canUser(noAccess, {
        type: UserActionType.EDIT_PROFILE,
        otherUserId
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_ACCESS", () => {
    it("returns true for OrgAdmin if `otherUser` is not themself", () => {
      const otherUser = { ...generateDummyUsers(1)[0], id: "_" };
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.EDIT_USER,
        otherUser
      });
      expect(res).toBeTruthy();
    });

    it("returns true for Admin if `otherUser` is not themself and not an OrgAdmin", () => {
      const otherUser = { ...appAdmin, id: "_" };
      const res = canUser(appAdmin, {
        type: UserActionType.EDIT_USER,
        otherUser
      });
      expect(res).toBeTruthy();
    });

    it("returns false for Admin if `otherUser` is an OrgAdmin", () => {
      const otherUser = mockOrgAdmin;
      const res = canUser(appAdmin, {
        type: UserActionType.EDIT_USER,
        otherUser
      });
      expect(res).toBeFalsy();
    });

    it("returns false for Viewer", () => {
      const otherUser = { ...generateDummyUsers(1)[0], id: "_" };
      const res = canUser(appViewer, {
        type: UserActionType.EDIT_USER,
        otherUser
      });
      expect(res).toBeFalsy();
    });

    it("returns false for user with no access", () => {
      const otherUser = { ...generateDummyUsers(1)[0], id: "_" };
      const res = canUser(noAccess, {
        type: UserActionType.EDIT_USER,
        otherUser
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_PROPERTIES", () => {
    it("returns true for `OrgAdmin`", () => {
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.MANAGE_PROPERTIES
      });
      expect(res).toBeTruthy();
    });

    it("returns false for `Admin`", () => {
      const res = canUser(appAdmin, { type: UserActionType.MANAGE_PROPERTIES });
      expect(res).toBeFalsy();
    });

    it("returns false for `Viewer`", () => {
      const res = canUser(appAdmin, { type: UserActionType.MANAGE_PROPERTIES });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - ACCESS_APP", () => {
    it("retuns true for `OrgAdmin` if they have the appId in their accessList", () => {
      const appId = mockOrgAdmin.accessList[0].app.id;
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.ACCESS_APP,
        appId
      });
      expect(res).toBeTruthy();
    });

    it("returns true for `Admin` if they have the appId in their accessList", () => {
      const appId = appAdmin.accessList[0].app.id;
      const res = canUser(appAdmin, { type: UserActionType.ACCESS_APP, appId });
      expect(res).toBeTruthy();
    });

    it("returns false for` Admin` if they don't have the appId in their accessList", () => {
      const appId = "_";
      const res = canUser(appAdmin, { type: UserActionType.ACCESS_APP, appId });
      expect(res).toBeFalsy();
    });

    it("returns true for `Viewer` if they have the appId in their accessList", () => {
      const appId = appViewer.accessList[0].app.id;
      const res = canUser(appViewer, {
        type: UserActionType.ACCESS_APP,
        appId
      });
      expect(res).toBeTruthy();
    });

    it("returns false for` Viewer` if they don't have the appId in their accessList", () => {
      const appId = "_";
      const res = canUser(appViewer, {
        type: UserActionType.ACCESS_APP,
        appId
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - ACCESS_PD_SUITE", () => {
    it("retuns true for `OrgAdmin` if they have a PD Suite app in their accessList", () => {
      const pdSuiteOrgAdmin = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteOrgAdmin, {
        type: UserActionType.ACCESS_PD_SUITE
      });
      expect(res).toBeTruthy();
    });

    it("returns true for PD Suite admin", () => {
      const pdSuiteAdmin = produce(appAdmin, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteAdmin, { type: UserActionType.ACCESS_PD_SUITE });
      expect(res).toBeTruthy();
    });

    it("returns true for PD Suite host", () => {
      const pdSuiteHost = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostAccess();
      });
      const res = canUser(pdSuiteHost, { type: UserActionType.ACCESS_PD_SUITE });
      expect(res).toBeTruthy();
    });

    it("returns true PD Suite viewer", () => {
      const pdSuiteViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteViewer, { type: UserActionType.ACCESS_PD_SUITE });
      expect(res).toBeTruthy();
    });

    it("returns false if the user doesn't have a PD Suite app in their accessList", () => {
      const noPdAccess = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Sras;
      });
      const res = canUser(noPdAccess, { type: UserActionType.ACCESS_PD_SUITE });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - ACCESS_PD_SUITE_FOR_SITE", () => {
    it("returns true for a PD Suite admin", () => {
      const pdSuiteAdmin = produce(appAdmin, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteAdmin, {
        type: UserActionType.ACCESS_PD_SUITE_FOR_SITE,
        siteId: pdSuiteAdmin.accessList[0].site.id
      });
      expect(res).toBeTruthy();
    });

    it("returns true for a PD Suite host for the site", () => {
      const pdSuiteHost = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostAccess(1);
      });
      const res = canUser(pdSuiteHost, {
        type: UserActionType.ACCESS_PD_SUITE_FOR_SITE,
        siteId: pdSuiteHost.accessList[0].site.id
      });
      expect(res).toBeTruthy();
    });

    it("returns PD Suite viewer for the site", () => {
      const pdSuiteViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteViewer, {
        type: UserActionType.ACCESS_PD_SUITE_FOR_SITE,
        siteId: pdSuiteViewer.accessList[0].site.id
      });
      expect(res).toBeTruthy();
    });

    it("returns false if the user doesn't have a PD Suite app in their accessList for the site", () => {
      const noSiteAccess = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(noSiteAccess, {
        type: UserActionType.ACCESS_PD_SUITE_FOR_SITE,
        siteId: "99"
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_PD_SUITE", () => {
    it("returns true for `OrgAdmin` if they have a PD Suite app in their accessList", () => {
      const pdSuiteOrgAdmin = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteOrgAdmin, {
        type: UserActionType.MANAGE_PD_SUITE
      });
      expect(res).toBeTruthy();
    });

    it("returns true for a PD Suite app admin", () => {
      const pdSuiteAdmin = produce(appAdmin, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteAdmin, { type: UserActionType.MANAGE_PD_SUITE });
      expect(res).toBeTruthy();
    });

    it("returns true for a PD Suite host manager", () => {
      const pdSuiteHostManager = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostManagerAccess(1);
      });
      const res = canUser(pdSuiteHostManager, { type: UserActionType.MANAGE_PD_SUITE });
      expect(res).toBeTruthy();
    });

    it("returns false for a PD Suite host", () => {
      const pdSuiteHost = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostAccess(1);
      });
      const res = canUser(pdSuiteHost, { type: UserActionType.MANAGE_PD_SUITE });
      expect(res).toBeFalsy();
    });

    it("returns false for a PD Suite viewer", () => {
      const pdSuiteViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteViewer, { type: UserActionType.MANAGE_PD_SUITE });
      expect(res).toBeFalsy();
    });

    it("returns false if the user doesn't have a PD Suite app in their accessList", () => {
      const res = canUser(appAdmin, { type: UserActionType.MANAGE_PD_SUITE });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_PD_SUITE_FOR_SITE", () => {
    it("returns true for a PD Suite admin for the site", () => {
      const pdSuiteAdmin = produce(appAdmin, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteAdmin, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: pdSuiteAdmin.accessList[0].site.id
      });
      expect(res).toBeTruthy();
    });

    it("returns true for a PD Suite host manager for the site", () => {
      const pdSuiteHostManager = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostManagerAccess(1);
      });
      const res = canUser(pdSuiteHostManager, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: pdSuiteHostManager.accessList[0].site.id
      });
      expect(res).toBeTruthy();
    });

    it("returns false for a PD Suite host for the site", () => {
      const pdSuiteHost = produce(appViewer, (draft) => {
        draft.accessList = generateDummyPdreHostAccess(1);
      });
      const res = canUser(pdSuiteHost, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: pdSuiteHost.accessList[0].site.id
      });
      expect(res).toBeFalsy();
    });

    it("returns false for a PD Suite viewer for the site", () => {
      const pdSuiteViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Pdengage;
      });
      const res = canUser(pdSuiteViewer, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: pdSuiteViewer.accessList[0].site.id
      });
      expect(res).toBeFalsy();
    });

    it("returns false for an admin of a non-PD Suite app", () => {
      const res = canUser(appAdmin, {
        type: UserActionType.MANAGE_PD_SUITE_FOR_SITE,
        siteId: appAdmin.accessList[0].site.id
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_SUBSCRIPTION", () => {
    it("retuns true for `OrgAdmin`", () => {
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.MANAGE_SUBSCRIPTION
      });
      expect(res).toBeTruthy();
    });

    it("returns false for `Admin`", () => {
      const res = canUser(appAdmin, {
        type: UserActionType.MANAGE_SUBSCRIPTION
      });
      expect(res).toBeFalsy();
    });

    it("returns false for `Viewer`", () => {
      const res = canUser(appViewer, {
        type: UserActionType.MANAGE_SUBSCRIPTION
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_PAYMENT", () => {
    it("retuns true for `OrgAdmin`", () => {
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.MANAGE_PAYMENT
      });
      expect(res).toBeTruthy();
    });

    it("returns false for `Admin`", () => {
      const res = canUser(appAdmin, {
        type: UserActionType.MANAGE_PAYMENT
      });
      expect(res).toBeFalsy();
    });

    it("returns false for `Viewer`", () => {
      const res = canUser(appViewer, {
        type: UserActionType.MANAGE_PAYMENT
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - MANAGE_LICENSE", () => {
    it("retuns true for `OrgAdmin`", () => {
      const res = canUser(mockOrgAdmin, {
        type: UserActionType.MANAGE_PAYMENT
      });
      expect(res).toBeTruthy();
    });

    it("returns false for `Admin`", () => {
      const res = canUser(appAdmin, {
        type: UserActionType.MANAGE_LICENSE
      });
      expect(res).toBeFalsy();
    });

    it("returns false for `Viewer`", () => {
      const res = canUser(appViewer, {
        type: UserActionType.MANAGE_LICENSE
      });
      expect(res).toBeFalsy();
    });
  });

  describe("canUser - ACCESS_DATA_CONN", () => {
    it("returns true for a user with PDR access", () => {
      const pdrViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Pdr;
      });
      const res = canUser(pdrViewer, {
        type: UserActionType.ACCESS_DATA_CONN
      });
      expect(res).toBeTruthy();
    });

    it("returns false for a user with SRE access", () => {
      const sreViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Sre;
      });
      const res = canUser(sreViewer, {
        type: UserActionType.ACCESS_DATA_CONN
      });
      expect(res).toBeFalsy();
    });

    it("returns false for a user with SRAS access", () => {
      const srasViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Sras;
      });
      const res = canUser(srasViewer, {
        type: UserActionType.ACCESS_DATA_CONN
      });
      expect(res).toBeFalsy();
    });

    it("returns false for a user with Floorheatmap access", () => {
      const floorheatmapViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Floorheatmap;
      });
      const res = canUser(floorheatmapViewer, {
        type: UserActionType.ACCESS_DATA_CONN
      });
      expect(res).toBeFalsy();
    });

    it("returns false for a user without data connection app access", () => {
      const marViewer = produce(appViewer, (draft) => {
        draft.accessList[0].app.id = AppId.Mar;
      });
      const res = canUser(marViewer, {
        type: UserActionType.ACCESS_DATA_CONN
      });
      expect(res).toBeFalsy();
    });
  });

  describe("UserDisplay", () => {
    describe("accessLevel", () => {
      it("returns expected value for OrgAdmin", () => {
        const display = UserDisplay.accessLevel(OrgAccessLevel.OrgAdmin);
        expect(display).toEqual("Org Admin");
      });

      it("returns expected value for AppSpecific", () => {
        const display = UserDisplay.accessLevel(OrgAccessLevel.AppSpecific);
        expect(display).toEqual("App Specific");
      });

      it("returns default value for unexpected input", () => {
        const display = UserDisplay.accessLevel("unexpected" as any);
        expect(display).toEqual("unexpected");
      });
    });
  });

  describe("isOrgAdmin", () => {
    it("returns true for `OrgAdmin`", () => {
      expect(isOrgAdmin(OrgAccessLevel.OrgAdmin)).toBeTruthy();
    });

    it("returns false for `AppSpecific`", () => {
      expect(isOrgAdmin(OrgAccessLevel.AppSpecific)).toBeFalsy();
    });
  });

  describe("isAdmin", () => {
    it("returns true if user manages at least 1 property", () => {
      const multiRole = {
        ...appAdmin,
        accessList: [...appViewer.accessList, ...appAdmin.accessList]
      };
      expect(isAdmin(multiRole)).toBeTruthy();
    });

    it("returns true for an OrgAdmin", () => {
      expect(isAdmin(mockOrgAdmin)).toBeTruthy();
    });

    it("returns false if user only has view permission", () => {
      expect(isAdmin(appViewer)).toBeFalsy();
    });

    it("returns false if the user has no permissions", () => {
      expect(isAdmin(noAccess)).toBeFalsy();
    });
  });
});
