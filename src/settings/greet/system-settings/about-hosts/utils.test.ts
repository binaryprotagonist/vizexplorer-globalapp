import { render } from "@testing-library/react";
import { aboutHostsSettingHelp, aboutHostsSettingTitle } from "./utils";

describe("About Hosts utils", () => {
  describe("aboutGuestsSettingTitle", () => {
    it("returns expected title for enable-section-for-greet", () => {
      expect(aboutHostsSettingTitle("enable-section-for-greet")).toEqual(
        "Enable sections for greets assignment"
      );
    });

    it("returns expected title for allow-suppression-without-completion", () => {
      expect(aboutHostsSettingTitle("allow-suppression-without-completion")).toEqual(
        "Allow suppression without completion"
      );
    });

    it("returns expected title for max-assignment-per-host", () => {
      expect(aboutHostsSettingTitle("max-assignment-per-host")).toEqual(
        "Max assignments per host"
      );
    });

    it("returns expected title for max-missed-greets", () => {
      expect(aboutHostsSettingTitle("max-missed-greets")).toEqual("Max missed greets");
    });
  });

  describe("aboutHostsSettingHelp", () => {
    it("returns expected help text for enable-section-for-greet", () => {
      const { getByText } = render(aboutHostsSettingHelp("enable-section-for-greet"));
      expect(getByText(/choose their sections/)).toBeInTheDocument();
    });

    it("returns expected help text for allow-suppression-without-completion", () => {
      const { getByText } = render(
        aboutHostsSettingHelp("allow-suppression-without-completion")
      );
      expect(getByText(/Allow Hosts to suppress/)).toBeInTheDocument();
    });

    it("returns expected help text for max-assignment-per-host", () => {
      const { getByText } = render(aboutHostsSettingHelp("max-assignment-per-host"));
      expect(getByText(/Number of greets a host can be assigned/)).toBeInTheDocument();
    });

    it("returns expected help text for max-missed-greets", () => {
      const { getByText } = render(aboutHostsSettingHelp("max-missed-greets"));
      expect(getByText(/consecutive missed greets/)).toBeInTheDocument();
    });
  });
});
