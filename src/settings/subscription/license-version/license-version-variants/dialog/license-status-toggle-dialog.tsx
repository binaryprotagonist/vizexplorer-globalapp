import { Box, DialogContentText, useTheme } from "@mui/material";
import { GeneralDialog } from "../../../../../view/dialog";

type Props = {
  licenseId: string;
  isActive: boolean;
  onConfirm: (licenseId: string, action: "enable" | "disable") => void;
  onCancel: VoidFunction;
  loading: boolean;
};

export function LicenseStatusToggleDialog({
  licenseId,
  isActive,
  onConfirm,
  onCancel,
  loading
}: Props) {
  const theme = useTheme();

  return (
    <GeneralDialog
      data-testid={"license-status-toggle-dialog"}
      open={true}
      onClose={!loading ? onCancel : undefined}
      title={`${isActive ? "Disable" : "Enable"} License`}
      actions={[
        {
          content: "Cancel",
          disabled: loading,
          color: "secondary",
          onClick: onCancel
        },
        {
          content: isActive ? "Disable" : "Enable",
          disabled: loading,
          variant: "contained",
          color: "error",
          onClick: () => onConfirm(licenseId, isActive ? "disable" : "enable")
        }
      ]}
    >
      <Box display={"grid"} gap={theme.spacing(2)}>
        <DialogContentText>
          {isActive ? "Disable license?" : "Enable license?"}
        </DialogContentText>
        <DialogContentText>
          This will {isActive ? "expire" : "activate"} this organization&apos;s license
          key.
        </DialogContentText>
      </Box>
    </GeneralDialog>
  );
}
