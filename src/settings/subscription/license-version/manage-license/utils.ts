import { LicenseErrCode } from "./types";

export function formatKey(key: string) {
  return key.replace(/ /g, "");
}

export function licenseErrorFromCode(errorCode: LicenseErrCode | string) {
  switch (errorCode) {
    case "invalid":
      return "Please make sure you copied the license key from your email correctly";
    case "unable-to-validate":
      return "Please make sure you have connection to the internet and try again";
    case "expired":
      return "Your license has expired. Please enter a new license key";
    case "fingerprint-mismatch":
      return "The license key provided is already in use";
    default:
      return `An unexpected error occurred: ${errorCode}`;
  }
}
