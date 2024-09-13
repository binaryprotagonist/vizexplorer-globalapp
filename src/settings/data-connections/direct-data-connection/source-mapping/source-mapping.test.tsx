import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { getInput, updateInput } from "testing/utils";
import { MockedProvider } from "testing/graphql-provider";
import {
  generateDummyDataConnectors,
  generateDummyDataConnectorHostSites,
  generateDummyDataSources,
  mockDataConnectorsCreate,
  mockDataConnectorHostSitesQuery,
  mockDataConnectorsUpdate
} from "testing/mocks";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../../../view/graphql";
import { SourceMapping } from "./source-mapping";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { produce } from "immer";
import { DataConnectorFieldsFragment } from "generated-graphql";

const mockSources = generateDummyDataSources(1);
const mockConnectors = generateDummyDataConnectors(2);
const mockConnectorsHostSites = mockConnectors.map((connector) =>
  generateDummyDataConnectorHostSites(connector.id)
);
const origMatchMedia = window.matchMedia;

const downArrow = { keyCode: 40 };
Element.prototype.scrollTo = () => {};

describe("<SourceMapping />", () => {
  const cache = new InMemoryCache(cacheConfig);
  let newConn: DataConnectorFieldsFragment = null as any;
  let updateConn: DataConnectorFieldsFragment = null as any;

  beforeAll(() => {
    // ensure time picker is rendered in desktop mode.
    window.matchMedia = jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn()
    })) as any;
  });

  beforeEach(() => {
    cache.restore({});
    newConn = { ...generateDummyDataConnectors(1)[0], name: "New Conn 1" };
    updateConn = {
      ...generateDummyDataConnectors(1)[0],
      id: "2",
      name: "Update Conn"
    };
  });

  afterAll(() => {
    window.matchMedia = origMatchMedia;
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <MockedProvider
            cache={cache}
            mocks={[
              mockDataConnectorsCreate(newConn),
              mockDataConnectorsUpdate(updateConn),
              ...mockConnectorsHostSites.map((hs) => mockDataConnectorHostSitesQuery(hs))
            ]}
          >
            {children}
          </MockedProvider>
        </ThemeProvider>
      </LocalizationProvider>
    );
  }

  it("renders SourceMappingDialog on initial load", () => {
    const { getByTestId, queryByTestId } = render(
      <SourceMapping
        source={mockSources[0]}
        sources={mockSources}
        connectors={[]}
        onClose={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("source-mapping-dialog")).toBeInTheDocument();
    expect(getByTestId("source-mapping-dialog")).not.toHaveAttribute("aria-hidden");
    expect(queryByTestId("manage-connector-dialog")).not.toBeInTheDocument();
  });

  it("renders ManageConnectorDialog if `Edit` is clicked on a connector", () => {
    const { getByTestId, getAllByText } = render(
      <SourceMapping
        source={mockSources[0]}
        sources={mockSources}
        connectors={mockConnectors}
        onClose={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getAllByText("Edit")[0]);

    expect(getByTestId("manage-connector-dialog")).toBeInTheDocument();
    expect(getByTestId("source-mapping-dialog")).toHaveAttribute("aria-hidden");
  });

  it("renders ManageConnectorDialog if `Add New Connection` is clicked", () => {
    const { getByTestId, getByText } = render(
      <SourceMapping
        source={mockSources[0]}
        sources={mockSources}
        connectors={mockConnectors}
        onClose={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getByText("Add New Connection..."));

    expect(getByTestId("manage-connector-dialog")).toBeInTheDocument();
    expect(getByTestId("source-mapping-dialog")).toHaveAttribute("aria-hidden");
  });

  it("deselects selected HostVizID if Connector is changed", async () => {
    const { getByTestId, getByText, queryByText } = render(
      <SourceMapping
        source={mockSources[0]}
        sources={mockSources}
        connectors={mockConnectors}
        onClose={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });

    // validate expected HostVizID is selected
    const hostInput = getInput(getByTestId("hostvizsite-selector"));
    await waitFor(() => {
      expect(hostInput).toHaveAttribute(
        "value",
        mockConnectorsHostSites[0].hostVizSiteIds![0]
      );
    });

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getByText(mockConnectors[1].name));

    expect(hostInput).toHaveAttribute("value", "");
  });

  it("updates Connector selection after adding a new connector", async () => {
    // suppress warnings about missing option on creation as `connectors` is empty
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const source = produce(mockSources[0], (draft) => {
      delete draft.connector;
      delete draft.connectorParams;
    });
    const { getByTestId, getByText } = render(
      <SourceMapping
        source={source}
        sources={[source]}
        connectors={[]}
        onClose={() => {}}
      />,
      { wrapper }
    );

    const connectorSelector = getByTestId("connector-selector");
    expect(getInput(connectorSelector)).toHaveAttribute("value", "");

    fireEvent.keyDown(connectorSelector, downArrow);
    fireEvent.click(getByText("Add New Connection..."));

    updateInput(getByTestId("name-input"), newConn.name);
    updateInput(getByTestId("host-input"), newConn.params!.hostname);
    updateInput(getByTestId("port-input"), newConn.params!.port);
    updateInput(getByTestId("database-input"), newConn.params!.database);
    updateInput(getByTestId("username-input"), newConn.params!.username);
    updateInput(getByTestId("password-input"), "secret_password");
    updateInput(
      getByTestId("schedule-input"),
      `${newConn.dataRefreshTime!.hour}:${newConn.dataRefreshTime!.minute} AM`
    );
    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      const connectorSelector2 = getByTestId("connector-selector");
      expect(getInput(connectorSelector2)).toHaveAttribute("value", newConn.name);
    });
  });

  it("updates Connector selection after updating an existing connector", async () => {
    const existingConn = generateDummyDataConnectors(1)[0];
    const { getByTestId, getAllByText, getByText } = render(
      <SourceMapping
        source={mockSources[0]}
        sources={[mockSources[0]]}
        connectors={[existingConn, updateConn]}
        onClose={() => {}}
      />,
      { wrapper }
    );

    const connectorSelector = getByTestId("connector-selector");
    expect(getInput(connectorSelector)).toHaveAttribute("value", existingConn.name);

    fireEvent.keyDown(connectorSelector, downArrow);
    fireEvent.click(getAllByText("Edit")[1]);
    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      const connectorSelector2 = getByTestId("connector-selector");
      expect(getInput(connectorSelector2)).toHaveAttribute("value", updateConn.name);
    });
  });
});
