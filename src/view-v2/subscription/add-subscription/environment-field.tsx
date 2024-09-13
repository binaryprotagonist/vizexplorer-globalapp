import { Box } from "@mui/material";
import {
  Autocomplete,
  InputLabel,
  TextField,
  Typography,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import { SubscriptionEnvironment } from "../types";
import { displaySubscriptionEnvironment } from "../utils";
import { CheckmarkOption } from "view-v2/select/components/checkmark-option";

type Props = {
  selected?: SubscriptionEnvironment | null;
  options: SubscriptionEnvironment[];
  disabled?: boolean;
  onChange: (value: SubscriptionEnvironment) => void;
};

export function EnvironmentField({
  selected,
  options,
  disabled = false,
  onChange
}: Props) {
  const globalTheme = useGlobalTheme();

  return (
    <Box data-testid={"environment"} display={"flex"} flexDirection={"column"}>
      <InputLabel>Cloud or On-Premises</InputLabel>
      <Autocomplete
        disableClearable
        data-testid={"environment-field"}
        // @ts-ignore allow null
        value={selected ?? null}
        options={options}
        disabled={disabled}
        onChange={(_, environment) => onChange(environment)}
        getOptionLabel={displaySubscriptionEnvironment}
        renderOption={(props, option, state) => (
          <CheckmarkOption
            {...props}
            option={displaySubscriptionEnvironment(option)}
            selected={state.selected}
          />
        )}
        renderInput={(props) => (
          <TextField {...props} placeholder={"Select installation environment"} />
        )}
      />
      <Typography variant={"bodySmall"} color={globalTheme.colors.grey[600]} mt={1}>
        {`Your first selection will apply to all subsequent subscriptions. If you select
            ${displaySubscriptionEnvironment(SubscriptionEnvironment.CLOUD)}, all following subscriptions must also be ${displaySubscriptionEnvironment(SubscriptionEnvironment.CLOUD)}. Changing from
            ${displaySubscriptionEnvironment(SubscriptionEnvironment.CLOUD)} to ${displaySubscriptionEnvironment(SubscriptionEnvironment.ONPREM)} later will delete all selected subscriptions, and you
            will need to start again.`}
      </Typography>
    </Box>
  );
}
