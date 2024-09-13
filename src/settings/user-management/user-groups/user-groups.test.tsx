import { fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";
import { MockedProvider } from "testing/graphql-provider";
import { UserGroups } from "./user-groups";
import { ThemeProvider } from "../../../theme";
import { UserGroupFragment } from "./__generated__/user-groups";
import { generateDummyUserGroups, mockUserGroupsQuery } from "./__mocks__/user-group";

jest.mock("./manage-user-group-dialog", () => ({
  ManageUserGroupDialog: () => <div data-testid="manage-user-group-dialog" />
}));

describe("<UserGroups />", () => {
  let mockUserGroups: UserGroupFragment[];

  beforeEach(() => {
    mockUserGroups = generateDummyUserGroups();
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider mocks={[mockUserGroupsQuery(mockUserGroups)]}>
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<UserGroups />, { wrapper });

    expect(getByTestId("user-groups")).toBeInTheDocument();
  });

  it("renders NoUsersGroups content if there are no user groups", async () => {
    mockUserGroups = [];
    const { findByTestId } = render(<UserGroups />, { wrapper });

    await findByTestId("no-user-groups");
  });

  it("doesn't render NoUserGroups while loading", async () => {
    mockUserGroups = [];
    const { queryByTestId, getAllByTestId, findByTestId } = render(<UserGroups />, {
      wrapper
    });

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
    expect(queryByTestId("no-user-groups")).not.toBeInTheDocument();

    await findByTestId("no-user-groups");
  });

  it("renders manage user group dialog when Add user group is clicked", async () => {
    const { queryByTestId, getByText, getAllByTestId } = render(<UserGroups />, {
      wrapper
    });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    fireEvent.click(getByText("Add user group"));
    expect(queryByTestId("manage-user-group-dialog")).toBeInTheDocument();
  });

  it("renders manage user group dialog when Edit group button is clicked", async () => {
    const { queryByTestId, getAllByTestId } = render(<UserGroups />, {
      wrapper
    });

    const tableCellLoading = getAllByTestId("table-cell-loading")[0];
    await waitForElementToBeRemoved(tableCellLoading);

    fireEvent.click(getAllByTestId("edit-icon")[0]);
    expect(queryByTestId("manage-user-group-dialog")).toBeInTheDocument();
  });
});
