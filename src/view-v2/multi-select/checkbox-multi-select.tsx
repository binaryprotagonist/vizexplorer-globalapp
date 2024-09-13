import { ReactNode, useCallback } from "react";
import { Checkbox, FilterOptionsState, createFilterOptions } from "@mui/material";
import { Autocomplete, Chip, TextField, Typography } from "@vizexplorer/global-ui-v2";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";

type Props<T extends object | string> = {
  showSelectAll?: boolean;
  value: T[];
  options: T[];
  fullWidth?: boolean;
  limitTags?: number;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
  allOptionLabel?: string;
  noOptionsText?: string;
  filterOptions?: (options: T[], params: FilterOptionsState<T>) => T[];
  onChange: (value: T[]) => void;
  getOptionLabel?: (option: T) => string;
};

export function CheckboxMultiSelect<T extends object | string>({
  showSelectAll = false,
  value,
  options,
  limitTags = 1,
  loading,
  placeholder = "",
  icon,
  allOptionLabel = "All",
  noOptionsText,
  filterOptions,
  onChange,
  getOptionLabel,
  ...rest
}: Props<T>) {
  const allSelected = value?.length === options.length;

  const handleFilterOptions = useCallback(
    (options: T[], params: FilterOptionsState<T>) => {
      const filtered = filterOptions
        ? filterOptions(options, params)
        : createFilterOptions<T>()(options, params);

      if (showSelectAll && filtered.length) {
        return ["__ALL__", ...filtered];
      }

      return filtered;
    },
    [filterOptions, showSelectAll]
  );

  const handleGetOptionLabel = useCallback(
    (option: T) => {
      if (getOptionLabel) return getOptionLabel(option);

      return typeof option === "string" ? option : "";
    },
    [getOptionLabel]
  );

  return (
    <Autocomplete
      multiple
      loading={loading}
      disableClearable
      disableCloseOnSelect
      limitTags={limitTags}
      value={value}
      options={options}
      noOptionsText={noOptionsText}
      // @ts-ignore - allow __ALL__
      filterOptions={handleFilterOptions}
      getOptionLabel={handleGetOptionLabel}
      onChange={(_e, newValue) => {
        if (newValue.find((option) => option === "__ALL__")) {
          onChange(value?.length === options.length ? [] : options);
          return;
        }

        onChange(newValue);
      }}
      ListboxProps={{
        sx: {
          maxHeight: "30vh"
        }
      }}
      renderTags={(value, getTagProps) => {
        if (allSelected && showSelectAll) {
          return (
            <Chip
              data-testid={"value-chip"}
              label={allOptionLabel}
              size={"small"}
              style={{ margin: "0 0 0 2px", height: "30px" }}
              onDelete={() => onChange([])}
            />
          );
        }

        return value.map((option, index) => (
          // getTagProps provides the key
          // eslint-disable-next-line react/jsx-key
          <Chip
            data-testid={"value-chip"}
            label={handleGetOptionLabel(option)}
            size={"small"}
            {...getTagProps({ index })}
            style={{ margin: "1px 0 1px 2px", height: "30px" }}
          />
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={!value.length ? placeholder : undefined}
          onKeyDown={(event) => {
            // prevent backspace from removing the last chip
            if (event.key === "Backspace") {
              event.stopPropagation();
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {icon}
                {params.InputProps.startAdornment}
              </>
            )
          }}
        />
      )}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankRoundedIcon fontSize={"small"} />}
              checkedIcon={<CheckBoxRoundedIcon fontSize={"small"} />}
              checked={selected || (option === "__ALL__" && allSelected)}
            />
            <Typography variant={"bodySmall"}>
              {option === "__ALL__" ? allOptionLabel : handleGetOptionLabel(option)}
            </Typography>
          </li>
        );
      }}
      {...rest}
    />
  );
}
