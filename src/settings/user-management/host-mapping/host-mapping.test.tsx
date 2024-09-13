import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { MockedProvider, getInput } from "../../../view/testing";
import {
  mockCurrentUserQuery,
  mockOrgAdmin,
  generateDummyPdreAdminAccess,
  generateDummyAccessList,
  generateDummyPdreHostAccess,
  generateDummySites,
  mockAdmin
} from "../../../view/testing/mocks";
import { HostMapping } from "./host-mapping";
import { Router } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import { produce } from "immer";
import { GaUserFragment, OrgAccessLevel } from "generated-graphql";
import {
  generateDummyUserHostMapping,
  mockSitesQuery,
  mockUsersNativeHostMappingQuery
} from "./__mocks__/host-mapping";
import {
  HostMappingSiteFragment,
  HostMappingUsersFragment
} from "./__generated__/host-mapping";

// [0] = OrgAdmin
// [1] = PdreAdmin
// [2] = PdreHost
// [3] = PdreHost for only second site
// [4] = Non-Pdre
// [5] = No Access
const mockDefaultMappings = produce(generateDummyUserHostMapping(6), (draft) => {
  draft[0].accessLevel = OrgAccessLevel.OrgAdmin;
  draft[1].accessList = generateDummyPdreAdminAccess();
  draft[3].accessList = produce(generateDummyPdreHostAccess(1), (draftAccess) => {
    draftAccess[0].site = generateDummySites(2)[1];
  });
  draft[4].accessList = generateDummyAccessList(); // doesn't include PDRE
  draft[4].pdHostMappings = [];
  draft[5].accessLevel = OrgAccessLevel.NoAccess;
  draft[5].accessList = [];
});

describe("<HostMapping />", () => {
  let history: History = null as any;
  let currentUser: GaUserFragment = null as any;
  let mockMappings: HostMappingUsersFragment[];
  let mockSites: HostMappingSiteFragment[];

  beforeEach(() => {
    history = createMemoryHistory();
    currentUser = { ...mockOrgAdmin };
    mockSites = generateDummySites(2);
    mockMappings = mockDefaultMappings;
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          mockSitesQuery(mockSites),
          mockCurrentUserQuery(currentUser),
          mockUsersNativeHostMappingQuery(mockMappings)
        ]}
      >
        <ThemeProvider>
          <Router navigator={history} location={history.location}>
            {children}
          </Router>
        </ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<HostMapping />, { wrapper });

    expect(getByTestId("user-host-mapping")).toBeInTheDocument();
  });

  it("renders host code mapping table", () => {
    const { getByTestId } = render(<HostMapping />, { wrapper });

    expect(getByTestId("host-mapping-table")).toBeInTheDocument();
  });

  it("filters users to those with PD Suite access or No Access for the selected property", async () => {
    const { getAllByTestId, getByTestId, getByText } = render(<HostMapping />, {
      wrapper
    });

    // can't rely on table cell loading state as the cells get remounted when the selected site gets set before other APIs finish
    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    // validate users for first property
    // everyone excluding: [3] access only on second site, [4] no pdre access
    let tableRows = getAllByTestId("table-row");
    expect(tableRows).toHaveLength(mockMappings.length - 2);

    // change to property 2 and validate 1 extra user is now available
    fireEvent.keyDown(getByTestId("site-dropdown"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockSites[1].name));

    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    // everyone excluding: [4] no pdre access
    tableRows = getAllByTestId("table-row");
    expect(tableRows).toHaveLength(mockMappings.length - 1);
  });

  it("sorts site options", async () => {
    mockSites = produce(generateDummySites(3), (draft) => {
      draft[0].name = "Site 2";
      draft[1].name = "Site 0";
      draft[2].name = "Site 1";
    });
    const { getByTestId, getAllByRole } = render(<HostMapping />, {
      wrapper
    });

    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("site-dropdown"), { key: "ArrowDown" });
    const siteOptions = getAllByRole("option");

    expect(siteOptions[0]).toHaveTextContent(mockSites[1].name);
    expect(siteOptions[1]).toHaveTextContent(mockSites[2].name);
    expect(siteOptions[2]).toHaveTextContent(mockSites[0].name);
  });

  it("updates selected site after site selection", async () => {
    const { getByText, getByTestId } = render(<HostMapping />, {
      wrapper
    });

    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("site-dropdown"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockSites[0].name));

    expect(getInput(getByTestId("site-dropdown"))).toHaveValue(mockSites[0].name);
  });

  it("filters property options for AppSpecific role to properties with PD Suite access", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      // only access to second property for PDRE
      draft.accessList = [
        generateDummyAccessList(1)[0],
        generateDummyPdreAdminAccess(2)[1]
      ];
    });
    const { getByTestId, getByText, queryByText } = render(<HostMapping />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    fireEvent.keyDown(getByTestId("site-dropdown"), { key: "ArrowDown" });

    expect(queryByText(mockSites[0].name)).not.toBeInTheDocument();
    expect(getByText(mockSites[1].name)).toBeInTheDocument();
  });

  it("only lists users mappings for the selected site", async () => {
    mockMappings = produce(generateDummyUserHostMapping(1), (draft) => {
      draft[0].pdHostMappings![0].siteId = "1";
      draft[0].pdHostMappings![1].siteId = "0"; // selected site
      draft[0].pdHostMappings![2].siteId = "2";
    });

    const { getByTestId } = render(<HostMapping />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("user-host-mapping")).toHaveAttribute("data-loading", "false");
    });

    const mappings = mockMappings[0].pdHostMappings!;
    expect(getByTestId("host-codes")).toHaveTextContent(mappings[1].nativeHostId);
    expect(getByTestId("host-codes")).not.toHaveTextContent(mappings[0].id);
    expect(getByTestId("host-codes")).not.toHaveTextContent(mappings[2].id);
  });
});
