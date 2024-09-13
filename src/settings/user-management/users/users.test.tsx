import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { MockedProvider } from "testing/graphql-provider";
import { mockOrgAdmin, mockCurrentUserQuery } from "testing/mocks";
import {
  MockUserManagementUsersQueryOpts,
  mockUserManagementAdmin,
  mockUserManagementOrgAdmin,
  mockUserManagementUsersQuery,
  mockUserManagementViewer
} from "./__mocks__/users";
import { ThemeProvider } from "../../../theme";
import { Users } from "./users";
import { GaUserFragment } from "generated-graphql";
import { UserManagementUserFragment } from "./__generated__/users";
import { GraphQLError } from "graphql";

jest.mock("./manage-user-dialog", () => ({
  ManageUserDialog: () => <div data-testid="manage-user-dialog" />
}));

const mockCurrentUser: GaUserFragment = {
  __typename: "User",
  id: mockOrgAdmin.id,
  firstName: mockOrgAdmin.firstName,
  lastName: mockOrgAdmin.lastName,
  phone: mockOrgAdmin.phone,
  email: mockOrgAdmin.email,
  accessLevel: mockOrgAdmin.accessLevel,
  accessList: mockOrgAdmin.accessList,
  mfa: false
};

const mockUsers = [
  mockUserManagementOrgAdmin,
  mockUserManagementAdmin,
  mockUserManagementViewer
];

