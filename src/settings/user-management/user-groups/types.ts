import { UserGroupFragment } from "./__generated__/user-groups";
import { Action } from "@material-table/core";

type EditGroup = {
  type: "edit";
  group: UserGroupFragment;
};

type DeleteGroup = {
  type: "delete";
  group: UserGroupFragment;
};

export type UserGroupAction = EditGroup | DeleteGroup;

export type UserGroupActionFn = (rowData: UserGroupFragment) => Action<UserGroupFragment>;
