import { ComponentProps, useEffect, useRef } from "react";
// TODO remove ts-ignore when reactWithUtils export is fixed
// @ts-ignore reactWithUtils requires tsconfig `module` of `node16` or `nodenext`, which breaks other imports
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";
import "./phone-input.css";
import { Box, BoxProps } from "@mui/material";
import { FormHelperText } from "@vizexplorer/global-ui-v2";

type Props = ComponentProps<typeof IntlTelInput> & {
  error?: boolean;
  helperText?: string;
  containerProps?: BoxProps;
};

function PhoneInput({ error, helperText, containerProps, ...telProps }: Props) {
  const ref = useRef<IntlTelInput>(null);

  useEffect(() => {
    if (!ref.current) return;

    const input = ref.current.getInput();
    error
      ? input.classList.add("iti__custom_error")
      : input.classList.remove("iti__custom_error");
  }, [error]);

  return (
    <Box
      data-testid={"phone-input"}
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      className={telProps.inputProps?.disabled ? "iti__custom_disabled" : undefined}
      {...containerProps}
    >
      <IntlTelInput
        {...telProps}
        ref={ref}
        inputProps={{ ...telProps.inputProps, "aria-label": "Phone number" }}
        initOptions={{
          initialCountry: "us",
          // because `initialCountry` is set, this needs to be `aggressive` if we want the placeholder to change on country change
          autoPlaceholder: "aggressive",
          strictMode: true,
          separateDialCode: true,
          ...telProps.initOptions,
          i18n: {
            searchPlaceholder: "Search country",
            ...telProps.initOptions?.i18n
          }
        }}
      />
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </Box>
  );
}

export default PhoneInput;
