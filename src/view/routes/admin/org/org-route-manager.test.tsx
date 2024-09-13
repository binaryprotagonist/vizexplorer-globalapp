import { render } from "@testing-library/react";
import {
  MockAuthProvider,
  generateDummyOrgApps,
  mockApplicationsQuery,
  mockDeliveryMethodQuery,
  mockOrgAppsQuery
} from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import { MockedProvider } from "testing/graphql-provider";
import { mockCurrentOrgSummaryQuery } from "testing/mocks/admin";
import { OrgRouteManager } from "./org-route-manager";
import { History, createMemoryHistory } from "history";
import { Route, Router, Routes } from "react-router-dom";
import { ThemeProvider } from "../../../../theme";
import { mockCurrentUserQuery } from "testing/mocks";
import { mockCurrentOrgQuery } from "./__mocks__/org-route-manager";

describe("<OrgRouteManager />", () => {
  let history: History;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/1/properties"] });
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider
            mocks={[
              mockDeliveryMethodQuery(),
              mockApplicationsQuery(),
              mockCurrentOrgSummaryQuery(),
              mockCurrentOrgQuery(),
              mockCurrentUserQuery(),
              mockOrgAppsQuery(generateDummyOrgApps(2))
            ]}
          >
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                <Routes>
                  <Route path={"/:orgId/*"} element={<OrgRouteManager />}>
                    <Route path={"*"} element={children} />
                  </Route>
                </Routes>
              </Router>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("provides outlet to render child routes", async () => {
    const { findByTestId } = render(<div data-testid={"org-route-child"} />, {
      wrapper
    });

    await findByTestId("org-route-child");
  });

  it("renders admin container", async () => {
    const { findByTestId } = render(<div data-testid={"org-route-child"} />, {
      wrapper
    });

    await findByTestId("admin-app-container");
  });

  it("renders a loading container while running APIs", async () => {
    const { findByTestId, getByTestId } = render(
      <div data-testid={"org-route-child"} />,
      { wrapper }
    );

    expect(getByTestId("org-routes-loading")).toBeInTheDocument();
    await findByTestId("admin-app-container");
  });
});
