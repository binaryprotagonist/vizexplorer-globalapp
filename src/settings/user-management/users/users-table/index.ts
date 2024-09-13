import { ReactElement } from "react";
import { isAdminBuild } from "../../../../utils";
import { AdminUsersTableWrapper } from "./admin";
import { UsersTable as SharedUsersTable } from "./shared";
import { UsersTableProps } from "./shared/types";

export let UsersTable: (props: UsersTableProps) => ReactElement;
if (isAdminBuild()) {
  UsersTable = AdminUsersTableWrapper;
} else {
  UsersTable = SharedUsersTable;
}
