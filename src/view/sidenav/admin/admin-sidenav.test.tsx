import {
  MockAuthProvider,
  mockDeliveryMethodQuery,
  MockRecoilProvider
} from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { Route, Router, Routes } from "react-router-dom";
import { AdminSidenav } from "./admin-sidenav";
import { fireEvent, render } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { produce } from "immer";
import { MockedProvider } from "../../testing";
import { AppId, AppSubscriptionFragment, GaUserFragment } from "generated-graphql";
import {
  generateDummyAppSubscriptions,
  mockAppSubscriptionsQuery,
  mockCurrentUserQuery,
  mockOrgAdmin
} from "testing/mocks";
import { Environment } from "../../../settings/subscription";

describe("<AdminSideNav />", () => {
  let history: History = null as any;
  let apps: AppSubscriptionFragment[] = [];
  let currentEnvironment: Environment;
  let currentUser: GaUserFragment;

  beforeEach(() => {
    history = createMemoryHistory();
    apps = produce(generateDummyAppSubscriptions(4), (draft) => {
      draft[0].id = AppId.Pdre;
      draft[1].id = AppId.Floorheatmap;
      draft[2].id = AppId.Pdengage;
      draft[3].id = AppId.Pdr;
    });
    currentEnvironment = Environment.CLOUD;
    currentUser = produce(mockOrgAdmin, (draft) => {
      // host goals and other related `PD` settings
      draft.accessList[0].app.id = AppId.Pdengage;
      // Heatmap associations
      draft.accessList[1].app.id = AppId.Floorheatmap;
      // Pdre settings
      draft.accessList[2].app.id = AppId.Pdre;
      // Data Connections
      draft.accessList[3].app.id = AppId.Pdr;
    });
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockedProvider
            mocks={[
              mockAppSubscriptionsQuery(apps),
              mockDeliveryMethodQuery(currentEnvironment === Environment.ONPREM),
              mockCurrentUserQuery(currentUser)
            ]}
          >
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                <Routes>
                  <Route path={"*"} element={children} />
                </Routes>
              </Router>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
  });

  it("renders loading skeleton while loading", async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("sidenav-loading")).toBeInTheDocument();
    expect(queryByTestId("mobile-sidenav-loading")).not.toBeInTheDocument();
    await findByTestId("admin-sidenav");
  });

  it("renders Property Management", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Property Management")).toBeInTheDocument();
  });

  it("navigates to /properties if Property Management is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Property Management"));
    expect(history.location.pathname).toEqual("/properties");
  });

  it("renders Organization Settings if the user has access to a `PD` app", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Organization Settings")).toBeInTheDocument();
  });

  it("navigates to /settings if Organization Settings is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Organization Settings"));
    expect(history.location.pathname).toEqual("/settings");
  });

  it("doesn't render Organization Settings the user doesn't have access to a `PD` app", async () => {
    currentUser = mockOrgAdmin;
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Organization Settings")).not.toBeInTheDocument();
  });

  it("renders Update Management for OnPrem", async () => {
    currentEnvironment = Environment.ONPREM;
    apps = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Update Management")).toBeInTheDocument();
  });

  it("navigates to /update-management if Update Management is clicked", async () => {
    currentEnvironment = Environment.ONPREM;
    apps = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Update Management"));
    expect(history.location.pathname).toEqual("/update-management");
  });

  it("doesn't render Update Management for Cloud", async () => {
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Update Management")).not.toBeInTheDocument();
  });

  it("renders Subscription & Payment", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Subscription & Payment")).toBeInTheDocument();
  });

  it("navigates to /subscription if Subscription & Payment is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Subscription & Payment"));
    expect(history.location.pathname).toEqual("/subscription");
  });

  it("renders Data Connections if the user has access to `pdr`", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Pdr;
    });
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Data Connections")).toBeInTheDocument();
  });

  it("navigates to /data-connections if Data Connections is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Data Connections"));
    expect(history.location.pathname).toEqual("/data-connections");
  });

  it("doesn't render Data Connections if supported apps aren't available", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Pdrer;
    });
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Data Connections")).not.toBeInTheDocument();
  });

  it("renders only Subscription if all subscriptions are invalid", async () => {
    apps = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isValid = false;
    });
    const { getByText, findByTestId, getAllByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getAllByTestId("nav-item")).toHaveLength(1);
    expect(getByText("Subscription & Payment")).toBeInTheDocument();
  });

  it("renders only Subscription if currentEnvironment doesn't match subscriptionEnvironment", async () => {
    apps = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].subscription!.isOnprem = true;
    });
    const { getByText, findByTestId, getAllByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getAllByTestId("nav-item")).toHaveLength(1);
    expect(getByText("Subscription & Payment")).toBeInTheDocument();
  });

  it("renders Greet Settings if the user has access to `pdengage`", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Greet Settings")).toBeInTheDocument();
  });

  it("navigates to /greet if Greet Settings is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Greet Settings"));
    expect(history.location.pathname).toEqual("/greet");
  });

  it("doesn't render Greet Settings if the user doesn't have access to `pdengage`", async () => {
    currentUser = mockOrgAdmin;
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Greet Settings")).not.toBeInTheDocument();
  });

  it("renders User management nav item", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("User Management")).toBeInTheDocument();
  });

  it("navigates to /user-management if User management is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("User Management"));
    expect(history.location.pathname).toEqual("/user-management");
  });

  it("renders Host Goals if the user has PD Suite admin access", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Host Goals")).toBeInTheDocument();
  });

  it("navigates to /host-goals if Host Goals is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Host Goals"));
    expect(history.location.pathname).toEqual("/host-goals");
  });

  it("doesn't render Host Goals if the user doesn't have PD Suite admin access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Pdrer;
      draft.accessList[0].role.id = "viewer";
    });
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Host Goals")).not.toBeInTheDocument();
  });

  it("renders Marketing Lists if the user has PD Suite admin access", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(getByText("Marketing Lists")).toBeInTheDocument();
  });

  it("navigates to /marketing-lists if Marketing Lists is clicked", async () => {
    const { getByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    fireEvent.click(getByText("Marketing Lists"));
    expect(history.location.pathname).toEqual("/marketing-lists");
  });

  it("doesn't render Marketing Lists if the user doesn't have PD Suite admin access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Pdrer;
      draft.accessList[0].role.id = "viewer";
    });
    const { queryByText, findByTestId } = render(
      <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("admin-sidenav");
    expect(queryByText("Marketing Lists")).not.toBeInTheDocument();
  });

  describe("Applications LayeredNavItem", () => {
    it("renders Layered Nav title", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Applications")).toBeInTheDocument();
    });

    it("renders Player Recommendation Engine if the user has access to `pdre`", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Player Recommendation Engine")).toBeInTheDocument();
    });

    it("navigates to /pdr if Player Recommendation Engine is clicked", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      fireEvent.click(getByText("Player Recommendation Engine"));
      expect(history.location.pathname).toEqual("/pdre");
    });

    it("doesn't render Player Recommendation Engine if the user doesn't have access to `pdre`", async () => {
      currentUser = mockOrgAdmin;
      const { queryByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(queryByText("Player Recommendation Engine")).not.toBeInTheDocument();
    });
  });

  describe("Administration LayeredNavItem", () => {
    it("renders Layered Nav title", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Administration")).toBeInTheDocument();
    });

    it("renders Data Feed", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav
          isMobile={false}
          isOpen={false}
          onClose={() => {}}
          dataAdapterAllowed
        />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Data Feed")).toBeInTheDocument();
    });

    it("navigates to /data-feed if Data Feed is clicked", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav
          isMobile={false}
          isOpen={false}
          onClose={() => {}}
          dataAdapterAllowed
        />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      fireEvent.click(getByText("Data Feed"));
      expect(history.location.pathname).toEqual("/data-feed");
    });

    it("renders Heat Map Associations if the user has access to `floorheatmap`", async () => {
      currentUser = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Floorheatmap;
      });
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Heat Map Associations")).toBeInTheDocument();
    });

    it("renders Heat Map Associations if the user has access to `Ratedguestheatmap`", async () => {
      currentUser = produce(mockOrgAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Ratedguestheatmap;
      });
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByText("Heat Map Associations")).toBeInTheDocument();
    });

    it("doesn't render Heat Map Associations for unsupported applications", async () => {
      currentUser = mockOrgAdmin;
      const { queryByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(queryByText("Heat Map Associations")).not.toBeInTheDocument();
    });

    it("doesn't render Heat Map Associations for On-Premises", async () => {
      currentEnvironment = Environment.ONPREM;
      const { queryByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(queryByText("Heat Map Associations")).not.toBeInTheDocument();
    });

    it("navigates to /heat-map-associations if Heat Map Associations is clicked", async () => {
      const { getByText, findByTestId } = render(
        <AdminSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      fireEvent.click(getByText("Heat Map Associations"));
      expect(history.location.pathname).toEqual("/heat-map-associations");
    });
  });

  describe("Mobile View", () => {
    it("renders MobileSidenav if `isMobile` and `isOpen` is true", async () => {
      const { getByTestId, findByTestId } = render(
        <AdminSidenav isMobile isOpen onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(getByTestId("admin-mobile-sidenav")).toBeInTheDocument();
    });

    it("hides MobileSidenav if `isOpen` is false", async () => {
      const { queryByTestId, findByTestId } = render(
        <AdminSidenav isMobile isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      expect(queryByTestId("admin-mobile-sidenav")).not.toBeInTheDocument();
    });

    it("runs `onClose` if the background is clicked", async () => {
      const mockOnClose = jest.fn();
      const { findByTestId, getAllByRole } = render(
        <AdminSidenav isMobile isOpen onClose={mockOnClose} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      fireEvent.click(getAllByRole("presentation")[0].firstChild!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("renders loading skeleton while loading", async () => {
      const { findByTestId, getByTestId, queryByTestId } = render(
        <AdminSidenav isMobile isOpen onClose={() => {}} />,
        { wrapper }
      );

      expect(getByTestId("mobile-sidenav-loading")).toBeInTheDocument();
      expect(queryByTestId("sidenav-loading")).not.toBeInTheDocument();
      await findByTestId("admin-sidenav");
    });

    it("doesn't render loading skeleton if `isOpen` is false", async () => {
      const { findByTestId, queryByTestId } = render(
        <AdminSidenav isMobile isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      expect(queryByTestId("mobile-sidenav-loading")).not.toBeInTheDocument();
      await findByTestId("admin-sidenav");
    });

    it("runs `onClose` upon clicking a nav item", async () => {
      const mockOnClose = jest.fn();
      const { findByTestId, getByText } = render(
        <AdminSidenav isMobile isOpen onClose={mockOnClose} />,
        { wrapper }
      );

      await findByTestId("admin-sidenav");
      fireEvent.click(getByText("Subscription & Payment"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
