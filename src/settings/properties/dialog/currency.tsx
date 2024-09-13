import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  displayCurrency,
  getCurrencies,
  NO_CURRENCY
} from "../../../view/utils/currency";
import { SupportedCurrencyCode } from "./types";

type Props = {
  currencyCode: SupportedCurrencyCode;
  onChange: (currency: SupportedCurrencyCode) => void;
};

export function Currency({ currencyCode, onChange }: Props) {
  const currencies = React.useMemo(() => {
    const supported = getCurrencies();
    return [NO_CURRENCY, ...supported];
  }, []);

  return (
    <FormControl data-testid={"currency-select"} fullWidth>
      <InputLabel id={"currency-select"}>Currency</InputLabel>
      <Select
        label={"Currency"}
        value={currencyCode}
        onChange={(e) => onChange(e.target.value as SupportedCurrencyCode)}
      >
        {currencies.map((cur) => (
          <MenuItem key={cur.code} value={cur.code}>
            {displayCurrency(cur.code)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
