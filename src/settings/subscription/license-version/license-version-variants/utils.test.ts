import { OrgLicenseFragment } from "generated-graphql";
import { produce } from "immer";
import { mockOrgLicense } from "testing/mocks/admin";
import { latestLicenseByIssueDate, licenseStatus } from "./utils";

function generateDummyLicenses(): OrgLicenseFragment[] {
  const licenses = Array(4)
    .fill(null)
    .map<OrgLicenseFragment>((_, idx) => ({
      ...mockOrgLicense,
      id: `license-${idx}`,
      key: `license-key-${idx}`
    }));
  // random arrangment of licenses by issuedAt to test sorting
  licenses[0].issuedAt = "2022-01-01T00:00:00+00:00";
  licenses[1].issuedAt = "2022-02-01T00:00:00+00:00";
  licenses[2].issuedAt = "2022-02-01T00:01:00+00:00";
  licenses[3].issuedAt = "2022-01-01T00:01:00+00:00";
  return licenses;
}

describe("License Version Utils", () => {
  describe("latestLicenseByIssueDate", () => {
    it("returns the license with the newest `issuedAt` datetime", () => {
      const licenses = generateDummyLicenses();
      const latest = latestLicenseByIssueDate(licenses);
      expect(latest).toEqual(licenses[2]);
    });

    it("returns null if no licenses are provided", () => {
      expect(latestLicenseByIssueDate([])).toEqual(null);
    });
  });

  describe("licenseStatus", () => {
    it("returns `active` if `expiresAt` is in the future", () => {
      expect(licenseStatus(mockOrgLicense)).toEqual("active");
    });

    it("returns `expired` if `expiresAt` is in the past", () => {
      const expiredLicense = produce(mockOrgLicense, (draft) => {
        draft.expiresAt = "1900-01-01T00:00:00+00:00";
      });
      expect(licenseStatus(expiredLicense)).toEqual("expired");
    });

    it("returns `null` if `null` is provided", () => {
      expect(licenseStatus(null)).toEqual(null);
    });
  });
});
