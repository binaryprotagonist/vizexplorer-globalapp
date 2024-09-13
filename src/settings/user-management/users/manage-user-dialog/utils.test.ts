import { GaAccessListFragment, OrgAccessLevel } from "generated-graphql";
import {
  accessLevelOptions,
  buildAppOptions,
  buildManagedSitesByApp,
  buildRoleOptions,
  buildSiteOptions,
  canEditAccessRow,
  hasFormChanged,
  isFormComplete,
  isNameTaken,
  passwordDisplay,
  requireEmailValidation,
  showAccessLevel,
  showAccessList,
  userManagementUserAsReducerUser,
  userToCreateUserV2Input,
  userToUserUpdateInput
} from "./utils";
import { UserManagement, ManagedSitesByApp } from "./types";
import { ReducerAccess, ReducerUser } from "./manage-user-reducer/types";
import { produce } from "immer";
import { mockOrgAdmin } from "testing/mocks";
import {
  createDummyManageUserAdmin,
  generateDummyManageUserSites,
  mockManageUserPDengageApp,
  mockManageUserSrasApp
} from "./__mocks__/manage-user-dialog";
import { UserCreateV2MutationVariables } from "./__generated__/manage-user-dialog";
import { mockUserManagementAdmin, mockUserManagementOrgAdmin } from "../__mocks__/users";

const mockApps = [mockManageUserSrasApp, mockManageUserPDengageApp];
const numSites = 3;
const mockSites = generateDummyManageUserSites(numSites);
const mockAdminUser = createDummyManageUserAdmin(numSites);

// sites the user has admin access to for the respective app
const managedSrasSites = [mockSites[0], mockSites[1]];
const managedPDEngageSites = [mockSites[0], mockSites[2]];
const managedSitesByApp: ManagedSitesByApp[] = [
  { app: mockManageUserSrasApp, sites: managedSrasSites },
  { app: mockManageUserPDengageApp, sites: managedPDEngageSites }
];
// sites the user doesn't have admin access to for the respective app
const unmanagedSrasSites = [mockSites[2]];

