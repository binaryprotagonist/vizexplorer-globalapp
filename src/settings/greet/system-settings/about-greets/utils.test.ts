import { render } from "@testing-library/react";
import { aboutGreetsSettingTitle, aboutGreetsSettingHelp } from "./utils";

describe("About Greets utils", () => {
  describe("aboutGreetsSettingTitle", () => {
    it("returns expected title for assign-by-priority-score", () => {
      expect(aboutGreetsSettingTitle("assign-by-priority-score")).toEqual(
        "Assign by priority score"
      );
    });

    it("returns expected title for suppression-days-after-completion", () => {
      expect(aboutGreetsSettingTitle("suppression-days-after-completion")).toEqual(
        "Suppression days after completion"
      );
    });

    it("returns expected title for queue-inactive-greet-timeout", () => {
      expect(aboutGreetsSettingTitle("queue-inactive-greet-timeout")).toEqual(
        "Queue inactive greet timeout"
      );
    });

    it("returns expected title for greet-reassignment-timeout", () => {
      expect(aboutGreetsSettingTitle("greet-reassignment-timeout")).toEqual(
        "Greet reassignment timeout"
      );
    });

    it("returns expected title for show-guests-active-actions", () => {
      expect(aboutGreetsSettingTitle("show-guests-active-actions")).toEqual(
        "Show guest active actions"
      );
    });
  });

  describe("aboutGreetsSettingHelp", () => {
    it("returns expected help text for assign-by-priority-score", () => {
      const { getByText } = render(aboutGreetsSettingHelp("assign-by-priority-score"));
      expect(
        getByText(/The system will assign actions based on their priority scores/)
      ).toBeInTheDocument();
    });

    it("returns expected help text for suppression-days-after-completion", () => {
      const { getByText } = render(
        aboutGreetsSettingHelp("suppression-days-after-completion")
      );
      expect(getByText(/generate new greets/)).toBeInTheDocument();
    });

    it("returns expected help text for queue-inactive-greet-timeout", () => {
      const { getByText } = render(
        aboutGreetsSettingHelp("queue-inactive-greet-timeout")
      );
      expect(getByText(/queue/)).toBeInTheDocument();
    });

    it("returns expected help text for greet-reassignment-timeout", () => {
      const { getByText } = render(aboutGreetsSettingHelp("greet-reassignment-timeout"));
      expect(getByText(/greet assignment/)).toBeInTheDocument();
    });

    it("returns expected help text for show-guests-active-actions", () => {
      const { getByText } = render(aboutGreetsSettingHelp("show-guests-active-actions"));
      expect(getByText(/provide visibility/)).toBeInTheDocument();
    });
  });
});
