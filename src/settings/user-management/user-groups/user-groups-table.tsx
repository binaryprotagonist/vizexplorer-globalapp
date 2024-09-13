import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Table } from "view-v2/table";
import { Button } from "@vizexplorer/global-ui-v2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { createUserGroupColumns } from "./user-groups-columns";
import { UserGroupFragment } from "./__generated__/user-groups";
import { UserGroupAction, UserGroupActionFn } from "./types";
import { CustomToolbarProps } from "view-v2/table/toolbar/table-toolbar";

type Props = {
  userGroups: UserGroupFragment[];
  loading?: boolean;
  onActionClick: (action: UserGroupAction) => void;
  onAddUserGroup: () => void;
};

export function UserGroupsTable({
  userGroups,
  loading = false,
  onActionClick,
  onAddUserGroup
}: Props) {
  const [seeMoreGroupId, setSeeMoreGroupId] = useState<string | null>(null);

  const actions: UserGroupActionFn[] = [
    (group: UserGroupFragment) => ({
      icon: () => <EditRoundedIcon data-testid={"edit-icon"} />,
      onClick: () => onActionClick({ type: "edit", group }),
      disabled: loading
    }),
    (group: UserGroupFragment) => {
      return {
        icon: () => <DeleteRoundedIcon data-testid={"delete-icon"} />,
        disabled: !!group.usedByRules?.length || loading,
        onClick: () => onActionClick({ type: "delete", group }),
        tooltip: group.usedByRules?.length ? (
          <DeleteDisabledTooltip
            ruleNames={group.usedByRules?.map((rule) => rule.name)}
          />
        ) : (
          ""
        )
      };
    }
  ];

  const columns = useMemo(() => createUserGroupColumns(seeMoreGroupId), [seeMoreGroupId]);
  const customToolbar = useCallback(
    ({ ToolbarContainer, search }: CustomToolbarProps) => {
      return (
        <ToolbarContainer>
          {search}
          <Button
            onClick={onAddUserGroup}
            variant={"contained"}
            size={"small"}
            startIcon={<AddRoundedIcon />}
            disabled={loading}
          >
            Add user group
          </Button>
        </ToolbarContainer>
      );
    },
    [loading]
  );

  return (
    <div>
      <span data-testid={"user-groups-table"} />
      <Table
        columns={columns}
        data={userGroups}
        loading={loading}
        toolbar={{ type: "custom", component: customToolbar }}
        actions={actions}
        options={{
          tableLayout: "fixed",
          ...(!loading && { rowStyle: { height: "100px" } })
        }}
        onRowClick={(_e, data) => {
          !data
            ? setSeeMoreGroupId(null)
            : setSeeMoreGroupId((cur) => (cur === data.id ? null : data.id));
        }}
      />
    </div>
  );
}

type DeleteDisabledTooltipProps = {
  ruleNames: string[];
};

function DeleteDisabledTooltip({ ruleNames }: DeleteDisabledTooltipProps) {
  // use custom • over `ul/li` due to alignment issues with no obvious way to resolve
  return (
    <Box display={"inline-block"}>
      <span>
        User group deletion is only possible if no rules are assigned to the group.
        <br /> Rules assigned to this User Group:
      </span>
      <Box p={"8px"}>
        {ruleNames.map((name) => (
          <Box key={`rule-${name}`}>
            <span>•</span>
            <span style={{ marginLeft: "8px" }}>{name}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
