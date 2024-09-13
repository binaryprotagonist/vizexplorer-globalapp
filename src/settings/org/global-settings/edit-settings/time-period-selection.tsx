import { useTheme } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { GeneralDialog } from "../../../../view/dialog";
import { isMatchingTimePeriod, timePeriodLabel } from "../utils";
import { GlobalSettingsTimePeriodFragment } from "../__generated__/global-settings";

type Props = {
  title: string;
  initialTimePeriod: GlobalSettingsTimePeriodFragment[];
  disabled?: boolean;
  onCancel: VoidFunction;
  onSave: (timePeriods: GlobalSettingsTimePeriodFragment[]) => void;
};

export function TimePeriodSelection({
  title,
  initialTimePeriod,
  disabled = false,
  onCancel,
  onSave
}: Props) {
  const theme = useTheme();
  const [timePeriods, setTimePeriods] =
    useState<GlobalSettingsTimePeriodFragment[]>(initialTimePeriod);

  const enabledPeriods = timePeriods.filter((p) => p.enabled);
  const isValidForm = enabledPeriods.length && enabledPeriods.some((p) => p.default);

  function handlePeriodToggle(
    period: GlobalSettingsTimePeriodFragment,
    checked: boolean
  ) {
    setTimePeriods((cur) => {
      return cur.map((curPeriod) => {
        if (!isMatchingTimePeriod(period, curPeriod)) return curPeriod;

        return {
          ...curPeriod,
          enabled: checked,
          default: curPeriod.default && !checked ? false : curPeriod.default
        };
      });
    });
  }

  function handleDefaultPeriodChange(selected: GlobalSettingsTimePeriodFragment | null) {
    setTimePeriods((cur) =>
      cur.map((timePeriod) => ({
        ...timePeriod,
        default: !!selected && isMatchingTimePeriod(timePeriod, selected)
      }))
    );
  }

  return (
    <GeneralDialog
      open
      data-testid={"time-period-selection"}
      title={title}
      actions={[
        {
          content: "Cancel",
          size: "large",
          color: "secondary",
          disabled,
          onClick: onCancel
        },
        {
          content: "Save",
          variant: "contained",
          size: "large",
          disabled: disabled || !isValidForm,
          onClick: () => {
            if (!isValidForm) return;
            onSave(timePeriods);
          }
        }
      ]}
      titleProps={{ sx: { textAlign: "center", fontSize: "1.85em" } }}
      actionProps={{ sx: { margin: theme.spacing(1, 3) } }}
      PaperProps={{
        sx: { maxWidth: "525px", width: "100%" }
      }}
    >
      <Box display={"grid"} m={theme.spacing(1, 3)} rowGap={theme.spacing(4)}>
        <Typography fontSize={"18px"}>
          Please pick the time period and the default one.
        </Typography>
        <FormGroup data-testid={"time-period-check-group"} sx={{ width: "max-content" }}>
          {timePeriods.map((timePeriod, idx) => (
            <FormControlLabel
              key={`time-period-check-${idx}`}
              disableTypography
              data-testid={"time-period-check"}
              disabled={disabled}
              label={
                <Typography fontWeight={500}>{timePeriodLabel(timePeriod)}</Typography>
              }
              control={
                <Checkbox
                  checked={timePeriod.enabled}
                  onChange={() => handlePeriodToggle(timePeriod, !timePeriod.enabled)}
                />
              }
            />
          ))}
        </FormGroup>
        <Autocomplete
          data-testid={"time-period-default"}
          value={enabledPeriods.find((p) => p.default) ?? null}
          options={enabledPeriods}
          disabled={disabled}
          getOptionLabel={(o) => timePeriodLabel(o)}
          isOptionEqualToValue={isMatchingTimePeriod}
          onChange={(_, value) => handleDefaultPeriodChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Default value"
              placeholder={"Select default value"}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true
              }}
            />
          )}
        />
      </Box>
    </GeneralDialog>
  );
}
