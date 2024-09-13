import { GaUserFragment } from "generated-graphql";
import { UserActionFn } from "../../types";
import { UserManagementUserFragment } from "../../__generated__/users";

export type UsersTableProps = {
  currentUser: GaUserFragment | null;
  users: UserManagementUserFragment[];
  actions: UserActionFn[];
  loading?: boolean;
  canAddUser?: boolean;
  onAddUserClick?: VoidFunction;
};
