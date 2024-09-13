import { render, waitFor } from "@testing-library/react";
import { appRoutes } from "./app-routes";
import {
  mockApplicationsQuery,
  MockAuthProvider,
  mockDeliveryMethodQuery,
  MockRecoilProvider
} from "@vizexplorer/global-ui-core";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../../theme";
import { GlobalMockedProvider } from "../../testing";
import { mockAdmin, mockCurrentUserQuery, mockOrgAdmin } from "testing/mocks";
import { produce } from "immer";
import { AppId, GaUserFragment } from "generated-graphql";

jest.mock("../../../home", () => ({
  Home: () => <div data-testid={"home"} />
}));
jest.mock("../../../settings", () => ({
  ...jest.requireActual("../../../settings"),
  ManageLicense: () => <div data-testid={"manage-license"} />,
  UserGroups: () => <div data-testid={"user-groups"} />,
  Greet: () => <div data-testid={"greet-settings"} />,
  HostGoals: () => <div data-testid={"host-goals"} />,
  HostGoalCreate: () => <div data-testid={"host-goal-create"} />,
  HostGoalEdit: () => <div data-testid={"host-goal-edit"} />
}));
jest.mock("../shared", () => ({
  ...jest.requireActual("../shared"),
  AppRootRoute: () => (
    <div data-testid={"app-root-route"}>
      <Outlet />
    </div>
  )
}));
jest.mock("../../../settings/host-goals/program-dashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={"host-goal-program-dashboard"} />
}));
jest.mock("../../../settings/marketing-lists", () => ({
  __esModule: true,
  default: () => <div data-testid={"marketing-lists"} />
}));
jest.mock(
  "../../../settings/marketing-lists/manage-marketing-list/marketing-list-create",
  () => ({
    __esModule: true,
    default: () => <div data-testid={"marketing-list-create"} />
  })
);

describe("<AppRoutes />", () => {
  let isOnprem = false;
  let currentUser: GaUserFragment;

  beforeEach(() => {
    isOnprem = false;
    fetchMock.doMock(JSON.stringify(null));
    currentUser = mockOrgAdmin;
    document.title = "VizExplorer Platform";
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <GlobalMockedProvider
            mockData={{ isOnprem }}
            mocks={[
              mockDeliveryMethodQuery(isOnprem),
              mockApplicationsQuery(),
              mockCurrentUserQuery(currentUser)
            ]}
          >
            <ThemeProvider>{children}</ThemeProvider>
          </GlobalMockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("updates document title to 'Account Settings' for routes starting /settings", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/user-groups"]
    });
    render(<RouterProvider router={router} />, {
      wrapper
    });

    expect(document.title).toEqual("Account Settings");
  });

  it("doesn't update document title for home route", () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/"]
    });
    render(<RouterProvider router={router} />, { wrapper });

    expect(document.title).toEqual("VizExplorer Platform");
  });

  it("allows access to Update Managment for onprem", async () => {
    isOnprem = true;
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/update-management"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("update-management");
    expect(router.state.location.pathname).toEqual("/settings/update-management");
  });

  it("doesn't allow access to Update Managment for cloud", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/update-management"]
    });
    render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
  });

  it("allows access to Greet Settings for Org Admins with PDEngage access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/greet"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("greet-settings");
  });

  it("allows access to Greet Settings for PDEngage Admins", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/greet"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("greet-settings");
  });

  it("doesn't allow access to Greet Settings for Org Admins without PDEngage access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [];
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/greet"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("greet-settings")).not.toBeInTheDocument();
  });

  it("doesn't allow access to Greet Settings for PDEngage Host Manager", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
      draft.accessList[0].role.id = "custom:host-manager";
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/greet"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("greet-settings")).not.toBeInTheDocument();
  });

  it("doesn't allow access to Greet Settings for users with non-PDEngage roles", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter(
        (access) => access.app.id !== AppId.Pdengage
      );
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/greet"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("greet-settings")).not.toBeInTheDocument();
  });

  it("allows access to Host Goals for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("host-goals");
  });

  it("doesn't allows access to Host Goals for users with no `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Sras;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("host-goals")).not.toBeInTheDocument();
  });

  it("allows access to Host Goal Create for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/new"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("host-goal-create");
  });

  it("doesn't allows access to Host Goal Create for users with no `PD` access", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/new"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("host-goals-create")).not.toBeInTheDocument();
  });

  it("allows access to Host Goal Duplicate for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/programs/1/duplicate"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("host-goal-create");
  });

  it("doesn't allows access to Host Goal Duplicate for users with no `PD` access", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/duplicate"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("host-goals-create")).not.toBeInTheDocument();
  });

  it("allows access to Host Goal Edit for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/programs/1/edit"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("host-goal-edit");
  });

  it("doesn't allows access to Host Goal Edit for users with no `PD` access", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/programs/1/edit"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("host-goals-edit")).not.toBeInTheDocument();
  });

  it("allows access to Host Access to Host Goal Program Dashboard for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/programs/1/dashboard"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("host-goal-program-dashboard");
  });

  it("doesn't allows access to Host Goal Program Dashboard for users with no `PD` access", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/host-goals/sites/1/programs/1/dashboard"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("host-goals-program-dashboard")).not.toBeInTheDocument();
  });

  it("allows access to Marketing Lists for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/marketing-lists"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("marketing-lists");
  });

  it("doesn't allows access to Marketing Lists for users with no `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Sras;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/marketing-lists"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("marketing-lists")).not.toBeInTheDocument();
  });

  it("allows access to Marketing List Create for users with `PD` access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/marketing-lists/sites/1/new"]
    });
    const { findByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await findByTestId("marketing-list-create");
  });

  it("doesn't allows access to Marketing Lists Create for users with no `PD` access", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings/marketing-lists/sites/1/new"]
    });
    const { queryByTestId } = render(<RouterProvider router={router} />, { wrapper });

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
    expect(queryByTestId("marketing-list-create")).not.toBeInTheDocument();
  });
});
