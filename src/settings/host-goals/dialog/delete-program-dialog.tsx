import { Box, useTheme } from "@mui/material";
import { Button, Dialog, DialogHeader } from "@vizexplorer/global-ui-v2";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

type Props = {
  programName: string;
  disabled: boolean;
  onDelete: VoidFunction;
  onClose: VoidFunction;
};

export function DeleteProgramDialog({ programName, disabled, onDelete, onClose }: Props) {
  const theme = useTheme();

  return (
    <Dialog
      open
      data-testid={"delete-program-dialog"}
      PaperProps={{ sx: { maxWidth: "340px" } }}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <DialogHeader
          title={`Are you sure you want to delete ${programName}?`}
          onClickClose={onClose}
          disableClose={disabled}
        />

        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={theme.spacing(2)}
          m={theme.spacing(2)}
        >
          <Button
            variant={"contained"}
            startIcon={<DeleteRoundedIcon />}
            onClick={onDelete}
            disabled={disabled}
            size={"large"}
          >
            Delete
          </Button>
          <Button
            variant={"outlined"}
            color={"neutral"}
            onClick={onClose}
            disabled={disabled}
            size={"large"}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
