import { fireEvent, render, within } from "@testing-library/react";
import { AccessList } from "./access-list";
import { AddEmptyAccessRowAction } from "./manage-user-reducer/types";
import { getInput } from "testing/utils";
import { mockOrgAdmin } from "testing/mocks";
import { produce } from "immer";
import {
  mockManageUserPDengageApp,
  mockManageUserSrasApp,
  generateDummyManageUserSites,
  createDummyManageUserAdmin
} from "./__mocks__/manage-user-dialog";

const mockApps = [mockManageUserSrasApp, mockManageUserPDengageApp];
const mockSites = generateDummyManageUserSites(3);
const mockAdmin = createDummyManageUserAdmin(3);

describe("<AccessList />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AccessList accessList={[]} apps={[]} sites={[]} dispatch={() => {}} />
    );

    expect(getByTestId("access-list")).toBeInTheDocument();
  });

  it("renders an access row for each accessList item provided", () => {
    const { getAllByTestId } = render(
      <AccessList
        accessList={[{}, {}, {}]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    expect(getAllByTestId("access-list-row")).toHaveLength(3);
  });

  it("only renders application options the user has access to", () => {
    const srasOnlyAdmin = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter((access) => {
        return access.app!.id === mockManageUserSrasApp.id;
      });
    });
    const { getByTestId, getAllByRole } = render(
      <AccessList
        currentUser={srasOnlyAdmin}
        accessList={[{}]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const appSelect = within(accessRow).getByTestId("application");
    fireEvent.keyDown(appSelect, { key: "ArrowDown" });

    expect(getAllByRole("option")).toHaveLength(1);
    expect(getAllByRole("option")[0]).toHaveTextContent(mockManageUserSrasApp.name);
  });

  it("only renders site options the user has access to", () => {
    const singleSiteAdmin = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter((access) => {
        return access.site!.id === mockSites[0].id;
      });
    });
    const { getByTestId, getAllByRole } = render(
      <AccessList
        currentUser={singleSiteAdmin}
        accessList={[{ app: { id: mockManageUserSrasApp.id } }]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const propertySelect = within(accessRow).getByTestId("property");
    fireEvent.keyDown(propertySelect, { key: "ArrowDown" });

    expect(getAllByRole("option")).toHaveLength(1);
    expect(getAllByRole("option")[0]).toHaveTextContent(mockSites[0].name);
  });

  it("renders expected role options for the selected app and site", () => {
    const { getByTestId, getAllByRole } = render(
      <AccessList
        currentUser={mockAdmin}
        accessList={[
          { app: { id: mockManageUserSrasApp.id }, site: { id: mockSites[0].id } }
        ]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const roleSelect = within(accessRow).getByTestId("role");
    fireEvent.keyDown(roleSelect, { key: "ArrowDown" });

    const srasRoles = mockManageUserSrasApp.roles;
    expect(getAllByRole("option")).toHaveLength(srasRoles.length);
    expect(getAllByRole("option")[0]).toHaveTextContent(srasRoles[0].name);
    expect(getAllByRole("option")[1]).toHaveTextContent(srasRoles[1].name);
  });

  it("disables all fields and buttons if `disabled` is true", () => {
    const { getByTestId } = render(
      <AccessList disabled accessList={[{}]} apps={[]} sites={[]} dispatch={() => {}} />
    );

    const accessRow = getByTestId("access-list-row");
    const appSelect = within(accessRow).getByTestId("application");
    const propertySelect = within(accessRow).getByTestId("property");
    const roleSelect = within(accessRow).getByTestId("role");
    expect(getInput(appSelect)).toBeDisabled();
    expect(getInput(propertySelect)).toBeDisabled();
    expect(getInput(roleSelect)).toBeDisabled();
    expect(within(accessRow).getByTestId("delete")).toBeDisabled();
    expect(getByTestId("add-access-row-btn")).toBeDisabled();
  });

  it("doesn't allow deleting the only access row with no options selected", () => {
    const { getByTestId } = render(
      <AccessList
        currentUser={mockOrgAdmin}
        accessList={[{}]}
        apps={[]}
        sites={[]}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    expect(within(accessRow).getByTestId("delete")).toBeDisabled();
  });

  it("allows deleting the only access row if it has an app selected", () => {
    const { getByTestId } = render(
      <AccessList
        currentUser={mockOrgAdmin}
        accessList={[{ app: { id: mockManageUserSrasApp.id } }]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    expect(within(accessRow).getByTestId("delete")).toBeEnabled();
  });

  it("allows deleting empty access rows if there are more than 1", () => {
    const { getAllByTestId } = render(
      <AccessList
        currentUser={mockOrgAdmin}
        accessList={[{}, {}]}
        apps={[]}
        sites={[]}
        dispatch={() => {}}
      />
    );

    const accessRows = getAllByTestId("access-list-row");
    expect(within(accessRows[0]).getByTestId("delete")).toBeEnabled();
    expect(within(accessRows[1]).getByTestId("delete")).toBeEnabled();
  });

  it("allows editing a row if the user has admin access to the selected app and site", () => {
    const { getByTestId } = render(
      <AccessList
        currentUser={mockAdmin}
        accessList={[
          { app: { id: mockManageUserSrasApp.id }, site: { id: mockSites[0].id } }
        ]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const appSelect = within(accessRow).getByTestId("application");
    const propertySelect = within(accessRow).getByTestId("property");
    const roleSelect = within(accessRow).getByTestId("role");
    expect(getInput(appSelect)).toBeEnabled();
    expect(getInput(propertySelect)).toBeEnabled();
    expect(getInput(roleSelect)).toBeEnabled();
    expect(within(accessRow).getByTestId("delete")).toBeEnabled();
  });

  it("doesn't allow editing a row if the user doesn't have admin permission for the selected app", () => {
    const srasOnlyAdmin = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter((access) => {
        return access.app!.id === mockManageUserSrasApp.id;
      });
    });
    const { getByTestId } = render(
      <AccessList
        currentUser={srasOnlyAdmin}
        accessList={[{ app: { id: mockManageUserPDengageApp.id } }]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const appSelect = within(accessRow).getByTestId("application");
    const propertySelect = within(accessRow).getByTestId("property");
    const roleSelect = within(accessRow).getByTestId("role");
    expect(getInput(appSelect)).toBeDisabled();
    expect(getInput(propertySelect)).toBeDisabled();
    expect(getInput(roleSelect)).toBeDisabled();
    expect(within(accessRow).getByTestId("delete")).toBeDisabled();
  });

  it("doesn't allow editing a row if the user doesn't have admin permission for the selected site", () => {
    const singleSiteAdmin = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter((access) => {
        return access.site!.id === mockSites[0].id;
      });
    });
    const { getByTestId } = render(
      <AccessList
        currentUser={singleSiteAdmin}
        accessList={[
          { app: { id: mockManageUserSrasApp.id }, site: { id: mockSites[1].id } }
        ]}
        apps={mockApps}
        sites={mockSites}
        dispatch={() => {}}
      />
    );

    const accessRow = getByTestId("access-list-row");
    const appSelect = within(accessRow).getByTestId("application");
    const propertySelect = within(accessRow).getByTestId("property");
    const roleSelect = within(accessRow).getByTestId("role");
    expect(getInput(appSelect)).toBeDisabled();
    expect(getInput(propertySelect)).toBeDisabled();
    expect(getInput(roleSelect)).toBeDisabled();
    expect(within(accessRow).getByTestId("delete")).toBeDisabled();
  });

  it("calls dispatch with expected value when add new access row button is clicked", () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <AccessList accessList={[]} apps={[]} sites={[]} dispatch={mockDispatch} />
    );

    fireEvent.click(getByTestId("add-access-row-btn"));

    expect(mockDispatch).toHaveBeenCalledWith<[AddEmptyAccessRowAction]>({
      type: "add-empty-access-row"
    });
  });
});
