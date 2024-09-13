import { Action } from "@material-table/core";
import { UserManagementUserFragment } from "./__generated__/users";

export type UserActionFn = (
  rowData: UserManagementUserFragment
) => Action<UserManagementUserFragment>;
