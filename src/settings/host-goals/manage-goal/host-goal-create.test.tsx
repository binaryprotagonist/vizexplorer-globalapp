import { Route, Router, Routes } from "react-router-dom";
import { MockedProvider } from "testing/graphql-provider";
import { mockAdmin, mockCurrentUserQuery, mockPDEngageAdminAccess } from "testing/mocks";
import { History, createMemoryHistory } from "history";
import { GaUserFragment } from "generated-graphql";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { HostGoalCreate } from "./host-goal-create";
import { produce } from "immer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  generateDummyGoalBuilderGoals,
  mockGoalMetricsQuery,
  mockGoalUsersQuery
} from "./goal-builder/__mocks__/goal-builder";
import { AlertProvider } from "view-v2/alert";
import {
  MockGoalCreateProgramsQueryOpts,
  MockGoalProgramCreateMutationOpts,
  mockGoalCreateProgramsQuery,
  mockGoalProgramCreateInput,
  mockGoalProgramCreateMutation
} from "./__mocks__/host-goal-create";
import { getInput, updateInput } from "testing/utils";
import { GraphQLError } from "graphql";

const mockPDEngageAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});

describe("<HostGoalCreate />", () => {
  let currentUser: GaUserFragment;
  let history: History;
  let goalProgramCreateOpts: MockGoalProgramCreateMutationOpts;
  let goalProgramQueryOpts: MockGoalCreateProgramsQueryOpts;

  beforeEach(() => {
    currentUser = mockPDEngageAdmin;
    history = createMemoryHistory({
      initialEntries: ["/settings/host-goals/sites/0/new"]
    });
    goalProgramCreateOpts = { vars: mockGoalProgramCreateInput };
    goalProgramQueryOpts = { programs: generateDummyGoalBuilderGoals() };
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AlertProvider>
          <MockedProvider
            mocks={[
              mockCurrentUserQuery(currentUser),
              mockGoalUsersQuery(),
              mockGoalMetricsQuery(),
              mockGoalCreateProgramsQuery(goalProgramQueryOpts),
              mockGoalProgramCreateMutation(goalProgramCreateOpts)
            ]}
          >
            <Router navigator={history} location={history.location}>
              <Routes>
                <Route path={"/settings/host-goals/*"}>
                  <Route path={"sites/:siteId/new"} element={children} />
                  <Route
                    path={"sites/:siteId/programs/:programId/duplicate"}
                    element={children}
                  />
                </Route>
              </Routes>
            </Router>
          </MockedProvider>
        </AlertProvider>
      </LocalizationProvider>
    );
  }

  describe("Goal Creation", () => {
    it("renders", async () => {
      const { findByTestId } = render(<HostGoalCreate />, { wrapper });

      await findByTestId("host-goal-create");
    });

    it("renders goal builder", async () => {
      const { findByTestId } = render(<HostGoalCreate />, { wrapper });

      await findByTestId("goal-builder");
    });

    it("displays the property name if the user has admin access to PD apps across multiple properties", async () => {
      const site2PDEngageAccess = produce(mockPDEngageAdminAccess, (draft) => {
        draft.site.id = "2";
      });
      currentUser = produce(currentUser, (draft) => {
        draft.accessList.push(site2PDEngageAccess);
      });
      const { findByTestId, getByText } = render(<HostGoalCreate />, { wrapper });

      await findByTestId("goal-builder");

      const siteName = mockPDEngageAdminAccess.site.name;
      expect(getByText(siteName, { exact: false })).toBeInTheDocument();
    });

    it("doesn't display property name if the user is a PD Admin for a single property", async () => {
      const { findByTestId, queryByText } = render(<HostGoalCreate />, { wrapper });

      await findByTestId("goal-builder");

      const siteName = mockPDEngageAdminAccess.site.name;
      expect(queryByText(siteName, { exact: false })).not.toBeInTheDocument();
    });

    it("redirects the user back to host goals list if the user is a PD viewer", async () => {
      currentUser = produce(currentUser, (draft) => {
        draft.accessList[0].role.id = "viewer";
      });
      const { queryByTestId } = render(<HostGoalCreate />, { wrapper });

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/settings/host-goals");
      });
      expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
    });

    it("redirects the user back to host goals list if the user is an admin for a non-PD app", async () => {
      currentUser = produce(currentUser, (draft) => {
        draft.accessList[0].app.id = "sre";
      });
      const { queryByTestId } = render(<HostGoalCreate />, { wrapper });

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/settings/host-goals");
      });
      expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
    });

    it("redirects the user back to host goals list if the user is a PD admin for a different property", async () => {
      currentUser = produce(currentUser, (draft) => {
        draft.accessList[0].site.id = "1";
      });
      const { queryByTestId } = render(<HostGoalCreate />, { wrapper });

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/settings/host-goals");
      });
      expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
    });
  });

  describe("Goal Duplication", () => {
    beforeEach(() => {
      history = createMemoryHistory({
        initialEntries: ["/settings/host-goals/sites/0/programs/0/duplicate"]
      });
    });

    it("renders", async () => {
      const { findByTestId } = render(<HostGoalCreate />, { wrapper });

      await findByTestId("host-goal-create");
    });
    it("populates goal builder fields with the program data", async () => {
      const { findByTestId, getByTestId, getAllByTestId } = render(<HostGoalCreate />, {
        wrapper
      });

      await findByTestId("goal-builder");
      await waitFor(() => {
        expect(getInput(getAllByTestId("period-from")[0])).not.toHaveValue("");
      });

      const program = goalProgramQueryOpts.programs[0];
      expect(getInput(getByTestId("goal-name-input"))).toHaveValue("");

      const goalRange = getByTestId("goal-period");
      const goalStart = within(goalRange).getByTestId("period-from");
      const goalEnd = within(goalRange).getByTestId("period-to");
      expect(getInput(goalStart)).toHaveValue("01 March 2022");
      expect(getInput(goalEnd)).toHaveValue("01 April 2022");

      const userSelect = getByTestId("user-select");
      expect(within(userSelect).getByTestId("value-chip")).toBeInTheDocument();

      const metricSelect = getByTestId("metric-select");
      expect(within(metricSelect).getByTestId("value-chip")).toBeInTheDocument();

      const userRow = getAllByTestId("datagrid-row")[1];
      const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];
      expect(metricCell).toHaveTextContent(`${program.targets!.matrix[0][0]}`);
    });

    it("redirects the user back to host goals upon successful duplication of a new program", async () => {
      const { findByTestId, getByTestId, getAllByTestId, getByText } = render(
        <HostGoalCreate />,
        { wrapper }
      );

      await findByTestId("goal-builder");
      await waitFor(() => {
        expect(getInput(getAllByTestId("period-from")[0])).not.toHaveValue("");
      });

      updateInput(getByTestId("goal-name-input"), goalProgramCreateOpts.vars.name);
      const saveButton = getByText("Save");
      fireEvent.click(getByText("Save"));

      expect(saveButton).toHaveTextContent("Saving");
      const alert = await findByTestId("alert");
      expect(alert).toHaveTextContent(`${goalProgramCreateOpts.vars.name} added`);
      expect(history.location.pathname).toEqual("/settings/host-goals");
      expect(history.location.search).toEqual("?siteId=0");
    });

    it("keeps the user on the same page and displays an error alert if there is an error saving", async () => {
      goalProgramCreateOpts.errors = [new GraphQLError("")];
      const { findByTestId, getByText, getByTestId } = render(<HostGoalCreate />, {
        wrapper
      });

      await findByTestId("goal-builder");
      await waitFor(() => {
        expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
      });

      updateInput(getByTestId("goal-name-input"), goalProgramCreateOpts.vars.name);
      fireEvent.click(getByText("Save"));

      const alert = await findByTestId("alert");
      expect(alert).toHaveTextContent("An unexpected error occurred");
      expect(history.location.pathname).toEqual(
        "/settings/host-goals/sites/0/programs/0/duplicate"
      );
    });

    it("displays an alert and redirects the user back to host goals list if the program is not found", async () => {
      goalProgramQueryOpts.programs = [];
      const { findByTestId } = render(<HostGoalCreate />, { wrapper });

      const alert = await findByTestId("alert");
      expect(alert).toHaveTextContent(`Could not find program with id 0 for site 0`);
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
  });
});
