export type OrgCreateFormInput = {
  name: string;
  email: string;
  country: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
};

export type NewOrg = { id: string; name: string };
