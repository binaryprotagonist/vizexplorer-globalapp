import { fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";
import {
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockUserPasswordReset
} from "../../view/testing/mocks";
import { Security } from "./security";
import { ThemeProvider } from "../../theme";
import { MockedProvider } from "@apollo/client/testing";

const currentUser = { ...mockOrgAdmin };

function wrapper({ children }: any) {
  return (
    <MockedProvider
      mocks={[mockCurrentUserQuery(), mockUserPasswordReset({ userId: currentUser.id })]}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </MockedProvider>
  );
}

describe("<Security />", () => {
  it("renders", () => {
    const { getByTestId } = render(<Security currentUser={currentUser} mfa={false} />, {
      wrapper
    });

    expect(getByTestId("security")).toBeInTheDocument();
  });

  it("renders dialog if `Reset Password` is clicked", () => {
    const { getByText, getByTestId } = render(
      <Security currentUser={currentUser} mfa={false} />,
      { wrapper }
    );

    fireEvent.click(getByText("Reset Password"));
    expect(getByTestId("password-reset-dialog")).toBeInTheDocument();
  });

  it("closes `Reset Password` dialog if `Cancel` is clicked", () => {
    const { getByText, queryByTestId } = render(
      <Security currentUser={currentUser} mfa={false} />,
      { wrapper }
    );

    fireEvent.click(getByText("Reset Password"));
    fireEvent.click(getByText("Cancel"));

    expect(queryByTestId("password-reset-dialog")).not.toBeInTheDocument();
  });

  it("closes dialog if password is reset successfully", async () => {
    const { getByText, queryByTestId } = render(
      <Security currentUser={currentUser} mfa={false} />,
      { wrapper }
    );

    fireEvent.click(getByText("Reset Password"));
    fireEvent.click(getByText("Reset"));
    await waitForElementToBeRemoved(queryByTestId("password-reset-dialog"));
  });

  it("renders multifactor switch", () => {
    const { getByTestId } = render(<Security currentUser={currentUser} mfa={false} />, {
      wrapper
    });

    expect(getByTestId("multifactor-switch")).toBeInTheDocument();
  });
});
