import {
  currencyFromCode,
  currencyOrDefaultFromCode,
  displayCurrency,
  getCurrencies
} from "./currency";

describe("currency", () => {
  describe("getCurrencies", () => {
    it("returns expected list of currencies", () => {
      const currencies = getCurrencies();
      expect(currencies).toMatchSnapshot();
    });
  });

  describe("currencyFromCode", () => {
    it("returns expected currency for 'USD'", () => {
      const usd = currencyFromCode("USD");
      expect(usd).toEqual({ code: "USD", symbol: "$" });
    });

    it("returns expected currency for 'EUR'", () => {
      const eur = currencyFromCode("EUR");
      expect(eur).toEqual({ code: "EUR", symbol: "€" });
    });

    it("returns null for an invalid code", () => {
      const invalid = currencyFromCode("ABC");
      expect(invalid).toEqual(null);
    });
  });

  describe("currencyOrDefaultFromCode", () => {
    it("returns expected currency for 'USD'", () => {
      const usd = currencyOrDefaultFromCode("USD");
      expect(usd).toEqual({ code: "USD", symbol: "$" });
    });

    it("returns expected currency for 'EUR'", () => {
      const eur = currencyOrDefaultFromCode("EUR");
      expect(eur).toEqual({ code: "EUR", symbol: "€" });
    });

    it("returns USD for an invalid code", () => {
      const invalid = currencyOrDefaultFromCode("ABC");
      expect(invalid).toEqual({ code: "USD", symbol: "$" });
    });

    it("returns USD if a code isn't provided", () => {
      const invalid = currencyOrDefaultFromCode();
      expect(invalid).toEqual({ code: "USD", symbol: "$" });
    });
  });

  describe("displayCurrency", () => {
    it("returns expected value for USD", () => {
      expect(displayCurrency("USD")).toEqual("$ USD");
    });

    it("returns expected value for NZD", () => {
      expect(displayCurrency("NZD")).toEqual("$ NZD");
    });

    it("returns expected value for EUR", () => {
      expect(displayCurrency("EUR")).toEqual("€ EUR");
    });

    it("returns expected value for JPY", () => {
      expect(displayCurrency("JPY")).toEqual("¥ JPY");
    });

    it("returns `None` if provided value undefined", () => {
      expect(displayCurrency()).toEqual("None");
    });

    it("returns returns default value if an invalid code is provided", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      expect(displayCurrency("DoesntExist")).toEqual("$ DoesntExist");
    });

    it("logs an error if an invalid code is provided", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      displayCurrency("DoesntExist");
      expect((console.error as any).mock.calls[0][0]).toEqual(
        "Error: trying to format currency code DoesntExist"
      );
    });
  });
});
