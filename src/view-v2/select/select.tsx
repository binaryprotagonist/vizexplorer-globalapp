import { PaperProps, Radio } from "@mui/material";
import {
  Autocomplete,
  AutocompleteProps,
  FormControlLabel,
  Paper,
  TextField
} from "@vizexplorer/global-ui-v2";
import { ReactNode, useCallback } from "react";

type Props<T> = {
  startAdornment?: ReactNode;
  placeholder?: string;
} & Omit<AutocompleteProps<T, false, true, false>, "renderInput">;

export function Select<T>({
  value,
  loading,
  placeholder = "",
  startAdornment,
  getOptionLabel,
  ...rest
}: Props<T>) {
  const PaperComponent = useCallback(
    (props: PaperProps) => <Paper {...props} elevation={3} sx={{ mt: 1 }} />,
    []
  );

  return (
    <Autocomplete
      disableClearable
      loading={loading}
      value={value}
      getOptionLabel={getOptionLabel}
      {...rest}
      ListboxProps={{
        sx: {
          maxHeight: "30vh"
        }
      }}
      PaperComponent={PaperComponent}
      renderInput={({ InputProps, ...rest }) => (
        <TextField
          {...rest}
          placeholder={loading ? "Loading..." : !value ? placeholder : undefined}
          InputProps={{
            ...InputProps,
            startAdornment: (
              <>
                {startAdornment}
                {InputProps.startAdornment}
              </>
            )
          }}
        />
      )}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props}>
            <FormControlLabel
              control={<Radio checked={selected} size={"small"} />}
              label={getOptionLabel?.(option) ?? <>{option}</>}
            />
          </li>
        );
      }}
    />
  );
}
