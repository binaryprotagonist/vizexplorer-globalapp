import { generateDummyApps } from "@vizexplorer/global-ui-core";
import {
  AppId,
  DataSourceFieldsFragment,
  OdrDataSourceKind,
  OdrDataSourcesDocument,
  OdrDataSourcesQuery,
  OdrDataSourceUpdateDocument,
  OdrDataSourceUpdateInput,
  OdrDataSourceUpdateMutation
} from "generated-graphql";
import { generateDummySites } from "./sites-helpers";
import {
  generateDummyDataConnectors,
  generateDummyDataConnectorHostSites
} from "./data-connectors-helpers";

export function mockDataSourcesQuery(sources?: DataSourceFieldsFragment[]) {
  const data: OdrDataSourcesQuery = {
    odrDataSources: sources || generateDummyDataSources()
  };

  return {
    request: {
      query: OdrDataSourcesDocument
    },
    result: {
      data
    }
  };
}

export function mockDataSourcesUpdate(source?: OdrDataSourceUpdateInput) {
  const app = { ...generateDummyApps(1)[0], id: AppId.Pdr };
  const site = generateDummySites(1)[0];
  const connector = generateDummyDataConnectors(1)[0];
  const connectorHostSites = generateDummyDataConnectorHostSites(connector.id);
  const input: OdrDataSourceUpdateInput = {
    kind: OdrDataSourceKind.HostViz,
    appId: app.id,
    siteId: site.id.toString(),
    connectorId: connector.id,
    hostVizSiteId: connectorHostSites.hostVizSiteIds![0],
    ...source
  };

  const data: OdrDataSourceUpdateMutation = {
    __typename: "Mutation",
    odrDataSourceUpdate: {
      __typename: "OdrDataSource",
      id: "1",
      app: { __typename: "Application", id: app.id, name: app.name },
      site,
      connector,
      connectorParams: {
        __typename: "OdrHostVizParams",
        siteId: connectorHostSites.hostVizSiteIds![0]
      }
    }
  };

  return {
    request: {
      query: OdrDataSourceUpdateDocument,
      variables: { input }
    },
    result: {
      data
    }
  };
}

export function generateDummyDataSources(length = 3) {
  // Only PDR currently uses Data Sources
  const apps = generateDummyApps(length).map((app) => ({
    ...app,
    id: AppId.Pdr
  }));
  const sites = generateDummySites(length);
  const connectors = generateDummyDataConnectors(length);

  return Array(length)
    .fill(null)
    .map<DataSourceFieldsFragment>((_, idx) => ({
      __typename: "OdrDataSource",
      id: `${idx + 1}`,
      app: {
        __typename: "Application",
        id: apps[idx].id,
        name: apps[idx].name
      },
      site: sites[idx],
      connector: {
        __typename: "OdrDataConnector",
        id: connectors[idx].id,
        name: connectors[idx].name
      },
      connectorParams: {
        __typename: "OdrHostVizParams",
        siteId: generateDummyDataConnectorHostSites(connectors[idx].id).hostVizSiteIds![0]
      }
    }));
}
