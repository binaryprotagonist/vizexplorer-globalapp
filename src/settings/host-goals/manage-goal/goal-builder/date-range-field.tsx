import { Box, useTheme } from "@mui/material";
import { DesktopDatePicker } from "view-v2/date-picker";
import { InputLabel } from "view-v2/input-label";

type Props = {
  label: string;
  from: Date | null;
  to: Date | null;
  maxFrom: Date | null;
  minTo: Date | null;
  helpText?: string;
  disabled: boolean;
  onFromChange: (value: Date | null) => void;
  onToChange: (value: Date | null) => void;
};

export function DateRangeField({
  label,
  from,
  to,
  maxFrom,
  minTo,
  helpText,
  disabled,
  onFromChange,
  onToChange,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Box display={"grid"} width={"100%"} {...rest}>
      <InputLabel help={helpText}>{label}</InputLabel>
      <Box display={"flex"} columnGap={theme.spacing(3)}>
        <DatePicker
          data-testid={"period-from"}
          value={from}
          placeholder={"From"}
          maxDate={maxFrom}
          disabled={disabled}
          onChange={(value) => onFromChange(value)}
        />
        <DatePicker
          data-testid={"period-to"}
          value={to}
          placeholder={"To"}
          minDate={minTo}
          disabled={disabled}
          onChange={(value) => onToChange(value)}
        />
      </Box>
    </Box>
  );
}

type DatePickerProps = {
  value: Date | null;
  placeholder: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabled: boolean;
  onChange: (value: Date | null) => void;
};

function DatePicker({
  value,
  placeholder,
  minDate,
  maxDate,
  disabled,
  onChange,
  ...rest
}: DatePickerProps) {
  return (
    <DesktopDatePicker
      reduceAnimations
      value={value}
      minDate={minDate ?? undefined}
      maxDate={maxDate ?? undefined}
      disabled={disabled}
      format={"dd MMMM yyyy"}
      slotProps={{
        field: {
          ...rest
        },
        textField: {
          fullWidth: true,
          InputProps: { placeholder }
        },
        popper: {
          placement: "bottom-end"
        }
      }}
      onChange={(value) => onChange(value)}
    />
  );
}
