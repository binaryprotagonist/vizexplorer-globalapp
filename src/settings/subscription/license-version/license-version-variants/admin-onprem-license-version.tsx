import { gql } from "@apollo/client";
import { LicenseCard, ManageLicenseButton } from "./shared";
import { LicenseStatus } from "./types";
import {
  useAdminOnpremLicenseQuery,
  useAdminOnpremVersionsQuery
} from "./__generated__/admin-onprem-license-version";

const _ADMIN_ONPREM_LICENSE_QUERY = gql`
  query adminOnpremLicense {
    license {
      status {
        isValid
      }
    }
  }
`;

const _ADMIN_ONPREM_VERIONS_QUERY = gql`
  query adminOnpremVersions {
    discovery {
      env {
        versions {
          apps
          sisenseDataObject {
            version
          }
        }
      }
    }
  }
`;

export function AdminOnpremLicenseVersion() {
  const {
    data: licenseData,
    loading: licenseLoading,
    error: licenseErr
  } = useAdminOnpremLicenseQuery();
  const {
    data: versionData,
    loading: versionsLoading,
    error: versionsErr
  } = useAdminOnpremVersionsQuery();

  const status = licenseData?.license?.status;
  const versions = versionData?.discovery?.env?.versions;
  const appVersion = versions?.apps ? `v${versions.apps}` : "";
  const dataObjectVersion = versions?.sisenseDataObject?.version ?? "";

  function licenseStatus(): LicenseStatus | null {
    if (!status) return null;
    return status.isValid ? "active" : "expired";
  }

  if (licenseErr) throw licenseErr;
  if (versionsErr) throw versionsErr;

  return (
    <>
      <ManageLicenseButton />

      <LicenseCard
        type={"admin-onprem"}
        licenseStatus={licenseStatus()}
        appVersion={appVersion}
        dataObjectsVersion={dataObjectVersion}
        loading={licenseLoading || versionsLoading}
      />
    </>
  );
}
