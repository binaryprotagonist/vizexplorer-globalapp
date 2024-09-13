import {
  Autocomplete,
  Box,
  Checkbox,
  PaperProps,
  formControlLabelClasses,
  outlinedInputClasses,
  styled
} from "@mui/material";
import {
  Chip,
  FormControlLabel,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@vizexplorer/global-ui-v2";
import { useCallback } from "react";
import { HostSelectOption } from "./types";
import { gql } from "@apollo/client";

const StyledAutocomplete = styled(Autocomplete)({
  [`& .${outlinedInputClasses.root}`]: {
    padding: "5px 12px",
    [`& .${outlinedInputClasses.input}`]: {
      padding: "5px 0",
      minWidth: "10px"
    }
  }
}) as typeof Autocomplete;

const StyledFormControlLabel = styled(FormControlLabel)({
  [`&.${formControlLabelClasses.root}`]: {
    overflow: "hidden",
    marginRight: "8px"
  }
});

type Props = {
  value: HostSelectOption[];
  options: HostSelectOption[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (value: HostSelectOption[]) => void;
};

export function HostCodeSelect({ value, options, disabled, loading, onChange }: Props) {
  const PaperComponent = useCallback(
    (props: PaperProps) => (
      <Paper
        data-testid={"host-code-select-menu"}
        {...props}
        elevation={3}
        sx={{ mt: 1 }}
      />
    ),
    []
  );

  return (
    <StyledAutocomplete
      fullWidth
      multiple
      disableClearable
      disableCloseOnSelect
      data-testid={"host-code-select"}
      loading={loading}
      value={value}
      options={options}
      disabled={disabled}
      PaperComponent={PaperComponent}
      getOptionLabel={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_e, value) => onChange(value)}
      renderTags={(values, getTagProps) => {
        return values.map((value, index) => (
          // key included in `getTagProps`
          // eslint-disable-next-line react/jsx-key
          <Tooltip
            followCursor
            key={value.id}
            title={value.name}
            placement={"bottom-start"}
          >
            <span>
              <Chip
                data-testid={"host-code-chip"}
                label={value.id}
                size={"small"}
                {...getTagProps({ index })}
                style={{ margin: "1px 8px 1px 0", height: "30px", cursor: "default" }}
              />
            </span>
          </Tooltip>
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={!value?.length ? "Search and select host codes" : undefined}
          onKeyDown={(event) => {
            // prevent backspace from removing the last chip
            if (event.key === "Backspace") {
              event.stopPropagation();
            }
          }}
        />
      )}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props} key={`host-option-${option.id}`} style={{ paddingLeft: "32px" }}>
            <StyledFormControlLabel
              disableTypography
              control={<Checkbox checked={selected} size={"small"} />}
              label={
                <Tooltip title={option.name} enterDelay={250} placement={"right"}>
                  <Box display={"flex"}>
                    <Typography noWrap variant={"bodySmall"}>
                      <span style={{ fontWeight: 600 }}>{option.id}</span> - {option.name}
                    </Typography>
                  </Box>
                </Tooltip>
              }
              // allow event to propagate to the Autocomplete
              onClick={(e) => e.preventDefault()}
            />
          </li>
        );
      }}
      ListboxProps={{
        sx: {
          maxHeight: "30vh"
        }
      }}
    />
  );
}

HostCodeSelect.fragments = {
  nativeHost: gql`
    fragment MappingSelectNativeHost on PdNativeHost {
      nativeHostId
      firstName
      lastName
    }
  `
};
