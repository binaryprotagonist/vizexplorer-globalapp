import { OrgCreateInput } from "generated-graphql";
import { EMAIL_PATTERN_REGEX } from "../../../view/utils/email";
import { OrgCreateFormInput } from "./types";
import { AppsRounded } from "view-v2/icons";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

export const ORG_CREATION_STEPS = [
  { label: "Create Organization", Icon: ApartmentRoundedIcon },
  { label: "Add Subscription", Icon: AppsRounded }
] as const;

export const defaultOrgCreateInput: OrgCreateFormInput = {
  name: "",
  email: "",
  country: "us",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: ""
};

export function isEmailLike(email: string) {
  return EMAIL_PATTERN_REGEX.test(email);
}

export function isOrgNameTaken(orgName: string, takenOrgNames: Set<string>) {
  return !!orgName.trim() && takenOrgNames.has(orgName.trim().toLowerCase());
}

export function isFormValid(form: OrgCreateFormInput, takenOrgNames: Set<string>) {
  const hasEmptyRequiredFields = Object.entries(form).some(([key, value]) => {
    if (key !== "addressLine2" && key !== "state") {
      return !value.trim();
    }

    return false;
  });
  if (hasEmptyRequiredFields) return false;

  const emailIsValid = isEmailLike(form.email);
  return !isOrgNameTaken(form.name, takenOrgNames) && emailIsValid;
}

export function orgCreateFormToOrgCreateInput(form: OrgCreateFormInput): OrgCreateInput {
  return {
    company: {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      street1: form.addressLine1.trim(),
      street2: form.addressLine2.trim(),
      city: form.city.trim(),
      country: form.country.toUpperCase(),
      region: form.state.trim(),
      postalCode: form.zip.trim()
    }
  };
}
