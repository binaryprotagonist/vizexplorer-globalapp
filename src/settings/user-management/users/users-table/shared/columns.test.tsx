import { render } from "@testing-library/react";
import { createUserColumns } from "./columns";
import { ThemeProvider } from "../../../../../theme";
import { OrgAccessLevel } from "generated-graphql";
import { generateDummyUsers } from "testing/mocks";
import { UserManagementUserFragment } from "../../__generated__/users";
import { generateDummyHostCodeList } from "../../__mocks__/users";
import { UserDisplay } from "../../../../../view/user/utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const nameIdx = 0;
const accessIdx = 1;
const userGroupIdx = 2;
const hostCodesIdx = 3;

describe("User Management Columns", () => {
  let mockUser: UserManagementUserFragment = null as any;

  beforeEach(() => {
    mockUser = {
      ...generateDummyUsers(1)[0],
      accessLevel: OrgAccessLevel.AppSpecific,
      accessList: [
        {
          app: { id: "sras", name: "Slot Reports" },
          role: { id: "admin", name: "Prop Manager" },
          site: { id: "1", name: "Site 1" }
        }
      ],
      pdUserGroup: {
        id: "1",
        name: "User Group 1"
      },
      pdHostMappings: generateDummyHostCodeList()
    };
  });

  it("contains expected columns", () => {
    const columns = createUserColumns(null, null);
    expect(columns[nameIdx].title).toEqual("Personal Information");
    expect(columns[accessIdx].title).toEqual("Access");
    expect(columns[userGroupIdx].title).toEqual("User group");
    expect(columns[hostCodesIdx].title).toEqual("Host codes");
  });

  it("can render Name column", () => {
    const columns = createUserColumns(null, null);
    const { getByTestId } = render(columns[nameIdx].render!(mockUser, "row"), {
      wrapper
    });

    expect(getByTestId("user-fullname")).toHaveTextContent(
      `${mockUser.firstName} ${mockUser.lastName}`
    );
  });

  it("can render Access column for `Admin`", () => {
    const columns = createUserColumns(null, null);
    const { getByTestId, queryByTestId } = render(
      <div>{columns[accessIdx].render!(mockUser, "row")}</div>,
      { wrapper }
    );

    expect(getByTestId("access-row")).toHaveTextContent(mockUser.accessList[0].app.name);
    expect(getByTestId("access-row")).toHaveTextContent(mockUser.accessList[0].role.name);
    expect(getByTestId("access-row")).toHaveTextContent(
      `${mockUser.accessList[0].site.name}`
    );
    expect(queryByTestId("user-org-level")).not.toBeInTheDocument();
  });

  it("can render Access column for `OrgAdmin`", () => {
    const columns = createUserColumns(null, null);
    const orgAdmin = { ...mockUser, accessLevel: OrgAccessLevel.OrgAdmin };
    const { getByTestId, queryByTestId } = render(
      <div>{columns[accessIdx].render!(orgAdmin, "row")}</div>,
      { wrapper }
    );

    expect(queryByTestId("access-row")).not.toBeInTheDocument();
    expect(queryByTestId("access-row")).not.toBeInTheDocument();
    expect(queryByTestId("access-row")).not.toBeInTheDocument();
    expect(getByTestId("access-list")).toHaveTextContent(
      UserDisplay.accessLevel(orgAdmin.accessLevel)
    );
  });

  it("can render User group column", () => {
    const columns = createUserColumns(null, null);
    const { getByTestId } = render(columns[userGroupIdx].render!(mockUser, "row"), {
      wrapper
    });

    expect(getByTestId("user-group")).toHaveTextContent(`${mockUser.pdUserGroup?.name}`);
  });

  it("can render Host codes column", () => {
    const columns = createUserColumns(null, null);
    const { getAllByTestId } = render(
      <div>{columns[hostCodesIdx].render!(mockUser, "row")}</div>,
      { wrapper }
    );

    expect(getAllByTestId("host-codes-row")).toHaveLength(2);
  });
});
