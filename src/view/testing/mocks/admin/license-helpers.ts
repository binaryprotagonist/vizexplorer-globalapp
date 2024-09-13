import {
  OrgLicenseCreateDocument,
  OrgLicenseCreateMutation,
  OrgLicenseDisableDocument,
  OrgLicenseDisableMutation,
  OrgLicenseEnableDocument,
  OrgLicenseEnableMutation,
  OrgLicenseFragment,
  OrgLicensesDocument,
  OrgLicensesQuery
} from "generated-graphql";

export const mockOrgLicense: OrgLicenseFragment = {
  __typename: "OrgLicense",
  id: "517",
  key: "F7E3-C1F2-8783-7093-C441",
  issuedAt: "2022-09-28T22:13:02.692516+00:00",
  expiresAt: "2099-01-01T00:00:00+00:00",
  lastVerifiedVersions: {
    __typename: "LicenseVerification",
    app: "3.1.0",
    sisenseDataObject: "3.1.0"
  },
  lastVerifiedAt: "2022-09-29T17:41:49.974677+00:00"
};

export type OrgLicensesQueryOpts = {
  orgLicenses?: OrgLicenseFragment[];
};

export function mockOrgLicensesQuery({ orgLicenses }: OrgLicensesQueryOpts = {}) {
  const data: OrgLicensesQuery = {
    orgLicenses: orgLicenses ?? [mockOrgLicense]
  };

  return {
    request: {
      query: OrgLicensesDocument
    },
    result: {
      data
    }
  };
}

export function mockOrgLicenseCreateMutation(out?: OrgLicenseFragment) {
  const data: OrgLicenseCreateMutation = {
    orgLicenseCreate: out || { ...mockOrgLicense }
  };

  return {
    request: {
      query: OrgLicenseCreateDocument
    },
    result: {
      data
    }
  };
}

export function mockOrgLicenseEnableMutation(license: OrgLicenseFragment) {
  const data: OrgLicenseEnableMutation = {
    orgLicenseEnable: {
      ...license,
      expiresAt: "2099-01-01T00:00:00+00:00"
    }
  };

  return {
    request: {
      query: OrgLicenseEnableDocument,
      variables: { input: { id: license.id } }
    },
    result: {
      data
    }
  };
}

export function mockOrgLicenseDisableMutation(license: OrgLicenseFragment) {
  const data: OrgLicenseDisableMutation = {
    orgLicenseDisable: {
      ...license,
      expiresAt: "1900-01-01T00:00:00+00:00"
    }
  };

  return {
    request: {
      query: OrgLicenseDisableDocument,
      variables: { input: { id: license.id } }
    },
    result: {
      data
    }
  };
}
