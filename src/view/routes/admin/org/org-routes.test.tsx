import { act, render, waitFor } from "@testing-library/react";
import { MockAuthProvider, mockDeliveryMethodQuery } from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import { MockedProvider } from "testing/graphql-provider";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../../../theme";
import { orgRoutes } from "./org-routes";
import {
  generateDummyAppSubscriptions,
  mockAppSubscriptionsQuery,
  mockCurrentUserQuery,
  mockOrgAdmin
} from "testing/mocks";
import { AppId, AppSubscriptionFragment, GaUserFragment } from "generated-graphql";
import { produce } from "immer";
import { Environment } from "../../../../settings/subscription";

// mock all Elements of the routes to avoid worrying about their APIs etc
// we only care about the routes and their conditional availability
jest.mock("../../../../settings", () => ({
  ...jest.requireActual("../../../../settings"),
  Properties: () => <div data-testid={"properties"} />,
  Pdre: () => <div data-testid={"pdre"} />,
  ManageLicense: () => <div data-testid={"manage-license"} />,
  UpdateManagement: () => <div data-testid={"update-management"} />,
  OrgSettings: () => <div data-testid={"org-settings"} />,
  DataConnections: () => <div data-testid={"data-connections"} />,
  Greet: () => <div data-testid={"greet-settings"} />,
  UserManagement: () => <div data-testid={"user-management"} />,
  HostGoals: () => <div data-testid={"host-goals"} />,
  HostGoalCreate: () => <div data-testid={"host-goal-create"} />,
  HostGoalEdit: () => <div data-testid={"host-goal-edit"} />
}));
jest.mock("../subscription-routes", () => ({
  AdminSubscriptionRoutes: () => <div data-testid={"subscriptions"} />
}));
jest.mock("../../../../admin", () => ({
  ...jest.requireActual("../../../../admin"),
  AdminDataFeed: () => <div data-testid={"data-feed"} />,
  HeatMapAssociations: () => <div data-testid={"heat-map-associations"} />
}));
jest.mock("../../../../settings/host-goals/program-dashboard", () => ({
  __esModule: true,
  default: () => <div data-testid={"host-goal-program-dashboard"} />
}));
jest.mock("../../../../settings/marketing-lists", () => ({
  __esModule: true,
  default: () => <div data-testid={"marketing-lists"} />
}));
jest.mock(
  "../../../../settings/marketing-lists/manage-marketing-list/marketing-list-create",
  () => ({
    __esModule: true,
    default: () => <div data-testid={"marketing-list-create"} />
  })
);

