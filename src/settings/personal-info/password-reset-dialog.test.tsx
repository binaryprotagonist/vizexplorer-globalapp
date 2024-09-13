import { fireEvent, render, waitFor } from "@testing-library/react";
import { PasswordResetDialog } from "./password-reset-dialog";
import { MockGraphQLProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { GaUserFragment } from "generated-graphql";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockUserPasswordReset
} from "testing/mocks";
import { ThemeProvider } from "../../theme";

describe("<PasswordResetDialog />", () => {
  let user: GaUserFragment = null as any;
  let currentUser: GaUserFragment = null as any;

  beforeEach(() => {
    user = { ...mockAdmin };
    currentUser = { ...mockOrgAdmin };
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockGraphQLProvider
          mocks={[
            mockUserPasswordReset({ userId: user.id }),
            mockCurrentUserQuery(currentUser)
          ]}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </MockGraphQLProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <PasswordResetDialog user={user} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("password-reset-dialog")).toBeInTheDocument();
  });

  it("runs `onClose` when the password reset is submitted successfully", async () => {
    const onClose = jest.fn();
    const { getByText } = render(<PasswordResetDialog user={user} onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Reset"));
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("runs `onClose` if `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(<PasswordResetDialog user={user} onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("disables action buttons while resetting password", async () => {
    const { getByText } = render(<PasswordResetDialog user={user} onClose={() => {}} />, {
      wrapper
    });

    fireEvent.click(getByText("Reset"));
    await waitFor(() => {
      expect(getByText("Cancel")).toBeDisabled();
      expect(getByText("Reset")).toBeDisabled();
    });
  });

  it("renders the expected messaging if a user is requesting to reset their own password", async () => {
    currentUser = { ...user };
    const { getByText, queryByText } = render(
      <PasswordResetDialog user={user} onClose={() => {}} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByText("Reset your", { exact: false })).toBeInTheDocument();
    });
    expect(
      getByText("instructions will be sent to your", { exact: false })
    ).toBeInTheDocument();
    expect(queryByText("Reset password for", { exact: false })).not.toBeInTheDocument();
    expect(
      queryByText("instructions will be sent to the user's", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("renders the expected messaging if another user is requesting to reset another users password", async () => {
    const { getByText, queryByText } = render(
      <PasswordResetDialog user={user} onClose={() => {}} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByText("Reset password for", { exact: false })).toBeInTheDocument();
    });
    expect(
      getByText("instructions will be sent to the user's", { exact: false })
    ).toBeInTheDocument();
    expect(queryByText("Reset your", { exact: false })).not.toBeInTheDocument();
    expect(
      queryByText("instructions will be sent to your", { exact: false })
    ).not.toBeInTheDocument();
  });
});
