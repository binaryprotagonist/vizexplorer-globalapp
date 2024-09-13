import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { ManageUserGroupDialog } from "./manage-user-group-dialog";
import { AppId } from "generated-graphql";
import { MockedProvider } from "testing/graphql-provider";
import {
  MockUserGroupQueryOpts,
  MockUserGroupsQueryOpts,
  MockUsersQueryOpts,
  mockNativeHostA,
  mockNativeHostB,
  mockUserGroup,
  mockUserGroupQuery,
  mockUserGroupsQuery,
  mockUsersQuery,
  mockVodNoAccessUser,
  mockVodOrgAdminUser,
  mockVodPDEngageAccessUser
} from "./__mocks__/manage-user-group-dialog";
import { AlertProvider } from "view-v2/alert";
import { produce } from "immer";
import { getInput, updateInput } from "testing/utils";

describe("<ManageUserGroupDialog />", () => {
  let usersQueryOpts: MockUsersQueryOpts;
  let userGroupQueryOpts: MockUserGroupQueryOpts;
  let userGroupsQueryOpts: MockUserGroupsQueryOpts;

  beforeEach(() => {
    usersQueryOpts = {
      vodUsers: [mockVodOrgAdminUser, mockVodPDEngageAccessUser],
      unmappedNativeHosts: [mockNativeHostA, mockNativeHostB]
    };
    userGroupQueryOpts = { group: mockUserGroup };
    userGroupsQueryOpts = {
      groups: [{ id: mockUserGroup.id, name: mockUserGroup.name }]
    };
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            mockUsersQuery(usersQueryOpts),
            mockUserGroupQuery(userGroupQueryOpts),
            mockUserGroupsQuery(userGroupsQueryOpts)
          ]}
        >
          {children}
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManageUserGroupDialog />, { wrapper });

    expect(getByTestId("manage-user-group-dialog")).toBeInTheDocument();
  });

  it("renders expected title if `groupId` isn't provided", () => {
    const { getByTestId } = render(<ManageUserGroupDialog />, { wrapper });

    expect(getByTestId("dialog-header")).toHaveTextContent("Add a user group");
  });

  it("renders expected title if `groupId` is provided", () => {
    const { getByTestId } = render(<ManageUserGroupDialog groupId={"1"} />, { wrapper });

    expect(getByTestId("dialog-header")).toHaveTextContent("Edit user group");
  });

  it("renders dialog description if `groupId` isn't provided", () => {
    const { getByTestId } = render(<ManageUserGroupDialog />, { wrapper });

    const description = within(getByTestId("dialog-header")).getByTestId("description");
    expect(description).toHaveTextContent("Please create the user group");
  });

  it("doesn't render dialog description if `groupId` is provided", () => {
    const { getByTestId } = render(<ManageUserGroupDialog groupId={"1"} />, { wrapper });

    const dialogHeader = getByTestId("dialog-header");
    expect(within(dialogHeader).queryByTestId("description")).not.toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { getByTestId } = render(<ManageUserGroupDialog />, { wrapper });

    expect(getByTestId("group-name")).toBeInTheDocument();
    expect(getByTestId("greet-assignment")).toBeInTheDocument();
    expect(getByTestId("include-in-reports")).toBeInTheDocument();
    expect(getByTestId("guest-interaction")).toBeInTheDocument();
    expect(getByTestId("users-select")).toBeInTheDocument();
  });

  it("hides Guest interaction input if Greet assignment is set false", async () => {
    const { getByTestId, queryByTestId } = render(<ManageUserGroupDialog />, { wrapper });

    expect(getByTestId("guest-interaction")).toBeInTheDocument();

    await waitFor(() => {
      expect(getInput(getByTestId("greet-assignment"))).toBeEnabled();
    });
    fireEvent.click(getByTestId("greet-assignment"));

    expect(queryByTestId("guest-interaction")).not.toBeInTheDocument();
  });

  it("populates fields with loaded group data if `groupId` is provided", async () => {
    const { getByTestId, getAllByTestId } = render(
      <ManageUserGroupDialog groupId={mockUserGroup.id} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("group-name"))).toHaveValue(mockUserGroup.name);
    });
    expect(getInput(getByTestId("greet-assignment"))).toBeChecked();
    expect(getInput(getByTestId("include-in-reports"))).toBeChecked();
    expect(getInput(getByTestId("guest-interaction"))).toHaveValue("All guests");
    const userChips = getAllByTestId("user-chip");
    expect(userChips).toHaveLength(mockUserGroup.members.length);
    expect(userChips[0]).toHaveTextContent(mockUserGroup.members[0].firstName);
  });

  it("displays name taken text if the name is already taken by another group", async () => {
    const { getByTestId, findByText } = render(<ManageUserGroupDialog />, { wrapper });

    updateInput(getByTestId("group-name"), mockUserGroup.name);

    await findByText("The name entered is already in use", { exact: false });
  });

  it("doesn't name taken text if editing a group and the name is unchanged", async () => {
    const { getByTestId, queryByText } = render(
      <ManageUserGroupDialog groupId={mockUserGroup.id} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("group-name"))).toHaveValue(mockUserGroup.name);
    });

    expect(
      queryByText("The name entered is already in use", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("disables the Save button until the form is complete", async () => {
    const { getByTestId, getByText, getAllByRole } = render(<ManageUserGroupDialog />, {
      wrapper
    });

    await waitFor(() => {
      expect(getInput(getByTestId("group-name"))).toBeEnabled();
    });
    expect(getByText("Save")).toBeDisabled();

    updateInput(getByTestId("group-name"), "New Name");
    // disable greet assignment so guest interaction is not required
    fireEvent.click(getByTestId("greet-assignment"));
    fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });
    fireEvent.click(getAllByRole("option")[0]);

    expect(getByText("Save")).toBeEnabled();
  });

  it("calls `onClose` when the close button is clicked", () => {
    const onClose = jest.fn();
    const { getByRole } = render(<ManageUserGroupDialog onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls `onClose` when the Cancel button is clicked", async () => {
    const onClose = jest.fn();
    const { getByText } = render(<ManageUserGroupDialog onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Users Select", () => {
    it("sorts options alphabetically", async () => {
      usersQueryOpts = produce(usersQueryOpts, (draft) => {
        draft.vodUsers![0].firstName = "Zach";
        draft.vodUsers![1].firstName = "Aaron";
        draft.unmappedNativeHosts![0].firstName = "Zebra";
        draft.unmappedNativeHosts![1].firstName = "Apple";
      });

      const { getByTestId, getAllByTestId } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped, unmapped] = getAllByTestId("user-group");
      const mappedUsers = within(mapped).getAllByRole("option");
      const unmappedUsers = within(unmapped).getAllByRole("option");

      expect(mappedUsers[0]).toHaveTextContent("Aaron");
      expect(mappedUsers[1]).toHaveTextContent("Zach");
      expect(unmappedUsers[0]).toHaveTextContent("Apple");
      expect(unmappedUsers[1]).toHaveTextContent("Zebra");
    });

    it("doesn't include VOD users without PD Suite access", async () => {
      usersQueryOpts = produce(usersQueryOpts, (draft) => {
        draft.vodUsers![0].accessList = [
          { __typename: "UserAppAccess", app: { id: AppId.Sras } }
        ];
      });

      const { getByTestId, getAllByRole } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped] = getAllByRole("listitem");
      const mappedUsers = within(mapped).queryAllByRole("option");

      expect(mappedUsers).toHaveLength(usersQueryOpts.vodUsers!.length - 1);
    });

    it("doesn't VOD users that aren't mapped to a host", async () => {
      usersQueryOpts = produce(usersQueryOpts, (draft) => {
        draft.vodUsers![0].pdHostMappings = [];
      });

      const { getByTestId, getAllByRole } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped, unmapped] = getAllByRole("listitem");
      const mappedUsers = within(mapped).queryAllByRole("option");
      const unmappedUsers = within(unmapped).queryAllByRole("option");

      expect(mappedUsers).toHaveLength(usersQueryOpts.vodUsers!.length - 1);
      expect(unmappedUsers).toHaveLength(usersQueryOpts.unmappedNativeHosts!.length);
    });

    it("doesn't include VOD users that belong to another group", async () => {
      usersQueryOpts = produce(usersQueryOpts, (draft) => {
        draft.vodUsers![0].pdUserGroup = { __typename: "PdUserGroup", id: "1" };
      });

      const { getByTestId, getAllByRole } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped, unmapped] = getAllByRole("listitem");
      const mappedUsers = within(mapped).queryAllByRole("option");
      const unmappedUsers = within(unmapped).queryAllByRole("option");

      expect(mappedUsers).toHaveLength(usersQueryOpts.vodUsers!.length - 1);
      expect(unmappedUsers).toHaveLength(usersQueryOpts.unmappedNativeHosts!.length);
    });

    it("includes mapped No Access users", async () => {
      usersQueryOpts.vodUsers!.push(mockVodNoAccessUser);
      const { getByTestId, getAllByTestId } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped] = getAllByTestId("user-group");
      const mappedUsers = within(mapped).getAllByRole("option");

      expect(mappedUsers).toHaveLength(usersQueryOpts.vodUsers!.length);
    });

    it("doesn't include unmapped No Access users", async () => {
      const unmappedNoAccessUser = produce(mockVodNoAccessUser, (draft) => {
        draft.pdHostMappings = [];
      });
      usersQueryOpts.vodUsers!.push(unmappedNoAccessUser);
      const { getByTestId, getAllByTestId } = render(<ManageUserGroupDialog />, {
        wrapper
      });

      await waitFor(() => {
        expect(getInput(getByTestId("users-select"))).toBeEnabled();
      });
      fireEvent.keyDown(getInput(getByTestId("users-select"))!, { key: "ArrowDown" });

      const [mapped] = getAllByTestId("user-group");
      const mappedUsers = within(mapped).getAllByRole("option");

      expect(mappedUsers).toHaveLength(usersQueryOpts.vodUsers!.length - 1);
    });
  });
});
