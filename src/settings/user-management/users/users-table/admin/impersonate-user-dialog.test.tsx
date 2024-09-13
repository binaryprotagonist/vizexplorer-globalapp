import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { ImpersonateUserDialog } from "./impersonate-user-dialog";
import { mockUserManagementAdmin } from "../../__mocks__/users";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<ImpersonateUserDialog />", () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    mockOnCancel.mockReset();
    mockOnConfirm.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ImpersonateUserDialog
        user={mockUserManagementAdmin}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("impersonate-user-dialog")).toBeInTheDocument();
  });

  it("runs `onConfirm` if Impersonate is clicked", () => {
    const { getByText } = render(
      <ImpersonateUserDialog
        user={mockUserManagementAdmin}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Impersonate"));
    expect(mockOnConfirm).toHaveBeenCalledWith(mockUserManagementAdmin);
  });

  it("runs `onCancel` if Cancel is clicked", () => {
    const { getByText } = render(
      <ImpersonateUserDialog
        user={mockUserManagementAdmin}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("disables buttons if `disabled` is true", () => {
    const { getByText } = render(
      <ImpersonateUserDialog
        user={mockUserManagementAdmin}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        disabled={true}
      />,
      { wrapper }
    );

    expect(getByText("Impersonate")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });
});
