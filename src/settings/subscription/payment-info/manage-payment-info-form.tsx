import styled from "@emotion/styled";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GaCompanyFragment, useCompanyUpdateMutation } from "generated-graphql";
import { getAllCountries } from "../../../view/utils/country";
import { ApolloError } from "@apollo/client";
import { useState } from "react";

const StyledForm = styled.form({
  display: "grid",
  overflow: "hidden"
});

const FieldContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3),
  padding: theme.spacing(4),
  overflow: "auto"
}));

type FormInput = {
  email: string;
  name: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  region: string;
  country: CountryOption;
  postalCode: string;
};

type CountryOption = {
  label: string;
  value: string;
};

type Props = {
  company: GaCompanyFragment;
};

// try find the current country by countryCode, otherwise default to US
function defaultCountry(countryCode: string, countries: CountryOption[]): CountryOption {
  return (
    countries.find((country) => country.value === countryCode) ||
    countries.find((country) => country.value === "US")!
  );
}

export function ManagePaymentInfoForm({ company }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState<Error>();
  const [update, { loading }] = useCompanyUpdateMutation({
    onCompleted: () => navigate(".."),
    onError: handleUpdateError
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError
  } = useForm<FormInput>();
  const countryOptions: CountryOption[] = getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode
  }));

  function onSubmit(form: FormInput) {
    update({
      variables: {
        input: {
          ...form,
          street2: company.address.street2 || "",
          country: form.country.value
        }
      }
    });
  }

  function handleUpdateError(error: ApolloError) {
    if (error.message.includes("name already exists")) {
      setFormError("name", { message: "Company name taken" });
      return;
    }

    setError(error);
  }

  if (error) throw error;

  return (
    <StyledForm
      data-testid={"manage-payment-form"}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <FieldContainer>
        <Controller
          control={control}
          name={"email"}
          rules={{
            required: "Accounts Payable Email can't be blank",
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid email address"
            }
          }}
          defaultValue={company.email}
          render={({ field }) => (
            <TextField
              {...field}
              autoFocus
              data-testid={"email-input"}
              type={"email"}
              variant={"outlined"}
              label={"Accounts Payable Email"}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              inputProps={{ maxLength: "64" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"phone"}
          rules={{ required: "Accounts Payable Phone can't be blank" }}
          defaultValue={company.address.phone}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"phone-input"}
              type={"tel"}
              variant={"outlined"}
              label={"Accounts Payable Phone"}
              error={!!errors.phone?.message}
              helperText={errors.phone?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"name"}
          rules={{ required: "Company Name can't be blank" }}
          defaultValue={company.name}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"name-input"}
              variant={"outlined"}
              label={"Company Name"}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              inputProps={{ maxLength: "64" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"street1"}
          defaultValue={company.address.street1}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"street1-input"}
              variant={"outlined"}
              label={"Address"}
              error={!!errors.street1?.message}
              helperText={errors.street1?.message}
              inputProps={{ maxLength: "64" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"city"}
          defaultValue={company.address.city}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"city-input"}
              variant={"outlined"}
              label={"City"}
              error={!!errors.city?.message}
              helperText={errors.city?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"region"}
          defaultValue={company.address.region}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"region-input"}
              variant={"outlined"}
              label={"State / Region"}
              error={!!errors.region?.message}
              helperText={errors.region?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"postalCode"}
          defaultValue={company.address.postalCode}
          render={({ field }) => (
            <TextField
              {...field}
              data-testid={"postal-code-input"}
              variant={"outlined"}
              label={"Postal Code"}
              error={!!errors.postalCode?.message}
              helperText={errors.postalCode?.message}
              inputProps={{ maxLength: "32" }}
            />
          )}
        />
        <Controller
          control={control}
          name={"country"}
          defaultValue={defaultCountry(company.address.country, countryOptions)}
          rules={{ required: "Country can't be blank" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              data-testid={"country-input"}
              options={countryOptions}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={(_, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant={"outlined"}
                  label={"Country"}
                  error={!!errors.country?.message}
                  helperText={errors.country?.message}
                />
              )}
            />
          )}
        />
      </FieldContainer>
      <Box display={"flex"} justifyContent={"flex-end"} padding={theme.spacing(3)}>
        <Button
          size={"large"}
          color={"secondary"}
          sx={{ marginRight: theme.spacing(2) }}
          onClick={() => navigate("..")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          size={"large"}
          type={"submit"}
          variant={"contained"}
          color={"primary"}
          disabled={loading}
        >
          Submit
        </Button>
      </Box>
    </StyledForm>
  );
}