describe("<UserManagement />", () => {
  let currentUser: GaUserFragment;
  let userManagementUsersQueryOpts: MockUserManagementUsersQueryOpts[];

  beforeEach(() => {
    currentUser = mockCurrentUser;
    userManagementUsersQueryOpts = [{ users: mockUsers }];
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          mockCurrentUserQuery(currentUser),
          mockCurrentUserQuery(currentUser), // refetch after refreshing on error
          ...userManagementUsersQueryOpts.map(mockUserManagementUsersQuery)
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<Users />, { wrapper });

    expect(getByTestId("users")).toBeInTheDocument();
  });

  it("renders users table", () => {
    const { getByTestId } = render(<Users />, { wrapper });

    expect(getByTestId("users-table")).toBeInTheDocument();
  });

  it("renders a row for each user", async () => {
    const { getAllByTestId } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    expect(getAllByTestId("table-row")).toHaveLength(mockUsers.length);
  });

  it("sorts users", async () => {
    const mockOtherOrgAdmin: UserManagementUserFragment = {
      ...mockUserManagementOrgAdmin,
      id: "999",
      firstName: "Zebra",
      lastName: "Doe"
    };
    const users = [
      mockUserManagementViewer,
      mockUserManagementAdmin,
      mockUserManagementOrgAdmin,
      mockOtherOrgAdmin
    ];
    userManagementUsersQueryOpts[0].users = users;
    const { getAllByTestId } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    const userNameRows = getAllByTestId("user-fullname");
    const usersNames = users.map((user) => `${user.firstName} ${user.lastName}`);
    // current user first
    expect(userNameRows[0]).toHaveTextContent(usersNames[2]);
    // other org admins
    expect(userNameRows[1]).toHaveTextContent(usersNames[3]);
    // rest aren't sorted and remain the same order in the array
    expect(userNameRows[2]).toHaveTextContent(usersNames[0]);
    expect(userNameRows[3]).toHaveTextContent(usersNames[1]);
  });

  it("renders table actions", async () => {
    const { getAllByTestId } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    expect(getAllByTestId("edit-user")).toHaveLength(mockUsers.length);
    expect(getAllByTestId("delete-user")).toHaveLength(mockUsers.length);
  });

  it("disables all actions while loading", async () => {
    const { getAllByTestId, getByText } = render(<Users />, { wrapper });

    const editBtns = getAllByTestId("edit-user");
    const deleteBtns = getAllByTestId("delete-user");
    editBtns.forEach((editBtn) => {
      expect(editBtn).toBeDisabled();
    });
    deleteBtns.forEach((deleteBtn) => {
      expect(deleteBtn).toBeDisabled();
    });
    expect(getByText("Add user")).toBeDisabled();
  });

  it("enables buttons once loading is finished", async () => {
    const { getAllByTestId, getByText } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    const editBtns = getAllByTestId("edit-user");
    const deleteBtns = getAllByTestId("delete-user");
    editBtns.forEach((editBtn) => {
      expect(editBtn).toBeEnabled();
    });
    // first delete button disabled as a user cannot delete themselves
    expect(deleteBtns[0]).toBeDisabled();
    expect(deleteBtns[1]).toBeEnabled();
    expect(deleteBtns[2]).toBeEnabled();
    expect(getByText("Add user")).toBeEnabled();
  });

  it("allows users to edit themselves regardless of permission", async () => {
    currentUser = mockUserManagementViewer;
    const { getAllByTestId } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    expect(getAllByTestId("edit-user")[0]).toBeEnabled();
  });

  it("disables edit buttons if the user doesn't have permission", async () => {
    jest.useFakeTimers();
    currentUser = mockUserManagementViewer;
    const { getAllByTestId, getByRole } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    const editBtns = getAllByTestId("edit-user");
    expect(editBtns[1]).toBeDisabled();
    expect(editBtns[2]).toBeDisabled();

    act(() => {
      fireEvent.mouseOver(editBtns[1]);
      jest.runOnlyPendingTimers();
    });
    expect(getByRole("tooltip")).toHaveTextContent("You don't have permission to edit");
    jest.useRealTimers();
  });

  it("doesn't allow users to delete themselves regardless of permission", async () => {
    jest.useFakeTimers();
    const { getAllByTestId, getByRole } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    act(() => {
      fireEvent.mouseOver(getAllByTestId("delete-user")[0]);
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("delete-user")[0]).toBeDisabled();
    expect(getByRole("tooltip")).toHaveTextContent("You can not delete your own account");
    jest.useRealTimers();
  });

  it("doesn't allow deleting other users if the user doesn't have permission", async () => {
    jest.useFakeTimers();
    currentUser = mockUserManagementViewer;
    const { getAllByTestId, getByRole } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    act(() => {
      fireEvent.mouseOver(getAllByTestId("delete-user")[1]);
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("delete-user")[1]).toBeDisabled();
    expect(getByRole("tooltip")).toHaveTextContent("You don't have permission to delete");
    jest.useRealTimers();
  });

  it("doesn't allow viewers to add users", async () => {
    jest.useFakeTimers();
    currentUser = mockUserManagementViewer;
    const { getAllByTestId, getByText, getByRole } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    act(() => {
      fireEvent.mouseOver(getByText("Add user"));
      jest.runOnlyPendingTimers();
    });

    expect(getByText("Add user")).toBeDisabled();
    expect(getByRole("tooltip")).toHaveTextContent(
      "You don't have permission to add new users"
    );
    jest.useRealTimers();
  });

  it("allows application admins to add users", async () => {
    currentUser = mockUserManagementAdmin;
    const { getAllByTestId, getByText } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    expect(getByText("Add user")).toBeEnabled();
  });

  it("allows org admins to add users", async () => {
    const { getAllByTestId, getByText } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    expect(getByText("Add user")).toBeEnabled();
  });

  it("opens user management dialog if Add user is clicked", async () => {
    const { getAllByTestId, getByText, getByTestId } = render(<Users />, { wrapper });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    fireEvent.click(getByText("Add user"));

    expect(getByTestId("manage-user-dialog")).toBeInTheDocument();
  });

  it("displays Something Went wrong if there is an error loading APIs", async () => {
    userManagementUsersQueryOpts[0].errors = [new GraphQLError("Something went wrong")];
    const { findByTestId } = render(<Users />, { wrapper });

    await findByTestId("users-table-error");
  });

  it("re-executes queries if Refresh Page is clicked on the error component", async () => {
    userManagementUsersQueryOpts[0].errors = [new GraphQLError("Something went wrong")];
    userManagementUsersQueryOpts.push({ users: mockUsers });
    const { findByTestId, findAllByTestId, getByText, queryByTestId } = render(
      <Users />,
      {
        wrapper
      }
    );

    await findByTestId("users-table-error");

    fireEvent.click(getByText("Refresh page"));

    // loading state resolves instantly on refetch so we can't rely on waiting for the component to be removed. Instead validate a users name is findable
    await findAllByTestId("table-cell-loading");

    const firstUsersName = `${mockUsers[0].firstName} ${mockUsers[0].lastName}`;
    expect(getByText(firstUsersName)).toBeInTheDocument();
    expect(queryByTestId("users-table-error")).not.toBeInTheDocument();
  });
});
