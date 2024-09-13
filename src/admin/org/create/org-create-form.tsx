import { OrgCreateFormInput } from "./types";
import { Box, styled } from "@mui/material";
import { InputLabel } from "view-v2/input-label";
import { Button, LoadingButton, TextField } from "@vizexplorer/global-ui-v2";
import { useImmer } from "use-immer";
import { defaultOrgCreateInput, isEmailLike, isFormValid, isOrgNameTaken } from "./utils";
import { lazy, useEffect, useRef, useState } from "react";

const PhoneInput = lazy(() => import("view-v2/phone/phone-input"));

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

const FormFieldsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(2, 4),
  overflow: "auto"
}));

const FieldContainer = styled(Box)({
  display: "flex",
  flexDirection: "column"
});

const DualFieldContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(4)
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: theme.spacing(4),
  margin: theme.spacing(2, 4, 4, "auto")
}));

type Props = {
  takenOrgNames?: Set<string>;
  loading?: boolean;
  saving?: boolean;
  onSubmit?: (form: OrgCreateFormInput) => void;
  onCancel?: VoidFunction;
};

export function OrgCreateForm({
  takenOrgNames = new Set(),
  loading = false,
  saving = false,
  onSubmit,
  onCancel
}: Props) {
  const [formState, setFormState] = useImmer<OrgCreateFormInput>(defaultOrgCreateInput);
  const [phoneIsValid, setPhoneIsValid] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const nameIsTaken = isOrgNameTaken(formState.name, takenOrgNames);
  const formIsValid = isFormValid(formState, takenOrgNames) && phoneIsValid;
  const disableForm = loading || saving;

  useEffect(() => {
    if (disableForm || !nameRef.current) return;
    nameRef.current.focus();
  }, [disableForm, nameRef]);

  function updateForm(key: keyof OrgCreateFormInput, value: string) {
    setFormState((draft) => {
      draft[key] = value;
    });
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formIsValid || disableForm || loading) return;
    onSubmit?.(formState);
  }

  return (
    <StyledForm data-testid={"org-create-form"} noValidate onSubmit={handleFormSubmit}>
      <FormFieldsContainer>
        <FieldContainer data-testid={"org-name"}>
          <InputLabel>Organization name</InputLabel>
          <TextField
            inputRef={nameRef}
            variant={"outlined"}
            placeholder={"Enter name"}
            autoComplete={"off"}
            disabled={disableForm}
            error={nameIsTaken}
            helperText={
              nameIsTaken ? "This name already exists. Please choose a unique name." : " "
            }
            inputProps={{ maxLength: "64" }}
            onChange={(event) => updateForm("name", event.target.value)}
          />
        </FieldContainer>

        <DualFieldContainer>
          <FieldContainer data-testid={"email"}>
            <InputLabel>Accounts payable email</InputLabel>
            <TextField
              variant={"outlined"}
              placeholder={"Enter email"}
              autoComplete={"off"}
              disabled={disableForm}
              error={!!formState.email.trim() && !isEmailLike(formState.email)}
              helperText={
                !!formState.email.trim() && !isEmailLike(formState.email)
                  ? "Please enter a valid email address"
                  : " "
              }
              inputProps={{ maxLength: "255" }}
              onChange={(event) => updateForm("email", event.target.value)}
            />
          </FieldContainer>

          <FieldContainer data-testid={"phone"}>
            <InputLabel>Accounts payable phone</InputLabel>
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              <PhoneInput
                initOptions={{
                  initialCountry: formState.country
                }}
                inputProps={{ disabled: disableForm }}
                error={!!formState.phone && !phoneIsValid}
                helperText={
                  !!formState.phone && !phoneIsValid
                    ? "Please enter a valid phone number"
                    : " "
                }
                onChangeCountry={(country: string) => updateForm("country", country)}
                onChangeNumber={(phone: string) => updateForm("phone", phone)}
                onChangeValidity={setPhoneIsValid}
              />
            </Box>
          </FieldContainer>
        </DualFieldContainer>

        <DualFieldContainer>
          <FieldContainer data-testid={"address-line-1"}>
            <InputLabel>Address line 1</InputLabel>
            <TextField
              variant={"outlined"}
              placeholder={"Enter street address"}
              autoComplete={"off"}
              disabled={disableForm}
              helperText={" "}
              inputProps={{ maxLength: "255" }}
              onChange={(event) => updateForm("addressLine1", event.target.value)}
            />
          </FieldContainer>

          <FieldContainer data-testid={"address-line-2"}>
            <InputLabel>Address line 2</InputLabel>
            <TextField
              variant={"outlined"}
              placeholder={"Enter floor, apartment, building"}
              autoComplete={"off"}
              disabled={disableForm}
              helperText={" "}
              inputProps={{ maxLength: "255" }}
              onChange={(event) => updateForm("addressLine2", event.target.value)}
            />
          </FieldContainer>
        </DualFieldContainer>

        <DualFieldContainer>
          <FieldContainer data-testid={"city"}>
            <InputLabel>City</InputLabel>
            <TextField
              variant={"outlined"}
              placeholder={"Enter city"}
              autoComplete={"off"}
              disabled={disableForm}
              helperText={" "}
              inputProps={{ maxLength: "255" }}
              onChange={(event) => updateForm("city", event.target.value)}
            />
          </FieldContainer>

          <DualFieldContainer>
            <FieldContainer data-testid={"state"}>
              <InputLabel>State</InputLabel>
              <TextField
                variant={"outlined"}
                placeholder={"Enter state"}
                autoComplete={"off"}
                disabled={disableForm}
                helperText={" "}
                inputProps={{ maxLength: "255" }}
                onChange={(event) => updateForm("state", event.target.value)}
              />
            </FieldContainer>

            <FieldContainer data-testid={"zip"}>
              <InputLabel>ZIP code</InputLabel>
              <TextField
                variant={"outlined"}
                placeholder={"Enter ZIP"}
                autoComplete={"off"}
                disabled={disableForm}
                helperText={" "}
                inputProps={{ maxLength: "64" }}
                onChange={(event) => updateForm("zip", event.target.value)}
              />
            </FieldContainer>
          </DualFieldContainer>
        </DualFieldContainer>
      </FormFieldsContainer>

      <ActionsContainer>
        <Button
          variant={"outlined"}
          color={"neutral"}
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <LoadingButton
          data-testid={"save-btn"}
          type={"submit"}
          variant={"contained"}
          loading={saving}
          disabled={disableForm || !formIsValid}
        >
          {!saving && "Save"}
        </LoadingButton>
      </ActionsContainer>
    </StyledForm>
  );
}
