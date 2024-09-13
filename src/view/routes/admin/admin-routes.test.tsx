import { render, waitFor } from "@testing-library/react";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router-dom";
import { adminRoutes } from "./admin-routes";
import {
  MockAuthProvider,
  MockRecoilProvider,
  UserDetails
} from "@vizexplorer/global-ui-core";
import { GlobalMockedProvider } from "../../testing";
import { ThemeProvider } from "../../../theme";
import { mockCurrentUserQuery } from "../../testing/mocks";
import { mockCurrentOrgQuery } from "./org/__mocks__/org-route-manager";
import { mockCurrentOrgSummaryQuery } from "testing/mocks/admin";

jest.mock("../shared", () => ({
  ...jest.requireActual("../shared"),
  AppRootRoute: () => (
    <div data-testid={"app-root-route"}>
      <Outlet />
    </div>
  )
}));
jest.mock("../../../settings/subscription", () => ({
  ...jest.requireActual("../../../settings/subscription"),
  Subscription: () => <div data-testid={"subscription"} />
}));
jest.mock("../../../admin/org", () => ({
  ...jest.requireActual("../../../admin/org"),
  OrgSelection: () => <div data-testid={"org-selection"} />
}));

const mockGetUserInfo = jest.fn<UserDetails, any>(() => ({
  id: "1",
  firstName: "Test",
  lastName: "User",
  company: "Test Inc",
  email: "test.user@test.com",
  username: "Test Username"
}));

describe("AdminRoutes", () => {
  let isSignedIn = true;

  beforeEach(() => {
    isSignedIn = true;
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider session={{ isSignedIn, getUserInfo: mockGetUserInfo }}>
          <GlobalMockedProvider
            mocks={[
              mockCurrentUserQuery(),
              mockCurrentOrgQuery(),
              mockCurrentOrgSummaryQuery()
            ]}
          >
            {/* should be global-ui-core theme, but not currently important for tests */}
            <ThemeProvider>{children}</ThemeProvider>
          </GlobalMockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("updates the document title", () => {
    const router = createMemoryRouter(adminRoutes);
    render(<RouterProvider router={router} />, {
      wrapper
    });

    expect(document.title).toEqual("VizExplorer Admin");
  });

  it("directs to login if not logged in", async () => {
    isSignedIn = false;
    const router = createMemoryRouter(adminRoutes, { initialEntries: ["/org"] });
    render(<RouterProvider router={router} />, {
      wrapper
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/login");
    });
  });

  it("redirects to /org from /", () => {
    const router = createMemoryRouter(adminRoutes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />, {
      wrapper
    });

    expect(router.state.location.pathname).toEqual("/org");
  });

  it("navigates to /subscription from /org/:orgId route", async () => {
    const router = createMemoryRouter(adminRoutes, {
      initialEntries: ["/org/1"]
    });
    render(<RouterProvider router={router} />, {
      wrapper
    });

    const expectedLoc = "/org/1/subscription";
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(expectedLoc);
    });
  });
});
