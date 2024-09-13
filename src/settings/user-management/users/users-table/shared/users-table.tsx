import { useCallback, useMemo, useState } from "react";
import { createUserColumns } from "./columns";
import { UsersTableProps } from "./types";
import { Table } from "view-v2/table";
import { Button, Tooltip } from "@vizexplorer/global-ui-v2";
import AddRounded from "@mui/icons-material/AddRounded";
import { CustomToolbarProps } from "view-v2/table/toolbar/table-toolbar";

export function UsersTable({
  users,
  actions,
  loading = false,
  canAddUser = false,
  onAddUserClick
}: UsersTableProps) {
  const [viewAllAccessUserId, toggleAccessViewMore] = useState<string | null>(null);
  const [viewAllHostCodesUserId, toggleHostCodesViewMore] = useState<string | null>(null);

  const columns = useMemo(
    () => createUserColumns(viewAllAccessUserId, viewAllHostCodesUserId),
    [viewAllAccessUserId, viewAllHostCodesUserId]
  );
  const customToolbar = useCallback(
    ({ ToolbarContainer, search }: CustomToolbarProps) => {
      return (
        <ToolbarContainer>
          {search}
          <AddUserButton
            loading={loading}
            canAddUser={canAddUser}
            onClick={onAddUserClick}
          />
        </ToolbarContainer>
      );
    },
    [loading]
  );

  return (
    <div>
      <span data-testid={"users-table"} />
      <Table
        loading={loading}
        columns={columns}
        data={users}
        actions={actions}
        options={{ tableLayout: "fixed" }}
        toolbar={{
          type: "custom",
          component: customToolbar
        }}
        onRowClick={(event, user) => {
          const targetId = (event?.target as HTMLElement).id;
          if (!user || !targetId) return;

          if (["access-see-all", "access-see-less"].includes(targetId)) {
            toggleAccessViewMore((cur) => (cur === user.id ? null : user.id));
          }

          if (["host-codes-see-all", "host-codes-see-less"].includes(targetId)) {
            toggleHostCodesViewMore((cur) => (cur === user.id ? null : user.id));
          }
        }}
      />
    </div>
  );
}

type AddUserButtonProps = {
  loading: boolean;
  canAddUser: boolean;
  onClick?: VoidFunction;
};

function AddUserButton({ loading, canAddUser, onClick }: AddUserButtonProps) {
  return (
    <Tooltip
      title={
        !canAddUser
          ? "You don't have permission to add new users. Please contact an Admin"
          : ""
      }
      placement={"top"}
    >
      <span>
        <Button
          disabled={loading || !canAddUser}
          size={"small"}
          startIcon={<AddRounded />}
          variant={"contained"}
          onClick={onClick}
        >
          Add user
        </Button>
      </span>
    </Tooltip>
  );
}
