import {
  OrgLicensesDocument,
  useOrgLicenseCreateMutation,
  useOrgLicenseDisableMutation,
  useOrgLicenseEnableMutation,
  useOrgLicensesQuery
} from "generated-graphql";
import { useState } from "react";
import { LicenseAction } from "./types";
import { LicenseCard } from "./shared";
import { latestLicenseByIssueDate, licenseStatus } from "./utils";
import { LicenseGenerationDialog, LicenseStatusToggleDialog } from "./dialog";
import { gql } from "@apollo/client";
import { useAdminOnpremTunnelsQuery } from "./__generated__/admin-onprem-tunnel-license-version";

const _ADMIN_ONPREM_TUNNELS_QUERY = gql`
  query adminOnpremTunnels {
    currentOrg {
      id
      onPremTunnels {
        url
      }
    }
  }
`;

export function AdminOnpremTunnelLicenseVersion() {
  const [showLicenseGenDialog, setShowLicenseGenDialog] = useState<boolean>(false);
  const [showLicenseToggle, setShowLicenseToggle] = useState<boolean>(false);

  const {
    data: licensesData,
    loading: licenseLoading,
    error: licensesErr
  } = useOrgLicensesQuery();
  const {
    data: tunnelsData,
    loading: tunnelsLoading,
    error: tunnelsErr
  } = useAdminOnpremTunnelsQuery();

  const [generateLicense, { loading: licenseGenLoading, error: licenseGenErr }] =
    useOrgLicenseCreateMutation({ refetchQueries: [OrgLicensesDocument] });
  const [enableLicense, { loading: licenseEnabling, error: licenseEnableErr }] =
    useOrgLicenseEnableMutation();
  const [disableLicense, { loading: licenseDisabling, error: licenseDisableErr }] =
    useOrgLicenseDisableMutation();

  if (licensesErr) throw licensesErr;
  if (tunnelsErr) throw tunnelsErr;
  if (licenseGenErr) throw licenseGenErr;
  if (licenseEnableErr) throw licenseEnableErr;
  if (licenseDisableErr) throw licenseDisableErr;

  function handleLicenseActionClick(action: LicenseAction) {
    switch (action.type) {
      case "tunnel-connect":
        window.open(action.url, "_blank");
        break;
      case "generate-new":
        setShowLicenseGenDialog(true);
        break;
      case "disable":
      case "enable":
        setShowLicenseToggle(true);
        break;
    }
  }

  async function handleGenerateLicense() {
    await generateLicense();
    setShowLicenseGenDialog(false);
  }

  async function handleToggleLicenseStatus(
    licenseId: string,
    action: "enable" | "disable"
  ) {
    if (action === "disable") {
      await disableLicense({ variables: { input: { id: licenseId } } });
    } else {
      await enableLicense({ variables: { input: { id: licenseId } } });
    }

    setShowLicenseToggle(false);
  }

  const license = latestLicenseByIssueDate(licensesData?.orgLicenses || []);
  const tunnel = tunnelsData?.currentOrg?.onPremTunnels?.[0] || null;
  const appVersion = license?.lastVerifiedVersions?.app;
  const dataObjectsVersion = license?.lastVerifiedVersions?.sisenseDataObject ?? "";

  return (
    <>
      {showLicenseGenDialog && (
        <LicenseGenerationDialog
          loading={licenseGenLoading}
          onConfirm={handleGenerateLicense}
          onCancel={() => setShowLicenseGenDialog(false)}
        />
      )}
      {showLicenseToggle && (
        <LicenseStatusToggleDialog
          licenseId={license!.id}
          isActive={licenseStatus(license) === "active"}
          loading={licenseEnabling || licenseDisabling}
          onConfirm={handleToggleLicenseStatus}
          onCancel={() => setShowLicenseToggle(false)}
        />
      )}
      <LicenseCard
        type={"admin-cloud-to-onprem"}
        tunnelUrl={tunnel?.url ?? null}
        licenseKey={license?.key || ""}
        licenseStatus={licenseStatus(license)}
        appVersion={appVersion ? `v${appVersion}` : ""}
        dataObjectsVersion={dataObjectsVersion}
        lastVerificationDate={license?.lastVerifiedAt}
        loading={licenseLoading || tunnelsLoading}
        disableActions={licenseGenLoading || licenseEnabling || licenseDisabling}
        onClickAction={handleLicenseActionClick}
      />
    </>
  );
}
