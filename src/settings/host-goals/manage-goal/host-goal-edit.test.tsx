import { Route, Router, Routes } from "react-router-dom";
import { MockedProvider } from "testing/graphql-provider";
import { mockAdmin, mockCurrentUserQuery, mockPDEngageAdminAccess } from "testing/mocks";
import { History, createMemoryHistory } from "history";
import { GaUserFragment } from "generated-graphql";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { HostGoalEdit } from "./host-goal-edit";
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
  MockGoalProgramEditMutationOpts,
  MockGoalEditProgramsQueryOpts,
  mockGoalEditProgramsQuery,
  mockGoalProgramUpdateInput,
  mockGoalProgramUpdateMutation
} from "./__mocks__/host-goal-edit";
import { getInput, updateInput } from "testing/utils";
import { GraphQLError } from "graphql";

const mockPDEngageAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});

describe("<HostGoalEdit />", () => {
  let currentUser: GaUserFragment;
  let history: History;
  let goalProgramUpdateOpts: MockGoalProgramEditMutationOpts;
  let goalProgramQueryOpts: MockGoalEditProgramsQueryOpts;

  beforeEach(() => {
    currentUser = mockPDEngageAdmin;
    history = createMemoryHistory({
      initialEntries: ["/settings/host-goals/sites/0/programs/0/edit"]
    });
    goalProgramUpdateOpts = { vars: mockGoalProgramUpdateInput };
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
              mockGoalProgramUpdateMutation(goalProgramUpdateOpts),
              mockGoalEditProgramsQuery(goalProgramQueryOpts)
            ]}
          >
            <Router navigator={history} location={history.location}>
              <Routes>
                <Route path={"/settings/host-goals/*"}>
                  <Route
                    path={"sites/:siteId/programs/:programId/edit"}
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

  it("renders", async () => {
    const { findByTestId } = render(<HostGoalEdit />, { wrapper });

    await findByTestId("host-goal-edit");
  });

  it("renders goal builder", async () => {
    const { findByTestId } = render(<HostGoalEdit />, { wrapper });

    await findByTestId("goal-builder");
  });

  it("displays the property name if the user has admin access to PD apps across multiple properties", async () => {
    const site2PDEngageAccess = produce(mockPDEngageAdminAccess, (draft) => {
      draft.site.id = "2";
    });
    currentUser = produce(currentUser, (draft) => {
      draft.accessList.push(site2PDEngageAccess);
    });
    const { findByTestId, getByText } = render(<HostGoalEdit />, { wrapper });

    await findByTestId("goal-builder");

    const siteName = mockPDEngageAdminAccess.site.name;
    expect(getByText(siteName, { exact: false })).toBeInTheDocument();
  });

  it("doesn't display property name if the user is a PD Admin for a single property", async () => {
    const { findByTestId, queryByText } = render(<HostGoalEdit />, { wrapper });

    await findByTestId("goal-builder");

    const siteName = mockPDEngageAdminAccess.site.name;
    expect(queryByText(siteName, { exact: false })).not.toBeInTheDocument();
  });

  it("populates goal builder fields with the program data", async () => {
    const { findByTestId, getByTestId, getAllByTestId } = render(<HostGoalEdit />, {
      wrapper
    });

    await findByTestId("goal-builder");

    const program = goalProgramQueryOpts.programs[0];
    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toHaveValue(program.name);
    });

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

  it("redirects the user back to host goals list if the user is a PD viewer", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].role.id = "viewer";
    });
    const { queryByTestId } = render(<HostGoalEdit />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
    expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
  });

  it("redirects the user back to host goals list if the user is an admin for a non-PD app", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].app.id = "sre";
    });
    const { queryByTestId } = render(<HostGoalEdit />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
    expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
  });

  it("redirects the user back to host goals list if the user is a PD admin for a different property", async () => {
    currentUser = produce(currentUser, (draft) => {
      draft.accessList[0].site.id = "1";
    });
    const { queryByTestId } = render(<HostGoalEdit />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/host-goals");
    });
    expect(queryByTestId("host-goal-create")).not.toBeInTheDocument();
  });

  it("displays an alert and redirects the user back to host goals list if the program is not found", async () => {
    goalProgramQueryOpts.programs = [];
    const { findByTestId } = render(<HostGoalEdit />, { wrapper });

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(`Could not find program with id 0 for site 0`);
    expect(history.location.pathname).toEqual("/settings/host-goals");
  });

  it("redirects the user back to host goals upon successful update of a program", async () => {
    const { findByTestId, getByTestId, getByText } = render(<HostGoalEdit />, {
      wrapper
    });

    await findByTestId("goal-builder");
    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    updateInput(getByTestId("goal-name-input"), mockGoalProgramUpdateInput.name);

    const saveButton = getByText("Save");
    fireEvent.click(getByText("Save"));

    expect(saveButton).toHaveTextContent("Saving");
    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(`${mockGoalProgramUpdateInput.name} updated`);
    expect(history.location.pathname).toEqual("/settings/host-goals");
    expect(history.location.search).toEqual("?siteId=0");
  });

  it("keeps the user on the same page and displays an error alert if there is an error saving", async () => {
    goalProgramUpdateOpts.errors = [new GraphQLError("")];
    const { findByTestId, getByText, getByTestId } = render(<HostGoalEdit />, {
      wrapper
    });

    await findByTestId("goal-builder");
    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    updateInput(getByTestId("goal-name-input"), mockGoalProgramUpdateInput.name);

    fireEvent.click(getByText("Save"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("An unexpected error occurred");
    expect(history.location.pathname).toEqual(
      "/settings/host-goals/sites/0/programs/0/edit"
    );
  });
});
