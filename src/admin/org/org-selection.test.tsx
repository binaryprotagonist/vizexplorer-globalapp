import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  within
} from "@testing-library/react";
import { OrgSelection } from "./org-selection";
import { History, createMemoryHistory } from "history";
import { MockedProvider } from "testing/graphql-provider";
import { ThemeProvider } from "../../theme";
import { Router } from "react-router-dom";
import {
  MockOrgsQueryOpts,
  generateDummyOrgs,
  mockDeliveryMethodQuery,
  mockOrgSearchQuery,
  mockOrgsQuery
} from "./__mocks__/org-selection";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { OrgSummaryFragment } from "./__generated__/org-selection";
import { getInput, updateInput } from "testing/utils";
import { sortArray } from "../../view/utils";
import { AlertProvider } from "view-v2/alert";
import { OrgCreateProps } from "./create";

function MockOrgCreate({ onOrgCreated, onClickAccess, onClose }: OrgCreateProps) {
  return (
    <div data-testid={"org-create"}>
      <button
        data-testid={"on-org-created"}
        onClick={() => onOrgCreated!("999", "New Org")}
      />
      <button
        data-testid={"on-click-access"}
        onClick={() => onClickAccess!("999", "New Org")}
      />
      <button data-testid={"on-close"} onClick={onClose} />
    </div>
  );
}

// org-create is too expensive to test the full flow of org creation to test outcomes
jest.mock("./create", () => ({
  ...jest.requireActual("./create"),
  OrgCreate: MockOrgCreate
}));

