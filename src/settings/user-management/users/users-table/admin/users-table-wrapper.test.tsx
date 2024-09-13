import { act, fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import {
  mockAdmin,
  mockNoAccessUser,
  mockOrgAdmin
} from "../../../../../view/testing/mocks";
import { AdminUsersTableWrapper } from "./users-table-wrapper";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { MockedProvider } from "../../../../../view/testing";
import { mockImpersonateUser } from "../../../../../view/testing/mocks/admin";
import { BrowserRouter } from "react-router-dom";
import { UserActionFn } from "../../types";

describe("<ImpersonateUserDialog />", () => {
  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockedProvider mocks={[mockImpersonateUser(mockAdmin.id)]}>
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <AdminUsersTableWrapper actions={[]} currentUser={mockOrgAdmin} users={[]} />,
      { wrapper }
    );

    expect(getByTestId("admin-users-table-wrapper")).toBeInTheDocument();
  });

  it("renders users table", () => {
    const { getByTestId } = render(
      <AdminUsersTableWrapper actions={[]} currentUser={mockOrgAdmin} users={[]} />,
      { wrapper }
    );

    expect(getByTestId("users-table")).toBeInTheDocument();
  });

  it("renders table in loading state if `loading` is true", () => {
    const { getAllByTestId } = render(
      <AdminUsersTableWrapper
        loading
        currentUser={mockOrgAdmin}
        users={[mockAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
  });

  it("renders Impersonate action along with provided actions", () => {
    const mockActions: UserActionFn[] = [
      () => ({ icon: () => <span data-testid={"mock-action"} />, onClick: () => {} })
    ];
    const { getByTestId } = render(
      <AdminUsersTableWrapper
        currentUser={mockOrgAdmin}
        users={[mockAdmin]}
        actions={mockActions}
      />,
      { wrapper }
    );

    expect(getByTestId("impersonate-user")).toBeInTheDocument();
    expect(getByTestId("mock-action")).toBeInTheDocument();
  });

  it("opens impersonate dialog if impersonate action is clicked", () => {
    const { getByTestId } = render(
      <AdminUsersTableWrapper
        currentUser={mockOrgAdmin}
        users={[mockAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("impersonate-user"));

    expect(getByTestId("impersonate-user-dialog")).toBeInTheDocument();
  });

  it("doesn't allow users to impersonate themselves", () => {
    const { getByTestId } = render(
      <AdminUsersTableWrapper
        currentUser={mockOrgAdmin}
        users={[mockOrgAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    expect(getByTestId("impersonate-user")).toBeDisabled();
  });

  it("renders expected tooltip for the impersonate button if disabled to disallow self impersonation", () => {
    jest.useFakeTimers();
    const { getByTestId, getByRole } = render(
      <AdminUsersTableWrapper
        currentUser={mockOrgAdmin}
        users={[mockOrgAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("impersonate-user"));
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Cannot impersonate yourself");
    jest.useRealTimers();
  });

  it("renders expected tooltip for the impersonate button if disabled in case of users with no application access", () => {
    jest.useFakeTimers();
    const { getByTestId, getByRole } = render(
      <AdminUsersTableWrapper
        currentUser={mockOrgAdmin}
        users={[mockNoAccessUser]}
        actions={[]}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("impersonate-user"));
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(
      "Can not impersonate a user with no application access"
    );
    jest.useRealTimers();
  });
});
