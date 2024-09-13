import { render } from "@testing-library/react";
import { AdminContainer } from "./admin-container";
import { MockedProvider } from "../../testing";
import { RecoilRoot } from "recoil";
import {
  generateDummyOrgSummaries,
  mockCurrentOrgSummaryQuery
} from "../../testing/mocks/admin";
import { createMemoryHistory, History } from "history";
import { Route, Router, Routes } from "react-router-dom";
import { OrgSummaryFragment } from "generated-graphql";
import {
  generateDummyOrgApps,
  MockAuthProvider,
  mockDeliveryMethodQuery,
  mockOrgAppsQuery,
  mockVersionsQuery,
  UserDetails
} from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { mockAppSubscriptionsQuery, mockCurrentUserQuery } from "testing/mocks";

jest.mock("../../../utils", () => ({
  isAdminBuild: jest.fn(() => true)
}));

const mockGetUserInfo = jest.fn<UserDetails, any>(() => ({
  id: "1",
  firstName: "Test",
  lastName: "User",
  company: "Test Inc",
  email: "test.user@test.com",
  username: "Test Username"
}));
const mockOrg = generateDummyOrgSummaries(1)[0];

describe("<AdminContainer />", () => {
  let currentOrg: OrgSummaryFragment = null as any;
  let history: History = null as any;
  let isOnprem = false;

  beforeEach(() => {
    currentOrg = generateDummyOrgSummaries()[0];
    history = createMemoryHistory({ initialEntries: ["/org/1"] });
    isOnprem = false;
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider session={{ getUserInfo: mockGetUserInfo }}>
          <MockedProvider
            mocks={[
              mockCurrentOrgSummaryQuery(currentOrg),
              mockAppSubscriptionsQuery(),
              mockDeliveryMethodQuery(isOnprem),
              mockOrgAppsQuery(generateDummyOrgApps(2)),
              mockVersionsQuery(),
              mockCurrentUserQuery()
            ]}
          >
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                <Routes>
                  <Route path={"/org/*"}>
                    <Route path={":orgId/*"} element={children}></Route>
                  </Route>
                </Routes>
              </Router>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-app-container");
  });

  it("renders children", async () => {
    const { getByTestId, findByTestId } = render(
      <AdminContainer>
        <span data-testid={"container-child"} />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-app-container");
    expect(getByTestId("container-child")).toBeInTheDocument();
  });

  it("renders AdminHeader", async () => {
    const { getByTestId, findByTestId } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-app-container");
    expect(getByTestId("admin-header")).toBeInTheDocument();
  });

  it("renders AdminAvatar", async () => {
    const { getByTestId, findByTestId } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-app-container");
    expect(getByTestId("admin-avatar")).toBeInTheDocument();
  });

  it("renders AdminSideNav", async () => {
    const { findByTestId } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
  });

  it("renders Org Name", async () => {
    const { findByText } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByText(mockOrg.company!.name!);
  });

  it("renders `Change` link for Cloud environment", async () => {
    const { findByText } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByText("Change");
  });

  it("doesn't render `Change` link for On-Premises environment", async () => {
    isOnprem = true;
    const { queryByText, findByText } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByText(mockOrg.company!.name!);
    expect(queryByText("Change")).not.toBeInTheDocument();
  });

  it("renders footer", async () => {
    const { getByTestId, findByTestId } = render(
      <AdminContainer>
        <span />
      </AdminContainer>,
      { wrapper }
    );

    await findByTestId("admin-app-container");
    expect(getByTestId("global-footer")).toBeInTheDocument();
  });
});
