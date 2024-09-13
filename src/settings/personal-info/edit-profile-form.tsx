import { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  TextField,
  useTheme,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  GaUserFragment,
  useEmailExistsLazyQuery,
  useUserProfileUpdateMutation
} from "generated-graphql";
import { emailValidation, firstNameValidation, lastNameValidation } from "./types";
import { useFnDebounce } from "../../view/utils";
import { Check, Clear } from "@mui/icons-material";

const StyledForm = styled("form")(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3)
}));

const InlineContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: theme.spacing(2),
  [`@media (max-width: ${theme.breakpoints.values.sm - 1}px)`]: {
    gridTemplateColumns: "1fr",
    rowGap: theme.spacing(3)
  }
}));

type FormInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type Props = {
  user: GaUserFragment;
  onDone: VoidFunction;
};

function UserAsFormInput(user: GaUserFragment): FormInput {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone
  };
}

export function EditProfileForm({ user, onDone }: Props) {
  const theme = useTheme();
  const [emailTaken, setEmailTaken] = useState<boolean>(false);
  const [updateProfile, { error: updateProfileErr, loading: updatingProfile }] =
    useUserProfileUpdateMutation({ onCompleted: onDone });
  const [verifyEmail, { error: verifyEmailErr, loading: verifyingEmail }] =
    useEmailExistsLazyQuery({
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true
    });
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, dirtyFields }
  } = useForm<FormInput>({ defaultValues: UserAsFormInput(user) });
  const debounce = useFnDebounce();
  const ref = useRef<HTMLFormElement>(null);

  async function onSubmit(form: FormInput) {
    if (updatingProfile) return;

    if (form.email !== user.email) {
      const verify = await verifyEmail({ variables: { email: form.email } });
      if (verify.data?.emailExists) {
        return;
      }
    }

    const { firstName, lastName, email, phone } = form;
    updateProfile({
      variables: {
        user: {
          userId: user.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim()
        }
      }
    });
  }

  function onEmailChange(email: string) {
    setEmailTaken(false);
    if (email === user.email) return;

    debounce(async () => {
      if (!ref.current) return;
      const isValid = await trigger("email");
      if (isValid) {
        const res = await verifyEmail({ variables: { email } });
        setEmailTaken(!!res.data?.emailExists);
      }
    }, 300);
  }

  if (updateProfileErr) throw updateProfileErr;
  if (verifyEmailErr) throw verifyEmailErr;

  return (
    <StyledForm
      ref={ref}
      data-testid={"edit-profile-form"}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <InlineContainer>
        <Controller
          control={control}
          name={"firstName"}
          rules={firstNameValidation}
          render={({ field }) => (
            <TextField
              {...field}
              autoFocus
              data-testid={"first-name-input"}
              variant={"outlined"}
              label={"First Name"}
              error={!!errors.firstName?.message}
              helperText={errors.firstName?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"lastName"}
          rules={lastNameValidation}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"last-name-input"}
              variant={"outlined"}
              label={"Last Name"}
              error={!!errors.lastName?.message}
              helperText={errors.lastName?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
      </InlineContainer>
      <Controller
        control={control}
        name={"email"}
        rules={emailValidation}
        render={({ field }) => (
          <TextField
            {...field}
            data-testid={"email-input"}
            onChange={(event) => {
              onEmailChange(event.target.value);
              field.onChange(event);
            }}
            type={"email"}
            variant={"outlined"}
            label={"Work Email"}
            error={!!errors.email?.message || emailTaken}
            helperText={errors.email?.message || (emailTaken && "Email is taken") || ""}
            inputProps={{ maxLength: "64" }}
            InputProps={{
              endAdornment: dirtyFields.email && (
                <FormInputAdornment
                  position={"end"}
                  isLoading={verifyingEmail}
                  isValid={!emailTaken && !errors.email}
                />
              )
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={"phone"}
        render={({ field }) => (
          <TextField
            {...field}
            data-testid={"phone-input"}
            variant={"outlined"}
            label={"Phone"}
            error={!!errors.phone?.message}
            helperText={errors.phone?.message || "Include your country and area code"}
            inputProps={{ maxLength: "32" }}
          />
        )}
      />

      <Box textAlign={"end"} marginTop={theme.spacing(2)}>
        <Button
          size={"large"}
          color={"secondary"}
          sx={{ marginRight: theme.spacing(2) }}
          onClick={onDone}
          disabled={updatingProfile || verifyingEmail}
        >
          Cancel
        </Button>
        <Button
          size={"large"}
          type={"submit"}
          variant={"contained"}
          color={"primary"}
          disabled={updatingProfile || verifyingEmail || emailTaken}
        >
          Submit
        </Button>
      </Box>
    </StyledForm>
  );
}

type FormInputAdornmentProps = {
  isValid: boolean;
  isLoading: boolean;
  position: "start" | "end";
};

function FormInputAdornment({ isValid, isLoading, position }: FormInputAdornmentProps) {
  return (
    <InputAdornment position={position}>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : isValid ? (
        <Check color={"primary"} />
      ) : (
        <Clear color={"error"} />
      )}
    </InputAdornment>
  );
}
