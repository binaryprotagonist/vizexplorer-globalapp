import {
  GaUserFragment,
  useCurrentUserQuery,
  useUserPasswordResetMutation
} from "generated-graphql";
import { Box, DialogContentText } from "@mui/material";
import { GeneralDialog } from "../../view/dialog";

type Props = {
  user: GaUserFragment;
  onClose: VoidFunction;
};

export function PasswordResetDialog({ user, onClose }: Props) {
  const { data: curUserData } = useCurrentUserQuery();
  const [resetPassword, { error, loading }] = useUserPasswordResetMutation({
    onCompleted: onClose
  });

  function handleClose() {
    if (loading) return;
    onClose();
  }

  function onClickReset() {
    resetPassword({ variables: { user: { userId: user.id } } });
  }

  if (error) throw error;

  const isCurrentUser = user.id === curUserData?.currentUser?.id;
  return (
    <GeneralDialog
      data-testid={"password-reset-dialog"}
      open={true}
      onClose={handleClose}
      title={"Reset Password"}
      actions={[
        {
          content: "Cancel",
          disabled: loading,
          color: "secondary",
          onClick: handleClose
        },
        {
          content: "Reset",
          disabled: loading,
          variant: "contained",
          onClick: onClickReset
        }
      ]}
    >
      <Box display={"grid"} rowGap={"8px"}>
        <DialogContentText>
          {isCurrentUser ? (
            "Reset your password?"
          ) : (
            <>
              Reset password for{" "}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ?
            </>
          )}
        </DialogContentText>
        <DialogContentText>
          {isCurrentUser
            ? "Password reset instructions will be sent to your email address."
            : "Password reset instructions will be sent to the user's email address."}
        </DialogContentText>
      </Box>
    </GeneralDialog>
  );
}
