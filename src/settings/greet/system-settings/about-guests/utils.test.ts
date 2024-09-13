import { aboutGuestsSettingHelp, aboutGuestsSettingTitle } from "./utils";

describe("About Guests utils", () => {
  describe("aboutGuestsSettingTitle", () => {
    it("returns expected title for report-banned-guest", () => {
      expect(aboutGuestsSettingTitle("report-banned-guest")).toEqual(
        "Report banned guest"
      );
    });
  });

  describe("aboutGuestsSettingHelp", () => {
    it("returns expected help text for report-banned-guest", () => {
      expect(aboutGuestsSettingHelp("report-banned-guest")).toEqual(
        "If a Banned Guest cards in, report it to someone."
      );
    });
  });
});
