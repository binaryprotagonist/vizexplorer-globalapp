import { Autocomplete, TextField } from "@mui/material";
import { findSelectValue } from "./utils";
import { DatePicker } from "@mui/x-date-pickers";
import { FormChangeAction, FormOptions, FormValues } from "./types";
import { isValid } from "date-fns";

type Props = {
  state: FormValues;
  options: FormOptions;
  onChange: (action: FormChangeAction) => void;
  disabled: boolean;
};

export function SubscriptionFormFields({ state, options, onChange, disabled }: Props) {
  const {
    applicationOptions,
    billingIntervalOptions,
    environmentOptions,
    expireDateOptions,
    packageTypeOptions
  } = options;

  return (
    <>
      <Autocomplete
        disableClearable
        data-testid={"application-field"}
        // @ts-ignore allow null
        value={findSelectValue(state.appId, applicationOptions)}
        options={applicationOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label="Application" />}
        onChange={(_, value) =>
          onChange({ field: "application", value: value?.value || null })
        }
        disabled={disabled}
      />
      <Autocomplete
        disableClearable
        data-testid={"environment-field"}
        // @ts-ignore allow null
        value={findSelectValue(state.environment, environmentOptions)}
        options={environmentOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label="Environment" />}
        onChange={(_, value) =>
          onChange({ field: "environment", value: value?.value || null })
        }
        disabled={disabled}
      />
      <Autocomplete
        disableClearable
        data-testid={"billing-interval-field"}
        // @ts-ignore allow null
        value={findSelectValue(state.billingInterval, billingIntervalOptions)}
        options={billingIntervalOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label="Subscription Term" />}
        onChange={(_, value) =>
          onChange({ field: "billing-interval", value: value?.value || null })
        }
        disabled={disabled}
      />
      <Autocomplete
        disableClearable
        data-testid={"package-type-field"}
        // @ts-ignore allow null
        value={findSelectValue(state.packageType, packageTypeOptions)}
        options={packageTypeOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label="Subscription Type" />}
        onChange={(_, value) =>
          onChange({ field: "package-type", value: value?.value || null })
        }
        disabled={disabled}
      />
      <DatePicker
        label={"Contract Expire Date"}
        value={state.expirationDate}
        onChange={(value) => onChange({ field: "expiration-date", value: value })}
        slotProps={{
          textField: {
            // @ts-ignore - typing potentially fixed in MUI v6
            "data-testid": "expire-date-field"
          }
        }}
        minDate={expireDateOptions.min}
        defaultCalendarMonth={
          isValid(state.expirationDate) ? state.expirationDate : expireDateOptions.min
        }
        disabled={!state.appId || disabled}
      />
    </>
  );
}
