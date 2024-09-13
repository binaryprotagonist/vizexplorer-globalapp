import { Card, Field, FieldTitle, PlainCardHeader } from "../../../../../view/card";
import { Box, Skeleton, Typography, styled, useTheme } from "@mui/material";
import { displayLicenseStatus, formatLastVerified } from "../utils";
import { TextStyleButton } from "../../../../common";
import { LicenseAction, LicenseStatus } from "../types";

const StyledField = styled(Field)(({ theme }) => ({
  gridTemplateColumns: "270px auto",
  [`@media (max-width: ${theme.breakpoints.values.md - 1}px)`]: {
    gridTemplateColumns: "max-content auto",
    gap: theme.spacing(2)
  }
}));

const FieldWithAction = styled(Field)(({ theme }) => ({
  gridTemplateColumns: "270px auto max-content",
  [`@media (max-width: ${theme.breakpoints.values.md - 1}px)`]: {
    gridTemplateColumns: "max-content auto auto",
    gap: theme.spacing(2)
  }
}));

const TunnelStatusContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "max-content auto",
  alignItems: "center",
  columnGap: theme.spacing(0.5)
}));

function TunnelStatusIcon({ isOnline }: { isOnline: boolean }) {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={12}
      height={12}
      bgcolor={"lightgray"}
      borderRadius={300}
    >
      <Box
        width={10}
        height={10}
        bgcolor={isOnline ? "green" : "red"}
        borderRadius={300}
      />
    </Box>
  );
}

type AdminCloudToOnPremProps = {
  type: "admin-cloud-to-onprem";
  tunnelUrl: string | null;
  licenseKey: string;
  licenseStatus: LicenseStatus | null;
  appVersion: string;
  dataObjectsVersion: string;
  lastVerificationDate?: string;
  disableActions: boolean;
  loading?: boolean;
  onClickAction: (action: LicenseAction) => void;
};

type AdminCloudToCloudProps = {
  type: "admin-cloud-to-cloud";
  appVersion: string;
  dataObjectsVersion: string;
  loading?: boolean;
};

type AdminOnprem = {
  type: "admin-onprem";
  licenseStatus: LicenseStatus | null;
  appVersion: string;
  dataObjectsVersion: string;
  loading?: boolean;
};

type AppOnpremProps = {
  type: "app-onprem";
  licenseStatus: LicenseStatus | null;
  loading?: boolean;
};

type Props =
  | AdminCloudToOnPremProps
  | AdminCloudToCloudProps
  | AdminOnprem
  | AppOnpremProps;

export function LicenseCard(props: Props) {
  const theme = useTheme();

  function handleToggleLicenseClick() {
    if (props.type !== "admin-cloud-to-onprem") return;
    const { onClickAction, licenseStatus } = props;
    onClickAction(licenseStatus === "expired" ? { type: "enable" } : { type: "disable" });
  }

  if (props.loading) {
    return <LicenseCardLoading />;
  }

  return (
    <Card data-testid={"license-card"} data-variant={props.type}>
      <PlainCardHeader>
        <Typography data-testid={"title"} variant={"h6"}>
          {props.type === "app-onprem" ? "License" : "License / Version"}
        </Typography>
      </PlainCardHeader>
      <Box
        padding={theme.spacing(0, 4, 2, 4)}
        sx={{
          ["& > div + div"]: {
            borderTop: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        {props.type === "admin-cloud-to-onprem" && (
          <FieldWithAction data-testid={"tunnel-field"}>
            <FieldTitle variant={"subtitle2"}>Tunnel Status</FieldTitle>
            <TunnelStatusContainer>
              <TunnelStatusIcon isOnline={!!props.tunnelUrl} />
              <Typography data-testid={"tunnel-status"}>
                {props.tunnelUrl ? "Online" : "Offline"}
              </Typography>
            </TunnelStatusContainer>
            <TextStyleButton
              data-testid={"tunnel-connect-btn"}
              onClick={() =>
                props.onClickAction({ type: "tunnel-connect", url: props.tunnelUrl! })
              }
              disabled={props.disableActions || !props.tunnelUrl}
              tooltip={
                !props.tunnelUrl
                  ? "Unable to establish connection with On-Premises agent"
                  : ""
              }
            >
              Connect
            </TextStyleButton>
          </FieldWithAction>
        )}

        {props.type === "admin-cloud-to-onprem" && (
          <FieldWithAction data-testid={"license-key-field"}>
            <FieldTitle variant={"subtitle2"}>License Key</FieldTitle>
            <Typography data-testid={"license-key"}>{props.licenseKey}</Typography>
            <TextStyleButton
              data-testid={"license-generate-new-btn"}
              onClick={() => props.onClickAction({ type: "generate-new" })}
              disabled={props.disableActions}
            >
              Generate New License
            </TextStyleButton>
          </FieldWithAction>
        )}

        {props.type !== "admin-cloud-to-cloud" && (
          <FieldWithAction data-testid={"license-status-field"}>
            <FieldTitle variant={"subtitle2"}>Status</FieldTitle>
            <Typography data-testid={"license-status"}>
              {displayLicenseStatus(props.licenseStatus)}
            </Typography>
            {props.type === "admin-cloud-to-onprem" && props.licenseStatus && (
              <TextStyleButton
                data-testid={"license-toggle-btn"}
                disabled={props.disableActions}
                onClick={handleToggleLicenseClick}
              >
                {props.licenseStatus === "expired" ? "Enable" : "Disable"}
              </TextStyleButton>
            )}
          </FieldWithAction>
        )}

        {props.type !== "app-onprem" && (
          <>
            <StyledField data-testid={"app-version-field"}>
              <FieldTitle variant={"subtitle2"}>Installed Application Version</FieldTitle>
              <Typography data-testid={"license-app-version"}>
                {props.appVersion}
              </Typography>
            </StyledField>

            <StyledField data-testid={"data-objects-version-field"}>
              <FieldTitle variant={"subtitle2"}>
                Installed Data Objects Version
              </FieldTitle>
              <Typography data-testid={"license-data-objects-version"}>
                {props.dataObjectsVersion}
              </Typography>
            </StyledField>
          </>
        )}

        {props.type === "admin-cloud-to-onprem" && (
          <StyledField data-testid={"last-verified-field"}>
            <FieldTitle variant={"subtitle2"}>Last Verification Date/Time</FieldTitle>
            <Typography data-testid={"license-last-verified"}>
              {props.lastVerificationDate
                ? formatLastVerified(props.lastVerificationDate)
                : ""}
            </Typography>
          </StyledField>
        )}
      </Box>
    </Card>
  );
}

function LicenseCardLoading() {
  const theme = useTheme();

  return (
    <Card data-testid={"license-card-loading"}>
      <PlainCardHeader>
        <Skeleton variant={"text"} width={150} height={50} />
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)}>
        <Skeleton variant={"rectangular"} height={205} />
      </Box>
    </Card>
  );
}
