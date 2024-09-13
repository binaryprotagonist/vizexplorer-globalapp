import { fireEvent, render } from "@testing-library/react";
import { EditSettings } from "./edit-settings";
import {
  defaultGuestTimePeriodsSetting,
  defaultHostTimePeriodsSetting,
  defaultWorthPctSetting
} from "../types";
import { ThemeProvider } from "../../../../theme";
import { produce } from "immer";
import { getInput } from "../../../../view/testing";
import { PdOrgSettingsInput } from "generated-graphql";
import { mockTimePeriods } from "../__mocks__/global-settings";

describe("<EditSettings />", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSave.mockReset();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders `NumericDialog` for a `Numeric` variant setting", () => {
    const { getByTestId } = render(
      <EditSettings
        setting={defaultWorthPctSetting}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("numeric-dialog")).toBeInTheDocument();
  });

  it("renders `TimePeriodSelection` for `guest-time-periods` variant setting", () => {
    const { getByTestId, getByText } = render(
      <EditSettings
        setting={defaultGuestTimePeriodsSetting}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("time-period-selection")).toBeInTheDocument();
    expect(getByText("Guest Summary Time Period Selection")).toBeInTheDocument();
  });

  it("renders `TimePeriodSelection` for `host-time-periods` variant setting", () => {
    const { getByTestId, getByText } = render(
      <EditSettings
        setting={defaultHostTimePeriodsSetting}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("time-period-selection")).toBeInTheDocument();
    expect(getByText("Host Summary Time Period Selection")).toBeInTheDocument();
  });

  it("throws an error if a setting with an unexpected variant is provided", () => {
    // ignore console error from thrown error
    jest.spyOn(console, "error").mockImplementation(() => {});
    const invalidSetting = produce(defaultWorthPctSetting, (draft) => {
      draft.variant = "invalid" as any;
    });
    expect(() =>
      render(
        <EditSettings
          setting={invalidSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      )
    ).toThrow();
  });

  describe("worth-pct setting", () => {
    it("renders expected labels", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultWorthPctSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // dialog title
      expect(getByText(defaultWorthPctSetting.name)).toBeInTheDocument();
      expect(getByText(defaultWorthPctSetting.description)).toBeInTheDocument();
      expect(getByTestId("numeric-input")).toHaveTextContent("Worth Percentage");
    });

    it("sets initial input value to the provided setting value", () => {
      const { getByTestId } = render(
        <EditSettings
          setting={defaultWorthPctSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const input = getInput(getByTestId("numeric-input"));
      expect(input).toHaveAttribute("value", `${defaultWorthPctSetting.config.value}`);
    });

    it("displays an error if the input value is less than `min`", () => {
      const { queryByTestId, getByTestId } = render(
        <EditSettings
          setting={defaultWorthPctSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const { min } = defaultWorthPctSetting.config;
      expect(queryByTestId("numeric-error")).toBeEmptyDOMElement();

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: `${min - 1}` } });
      expect(getByTestId("numeric-error")).not.toBeEmptyDOMElement();
    });

    it("displays an error if the input value is greater than `max`", () => {
      const { queryByTestId, getByTestId } = render(
        <EditSettings
          setting={defaultWorthPctSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const { max } = defaultWorthPctSetting.config;
      expect(queryByTestId("numeric-error")).toBeEmptyDOMElement();

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: `${max + 1}` } });
      expect(getByTestId("numeric-error")).not.toBeEmptyDOMElement();
    });

    it("runs `onSave` with expected values", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultWorthPctSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: "10" } });
      fireEvent.click(getByText("Save"));

      const expected: PdOrgSettingsInput = { worthPercentage: 10 };
      expect(mockOnSave).toHaveBeenCalledWith(expected);
    });
  });

  describe("guest-time-periods setting", () => {
    it("renders expected fields and values", () => {
      const setting = produce(defaultGuestTimePeriodsSetting, (draft) => {
        draft.config.value = mockTimePeriods;
      });
      const { getAllByTestId } = render(
        <EditSettings
          setting={setting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const timePeriodChecks = getAllByTestId("time-period-check");
      expect(timePeriodChecks).toHaveLength(mockTimePeriods.length);
    });

    it("provides `disabled` prop to `TimePeriodSelection`", () => {
      const { getByText } = render(
        <EditSettings
          disabled
          setting={defaultGuestTimePeriodsSetting}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // assume all other fields are disabled as per test coverage of the component itself
      expect(getByText("Cancel")).toBeDisabled();
    });

    it("runs `onSave` with expected values", () => {
      const timePeriods = [mockTimePeriods[0], { ...mockTimePeriods[1], default: true }];
      const setting = produce(defaultGuestTimePeriodsSetting, (draft) => {
        draft.config.value = timePeriods;
      });
      const { getByText, getAllByTestId } = render(
        <EditSettings
          setting={setting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // disable first time period
      fireEvent.click(getAllByTestId("time-period-check")[0]);
      fireEvent.click(getByText("Save"));

      const expected: PdOrgSettingsInput = {
        guestTimePeriods: [{ ...timePeriods[0], enabled: false }, timePeriods[1]]
      };
      expect(mockOnSave).toHaveBeenCalledWith(expected);
    });

    it("runs `onClose` when `Cancel` is clicked", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultGuestTimePeriodsSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("host-time-periods setting", () => {
    it("renders expected fields and values", () => {
      const setting = produce(defaultHostTimePeriodsSetting, (draft) => {
        draft.config.value = mockTimePeriods;
      });
      const { getAllByTestId } = render(
        <EditSettings
          setting={setting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const timePeriodChecks = getAllByTestId("time-period-check");
      expect(timePeriodChecks).toHaveLength(mockTimePeriods.length);
    });

    it("provides `disabled` prop to `TimePeriodSelection`", () => {
      const { getByText } = render(
        <EditSettings
          disabled
          setting={defaultHostTimePeriodsSetting}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // assume all other fields are disabled as per test coverage of the component itself
      expect(getByText("Cancel")).toBeDisabled();
    });

    it("runs `onSave` with expected values", () => {
      const timePeriods = [mockTimePeriods[0], { ...mockTimePeriods[1], default: true }];
      const setting = produce(defaultHostTimePeriodsSetting, (draft) => {
        draft.config.value = timePeriods;
      });
      const { getByText, getAllByTestId } = render(
        <EditSettings
          setting={setting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // disable first time period
      fireEvent.click(getAllByTestId("time-period-check")[0]);
      fireEvent.click(getByText("Save"));

      const expected: PdOrgSettingsInput = {
        hostTimePeriods: [{ ...timePeriods[0], enabled: false }, timePeriods[1]]
      };
      expect(mockOnSave).toHaveBeenCalledWith(expected);
    });

    it("runs `onClose` when `Cancel` is clicked", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultHostTimePeriodsSetting}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
