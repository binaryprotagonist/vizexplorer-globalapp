import { Box, DialogContentText } from "@mui/material";
import { GeneralDialog } from "../../../../../view/dialog";
import { UserManagementUserFragment } from "../../__generated__/users";

type Props = {
  user: UserManagementUserFragment;
  onConfirm: (user: UserManagementUserFragment) => void;
  onCancel: VoidFunction;
  disabled: boolean;
};

export function ImpersonateUserDialog({ user, onConfirm, onCancel, disabled }: Props) {
  return (
    <GeneralDialog
      data-testid={"impersonate-user-dialog"}
      open={true}
      title={"Impersonate User"}
      onClose={!disabled ? onCancel : undefined}
      actions={[
        {
          content: "Cancel",
          color: "secondary",
          disabled,
          onClick: onCancel
        },
        {
          content: "Impersonate",
          variant: "contained",
          disabled,
          onClick: () => onConfirm(user)
        }
      ]}
    >
      <Box display={"grid"} rowGap={"8px"}>
        <DialogContentText>
          Impersonate User{" "}
          <strong>
            {user.firstName} {user.lastName}
          </strong>
          ?
        </DialogContentText>
        <DialogContentText>
          {
            "This will log you out of your admin account and into the account of this user. To return to your admin account you will need to sign out and back in."
          }
        </DialogContentText>
      </Box>
    </GeneralDialog>
  );
}
