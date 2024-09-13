import { defaultTimezone } from "./date-time";
import timezones from "./timezones";

describe("date-time Utils", () => {
  describe("defaultTimezone", () => {
    it("returns the browsers timezone if no value is provided", () => {
      expect(defaultTimezone()).toEqual(
        timezones.find((tz) => tz.tzCode === "Pacific/Auckland")
      );
    });

    it("returns the first timezone if an invalid value is provided", () => {
      expect(defaultTimezone("invalid")).toEqual(timezones[0]);
    });

    it("returns the expected timezone if a valid value is provided", () => {
      expect(defaultTimezone("Africa/Niamey")).toEqual(
        timezones.find((tz) => tz.tzCode === "Africa/Niamey")
      );
    });
  });
});
