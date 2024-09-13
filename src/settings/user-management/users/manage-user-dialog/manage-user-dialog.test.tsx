import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { ManageUserDialog } from "./manage-user-dialog";
import { MockedProvider } from "testing/graphql-provider";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockEmailExists,
  mockOrgAdmin
} from "testing/mocks";
import { AlertProvider } from "view-v2/alert";
import { act } from "react-dom/test-utils";
import { getInput, updateInput } from "testing/utils";
import {
  MockCreateUserV2MutationOpts,
  mockCreateUserV2Mutation,
  mockUserAccessRowOptionsQuery,
  mockUsersQuery
} from "./__mocks__/manage-user-dialog";
import { GaUserFragment, OrgAccessLevel } from "generated-graphql";
import { GraphQLError } from "graphql";
import { UsersQuery } from "./__generated__/manage-user-dialog";
import { UserManagement } from "./types";
import { produce } from "immer";
import { mockUserManagementViewer } from "../__mocks__/users";

const mockUsers: UsersQuery["users"] = [
  {
    __typename: "User",
    id: "997",
    firstName: "OrgAdmin",
    lastName: "User",
    accessLevel: OrgAccessLevel.OrgAdmin
  },
  {
    __typename: "User",
    id: "998",
    firstName: "NoAccess",
    lastName: "User",
    accessLevel: OrgAccessLevel.NoAccess
  },
  {
    __typename: "User",
    id: "999",
    firstName: "AppSpecific",
    lastName: "User",
    accessLevel: OrgAccessLevel.AppSpecific
  }
];

const mockUserManagementCreate: UserManagement = { type: "create-user" };

// mock debounce to callback immediately. mocking timers within an async context is too unreliable
jest.mock("../../../../view/utils/utils", () => ({
  useFnDebounce: () => (cb: VoidFunction) => cb()
}));

