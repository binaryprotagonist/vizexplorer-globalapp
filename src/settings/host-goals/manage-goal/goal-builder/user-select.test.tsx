import { fireEvent, render, within } from "@testing-library/react";
import { generateDummyUserSelectUsers } from "./__mocks__/user-select";
import { UserSelect } from "./user-select";
import { UserDisplay } from "../../../../view/user/utils";
import { getInput, updateInput } from "testing/utils";

const mockUsers = generateDummyUserSelectUsers();

describe("<UsersSelect />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <UserSelect value={[]} options={mockUsers} onChange={() => {}} />
    );

    expect(getByTestId("user-select")).toBeInTheDocument();
  });

  it("renders expected options", () => {
    const { getByText, getByTestId } = render(
      <UserSelect value={[]} options={mockUsers} onChange={() => {}} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );

    expect(getByText("All users")).toBeInTheDocument();
    expect(getByText("Group 1")).toBeInTheDocument();
    expect(getByText("Group 2")).toBeInTheDocument();
    mockUsers.forEach((user) => {
      expect(getByText(UserDisplay.fullNameV2(user))).toBeInTheDocument();
    });
  });

  it("calls onChange with all values if All users is clicked when not all users are selected", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <UserSelect value={[mockUsers[0]]} options={mockUsers} onChange={onChange} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    const allUsersOption = getAllByRole("option")[0];
    fireEvent.click(allUsersOption);

    // all users checkbox not checked unless `value` prop provides all options
    expect(getInput(allUsersOption)).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith(mockUsers);
  });

  it("calls onChange with an empty array if All users is clicked when all users are selected", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <UserSelect value={mockUsers} options={mockUsers} onChange={onChange} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    const allUsersOption = getAllByRole("option")[0];
    fireEvent.click(allUsersOption);

    expect(getInput(allUsersOption)).toBeChecked();
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("calls onChange with all users within a user group if the group header is clicked when not all users of the group are selected", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText, getAllByTestId } = render(
      <UserSelect
        // include a user not part of the group to ensure that user remains
        value={[mockUsers[0], mockUsers.at(-1)!]}
        options={mockUsers}
        onChange={onChange}
      />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    fireEvent.click(getByText("Group 1"));

    const group1Users = mockUsers.filter((user) => user.pdUserGroup?.name === "Group 1");
    const group1Header = getAllByTestId("group-header-btn")[0];
    expect(getInput(group1Header)).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith([
      group1Users[0],
      mockUsers.at(-1)!,
      ...group1Users.slice(1)
    ]);
  });

  it("calls onChange with group users removed if the group header is clicked when all users of a group are selected", () => {
    const group1Users = mockUsers.filter((user) => user.pdUserGroup?.name === "Group 1");
    const onChange = jest.fn();
    const { getByTestId, getByText, getAllByTestId } = render(
      <UserSelect
        // include a user not part of the group to ensure that user remains
        value={[group1Users[0], mockUsers.at(-1)!, ...group1Users.slice(1)]}
        options={mockUsers}
        onChange={onChange}
      />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    fireEvent.click(getByText("Group 1"));

    const group1Header = getAllByTestId("group-header-btn")[0];
    expect(getInput(group1Header)).toBeChecked();
    expect(onChange).toHaveBeenCalledWith([mockUsers.at(-1)!]);
  });

  it("calls onChange when a user option is selected", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <UserSelect value={[mockUsers[0]]} options={mockUsers} onChange={onChange} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    fireEvent.click(getByText(UserDisplay.fullNameV2(mockUsers[1])));

    expect(onChange).toHaveBeenCalledWith([mockUsers[0], mockUsers[1]]);
  });

  it("calls onChange when a user option is deselected", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <UserSelect value={mockUsers} options={mockUsers} onChange={onChange} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    fireEvent.click(getByText(UserDisplay.fullNameV2(mockUsers[0])));

    expect(onChange).toHaveBeenCalledWith(mockUsers.slice(1));
  });

  it("calls onChange with an empty array if the All users chip delete button is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <UserSelect value={mockUsers} options={mockUsers} onChange={onChange} />
    );

    fireEvent.click(within(getByTestId("value-chip")).getByTestId("delete"));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("calls onChange with the user removed if a user chip delete button is clicked", () => {
    const onChange = jest.fn();
    const { getAllByTestId } = render(
      <UserSelect
        value={[mockUsers[0], mockUsers[1]]}
        options={mockUsers}
        onChange={onChange}
      />
    );

    fireEvent.click(within(getAllByTestId("value-chip")[0]).getByTestId("delete"));

    expect(onChange).toHaveBeenCalledWith([mockUsers[1]]);
  });

  it("only includes matching users and group headers in the search results", () => {
    const { getByTestId, getAllByRole, getByText, queryByText } = render(
      <UserSelect value={[]} options={mockUsers} onChange={() => {}} />
    );

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );
    updateInput(getByTestId("user-select"), mockUsers[0].firstName);

    expect(queryByText("All users")).not.toBeInTheDocument();
    expect(getByText("Group 1")).toBeInTheDocument();
    expect(queryByText("Group 2")).not.toBeInTheDocument();
    expect(getAllByRole("option")[1]).toHaveTextContent(mockUsers[0].firstName);
  });
});
