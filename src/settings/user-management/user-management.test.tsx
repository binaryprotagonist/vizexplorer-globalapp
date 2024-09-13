import "@testing-library/jest-dom";
import { UserManagement } from "./user-management";
import { ThemeProvider } from "../../theme";
import { render } from "@testing-library/react";
import { GlobalMockedProvider } from "testing/graphql-provider";
import { mockOrgAdmin, mockCurrentUserQuery } from "testing/mocks";
import {
  mockUserManagementAdmin,
  mockUserManagementOrgAdmin,
  mockUserManagementUsersQuery,
  mockUserManagementViewer
} from "./users/__mocks__/users";
import { UserManagementUserFragment } from "./users/__generated__/users";
import { useUserManagementPermission } from "./user-management-permission";

jest.mock("./user-management-permission", () => ({
  useUserManagementPermission: jest.fn(() => ({
    canAccessUserManagementTabs: true,
    loading: false,
    error: undefined
  }))
}));

describe("<UserManagement />", () => {
  let currentUser: UserManagementUserFragment = null as any;

  beforeEach(() => {
    currentUser = mockOrgAdmin;
  });

  function wrapper({ children }: any) {
    return (
      <GlobalMockedProvider
        mocks={[
          mockCurrentUserQuery(currentUser),
          mockUserManagementUsersQuery({
            users: [
              mockUserManagementOrgAdmin,
              mockUserManagementAdmin,
              mockUserManagementViewer
            ]
          })
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </GlobalMockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<UserManagement />, { wrapper });

    expect(getByTestId("user-management")).toBeInTheDocument();
  });

  it("renders User Management title", () => {
    const { getByText } = render(<UserManagement />, { wrapper });

    expect(getByText("User Management")).toBeInTheDocument();
  });

  it("renders tabs with the correct labels", () => {
    const { getByTestId } = render(<UserManagement />, {
      wrapper
    });

    expect(getByTestId("view-tabs")).toHaveTextContent("Users");
    expect(getByTestId("view-tabs")).toHaveTextContent("User groups");
    expect(getByTestId("view-tabs")).toHaveTextContent("Host code mapping");
  });

  it("renders users table by default", () => {
    const { getByTestId } = render(<UserManagement />, { wrapper });

    expect(getByTestId("users-table")).toBeInTheDocument();
  });

  it("does not render tabs when access is denied", () => {
    (useUserManagementPermission as jest.Mock).mockReturnValue({
      canAccessUserManagementTabs: false,
      loading: false,
      error: undefined
    });
    const { queryByTestId } = render(<UserManagement />, { wrapper });

    expect(queryByTestId("view-tabs")).toBeNull();
  });

  it("does not render tabs while loading", () => {
    (useUserManagementPermission as jest.Mock).mockReturnValue({
      canAccessUserManagementTabs: true,
      loading: true,
      error: undefined
    });
    const { queryByTestId } = render(<UserManagement />, { wrapper });

    expect(queryByTestId("view-tabs")).toBeNull();
  });
});
