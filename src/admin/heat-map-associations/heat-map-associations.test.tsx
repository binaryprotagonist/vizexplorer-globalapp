import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
  within
} from "@testing-library/react";
import { ThemeProvider } from "../../theme";
import { HeatMapAssociations } from "./heat-map-associations";
import { MockedProvider } from "../../view/testing";
import {
  generateDummyHeatMapInventory,
  generateDummyOrgHeatMaps,
  generateDummySitesMappings,
  mockHeatMapInventoryQuery,
  mockHeatMapInventorySearchQuery,
  mockOrgHeatMapsQuery,
  mockOrgSitesMapping
} from "testing/mocks/admin";
import {
  HeatMapInventoryFragment,
  OrgHeatMapFragment,
  SiteMappingFragment
} from "generated-graphql";
import { filenameFromId } from "./utils";
import { produce } from "immer";

const arrowDown = { keyCode: 40 };

describe("<HeatMapAssociations />", () => {
  let orgSites: SiteMappingFragment[];
  let heatMapInventory: HeatMapInventoryFragment[];
  let inventorySearchRes: HeatMapInventoryFragment[];
  let orgHeatMaps: OrgHeatMapFragment[];

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    orgSites = generateDummySitesMappings(3);
    heatMapInventory = generateDummyHeatMapInventory(3);
    inventorySearchRes = [
      generateDummyHeatMapInventory(1)[0], // associated
      { ...generateDummyHeatMapInventory(1)[0], id: "unassociated" }
    ];
    orgHeatMaps = generateDummyOrgHeatMaps(3);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          mockOrgSitesMapping("1", orgSites),
          mockHeatMapInventoryQuery(
            heatMapInventory,
            orgSites[0].dataFeedMapping!.sourceSiteId!
          ),
          mockHeatMapInventorySearchQuery("inventory-search", inventorySearchRes),
          mockOrgHeatMapsQuery(orgHeatMaps)
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<HeatMapAssociations />, { wrapper });

    expect(getByTestId("heat-map-associations")).toBeInTheDocument();
  });

  it("renders expected content when a property hasn't been selected", async () => {
    const { findByTestId, queryByTestId } = render(<HeatMapAssociations />, {
      wrapper
    });

    await findByTestId("site-dropdown");
    expect(queryByTestId("association-toggle")).not.toBeInTheDocument();
    expect(queryByTestId("all-heat-maps-table")).not.toBeInTheDocument();
  });

  it("renders expected content when a property is selected", async () => {
    const { findByTestId, getByText, getByTestId } = render(<HeatMapAssociations />, {
      wrapper
    });

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    expect(getByTestId("association-toggle")).toBeInTheDocument();
    expect(getByTestId("all-heat-maps-table")).toBeInTheDocument();
  });

  it("renders association heat map table if Associated is clicked", async () => {
    const { getByTestId, findByTestId, getByText, queryByTestId } = render(
      <HeatMapAssociations />,
      { wrapper }
    );

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    const toggle = getByTestId("association-toggle");
    fireEvent.click(within(toggle).getByText("Associated"));

    expect(getByTestId("associated-heat-maps-table")).toBeInTheDocument();
    expect(queryByTestId("all-heat-maps-table")).not.toBeInTheDocument();
  });

  it("renders expected message if there are no files to associate", async () => {
    heatMapInventory = [];
    const { findByTestId, getByText, getByRole } = render(<HeatMapAssociations />, {
      wrapper
    });

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    const tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    expect(getByText("There are no files uploaded yet")).toBeInTheDocument();
  });

  it("renders expected message if no files have been associated", async () => {
    orgHeatMaps = [];
    const { findByTestId, getByText, getByTestId, queryByTestId, getByRole } = render(
      <HeatMapAssociations />,
      { wrapper }
    );

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    const tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    const toggle = getByTestId("association-toggle");
    fireEvent.click(within(toggle).getByText("Associated"));

    expect(queryByTestId("associated-heat-maps-table")).not.toBeInTheDocument();
    expect(
      getByText("There are no files associated for this property yet")
    ).toBeInTheDocument();
  });

  it("only renders heat maps that haven't been associated with the selected property", async () => {
    const { findByTestId, getByText, getAllByTestId, getByRole } = render(
      <HeatMapAssociations />,
      { wrapper }
    );

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    const tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    // 3 properties with 1 heat map associated to each (3 heatmaps total), leaving 2 not associated to this property
    const rows = getAllByTestId("heatmap-row");
    expect(rows).toHaveLength(2);

    // sorted by upload date, in this case the last map is the first row
    const name1 = filenameFromId(heatMapInventory[2].id);
    const name2 = filenameFromId(heatMapInventory[1].id);
    expect(rows[0]).toHaveTextContent(name1);
    expect(rows[1]).toHaveTextContent(name2);
  });

  it("disables site options that don't have a source site id", async () => {
    orgSites = produce(orgSites, (draft) => {
      draft[0].dataFeedMapping!.sourceSiteId = null;
    });
    const { findByTestId, getByText } = render(<HeatMapAssociations />, {
      wrapper
    });

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);

    expect(getByText(orgSites[0].name)).toHaveAttribute("aria-disabled", "true");
    expect(getByText(orgSites[1].name)).toHaveAttribute("aria-disabled", "false");
    expect(getByText(orgSites[2].name)).toHaveAttribute("aria-disabled", "false");
  });

  it("renders searched inventory results when a search is performed", async () => {
    const { findByTestId, getByText, getByRole, getByPlaceholderText, getAllByTestId } =
      render(<HeatMapAssociations />, { wrapper });

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    let tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "inventory-search" } });
      jest.runAllTimers();
    });

    tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    const rows = getAllByTestId("heatmap-row");
    expect(rows).toHaveLength(1);
    // inventorySearchRes[0] is associated and thus filtered out from the results
    expect(rows[0]).toHaveTextContent(filenameFromId(inventorySearchRes[1].id));
  });

  it("displays original inventory results if search is cleared", async () => {
    const { findByTestId, getByText, getByRole, getByPlaceholderText, getAllByTestId } =
      render(<HeatMapAssociations />, { wrapper });

    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    let tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "inventory-search" } });
      jest.runAllTimers();
    });

    tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "" } });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("heatmap-row");
    expect(rows).toHaveLength(2);
  });

  it("retains search results when switching between associated and all", async () => {
    const { findByTestId, getByText, getByRole, getByPlaceholderText, getByTestId } =
      render(<HeatMapAssociations />, { wrapper });

    // initial selection / search inventory
    const propertySwitcher = await findByTestId("site-dropdown");
    fireEvent.keyDown(propertySwitcher, arrowDown);
    fireEvent.click(getByText(orgSites[0].name));

    let tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "inventory-search" } });
      jest.runAllTimers();
    });

    tableLoading = getByRole("progressbar");
    await waitForElementToBeRemoved(tableLoading);

    // switch to associated and search associated
    const toggle = getByTestId("association-toggle");
    fireEvent.click(within(toggle).getByText("Associated"));

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "associated-search" } });
      jest.runAllTimers();
    });

    // switch back to all and verify search is retained
    fireEvent.click(within(toggle).getByText("All files"));
    let search = getByPlaceholderText("Search");
    expect(search).toHaveValue("inventory-search");

    // switch back to associated and verify search is retained
    fireEvent.click(within(toggle).getByText("Associated"));
    search = getByPlaceholderText("Search");
    expect(search).toHaveValue("associated-search");
  });
});
