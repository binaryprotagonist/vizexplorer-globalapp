import { fireEvent, render } from "@testing-library/react";
import { SelectDialog } from "./select-dialog";
import { ThemeProvider } from "../../../theme";
import { getInput } from "../../../view/testing";

const mouseDown = { keyCode: 40 };

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();
const mockOptions = ["Option A", "Option B", "Option C"];
const defaultProps = {
  title: "Select Dialog",
  inputTitle: "Select Input",
  description: "Select Description",
  value: mockOptions[0],
  options: mockOptions,
  onClose: mockOnClose,
  onSave: mockOnSave,
  disabled: false
};

describe("<SelectDialog />", () => {
  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSave.mockReset();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByTestId("select-dialog")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.title)).toBeInTheDocument();
  });

  it("renders provided description", () => {
    const { getByText } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText(defaultProps.description)).toBeInTheDocument();
  });
  it("renders provided inputTitle", () => {
    const { getByTestId } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByTestId("select-input")).toHaveTextContent(defaultProps.inputTitle);
  });

  it("can set the initial input value to the provided `value`", () => {
    const { getByTestId } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("select-input"));
    expect(input).toHaveAttribute("value", `${defaultProps.value}`);
  });

  it("displays available options on select click", () => {
    const { getByTestId, queryByText, getByText } = render(
      <SelectDialog {...defaultProps} />,
      {
        wrapper
      }
    );

    expect(queryByText(defaultProps.options[1])).not.toBeInTheDocument();
    expect(queryByText(defaultProps.options[2])).not.toBeInTheDocument();

    fireEvent.keyDown(getByTestId("select-input"), mouseDown);
    expect(getByText(defaultProps.options[1])).toBeInTheDocument();
    expect(getByText(defaultProps.options[2])).toBeInTheDocument();
  });

  it("allows changing the selected value", () => {
    const { getByTestId, getByText } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    const input = getInput(getByTestId("select-input"));
    expect(input).toHaveAttribute("value", `${defaultProps.value}`);

    fireEvent.keyDown(getByTestId("select-input"), mouseDown);
    fireEvent.click(getByText(defaultProps.options[1]));

    expect(input).not.toHaveAttribute("value", `${defaultProps.value}`);
    expect(input).toHaveAttribute("value", `${defaultProps.options[1]}`);
  });

  it("runs `onSave` if `Save` is clicked", () => {
    const { getByText } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(mockOnSave).not.toHaveBeenCalled();
    fireEvent.click(getByText("Save"));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it("runs `onClose` if `Cancel` is clicked", () => {
    const { getByText } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(mockOnClose).not.toHaveBeenCalled();
    fireEvent.click(getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables expected fields if `disabled` is true", () => {
    const { getByText, getByTestId } = render(
      <SelectDialog {...defaultProps} disabled={true} />,
      { wrapper }
    );

    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
    expect(getInput(getByTestId("select-input"))).toBeDisabled();
  });

  it("doesn't disable any fields if `disabled` is false", () => {
    const { getByText, getByTestId } = render(<SelectDialog {...defaultProps} />, {
      wrapper
    });

    expect(getByText("Save")).not.toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
    expect(getInput(getByTestId("select-input"))).not.toBeDisabled();
  });
});
