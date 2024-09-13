import { fireEvent, render, within } from "@testing-library/react";
import { PdGuestInteractionType } from "generated-graphql";
import { produce } from "immer";
import { act } from "react-dom/test-utils";
import { UserGroupsTable } from "./user-groups-table";
import { ThemeProvider } from "../../../theme";
import { booleanAsYesNo, guestInteractionLabel } from "./utils";
import {
  generateDummyUserGroupMembers,
  generateDummyUserGroups
} from "./__mocks__/user-group";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const mockUserGroups = generateDummyUserGroups();

describe("<UserGroupsTable />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <UserGroupsTable
        userGroups={[]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("user-groups-table")).toBeInTheDocument();
  });

  it("renders table in loading state if `loading` is true", () => {
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={[]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
  });

  it("renders `Add user group` button", () => {
    const { getByText } = render(
      <UserGroupsTable
        userGroups={[]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Add user group")).toBeInTheDocument();
  });

  it("disables `Add user group` button if loading is true", () => {
    const { getByText } = render(
      <UserGroupsTable
        userGroups={[]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(getByText("Add user group")).toBeDisabled();
  });

  it("runs `onAddUserGroup` when add user button is clicked", () => {
    const onAddUserGroup = jest.fn();
    const { getByText } = render(
      <UserGroupsTable
        userGroups={[]}
        onActionClick={() => {}}
        onAddUserGroup={onAddUserGroup}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Add user group"));
    expect(onAddUserGroup).toHaveBeenCalled();
  });

  it("renders User Group information", () => {
    const group = generateDummyUserGroups(1)[0];
    group.members = generateDummyUserGroupMembers(4);
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={[group]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    const groupNameRows = getAllByTestId("group-name");
    const guestInteractionRows = getAllByTestId("guest-interaction");
    const greetsAssignmentRows = getAllByTestId("greets-assignment");
    const includeInReportRows = getAllByTestId("include-reports");
    const userRows = getAllByTestId("users");
    const visibleNames = group.members
      .slice(0, 3)
      .map((user) => `${user.firstName} ${user.lastName}`)
      .join(", ");
    const hiddenName = `${group.members[3].firstName} ${group.members[3].lastName}`;

    expect(groupNameRows[0]).toHaveTextContent(group.name);
    expect(guestInteractionRows[0]).toHaveTextContent("All guests");
    expect(greetsAssignmentRows[0]).toHaveTextContent("Yes");
    expect(includeInReportRows[0]).toHaveTextContent("Yes");
    expect(userRows[0]).toHaveTextContent(visibleNames);
    expect(userRows[0]).not.toHaveTextContent(hiddenName);
  });

  it("renders `See All` if a user group has more than 3 users", () => {
    const group = generateDummyUserGroups(1)[0];
    group.members = generateDummyUserGroupMembers(4);
    const { getByTestId } = render(
      <UserGroupsTable
        userGroups={[group]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    const userList = getByTestId("user-list");

    expect(within(userList).getByText("See all")).toBeInTheDocument();
  });

  it("renders all User Group Users if `See all` is clicked", () => {
    const group = generateDummyUserGroups(1)[0];
    group.members = generateDummyUserGroupMembers(4);
    const { getAllByTestId, getByText, queryByTestId } = render(
      <UserGroupsTable
        userGroups={[group]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("See all"));
    const userNames = group.members
      .map((user) => `${user.firstName} ${user.lastName}`)
      .join(", ");
    const userRow = getAllByTestId("users");

    expect(userRow[0]).toHaveTextContent(userNames);
    expect(getByText("See less")).toBeInTheDocument();
    expect(queryByTestId("See all")).not.toBeInTheDocument();
  });

  it("collapses User Group Users if `See less` is clicked", () => {
    const group = generateDummyUserGroups(1)[0];
    group.members = generateDummyUserGroupMembers(4);
    const { getAllByTestId, getByText, queryByTestId } = render(
      <UserGroupsTable
        userGroups={[group]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("See all"));
    fireEvent.click(getByText("See less"));
    const visibleNames = group.members
      .slice(0, 3)
      .map((user) => `${user.firstName} ${user.lastName}`)
      .join(", ");
    const hiddenName = `${group.members[3].firstName} ${group.members[3].lastName}`;
    const usersRow = getAllByTestId("users");

    expect(usersRow[0]).toHaveTextContent(visibleNames);
    expect(usersRow[0]).not.toHaveTextContent(hiddenName);
    expect(getByText("See all")).toBeInTheDocument();
    expect(queryByTestId("See less")).not.toBeInTheDocument();
  });

  it("doesn't render `See all` if there are 3 or less users", () => {
    const group = produce(generateDummyUserGroups(1)[0], (draft) => {
      draft.members = draft.members.slice(0, 3);
    });
    const { queryByText } = render(
      <UserGroupsTable
        userGroups={[group]}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    expect(queryByText("See all")).not.toBeInTheDocument();
  });

  it("renders actions", () => {
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={mockUserGroups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("edit-icon")).toHaveLength(mockUserGroups.length);
    expect(getAllByTestId("delete-icon")).toHaveLength(mockUserGroups.length);
  });

  it("runs `onActionClick` when Edit action is clicked", () => {
    const onActionClick = jest.fn();
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={mockUserGroups}
        onActionClick={onActionClick}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByTestId("edit-icon")[0]);
    const actionClick = onActionClick.mock.calls[0][0];

    expect(actionClick.type).toEqual("edit");
    expect(actionClick.group.id).toEqual(mockUserGroups[0].id);
  });

  it("runs `onActionClick` when Delete action is clicked", () => {
    const onActionClick = jest.fn();
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={mockUserGroups}
        onActionClick={onActionClick}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByTestId("delete-icon")[0]);
    const actionClick = onActionClick.mock.calls[0][0];

    expect(actionClick.type).toEqual("delete");
    expect(actionClick.group.id).toEqual(mockUserGroups[0].id);
  });

  it("sorts by Group Name ascending by default", () => {
    const groups = produce(mockUserGroups, (draft) => {
      draft[0].name = "Group 2";
      draft[1].name = "Group 1";
      draft[2].name = "Group 3";
    });
    const { getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("group-name");

    expect(rows[0]).toHaveTextContent("Group 1");
    expect(rows[1]).toHaveTextContent("Group 2");
    expect(rows[2]).toHaveTextContent("Group 3");
  });

  it("can sort by Guest Interaction", () => {
    const groups = produce(mockUserGroups, (draft) => {
      draft[0].guestInteractionType = PdGuestInteractionType.Uncoded;
      draft[1].guestInteractionType = PdGuestInteractionType.Coded;
      draft[2].guestInteractionType = PdGuestInteractionType.All;
    });
    const { getByText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Guest interaction"));
    const rows = getAllByTestId("guest-interaction");

    expect(rows[0]).toHaveTextContent("All guests");
    expect(rows[1]).toHaveTextContent("Coded guests");
    expect(rows[2]).toHaveTextContent("Uncoded guests");
  });

  it("can sort by Greets Assignment", () => {
    const groups = produce(mockUserGroups, (draft) => {
      delete draft[0].guestInteractionType;
      draft[1].guestInteractionType = PdGuestInteractionType.All;
      delete draft[2].guestInteractionType;
    });
    const { getByText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Greets assignment"));
    const rows = getAllByTestId("greets-assignment");

    expect(rows[0]).toHaveTextContent("Yes");
    expect(rows[1]).toHaveTextContent("No");
    expect(rows[2]).toHaveTextContent("No");
  });

  it("can sort by Exclude From Reports", () => {
    const groups = produce(mockUserGroups, (draft) => {
      draft[2].excludeFromReports = false;
      draft[0].excludeFromReports = true;
      draft[1].excludeFromReports = false;
    });
    const { getByText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Include in reports"));
    const rows = getAllByTestId("include-reports");

    expect(rows[0]).toHaveTextContent("No");
    expect(rows[1]).toHaveTextContent("Yes");
    expect(rows[2]).toHaveTextContent("Yes");
  });

  it("can search on Group Name", () => {
    const { getByPlaceholderText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={mockUserGroups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const searchInput = getByPlaceholderText("Search");
      fireEvent.change(searchInput, {
        target: { value: mockUserGroups[0].name }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("group-name");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mockUserGroups[0].name);
  });

  it("can search on Guest Interaction", () => {
    const groups = generateDummyUserGroups(2);
    groups[1].guestInteractionType = PdGuestInteractionType.Uncoded;
    const { getByPlaceholderText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const searchInput = getByPlaceholderText("Search");
      fireEvent.change(searchInput, {
        target: { value: "All guests" }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("guest-interaction");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(
      guestInteractionLabel(groups[0].guestInteractionType)
    );
  });

  it("can search on Greets Assignment", () => {
    const groups = generateDummyUserGroups(2);
    groups[0].guestInteractionType = PdGuestInteractionType.All;
    groups[0].excludeFromReports = false;
    delete groups[1].guestInteractionType;
    groups[1].excludeFromReports = false;
    const { getByPlaceholderText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const searchInput = getByPlaceholderText("Search");
      fireEvent.change(searchInput, {
        target: { value: "Yes" }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("greets-assignment");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(booleanAsYesNo(!!groups[0].guestInteractionType));
  });

  it("can search on Include in Reports", () => {
    const groups = generateDummyUserGroups(2);
    delete groups[0].guestInteractionType;
    groups[0].excludeFromReports = true;
    delete groups[1].guestInteractionType;
    groups[1].excludeFromReports = false;
    const { getByPlaceholderText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const searchInput = getByPlaceholderText("Search");
      fireEvent.change(searchInput, {
        target: { value: "Yes" }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("include-reports");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(booleanAsYesNo(!groups[0].excludeFromReports));
  });

  it("can search on Users", () => {
    const groups = generateDummyUserGroups(2);
    groups[0].members = [{ id: "1", firstName: "John", lastName: "Doe" }];
    groups[1].members = [{ id: "2", firstName: "Jane", lastName: "Doe" }];
    const { getByPlaceholderText, getAllByTestId } = render(
      <UserGroupsTable
        userGroups={groups}
        onActionClick={() => {}}
        onAddUserGroup={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const searchInput = getByPlaceholderText("Search");
      fireEvent.change(searchInput, {
        target: { value: "John" }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("users");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(
      groups[0].members.map((user) => `${user.firstName} ${user.lastName}`).join(", ")
    );
  });
});
