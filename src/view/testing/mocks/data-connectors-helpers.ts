import {
  OdrDataConnectorsDocument,
  OdrDataConnectorsQuery,
  OdrDataConnectorCreateDocument,
  OdrDataConnectorCreateInput,
  OdrDataConnectorKind,
  OdrDataConnectorCreateMutation,
  OdrDataConnectorUpdateInput,
  OdrDataConnectorUpdateMutation,
  OdrDataConnectorUpdateDocument,
  DataConnectorFieldsFragment,
  DataConnectorHostSitesFragment,
  OdrDataConnectorHostSitesQuery,
  OdrDataConnectorHostSitesDocument
} from "generated-graphql";

function dataConnectorAsCreateInput(
  conn: DataConnectorFieldsFragment
): OdrDataConnectorCreateInput {
  return {
    name: conn.name,
    kind: OdrDataConnectorKind.Mssql,
    database: conn.params!.database,
    hostname: conn.params!.hostname,
    port: conn.params!.port,
    tlsEnabled: conn.params!.tlsEnabled,
    username: conn.params!.username,
    password: "secret_password",
    dataRefreshTime: {
      hour: conn.dataRefreshTime!.hour,
      minute: conn.dataRefreshTime!.minute,
      timezone: conn.dataRefreshTime!.timezone
    }
  };
}

function dataConnectorAsUpdateInput(
  conn: DataConnectorFieldsFragment
): OdrDataConnectorUpdateInput {
  return {
    id: conn.id,
    ...dataConnectorAsCreateInput(conn)
  };
}

export function mockDataConnectorsQuery(connectors?: DataConnectorFieldsFragment[]) {
  const data: OdrDataConnectorsQuery = {
    odrDataConnectors: connectors || generateDummyDataConnectors(3)
  };

  return {
    request: {
      query: OdrDataConnectorsDocument
    },
    result: {
      data
    }
  };
}

export function mockDataConnectorHostSitesQuery(
  connector?: DataConnectorHostSitesFragment,
  error?: string
) {
  const data: OdrDataConnectorHostSitesQuery = {
    connector: connector || generateDummyDataConnectorHostSites("1")
  };

  return {
    request: {
      query: OdrDataConnectorHostSitesDocument,
      variables: {
        id: data.connector?.id
      }
    },
    result: {
      data
    },
    error: error ? Error(error) : undefined
  };
}

export function mockDataConnectorsCreate(newCon?: Partial<DataConnectorFieldsFragment>) {
  const defaultCon = { ...generateDummyDataConnectors(1)[0], id: "100" };
  const merged = { ...defaultCon, ...newCon };
  const input = dataConnectorAsCreateInput(merged);

  const data: OdrDataConnectorCreateMutation = {
    __typename: "Mutation",
    odrDataConnectorCreate: merged
  };

  return {
    request: {
      query: OdrDataConnectorCreateDocument,
      variables: { input }
    },
    result: { data }
  };
}

export function mockDataConnectorsUpdate(
  updatedCon?: Partial<DataConnectorFieldsFragment>
) {
  const defaultCon = generateDummyDataConnectors(1)[0];
  const merged: DataConnectorFieldsFragment = { ...defaultCon, ...updatedCon };
  const input = dataConnectorAsUpdateInput(merged);
  delete input.password;

  const data: OdrDataConnectorUpdateMutation = {
    __typename: "Mutation",
    odrDataConnectorUpdate: merged
  };

  return {
    request: {
      query: OdrDataConnectorUpdateDocument,
      variables: { input }
    },
    result: { data }
  };
}

export function generateDummyDataConnectors(length = 3): DataConnectorFieldsFragment[] {
  return Array(length)
    .fill(null)
    .map<DataConnectorFieldsFragment>((_, idx) => ({
      __typename: "OdrDataConnector",
      id: `${idx + 1}`,
      name: `Connector ${idx}`,
      params: {
        __typename: "OdrMssqlParams",
        hostname: `host ${idx}`,
        database: `database ${idx}`,
        port: 1234 + idx,
        username: `db user ${idx}`,
        tlsEnabled: true
      },
      dataRefreshTime: {
        __typename: "OdrDataRefreshTime",
        hour: idx + 1,
        minute: idx + 10,
        timezone: "Pacific/Auckland"
      }
    }));
}

export function generateDummyDataConnectorHostSites(
  id: string
): DataConnectorHostSitesFragment {
  return {
    __typename: "OdrDataConnector",
    id,
    hostVizSiteIds: [`hv ${id} 1`, `hv ${id} 2`, `hv ${id} 3`]
  };
}
