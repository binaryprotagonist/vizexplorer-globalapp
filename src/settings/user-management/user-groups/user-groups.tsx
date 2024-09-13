import { Box, styled, useTheme } from "@mui/material";
import { useState } from "react";
import { gql } from "@apollo/client";
import { UserGroupsTable } from "./user-groups-table";
import { Button, Paper, Typography } from "@vizexplorer/global-ui-v2";
import { UserGroupFragment, useUserGroupsQuery } from "./__generated__/user-groups";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { UserGroupAction } from "./types";
import { ManageUserGroupDialog } from "./manage-user-group-dialog";
import { DeleteUserGroupDialog } from "./delete-user-group-dialog";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";

const NoUserGroupsContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "300px",
  maxHeight: "100%"
});

type ManageGroupDialog = {
  open: boolean;
  group?: UserGroupFragment;
};

export function UserGroups() {
  const [deleteGroup, setDeleteGroup] = useState<ManageGroupDialog>({
    open: false
  });
  const [manageGroup, setManageGroup] = useState<ManageGroupDialog>({
    open: false
  });

  const {
    data: groupsData,
    loading: loadingGroups,
    error: groupsErr,
    refetch: refetchUserGroups
  } = useUserGroupsQuery({ fetchPolicy: "cache-and-network" });

  function handleAddUserGroupClick() {
    setManageGroup({ open: true });
  }

  function handleGroupActionClick(action: UserGroupAction) {
    if (action.type === "edit") {
      setManageGroup({ open: true, group: action.group });
      return;
    }

    if (action.type === "delete") {
      setDeleteGroup({ open: true, group: action.group });
      return;
    }
  }

  async function onUserGroupDeleted() {
    setDeleteGroup((cur) => ({ ...cur, open: false }));
  }

  const userGroups = groupsData?.pdUserGroups;

  if (groupsErr) throw groupsErr;

  return (
    <div>
      <span data-testid={"user-groups"} />
      {deleteGroup.open && (
        <DeleteUserGroupDialog
          groupToDelete={deleteGroup.group!}
          onDelete={onUserGroupDeleted}
          onClose={() => setDeleteGroup((cur) => ({ ...cur, open: false }))}
        />
      )}
      {manageGroup.open && (
        <ManageUserGroupDialog
          groupId={manageGroup.group?.id}
          onClose={() => {
            setManageGroup((cur) => ({ ...cur, open: false }));
          }}
          onSave={() => {
            refetchUserGroups();
            setManageGroup((cur) => ({ ...cur, open: false }));
          }}
        />
      )}
      {loadingGroups || userGroups?.length ? (
        <UserGroupsTable
          userGroups={userGroups ?? []}
          loading={loadingGroups}
          onActionClick={handleGroupActionClick}
          onAddUserGroup={handleAddUserGroupClick}
        />
      ) : (
        <NoUserGroups onClickAdd={handleAddUserGroupClick} />
      )}
    </div>
  );
}

type NoUserGroupsProps = {
  onClickAdd: VoidFunction;
};

function NoUserGroups({ onClickAdd }: NoUserGroupsProps) {
  const theme = useTheme();

  return (
    <NoUserGroupsContainer elevation={2} borderStyle={2}>
      <Box
        data-testid="no-user-groups"
        display={"grid"}
        justifyItems={"center"}
        textAlign={"center"}
        rowGap={theme.spacing(1)}
        padding={theme.spacing(6)}
      >
        <TwoToneCircleIcon icon={<AddRoundedIcon />} color="primary" />
        <Typography fontWeight={600}>Start by adding your first user group</Typography>
        <Box mb={theme.spacing(2)}>
          <Typography color={"grey.500"} variant="bodySmall">
            Your user groups will live here.
            <br /> Start by adding your first one.
          </Typography>
        </Box>
        <Button
          variant={"contained"}
          size={"small"}
          startIcon={<AddRoundedIcon />}
          onClick={onClickAdd}
        >
          Add user group
        </Button>
      </Box>
    </NoUserGroupsContainer>
  );
}

const _USER_GROUPS_QUERY = gql`
  fragment UserGroupMember on User {
    id
    firstName
    lastName
  }

  fragment UserGroup on PdUserGroup {
    id
    name
    guestInteractionType
    excludeFromReports
    members {
      ...UserGroupMember
    }
    usedByRules {
      id
      name
    }
  }

  query userGroups {
    pdUserGroups {
      ...UserGroup
    }
  }
`;
