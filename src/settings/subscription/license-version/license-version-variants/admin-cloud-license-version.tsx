import { gql } from "@apollo/client";
import { LicenseCard } from "./shared";
import { useAdminCloudVersionsQuery } from "./__generated__/admin-cloud-license-version";

const _ADMIN_CLOUD_VERIONS_QUERY = gql`
  query adminCloudVersions {
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

export function AdminCloudLicenseVersion() {
  const {
    data: discoveryData,
    loading: discoveryLoading,
    error: discoveryErr
  } = useAdminCloudVersionsQuery();

  const versions = discoveryData?.discovery?.env?.versions;
  const appVersion = versions?.apps;
  const dataObjectsVersion = versions?.sisenseDataObject?.version ?? "";

  if (discoveryErr) throw discoveryErr;

  return (
    <LicenseCard
      type={"admin-cloud-to-cloud"}
      appVersion={appVersion ? `v${appVersion}` : ""}
      dataObjectsVersion={dataObjectsVersion}
      loading={discoveryLoading}
    />
  );
}
