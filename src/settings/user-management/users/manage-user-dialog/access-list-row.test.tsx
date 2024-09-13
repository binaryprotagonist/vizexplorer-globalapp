import { fireEvent, render } from "@testing-library/react";
import { AccessListRow } from "./access-list-row";
import {
  ReducerAccess,
  RemoveAccessRowAction,
  UpdateAccessRowAppAction,
  UpdateAccessRowRoleAction,
  UpdateAccessRowSiteAction
} from "./manage-user-reducer/types";
import { getInput } from "testing/utils";
import {
  generateDummyManageUserSites,
  mockManageUserPDengageApp,
  mockManageUserSrasApp
} from "./__mocks__/manage-user-dialog";

const mockSites = generateDummyManageUserSites();
const mockApps = [mockManageUserSrasApp, mockManageUserPDengageApp];
const mockSelected: ReducerAccess = {
  app: { id: mockApps[0].id },
  site: { id: mockSites[0].id },
  role: { id: mockApps[0].roles[0].id }
};

describe("<AccessListRow />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={[]}
        sites={[]}
        roles={[]}
        dispatch={() => {}}
      />
    );

    expect(getByTestId("access-list-row")).toBeInTheDocument();
  });

  it("disables all inputs and delete if `disabled` is true", () => {
    const { getByTestId } = render(
      <AccessListRow
        disabled
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).toBeDisabled();
    expect(getInput(getByTestId("property"))).toBeDisabled();
    expect(getInput(getByTestId("role"))).toBeDisabled();
    expect(getByTestId("delete")).toBeDisabled();
  });

  it("doesn't disable inputs or delete if `disabled` is false", () => {
    const { getByTestId } = render(
      <AccessListRow
        disabled={false}
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).not.toBeDisabled();
    expect(getInput(getByTestId("property"))).not.toBeDisabled();
    expect(getInput(getByTestId("role"))).not.toBeDisabled();
    expect(getByTestId("delete")).not.toBeDisabled();
  });

  it("disables only the delete button if `deletable` is false", () => {
    const { getByTestId } = render(
      <AccessListRow
        deletable={false}
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).not.toBeDisabled();
    expect(getInput(getByTestId("property"))).not.toBeDisabled();
    expect(getInput(getByTestId("role"))).not.toBeDisabled();
    expect(getByTestId("delete")).toBeDisabled();
  });

  it("doesn't disable delete button if `deletable` is true", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getByTestId("delete")).not.toBeDisabled();
  });

  it("fills selects based on provided `selected` value", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).toHaveValue(mockApps[0].name);
    expect(getInput(getByTestId("property"))).toHaveValue(mockSites[0].name);
    expect(getInput(getByTestId("role"))).toHaveValue(mockApps[0].roles[0].name);
  });

  it("doesn't fill selects if `selected` is empty", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).toHaveValue("");
    expect(getInput(getByTestId("property"))).toHaveValue("");
    expect(getInput(getByTestId("role"))).toHaveValue("");
  });

  it("renders inputs with loading placeholder if `loadingOptions` is true", () => {
    const { getByTestId } = render(
      <AccessListRow
        loadingOptions
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    const appInput = getInput(getByTestId("application"));
    const siteInput = getInput(getByTestId("property"));
    const roleInput = getInput(getByTestId("role"));
    expect(appInput).toHaveAttribute("placeholder", "Loading...");
    expect(siteInput).toHaveAttribute("placeholder", "Loading...");
    expect(roleInput).toHaveAttribute("placeholder", "Loading...");
  });

  it("renders inputs with expected placeholders if `loadingOptions` is false and inputs aren't filled", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    const appInput = getInput(getByTestId("application"));
    const siteInput = getInput(getByTestId("property"));
    const roleInput = getInput(getByTestId("role"));
    expect(appInput).toHaveAttribute("placeholder", "Select application");
    expect(siteInput).toHaveAttribute("placeholder", "Select property");
    expect(roleInput).toHaveAttribute("placeholder", "Select role");
  });

  it("doesn't render placeholder if `loadingOptions` is false and inputs are filled", () => {
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={mockSelected}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={() => {}}
      />
    );

    expect(getInput(getByTestId("application"))).not.toHaveAttribute("placeholder");
    expect(getInput(getByTestId("property"))).not.toHaveAttribute("placeholder");
    expect(getInput(getByTestId("role"))).not.toHaveAttribute("placeholder");
  });

  it("calls dispatch with expected value if the application is changed", () => {
    const dispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={dispatch}
      />
    );

    fireEvent.keyDown(getByTestId("application"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockApps[0].name));

    expect(dispatch).toHaveBeenCalledWith<[UpdateAccessRowAppAction]>({
      type: "update-access-row-app",
      payload: { rowIdx: 0, appId: mockApps[0].id }
    });
  });

  it("calls dispatch with expected value if the site is changed", () => {
    const dispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={dispatch}
      />
    );

    fireEvent.keyDown(getByTestId("property"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockSites[0].name));

    expect(dispatch).toHaveBeenCalledWith<[UpdateAccessRowSiteAction]>({
      type: "update-access-row-site",
      payload: { rowIdx: 0, siteId: mockSites[0].id }
    });
  });

  it("calls dispatch with expected value if the role is changed", () => {
    const dispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={dispatch}
      />
    );

    fireEvent.keyDown(getByTestId("role"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockApps[0].roles[0].name));

    expect(dispatch).toHaveBeenCalledWith<[UpdateAccessRowRoleAction]>({
      type: "update-access-row-role",
      payload: { rowIdx: 0, roleId: mockApps[0].roles[0].id }
    });
  });

  it("calls dispatch with expected value if the delete button is clicked", () => {
    const dispatch = jest.fn();
    const { getByTestId } = render(
      <AccessListRow
        rowIdx={0}
        selected={{}}
        applications={mockApps}
        sites={mockSites}
        roles={mockApps[0].roles}
        dispatch={dispatch}
      />
    );

    fireEvent.click(getByTestId("delete"));

    expect(dispatch).toHaveBeenCalledWith<[RemoveAccessRowAction]>({
      type: "remove-access-row",
      payload: { rowIdx: 0 }
    });
  });
});
