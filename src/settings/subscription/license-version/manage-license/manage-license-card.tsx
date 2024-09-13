import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ReactInputMask from "react-input-mask";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
  useTheme
} from "@mui/material";
import { BlueCardHeader, Card } from "../../../../view/card";
import { green } from "@mui/material/colors";
import { ContactUsLink } from "../../../../view/support";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Close } from "@mui/icons-material";
import { useUnsecureClient } from "../../../../view/graphql";
import { gql } from "@apollo/client";
import {
  LicenseUpdateMutation,
  ManageLicenseLicenseStatusFragment,
  useLicenseUpdateMutation,
  useLicenseValidateLazyQuery
} from "./__generated__/manage-license-card";
import { licenseErrorFromCode, formatKey } from "./utils";

// react-input-mask doesn't explicitly define definition for children which react 18 requires
// use `any` as react 18 expects ReactNode, but react-input-mask accepts a function
declare module "react-input-mask" {
  export interface Props {
    children: any;
  }
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "550px",
  margin: theme.spacing(2)
}));

const StyledInput = styled(TextField)({
  ["& input"]: {
    letterSpacing: ".2rem",
    fontSize: "1.35rem"
  },
  ["& legend"]: {
    fontSize: "1rem"
  }
});

const LICENSE_FORMAT = "XXXX - XXXX - XXXX - XXXX - XXXX" as const;

type Props = {
  status: ManageLicenseLicenseStatusFragment;
};

export function ManageLicenseCard({ status }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const client = useUnsecureClient();
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [licenseErr, setLicenseErr] = useState<string | null>(null);
  const [update, { loading: updatingKey, error: licenseUpdateErr }] =
    useLicenseUpdateMutation({
      onCompleted: onLicenseActivated,
      client
    });
  const [validateLicense, { data: validationData, loading: validatingLicense }] =
    useLicenseValidateLazyQuery({ client });

  const prevPage = (state as any)?.prevPage ?? "/";
  const licenseStatus = validationData?.licenseValidate;

  useEffect(() => {
    if (!validationData) return;
    if (licenseStatus?.isValid) return;
    setLicenseErr(licenseErrorFromCode(licenseStatus?.error?.code ?? ""));
  }, [licenseStatus]);

  useEffect(() => {
    if (licenseKey.length !== LICENSE_FORMAT.length) return;
    validateLicense({ variables: { key: formatKey(licenseKey) } });
  }, [licenseKey]);

  useEffect(() => {
    if (!status.error?.code) return;
    if (["invalid", "not-present"].includes(status.error.code)) return;

    setLicenseErr(licenseErrorFromCode(status.error.code));
  }, []);

  function onLicenseActivated(data: LicenseUpdateMutation) {
    if (!data?.licenseUpdate) return;

    const status = data.licenseUpdate;
    if (!status.isValid) {
      setLicenseErr(licenseErrorFromCode(status.error?.code ?? ""));
      return;
    }

    // if the user navigated to this page from within the app, go back to the previous page
    // otherwise for new license entry, force page reload so refetch queries (i.e. authDiscovery)
    prevPage !== "/" ? navigate(prevPage) : (window.location.href = prevPage);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLicenseErr(null);
    setLicenseKey(event.target.value.toUpperCase());
  }

  function onSubmit() {
    if (!canSubmit()) return;
    setLicenseErr(null);
    update({ variables: { key: formatKey(licenseKey) } });
  }

  function canSubmit() {
    return (
      !updatingKey &&
      !validatingLicense &&
      licenseKey.length === LICENSE_FORMAT.length &&
      validationData?.licenseValidate?.isValid
    );
  }

  if (licenseUpdateErr) throw licenseUpdateErr;

  return (
    <StyledCard data-testid={"manage-license-card"}>
      <BlueCardHeader>
        <Typography variant={"h4"} align={"center"}>
          License Activation
        </Typography>
      </BlueCardHeader>
      <Box display={"flex"} flexDirection={"column"} padding={theme.spacing(3)}>
        {status.isValid ? (
          <>
            <Typography variant={"h5"} align={"center"}>
              Your license is <span style={{ color: green[800] }}>Active!</span>
            </Typography>
            <Typography marginTop={theme.spacing(2)}>
              If you wish to update your license, please enter a new license key
            </Typography>
          </>
        ) : (
          <Typography variant={"h6"}>Enter your License Key</Typography>
        )}
        <Box marginTop={theme.spacing(4)}>
          <ReactInputMask
            onChange={handleInputChange}
            value={licenseKey}
            mask={LICENSE_FORMAT.replace(/X/g, "*")}
            maskChar={null}
          >
            {(props: TextFieldProps) => (
              <StyledInput
                {...props}
                fullWidth
                autoFocus
                data-testid={"license-input"}
                variant={"outlined"}
                label={"License Key"}
                placeholder={LICENSE_FORMAT}
                helperText={
                  !licenseErr ? (
                    "Please enter the license key that was emailed to you"
                  ) : (
                    <span>
                      License validation failed. {licenseErr}. If you need further
                      assistance, please <ContactUsLink />
                    </span>
                  )
                }
                error={!!licenseErr}
                InputLabelProps={{ sx: { fontSize: "1.35rem" } }}
                InputProps={{
                  endAdornment: licenseKey.length === LICENSE_FORMAT.length && (
                    <InputAdornment position={"end"}>
                      <Adornment
                        loading={validatingLicense}
                        status={validationData?.licenseValidate}
                      />
                    </InputAdornment>
                  )
                }}
                onKeyPress={(e) => e.key === "Enter" && onSubmit()}
              />
            )}
          </ReactInputMask>
        </Box>
        <Box marginTop={theme.spacing(5)} textAlign={"right"}>
          {status.isValid && (
            <Button
              color={"secondary"}
              onClick={() => navigate(prevPage)}
              sx={{ marginRight: theme.spacing(1) }}
              disabled={updatingKey}
            >
              Back
            </Button>
          )}
          <Button
            data-testid={"license-submit-btn"}
            variant={"contained"}
            onClick={onSubmit}
            disabled={!canSubmit()}
          >
            {status.isValid ? "Update" : "Activate"}
          </Button>
        </Box>
      </Box>
    </StyledCard>
  );
}

ManageLicenseCard.fragmets = {
  manageLicenseLicenseStatus: gql`
    fragment ManageLicenseLicenseStatus on LicenseStatus {
      isValid
      error {
        code
      }
    }
  `
};

const _LICENSE_VALIDATE_QUERY = gql`
  query licenseValidate($key: String!) {
    licenseValidate(key: $key) {
      ...ManageLicenseLicenseStatus
    }
  }
  ${ManageLicenseCard.fragmets.manageLicenseLicenseStatus}
`;

const _LICENSE_UPDATE_MUTATION = gql`
  mutation licenseUpdate($key: String!) {
    licenseUpdate(key: $key) {
      ...ManageLicenseLicenseStatus
    }
  }
  ${ManageLicenseCard.fragmets.manageLicenseLicenseStatus}
`;

type AdornmentProps = {
  status?: ManageLicenseLicenseStatusFragment | null;
  loading: boolean;
};

function Adornment({ status, loading }: AdornmentProps) {
  if (loading) return <CircularProgress data-testid={"adornment-validating"} size={30} />;
  return status?.isValid ? (
    <Check data-testid={"adornment-valid"} fontSize={"large"} color={"success"} />
  ) : (
    <Close data-testid={"adornment-invalid"} fontSize={"large"} color={"error"} />
  );
}
