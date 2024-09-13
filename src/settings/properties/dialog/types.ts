import { Currency } from "../../../view/utils";

export type SupportedCurrencyCode = "None" | Currency["code"];

export type TimeZone = {
  label: string;
  tzCode: string;
  name: string;
  utc: string;
};

export type TimeZoneOption = {
  label: string;
  value: string;
};
