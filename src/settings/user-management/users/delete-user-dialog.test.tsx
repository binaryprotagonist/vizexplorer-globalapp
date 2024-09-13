import { DeleteUserDialog } from "./delete-user-dialog";
import { ThemeProvider } from "../../../theme";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { mockUserDelete } from "./__mocks__/delete-user-dialog";
import { mockUserManagementOrgAdmin } from "./__mocks__/users";
import { AlertProvider } from "view-v2/alert";
import { MockedProvider } from "testing/graphql-provider";

describe("<DeleteUserDialog />", () => {
  const cache = new InMemoryCache();

  beforeEach(() => {
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          cache={cache}
          mocks={[mockUserDelete(mockUserManagementOrgAdmin.id)]}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <DeleteUserDialog userToDelete={mockUserManagementOrgAdmin} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("delete-user-dialog"));
  });

  it("displays users full name", () => {
    const { getByTestId } = render(
      <DeleteUserDialog userToDelete={mockUserManagementOrgAdmin} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("delete-user-dialog")).toHaveTextContent(
      `${mockUserManagementOrgAdmin.firstName} ${mockUserManagementOrgAdmin.lastName}`
    );
  });

  it("disables `Cancel` and `Delete` buttons while deleting", async () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <DeleteUserDialog
        userToDelete={mockUserManagementOrgAdmin}
        onClose={mockOnClose}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));
    expect(getByText("Cancel")).toBeDisabled();
    expect(getByText("Delete")).toBeDisabled();
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("runs `onClose` after successfully deleting a user", async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <DeleteUserDialog userToDelete={mockUserManagementOrgAdmin} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("removes user reference from Cache on delete", async () => {
    const cacheId = `${mockUserManagementOrgAdmin.__typename}:${mockUserManagementOrgAdmin.id}`;
    cache.restore({ [cacheId]: mockUserManagementOrgAdmin });
    const { getByText } = render(
      <DeleteUserDialog userToDelete={mockUserManagementOrgAdmin} onClose={() => {}} />,
      { wrapper }
    );

    expect(Object.keys(cache.extract())).toContain(cacheId);
    fireEvent.click(getByText("Delete"));

    await waitFor(() => {
      expect(Object.keys(cache.extract())).not.toContain(cacheId);
    });
  });

  it("runs `onClose` if Cancel is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <DeleteUserDialog userToDelete={mockUserManagementOrgAdmin} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
