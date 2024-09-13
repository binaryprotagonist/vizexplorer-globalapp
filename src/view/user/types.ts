import { GaUserFragment } from "generated-graphql";

export enum UserActionType {
  ADD_USER,
  DELETE_USER,
  EDIT_PROFILE,
  EDIT_USER,
  MANAGE_PROPERTIES,
  MANAGE_APP_PROPERTY,
  ACCESS_APP,
  ACCESS_PD_SUITE,
  ACCESS_PD_SUITE_FOR_SITE,
  MANAGE_PD_SUITE,
  MANAGE_PD_SUITE_FOR_SITE,
  MANAGE_SUBSCRIPTION,
  MANAGE_PAYMENT,
  MANAGE_LICENSE,
  ACCESS_PDR_DATA_CONN,
  ACCESS_DATA_CONN,
  MANAGE_DATA_CONN,
  EDIT_HOST_MAPPING,
  MANAGE_GREET_RULES
}

type AddUserAction = {
  type: UserActionType.ADD_USER;
};

type DeleteUserAction = {
  type: UserActionType.DELETE_USER;
  otherUserId: string;
};

type EditProfileAction = {
  type: UserActionType.EDIT_PROFILE;
  otherUserId: string;
};

type EditUserAction = {
  type: UserActionType.EDIT_USER;
  otherUser: GaUserFragment;
};

type ManagePropertiesAction = {
  type: UserActionType.MANAGE_PROPERTIES;
};

type ManagePropertyRolesAction = {
  type: UserActionType.MANAGE_APP_PROPERTY;
  appId: string;
  siteId: string;
};

type AccessAppAction = {
  type: UserActionType.ACCESS_APP;
  appId: string;
};

type AccessPDSuite = {
  type: UserActionType.ACCESS_PD_SUITE;
};

type AccessPDSuiteForSite = {
  type: UserActionType.ACCESS_PD_SUITE_FOR_SITE;
  siteId: string;
};

type ManagePDSuite = {
  type: UserActionType.MANAGE_PD_SUITE;
};

type ManagePDSuiteForSite = {
  type: UserActionType.MANAGE_PD_SUITE_FOR_SITE;
  siteId: string;
};

type ManageSubscription = {
  type: UserActionType.MANAGE_SUBSCRIPTION;
};

type ManagePayment = {
  type: UserActionType.MANAGE_PAYMENT;
};

type ManageLicense = {
  type: UserActionType.MANAGE_LICENSE;
};

type AccessPDRDataConn = {
  type: UserActionType.ACCESS_PDR_DATA_CONN;
};

type AccessDataConn = {
  type: UserActionType.ACCESS_DATA_CONN;
};

type ManageDataConn = {
  type: UserActionType.MANAGE_DATA_CONN;
  appId: string;
  siteId: string;
};

type EditHostMapping = {
  type: UserActionType.EDIT_HOST_MAPPING;
  siteId: string;
};

type ManageGreetRules = {
  type: UserActionType.MANAGE_GREET_RULES;
  siteId: string;
};

export type UserAction =
  | AddUserAction
  | DeleteUserAction
  | EditProfileAction
  | EditUserAction
  | ManagePropertiesAction
  | ManagePropertyRolesAction
  | AccessAppAction
  | AccessPDSuite
  | AccessPDSuiteForSite
  | ManagePDSuite
  | ManagePDSuiteForSite
  | ManageSubscription
  | ManagePayment
  | ManageLicense
  | AccessPDRDataConn
  | AccessDataConn
  | ManageDataConn
  | EditHostMapping
  | ManageGreetRules;
