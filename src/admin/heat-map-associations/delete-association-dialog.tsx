import { Box, DialogContentText, styled, Typography, useTheme } from "@mui/material";
import { format, parseISO } from "date-fns";
import { OrgHeatMapFragment } from "generated-graphql";
import { GeneralDialog } from "../../view/dialog";
import { filenameFromId, HEATMAP_DATE_FORMAT } from "./utils";

const KeyValueContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "max-content auto",
  columnGap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

type Props = {
  association: OrgHeatMapFragment;
  onDelete: (id: string) => void;
  onCancel: VoidFunction;
  disabled: boolean;
};

export function DeleteAssociationDialog({
  association,
  onDelete,
  onCancel,
  disabled
}: Props) {
  const theme = useTheme();

  return (
    <GeneralDialog
      data-testid={"delete-association-dialog"}
      open={true}
      title={"Delete confirmation"}
      actions={[
        {
          content: "Cancel",
          size: "large",
          color: "secondary",
          disabled,
          onClick: onCancel
        },
        {
          content: "Delete",
          variant: "contained",
          size: "large",
          disabled: disabled,
          onClick: () => {
            onDelete(association.id);
          }
        }
      ]}
      titleProps={{ sx: { textAlign: "center", fontSize: "1.85em" } }}
      actionProps={{ sx: { margin: theme.spacing(1, 3) } }}
    >
      <Box display={"grid"} m={theme.spacing(1, 3)} rowGap={theme.spacing(3)}>
        <DialogContentText fontSize={"1.3em"}>
          {"Are you sure you want to delete the following Heat Map File?"}
        </DialogContentText>

        <Box>
          <KeyValueContainer data-testid={"file-name"}>
            <Typography fontWeight={500}>{"File Name:"}</Typography>
            <Typography>{filenameFromId(association.heatMapId ?? "")}</Typography>
          </KeyValueContainer>
          <KeyValueContainer data-testid={"effective-from"}>
            <Typography fontWeight={500}>{"Effective From:"}</Typography>
            <Typography>
              {format(parseISO(association.effectiveFrom), HEATMAP_DATE_FORMAT)}
            </Typography>
          </KeyValueContainer>
          <KeyValueContainer data-testid={"floor-id"}>
            <Typography fontWeight={500}>{"Floor ID:"}</Typography>
            <Typography>{`${association.floorId}`}</Typography>
          </KeyValueContainer>
        </Box>
      </Box>
    </GeneralDialog>
  );
}
