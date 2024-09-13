import { fireEvent, render } from "@testing-library/react";
import { MockGraphQLProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { SettingsSidenav } from "./settings-sidenav";
import { ThemeProvider } from "../../../theme";
import fetchMock from "jest-fetch-mock";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockViewer
} from "../../testing/mocks";
import { AppId, GaUserFragment } from "generated-graphql";
import { produce } from "immer";
import { Route, Router, Routes } from "react-router-dom";
import { createMemoryHistory, History } from "history";

const singleAppAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [draft.accessList[0]];
  draft.accessList[0].app.id = AppId.Pdr;
});

describe("<SettingsSidenav />", () => {
  let isOnprem = false;
  let currentUser: GaUserFragment = null as any;
  let history: History = null as any;

  beforeEach(() => {
    isOnprem = false;
    currentUser = produce(mockOrgAdmin, (draft) => {
      // host goals and other related `PD` settings
      draft.accessList[0].app.id = AppId.Pdengage;
      // Pdre settings
      draft.accessList[1].app.id = AppId.Pdre;
    });
    fetchMock.doMock(JSON.stringify(null));
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockGraphQLProvider
          mockData={{ isOnprem }}
          mocks={[mockCurrentUserQuery(currentUser)]}
        >
          <ThemeProvider>
            <Router navigator={history} location={history.location}>
              <Routes>
                <Route path={"*"} element={children} />
              </Routes>
            </Router>
          </ThemeProvider>
        </MockGraphQLProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
  });

  it("renders loading skeleton while loading", async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("sidenav-loading")).toBeInTheDocument();
    expect(queryByTestId("mobile-sidenav-loading")).not.toBeInTheDocument();
    await findByTestId("app-sidenav");
  });

  it("renders Personal Info", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Personal Info")).toBeInTheDocument();
  });

  it("navigates to /personal-info if Personal Info is clicked", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Personal Info"));
    expect(history.location.pathname).toEqual("/personal-info");
  });

  it("renders Property Management", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Property Management")).toBeInTheDocument();
  });

  it("navigates to /properties if Property Management is clicked", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Property Management"));
    expect(history.location.pathname).toEqual("/properties");
  });

  it("renders Organization Settings", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Organization Settings")).toBeInTheDocument();
  });

  it("navigates to /organization if Organization Settings is clicked", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Organization Settings"));
    expect(history.location.pathname).toEqual("/organization");
  });

  it("doesn't render Organization Settings if the user doesn't have access to a `PD` application", async () => {
    currentUser = mockOrgAdmin;
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Organization Settings")).not.toBeInTheDocument();
  });

  it("renders Subscription & Payment", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Subscription & Payment")).toBeInTheDocument();
  });

  it("navigates to /subscription if Subscription & Payment is clicked", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Subscription & Payment"));
    expect(history.location.pathname).toEqual("/subscription");
  });

  it("renders Greet Settings for Org Admin with PDEngage access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Greet Settings")).toBeInTheDocument();
  });

  it("renders Greet Settings for PDEngage Admin", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Greet Settings")).toBeInTheDocument();
  });

  it("navigates to /greet if Greet Settings is clicked", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Greet Settings"));
    expect(history.location.pathname).toEqual("/greet");
  });

  it("doesn't render Greet Settings for Org Admin without PDEngage access", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [];
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Greet Settings")).not.toBeInTheDocument();
  });

  it("doesn't render Greet Settings for PDEngage Host Manager", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
      draft.accessList[0].role.id = "custom:host-manager";
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Greet Settings")).not.toBeInTheDocument();
  });

  it("doesn't render Greet Settings for user with non-PDEngage roles", async () => {
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList = draft.accessList.filter(
        (access) => access.app.id !== AppId.Pdengage
      );
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Greet Settings")).not.toBeInTheDocument();
  });

  it("renders Update Managment nav item for onprem", async () => {
    isOnprem = true;
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Update Management")).toBeInTheDocument();
  });

  it("doesn't render Update Management nav item for cloud", async () => {
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Update Management")).not.toBeInTheDocument();
  });

  it("renders Data Connections for Org Admin with app permission supporting Data Connections", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Pdr;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Data Connections")).toBeInTheDocument();
  });

  it("doesn't render Data Connections for Org Admin without app permission supporting Data Connections", async () => {
    currentUser = produce(mockOrgAdmin, (draft) => {
      draft.accessList = [draft.accessList[0]];
      draft.accessList[0].app.id = AppId.Mar;
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Data Connections")).not.toBeInTheDocument();
  });

  it("renders Data Connections nav item for user with PDR permission", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdr;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Data Connections")).toBeInTheDocument();
  });

  it("doesn't render Data Connections if the user doesn't have access to supporting applications", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      const access = draft.accessList[0];
      draft.accessList = [];
      Object.values(AppId)
        .filter((id) => id !== AppId.Pdr)
        .forEach((id) => {
          draft.accessList.push(
            produce(access, (draft) => {
              draft.app.id = id;
            })
          );
        });
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Data Connections")).not.toBeInTheDocument();
  });

  it("renders User management nav item for Viewer", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("User Management")).toBeInTheDocument();
  });

  it("navigates to /user-management if User management is clicked", async () => {
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("User Management"));
    expect(history.location.pathname).toEqual("/user-management");
  });

  it("renders Host Goals for user with PD suite access", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Host Goals")).toBeInTheDocument();
  });

  it("navigates to /host-goals if Host Goals is clicked", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Host Goals"));
    expect(history.location.pathname).toEqual("/host-goals");
  });

  it("doesn't render Host Goals for user without PD suite access", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Sras;
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Host Goals")).not.toBeInTheDocument();
  });

  it("renders Marketing Lists for user with PD suite access", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(getByText("Marketing Lists")).toBeInTheDocument();
  });

  it("navigates to /marketing-lists if Marketing Lists is clicked", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
    });
    const { getByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    fireEvent.click(getByText("Marketing Lists"));
    expect(history.location.pathname).toEqual("/marketing-lists");
  });

  it("doesn't render Marketing Lists for user without PD suite access", async () => {
    currentUser = produce(singleAppAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Sras;
    });
    const { queryByText, findByTestId } = render(
      <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("app-sidenav");
    expect(queryByText("Marketing Lists")).not.toBeInTheDocument();
  });

  describe("Applications", () => {
    it("renders for Org Admin with application access", async () => {
      const { getByText, findByTestId } = render(
        <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(getByText("Applications")).toBeInTheDocument();
    });

    it("renders for Admin with `pdre` access", async () => {
      currentUser = produce(mockAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Pdre;
      });
      const { getByText, findByTestId } = render(
        <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(getByText("Applications")).toBeInTheDocument();
    });

    it("doesn't render for Admin without `pdre` access", async () => {
      currentUser = produce(mockAdmin, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Sras;
      });
      const { queryByText, findByTestId } = render(
        <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(queryByText("Applications")).not.toBeInTheDocument();
    });

    it("renders for Viewer with `pdre` access", async () => {
      currentUser = produce(mockViewer, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Pdre;
      });
      const { getByText, findByTestId } = render(
        <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(getByText("Applications")).toBeInTheDocument();
    });

    it("doesn't render for Viewer without `pdre` access", async () => {
      currentUser = produce(mockViewer, (draft) => {
        draft.accessList = [draft.accessList[0]];
        draft.accessList[0].app.id = AppId.Sras;
      });
      const { queryByText, findByTestId } = render(
        <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(queryByText("Applications")).not.toBeInTheDocument();
    });

    // Sub items of Applications don't need permission validation as that's handled by the previous checks on Applications nav item
    describe("PDRE", () => {
      beforeEach(() => {
        currentUser = produce(mockAdmin, (draft) => {
          draft.accessList = [draft.accessList[0]];
          draft.accessList[0].app.id = "pdre";
        });
      });

      it("renders Player Recommendation Engine", async () => {
        const { getByText, findByTestId } = render(
          <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
          { wrapper }
        );

        await findByTestId("app-sidenav");
        expect(getByText("Player Recommendation Engine")).toBeInTheDocument();
      });

      it("navigates to /pdr if Player Recommendation Engine is clicked", async () => {
        const { getByText, findByTestId } = render(
          <SettingsSidenav isMobile={false} isOpen={false} onClose={() => {}} />,
          { wrapper }
        );

        await findByTestId("app-sidenav");
        fireEvent.click(getByText("Player Recommendation Engine"));
        expect(history.location.pathname).toEqual("/pdre");
      });
    });
  });

  describe("Mobile View", () => {
    it("renders MobileSidenav if `isMobile` and `isOpen` is true", async () => {
      const { getByTestId, findByTestId } = render(
        <SettingsSidenav isMobile isOpen onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(getByTestId("mobile-sidenav-wrapper")).toBeInTheDocument();
    });

    it("hides MobileSidenav if `isOpen` is false", async () => {
      const { queryByTestId, findByTestId } = render(
        <SettingsSidenav isMobile isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      expect(queryByTestId("mobile-sidenav-wrapper")).not.toBeInTheDocument();
    });

    it("runs `onClose` if the background is clicked", async () => {
      const mockOnClose = jest.fn();
      const { findByTestId, getAllByRole } = render(
        <SettingsSidenav isMobile isOpen onClose={mockOnClose} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      fireEvent.click(getAllByRole("presentation")[0].firstChild!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("renders loading skeleton while loading", async () => {
      const { findByTestId, getByTestId, queryByTestId } = render(
        <SettingsSidenav isMobile isOpen onClose={() => {}} />,
        { wrapper }
      );

      expect(getByTestId("mobile-sidenav-loading")).toBeInTheDocument();
      expect(queryByTestId("sidenav-loading")).not.toBeInTheDocument();
      await findByTestId("app-sidenav");
    });

    it("doesn't render loading skeleton if `isOpen` is false", async () => {
      const { findByTestId, queryByTestId } = render(
        <SettingsSidenav isMobile isOpen={false} onClose={() => {}} />,
        { wrapper }
      );

      expect(queryByTestId("mobile-sidenav-loading")).not.toBeInTheDocument();
      await findByTestId("app-sidenav");
    });

    it("runs `onClose` upon clicking a nav item", async () => {
      const mockOnClose = jest.fn();
      const { findByTestId, getByText } = render(
        <SettingsSidenav isMobile isOpen onClose={mockOnClose} />,
        { wrapper }
      );

      await findByTestId("app-sidenav");
      fireEvent.click(getByText("Subscription & Payment"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
