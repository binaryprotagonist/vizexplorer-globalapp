import { LicenseDocument, LicenseQuery } from "../__generated__/manage-license";
import { ManageLicenseLicenseStatusFragment } from "../__generated__/manage-license-card";

export type MockLicenseQueryOpts = {
  status?: ManageLicenseLicenseStatusFragment;
};

export function mockLicenseQuery({ status }: MockLicenseQueryOpts = {}) {
  const data: LicenseQuery = {
    license: {
      __typename: "License",
      status: {
        __typename: "LicenseStatus",
        isValid: true,
        ...status,
        error: status?.error ? status.error : null
      }
    }
  };

  return {
    request: {
      query: LicenseDocument
    },
    result: { data }
  };
}
