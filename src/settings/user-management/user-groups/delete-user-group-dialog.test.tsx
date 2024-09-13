import { ThemeProvider } from "../../../theme";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { AlertProvider } from "view-v2/alert";
import { MockedProvider } from "testing/graphql-provider";
import {
  MockUserGroupDeleteMutationOpts,
  mockUserGroupDeleteMutation
} from "./__mocks__/delete-user-group-dialog";
import { DeleteGroupObj, DeleteUserGroupDialog } from "./delete-user-group-dialog";
import { GraphQLError } from "graphql";

const mockUserGroupToDelete: DeleteGroupObj = {
  __typename: "PdUserGroup",
  id: "1",
  name: "Test Group"
};

describe("<DeleteUserGroupDialog />", () => {
  let deleteOpts: MockUserGroupDeleteMutationOpts;
  const cache = new InMemoryCache();

  beforeEach(() => {
    deleteOpts = {};
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider cache={cache} mocks={[mockUserGroupDeleteMutation(deleteOpts)]}>
          <ThemeProvider>{children}</ThemeProvider>
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("delete-user-group-dialog")).toBeInTheDocument();
  });

  it("displays user group name", () => {
    const { getByTestId } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("delete-user-group-dialog")).toHaveTextContent(
      mockUserGroupToDelete.name
    );
  });

  it("disables `Cancel` and `Delete` buttons while deleting", async () => {
    const { getByText, unmount } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));
    expect(getByText("Cancel")).toBeDisabled();
    expect(getByText("Delete")).toBeDisabled();
    unmount();
  });

  it("runs `onClose` when the dialog header close button is clicked", async () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={onClose}
      />,
      { wrapper }
    );

    fireEvent.click(getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("runs `onClose` when the `Cancel` button is clicked", async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={onClose}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });

  it("displays alert and calls `onDelete` after successfully deleting", async () => {
    const onDelete = jest.fn();
    const { getByText, findByTestId } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={onDelete}
        onClose={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("User group deleted");
    expect(onDelete).toHaveBeenCalled();
  });

  it("displays alert and doesn't call `onDelete` if delete fails", async () => {
    deleteOpts.errors = [new GraphQLError("error")];
    const onDelete = jest.fn();
    const { getByText, findByTestId } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={onDelete}
        onClose={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("An unexpected error occurred while deleting");
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("removes user reference from Cache on delete", async () => {
    const cacheId = `${mockUserGroupToDelete.__typename}:${mockUserGroupToDelete.id}`;
    cache.restore({ [cacheId]: mockUserGroupToDelete });
    const { getByText } = render(
      <DeleteUserGroupDialog
        groupToDelete={mockUserGroupToDelete}
        onDelete={() => {}}
        onClose={() => {}}
      />,
      { wrapper }
    );

    expect(Object.keys(cache.extract())).toContain(cacheId);
    fireEvent.click(getByText("Delete"));

    await waitFor(() => {
      expect(Object.keys(cache.extract())).not.toContain(cacheId);
    });
  });
});
