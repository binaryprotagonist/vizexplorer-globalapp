import { OrgAccessLevel } from "generated-graphql";

export type ReducerState = {
  user: ReducerUser;
  fieldErrors: FieldError;
};

export type ErrorableField = "email" | "name";

export type FieldError = {
  [key in ErrorableField]?: string;
};

export type ReducerUser = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  accessLevel: OrgAccessLevel | null;
  accessList: ReducerAccess[];
};

export type ReducerAccess = {
  app?: {
    id: string;
  };
  site?: {
    id: string;
  };
  role?: {
    id: string;
  };
};

export type ReducerAction =
  | UpdateFirstNameAction
  | UpdateLastNameAction
  | UpdatePhoneAction
  | UpdateEmailAction
  | UpdatePasswordAction
  | UpdateAccessLevelAction
  | AddEmptyAccessRowAction
  | UpdateAccessRowAppAction
  | UpdateAccessRowSiteAction
  | UpdateAccessRowRoleAction
  | RemoveAccessRowAction
  | AddFieldErrorAction
  | ClearFieldErrorAction;

type UpdateFirstNameAction = {
  type: "update-first-name";
  payload: { firstName: string };
};

type UpdateLastNameAction = {
  type: "update-last-name";
  payload: { lastName: string };
};

type UpdatePhoneAction = {
  type: "update-phone";
  payload: { phone: string };
};

type UpdateEmailAction = {
  type: "update-email";
  payload: { email: string };
};

type UpdatePasswordAction = {
  type: "update-password";
  payload: { password: string };
};

type UpdateAccessLevelAction = {
  type: "update-access-level";
  payload: { accessLevel: OrgAccessLevel };
};

export type AddEmptyAccessRowAction = {
  type: "add-empty-access-row";
};

export type UpdateAccessRowAppAction = {
  type: "update-access-row-app";
  payload: { rowIdx: number; appId: string };
};

export type UpdateAccessRowSiteAction = {
  type: "update-access-row-site";
  payload: { rowIdx: number; siteId: string };
};

export type UpdateAccessRowRoleAction = {
  type: "update-access-row-role";
  payload: { rowIdx: number; roleId: string };
};

export type RemoveAccessRowAction = {
  type: "remove-access-row";
  payload: { rowIdx: number };
};

type AddFieldErrorAction = {
  type: "add-field-error";
  payload: { field: keyof FieldError; error: string };
};

type ClearFieldErrorAction = {
  type: "clear-field-error";
  payload: { field: keyof FieldError };
};
