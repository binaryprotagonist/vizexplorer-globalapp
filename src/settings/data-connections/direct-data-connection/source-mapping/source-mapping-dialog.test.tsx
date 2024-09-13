import { InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "../../../../theme";
import { MockedProvider } from "testing/graphql-provider";
import {
  generateDummyDataConnectors,
  generateDummyDataConnectorHostSites,
  generateDummyDataSources,
  mockDataConnectorHostSitesQuery,
  mockDataSourcesUpdate
} from "testing/mocks";
import { cacheConfig } from "../../../../view/graphql";
import { SourceMappingDialog } from "./source-mapping-dialog";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { produce } from "immer";
import { DataSourceFieldsFragment, DataSourceFieldsFragmentDoc } from "generated-graphql";

const mockSources = generateDummyDataSources(4);
const mockConnectors = generateDummyDataConnectors(2);
const mockConnectorsHostSites = mockConnectors.map((connector) =>
  generateDummyDataConnectorHostSites(connector.id)
);

const downArrow = { keyCode: 40 };

describe("<SourceMappingDialog />", () => {
  const cache = new InMemoryCache(cacheConfig);
  let connectorHostSitesErr: string | undefined = undefined;

  beforeEach(() => {
    connectorHostSitesErr = undefined;
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          cache={cache}
          mocks={[
            mockDataSourcesUpdate(),
            ...mockConnectorsHostSites.map((hostSites) =>
              mockDataConnectorHostSitesQuery(hostSites, connectorHostSitesErr)
            )
          ]}
        >
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={[]}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("source-mapping-dialog")).toBeInTheDocument();
  });

  it("runs `onClose` if `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={[]}
        onClose={onClose}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("runs `onClose` if the backdrop is clicked", () => {
    const onClose = jest.fn();
    const { getAllByRole } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={[]}
        onClose={onClose}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByRole("presentation")[0].firstChild!);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders Connector and HostVizId selectors", () => {
    const { getByTestId } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={[]}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("connector-selector")).toBeInTheDocument();
    expect(getByTestId("hostvizsite-selector")).toBeInTheDocument();
  });

  it("renders provided connector options in the Connector Selector", () => {
    const connectors = generateDummyDataConnectors(3);
    const { getByTestId, getByText, getAllByRole } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={connectors}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);

    mockConnectors.forEach((conn) => {
      expect(getByText(conn.name)).toBeInTheDocument();
    });
    // 3 connectors, 1 `Add New Connection`
    expect(getAllByRole("option")).toHaveLength(4);
  });

  it("runs `onConnectorChange` if Connector selection is changed", () => {
    const onConnectorChange = jest.fn();
    const { getByTestId, getByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={onConnectorChange}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getByText(mockConnectors[0].name));
    expect(onConnectorChange).toHaveBeenCalledWith({
      type: "change",
      value: mockConnectors[0]
    });
  });

  it("runs `onConnectorChange` if `Edit` is clicked on a Connector", () => {
    const onConnectorChange = jest.fn();
    const { getByTestId, getAllByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={onConnectorChange}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getAllByText("Edit")[0]);
    expect(onConnectorChange).toHaveBeenCalledWith({
      type: "edit",
      value: mockConnectors[0]
    });
  });

  it("runs `onConnectorChange` if `Add New Connection` is clicked", () => {
    const onConnectorChange = jest.fn();
    const { getByTestId, getByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={mockSources[0]}
        sources={mockSources}
        selectedConnector={null}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={onConnectorChange}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getByText("Add New Connection..."));
    expect(onConnectorChange).toHaveBeenCalledWith({ type: "new" });
  });

  it("renders 'loading' if the source sites are loading", async () => {
    const sources = produce(mockSources, (draft) => {
      draft[1].connector!.id = mockConnectors[0].id;
      draft[1].connectorParams!.siteId = mockConnectorsHostSites[0].hostVizSiteIds![1];
    });
    const { getByTestId } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={sources[0]}
        sources={sources}
        selectedConnector={mockConnectors[0]}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("hostvizsite-selector")).toHaveTextContent("Loading...");
  });

  it("renders unused HV sites available to the selected connector", async () => {
    const sources = produce(mockSources, (draft) => {
      draft[1].connector!.id = mockConnectors[0].id;
      draft[1].connectorParams!.siteId = mockConnectorsHostSites[0].hostVizSiteIds![1];
    });
    const { getByTestId, getByText, queryByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={sources[0]}
        sources={sources}
        selectedConnector={mockConnectors[0]}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });

    fireEvent.keyDown(getByTestId("hostvizsite-selector"), downArrow);

    const hvSiteIds = mockConnectorsHostSites[0].hostVizSiteIds!;
    expect(queryByText(hvSiteIds[1])).not.toBeInTheDocument();
    expect(getByText(hvSiteIds[0])).toBeInTheDocument();
    expect(getByText(hvSiteIds[2])).toBeInTheDocument();
  });

  it("can map a Source to a Connector/HostVizID", async () => {
    const source = produce(generateDummyDataSources(1)[0], (draft) => {
      delete draft.connectorParams;
      delete draft.connector;
    });
    const connector = generateDummyDataConnectors(1)[0];
    const connectorHostSites = generateDummyDataConnectorHostSites(connector.id);
    const cacheId = `${source.__typename}:${source.id}`;
    // write initial source state without connector to cache
    cache.writeFragment({
      id: cacheId,
      fragment: DataSourceFieldsFragmentDoc,
      data: {
        id: source.id,
        app: source.app!,
        site: source.site!
      }
    });
    const { getByTestId, getByText, queryByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={source}
        sources={[source]}
        selectedConnector={connector}
        connectors={[connector]}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });

    // validate initial source state doesn't have a connector
    const preUpdate: DataSourceFieldsFragment = cache.readFragment({
      id: cacheId,
      fragment: DataSourceFieldsFragmentDoc
    })!;
    expect(preUpdate.connector).toEqual(undefined);

    fireEvent.keyDown(getByTestId("connector-selector"), downArrow);
    fireEvent.click(getByText(connector.name));
    fireEvent.keyDown(getByTestId("hostvizsite-selector"), downArrow);
    fireEvent.click(getByText(connectorHostSites.hostVizSiteIds![0]));
    fireEvent.click(getByText("Save"));

    await waitFor(() => {
      const postUpdate: DataSourceFieldsFragment = cache.readFragment({
        id: cacheId,
        fragment: DataSourceFieldsFragmentDoc
      })!;
      expect(postUpdate.connector).toEqual({
        __typename: connector.__typename,
        id: connector.id,
        name: connector.name
      });
    });
  });

  it("renders error message if query fails to retrieve source sites", async () => {
    connectorHostSitesErr = "Some Error";
    const sources = produce(mockSources, (draft) => {
      draft[1].connector!.id = mockConnectors[0].id;
      draft[1].connectorParams!.siteId = mockConnectorsHostSites[0].hostVizSiteIds![1];
    });
    const { getByText, queryByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={sources[0]}
        sources={sources}
        selectedConnector={mockConnectors[0]}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });
    expect(getByText("Failed to retrieve source properties")).toBeInTheDocument();
  });

  it("doesn't render error message if query successfully to retrieves source sites", async () => {
    const sources = produce(mockSources, (draft) => {
      draft[1].connector!.id = mockConnectors[0].id;
      draft[1].connectorParams!.siteId = mockConnectorsHostSites[0].hostVizSiteIds![1];
    });
    const { queryByText } = render(
      <SourceMappingDialog
        open={true}
        selectedSource={sources[0]}
        sources={sources}
        selectedConnector={mockConnectors[0]}
        connectors={mockConnectors}
        onClose={() => {}}
        onConnectorChange={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });
    expect(queryByText("Failed to retrieve source properties")).not.toBeInTheDocument();
  });
});
