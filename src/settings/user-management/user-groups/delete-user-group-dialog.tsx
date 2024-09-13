import { Box, styled, useTheme } from "@mui/material";
import { Button, Dialog, DialogHeader } from "@vizexplorer/global-ui-v2";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import { gql } from "@apollo/client";
import { useUserGroupDeleteMutation } from "./__generated__/delete-user-group-dialog";
import { useAlert } from "view-v2/alert";

export type DeleteGroupObj = {
  __typename?: "PdUserGroup";
  id: string;
  name: string;
};

type Props = {
  groupToDelete: DeleteGroupObj;
  onDelete: VoidFunction;
  onClose: VoidFunction;
};

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2)
}));

export function DeleteUserGroupDialog({ groupToDelete, onDelete, onClose }: Props) {
  const theme = useTheme();
  const { addAlert } = useAlert();
  const [deleteUserGroup, { loading }] = useUserGroupDeleteMutation({
    update(cache, { data }) {
      if (data?.pdUserGroupDelete) {
        cache.evict({ id: cache.identify(groupToDelete) });
        cache.gc();
      }
    }
  });

  function onClickDelete() {
    deleteUserGroup({
      variables: { id: groupToDelete.id },
      onCompleted: () => {
        addAlert({ severity: "success", message: "User group deleted" });
        onDelete?.();
      },
      onError: () => {
        addAlert({
          severity: "error",
          message: "An unexpected error occurred while deleting. Please try again."
        });
      }
    });
  }

  return (
    <Dialog
      open
      data-testid={"delete-user-group-dialog"}
      data-loading={loading}
      PaperProps={{ sx: { maxWidth: "420px", width: "100%" } }}
    >
      <DialogHeader
        title={`Are you sure you want to delete ${groupToDelete.name}?`}
        disableClose={loading}
        onClickClose={onClose}
      />
      <Box p={theme.spacing(2)} mt={theme.spacing(2)}>
        <ActionsContainer>
          <Button
            fullWidth
            variant={"contained"}
            size={"large"}
            disabled={loading}
            startIcon={<DeleteRounded />}
            onClick={onClickDelete}
          >
            Delete
          </Button>
          <Button
            fullWidth
            variant={"outlined"}
            color={"neutral"}
            size={"large"}
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ActionsContainer>
      </Box>
    </Dialog>
  );
}

const _USER_GROUPS_DELETE_MUTATION = gql`
  mutation userGroupDelete($id: ID!) {
    pdUserGroupDelete(id: $id)
  }
`;
