import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { LicenseGenerationDialog } from "./license-generation-dialog";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<LicenseGenerationDialog />", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("license-generation-dialog")).toBeInTheDocument();
  });

  it("renders title", () => {
    const { getByText } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText("Generate License")).toBeInTheDocument();
  });

  it("runs `onConfirm` if Generate is clicked", () => {
    const { getByText } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Generate"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("runs `onCancel` if Cancel is clicked", () => {
    const { getByText } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("doesn't disable action buttons if `loading` is false", () => {
    const { getByText } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText("Generate")).toBeEnabled();
    expect(getByText("Cancel")).toBeEnabled();
  });

  it("disables action buttons if `loading` is true", () => {
    const { getByText } = render(
      <LicenseGenerationDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />,
      { wrapper }
    );

    expect(getByText("Generate")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });
});
