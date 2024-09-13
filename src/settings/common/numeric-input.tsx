import { ChangeEvent, KeyboardEvent } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export function NumericInput({
  inputProps,
  InputLabelProps,
  onChange,
  ...rest
}: TextFieldProps) {
  // handle keystroke values, ignoring technically valid characters that aren't strictly numeric
  function onInputKeyDown(event: KeyboardEvent) {
    const disallowedKeys = [",", ".", "e", "-", "+"];
    if (disallowedKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // handle input values with anything that isn't strictly a number (including via copy-paste)
    event.target.value = event.target.value.replace(/\D/g, "");
    onChange?.(event);
  }

  return (
    <TextField
      type={"number"}
      onKeyDown={onInputKeyDown}
      onChange={handleChange}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
        ...inputProps
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps
      }}
      {...rest}
    />
  );
}
