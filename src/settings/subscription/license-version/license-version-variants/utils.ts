import { compareDesc, isAfter, parseISO, subMinutes } from "date-fns";
import { OrgLicenseFragment } from "generated-graphql";
import { LicenseStatus } from "./types";

export function latestLicenseByIssueDate(
  licenses: OrgLicenseFragment[]
): OrgLicenseFragment | null {
  const licensesCopy = [...licenses];
  licensesCopy.sort((l1, l2) =>
    compareDesc(parseISO(l1.issuedAt), parseISO(l2.issuedAt))
  );
  return licensesCopy[0] ?? null;
}

export function formatLastVerified(expiresAt: string): string {
  return Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "medium"
  })
    .format(new Date(expiresAt))
    .replace(/,/g, "");
}

export function licenseStatus(license?: OrgLicenseFragment | null): LicenseStatus | null {
  return license
    ? // avoid anything less than minutes causing a mismatch
      isAfter(subMinutes(parseISO(license.expiresAt), 1), new Date())
      ? "active"
      : "expired"
    : null;
}

export function displayLicenseStatus(status: LicenseStatus | null): string {
  if (!status) return "";
  return status === "active" ? "Active" : "Expired";
}
