import { OrgAccessLevel } from "generated-graphql";
import { UserManagementUserFragment } from "../__generated__/users";

const sras = { id: "sras", name: "Slot Reports" };
const sre = { id: "sre", name: "Slot Recommendation Engine" };

const admin = { id: "admin", name: "App Admin" };
const viewer = { id: "viewer", name: "App Viewer" };

const site1 = { id: "1", name: "Zebra" };
const site2 = { id: "2", name: "Apple" };
const site3 = { id: "3", name: "Kevin" };
const site4 = { id: "4", name: "Cat" };

const orgAdmin1: UserManagementUserFragment = {
  id: "7856",
  email: "Xeno.Lore@test.com",
  firstName: "Xeno",
  lastName: "Lore",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.OrgAdmin,
  accessList: [
    {
      app: sras,
      role: admin,
      site: site1
    },
    {
      app: sras,
      role: admin,
      site: site2
    },
    {
      app: sras,
      role: admin,
      site: site3
    },
    {
      app: sras,
      role: admin,
      site: site4
    }
  ]
};

const propertyAdmin1: UserManagementUserFragment = {
  id: "987453",
  email: "Pingu.Craze@test.com",
  firstName: "Pingu",
  lastName: "Craze",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: admin,
      site: site1
    },
    {
      app: sras,
      role: admin,
      site: site2
    }
  ]
};

const propertyAdmin2: UserManagementUserFragment = {
  id: "7283",
  email: "Ribbon.End@test.com",
  firstName: "Ribbon",
  lastName: "End",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: admin,
      site: site2
    }
  ]
};

const propertyAdmin3: UserManagementUserFragment = {
  id: "465610",
  email: "Unicorn.Bow@test.com",
  firstName: "Unicorn",
  lastName: "Bow",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: admin,
      site: site4
    }
  ]
};

const propertyAdmin4: UserManagementUserFragment = {
  id: "16875",
  email: "Unicorn.Bow@test.com",
  firstName: "Unicorn",
  lastName: "Bow",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sre,
      role: admin,
      site: site1
    },
    {
      app: sre,
      role: admin,
      site: site2
    },
    {
      app: sre,
      role: admin,
      site: site3
    },
    {
      app: sre,
      role: admin,
      site: site4
    }
  ]
};

const propertyViewer1: UserManagementUserFragment = {
  id: "18674",
  email: "Erin.Woke@test.com",
  firstName: "Erin",
  lastName: "Woke",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: viewer,
      site: site1
    }
  ]
};

const propertyViewer2: UserManagementUserFragment = {
  id: "17658",
  email: "Gale.Bush@test.com",
  firstName: "Gale",
  lastName: "Bush",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: viewer,
      site: site2
    },
    {
      app: sre,
      role: viewer,
      site: site4
    }
  ]
};

const propertyViewer3: UserManagementUserFragment = {
  id: "87654",
  email: "Hollywood.Key@test.com",
  firstName: "Hollywood",
  lastName: "Key",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: [
    {
      app: sras,
      role: viewer,
      site: site3
    },
    {
      app: sras,
      role: viewer,
      site: site4
    }
  ]
};

const emptyPropertyAccess1: UserManagementUserFragment = {
  id: "5738",
  email: "Zues.Pony@test.com",
  firstName: "Zues",
  lastName: "Pony",
  phone: "+1 123 321",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: []
};

const emptyEmailUser: UserManagementUserFragment = {
  id: "9176",
  email: "",
  firstName: "James",
  lastName: "Smith",
  phone: "+1 423 902",
  accessLevel: OrgAccessLevel.AppSpecific,
  accessList: []
};

const noAccessUser: UserManagementUserFragment = {
  id: "8345",
  email: "Robert.Williams@test.com",
  firstName: "Robert",
  lastName: "Williams",
  phone: "+1 922 308",
  accessLevel: OrgAccessLevel.NoAccess,
  accessList: []
};

export const mockUnsortedUsers = [
  orgAdmin1,
  propertyAdmin1,
  propertyAdmin2,
  propertyAdmin3,
  propertyAdmin4,
  propertyViewer1,
  propertyViewer2,
  propertyViewer3,
  propertyAdmin4,
  emptyPropertyAccess1,
  emptyEmailUser,
  noAccessUser
];
