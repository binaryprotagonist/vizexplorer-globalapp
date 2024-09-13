import { fireEvent, render } from "@testing-library/react";
import { NumericDialog } from "./numeric-dialog";
import { ThemeProvider } from "../../../theme";
import { getInput } from "../../../view/testing";

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();
const defaultProps = {
  title: "Numeric Dialog",
  description: "Numeric Description",
  inputTitle: "Numeric Input",
  value: 50,
  min: 1,
  max: 100,
  onClose: mockOnClose,
  onSave: mockOnSave,
  disabled: false
};

describe("<NumericDialog />", () => {
  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSave.mockReset();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByTestId("numeric-dialog")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.title)).toBeInTheDocument();
  });

  it("renders provided description", () => {
    const { getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.description)).toBeInTheDocument();
  });
  it("renders provided inputTitle", () => {
    const { getByTestId } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByTestId("numeric-input")).toHaveTextContent(defaultProps.inputTitle);
  });

  it("can set the initial input value to the provided `value`", () => {
    const { getByTestId } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("numeric-input"));
    expect(input).toHaveAttribute("value", `${defaultProps.value}`);
  });

  it("displays an error if `value` is less than `min`", () => {
    // min = 1
    const { getByTestId, getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("numeric-input"));
    fireEvent.change(input!, { target: { value: 0 } });

    const { inputTitle, min, max } = defaultProps;
    expect(
      getByText(`${inputTitle} must be between ${min} and ${max}`)
    ).toBeInTheDocument();
  });

  it("displays an error if `value` is greater than `max`", () => {
    // max = 100
    const { getByTestId, getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("numeric-input"));
    fireEvent.change(input!, { target: { value: 101 } });

    const { inputTitle, min, max } = defaultProps;
    expect(
      getByText(`${inputTitle} must be between ${min} and ${max}`)
    ).toBeInTheDocument();
  });

  it("doesn't displays an error if `value` is exactly `min`", () => {
    const { getByTestId, queryByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const { inputTitle, min, max } = defaultProps;
    const input = getInput(getByTestId("numeric-input"));
    fireEvent.change(input!, { target: { value: min } });

    expect(
      queryByText(`${inputTitle} must be between ${min} and ${max}`)
    ).not.toBeInTheDocument();
  });

  it("doesn't displays an error if `value` is exactly `max`", () => {
    const { getByTestId, queryByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const { inputTitle, min, max } = defaultProps;
    const input = getInput(getByTestId("numeric-input"));
    fireEvent.change(input!, { target: { value: max } });

    expect(
      queryByText(`${inputTitle} must be between ${min} and ${max}`)
    ).not.toBeInTheDocument();
  });

  it("disables expected fields if there is an error", () => {
    const { getByTestId, getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("numeric-input"));
    fireEvent.change(input!, { target: { value: 101 } });

    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
    expect(input).not.toBeDisabled();
  });

  it("runs `onSave` if `Save` is clicked", () => {
    const { getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(mockOnSave).not.toHaveBeenCalled();
    fireEvent.click(getByText("Save"));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it("runs `onClose` if `Cancel` is clicked", () => {
    const { getByText } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(mockOnClose).not.toHaveBeenCalled();
    fireEvent.click(getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables expected fields if `disabled` is true", () => {
    const { getByText, getByTestId } = render(
      <NumericDialog {...defaultProps} disabled={true} />,
      { wrapper }
    );

    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
    expect(getInput(getByTestId("numeric-input"))).toBeDisabled();
  });

  it("doesn't disable any fields if `disabled` is false", () => {
    const { getByText, getByTestId } = render(<NumericDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText("Save")).not.toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
    expect(getInput(getByTestId("numeric-input"))).not.toBeDisabled();
  });
});
