import { fireEvent, render } from "@testing-library/react";
import { DirectDataConnection } from "./direct-data-connection";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import {
  AppId,
  DataConnectorFieldsFragment,
  DataSourceFieldsFragment,
  GaUserFragment
} from "generated-graphql";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import {
  generateDummyDataConnectors,
  generateDummyDataSources,
  mockCurrentUserQuery,
  mockDataConnectorHostSitesQuery,
  mockDataConnectorsQuery,
  mockDataSourcesQuery,
  mockOrgAdmin
} from "testing/mocks";
import { GlobalMockedProvider } from "testing/graphql-provider";
import { ThemeProvider } from "../../../theme";

describe("<DirectDataConnection />", () => {
  let sources: DataSourceFieldsFragment[] = [];
  let connectors: DataConnectorFieldsFragment[] = [];
  let currentUser: GaUserFragment = null as any;
  let history: History = null as any;

  beforeEach(() => {
    sources = generateDummyDataSources(2);
    connectors = generateDummyDataConnectors(1);
    currentUser = { ...mockOrgAdmin };
    history = createMemoryHistory();
    history.push("/settings/data-connections");
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <GlobalMockedProvider
            mocks={[
              mockCurrentUserQuery(currentUser),
              mockDataConnectorsQuery(connectors),
              mockDataSourcesQuery(sources),
              mockDataConnectorHostSitesQuery()
            ]}
          >
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                {children}
              </Router>
            </ThemeProvider>
          </GlobalMockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<DirectDataConnection appId={AppId.Pdr} />, {
      wrapper
    });

    await findByTestId("data-connection-table");
  });

  it("renders Sources and associated Connectors Data Connection table", async () => {
    const { getAllByTestId, findByTestId } = render(
      <DirectDataConnection appId={AppId.Pdr} />,
      { wrapper }
    );

    await findByTestId("data-connection-table");

    // 2 sources, 1 connector. connector is associated with the first source only
    const sourceRows = getAllByTestId("data-connection-row");
    expect(sourceRows[0]).toHaveTextContent(sources[0].site!.name);
    expect(sourceRows[0]).toHaveTextContent(connectors[0].name);

    expect(sourceRows[1]).toHaveTextContent(sources[1].site!.name);
    expect(sourceRows[1]).not.toHaveTextContent(connectors[0].name);
  });

  it("renders `Source Mapping Dialog` if Edit is clicked", async () => {
    const { getByTestId, getAllByText, findByTestId } = render(
      <DirectDataConnection appId={AppId.Pdr} />,
      { wrapper }
    );

    await findByTestId("data-connection-table");

    fireEvent.click(getAllByText("Edit")[0]);
    expect(getByTestId("source-mapping-dialog")).toBeInTheDocument();
  });
});
