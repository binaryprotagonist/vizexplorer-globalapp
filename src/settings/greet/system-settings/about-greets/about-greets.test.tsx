import { fireEvent, render, within } from "@testing-library/react";
import { AboutGreets } from "./about-greets";
import { mockGreetSettings } from "testing/mocks";
import { SuppressionDaysChangeParams } from "./suppression-days-after-completion";
import { QueueInactiveGreetTimeoutChangeParams } from "./queue-inactive-greet-timeout";
import { GreetReassignmentTimeoutChangeParams } from "./greet-reassignment-timeout";

describe("<AboutGreets />", () => {
  it("renders AboutGreets component", () => {
    const { getByTestId } = render(
      <AboutGreets settingIds={[]} settingData={mockGreetSettings} onChange={() => {}} />
    );

    expect(getByTestId("about-greets")).toBeInTheDocument();
  });

  it("renders AssignByPriorityScore if settingIds contains assign-by-priority-score", () => {
    const { getByTestId } = render(
      <AboutGreets
        settingIds={["assign-by-priority-score"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("assign-by-priority-score")).toBeInTheDocument();
  });

  it("renders SupressionDaysAfterCompletion if settingIds contains suppression-days-after-completion", () => {
    const { getByTestId } = render(
      <AboutGreets
        settingIds={["suppression-days-after-completion"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("suppression-days-after-completion")).toBeInTheDocument();
  });

  it("renders QueueInactiveTimeout if settingIds contains queue-inactive-greet-timeout", () => {
    const { getByTestId } = render(
      <AboutGreets
        settingIds={["queue-inactive-greet-timeout"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("queue-inactive-greet-timeout")).toBeInTheDocument();
  });

  it("renders GreetReassignmentTimeout if settingIds contains greet-reassignment-timeout", () => {
    const { getByTestId } = render(
      <AboutGreets
        settingIds={["greet-reassignment-timeout"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("greet-reassignment-timeout")).toBeInTheDocument();
  });

  it("renders ShowGuestActiveActions if settingIds contains show-guests-active-actions", () => {
    const { getByTestId } = render(
      <AboutGreets
        settingIds={["show-guests-active-actions"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("show-guests-active-actions")).toBeInTheDocument();
  });

  it("doesn't render Settings if settingIds is empty", () => {
    const { queryByTestId } = render(
      <AboutGreets settingIds={[]} settingData={mockGreetSettings} onChange={() => {}} />
    );

    expect(queryByTestId("assign-by-priority-score")).not.toBeInTheDocument();
    expect(queryByTestId("suppression-days-after-completion")).not.toBeInTheDocument();
    expect(queryByTestId("greet-reassignment-timeout")).not.toBeInTheDocument();
    expect(queryByTestId("queue-inactive-greet-timeout")).not.toBeInTheDocument();
    expect(queryByTestId("show-guests-active-actions")).not.toBeInTheDocument();
  });

  describe("SuppressionDaysAfterCompletion", () => {
    it("runs `onChange` if the coded value is changed", () => {
      const onChange = jest.fn();
      const { getByTestId } = render(
        <AboutGreets
          settingIds={["suppression-days-after-completion"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("coded-suppression-days-action"));
      const codedMenu = getByTestId("coded-suppression-days-menu");
      fireEvent.click(within(codedMenu).getByText("2 days"));

      expect(onChange).toHaveBeenCalledWith<[SuppressionDaysChangeParams]>({
        settingId: "suppression-days-after-completion",
        value: {
          __typename: "PdGreetSuppressionDays",
          coded: 2,
          uncoded: mockGreetSettings.greetSuppressionDays.uncoded
        }
      });
    });

    it("runs `onChange` if the uncoded value is changed", () => {
      const onChange = jest.fn();
      const { getByTestId } = render(
        <AboutGreets
          settingIds={["suppression-days-after-completion"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("uncoded-suppression-days-action"));
      const codedMenu = getByTestId("uncoded-suppression-days-menu");
      fireEvent.click(within(codedMenu).getByText("2 days"));

      expect(onChange).toHaveBeenCalledWith<[SuppressionDaysChangeParams]>({
        settingId: "suppression-days-after-completion",
        value: {
          __typename: "PdGreetSuppressionDays",
          coded: mockGreetSettings.greetSuppressionDays.coded,
          uncoded: 2
        }
      });
    });
  });

  describe("QueueInactiveGreetTimeout", () => {
    it("runs `onChange` if the timeout value is changed", () => {
      const onChange = jest.fn();
      const { getByTestId, getAllByRole } = render(
        <AboutGreets
          settingIds={["queue-inactive-greet-timeout"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("queue-inactive-timeout-action"));
      fireEvent.click(getAllByRole("option")[1]);

      expect(onChange).toHaveBeenCalledWith<[QueueInactiveGreetTimeoutChangeParams]>({
        settingId: "queue-inactive-greet-timeout",
        value: { __typename: "PdGreetTimeout", hours: 1, minutes: 15 }
      });
    });
  });

  describe("GreetReassignmentTimeout", () => {
    it("runs `onChange` if the timeout value is changed", () => {
      const onChange = jest.fn();
      const { getByTestId, getAllByRole } = render(
        <AboutGreets
          settingIds={["greet-reassignment-timeout"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("reassignment-timeout-action"));
      fireEvent.click(getAllByRole("option")[1]);

      expect(onChange).toHaveBeenCalledWith<[GreetReassignmentTimeoutChangeParams]>({
        settingId: "greet-reassignment-timeout",
        value: { __typename: "PdGreetTimeout", hours: 0, minutes: 10 }
      });
    });
  });
});
