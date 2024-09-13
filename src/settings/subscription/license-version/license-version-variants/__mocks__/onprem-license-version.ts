import {
  OnpremLicenseDocument,
  OnpremLicenseQuery
} from "../__generated__/onprem-license-version";

export function mockOnpremLicenseQuery() {
  const data: OnpremLicenseQuery = {
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
      query: OnpremLicenseDocument
    },
    result: {
      data
    }
  };
}
