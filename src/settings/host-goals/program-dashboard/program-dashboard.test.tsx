import { fireEvent, render, waitFor } from "@testing-library/react";
import { default as ProgramDashboard } from "./program-dashboard";
import { Route, Router, Routes } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import {
  MockDashboardGoalProgramsQueryOpts,
  mockDashboardGoalProgramsQuery,
  mockDashboardProgram
} from "./__mocks__/program-dashboard";
import { MockedProvider } from "testing/graphql-provider";
import { mockAdmin, mockCurrentUserQuery, mockPDEngageAdminAccess } from "testing/mocks";
import { GaUserFragment } from "generated-graphql";
import { produce } from "immer";
import { AlertProvider } from "view-v2/alert";
import {
  MockDashboardResetMutationOpts,
  mockDashboardResetMutation,
  mockSiteQuery
} from "view-v2/sisense/__mocks__/sisense-dashboard-context";
import { SisenseContext } from "view-v2/sisense";
import { mockSisenseCtx } from "view-v2/sisense/__mocks__/sisense";

const mockPDEngageAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});

describe("<ProgramDashboard />", () => {
  let history: History;
  let currentUser: GaUserFragment;
  let programsQueryOpts: MockDashboardGoalProgramsQueryOpts;
  let teamResetDashboardOpts: MockDashboardResetMutationOpts;
  let individualResetDashboardOpts: MockDashboardResetMutationOpts;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/settings/host-goals/sites/0/programs/0/dashboard"]
    });
    currentUser = mockPDEngageAdmin;
    programsQueryOpts = { program: mockDashboardProgram };
    teamResetDashboardOpts = {
      dashboard: { __typename: "OdrDashboard", id: "0", filtersBySite: [] },
      vars: { id: "0" }
    };
    individualResetDashboardOpts = {
      dashboard: { __typename: "OdrDashboard", id: "1", filtersBySite: [] },
      vars: { id: "1" }
    };
  });

  function wrapper({ children }: any) {
    return (
      <SisenseContext.Provider value={mockSisenseCtx}>
        <AlertProvider>
          <MockedProvider
            mocks={[
              mockCurrentUserQuery(currentUser),
              mockDashboardGoalProgramsQuery(programsQueryOpts),
              mockSiteQuery(),
              mockDashboardResetMutation(teamResetDashboardOpts),
              mockDashboardResetMutation(individualResetDashboardOpts)
            ]}
          >
            <Router navigator={history} location={history.location}>
              <Routes>
                <Route path={"/settings/host-goals/*"}>
                  <Route
                    path={"sites/:siteId/programs/:programId/dashboard"}
                    element={children}
                  />
                </Route>
              </Routes>
            </Router>
          </MockedProvider>
        </AlertProvider>
      </SisenseContext.Provider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    await findByTestId("program-dashboard");
  });

  it("renders go back, title and loading indicator while loading", async () => {
    const { getByTestId, getByText, queryByTestId } = render(<ProgramDashboard />, {
      wrapper
    });

    expect(getByText("Go back")).toBeInTheDocument();
    expect(getByText("Program Dashboard")).toBeInTheDocument();
    expect(getByTestId("program-loading")).toBeInTheDocument();
    expect(queryByTestId("program-dashboard-header")).not.toBeInTheDocument();
  });

  it("renders the program dashboard header", async () => {
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    await findByTestId("program-dashboard-header");
  });

  it("renders the expected program title in the program header", async () => {
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    const header = await findByTestId("program-dashboard-header");
    expect(header).toHaveTextContent("Goal 0");
  });

  it("renders Team Performance section", async () => {
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    await findByTestId("team-performance");
  });

  it("renders Individual Performance section", async () => {
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    await findByTestId("individual-performance");
  });

  it("navigates back if the user clicks Go back button", async () => {
    const { findByText } = render(<ProgramDashboard />, { wrapper });

    const goBackBtn = await findByText("Go back");
    fireEvent.click(goBackBtn);

    expect(history.location.pathname).toBe("/settings/host-goals");
    expect(history.location.search).toEqual("?siteId=0");
  });

  it("redirects the user back if the user is a PD viewer", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].role.id = "viewer";
    });
    render(<ProgramDashboard />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
  });

  it("redirects the user back if the user is an admin for a non-PD app", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].app.id = "sre";
    });
    render(<ProgramDashboard />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
  });

  it("redirects the user back if the user is a PD admin for a different property", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].site.id = "1";
    });
    render(<ProgramDashboard />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
  });

  it("displays an alert and redirects the user back to host goals list if the program is not found", async () => {
    programsQueryOpts.program = null;
    const { findByTestId } = render(<ProgramDashboard />, { wrapper });

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(`Could not find program with id 0 for site 0`);
    expect(history.location.pathname).toEqual("/settings/host-goals");
  });
});
