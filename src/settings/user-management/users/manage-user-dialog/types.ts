import { UserManagementUserFragment } from "../__generated__/users";
import {
  ManageUserAccessAppFragment,
  ManageUserAccessSiteFragment
} from "./__generated__/manage-user-dialog";

export type ManagedSitesByApp = {
  app: ManageUserAccessAppFragment;
  sites: ManageUserAccessSiteFragment[];
};

type CreateUserProps = {
  type: "create-user";
  user?: UserManagementUserFragment;
};

export type UpdateOtherUserProps = {
  type: "update-other-user";
  user: UserManagementUserFragment;
};

export type UpdateOwnUserProps = {
  type: "update-own-user";
  user: UserManagementUserFragment;
};

export type UserManagement = CreateUserProps | UpdateOtherUserProps | UpdateOwnUserProps;

export type PasswordDisplay = "new" | "update" | "none";
