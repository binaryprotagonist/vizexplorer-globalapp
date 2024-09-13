import { fireEvent, render, within } from "@testing-library/react";
import { UsersSelect } from "./users-select";
import { MappedSelectOption, UnmappedOption, UsersSelectOption } from "./types";
import { getInput, updateInput } from "testing/utils";
import { produce } from "immer";

const mockMappedOptions: MappedSelectOption[] = Array.from({ length: 5 }).map(
  (_, idx) => ({
    userId: `${idx}`,
    name: `John Doe ${idx}`,
    hostCodes: [`Host Code ${idx}`],
    group: "mapped"
  })
);
const mockUnmappedOptions: UnmappedOption[] = Array.from({ length: 5 }).map((_, idx) => ({
  group: "unmapped",
  name: `Jane Dane ${idx}`,
  nativeHost: { siteId: `${idx}`, nativeHostId: `${idx}` }
}));

const mockUserOptions: UsersSelectOption[] = [
  ...mockMappedOptions,
  ...mockUnmappedOptions
];

describe("<UsersSelect />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <UsersSelect value={[]} options={[]} onChange={() => {}} />
    );

    expect(getByTestId("users-select")).toBeInTheDocument();
  });

  it("renders user groups", () => {
    const { getAllByTestId, getByTestId } = render(
      <UsersSelect value={[]} options={mockUserOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });

    const [mapped, unmapped] = getAllByTestId("user-group");
    expect(mapped).toHaveTextContent("Mapped users");
    expect(unmapped).toHaveTextContent("Unmapped host codes");
  });

  it("renders user options", () => {
    // Add additional host codes to verify they are comma separated
    const mappedUsers = produce(mockMappedOptions, (draft) => {
      draft[0].hostCodes = ["Host Code 1", "Host Code 2"];
    });
    const users = [...mappedUsers, ...mockUnmappedOptions];
    const { getByTestId, getAllByRole } = render(
      <UsersSelect value={[]} options={users} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });

    const userOptions = getAllByRole("option");
    expect(userOptions).toHaveLength(users.length);
    expect(userOptions[0]).toHaveTextContent(mappedUsers[0].name);
    expect(userOptions[0]).toHaveTextContent(mappedUsers[0].hostCodes.join(", "));
  });

  it("only displays mapped group if only mapped users are provided", () => {
    const { getAllByTestId, getByTestId } = render(
      <UsersSelect value={[]} options={mockMappedOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });

    const groups = getAllByTestId("user-group");
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveTextContent("Mapped users");
  });

  it("only displays unmapped group if only unmapped users are provided", () => {
    const { getAllByTestId, getByTestId } = render(
      <UsersSelect value={[]} options={mockUnmappedOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });

    const groups = getAllByTestId("user-group");
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveTextContent("Unmapped host codes");
  });

  it("displays selected users", () => {
    const selectedUsers = mockUserOptions.slice(0, 3);
    const { getAllByTestId } = render(
      <UsersSelect value={selectedUsers} options={mockUserOptions} onChange={() => {}} />
    );

    const chips = getAllByTestId("user-chip");
    expect(chips).toHaveLength(selectedUsers.length);
    expect(chips[0]).toHaveTextContent(selectedUsers[0].name);
  });

  it("runs onChange when selecting a user option", () => {
    const onChange = jest.fn();
    const { getAllByRole, getByTestId } = render(
      <UsersSelect value={[]} options={mockUserOptions} onChange={onChange} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith([mockUserOptions[0]]);
  });

  it("runs onChange when clicking user chip delete icon", () => {
    const onChange = jest.fn();
    const selectedUsers = mockUserOptions.slice(0, 3);
    const { getAllByTestId } = render(
      <UsersSelect value={selectedUsers} options={mockUserOptions} onChange={onChange} />
    );

    const chips = getAllByTestId("user-chip");
    fireEvent.click(within(chips[0]).getByTestId("delete"));

    expect(onChange).toHaveBeenCalledWith(selectedUsers.slice(1));
  });

  it("doesn't run onChange when pressing backspace within the select input", () => {
    const onChange = jest.fn();
    const selectedUsers = mockUserOptions.slice(0, 3);
    const { getByTestId } = render(
      <UsersSelect value={selectedUsers} options={mockUserOptions} onChange={() => {}} />
    );

    const selectInput = getInput(getByTestId("users-select"));
    fireEvent.focus(selectInput!);
    fireEvent.keyDown(selectInput!, { key: "Backspace" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("can search users by name", () => {
    const { getByTestId, getAllByRole } = render(
      <UsersSelect value={[]} options={mockUserOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });
    fireEvent.focus(getInput(getByTestId("users-select"))!);
    updateInput(getByTestId("users-select"), mockUserOptions[0].name);

    const userOptions = getAllByRole("option");
    expect(userOptions).toHaveLength(1);
    expect(userOptions[0]).toHaveTextContent(mockUserOptions[0].name);
  });

  it("can search users by host code", async () => {
    const { getByTestId, getAllByRole } = render(
      <UsersSelect value={[]} options={mockUserOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });
    fireEvent.focus(getInput(getByTestId("users-select"))!);
    updateInput(getByTestId("users-select"), mockMappedOptions[0].hostCodes[0]);

    const userOptions = getAllByRole("option");
    expect(userOptions).toHaveLength(1);
    expect(userOptions[0]).toHaveTextContent(mockUserOptions[0].name);
  });

  it("only shows the group header related to the users found during search", () => {
    const { getByTestId, getAllByTestId } = render(
      <UsersSelect value={[]} options={mockUserOptions} onChange={() => {}} />
    );

    fireEvent.keyDown(getByTestId("users-select"), { key: "ArrowDown" });
    fireEvent.focus(getInput(getByTestId("users-select"))!);
    updateInput(getByTestId("users-select"), mockMappedOptions[0].hostCodes[0]);

    const groupHeaders = getAllByTestId("user-group");
    expect(groupHeaders).toHaveLength(1);
    expect(groupHeaders[0]).toHaveTextContent("Mapped users");
  });
});
