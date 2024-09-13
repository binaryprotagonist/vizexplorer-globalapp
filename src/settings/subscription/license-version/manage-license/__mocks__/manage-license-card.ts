import {
  LicenseUpdateDocument,
  LicenseValidateDocument,
  ManageLicenseLicenseStatusFragment
} from "../__generated__/manage-license-card";
import { formatKey } from "../utils";

export const mockKey = "AAAA - AAAA - AAAA - AAAA - AAAA";

export function mockLicenseUpdate(
  key?: string,
  status?: ManageLicenseLicenseStatusFragment
) {
  return {
    request: {
      query: LicenseUpdateDocument,
      variables: { key: formatKey(key || mockKey) }
    },
    result: {
      data: {
        licenseUpdate: {
          __typename: "LicenseStatus",
          isValid: true,
          ...status,
          error: {
            code: "invalid",
            message: "license is invalid",
            __typename: "LicenseError",
            ...status?.error
          }
        }
      }
    }
  };
}

export function mockLicenseValidateQuery(
  key?: string,
  status?: Partial<ManageLicenseLicenseStatusFragment>
) {
  return {
    request: {
      query: LicenseValidateDocument,
      variables: { key: formatKey(key || mockKey) }
    },
    result: {
      data: {
        licenseValidate: {
          __typename: "LicenseStatus",
          isValid: true,
          ...status,
          error: {
            code: "invalid",
            message: "license is invalid",
            __typename: "LicenseError",
            ...status?.error
          }
        }
      }
    }
  };
}
