import countryList from "./country.json";
import { Country } from "./types";

export function getCountryByCode(isoCode: string): Country | undefined {
  return countryList.find((country) => country.isoCode === isoCode);
}

export function getAllCountries() {
  return countryList;
}
