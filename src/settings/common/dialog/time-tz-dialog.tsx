import { Autocomplete, Box, TextField, Typography, useTheme } from "@mui/material";
import { TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { Controller, useForm } from "react-hook-form";
import { GeneralDialog } from "../../../view/dialog";
import { defaultTimezone, TimeTz, timeTzAsDate } from "../../../view/utils";
import styled from "@emotion/styled";
import timezones from "../../../view/utils/timezones";

const StyledForm = styled.form(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3)
}));

type FormInput = {
  time: Date;
  timezone: string;
};

type Props = {
  title: string;
  description: string;
  value: TimeTz;
  onSave: (newValue: TimeTz) => void;
  onClose: VoidFunction;
  disabled: boolean;
};

export function TimeTzDialog({
  title,
  description,
  value,
  onSave,
  onClose,
  disabled
}: Props) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>();

  function onFormSubmit(newValue: FormInput) {
    if (disabled || !!validateTime(newValue.time)) {
      return;
    }

    onSave({
      hour: newValue.time.getHours(),
      minute: newValue.time.getMinutes(),
      timezone: newValue.timezone
    });
  }

  function validateTime(time: Date) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    if (isNaN(hours) || isNaN(minutes)) {
      return "Invalid time. Expected format hh:mm (a|p)m";
    }

    return;
  }

  return (
    <GeneralDialog
      data-testid={"time-tz-dialog"}
      open={true}
      onClose={onClose}
      title={title}
      actions={[
        {
          content: "Cancel",
          disabled: disabled || !!errors.time || !!errors.timezone,
          color: "secondary",
          onClick: onClose
        },
        {
          content: "Save",
          disabled: disabled || !!errors.time || !!errors.timezone,
          variant: "contained",
          color: "primary",
          form: "time-tz-form",
          type: "submit"
        }
      ]}
      PaperProps={{
        sx: { maxWidth: 340 }
      }}
    >
      <Box display={"grid"} rowGap={theme.spacing(3)} maxWidth={460}>
        <Typography color={theme.palette.text.secondary}>{description}</Typography>
        <StyledForm id={"time-tz-form"} onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Controller
            control={control}
            name={"time"}
            defaultValue={timeTzAsDate(value)}
            rules={{ required: "Time can't be blank", validate: validateTime }}
            render={({ field }) => (
              <TimePicker
                {...field}
                disabled={disabled}
                slotProps={{
                  textField: {
                    // @ts-ignore - typing potentially fixed in MUI v6
                    "data-testid": "time-input",
                    required: true,
                    label: "Time",
                    error: !!errors.time?.message,
                    helperText: errors.time?.message,
                    variant: "outlined"
                  }
                }}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock
                }}
              />
            )}
          />
          <Controller
            control={control}
            name={"timezone"}
            defaultValue={defaultTimezone(value.timezone).tzCode}
            rules={{ required: "Time Zone can't be blank" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disableClearable
                data-testid={"timezone-input"}
                disabled={disabled}
                options={timezones.map((tz) => tz.tzCode)}
                getOptionLabel={(option) =>
                  timezones.find((tz) => option === tz.tzCode)?.name || ""
                }
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant={"outlined"}
                    label={"Time Zone"}
                    error={!!errors.timezone?.message}
                    helperText={errors.timezone?.message}
                  />
                )}
              />
            )}
          />
        </StyledForm>
      </Box>
    </GeneralDialog>
  );
}
