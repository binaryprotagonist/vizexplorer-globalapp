import { fireEvent, render, waitFor } from "@testing-library/react";
import { EditSettings } from "./edit-settings";
import { ThemeProvider } from "../../../../theme";
import { produce } from "immer";
import { getInput } from "../../../../view/testing";
import { PdOrgSettingsInput } from "generated-graphql";
import {
  defaultLookbackPeriod,
  defaultMaxTasksPerHostCode,
  defaultTaskSchedule,
  defaultValueMetric
} from "../types";
import { displaySelectOption } from "./utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const mouseDown = { keyCode: 40 };

describe("PDRE <EditSettings />", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSave.mockReset();
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>{children}</ThemeProvider>
      </LocalizationProvider>
    );
  }

  it("renders `NumericDialog` for a `numeric` variant setting", () => {
    const { getByTestId } = render(
      <EditSettings
        setting={defaultMaxTasksPerHostCode}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("numeric-dialog")).toBeInTheDocument();
  });

  it("renders `SelectDialog` for a `select` variant setting", () => {
    const { getByTestId } = render(
      <EditSettings
        setting={defaultValueMetric}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("select-dialog")).toBeInTheDocument();
  });

  it("renders `TimeTzDialog` for a `time-tz` variant setting", () => {
    const { getByTestId } = render(
      <EditSettings
        setting={defaultTaskSchedule}
        disabled={false}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    expect(getByTestId("time-tz-dialog")).toBeInTheDocument();
  });

  it("throws an error if a setting with an unexpected variant is provided", () => {
    // ignore console error from thrown error
    jest.spyOn(console, "error").mockImplementation(() => {});
    const invalidSetting = produce(defaultMaxTasksPerHostCode, (draft) => {
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

  describe("Numeric Dialog Setting", () => {
    it("renders expected labels", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // dialog title
      expect(getByText(defaultLookbackPeriod.name)).toBeInTheDocument();
      expect(getByTestId("numeric-input")).toHaveTextContent("Lookback Days");
    });

    it("sets initial input value to the provided setting value", () => {
      const { getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const input = getInput(getByTestId("numeric-input"));
      expect(input).toHaveAttribute("value", `${defaultLookbackPeriod.config.value}`);
    });

    it("displays an error if the input value is less than `min`", () => {
      const { queryByTestId, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const { min } = defaultLookbackPeriod.config;
      expect(queryByTestId("numeric-error")).toBeEmptyDOMElement();

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: `${min - 1}` } });
      expect(getByTestId("numeric-error")).not.toBeEmptyDOMElement();
    });

    it("displays an error if the input value is greater than `max`", () => {
      const { queryByTestId, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const { max } = defaultLookbackPeriod.config;
      expect(queryByTestId("numeric-error")).toBeEmptyDOMElement();

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: `${max + 1}` } });
      expect(getByTestId("numeric-error")).not.toBeEmptyDOMElement();
    });

    it("runs `onSave` with expected values", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const input = getInput(getByTestId("numeric-input"));
      fireEvent.change(input!, { target: { value: "300" } });
      fireEvent.click(getByText("Save"));

      const expected: PdOrgSettingsInput = { lookbackDays: 300 };
      expect(mockOnSave).toHaveBeenCalledWith(expected);
    });

    it("disables expected fields if `disabled` is true", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("numeric-input"))).toBeDisabled();
      expect(getByText("Save")).toBeDisabled();
      expect(getByText("Cancel")).toBeDisabled();
    });

    it("doesn't disable fields if `disabled` is false", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultLookbackPeriod}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("numeric-input"))).toBeEnabled();
      expect(getByText("Save")).toBeEnabled();
      expect(getByText("Cancel")).toBeEnabled();
    });
  });

  describe("Select Dialog Setting", () => {
    it("renders expected labels", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // dialog title
      expect(getByText(defaultValueMetric.name)).toBeInTheDocument();
      expect(getByTestId("select-input")).toHaveTextContent("Metric Name");
    });

    it("sets initial input value to the provided setting value", () => {
      const { getByTestId } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      const input = getInput(getByTestId("select-input"));
      const expected = displaySelectOption(
        "value-metric",
        defaultValueMetric.config.value
      );
      expect(input).toHaveAttribute("value", `${expected}`);
    });

    it("displays settings options when input is clicked", () => {
      const { getByTestId, getByText } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.keyDown(getByTestId("select-input"), mouseDown);

      defaultValueMetric.config.options.forEach((option) => {
        const displayOption = displaySelectOption("value-metric", option);
        expect(getByText(displayOption)).toBeInTheDocument();
      });
    });

    it("disables expected fields if `disabled` is true", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("select-input"))).toBeDisabled();
      expect(getByText("Save")).toBeDisabled();
      expect(getByText("Cancel")).toBeDisabled();
    });

    it("doesn't disable fields if `disabled` is false", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("select-input"))).toBeEnabled();
      expect(getByText("Save")).toBeEnabled();
      expect(getByText("Cancel")).toBeEnabled();
    });

    it("runs `onSave` with expected values", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Save"));
      const expected: PdOrgSettingsInput = {
        valueMetric: defaultValueMetric.config.value
      };
      expect(mockOnSave.mock.calls[0][0]).toEqual(expected);
    });

    it("runs `onClose` if `Cancel` is clicked", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("doesn't run `onSave` if `disabled` is true", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Save"));
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it("doesn't run `onClose` if `disabled` is true", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultValueMetric}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("TimeTz Dialog", () => {
    it("renders expected labels", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      // dialog title
      expect(getByText(defaultTaskSchedule.name)).toBeInTheDocument();
    });

    it("disables expected fields if `disabled` is true", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("time-input"))).toBeDisabled();
      expect(getInput(getByTestId("timezone-input"))).toBeDisabled();
      expect(getByText("Save")).toBeDisabled();
      expect(getByText("Cancel")).toBeDisabled();
    });

    it("doesn't disable fields if `disabled` is false", () => {
      const { getByText, getByTestId } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      expect(getInput(getByTestId("time-input"))).toBeEnabled();
      expect(getInput(getByTestId("timezone-input"))).toBeEnabled();
      expect(getByText("Save")).toBeEnabled();
      expect(getByText("Cancel")).toBeEnabled();
    });

    it("runs `onSave` with expected values", async () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Save"));
      const expected: PdOrgSettingsInput = {
        taskScheduler: {
          hour: defaultTaskSchedule.config.value.hour,
          minute: defaultTaskSchedule.config.value.minute,
          timezone: defaultTaskSchedule.config.value.timezone
        }
      };
      await waitFor(() => {
        expect(mockOnSave.mock.calls[0][0]).toEqual(expected);
      });
    });

    it("runs `onClose` if `Cancel` is clicked", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={false}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("doesn't run `onSave` if `disabled` is true", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Save"));
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it("doesn't run `onClose` if `disabled` is true", () => {
      const { getByText } = render(
        <EditSettings
          setting={defaultTaskSchedule}
          disabled={true}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Cancel"));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
