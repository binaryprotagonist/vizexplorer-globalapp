import { Box } from "@mui/material";
import { ManageLicenseCard } from "./manage-license-card";
import { gql } from "@apollo/client";
import { useLicenseQuery } from "./__generated__/manage-license";

export function ManageLicense() {
  const { data: licenseData, error: licenseErr } = useLicenseQuery();

  const status = licenseData?.license?.status;

  if (licenseErr) throw licenseErr;

  return (
    <>
      <span data-testid={"manage-license"} />
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flex={1}>
        {status && <ManageLicenseCard status={status} />}
      </Box>
    </>
  );
}

const _MANAGE_QUERY = gql`
  query license {
    license {
      status {
        ...ManageLicenseLicenseStatus
      }
    }
  }
  ${ManageLicenseCard.fragmets.manageLicenseLicenseStatus}
`;
