import { LicenseErrCode } from "./types";
import { licenseErrorFromCode } from "./utils";

describe("Manage License Utils", () => {
  describe("licenseErrorFromCode", () => {
    it("returns correct error message for invalid license", () => {
      const errMessage = licenseErrorFromCode("invalid");
      expect(errMessage).toEqual(
        "Please make sure you copied the license key from your email correctly"
      );
    });

    it("returns correct error message for unable-to-validate", () => {
      const errMessage = licenseErrorFromCode("unable-to-validate");
      expect(errMessage).toEqual(
        "Please make sure you have connection to the internet and try again"
      );
    });

    it("returns correct error message for expired", () => {
      const errMessage = licenseErrorFromCode("expired");
      expect(errMessage).toEqual(
        "Your license has expired. Please enter a new license key"
      );
    });

    it("returns correct error message for fingerprint-mismatch", () => {
      const errMessage = licenseErrorFromCode("fingerprint-mismatch");
      expect(errMessage).toEqual("The license key provided is already in use");
    });

    it("displays a default error message if the code isn't recognised", () => {
      const errMessage = licenseErrorFromCode("fake-error-code" as LicenseErrCode);
      expect(errMessage).toEqual("An unexpected error occurred: fake-error-code");
    });
  });
});
