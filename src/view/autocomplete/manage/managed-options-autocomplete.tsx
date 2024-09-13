import React from "react";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { OptionChangeType, OptionType } from "./types";
import { createEditableOptions, createNewOption } from "./utils";

export type ManagedOptionsAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Pick<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "options"> & {
  value: T;
  newOptionLabel: string;
  onChange: (changeType: OptionChangeType<T>) => void;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  label?: string;
};

export function ManagedOptionsAutocomplete<T>({
  options,
  value,
  newOptionLabel,
  onChange,
  getOptionLabel,
  isOptionEqualToValue,
  label,
  ...rest
}: ManagedOptionsAutocompleteProps<T>) {
  const editableOptions = createEditableOptions(options, onChange);
  const newOption = createNewOption(newOptionLabel, onChange);
  const combinedOptions = [...editableOptions, newOption];

  function handleChange(_: React.SyntheticEvent, newOpt: OptionType<T> | null) {
    if (!newOpt || newOpt.type === "new") return;
    onChange({ type: "change", value: newOpt.value });
  }

  function handleGetOptionLabel(option: OptionType<T>): string {
    if (!option.value) return "";
    if (!getOptionLabel) return option.value as string;
    return option.type === "new" ? option.value : getOptionLabel(option.value);
  }

  function handleIsOptionEqualToValue(
    option: OptionType<T>,
    value: OptionType<T>
  ): boolean {
    if (option.type === "new" || value.type === "new") return false;
    if (!isOptionEqualToValue) return option === value;
    return isOptionEqualToValue(option.value, value.value);
  }

  return (
    <Autocomplete
      {...rest}
      // @ts-ignore
      value={value ? { type: "editable", value } : null}
      options={combinedOptions}
      onChange={handleChange}
      renderInput={(props) => <TextField {...props} label={label} />}
      renderOption={(props, option) =>
        option.render?.(props, handleGetOptionLabel(option)) || <>{option.value}</>
      }
      getOptionLabel={handleGetOptionLabel}
      isOptionEqualToValue={handleIsOptionEqualToValue}
      ListboxProps={{
        style: { padding: 0 }
      }}
    />
  );
}
