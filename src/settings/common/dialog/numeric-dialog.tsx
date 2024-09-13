import { ChangeEvent, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { GeneralDialog } from "../../../view/dialog";
import { NumericInput } from "../numeric-input";

type Props = {
  title: string;
  description: string;
  inputTitle: string;
  value: number;
  min: number;
  max: number;
  onSave: (newValue: number) => void;
  onClose: VoidFunction;
  disabled: boolean;
};

export function NumericDialog({
  title,
  description,
  inputTitle,
  value: initialValue,
  min,
  max,
  onSave,
  onClose,
  disabled
}: Props) {
  const theme = useTheme();
  const [value, setValue] = useState<string>(`${initialValue}`);
  const [error, setError] = useState<Error | null>(null);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setValue(event.target.value);
    const newValue = Number(event.target.value);
    if (event.target.value && (newValue < min || newValue > max)) {
      setError(Error(`${inputTitle} must be between ${min} and ${max}`));
    }
  }

  function handleSave() {
    if (disabled || !!error || !value || isNaN(Number(value))) {
      return;
    }
    onSave(Number(value));
  }

  function handleClose() {
    if (disabled) return;
    onClose();
  }

  return (
    <GeneralDialog
      data-testid={"numeric-dialog"}
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
          disabled: disabled || !!error || !value || isNaN(Number(value)),
          variant: "contained",
          color: "primary",
          onClick: handleSave
        }
      ]}
    >
      <Box display={"grid"} rowGap={theme.spacing(3)} maxWidth={460}>
        <Typography color={theme.palette.text.secondary}>{description}</Typography>
        <NumericInput
          data-testid={"numeric-input"}
          fullWidth
          autoFocus
          variant={"outlined"}
          label={inputTitle}
          value={value}
          onChange={onInputChange}
          error={!!error}
          helperText={<span data-testid={"numeric-error"}>{error?.message || null}</span>}
          disabled={disabled}
          inputProps={{
            maxLength: 10
          }}
        />
      </Box>
    </GeneralDialog>
  );
}
