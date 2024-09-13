import {
  Box,
  DialogContentText,
  styled,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format, isAfter, isSameDay, isValid, parseISO } from "date-fns";
import { HeatMapInventoryFragment } from "generated-graphql";
import { useState } from "react";
import { GeneralDialog } from "../../view/dialog";
import { filenameFromId, HEATMAP_DATE_FORMAT } from "./utils";

const KeyValueContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "max-content auto",
  columnGap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

function isValidEffectiveDate(date: Date | null) {
  return !!date && !!isValid(date) && isAfter(date, new Date("2000-01-01"));
}

function isValidFloorId(floorId: string): boolean {
  const nFloorId = Number(floorId);
  return !isNaN(nFloorId) && nFloorId > 0;
}

function dateFromHeatmapOrDefault(heatmap: HeatMapInventoryFragment): Date {
  if (heatmap.attributes?.date) {
    const parsedDate = parseISO(heatmap.attributes?.date);
    if (!isValid(parsedDate)) {
      return new Date();
    }
    return parsedDate;
  }

  return new Date();
}

function floorFromHeatmapOrDefault(heatmap: HeatMapInventoryFragment): string {
  if (heatmap.attributes?.floor) {
    const parsedFloor = Number(heatmap.attributes?.floor);
    if (isNaN(parsedFloor) || parsedFloor <= 0) {
      return "1";
    }
    return parsedFloor.toString();
  }

  return "1";
}

type ExistingAssociation = {
  date: string;
  floorId: string;
};

type Props = {
  heatmap: HeatMapInventoryFragment;
  onAssociate: (effectiveDate: Date, floorId: string, overwrite: boolean) => void;
  onCancel: VoidFunction;
  disabled: boolean;
  // attributes in which files have already been associated for and would be overwritten
  existingAssociations: ExistingAssociation[];
};

export function AssociateDialog({
  heatmap,
  onAssociate,
  onCancel,
  disabled,
  existingAssociations
}: Props) {
  const theme = useTheme();
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(
    dateFromHeatmapOrDefault(heatmap)
  );
  const [floorId, setFloorId] = useState<string>(floorFromHeatmapOrDefault(heatmap));

  const isConflictingAssociation = existingAssociations.some((association) => {
    return (
      !!effectiveDate &&
      isSameDay(parseISO(association.date), effectiveDate) &&
      association.floorId === floorId.toString()
    );
  });
  const isFormValid = isValidEffectiveDate(effectiveDate) && isValidFloorId(floorId);

  return (
    <GeneralDialog
      data-testid={"associate-heatmap-dialog"}
      open={true}
      title={"Association details"}
      actions={[
        {
          content: "Cancel",
          size: "large",
          color: "secondary",
          disabled,
          onClick: onCancel
        },
        {
          content: "Associate",
          variant: "contained",
          size: "large",
          disabled: disabled || !isFormValid,
          onClick: () => {
            if (!isFormValid) return;
            onAssociate(effectiveDate!, floorId, isConflictingAssociation);
          }
        }
      ]}
      titleProps={{ sx: { textAlign: "center", fontSize: "1.85em" } }}
      actionProps={{ sx: { margin: theme.spacing(1, 3) } }}
      PaperProps={{
        sx: { maxWidth: "525px" }
      }}
    >
      <Box display={"grid"} m={theme.spacing(1, 3)} rowGap={theme.spacing(4)}>
        <DialogContentText fontSize={"1.3em"}>
          Please pick effective date and floor ID for the following File:
        </DialogContentText>
        <Box>
          <KeyValueContainer data-testid={"file-name"}>
            <Typography fontWeight={500}>File Name:</Typography>
            <Typography>{filenameFromId(heatmap.id)}</Typography>
          </KeyValueContainer>
          <KeyValueContainer data-testid={"upload-date"}>
            <Typography fontWeight={500}>Upload Date: </Typography>
            <Typography>
              {format(parseISO(heatmap.uploadedAt), HEATMAP_DATE_FORMAT)}
            </Typography>
          </KeyValueContainer>
        </Box>
        <DatePicker
          label={"Effective Date"}
          value={effectiveDate}
          onChange={setEffectiveDate}
          disabled={disabled}
          slotProps={{
            textField: {
              // @ts-ignore - typing potentially fixed in MUI v6
              "data-testid": "effective-date-field",
              focused: isConflictingAssociation,
              error: !isValidEffectiveDate(effectiveDate),
              InputProps: {
                placeholder: "Effective Date"
              }
            },
            inputAdornment: {
              position: "start"
            }
          }}
        />
        <TextField
          data-testid={"floor-id-field"}
          type={"number"}
          label={"Floor ID"}
          value={floorId}
          onChange={(e) => setFloorId(e.target.value)}
          disabled={disabled}
          error={!isValidFloorId(floorId)}
        />
        <Box height={"54px"}>
          {isConflictingAssociation && (
            <Typography color={"#E46E19"} fontWeight={500} fontSize={18}>
              {
                "There is already a file for this floor with that effective date. If you associate it, it will override it."
              }
            </Typography>
          )}
        </Box>
      </Box>
    </GeneralDialog>
  );
}
