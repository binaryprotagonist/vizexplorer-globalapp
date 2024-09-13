import { useState } from "react";
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { GeneralDialog } from "../../../view/dialog";

type Props<T> = {
  title: string;
  description: string;
  inputTitle: string;
  value: NonNullable<T>;
  options: T[];
  onSave: (value: T) => void;
  onClose: VoidFunction;
  disabled: boolean;
} & Pick<AutocompleteProps<T, false, true, false>, "getOptionLabel">;

export function SelectDialog<T>({
  title,
  description,
  inputTitle,
  value: initialValue,
  options,
  onSave,
  onClose,
  disabled,
  getOptionLabel
}: Props<T>) {
  const theme = useTheme();
  const [value, setValue] = useState<NonNullable<T>>(initialValue);

  function handleClose() {
    if (disabled) return;
    onClose();
  }

  return (
    <GeneralDialog
      data-testid={"select-dialog"}
      open={true}
      onClose={handleClose}
      title={title}
      actions={[
        {
          content: "Cancel",
          disabled: disabled,
          color: "secondary",
          onClick: handleClose
        },
        {
          content: "Save",
          disabled: disabled,
          variant: "contained",
          color: "primary",
          onClick: () => onSave(value)
        }
      ]}
    >
      <Box display={"grid"} rowGap={theme.spacing(3)} maxWidth={460}>
        <Typography color={theme.palette.text.secondary}>{description}</Typography>
        <Autocomplete
          disableClearable
          multiple={false}
          data-testid={"select-input"}
          value={value}
          options={options}
          renderInput={(props) => <TextField {...props} label={inputTitle} />}
          getOptionLabel={getOptionLabel}
          onChange={(_, value) => setValue(value)}
          disabled={disabled}
        />
      </Box>
    </GeneralDialog>
  );
}