describe("<ManageUserDialog />", () => {
  let currentUser: GaUserFragment;
  let createUserOpts: MockCreateUserV2MutationOpts;

  beforeEach(() => {
    currentUser = mockOrgAdmin;
    createUserOpts = {
      vars: {
        firstName: "John",
        lastName: "Doe",
        email: "unique_email@test.com",
        phone: "555-555-5555",
        password: "password",
        accessLevel: OrgAccessLevel.OrgAdmin,
        accessList: []
      }
    };
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            mockCurrentUserQuery(currentUser),
            mockUserAccessRowOptionsQuery(),
            mockUsersQuery({ users: mockUsers }),
            mockEmailExists("taken_email@test.com", true),
            mockEmailExists("unique_email@test.com", false),
            mockEmailExists("unique_email@test.com", false), // re-check on submit
            mockCreateUserV2Mutation(createUserOpts)
          ]}
        >
          {children}
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    expect(getByTestId("manage-user-dialog")).toBeInTheDocument();
  });

  it("runs onClose when close button is clicked", () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("runs onClose when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });

  it("only renders Access Level input while access level is not selected", () => {
    const { getByTestId, queryByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    expect(getByTestId("access-level")).toBeInTheDocument();
    expect(queryByTestId("first-name")).not.toBeInTheDocument();
    expect(queryByTestId("last-name")).not.toBeInTheDocument();
    expect(queryByTestId("phone")).not.toBeInTheDocument();
    expect(queryByTestId("email")).not.toBeInTheDocument();
    expect(queryByTestId("password")).not.toBeInTheDocument();
  });

  it("renders expected access level options for an Org Admin", async () => {
    const { getByTestId, getByText, getAllByRole } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });

    expect(getAllByRole("option")).toHaveLength(3);
    expect(getByText("Org Admin")).toBeInTheDocument();
    expect(getByText("Application User")).toBeInTheDocument();
    expect(getByText("No Access")).toBeInTheDocument();
  });

  it("renders expected access level options for an App Admin", async () => {
    currentUser = mockAdmin;
    const { getByTestId, getByText, getAllByRole } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });

    expect(getAllByRole("option")).toHaveLength(2);
    expect(getByText("Application User")).toBeInTheDocument();
    expect(getByText("No Access")).toBeInTheDocument();
  });

  it("renders expected input fields when Org Admin access level is selected", async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    expect(getByTestId("first-name")).toBeInTheDocument();
    expect(getByTestId("last-name")).toBeInTheDocument();
    expect(getByTestId("phone")).toBeInTheDocument();
    expect(getByTestId("email")).toBeInTheDocument();
    expect(getByTestId("password")).toBeInTheDocument();
    expect(queryByTestId("access-list")).not.toBeInTheDocument();
  });

  it("renders expected input fields when Application User access level is selected", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Application User"));

    expect(getByTestId("first-name")).toBeInTheDocument();
    expect(getByTestId("last-name")).toBeInTheDocument();
    expect(getByTestId("phone")).toBeInTheDocument();
    expect(getByTestId("email")).toBeInTheDocument();
    expect(getByTestId("password")).toBeInTheDocument();
    expect(getByTestId("access-list")).toBeInTheDocument();
    expect(getByTestId("access-list-row")).toBeInTheDocument();
  });

  it("renders expected input fields when No Access access level is selected", async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    expect(getByTestId("first-name")).toBeInTheDocument();
    expect(getByTestId("last-name")).toBeInTheDocument();
    expect(getByTestId("phone")).toBeInTheDocument();
    expect(getByTestId("email")).toBeInTheDocument();
    expect(queryByTestId("password")).not.toBeInTheDocument();
    expect(queryByTestId("access-list")).not.toBeInTheDocument();
  });

  it("dispays an error when the email is not a valid format", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("email"), "invalid");
    });

    expect(getByText("Invalid email address")).toBeInTheDocument();
  });

  it("displays an error when the email is taken", async () => {
    const { getByTestId, getByText, findByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("email"), "taken_email@test.com");
    });

    await findByText("Email is taken");
  });

  it("disables save while all fields are empty", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    expect(getByText("Save")).toBeDisabled();
  });

  it("enables save when all fields are filled and valid for Org Admin access", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("first-name"), "John");
      updateInput(getByTestId("last-name"), "Doe");
      updateInput(getByTestId("phone"), "555-555-5555");
      updateInput(getByTestId("email"), "unique_email@test.com");
      updateInput(getByTestId("password"), "password");
    });

    await waitForElementToBeRemoved(getByTestId("verifying-email"));

    expect(getByText("Save")).toBeEnabled();
  });

  it("enables save when all required fields are filled and valid for No Access User", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    act(() => {
      updateInput(getByTestId("first-name"), "John");
      updateInput(getByTestId("last-name"), "Doe");
      updateInput(getByTestId("phone"), "555-555-5555");
    });

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    expect(getByText("Save")).toBeEnabled();
  });

  it("disables save if the email is entered but is not unique for No Access user", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    act(() => {
      updateInput(getByTestId("first-name"), "John");
      updateInput(getByTestId("last-name"), "Doe");
      updateInput(getByTestId("phone"), "555-555-5555");
      updateInput(getByTestId("email"), "taken_email@test.com");
    });

    await waitForElementToBeRemoved(getByTestId("verifying-email"));

    expect(getByText("Save")).toBeDisabled();
  });

  it("enables save if email is provided and is unique for No Access user", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    act(() => {
      updateInput(getByTestId("first-name"), "John");
      updateInput(getByTestId("last-name"), "Doe");
      updateInput(getByTestId("phone"), "555-555-5555");
      updateInput(getByTestId("email"), "unique_email@test.com");
    });

    await waitForElementToBeRemoved(getByTestId("verifying-email"));

    expect(getByText("Save")).toBeEnabled();
  });

  it("displays an error if No Access is selected and the entered name is taken by another No Access user", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    act(() => {
      updateInput(getByTestId("first-name"), "NoAccess");
      updateInput(getByTestId("last-name"), "User");
    });

    // verify save is disabled while loading users to perform name validation
    expect(getByText("Save")).toBeDisabled();

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    expect(getByTestId("name-helper-text")).toHaveTextContent("The name is already");
    expect(getByText("Save")).toBeDisabled();
  });

  it("doesn't display an error if No Access is selected and the entered name is taken by an Org Admin user", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("No Access"));

    act(() => {
      updateInput(getByTestId("first-name"), "OrgAdmin");
      updateInput(getByTestId("last-name"), "User");
    });

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    expect(getByTestId("name-helper-text")).toHaveTextContent("");
    expect(getByText("Save")).toBeEnabled();
  });

  it("doesn't validate name uniqueness for Org Admin access level", async () => {
    const { getByTestId, getByText } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("first-name"), "NoAccess");
      updateInput(getByTestId("last-name"), "User");
    });

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    expect(getByTestId("name-helper-text")).toHaveTextContent("");
  });

  it("disables fields and buttons while saving and calls onClose once successfully complete", async () => {
    // testing setting access rows doubles the test time, so only test Org Admin
    const onClose = jest.fn();
    const userVars = createUserOpts.vars;
    const { getByTestId, getByText, getByRole, findByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} onClose={onClose} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("first-name"), userVars.firstName);
      updateInput(getByTestId("last-name"), userVars.lastName);
      updateInput(getByTestId("phone"), userVars.phone);
      updateInput(getByTestId("email"), userVars.email);
      updateInput(getByTestId("password"), userVars.password);
    });

    await waitForElementToBeRemoved(getByTestId("verifying-email"));

    fireEvent.click(getByText("Save"));

    expect(getByRole("button", { name: /close/i })).toBeDisabled();
    expect(getInput(getByTestId("access-level"))).toBeDisabled();
    expect(getInput(getByTestId("first-name"))).toBeDisabled();
    expect(getInput(getByTestId("last-name"))).toBeDisabled();
    expect(getInput(getByTestId("phone"))).toBeDisabled();
    expect(getInput(getByTestId("email"))).toBeDisabled();
    expect(getInput(getByTestId("password"))).toBeDisabled();
    expect(getByText("Saving")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("User added");
    expect(onClose).toHaveBeenCalled();
  });

  it("doesn't call onClose and displays alert when save fails", async () => {
    createUserOpts.errors = [new GraphQLError("error")];
    const onClose = jest.fn();
    const userVars = createUserOpts.vars;
    const { getByTestId, getByText, findByTestId } = render(
      <ManageUserDialog userManagement={mockUserManagementCreate} onClose={onClose} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByTestId("manage-user-dialog")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
    fireEvent.click(getByText("Org Admin"));

    act(() => {
      updateInput(getByTestId("first-name"), userVars.firstName);
      updateInput(getByTestId("last-name"), userVars.lastName);
      updateInput(getByTestId("phone"), userVars.phone);
      updateInput(getByTestId("email"), userVars.email);
      updateInput(getByTestId("password"), userVars.password);
    });

    await waitForElementToBeRemoved(getByTestId("verifying-email"));

    fireEvent.click(getByText("Save"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(
      "An unexpected error occurred while saving. Please try again."
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  describe("Edit other user", () => {
    const mockManageUser: UserManagement = {
      type: "update-other-user",
      user: {
        id: "1",
        firstName: "Kim",
        lastName: "White",
        email: "kim.white@test.com",
        phone: "12345",
        accessLevel: OrgAccessLevel.AppSpecific,
        accessList: [
          {
            app: { id: "sras", name: "Slot Reporting" },
            site: { id: "1", name: "Site" },
            role: { id: "admin", name: "Admin" }
          }
        ]
      }
    };

    it("renders fields with provided user data", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      const mockuser = mockManageUser.user;
      expect(getInput(getByTestId("access-level"))).toHaveValue("Application User");
      expect(getInput(getByTestId("first-name"))).toHaveValue(mockuser.firstName);
      expect(getInput(getByTestId("last-name"))).toHaveValue(mockuser.lastName);
      expect(getInput(getByTestId("phone"))).toHaveValue(mockuser.phone);
      expect(getInput(getByTestId("email"))).toHaveValue(mockuser.email);
      expect(getByText("Change password")).toBeInTheDocument();
      expect(getInput(getByTestId("application"))).toHaveValue("Slot Reporting");
      expect(getInput(getByTestId("property"))).toHaveValue("Site 1");
      expect(getInput(getByTestId("role"))).toHaveValue("Admin");
    });

    it("enables save once a change has been made", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getByText("Save")).toBeDisabled();

      act(() => {
        updateInput(getByTestId("first-name"), "John");
      });

      expect(getByText("Save")).toBeEnabled();
    });

    it("renders password field when changing access level from No Access to another access level", async () => {
      const mockNoAccessProps = produce(mockManageUser, (draft) => {
        draft.user.accessLevel = OrgAccessLevel.NoAccess;
        draft.user.accessList = [];
      });
      const { getByTestId, getByText, queryByTestId } = render(
        <ManageUserDialog userManagement={mockNoAccessProps} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(queryByTestId("password")).not.toBeInTheDocument();

      fireEvent.keyDown(getByTestId("access-level"), { key: "ArrowDown" });
      fireEvent.click(getByText("Org Admin"));

      expect(getByTestId("password")).toBeInTheDocument();
    });

    it("only renders new password field if Change password is clicked", async () => {
      const { getByText, getByTestId, queryByTestId } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(queryByTestId("new-password")).not.toBeInTheDocument();

      fireEvent.click(getByText("Change password"));

      expect(getByTestId("new-password")).toBeInTheDocument();
    });

    it("allows Org Admin to change any field", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getInput(getByTestId("access-level"))).toBeEnabled();
      expect(getInput(getByTestId("first-name"))).toBeEnabled();
      expect(getInput(getByTestId("last-name"))).toBeEnabled();
      expect(getInput(getByTestId("phone"))).toBeEnabled();
      expect(getInput(getByTestId("email"))).toBeEnabled();
      expect(getByText("Change password")).toBeEnabled();
      expect(getInput(getByTestId("application"))).toBeEnabled();
      expect(getInput(getByTestId("property"))).toBeEnabled();
      expect(getInput(getByTestId("role"))).toBeEnabled();
    });

    it("only allows application admins to change other users access lists", async () => {
      currentUser = mockAdmin;
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getInput(getByTestId("access-level"))).toBeDisabled();
      expect(getInput(getByTestId("first-name"))).toBeDisabled();
      expect(getInput(getByTestId("last-name"))).toBeDisabled();
      expect(getInput(getByTestId("phone"))).toBeDisabled();
      expect(getInput(getByTestId("email"))).toBeDisabled();
      expect(getByText("Change password")).toBeDisabled();
      expect(getInput(getByTestId("application"))).toBeEnabled();
      expect(getInput(getByTestId("property"))).toBeEnabled();
      expect(getInput(getByTestId("role"))).toBeEnabled();
    });

    it("displays error if a No Access users name is updated to a name that is taken by another No Access user", async () => {
      const mockNoAccessProps = produce(mockManageUser, (draft) => {
        draft.user.accessLevel = OrgAccessLevel.NoAccess;
        draft.user.accessList = [];
      });
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockNoAccessProps} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      act(() => {
        updateInput(getByTestId("first-name"), "NoAccess");
        updateInput(getByTestId("last-name"), "User");
      });

      expect(getByTestId("name-helper-text")).toHaveTextContent("The name is already");
      expect(getByText("Save")).toBeDisabled();
    });

    it("doesn't detect the users own name as taken", async () => {
      const mockNoAccessProps = produce(mockManageUser, (draft) => {
        draft.user.accessLevel = OrgAccessLevel.NoAccess;
        draft.user.accessList = [];
      });
      const { getByTestId } = render(
        <ManageUserDialog userManagement={mockNoAccessProps} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getByTestId("name-helper-text")).toHaveTextContent("");
    });

    it("displays an error if the users email is updated to an email that is taken", async () => {
      const { getByTestId, findByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      act(() => {
        updateInput(getByTestId("email"), "taken_email@test.com");
      });

      await findByText("Email is taken");
    });

    it("doesn't detect the users own email address as taken", async () => {
      const { getByTestId, queryByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      // only child is the input, no helper text
      expect(getByTestId("email").children).toHaveLength(1);
      expect(queryByText("Email is taken")).not.toBeInTheDocument();
    });
  });

  describe("Edit own profile", () => {
    const mockManageUser: UserManagement = {
      type: "update-own-user",
      user: {
        id: "1",
        firstName: "Kim",
        lastName: "White",
        email: "kim.white@test.com",
        phone: "12345",
        accessLevel: OrgAccessLevel.AppSpecific,
        accessList: [
          {
            app: { id: "sras", name: "Slot Reporting" },
            site: { id: "1", name: "Site" },
            role: { id: "admin", name: "Admin" }
          }
        ]
      }
    };

    it("only renders fields the user is allowed to change", async () => {
      const { getByTestId, getByText, queryByTestId } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      const mockuser = mockManageUser.user;
      expect(getInput(getByTestId("first-name"))).toHaveValue(mockuser.firstName);
      expect(getInput(getByTestId("last-name"))).toHaveValue(mockuser.lastName);
      expect(getInput(getByTestId("phone"))).toHaveValue(mockuser.phone);
      expect(getInput(getByTestId("email"))).toHaveValue(mockuser.email);
      expect(getByText("Change password")).toBeInTheDocument();
      expect(queryByTestId("new-password")).not.toBeInTheDocument();
      expect(queryByTestId("password")).not.toBeInTheDocument();
      expect(queryByTestId("access-level")).not.toBeInTheDocument();
      expect(queryByTestId("access-list")).not.toBeInTheDocument();
    });

    it("allows the user to edit all visible fields regardless of permission", async () => {
      currentUser = mockUserManagementViewer;
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getInput(getByTestId("first-name"))).toBeEnabled();
      expect(getInput(getByTestId("last-name"))).toBeEnabled();
      expect(getInput(getByTestId("phone"))).toBeEnabled();
      expect(getInput(getByTestId("email"))).toBeEnabled();
      expect(getByText("Change password")).toBeEnabled();

      fireEvent.click(getByText("Change password"));
      expect(getByTestId("new-password")).toBeEnabled();
    });

    it("renders New Password field if Change password is clicked", async () => {
      const { getByText, getByTestId, queryByTestId } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(queryByTestId("new-password")).not.toBeInTheDocument();

      fireEvent.click(getByText("Change password"));

      expect(getByTestId("new-password")).toBeInTheDocument();
    });

    it("disables save while no changes have been made", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getByText("Save")).toBeDisabled();
    });

    it("enables save when a change has been made", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      expect(getByText("Save")).toBeDisabled();

      act(() => {
        updateInput(getByTestId("first-name"), "John");
      });

      expect(getByText("Save")).toBeEnabled();
    });

    it("keeps save disabled a password is entered by is less than the number of required characters", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      fireEvent.click(getByText("Change password"));
      act(() => {
        updateInput(getByTestId("new-password"), "short");
      });

      expect(getByText("Save")).toBeDisabled();
    });

    it("enables save when a password is entered and is the number of required characters", async () => {
      const { getByTestId, getByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      fireEvent.click(getByText("Change password"));
      act(() => {
        updateInput(getByTestId("new-password"), "password");
      });

      expect(getByText("Save")).toBeEnabled();
    });

    it("doesn't detect the users own email address as taken", async () => {
      const { getByTestId, queryByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      // only child is the input, no helper text
      expect(getByTestId("email").children).toHaveLength(1);
      expect(queryByText("Email is taken")).not.toBeInTheDocument();
    });

    it("displays an error if the users email is updated to an email that is taken", async () => {
      const { getByTestId, findByText } = render(
        <ManageUserDialog userManagement={mockManageUser} />,
        { wrapper }
      );

      await waitFor(() => {
        const dialog = getByTestId("manage-user-dialog");
        expect(dialog).toHaveAttribute("data-loading", "false");
      });

      act(() => {
        updateInput(getByTestId("email"), "taken_email@test.com");
      });

      await findByText("Email is taken");
    });
  });
});
