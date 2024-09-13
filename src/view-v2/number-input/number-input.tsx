import { outlinedInputClasses, styled } from "@mui/material";
import { TextField, TextFieldProps } from "@vizexplorer/global-ui-v2";

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root}`]: {
    [`& .${outlinedInputClasses.input}`]: {
      // hide number spinner for chrome, safari, edge & opera
      ["::-webkit-inner-spin-button"]: {
        WebkitAppearance: "none",
        margin: 0
      }
    },
    // hide number spinner for firefox
    [`& .${outlinedInputClasses.input}[type=number]`]: {
      MozAppearance: "textfield"
    }
  }
});

// TODO: Not recommended by MUI to use this approach, however, they have their own NumberInput in the works we could swap to in future
// https://mui.com/material-ui/react-text-field/#type-quot-number-quot
export function NumberInput({ inputProps, ...rest }: TextFieldProps) {
  return (
    <StyledTextField
      type={"number"}
      inputProps={{ inputMode: "numeric", ...inputProps }}
      {...rest}
    />
  );
}
