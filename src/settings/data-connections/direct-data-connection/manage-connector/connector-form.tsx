import styled from "@emotion/styled";
import { Autocomplete, Box, FormControlLabel, Switch, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { scheduleAsDate } from "../utils";
import { FormInput } from "./types";
import { DataConnectorFieldsFragment } from "generated-graphql";
import { timezoneAsOption } from "./utils";
import { defaultTimezone } from "../../../../view/utils";
import timezones from "../../../../view/utils/timezones";

const StyledForm = styled.form(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(2),
  padding: theme.spacing(1, 4)
}));

const InlineContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  columnGap: theme.spacing(2),
  [`@media (max-width: ${theme.breakpoints.values.sm - 1}px)`]: {
    gridTemplateColumns: "1fr",
    rowGap: theme.spacing(3)
  }
}));

type Props = {
  connector: DataConnectorFieldsFragment | null;
  onSubmit: (form: FormInput) => void;
  disabled: boolean;
};

export function ConnectorForm({ connector, onSubmit, disabled }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>();

  return (
    <StyledForm
      id={"connector-form"}
      data-testid={"connection-form"}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Controller
        control={control}
        name={"name"}
        defaultValue={connector?.name || ""}
        rules={{ required: "Connection Name can't be blank" }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            data-testid={"name-input"}
            variant={"outlined"}
            label={"Connection Name"}
            error={!!errors.name?.message}
            helperText={errors.name?.message}
            inputProps={{ maxLength: "64" }}
            disabled={disabled}
          />
        )}
      />
      <InlineContainer gridTemplateColumns={"5fr 2.5fr"}>
        <Controller
          control={control}
          name={"hostname"}
          defaultValue={connector?.params?.hostname || ""}
          rules={{ required: "Host can't be blank" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              data-testid={"host-input"}
              variant={"outlined"}
              label={"Host"}
              error={!!errors.hostname?.message}
              helperText={errors.hostname?.message}
              inputProps={{ maxLength: "64" }}
              disabled={disabled}
            />
          )}
        />
        <Controller
          control={control}
          name={"port"}
          defaultValue={connector?.params?.port.toString() || ""}
          rules={{ required: "Port can't be blank" }}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"port-input"}
              type={"number"}
              required
              variant={"outlined"}
              label={"Port"}
              error={!!errors.port?.message}
              helperText={errors.port?.message}
              inputProps={{ maxLength: "5" }}
              disabled={disabled}
            />
          )}
        />
      </InlineContainer>

      <Controller
        control={control}
        name={"tlsEnabled"}
        defaultValue={connector ? !!connector.params?.tlsEnabled : true}
        render={({ field: { value, ...rest } }) => {
          return (
            <FormControlLabel
              control={<Switch {...rest} data-testid={"tls-toggle"} checked={value} />}
              label={"Enable TLS encryption"}
              labelPlacement={"start"}
              disabled={disabled}
              sx={{
                m: "0 auto 0 0"
              }}
              slotProps={{
                typography: {
                  fontWeight: 500
                }
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name={"database"}
        defaultValue={connector?.params?.database || ""}
        rules={{ required: "Database Name can't be blank" }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            data-testid={"database-input"}
            variant={"outlined"}
            label={"Database Name"}
            error={!!errors.database?.message}
            helperText={errors.database?.message}
            inputProps={{ maxLength: "32" }}
            disabled={disabled}
          />
        )}
      />
      <Controller
        control={control}
        name={"username"}
        defaultValue={connector?.params?.username || ""}
        rules={{ required: "Username can't be blank" }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            data-testid={"username-input"}
            variant={"outlined"}
            label={"Username"}
            error={!!errors.username?.message}
            helperText={errors.username?.message}
            inputProps={{ maxLength: "32" }}
            disabled={disabled}
          />
        )}
      />
      <Controller
        control={control}
        name={"password"}
        defaultValue={!connector ? "" : "__REDACTED_PASS__"}
        rules={!connector ? { required: "Password can't be blank" } : undefined}
        render={({ field }) => (
          <TextField
            {...field}
            required={!connector}
            data-testid={"password-input"}
            type={"password"}
            variant={"outlined"}
            label={"Password"}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
            inputProps={{ maxLength: "32" }}
            disabled={disabled}
          />
        )}
      />

      <InlineContainer gridTemplateColumns={"1fr 1fr"}>
        <Controller
          control={control}
          name={"dataRefreshTime"}
          defaultValue={
            connector?.dataRefreshTime ? scheduleAsDate(connector.dataRefreshTime) : null
          }
          rules={{ required: "Data Refresh Time can't be blank" }}
          render={({ field }) => (
            <TimePicker
              {...field}
              disabled={disabled}
              slotProps={{
                textField: {
                  // @ts-ignore - typing potentially fixed in MUI v6
                  "data-testid": "schedule-input",
                  required: true,
                  label: "Data Refresh Time",
                  error: !!errors.dataRefreshTime?.message,
                  helperText: errors.dataRefreshTime?.message,
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
          defaultValue={timezoneAsOption(
            defaultTimezone(connector?.dataRefreshTime?.timezone)
          )}
          rules={{ required: "Time Zone can't be blank" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              disableClearable
              data-testid={"timezone-input"}
              disabled={disabled}
              options={timezones.map(timezoneAsOption)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
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
      </InlineContainer>
    </StyledForm>
  );
}
