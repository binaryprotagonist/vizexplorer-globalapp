import currencyList from "./currency.json";
import { Currency } from "./types";

export const NO_CURRENCY: Currency = {
  code: "None",
  symbol: ""
} as const;

export function getCurrencies(): Currency[] {
  return currencyList;
}

export function currencyFromCode(code: string): Currency | null {
  return currencyList.find((cur) => cur.code === code) || null;
}

export function currencyOrDefaultFromCode(code?: string): Currency {
  const currency = currencyFromCode(code || "USD");
  return currency || currencyFromCode("USD")!;
}

const DEFAULT_SYMBOL = "$";

export function displayCurrency(
  code?: string,
  format: "symbol" | "full" = "full"
): Currency["code"] {
  if (!code || code === NO_CURRENCY.code) return NO_CURRENCY.code;

  let symbol: string = DEFAULT_SYMBOL;

  try {
    // throws on an unexpected `currency`
    const nf = Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol"
    });
    const currency = nf.formatToParts().find((part) => part.type === "currency");
    if (currency) {
      symbol = currency.value;
    }
  } catch (err) {
    console.error(`Error: trying to format currency code ${code}`, err);
  }

  if (format === "full") {
    return symbol ? `${symbol} ${code}` : `${DEFAULT_SYMBOL} ${code}`;
  }

  return symbol || DEFAULT_SYMBOL;
}
