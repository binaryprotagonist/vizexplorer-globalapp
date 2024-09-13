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
import { UsersSelectGroupType, UsersSelectOption } from "./types";
import { HelpTip } from "view-v2/help-tip";

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
  value: UsersSelectOption[];
  options: UsersSelectOption[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (value: UsersSelectOption[]) => void;
};

export function UsersSelect({ value, options, disabled, loading, onChange }: Props) {
  const PaperComponent = useCallback(
    (props: PaperProps) => (
      <Paper data-testid={"users-select-menu"} {...props} elevation={3} sx={{ mt: 1 }} />
    ),
    []
  );

  return (
    <StyledAutocomplete
      fullWidth
      multiple
      disableClearable
      disableCloseOnSelect
      data-testid={"users-select"}
      loading={loading}
      value={value}
      options={options}
      disabled={disabled}
      PaperComponent={PaperComponent}
      getOptionLabel={optionLabel}
      groupBy={(option) => option.group}
      onChange={(_e, value) => onChange(value)}
      renderTags={(values, getTagProps) => {
        return values.map((value, index) => (
          // key included in `getTagProps`
          // eslint-disable-next-line react/jsx-key
          <Chip
            data-testid={"user-chip"}
            label={value.name}
            size={"small"}
            {...getTagProps({ index })}
            style={{ margin: "1px 8px 1px 0", height: "30px" }}
          />
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={!value?.length ? "Search and select users" : undefined}
          onKeyDown={(event) => {
            // prevent backspace from removing the last chip
            if (event.key === "Backspace") {
              event.stopPropagation();
            }
          }}
        />
      )}
      isOptionEqualToValue={(option, value) => {
        return optionId(option) === optionId(value);
      }}
      renderGroup={(params) => (
        <li data-testid={"user-group"} key={params.key}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography fontWeight={600} pl={"16px"}>
              {groupLabel(params.group as UsersSelectGroupType)}
            </Typography>
            <HelpTip
              title={groupTooltip(params.group as UsersSelectGroupType)}
              placement={"right"}
              iconProps={{ sx: { fontSize: "15px" } }}
            />
          </Box>
          <ul style={{ padding: 0 }}>{params.children}</ul>
        </li>
      )}
      renderOption={(props, option, { selected, index }) => {
        return (
          <li
            {...props}
            key={`${optionId(option)}-${index}`}
            style={{ paddingLeft: "32px" }}
          >
            <StyledFormControlLabel
              disableTypography
              control={<Checkbox checked={selected} size={"small"} />}
              label={
                <Tooltip title={optionLabel(option)} enterDelay={250} placement={"right"}>
                  <Typography noWrap variant={"bodySmall"}>
                    {optionLabel(option)}
                  </Typography>
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

function groupLabel(group: UsersSelectGroupType) {
  return group === "mapped" ? "Mapped users" : "Unmapped host codes";
}

function groupTooltip(group: UsersSelectGroupType) {
  return group === "mapped"
    ? "Users mapped to host codes"
    : "Host codes without users mapped to them";
}

function optionLabel(option: UsersSelectOption): string {
  if (option.group === "unmapped") {
    return `${option.name} - ${option.nativeHost.nativeHostId}`;
  }

  return `${option.name} - ${option.hostCodes.join(", ")}`;
}

function optionId(option: UsersSelectOption): string {
  return option.group === "mapped"
    ? `mapped-${option.userId}`
    : `unmapped-${option.nativeHost.nativeHostId}`;
}
