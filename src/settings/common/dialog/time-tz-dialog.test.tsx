import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { TimeTzDialog } from "./time-tz-dialog";
import { defaultTimezone, TimeTz } from "../../../view/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput } from "../../../view/testing";
import timezones from "../../../view/utils/timezones";

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();
const defaultProps = {
  title: "Time Tz Dialog",
  description: "Time Tz Description",
  value: { hour: 1, minute: 30, timezone: defaultTimezone().tzCode },
  onClose: mockOnClose,
  onSave: mockOnSave,
  disabled: false
};

describe("<TimeTzDialog />", () => {
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

  it("renders", () => {
    const { getByTestId } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByTestId("time-tz-dialog")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.title)).toBeInTheDocument();
  });

  it("renders provided description", () => {
    const { getByText } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.description)).toBeInTheDocument();
  });

  it("can set the initial input value to the provided `value`", () => {
    const { getByTestId } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    const timeInput = getInput(getByTestId("time-input"));
    expect(timeInput).toHaveAttribute("value", "01:30 AM");

    const tzInput = getInput(getByTestId("timezone-input"));
    const expectedTz = timezones.find(
      (tz) => defaultProps.value.timezone === tz.tzCode
    )!.name;
    expect(tzInput).toHaveAttribute("value", expectedTz);
  });

  it("disables inputs if `disabled` is true", () => {
    const { getByTestId, getByText } = render(
      <TimeTzDialog {...defaultProps} disabled={true} />,
      {
        wrapper
      }
    );

    const timeInput = getInput(getByTestId("time-input"));
    const tzInput = getInput(getByTestId("timezone-input"));
    expect(timeInput).toBeDisabled();
    expect(tzInput).toBeDisabled();
    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });

  it("doesn't disabled inputs if `disabled` is false", () => {
    const { getByTestId, getByText } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    const timeInput = getInput(getByTestId("time-input"));
    const tzInput = getInput(getByTestId("timezone-input"));
    expect(timeInput).not.toBeDisabled();
    expect(tzInput).not.toBeDisabled();
    expect(getByText("Save")).not.toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
  });

  it("runs `onClose` if `Cancel` is clicked", () => {
    const { getByText } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("runs `onSave` with expected values if `Save` is clicked", async () => {
    const { getByText } = render(<TimeTzDialog {...defaultProps} />, {
      wrapper
    });

    fireEvent.click(getByText("Save"));

    const expected: TimeTz = {
      hour: defaultProps.value.hour,
      minute: defaultProps.value.minute,
      timezone: defaultProps.value.timezone
    };
    await waitFor(() => {
      expect(mockOnSave.mock.calls[0][0]).toEqual(expected);
    });
  });
});
