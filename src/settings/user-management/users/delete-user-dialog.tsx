import { Box, styled, useTheme } from "@mui/material";
import { Button, Dialog, DialogHeader } from "@vizexplorer/global-ui-v2";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import { UserManagementUserFragment } from "./__generated__/users";
import { gql } from "@apollo/client";
import { useUserDeleteMutation } from "./__generated__/delete-user-dialog";
import { useAlert } from "view-v2/alert";

type Props = {
  userToDelete: UserManagementUserFragment;
  onClose: () => void;
};

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2)
}));

export function DeleteUserDialog({ userToDelete, onClose }: Props) {
  const [deleteUser, { loading }] = useUserDeleteMutation({
    update(cache, { data }) {
      if (data?.userDelete) {
        cache.evict({ id: cache.identify(userToDelete) });
        cache.gc();
      }
    }
  });
  const theme = useTheme();
  const { addAlert } = useAlert();

  async function onClickDelete() {
    if (loading) return;
    const { id } = userToDelete;
    await deleteUser({
      variables: { id },
      onCompleted: () => {
        addAlert({ severity: "success", message: "User deleted" });
        onClose?.();
      },
      onError: () => {
        addAlert({
          severity: "error",
          message: "An unexpected error occurred while saving. Please try again."
        });
      }
    });
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <Dialog
      open
      data-testid={"delete-user-dialog"}
      data-loading={loading}
      PaperProps={{ sx: { maxWidth: "400px", width: "100%" } }}
    >
      <DialogHeader
        title={`Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`}
        description={"If you do, the account and access will be permanently deleted."}
        disableClose={loading}
        onClickClose={handleClose}
        padding={theme.spacing(2)}
      />
      <Box p={theme.spacing(2)}>
        <ActionsContainer>
          <Button
            fullWidth
            disabled={loading}
            startIcon={<DeleteRounded />}
            variant="contained"
            onClick={onClickDelete}
          >
            Delete
          </Button>
          <Button
            fullWidth
            disabled={loading}
            variant="outlined"
            color={"neutral"}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </ActionsContainer>
      </Box>
    </Dialog>
  );
}

const __DELETE_USER_MUTATION = gql`
  mutation userDelete($id: String!) {
    userDelete(id: $id)
  }
`;
