import { FormEvent } from "react";
import { Box, Button, Skeleton, useTheme } from "@mui/material";
import { SubscriptionFormFields } from "./subscription-form-fields";
import styled from "@emotion/styled";
import { isFormValid } from "../../admin/add/utils";
import { FormChangeAction, FormOptions, FormValues } from "./types";

type Props = {
  state: FormValues;
  options: FormOptions;
  onChange: (action: FormChangeAction) => void;
  onSubmit: (formState: FormValues, options: FormOptions) => void;
  onCancel: VoidFunction;
  loading: boolean;
  disabled: boolean;
};

const StyledForm = styled.form(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(2)
}));

export function SubscriptionForm({
  state,
  options,
  onChange,
  onSubmit,
  onCancel,
  loading,
  disabled
}: Props) {
  const theme = useTheme();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(state, options);
  }

  if (loading) {
    return <LoadingForm />;
  }

  return (
    <StyledForm data-testid={"subscription-form"} noValidate onSubmit={handleSubmit}>
      <SubscriptionFormFields
        state={state}
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
      <Box textAlign={"end"} marginTop={theme.spacing(2)}>
        <Button
          data-testid={"cancel-btn"}
          size={"large"}
          color={"secondary"}
          sx={{ marginRight: theme.spacing(2) }}
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          data-testid={"submit-btn"}
          size={"large"}
          type={"submit"}
          variant={"contained"}
          color={"primary"}
          disabled={disabled || !isFormValid(state, options)}
        >
          Submit
        </Button>
      </Box>
    </StyledForm>
  );
}

function LoadingForm() {
  const theme = useTheme();

  return (
    <Box
      data-testid={"subscription-form-loading"}
      display={"grid"}
      rowGap={theme.spacing(2)}
    >
      {Array(5)
        .fill(null)
        .map((_, idx) => (
          <Skeleton key={`input-skele-${idx}`} variant="rectangular" height={53} />
        ))}
      <Box
        display={"grid"}
        gridTemplateColumns={"auto auto"}
        columnGap={"12px"}
        justifyContent={"end"}
        marginTop={theme.spacing(2)}
      >
        <Skeleton variant="rectangular" height={45} width={100} />
        <Skeleton variant="rectangular" height={45} width={100} />
      </Box>
    </Box>
  );
}
