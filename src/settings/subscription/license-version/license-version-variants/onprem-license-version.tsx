import { canUser } from "../../../../view/user/utils";
import { useCurrentUserQuery } from "generated-graphql";
import { UserActionType } from "../../../../view/user/types";
import { gql } from "@apollo/client";
import { LicenseCard, ManageLicenseButton } from "./shared";
import { useOnpremLicenseQuery } from "./__generated__/onprem-license-version";
import { LicenseStatus } from "./types";

const _ONPREM_LICENSE_QUERY = gql`
  query onpremLicense {
    license {
      status {
        isValid
      }
    }
  }
`;

export function OnpremLicenseVersion() {
  const {
    data: curUserData,
    loading: curUserloading,
    error: curUserErr
  } = useCurrentUserQuery();
  const {
    data: licenseData,
    loading: licenseLoading,
    error: licenseErr
  } = useOnpremLicenseQuery();

  const currentUser = curUserData?.currentUser;
  const status = licenseData?.license?.status;

  function canManageLicense(): boolean {
    if (!currentUser) return false;
    return canUser(currentUser, { type: UserActionType.MANAGE_LICENSE });
  }

  function manageLicenseTooltip(): string {
    return !canManageLicense()
      ? "You don't have permission to Manage License. Please contact an Org Admin."
      : "";
  }

  function licenseStatus(): LicenseStatus | null {
    if (!status) return null;
    return status.isValid ? "active" : "expired";
  }

  if (curUserErr) throw curUserErr;
  if (licenseErr) throw licenseErr;

  return (
    <>
      <ManageLicenseButton
        disabled={!canManageLicense()}
        tooltip={manageLicenseTooltip()}
      />

      <LicenseCard
        type={"app-onprem"}
        licenseStatus={licenseStatus()}
        loading={curUserloading || licenseLoading}
      />
    </>
  );
}