describe("User Management Dialog Utils", () => {
  describe("accessLevelOptions", () => {
    it("includes expected options for non Org Admin", () => {
      expect(accessLevelOptions(OrgAccessLevel.AppSpecific)).toEqual([
        OrgAccessLevel.AppSpecific,
        OrgAccessLevel.NoAccess
      ]);
    });

    it("inclues expected options for an Org Admin", () => {
      expect(accessLevelOptions(OrgAccessLevel.OrgAdmin)).toEqual([
        OrgAccessLevel.OrgAdmin,
        OrgAccessLevel.AppSpecific,
        OrgAccessLevel.NoAccess
      ]);
    });
  });

  describe("buildAppOptions", () => {
    it("returns apps the user has access to", () => {
      const manageSitesByApp: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites }
      ];

      expect(buildAppOptions({}, [{}], mockApps, manageSitesByApp)).toEqual([
        mockManageUserPDengageApp
      ]);
    });

    it("includes the app in the current row even if the user doesn't have permission", () => {
      const manageSitesByApp: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites }
      ];
      const currentRow: ReducerAccess = { app: { id: mockManageUserSrasApp.id } };

      expect(
        buildAppOptions(currentRow, [currentRow], mockApps, manageSitesByApp)
      ).toEqual([mockManageUserSrasApp, mockManageUserPDengageApp]);
    });

    it("does not return apps where all properties have been exhausted", () => {
      const manageSitesByApp: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites },
        { app: mockManageUserSrasApp, sites: mockSites }
      ];
      // all sites for PDEngage have been selected in other rows
      const allRows: ReducerAccess[] = mockSites.map((site) => ({
        app: { id: mockManageUserPDengageApp.id },
        site
      }));

      expect(buildAppOptions({}, allRows, mockApps, manageSitesByApp)).toEqual([
        mockManageUserSrasApp
      ]);
    });

    it("includes the app in the current row even if all properties have been exhausted", () => {
      const manageSitesByApp: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites },
        { app: mockManageUserSrasApp, sites: mockSites }
      ];
      // all sites for PDEngage have been selected in other rows
      const allRows: ReducerAccess[] = mockSites.map((site) => ({
        app: { id: mockManageUserPDengageApp.id },
        site
      }));
      const currentRow = allRows[0];

      expect(buildAppOptions(currentRow, allRows, mockApps, manageSitesByApp)).toEqual([
        mockManageUserSrasApp,
        mockManageUserPDengageApp
      ]);
    });
  });

  describe("buildSiteOptions", () => {
    it("returns an empty array if the row doesn't have an app", () => {
      const row: ReducerAccess = {};
      expect(buildSiteOptions(row, [row], mockSites, managedSitesByApp)).toEqual([]);
    });

    it("returns all sites the user has access to if the site hasn't been used in other rows", () => {
      const row: ReducerAccess = { app: { id: mockManageUserSrasApp.id } };
      expect(buildSiteOptions(row, [row], mockSites, managedSitesByApp)).toEqual(
        managedSrasSites
      );
    });

    it("returns the selected site even if the user doesn't have access it", () => {
      const row: ReducerAccess = {
        app: { id: mockManageUserSrasApp.id },
        site: unmanagedSrasSites[0]
      };
      expect(buildSiteOptions(row, [row], mockSites, managedSitesByApp)).toEqual([
        ...managedSrasSites,
        unmanagedSrasSites[0]
      ]);
    });

    it("doesn't return sites for an app that have been used in other rows", () => {
      const row: ReducerAccess = { app: { id: mockManageUserSrasApp.id } };
      const allRows: ReducerAccess[] = [
        { app: { id: mockManageUserSrasApp.id }, site: managedSrasSites[0] }
      ];
      expect(buildSiteOptions(row, allRows, mockSites, managedSitesByApp)).toEqual([
        managedSrasSites[1]
      ]);
    });

    it("doesn't return any sites if the user doesn't have access to the app", () => {
      const row: ReducerAccess = { app: { id: mockManageUserPDengageApp.id } };
      const manageSrasOnly: ManagedSitesByApp[] = [
        { app: mockManageUserSrasApp, sites: managedSrasSites }
      ];
      expect(buildSiteOptions(row, [row], mockSites, manageSrasOnly)).toEqual([]);
    });
  });

  describe("buildRoleOptions", () => {
    it("returns an empty array if the row doesn't have an app", () => {
      const row: ReducerAccess = {};
      expect(buildRoleOptions(row, mockApps)).toEqual([]);
    });

    it("returns an empty array if the row doesn't have a site", () => {
      const row: ReducerAccess = { app: { id: mockManageUserSrasApp.id } };
      expect(buildRoleOptions(row, mockApps)).toEqual([]);
    });

    it("returns expected options for the selected app and site", () => {
      const row: ReducerAccess = {
        app: { id: mockManageUserSrasApp.id },
        site: managedSrasSites[0]
      };
      expect(buildRoleOptions(row, mockApps)).toEqual(mockManageUserSrasApp.roles);
    });
  });

  describe("buildManagedSitesByApp", () => {
    it("doesn't include apps with an invalid status", () => {
      const invalidSras = produce(mockManageUserSrasApp, (draft) => {
        draft.status.isValid = false;
      });
      const apps = [invalidSras, mockManageUserPDengageApp];
      // only include PDEngage as SRAS is invalid
      const expected: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites }
      ];

      expect(buildManagedSitesByApp(mockAdminUser, apps, mockSites)).toEqual(expected);
    });

    it("doesn't include apps the user isn't an admin of", () => {
      const pdeEngageAdmin = produce(mockAdminUser, (draft) => {
        draft.accessList = draft.accessList.filter((access) => {
          return access.app.id === mockManageUserPDengageApp.id;
        });
      });
      // only include PDEngage as the user isn't an admin for any SRAS properties
      const expected: ManagedSitesByApp[] = [
        { app: mockManageUserPDengageApp, sites: mockSites }
      ];

      expect(buildManagedSitesByApp(pdeEngageAdmin, mockApps, mockSites)).toEqual(
        expected
      );
    });

    it("only includes properties for the app the user is an admin for", () => {
      const viewerRole: GaAccessListFragment["role"] = { id: "viewer", name: "Viewer" };
      const singlePropAdmin = produce(mockAdminUser, (draft) => {
        const access = draft.accessList;
        draft.accessList = [access[0], { ...access[1], role: viewerRole }];
      });

      const result = buildManagedSitesByApp(singlePropAdmin, mockApps, mockSites);
      expect(result).toHaveLength(1);
      expect(result[0].sites).toHaveLength(1);
    });
  });

  describe("canEditAccessRow", () => {
    it("returns true for an Org Admin", () => {
      const accessRow: ReducerAccess = {
        app: { id: mockManageUserSrasApp.id },
        site: { id: mockSites[0].id }
      };
      expect(canEditAccessRow(mockOrgAdmin, accessRow)).toBeTruthy();
    });

    it("returns true if the user is an admin for the app and property", () => {
      const accessRow: ReducerAccess = {
        app: { id: mockManageUserSrasApp.id },
        site: { id: mockSites[0].id }
      };
      expect(canEditAccessRow(mockAdminUser, accessRow)).toBeTruthy();
    });

    it("retuns false if the user isn't an admin for the property", () => {
      const accessRow: ReducerAccess = {
        app: { id: mockManageUserSrasApp.id },
        site: { id: "site999" }
      };
      expect(canEditAccessRow(mockAdminUser, accessRow)).toBeFalsy();
    });

    it("returns false if the user isn't an admin for the app", () => {
      const accessRow: ReducerAccess = { app: { id: "non-admin-app" } };
      expect(canEditAccessRow(mockAdminUser, accessRow)).toBeFalsy();
    });

    it("returns true if the user is an admin for the app", () => {
      const accessRow: ReducerAccess = { app: { id: mockManageUserSrasApp.id } };
      expect(canEditAccessRow(mockAdminUser, accessRow)).toBeTruthy();
    });

    it("returns true if the access row is empty", () => {
      expect(canEditAccessRow(mockAdminUser, {})).toBeTruthy();
    });
  });

  describe("isFormComplete", () => {
    const mockCompletedForm: ReducerUser = {
      accessLevel: OrgAccessLevel.AppSpecific,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      password: "password",
      phone: "1234567890",
      accessList: [
        {
          app: { id: "sras" },
          site: { id: "1" },
          role: { id: "admin" }
        }
      ]
    };

    it("returns true if all fields are complete", () => {
      expect(isFormComplete(mockCompletedForm)).toBeTruthy();
    });

    it("returns false if accessLevel is not set", () => {
      const noFirstName: ReducerUser = { ...mockCompletedForm, accessLevel: null };
      expect(isFormComplete(noFirstName)).toBeFalsy();
    });

    it("returns false if firstName is empty", () => {
      const noFirstName: ReducerUser = { ...mockCompletedForm, firstName: " " };
      expect(isFormComplete(noFirstName)).toBeFalsy();
    });

    it("returns false if email is empty", () => {
      const noEmail: ReducerUser = { ...mockCompletedForm, email: " " };
      expect(isFormComplete(noEmail)).toBeFalsy();
    });

    it("returns false if phone is empty", () => {
      const noPhone: ReducerUser = { ...mockCompletedForm, phone: " " };
      expect(isFormComplete(noPhone)).toBeFalsy();
    });

    it("returns false if password is less than 8 characters", () => {
      const shortPassword: ReducerUser = { ...mockCompletedForm, password: "1234567" };
      expect(isFormComplete(shortPassword)).toBeFalsy();
    });

    it("returns true if accessLevel is OrgAdmin and accessList is empty", () => {
      const orgAdmin: ReducerUser = {
        ...mockCompletedForm,
        accessLevel: OrgAccessLevel.OrgAdmin,
        accessList: []
      };
      expect(isFormComplete(orgAdmin)).toBeTruthy();
    });

    describe("Create Application User", () => {
      it("returns false if the accessList is empty", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: []
        };
        expect(isFormComplete(appUser)).toBeFalsy();
      });

      it("returns false if the only access row only has app selected", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [{ app: { id: "sras" } }]
        };
        expect(isFormComplete(appUser)).toBeFalsy();
      });

      it("returns false if the only access row only has app and site selected", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [{ app: { id: "sras" }, site: { id: "1" } }]
        };
        expect(isFormComplete(appUser)).toBeFalsy();
      });

      it("returns true if the only access row has app, site, and role selected", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [{ app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } }]
        };
        expect(isFormComplete(appUser)).toBeTruthy();
      });

      it("returns true if the first access row is complete and the second access row is empty", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [
            { app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } },
            {}
          ]
        };
        expect(isFormComplete(appUser)).toBeTruthy();
      });

      it("returns false if the first access row is complete but the second access row is incomplete", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [
            { app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } },
            { app: { id: "sras" }, site: { id: "1" } }
          ]
        };
        expect(isFormComplete(appUser)).toBeFalsy();
      });

      it("returns true if multiple access rows are complete", () => {
        const appUser: ReducerUser = {
          ...mockCompletedForm,
          accessList: [
            { app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } },
            { app: { id: "sras" }, site: { id: "2" }, role: { id: "admin" } }
          ]
        };
        expect(isFormComplete(appUser)).toBeTruthy();
      });
    });

    describe("Create No Access user", () => {
      const noAccessUser: ReducerUser = {
        accessLevel: OrgAccessLevel.NoAccess,
        firstName: "John",
        lastName: "Doe",
        email: "",
        phone: "",
        password: "",
        accessList: []
      };

      it("returns true if only the required fields are complete", () => {
        expect(isFormComplete(noAccessUser)).toBeTruthy();
      });

      it("returns true if email and phone are set", () => {
        const withEmailAndPhone: ReducerUser = {
          ...noAccessUser,
          email: "test@test.com",
          phone: "1234567890"
        };
        expect(isFormComplete(withEmailAndPhone)).toBeTruthy();
      });

      it("returns false if first name is empty", () => {
        const noFirstName: ReducerUser = { ...noAccessUser, firstName: " " };
        expect(isFormComplete(noFirstName)).toBeFalsy();
      });

      it("returns false if last name is empty", () => {
        const noLastName: ReducerUser = { ...noAccessUser, lastName: " " };
        expect(isFormComplete(noLastName)).toBeFalsy();
      });
    });

    describe("Edit User", () => {
      it("returns true if a users Access Level is changed from No Access and a password is provided", () => {
        expect(isFormComplete(mockCompletedForm, OrgAccessLevel.NoAccess)).toBeTruthy();
      });

      it("returns false if a users Access Level is changed from No Access and a password isn't provided", () => {
        const noPasswordForm = { ...mockCompletedForm, password: "" };
        expect(isFormComplete(noPasswordForm, OrgAccessLevel.NoAccess)).toBeFalsy();
      });
    });
  });

  describe("userToCreateUserV2Input", () => {
    const appSpecificUser: ReducerUser = {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      email: "john.doe@test.com",
      password: "password",
      accessLevel: OrgAccessLevel.AppSpecific,
      accessList: [
        {
          app: { id: "sras" },
          site: { id: "1" },
          role: { id: "admin" }
        }
      ]
    };

    it("returns expected input for an application user", () => {
      const expected: UserCreateV2MutationVariables["input"] = {
        ...appSpecificUser,
        accessLevel: appSpecificUser.accessLevel!,
        accessList: appSpecificUser.accessList.map((access) => ({
          appId: access!.app!.id,
          siteId: access!.site!.id,
          roleId: access!.role!.id
        }))
      };

      expect(userToCreateUserV2Input(appSpecificUser)).toEqual(expected);
    });

    it("removes empty access list rows for application user", () => {
      const user = produce(appSpecificUser, (draft) => {
        draft.accessList.push({});
      });
      const input = userToCreateUserV2Input(user);
      expect(input.accessList).toHaveLength(1);
      expect(input.accessList![0].appId).toEqual("sras");
    });

    it("returns expected input for an Org Admin", () => {
      const orgAdmin: ReducerUser = {
        ...appSpecificUser,
        accessLevel: OrgAccessLevel.OrgAdmin
      };
      const expected: UserCreateV2MutationVariables["input"] = {
        ...appSpecificUser,
        accessLevel: OrgAccessLevel.OrgAdmin,
        accessList: []
      };

      expect(userToCreateUserV2Input(orgAdmin)).toEqual(expected);
    });

    it("returns expected input for No Access user with all fields complete", () => {
      const noAccessUser: ReducerUser = {
        ...appSpecificUser,
        accessLevel: OrgAccessLevel.NoAccess
      };
      const expected: UserCreateV2MutationVariables["input"] = {
        firstName: noAccessUser.firstName,
        lastName: noAccessUser.lastName,
        phone: noAccessUser.phone,
        email: noAccessUser.email,
        accessLevel: noAccessUser.accessLevel!
      };

      expect(userToCreateUserV2Input(noAccessUser)).toEqual(expected);
    });

    it("returns expected input for No Access user if phone and email are empty", () => {
      const noAccessUser: ReducerUser = {
        ...appSpecificUser,
        accessLevel: OrgAccessLevel.NoAccess,
        phone: "",
        email: ""
      };
      const expected: UserCreateV2MutationVariables["input"] = {
        firstName: noAccessUser.firstName,
        lastName: noAccessUser.lastName,
        phone: "",
        email: null,
        accessLevel: noAccessUser.accessLevel!
      };

      expect(userToCreateUserV2Input(noAccessUser)).toEqual(expected);
    });

    it("returns expected input for No Access user if email only consists of white space", () => {
      const noAccessUser: ReducerUser = {
        ...appSpecificUser,
        accessLevel: OrgAccessLevel.NoAccess,
        email: " "
      };
      const expected: UserCreateV2MutationVariables["input"] = {
        firstName: noAccessUser.firstName,
        lastName: noAccessUser.lastName,
        phone: noAccessUser.phone,
        email: null,
        accessLevel: noAccessUser.accessLevel!
      };

      expect(userToCreateUserV2Input(noAccessUser)).toEqual(expected);
    });

    it("trims leading and trailing white space from string fields", () => {
      const user: ReducerUser = {
        firstName: " John ",
        lastName: " Doe ",
        phone: " 1234567890 ",
        email: " test@test.com ",
        password: " password ",
        accessLevel: OrgAccessLevel.OrgAdmin,
        accessList: []
      };

      const input = userToCreateUserV2Input(user);
      expect(input.firstName).toEqual("John");
      expect(input.lastName).toEqual("Doe");
      expect(input.phone).toEqual("1234567890");
      expect(input.email).toEqual("test@test.com");
      expect(input.password).toEqual("password");
    });
  });

  describe("isNameTaken", () => {
    const mockNoAccessUser: ReducerUser = {
      firstName: "John",
      lastName: "Doe",
      email: "",
      phone: "",
      password: "",
      accessLevel: OrgAccessLevel.NoAccess,
      accessList: []
    };

    it("returns true for No Access access level if the users name is in the taken name list", () => {
      expect(isNameTaken(mockNoAccessUser, ["John Doe"])).toBeTruthy();
    });

    it("trims white space from the users name before checking if it's taken", () => {
      const withWhiteSpace = {
        ...mockNoAccessUser,
        firstName: " John ",
        lastName: " Doe "
      };
      expect(isNameTaken(withWhiteSpace, ["John Doe"])).toBeTruthy();
    });

    it("returns false for No Access access level if the users name is not in the taken name list", () => {
      expect(isNameTaken(mockNoAccessUser, ["Jane Doe"])).toBeFalsy();
    });

    it("returns false for Org Admin access level", () => {
      const orgAdmin: ReducerUser = {
        ...mockNoAccessUser,
        accessLevel: OrgAccessLevel.OrgAdmin
      };
      expect(isNameTaken(orgAdmin, ["John Doe"])).toBeFalsy();
    });

    it("returns false for App Specific access level", () => {
      const appSpecific: ReducerUser = {
        ...mockNoAccessUser,
        accessLevel: OrgAccessLevel.AppSpecific
      };
      expect(isNameTaken(appSpecific, ["John Doe"])).toBeFalsy();
    });
  });

  describe("userToUserUpdateInput", () => {
    const userManagement: UserManagement = {
      type: "update-other-user",
      user: mockUserManagementAdmin
    };
    const editUserForm: ReducerUser = {
      ...userManagementUserAsReducerUser(userManagement.user),
      password: "password"
    };

    describe("Org Admin", () => {
      it("returns expected input when updating a user to Org Admin", () => {
        const orgAdminUser: ReducerUser = {
          ...editUserForm,
          accessLevel: OrgAccessLevel.OrgAdmin
        };
        const res = userToUserUpdateInput(
          mockOrgAdmin,
          "1",
          orgAdminUser,
          userManagement
        );
        // id, firstName, lastName, phone, email, password, accessLevel, accessList
        expect(Object.keys(res)).toHaveLength(8);
        expect(res.userId).toEqual("1");
        expect(res.firstName).toEqual(editUserForm.firstName);
        expect(res.lastName).toEqual(editUserForm.lastName);
        expect(res.phone).toEqual(editUserForm.phone);
        expect(res.email).toEqual(editUserForm.email);
        expect(res.password).toEqual(editUserForm.password);
        expect(res.accessLevel).toEqual(OrgAccessLevel.OrgAdmin);
        expect(res.accessList).toEqual([]);
      });

      it("returns expected input when updating a user to App Specific", () => {
        const userManagementOrgAdmin: UserManagement = {
          type: "update-other-user",
          user: mockUserManagementOrgAdmin
        };
        const appSpecificUser: ReducerUser = produce(editUserForm, (draft) => {
          draft.accessLevel = OrgAccessLevel.AppSpecific;
          draft.accessList = [
            { app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } },
            // incomplete access should get omitted
            { app: { id: "sre" } },
            {}
          ];
        });
        const res = userToUserUpdateInput(
          mockOrgAdmin,
          "1",
          appSpecificUser,
          userManagementOrgAdmin
        );

        // id, firstName, lastName, phone, email, password, accessLevel, accessList
        expect(Object.keys(res)).toHaveLength(8);
        expect(res.userId).toEqual("1");
        expect(res.firstName).toEqual(editUserForm.firstName);
        expect(res.lastName).toEqual(editUserForm.lastName);
        expect(res.phone).toEqual(editUserForm.phone);
        expect(res.email).toEqual(editUserForm.email);
        expect(res.password).toEqual(editUserForm.password);
        expect(res.accessLevel).toEqual(OrgAccessLevel.AppSpecific);
        expect(res.accessList).toEqual([{ appId: "sras", siteId: "1", roleId: "admin" }]);
      });

      it("returns expected input when updating a user to No Access", () => {
        const noAccessUser: ReducerUser = {
          ...editUserForm,
          accessLevel: OrgAccessLevel.NoAccess
        };
        const res = userToUserUpdateInput(
          mockOrgAdmin,
          "1",
          noAccessUser,
          userManagement
        );
        // id, firstName, lastName, phone, email, accessLevel
        expect(Object.keys(res)).toHaveLength(6);
        expect(res.userId).toEqual("1");
        expect(res.firstName).toEqual(editUserForm.firstName);
        expect(res.lastName).toEqual(editUserForm.lastName);
        expect(res.phone).toEqual(editUserForm.phone);
        expect(res.email).toEqual(editUserForm.email);
        expect(res.accessLevel).toEqual(OrgAccessLevel.NoAccess);
      });
    });

    describe("App Admin", () => {
      it("omits any incomplete access rows", () => {
        const appSpecificUser: ReducerUser = produce(editUserForm, (draft) => {
          draft.accessLevel = OrgAccessLevel.AppSpecific;
          draft.accessList = [
            { app: { id: "sre" }, site: { id: "0" }, role: { id: "admin" } },
            // incomplete access should get omitted
            { app: { id: "sre" } },
            {}
          ];
        });
        const res = userToUserUpdateInput(
          mockAdminUser,
          "1",
          appSpecificUser,
          userManagement
        );

        expect(res.accessList).toHaveLength(1);
      });
    });
  });

  describe("passwordDisplay", () => {
    it("returns `none` if the selected access level is No Access", () => {
      expect(passwordDisplay(OrgAccessLevel.NoAccess)).toEqual("none");
    });

    it("returns `new` if the selected access level is not No Access and the original access is undefined", () => {
      expect(passwordDisplay(OrgAccessLevel.AppSpecific)).toEqual("new");
      expect(passwordDisplay(OrgAccessLevel.OrgAdmin)).toEqual("new");
    });

    it("returns `new` if the selected access level is not No Access but the original access is No Access", () => {
      expect(
        passwordDisplay(OrgAccessLevel.AppSpecific, OrgAccessLevel.NoAccess)
      ).toEqual("new");
      expect(passwordDisplay(OrgAccessLevel.OrgAdmin, OrgAccessLevel.NoAccess)).toEqual(
        "new"
      );
    });

    it("returns `update` if the selected access level is not No Access and the original access is not No Access", () => {
      const appSpecific = OrgAccessLevel.AppSpecific;
      const orgAdmin = OrgAccessLevel.OrgAdmin;
      expect(passwordDisplay(appSpecific, appSpecific)).toEqual("update");
      expect(passwordDisplay(appSpecific, orgAdmin)).toEqual("update");
      expect(passwordDisplay(orgAdmin, appSpecific)).toEqual("update");
      expect(passwordDisplay(orgAdmin, orgAdmin)).toEqual("update");
    });
  });

  describe("requireEmailValidation", () => {
    it("returns true for an Org Admin user if no original email is provided", () => {
      const orgAdmin = userManagementUserAsReducerUser(mockUserManagementOrgAdmin);
      expect(requireEmailValidation(orgAdmin)).toBeTruthy();
    });

    it("returns true for an Org Admin user if the original email provided doesn't match", () => {
      const orgAdmin = userManagementUserAsReducerUser(mockUserManagementOrgAdmin);
      expect(requireEmailValidation(orgAdmin, "zzz@test.com")).toBeTruthy();
    });

    it("returns false for an Org Admin user if an original email is provided and matches", () => {
      const orgAdmin = userManagementUserAsReducerUser(mockUserManagementOrgAdmin);
      const originalEmail = mockUserManagementOrgAdmin.email;
      expect(requireEmailValidation(orgAdmin, originalEmail)).toBeFalsy();
    });

    it("returns true for an App Admin user if no original email is provided", () => {
      const appAdmin = userManagementUserAsReducerUser(mockUserManagementAdmin);
      expect(requireEmailValidation(appAdmin)).toBeTruthy();
    });

    it("returns true for an App Admin user if the original email provided doesn't match", () => {
      const appAdmin = userManagementUserAsReducerUser(mockUserManagementAdmin);
      expect(requireEmailValidation(appAdmin, "zzz@test.com")).toBeTruthy();
    });

    it("returns false for an App Admin user if an original email is provided and matches", () => {
      const appAdmin = userManagementUserAsReducerUser(mockUserManagementAdmin);
      const originalEmail = mockUserManagementAdmin.email;
      expect(requireEmailValidation(appAdmin, originalEmail)).toBeFalsy();
    });
  });

  describe("hasFormChanged", () => {
    const mockFormState: ReducerUser = userManagementUserAsReducerUser(
      mockUserManagementAdmin
    );

    it("returns false if no changes are made", () => {
      expect(hasFormChanged(mockFormState, mockUserManagementAdmin)).toBeFalsy();
    });

    it("returns true if firstName is changed", () => {
      const firstNameChange = { ...mockFormState, firstName: "Jane" };
      expect(hasFormChanged(firstNameChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if lastName is changed", () => {
      const lastNameChange = { ...mockFormState, lastName: "Doe" };
      expect(hasFormChanged(lastNameChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if email is changed", () => {
      const emailChange = { ...mockFormState, email: "change@test.com" };
      expect(hasFormChanged(emailChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if phone is changed", () => {
      const phoneChange = { ...mockFormState, phone: "1111" };
      expect(hasFormChanged(phoneChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if password is changed", () => {
      const passwordChange = { ...mockFormState, password: "new_password" };
      expect(hasFormChanged(passwordChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns false if the changed password has insufficient characters", () => {
      const shortPassword = { ...mockFormState, password: "1234567" };
      expect(hasFormChanged(shortPassword, mockUserManagementAdmin)).toBeFalsy();
    });

    it("returns true if accessLevel is changed", () => {
      const accessLevelChange = {
        ...mockFormState,
        accessLevel: OrgAccessLevel.NoAccess
      };
      expect(hasFormChanged(accessLevelChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if access is removed", () => {
      const accessListChange = {
        ...mockFormState,
        accessList: mockFormState.accessList.slice(0, mockFormState.accessList.length - 1)
      };
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if access is added", () => {
      const accessListChange = {
        ...mockFormState,
        accessList: [
          ...mockFormState.accessList,
          { app: { id: "sras" }, site: { id: "1" }, role: { id: "admin" } }
        ]
      };
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if access app is modified", () => {
      const accessListChange = produce(mockFormState, (draft) => {
        draft.accessList[0].app!.id = "sre";
      });
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if access site is modified", () => {
      const accessListChange = produce(mockFormState, (draft) => {
        draft.accessList[0].site!.id = "99";
      });
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns true if access role is modified", () => {
      const accessListChange = produce(mockFormState, (draft) => {
        draft.accessList[0].role!.id = "viewer";
      });
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeTruthy();
    });

    it("returns false if access is added but incomplete", () => {
      const accessListChange = {
        ...mockFormState,
        accessList: [
          ...mockFormState.accessList,
          { app: { id: "sras" }, site: { id: "1" } }
        ]
      };
      expect(hasFormChanged(accessListChange, mockUserManagementAdmin)).toBeFalsy();
    });
  });

  describe("showAccessLevel", () => {
    it("returns true unless the user is editing themselves", () => {
      expect(showAccessLevel("create-user")).toBeTruthy();
      expect(showAccessLevel("update-other-user")).toBeTruthy();
      expect(showAccessLevel("update-own-user")).toBeFalsy();
    });
  });

  describe("showAccessList", () => {
    it("returns true when editing another user and access level is selected", () => {
      const res = showAccessList("update-other-user", OrgAccessLevel.AppSpecific);
      expect(res).toBeTruthy();
    });

    it("returns false when editing another user and access level is not selected", () => {
      expect(showAccessList("update-other-user", null)).toBeFalsy();
    });

    it("returns true when creating a new user and access level is selected", () => {
      const res = showAccessList("create-user", OrgAccessLevel.AppSpecific);
      expect(res).toBeTruthy();
    });

    it("returns false when creating a new user and access level is not selected", () => {
      expect(showAccessList("create-user", null)).toBeFalsy();
    });

    it("returns false when editing own user", () => {
      expect(showAccessList("update-own-user", OrgAccessLevel.AppSpecific)).toBeFalsy();
      expect(showAccessList("update-own-user", null)).toBeFalsy();
    });
  });
});