describe("<OrgSelection />", () => {
  let history: History = null as any;
  let onPrem: boolean;
  let mockOrgsQueryOpts: MockOrgsQueryOpts[];
  let mockSearchOrgData: OrgSummaryFragment[];

  beforeEach(() => {
    history = createMemoryHistory();
    onPrem = false;
    mockOrgsQueryOpts = [{ orgs: generateDummyOrgs(5) }];
    // sort descending search orgs to ensure order is retained
    mockSearchOrgData = sortArray(generateDummyOrgs(2), false, (org) => org.id);
  });

  function wrapper({ children }: any) {
    return (
      <MockAuthProvider>
        <MockedProvider
          mocks={[
            ...mockOrgsQueryOpts.map(mockOrgsQuery),
            mockDeliveryMethodQuery(onPrem),
            mockOrgSearchQuery({ orgs: mockOrgsQueryOpts[0].orgs }),
            mockOrgSearchQuery({ orgs: mockSearchOrgData, vars: { query: "Search" } })
          ]}
        >
          <AlertProvider>
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                {children}
              </Router>
            </ThemeProvider>
          </AlertProvider>
        </MockedProvider>
      </MockAuthProvider>
    );
  }

  it("renders", async () => {
    const { getAllByTestId, getByTestId } = render(<OrgSelection />, { wrapper });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    expect(getByTestId("org-selection")).toBeInTheDocument();
  });

  it("renders `Organizations` title", async () => {
    const { getAllByTestId, getByText } = render(<OrgSelection />, { wrapper });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    expect(getByText("Organizations")).toBeInTheDocument();
  });

  it("automatically open access dialog box for `OnPrem` Orgs", async () => {
    // differentiate onprem org id so we know we aren't getting false positives
    mockOrgsQueryOpts[0].orgs![0].id = "onprem";
    onPrem = true;
    const { getByTestId } = render(<OrgSelection />, {
      wrapper
    });

    await waitFor(() => {
      expect(getByTestId("access-reason-dialog")).toBeInTheDocument();
    });
  });

  it("opens acess reason dialog if `Access` button is clicked", async () => {
    const { getAllByTestId, getByTestId } = render(<OrgSelection />, {
      wrapper
    });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    fireEvent.click(getAllByTestId("access-org-btn")[0]);

    await waitFor(() => {
      expect(getByTestId("access-reason-dialog")).toBeInTheDocument();
    });
  });

  it("displays Orgs table and lists orgs from query in the table", async () => {
    const { getAllByTestId, getByText } = render(<OrgSelection />, {
      wrapper
    });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    mockOrgsQueryOpts[0].orgs!.forEach((org) => {
      expect(getByText(org!.company!.name)).toBeInTheDocument();
      expect(getByText(org!.company!.email)).toBeInTheDocument();
    });
  });

  it("disables search on initial load", () => {
    const { getByTestId } = render(<OrgSelection />, { wrapper });

    expect(getInput(getByTestId("search"))).toBeDisabled();
  });

  it("doesn't disable search or Add organization button when searching orgs", async () => {
    const { getByTestId, getAllByTestId, findAllByTestId, getByText } = render(
      <OrgSelection />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    updateInput(getByTestId("search"), "Search");
    await findAllByTestId("table-cell-loading");

    expect(getInput(getByTestId("search"))).toBeEnabled();
    expect(getByText("Add organization")).toBeEnabled();
  });

  it("can search and reset search of orgs", async () => {
    const { getByTestId, getAllByTestId } = render(<OrgSelection />, {
      wrapper
    });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    const orgs = mockOrgsQueryOpts[0].orgs!;
    expect(getAllByTestId("table-row")).toHaveLength(orgs.length);

    // verify new orgs are returned on search
    updateInput(getByTestId("search"), "Search");
    await waitFor(() => {
      expect(getAllByTestId("table-row")).toHaveLength(mockSearchOrgData.length);
    });
    const rows = getAllByTestId("table-row");
    expect(rows[0]).toHaveTextContent(mockSearchOrgData[0].company!.name);
    expect(rows[1]).toHaveTextContent(mockSearchOrgData[1].company!.name);

    // verify original org list is returned on search reset
    updateInput(getByTestId("search"), "");
    await waitFor(() => {
      expect(getAllByTestId("table-row")).toHaveLength(orgs.length);
    });
  });

  it("renders `Add organization` button", async () => {
    const { getByText, getAllByTestId } = render(<OrgSelection />, { wrapper });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    expect(getByText("Add organization")).toBeInTheDocument();
  });

  it("hide `Add organization` button for onPrem org", async () => {
    mockOrgsQueryOpts[0].orgs![0].id = "onprem";
    onPrem = true;
    const { queryByText, getAllByTestId } = render(<OrgSelection />, { wrapper });

    await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

    expect(queryByText("Add organization")).not.toBeInTheDocument();
  });

  describe("OrgCreate", () => {
    it("opens Org Create dialog if `Add organization` button is clicked", async () => {
      const { getByTestId, getByText, getAllByTestId } = render(<OrgSelection />, {
        wrapper
      });

      await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

      fireEvent.click(getByText("Add organization"));

      expect(getByTestId("org-create")).toBeInTheDocument();
    });

    it("closes Org Create dialog if onClose is executed", async () => {
      const { getByTestId, getByText, getAllByTestId, queryByTestId } = render(
        <OrgSelection />,
        { wrapper }
      );

      await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

      fireEvent.click(getByText("Add organization"));
      fireEvent.click(within(getByTestId("org-create")).getByTestId("on-close"));

      expect(queryByTestId("org-create")).not.toBeInTheDocument();
    });

    it("runs refetches orgs if onOrgCreated is executed", async () => {
      mockOrgsQueryOpts[0].orgs = generateDummyOrgs(2);
      mockOrgsQueryOpts.push({ orgs: generateDummyOrgs(3) });

      const { getByTestId, getByText, getAllByTestId } = render(<OrgSelection />, {
        wrapper
      });

      await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

      fireEvent.click(getByText("Add organization"));
      fireEvent.click(within(getByTestId("org-create")).getByTestId("on-org-created"));

      await waitFor(() => {
        expect(getAllByTestId("table-row")).toHaveLength(3);
      });
      // verify org create is kept open after org creation
      expect(getByTestId("org-create")).toBeInTheDocument();
    });

    it("opens access dialog if onClickAccess is executed", async () => {
      const { getByTestId, getByText, getAllByTestId, queryByTestId } = render(
        <OrgSelection />,
        { wrapper }
      );

      await waitForElementToBeRemoved(getAllByTestId("table-cell-loading")[0]);

      fireEvent.click(getByText("Add organization"));
      fireEvent.click(within(getByTestId("org-create")).getByTestId("on-click-access"));

      expect(getByTestId("access-reason-dialog")).toBeInTheDocument();
      expect(getByTestId("access-reason-dialog")).toHaveTextContent("New Org");
      expect(queryByTestId("org-create")).not.toBeInTheDocument();
    });
  });
});
