import {
  AdminOnpremLicenseDocument,
  AdminOnpremLicenseQuery,
  AdminOnpremVersionsDocument,
  AdminOnpremVersionsQuery
} from "../__generated__/admin-onprem-license-version";

export function mockAdminOnpremLicenseQuery() {
  const data: AdminOnpremLicenseQuery = {
    license: {
      __typename: "License",
      status: {
        __typename: "LicenseStatus",
        isValid: true
      }
    }
  };

  return {
    request: {
      query: AdminOnpremLicenseDocument
    },
    result: {
      data
    }
  };
}

export function mockAdminOnpremVersionsQuery() {
  const data: AdminOnpremVersionsQuery = {
    discovery: {
      __typename: "Discovery",
      env: {
        __typename: "Env",
        versions: {
          __typename: "Versions",
          apps: "1.0.0",
          sisenseDataObject: {
            __typename: "SisenseDataObject",
            version: "v2.0.0"
          }
        }
      }
    }
  };

  return {
    request: {
      query: AdminOnpremVersionsDocument
    },
    result: {
      data
    }
  };
}
