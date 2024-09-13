import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { LicenseStatusToggleDialog } from "./license-status-toggle-dialog";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<LicenseStatusToggleDialog />", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <LicenseStatusToggleDialog
        isActive={false}
        licenseId={"1"}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("license-status-toggle-dialog")).toBeInTheDocument();
  });

  it("doesn't disable action buttons if `loading` is false", () => {
    const { getByText } = render(
      <LicenseStatusToggleDialog
        isActive={false}
        licenseId={"1"}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText("Enable")).toBeEnabled();
    expect(getByText("Cancel")).toBeEnabled();
  });

  it("disables action buttons if `loading` is true", () => {
    const { getByText } = render(
      <LicenseStatusToggleDialog
        isActive={false}
        licenseId={"1"}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />,
      { wrapper }
    );

    expect(getByText("Enable")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });

  it("runs `onCancel` if Cancel is clicked", () => {
    const { getByText } = render(
      <LicenseStatusToggleDialog
        isActive={false}
        licenseId={"1"}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  describe("isActive is false", () => {
    it("renders expected title", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={false}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Enable License")).toBeInTheDocument();
    });

    it("renders expected actions", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={false}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Enable")).toBeInTheDocument();
      expect(getByText("Cancel")).toBeInTheDocument();
    });

    it("renders expected body content", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={false}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Enable license?")).toBeInTheDocument();
    });

    it("runs `onConfirm` if Enable is clicked", () => {
      const licenseId = "1";
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={false}
          licenseId={licenseId}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Enable"));
      expect(mockOnConfirm).toHaveBeenCalledWith(licenseId, "enable");
    });
  });

  describe("isActive is true", () => {
    it("renders expected title if `isActive` is true", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={true}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Disable License")).toBeInTheDocument();
    });

    it("renders expected actions", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={true}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Disable")).toBeInTheDocument();
      expect(getByText("Cancel")).toBeInTheDocument();
    });

    it("renders expected body content", () => {
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={true}
          licenseId={"1"}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      expect(getByText("Disable license?")).toBeInTheDocument();
    });

    it("runs `onConfirm` if Disable is clicked", () => {
      const licenseId = "1";
      const { getByText } = render(
        <LicenseStatusToggleDialog
          isActive={true}
          licenseId={licenseId}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          loading={false}
        />,
        { wrapper }
      );

      fireEvent.click(getByText("Disable"));
      expect(mockOnConfirm).toHaveBeenCalledWith(licenseId, "disable");
    });
  });
});
