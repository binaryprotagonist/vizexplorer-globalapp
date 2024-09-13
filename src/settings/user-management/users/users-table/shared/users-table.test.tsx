import { act, fireEvent, render, within } from "@testing-library/react";
import { UsersTable } from "./users-table";
import { ThemeProvider } from "../../../../../theme";
import { generateDummyAccessList } from "../../../../../view/testing/mocks";
import {
  mockUserManagementOrgAdmin,
  mockUserManagementAdmin,
  mockUserManagementViewer,
  generateDummyHostCodeList
} from "../../__mocks__/users";
import { UserActionFn } from "../../types";
import { updateInput } from "testing/utils";
import { UserManagementUserFragment } from "../../__generated__/users";
import { produce } from "immer";

const mockAdmin = {
  ...mockUserManagementAdmin,
  accessList: generateDummyAccessList(4),
  pdHostMappings: generateDummyHostCodeList(10)
};

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<UsersTable />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[]} actions={[]} />,
      { wrapper }
    );

    expect(getByTestId("users-table")).toBeInTheDocument();
  });

  it("renders table in loading state if `loading` is true", () => {
    const { getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[]} actions={[]} loading />,
      { wrapper }
    );

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
  });

  it("renders add user button", () => {
    const { getByText } = render(
      <UsersTable currentUser={mockAdmin} users={[]} actions={[]} />,
      { wrapper }
    );

    expect(getByText("Add user")).toBeInTheDocument();
  });

  it("disables add user button if `canAddUser` is false", () => {
    // default false when not provided
    const { getByText } = render(
      <UsersTable currentUser={mockUserManagementViewer} users={[]} actions={[]} />,
      { wrapper }
    );

    expect(getByText("Add user")).toBeDisabled();
  });

  it("renders tooltip on the Add user button if `canAddUser` is false", () => {
    jest.useFakeTimers();
    const { getByText, getByRole } = render(
      <UsersTable currentUser={mockUserManagementViewer} users={[]} actions={[]} />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByText("Add user"));
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("You don't have permission");
    jest.useRealTimers();
  });

  it("enables add user button if `canAddUser` is true", () => {
    const { getByText } = render(
      <UsersTable canAddUser currentUser={mockAdmin} users={[]} actions={[]} />,
      { wrapper }
    );

    expect(getByText("Add user")).toBeEnabled();
  });

  it("runs `onAddUserClick` when add user button is clicked", () => {
    const onAddUser = jest.fn();
    const { getByText } = render(
      <UsersTable
        canAddUser
        onAddUserClick={onAddUser}
        currentUser={mockAdmin}
        users={[]}
        actions={[]}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Add user"));
    expect(onAddUser).toHaveBeenCalled();
  });

  it("renders provided user information", () => {
    const curUser = mockAdmin;
    const otherUser = mockUserManagementOrgAdmin;
    const { getAllByTestId } = render(
      <UsersTable currentUser={curUser} users={[curUser, otherUser]} actions={[]} />,
      { wrapper }
    );

    const nameRows = getAllByTestId("user-fullname");
    const phoneRows = getAllByTestId("user-phone");
    const emailRows = getAllByTestId("user-email");
    const accessRows = getAllByTestId("access-list");
    const userGroupRows = getAllByTestId("user-group");
    const hostCodeRows = getAllByTestId("host-code-list");

    expect(nameRows[0]).toHaveTextContent(`${curUser.firstName} ${curUser.lastName}`);
    expect(phoneRows[0]).toHaveTextContent(curUser.phone);
    expect(emailRows[0]).toHaveTextContent(curUser.email);
    expect(accessRows[0]).toHaveTextContent(curUser.accessList[0].app.name);
    expect(userGroupRows[0]).toHaveTextContent(curUser.pdUserGroup!.name);
    let hostCodeIds = curUser.pdHostMappings!.map(({ nativeHostId }) => nativeHostId);
    // only validate a couple host codes are present. Full validation covered in another tests
    expect(hostCodeRows[0]).toHaveTextContent(`${hostCodeIds[0]}, ${hostCodeIds[1]}`);

    expect(nameRows[1]).toHaveTextContent(`${otherUser.firstName} ${otherUser.lastName}`);
    expect(phoneRows[1]).toHaveTextContent(otherUser.phone);
    expect(emailRows[1]).toHaveTextContent(otherUser.email);
    expect(accessRows[1]).toHaveTextContent("Org Admin");
    expect(userGroupRows[1]).toHaveTextContent(otherUser.pdUserGroup!.name);
    hostCodeIds = otherUser.pdHostMappings!.map(({ nativeHostId }) => nativeHostId);
    expect(hostCodeRows[1]).toHaveTextContent(`${hostCodeIds[0]}, ${hostCodeIds[1]}`);
  });

  it("renders provided actions", () => {
    const mockActions: UserActionFn[] = [
      () => ({ icon: () => <span data-testid={"action-1"} />, onClick: () => {} }),
      () => ({ icon: () => <span data-testid={"action-2"} />, onClick: () => {} })
    ];
    const { getByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={mockActions} />,
      { wrapper }
    );

    expect(getByTestId("action-1")).toBeInTheDocument();
    expect(getByTestId("action-2")).toBeInTheDocument();
  });

  it("renders `See All` if a user has more than 3 Access combinations", () => {
    const { getByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    const accessList = getByTestId("access-list");
    expect(within(accessList).getByText("See all")).toBeInTheDocument();
  });

  it("doesn't render `See All` if a user has less than 4 Access combinations", () => {
    const user = { ...mockAdmin, accessList: generateDummyAccessList(3) };
    const { getByTestId } = render(
      <UsersTable currentUser={user} users={[user]} actions={[]} />,
      { wrapper }
    );

    const accessList = getByTestId("access-list");
    expect(within(accessList).queryByText("See all")).not.toBeInTheDocument();
  });

  it("renders entire AccessList if `See All` is clicked", () => {
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("access-list")).getByText("See all"));

    const accessList = getByTestId("access-list");
    expect(getAllByTestId("access-row")).toHaveLength(mockAdmin.accessList.length);
    expect(within(accessList).queryByText("See all")).not.toBeInTheDocument();
    expect(within(accessList).getByText("See less")).toBeInTheDocument();
  });

  it("renders subset of AccessList when `See Less` is clicked", () => {
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("access-list")).getByText("See all"));
    fireEvent.click(within(getByTestId("access-list")).getByText("See less"));

    const accessList = getByTestId("access-list");
    expect(getAllByTestId("access-row")).toHaveLength(3);
    expect(within(accessList).queryByText("See less")).not.toBeInTheDocument();
  });

  it("can toggle different rows AccessLists", () => {
    const { getAllByTestId } = render(
      <UsersTable
        currentUser={mockAdmin}
        users={[mockAdmin, mockUserManagementViewer]}
        actions={[]}
      />,
      { wrapper }
    );

    // mockAdmin View More
    const accessLists = getAllByTestId("access-list");
    fireEvent.click(within(accessLists[0]).getByText("See all"));
    expect(within(accessLists[0]).getAllByTestId("access-row")).toHaveLength(4);
    expect(within(accessLists[1]).getAllByTestId("access-row")).toHaveLength(3);

    // mockViewer View More
    // previous `See all` has changed to `See less`
    fireEvent.click(within(accessLists[1]).getByText("See all"));
    expect(within(accessLists[0]).getAllByTestId("access-row")).toHaveLength(3);
    expect(within(accessLists[1]).getAllByTestId("access-row")).toHaveLength(10);
  });

  it("renders `See All` if a user has more than 3 rows of host codes", () => {
    const { getByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    const hostCodeList = getByTestId("host-code-list");
    expect(within(hostCodeList).getByText("See all")).toBeInTheDocument();
  });

  it("doesn't render `See All` if a user has less than 4 rows of host codes", () => {
    const user = {
      ...mockAdmin,
      pdHostMappings: generateDummyHostCodeList(9)
    };
    const { getByTestId } = render(
      <UsersTable currentUser={user} users={[user]} actions={[]} />,
      { wrapper }
    );

    const hostCodeList = getByTestId("host-code-list");
    expect(within(hostCodeList).queryByText("See all")).not.toBeInTheDocument();
  });

  it("renders all host codes if `See All` is clicked", async () => {
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("host-code-list")).getByText("See all"));

    const hostCodeList = getByTestId("host-code-list");
    const expectedRowCount = Math.ceil(mockAdmin.pdHostMappings!.length / 3);
    expect(getAllByTestId("host-codes-row")).toHaveLength(expectedRowCount);
    expect(within(hostCodeList).queryByText("See all")).not.toBeInTheDocument();
    expect(within(hostCodeList).getByText("See less")).toBeInTheDocument();
  });

  it("renders subset of host codes when `See Less` is clicked", () => {
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("host-code-list")).getByText("See all"));
    fireEvent.click(within(getByTestId("host-code-list")).getByText("See less"));

    const hostCodeList = getByTestId("host-code-list");
    expect(getAllByTestId("host-codes-row")).toHaveLength(3);
    expect(within(hostCodeList).queryByText("See less")).not.toBeInTheDocument();
  });

  it("can toggle the view of different rows host codes", () => {
    const otherUser = {
      ...mockUserManagementViewer,
      pdHostMappings: generateDummyHostCodeList(10)
    };
    const { getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin, otherUser]} actions={[]} />,
      { wrapper }
    );

    // mockAdmin View More
    fireEvent.click(within(getAllByTestId("host-code-list")[0]).getByText("See all"));
    let hostCodeLists = getAllByTestId("host-code-list");
    expect(within(hostCodeLists[0]).getAllByTestId("host-codes-row")).toHaveLength(4);
    expect(within(hostCodeLists[1]).getAllByTestId("host-codes-row")).toHaveLength(3);

    // mockViewer View More
    // previous `See all` has changed to `See less`
    fireEvent.click(within(hostCodeLists[1]).getByText("See all"));
    hostCodeLists = getAllByTestId("host-code-list");
    expect(within(hostCodeLists[0]).getAllByTestId("host-codes-row")).toHaveLength(3);
    expect(within(hostCodeLists[1]).getAllByTestId("host-codes-row")).toHaveLength(4);
  });

  it("can sort users by name", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      { ...mockUserManagementViewer, firstName: "Z" },
      { ...mockUserManagementAdmin, firstName: "A" }
    ];
    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );

    let rowUserNames = getAllByTestId("user-fullname");
    expect(rowUserNames[0]).toHaveTextContent(unorderedUsers[0].firstName);
    expect(rowUserNames[1]).toHaveTextContent(unorderedUsers[1].firstName);

    fireEvent.click(getByText("Personal Information"));

    rowUserNames = getAllByTestId("user-fullname");
    expect(rowUserNames[0]).toHaveTextContent(unorderedUsers[1].firstName);
    expect(rowUserNames[1]).toHaveTextContent(unorderedUsers[0].firstName);
  });

  it("sorts users without emails to the end when sorting by Personal Information Asc", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      { ...mockUserManagementViewer, firstName: "User C", email: "email1@test.com" },
      { ...mockUserManagementAdmin, firstName: "User D", email: "" },
      { ...mockUserManagementViewer, firstName: "User A", email: "email2@test.com" },
      { ...mockUserManagementViewer, firstName: "User B", email: "" }
    ];

    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );

    // Verify initial order
    let rowUserNames = getAllByTestId("user-fullname");
    expect(rowUserNames[0]).toHaveTextContent("User C");
    expect(rowUserNames[1]).toHaveTextContent("User D");
    expect(rowUserNames[2]).toHaveTextContent("User A");
    expect(rowUserNames[3]).toHaveTextContent("User B");

    // Click to sort by Personal Information
    fireEvent.click(getByText("Personal Information"));
    rowUserNames = getAllByTestId("user-fullname");

    expect(rowUserNames[0]).toHaveTextContent("User A");
    expect(rowUserNames[1]).toHaveTextContent("User C");
    expect(rowUserNames[2]).toHaveTextContent("User B");
    expect(rowUserNames[3]).toHaveTextContent("User D");
  });

  it("sorts users without emails to the end when sorting by Personal Information Desc", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      { ...mockUserManagementViewer, firstName: "User C", email: "email1@test.com" },
      { ...mockUserManagementAdmin, firstName: "User D", email: "" },
      { ...mockUserManagementViewer, firstName: "User A", email: "email2@test.com" },
      { ...mockUserManagementViewer, firstName: "User B", email: "" }
    ];

    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );

    // Verify initial order
    let rowUserNames = getAllByTestId("user-fullname");
    expect(rowUserNames[0]).toHaveTextContent("User C");
    expect(rowUserNames[1]).toHaveTextContent("User D");
    expect(rowUserNames[2]).toHaveTextContent("User A");
    expect(rowUserNames[3]).toHaveTextContent("User B");

    // Click to sort by Personal Information in descending order
    fireEvent.click(getByText("Personal Information"));
    fireEvent.click(getByText("Personal Information"));
    rowUserNames = getAllByTestId("user-fullname");

    expect(rowUserNames[0]).toHaveTextContent("User C");
    expect(rowUserNames[1]).toHaveTextContent("User A");
    expect(rowUserNames[2]).toHaveTextContent("User D");
    expect(rowUserNames[3]).toHaveTextContent("User B");
  });

  it("can sort users by user group name", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      { ...mockUserManagementViewer, pdUserGroup: { id: "1", name: "Z" } },
      { ...mockUserManagementAdmin, pdUserGroup: { id: "2", name: "A" } }
    ];
    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );
    let rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent(unorderedUsers[0].pdUserGroup!.name);
    expect(rowUserGroups[1]).toHaveTextContent(unorderedUsers[1].pdUserGroup!.name);

    fireEvent.click(getByText("User group"));
    rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent(unorderedUsers[1].pdUserGroup!.name);
    expect(rowUserGroups[1]).toHaveTextContent(unorderedUsers[0].pdUserGroup!.name);
  });

  it("sorts users without emails to the end when sorting by User Group asc", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      {
        ...mockUserManagementViewer,
        email: "john@example.com",
        pdUserGroup: { id: "1", name: "Group A" }
      },
      { ...mockUserManagementAdmin, email: "", pdUserGroup: { id: "2", name: "Group B" } }
    ];
    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(getByText("User group"));
    let rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent("Group A");
    expect(rowUserGroups[1]).toHaveTextContent("Group B");

    fireEvent.click(getByText("User group"));
    rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent("Group A");
    expect(rowUserGroups[1]).toHaveTextContent("Group B");
  });

  it("sorts users without emails to the end when sorting by User Group desc", () => {
    const unorderedUsers: UserManagementUserFragment[] = [
      {
        ...mockUserManagementViewer,
        email: "john@example.com",
        pdUserGroup: { id: "1", name: "Group B" }
      },
      { ...mockUserManagementAdmin, email: "", pdUserGroup: { id: "2", name: "Group A" } }
    ];
    const { getAllByTestId, getByText } = render(
      <UsersTable currentUser={unorderedUsers[0]} users={unorderedUsers} actions={[]} />,
      { wrapper }
    );

    fireEvent.click(getByText("User group"));
    let rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent("Group B");
    expect(rowUserGroups[1]).toHaveTextContent("Group A");

    fireEvent.click(getByText("User group"));
    rowUserGroups = getAllByTestId("user-group");

    expect(rowUserGroups[0]).toHaveTextContent("Group B");
    expect(rowUserGroups[1]).toHaveTextContent("Group A");
  });

  it("can search users by name", () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByTestId } = render(
      <UsersTable
        currentUser={mockUserManagementOrgAdmin}
        users={[mockUserManagementViewer, mockUserManagementAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), mockUserManagementAdmin.lastName);
      jest.runOnlyPendingTimers();
    });

    const rowUserNames = getAllByTestId("user-fullname");
    expect(rowUserNames).toHaveLength(1);
    expect(rowUserNames[0]).toHaveTextContent(mockUserManagementAdmin.lastName);
    jest.useRealTimers();
  });

  it("can search by users by a specific application for an app specific role", () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), "Slot Reports");
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("user-fullname")).toHaveLength(1);
    jest.useRealTimers();
  });

  it("can search by users by a specific property for an app specific role", () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={mockAdmin} users={[mockAdmin]} actions={[]} />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), "Site 0");
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("user-fullname")).toHaveLength(1);
    jest.useRealTimers();
  });

  it("can search by users by a specific property for an app specific role", () => {
    const customRoleUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].role.name = "Custom Role";
    });
    jest.useFakeTimers();
    const { getByTestId, getAllByTestId } = render(
      <UsersTable currentUser={customRoleUser} users={[customRoleUser]} actions={[]} />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), "Custom Role");
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("user-fullname")).toHaveLength(1);
    jest.useRealTimers();
  });

  it("can search Org Admins by access level", () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByTestId } = render(
      <UsersTable
        currentUser={mockAdmin}
        users={[mockAdmin, mockUserManagementOrgAdmin]}
        actions={[]}
      />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), "Org Admin");
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("user-fullname")).toHaveLength(1);
    jest.useRealTimers();
  });

  it("can search users by host codes", () => {
    jest.useFakeTimers();
    const mockHostCodeUser: UserManagementUserFragment = {
      ...mockAdmin,
      pdHostMappings: [{ id: "999", nativeHostId: "222" }]
    };
    const { getByTestId, getAllByTestId } = render(
      <UsersTable
        currentUser={mockHostCodeUser}
        users={[mockHostCodeUser]}
        actions={[]}
      />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("table-search"), "222");
      jest.runOnlyPendingTimers();
    });

    expect(getAllByTestId("user-fullname")).toHaveLength(1);
    jest.useRealTimers();
  });
});
