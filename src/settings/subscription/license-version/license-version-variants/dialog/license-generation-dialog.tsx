import { DialogContentText } from "@mui/material";
import { GeneralDialog } from "../../../../../view/dialog";

type Props = {
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
  loading: boolean;
};

export function LicenseGenerationDialog({ onConfirm, onCancel, loading }: Props) {
  return (
    <GeneralDialog
      data-testid={"license-generation-dialog"}
      open={true}
      onClose={!loading ? onCancel : undefined}
      title={"Generate License"}
      actions={[
        {
          content: "Cancel",
          disabled: loading,
          color: "secondary",
          onClick: onCancel
        },
        {
          content: "Generate",
          disabled: loading,
          variant: "contained",
          color: "error",
          onClick: onConfirm
        }
      ]}
    >
      <DialogContentText>
        Performing this action will disable any current license for this organization. The
        new license will need to be entered and validated for the application to function
        properly.
      </DialogContentText>
    </GeneralDialog>
  );
}
