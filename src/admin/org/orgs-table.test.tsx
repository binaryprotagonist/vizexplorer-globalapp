import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../theme";
import { OrgsTable } from "./orgs-table";
import { produce } from "immer";
import { generateDummyOrgs } from "./__mocks__/org-selection";
import { OrgSummaryFragment } from "./__generated__/org-selection";
import { getInput, updateInput } from "testing/utils";
import { ActionEvt } from "./types";

describe("<OrgsTable />", () => {
  let mockOrgs: OrgSummaryFragment[];

  beforeEach(() => {
    mockOrgs = generateDummyOrgs();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", async () => {
    const { getByTestId } = render(
      <OrgsTable
        orgs={[]}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("org-table")).toBeInTheDocument();
  });

  it("renders table in loading state if `loading` is true", () => {
    const { getAllByTestId } = render(
      <OrgsTable
        orgs={[]}
        loading={true}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
  });

  it("renders `Add organization` button", () => {
    const { getByText } = render(
      <OrgsTable
        orgs={[]}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
        showAddOrganization
      />,
      { wrapper }
    );

    expect(getByText("Add organization")).toBeInTheDocument();
  });

  it("doesn't disable `Add organization` button if loading is true", () => {
    const { getByText } = render(
      <OrgsTable
        loading
        orgs={[]}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Add organization")).not.toBeDisabled();
  });

  it("disables `Add organization` button if disabled is true", () => {
    const { getByText } = render(
      <OrgsTable
        disabled
        orgs={[]}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Add organization")).toBeDisabled();
  });

  it("calls `onActionClick` if `Add organizaion` is clicked", () => {
    const mockOnActionClick = jest.fn();
    const { getByText } = render(
      <OrgsTable
        orgs={[]}
        loading={false}
        searchText={""}
        onActionClick={mockOnActionClick}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Add organization"));

    expect(mockOnActionClick).toHaveBeenCalledWith<[ActionEvt]>({
      type: "new"
    });
  });

  it("renders `Org Table` information", () => {
    const { getAllByTestId } = render(
      <OrgsTable
        orgs={mockOrgs}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    const companyNameRows = getAllByTestId("company-name");
    const companyEmailRows = getAllByTestId("company-email");

    expect(companyNameRows[0]).toHaveTextContent(mockOrgs[0].company!.name);
    expect(companyEmailRows[0]).toHaveTextContent(mockOrgs[0].company!.email);
  });

  it("renders actions", () => {
    const { getAllByTestId } = render(
      <OrgsTable
        orgs={mockOrgs}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("access-org-btn")).toHaveLength(mockOrgs.length);
  });

  it("calls `onActionClick` when Access button is clicked", () => {
    const onActionClickMock = jest.fn();
    const { getAllByTestId } = render(
      <OrgsTable
        orgs={mockOrgs}
        loading={false}
        searchText={""}
        onActionClick={onActionClickMock}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByTestId("access-org-btn")[0]);
    expect(onActionClickMock).toHaveBeenCalledWith<[ActionEvt]>({
      type: "access",
      value: { orgId: mockOrgs[0].id, orgName: mockOrgs[0].company!.name }
    });
  });

  it("disables search if `disabled` is true", () => {
    const { getByTestId } = render(
      <OrgsTable
        disabled
        orgs={mockOrgs}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("search"))).toBeDisabled();
  });

  it("doesn't disable search if `loading` is true", () => {
    const { getByTestId } = render(
      <OrgsTable
        loading
        orgs={mockOrgs}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("search"))).toBeEnabled();
  });

  it("can sort by Org Name From Organization Name", () => {
    const orgs = produce(mockOrgs, (draft) => {
      draft[2].company!.name = "Company C";
      draft[0].company!.name = "Company A";
      draft[1].company!.name = "Company B";
    });
    const { getByText, getAllByTestId } = render(
      <OrgsTable
        orgs={orgs}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Organization name"));
    const rows = getAllByTestId("company-name");

    expect(rows[0]).toHaveTextContent("Company A");
    expect(rows[1]).toHaveTextContent("Company B");
    expect(rows[2]).toHaveTextContent("Company C");
  });

  it("fills search input with provided `searchText` value", () => {
    const { getByTestId } = render(
      <OrgsTable
        orgs={mockOrgs}
        loading={false}
        searchText={"Test Search"}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("search"))).toHaveValue("Test Search");
  });

  it("calls `onSearchChange` when search is changed", () => {
    const mockOnSearchChange = jest.fn();
    const { getByTestId } = render(
      <OrgsTable
        orgs={mockOrgs}
        loading={false}
        searchText={""}
        onActionClick={() => {}}
        onSearchChange={mockOnSearchChange}
      />,
      { wrapper }
    );

    updateInput(getByTestId("search"), "Test Search");
    expect(mockOnSearchChange).toHaveBeenCalledWith("Test Search");
  });

  it("hide `Add organization` button for onPrem org", () => {
    const { queryByText } = render(
      <OrgsTable
        orgs={[]}
        loading={false}
        searchText={""}
        showAddOrganization={false}
        onActionClick={() => {}}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(queryByText("Add organization")).not.toBeInTheDocument();
  });
});