describe("<OrgRoutes />", () => {
  let appSubscriptions: AppSubscriptionFragment[];
  let currentEnvironment: Environment;
  let currentUser: GaUserFragment;

  beforeEach(() => {
    appSubscriptions = produce(generateDummyAppSubscriptions(5), (draft) => {
      draft[0].id = AppId.Sras;
      draft[1].id = AppId.Sre;
      draft[2].id = AppId.Pdengage;
      draft[3].id = AppId.Floorheatmap;
      draft[4].id = AppId.Pdr;
    });
    currentEnvironment = Environment.CLOUD;
    currentUser = produce(mockOrgAdmin, (draft) => {
      // host goals and other related `PD` settings
      draft.accessList[0].app.id = AppId.Pdengage;
      // Heatmap associations
      draft.accessList[1].app.id = AppId.Floorheatmap;
      // Pdre settings
      draft.accessList[2].app.id = AppId.Pdre;
      // Data connections
      draft.accessList[4].app.id = AppId.Pdr;
    });
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider
            mocks={[
              mockAppSubscriptionsQuery(appSubscriptions),
              mockDeliveryMethodQuery(currentEnvironment === Environment.ONPREM),
              mockCurrentUserQuery(currentUser)
            ]}
          >
            <ThemeProvider>{children}</ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("can access all routes if the conditions are matched", async () => {
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    // initial home redirection (plus wait for APIs so next re-renders are cached)
    await findByTestId("subscriptions");

    await act(async () => router.navigate("/properties"));
    await findByTestId("properties");

    await act(async () => router.navigate("/settings"));
    await findByTestId("org-settings");

    await act(async () => router.navigate("/data-connections"));
    await findByTestId("data-connections");

    await act(async () => router.navigate("/data-feed"));
    await findByTestId("data-feed");

    await act(async () => router.navigate("/data-connections"));
    await findByTestId("data-connections");

    await act(async () => router.navigate("/pdre"));
    await findByTestId("pdre");

    await act(async () => router.navigate("/heat-map-associations"));
    await findByTestId("heat-map-associations");

    await act(async () => router.navigate("/greet"));
    await findByTestId("greet-settings");

    await act(async () => router.navigate("/user-management"));
    await findByTestId("user-management");

    await act(async () => router.navigate("/host-goals"));
    await findByTestId("host-goals");

    await act(async () => router.navigate("/host-goals/sites/1/new"));
    await findByTestId("host-goal-create");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/duplicate"));
    await findByTestId("host-goal-create");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/edit"));
    await findByTestId("host-goal-edit");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/dashboard"));
    await findByTestId("host-goal-program-dashboard");

    await act(async () => router.navigate("/marketing-lists"));
    await findByTestId("marketing-lists");

    await act(async () => router.navigate("/marketing-lists/sites/1/new"));
    await findByTestId("marketing-list-create");
  });

  it("allows access to all routes if currentEnvironment and subscriptionEnvironment are On-Prem", async () => {
    currentEnvironment = Environment.ONPREM;
    appSubscriptions = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    // initial home redirection (plus wait for APIs so next re-renders are cached)
    await findByTestId("subscriptions");

    await act(async () => router.navigate("/properties"));
    await findByTestId("properties");
  });

  it("limits route access when accessing an OnPrem org from cloud", async () => {
    currentEnvironment = Environment.CLOUD;
    appSubscriptions = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    // Try navigate to a route that requires matching environment. Fail and redirect to subscription
    await act(async () => router.navigate("/properties"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("only allows access to subscription page if app subscriptions are invalid", async () => {
    appSubscriptions = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isValid = false;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/properties"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("allows access to `Heat Map Association` if the user has only floorheatmap access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Floorheatmap;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/heat-map-associations"));
    await findByTestId("heat-map-associations");
  });

  it("allows access to `Heat Map Association` if the user has only Ratedguestheatmap access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Ratedguestheatmap;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/heat-map-associations"));
    await findByTestId("heat-map-associations");
  });

  it("doesn't allow access to `Heat Map Associations` if the user doesn't have a valid supporting application access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Sras;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/heat-map-associations"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("allows access to OnPrem only routes from OnPrem", async () => {
    currentEnvironment = Environment.ONPREM;
    appSubscriptions = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/license/manage"));
    await findByTestId("manage-license");

    await act(async () => router.navigate("/update-management"));
    await findByTestId("update-management");
  });

  it("doesn't allow access to OnPrem only routes from Cloud", async () => {
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/license/manage"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });

    await act(async () => router.navigate("/update-management"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Greet Settings if the user doesn't have a PD access", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/greet"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Host Goals if the user doesn't have a PD access", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/host-goals"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Host Goal Create if the org doesn't have a PD app subscription", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/host-goals/sites/1/new"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Host Goal Duplicate if the org doesn't have a PD app subscription", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/duplicate"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Host Goal Edit if the org doesn't have a PD app subscription", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/edit"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Host Goal Program Dashboard if the org doesn't have a PD app subscription", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/host-goals/sites/1/programs/1/dashboard"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Marketing Lists if the user doesn't have a PD access", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/marketing-lists"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });

  it("doesn't allow access to Marketing List Create if the org doesn't have a PD app subscription", async () => {
    currentUser = mockOrgAdmin;
    const router = createMemoryRouter(orgRoutes);
    const { findByTestId } = render(<RouterProvider router={router} />, {
      wrapper
    });

    await findByTestId("subscriptions");

    await act(async () => router.navigate("/marketing-lists/sites/1/new"));
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/subscription");
    });
  });
});
