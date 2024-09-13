import { act, fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import {
  generateDummySites,
  generateDummyPdreAdminAccess,
  mockAdmin,
  generateDummyPdreHostAccess
} from "../../../view/testing/mocks";
import { HostMappingTable } from "./host-mapping-table";
import { produce } from "immer";
import { updateInput } from "testing/utils";
import { generateDummyUserHostMapping } from "./__mocks__/host-mapping";

const mockUserMappings = generateDummyUserHostMapping(3);
const mockPdreAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = generateDummyPdreAdminAccess(1);
});

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<HostMappingTable />", () => {
  const mockSite = generateDummySites(1)[0];
  const mockSites = generateDummySites(3);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("host-mapping-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("User")).toBeInTheDocument();
    expect(getByText("Host codes")).toBeInTheDocument();
  });

  it("renders provided host codes information", () => {
    const { getAllByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    const nameRows = getAllByTestId("user-fullname");
    const phoneRows = getAllByTestId("user-phone");
    const emailRows = getAllByTestId("user-email");
    const hostCodesRows = getAllByTestId("host-codes");
    mockUserMappings.forEach((mapping, idx) => {
      // User column
      expect(nameRows[idx]).toHaveTextContent(`${mapping.firstName} ${mapping.lastName}`);
      expect(phoneRows[idx]).toHaveTextContent(mapping.phone);
      expect(emailRows[idx]).toHaveTextContent(mapping.email);
      // Host Codes column
      const expectedCodes = mapping
        .pdHostMappings!.map((host) => host.nativeHostId)
        .join(", ");
      expect(hostCodesRows[idx]).toHaveTextContent(expectedCodes);
    });
  });

  it("renders table data is ascending order of User by default", () => {
    const unorderedMappings = produce(mockUserMappings, (draft) => {
      draft[0].firstName = "Z First Name";
      draft[0].lastName = "Z Last Name";
      draft[1].firstName = "A First Name";
      draft[1].lastName = "A Last Name";
      draft[2].firstName = "B First Name";
      draft[2].lastName = "B Last Name";
    });
    const { getAllByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={unorderedMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    const tableRows = getAllByTestId("user-fullname");

    expect(tableRows[0]).toHaveTextContent(
      `${unorderedMappings[1].firstName} ${unorderedMappings[1].lastName}`
    ); // A
    expect(tableRows[1]).toHaveTextContent(
      `${unorderedMappings[2].firstName} ${unorderedMappings[2].lastName}`
    ); // B
    expect(tableRows[2]).toHaveTextContent(
      `${unorderedMappings[0].firstName} ${unorderedMappings[0].lastName}`
    ); // Z
  });

  it("renders Edit button for each row", () => {
    const { getAllByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("edit-host-mappings")).toHaveLength(mockUserMappings.length);
  });

  it("runs `onClickEdit` if Edit is clicked", () => {
    const onClickEdit = jest.fn();
    const { getAllByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={onClickEdit}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByTestId("edit-host-mappings")[1]);
    expect(onClickEdit.mock.calls[0][0]).toEqual(mockUserMappings[1].id);
    expect(onClickEdit.mock.calls[0][1]).toEqual(mockSites[0].id);
  });

  it("renders table in loading state if `loading` is true", () => {
    const { getAllByTestId } = render(
      <HostMappingTable
        loading
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("table-cell-loading").length).toBeGreaterThan(0);
  });

  it("can sort by User", () => {
    const unorderedMappings = produce(mockUserMappings, (draft) => {
      draft[0].firstName = "Z First Name";
      draft[0].lastName = "Z Last Name";
      draft[1].firstName = "A First Name";
      draft[1].lastName = "A Last Name";
      draft[2].firstName = "B First Name";
      draft[2].lastName = "B Last Name";
    });
    const { getAllByTestId, getByText } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={unorderedMappings}
        site={mockSite}
        siteOptions={mockSites}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    // initial state is asc, sort desc
    fireEvent.click(getByText("User"));

    const nameRows = getAllByTestId("user-fullname");
    expect(nameRows[0]).toHaveTextContent(
      `${unorderedMappings[0].firstName} ${unorderedMappings[0].lastName}`
    ); // Z
    expect(nameRows[1]).toHaveTextContent(
      `${unorderedMappings[2].firstName} ${unorderedMappings[2].lastName}`
    ); // B
    expect(nameRows[2]).toHaveTextContent(
      `${unorderedMappings[1].firstName} ${unorderedMappings[1].lastName}`
    ); // A
  });

  it("can filter by User", () => {
    const { getAllByTestId, getByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    const search = getByTestId("table-search");
    updateInput(search, mockUserMappings[0].firstName);
    act(() => {
      jest.runAllTimers();
    });

    const rows = getAllByTestId("user-fullname");
    expect(rows).toHaveLength(1);
  });

  it("can filter by Host Code", () => {
    const mappings = produce(mockUserMappings, (draft) => {
      draft[0].pdHostMappings![0].nativeHostId = "unique_mapping_id";
    });
    const { getByTestId, getAllByTestId } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={() => {}}
      />,
      { wrapper }
    );

    const search = getByTestId("table-search");
    updateInput(search, mappings[0].pdHostMappings![0].nativeHostId);

    act(() => {
      jest.runAllTimers();
    });

    const rows = getAllByTestId("host-codes");
    expect(rows).toHaveLength(1);
  });

  it("calls `onSiteChange` after changing property", async () => {
    const mockOnSiteChange = jest.fn();
    const { getByTestId, getByText } = render(
      <HostMappingTable
        currentUser={mockPdreAdmin}
        userHostMapping={mockUserMappings}
        site={mockSite}
        siteOptions={mockSites}
        loading={false}
        onClickEdit={() => {}}
        onSiteChange={mockOnSiteChange}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("site-dropdown"), { key: "ArrowDown" });
    fireEvent.click(getByText(mockSites[1].name));

    expect(mockOnSiteChange).toHaveBeenCalledWith(mockSites[1]);
  });

  describe("User Permissions", () => {
    it("allows PDRE Admin to Edit mappings for sites they admin", () => {
      const { getAllByTestId } = render(
        <HostMappingTable
          currentUser={mockPdreAdmin}
          userHostMapping={mockUserMappings}
          site={mockSite}
          siteOptions={mockSites}
          loading={false}
          onClickEdit={() => {}}
          onSiteChange={() => {}}
        />,
        { wrapper }
      );

      const editBtns = getAllByTestId("edit-host-mappings");
      editBtns.forEach((btn) => {
        expect(btn).toBeEnabled();
      });
    });

    it("doesn't allow PDRE Host to Edit mappings", () => {
      const mockPdreHost = produce(mockAdmin, (draft) => {
        draft.accessList = generateDummyPdreHostAccess(1);
      });
      const { getAllByTestId } = render(
        <HostMappingTable
          currentUser={mockPdreHost}
          userHostMapping={mockUserMappings}
          site={mockSite}
          siteOptions={mockSites}
          loading={false}
          onClickEdit={() => {}}
          onSiteChange={() => {}}
        />,
        { wrapper }
      );

      const editBtns = getAllByTestId("edit-host-mappings");
      editBtns.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });
});
