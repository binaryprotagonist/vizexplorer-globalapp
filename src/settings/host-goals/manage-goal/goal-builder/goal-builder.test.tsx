import { MockedProvider } from "testing/graphql-provider";
import {
  generateDummyGoalBuilderGoals,
  generateDummyGoalMetrics,
  generateDummyUsers,
  mockGoalMetricsQuery,
  mockGoalUsersQuery
} from "./__mocks__/goal-builder";
import { act, fireEvent, render, waitFor, within } from "@testing-library/react";
import { GoalBuilder } from "./goal-builder";
import { ReducerGoal, createReducerGoal } from "../manage-goal-reducer";
import { Route, Router, Routes } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput, updateInput } from "testing/utils";
import { produce } from "immer";
import { OrgAccessLevel } from "generated-graphql";
import {
  GoalBuilderGoalMetricFragment,
  GoalBuilderUserFragment
} from "./__generated__/goal-builder";
import { AlertProvider } from "view-v2/alert";

const mockPrograms = generateDummyGoalBuilderGoals();

describe("<GoalBuilder />", () => {
  let history: History;
  let users: GoalBuilderUserFragment[];
  let metrics: GoalBuilderGoalMetricFragment[];

  beforeEach(() => {
    history = createMemoryHistory();
    users = generateDummyUsers();
    metrics = generateDummyGoalMetrics();
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AlertProvider>
          <MockedProvider
            mocks={[mockGoalUsersQuery({ users }), mockGoalMetricsQuery({ metrics })]}
          >
            <Router navigator={history} location={history.location}>
              <Routes>
                <Route index element={children} />
              </Routes>
            </Router>
          </MockedProvider>
        </AlertProvider>
      </LocalizationProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("goal-builder")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(
      <GoalBuilder
        title={"Goal Builder"}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Goal Builder")).toBeInTheDocument();
  });

  it("renders provided description", () => {
    const { getByText } = render(
      <GoalBuilder
        title={""}
        description={"Goal Builder Description"}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Goal Builder Description")).toBeInTheDocument();
  });

  it("renders fields", () => {
    const { getByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("goal-name-input")).toBeInTheDocument();
    const goalRange = getByTestId("goal-period");
    expect(within(goalRange).getByTestId("period-from")).toBeInTheDocument();
    expect(within(goalRange).getByTestId("period-to")).toBeInTheDocument();
    expect(getByTestId("user-select")).toBeInTheDocument();
    expect(getByTestId("metric-select")).toBeInTheDocument();
  });

  it("renders fields as disabled while loading APIs", async () => {
    const { getByTestId, getByText } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("goal-name-input"))).toBeDisabled();
    const goalRange = getByTestId("goal-period");
    expect(getInput(within(goalRange).getByTestId("period-from"))).toBeDisabled();
    expect(getInput(within(goalRange).getByTestId("period-to"))).toBeDisabled();
    expect(getInput(getByTestId("user-select"))).toBeDisabled();
    expect(getInput(getByTestId("metric-select"))).toBeDisabled();
    expect(getByText("Save")).toBeDisabled();
    // cancel is only disabled if the `saving` prop is true, not during API queries
    expect(getByText("Cancel")).toBeEnabled();
  });

  it("renders fields as disabled if saving is true", async () => {
    const { getByTestId, getByText, rerender } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    // wait for API loading states to resolve
    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    // rerender doesn't re-trigger APIs
    rerender(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={true}
        onSave={() => {}}
      />
    );

    expect(getInput(getByTestId("goal-name-input"))).toBeDisabled();
    const goalRange = getByTestId("goal-period");
    expect(getInput(within(goalRange).getByTestId("period-from"))).toBeDisabled();
    expect(getInput(within(goalRange).getByTestId("period-to"))).toBeDisabled();
    expect(getInput(getByTestId("user-select"))).toBeDisabled();
    expect(getInput(getByTestId("metric-select"))).toBeDisabled();
    expect(getByText("Saving")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });

  it("can update goal name", async () => {
    const { getByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    updateInput(getByTestId("goal-name-input"), "Goal name");
    expect(getInput(getByTestId("goal-name-input"))).toHaveValue("Goal name");
  });

  it("can update goal time period", async () => {
    const { getByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    const goalRange = getByTestId("goal-period");
    updateInput(within(goalRange).getByTestId("period-from"), "01 January 2022");
    updateInput(within(goalRange).getByTestId("period-to"), "01 February 2022");

    expect(getInput(within(goalRange).getByTestId("period-from"))).toHaveValue(
      "01 January 2022"
    );
    expect(getInput(within(goalRange).getByTestId("period-to"))).toHaveValue(
      "01 February 2022"
    );
  });

  it("renders user and user group options", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );

    // + 3 = select all and 2 user groups
    expect(getAllByRole("option")).toHaveLength(users.length + 3);
  });

  it("can select a user option", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByRole("button", { name: "Open" }));
    // 0 = select all, 1 = group, 2 = user option
    fireEvent.click(getAllByRole("option")[2]);

    userSelect = getByTestId("user-select");
    expect(within(userSelect).getByTestId("value-chip")).toBeInTheDocument();
  });

  it("can deselect a user option by clicking delete icon on the value chip", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[2]);

    userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByTestId("delete"));

    userSelect = getByTestId("user-select");
    expect(within(userSelect).queryByTestId("value-chip")).not.toBeInTheDocument();
  });

  it("can deselect a user option by clicking the option again from the menu", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[1]); // select
    fireEvent.click(getAllByRole("option")[1]); // deselect

    userSelect = getByTestId("user-select");
    expect(within(userSelect).queryByTestId("value-chip")).not.toBeInTheDocument();
  });

  it("doesn't include users who don't have host mappings", async () => {
    users = produce(users, (draft) => {
      draft[0].pdHostMappings = [];
      draft[1].pdHostMappings = [];
    });
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );

    // + 1 = select all and 2 user groups -2 users without host mappings
    expect(getAllByRole("option")).toHaveLength(users.length + 1);
  });

  it("doesn't include no access users", async () => {
    users = produce(users, (draft) => {
      draft[0].accessLevel = OrgAccessLevel.NoAccess;
      draft[1].accessLevel = OrgAccessLevel.NoAccess;
    });
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );

    // + 1 = select all and 2 user groups -2 no access users
    expect(getAllByRole("option")).toHaveLength(users.length + 1);
  });

  it("sorts users by group then name", async () => {
    users = produce(generateDummyUsers(5), (draft) => {
      draft[0].pdUserGroup!.name = "Group 2";
      draft[0].firstName = "Z";
      draft[1].pdUserGroup!.id = "group-1";
      draft[1].pdUserGroup!.name = "Group 1";
      draft[1].firstName = "A";
      draft[2].pdUserGroup!.name = "Group 2";
      draft[2].firstName = "C";
      draft[3].pdUserGroup = null;
      draft[3].firstName = "X";
      draft[4].pdUserGroup = null;
      draft[4].firstName = "B";
    });
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("user-select")).getByRole("button", { name: "Open" })
    );

    const userOptions = getAllByRole("option");
    // group 1
    expect(userOptions[1]).toHaveTextContent("Group 1");
    expect(userOptions[2]).toHaveTextContent("A");
    // group 2
    expect(userOptions[3]).toHaveTextContent("Group 2");
    expect(userOptions[4]).toHaveTextContent("C");
    expect(userOptions[5]).toHaveTextContent("Z");
    // no group
    expect(userOptions[6]).toHaveTextContent("B");
    expect(userOptions[7]).toHaveTextContent("X");
  });

  it("renders metric options", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("metric-select")).getByRole("button", { name: "Open" })
    );

    expect(getAllByRole("option")).toHaveLength(metrics.length);
  });

  it("can select a metric option", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[0]);

    metricSelect = getByTestId("metric-select");
    expect(within(metricSelect).getByTestId("value-chip")).toBeInTheDocument();
  });

  it("can deselect a metric option by clicking delete icon on the value chip", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[0]);

    metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByTestId("delete"));

    metricSelect = getByTestId("metric-select");
    expect(within(metricSelect).queryByTestId("value-chip")).not.toBeInTheDocument();
  });

  it("can deselect a metric option by clicking the option again from the menu", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    let metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[1]); // select
    fireEvent.click(getAllByRole("option")[1]); // deselect

    metricSelect = getByTestId("metric-select");
    expect(within(metricSelect).queryByTestId("value-chip")).not.toBeInTheDocument();
  });

  it("sorts metric options alphabetically", async () => {
    metrics = produce(generateDummyGoalMetrics(3), (draft) => {
      draft[0].name = "Z";
      draft[1].name = "A";
      draft[2].name = "C";
    });
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    fireEvent.click(
      within(getByTestId("metric-select")).getByRole("button", { name: "Open" })
    );

    const metricOptions = getAllByRole("option");
    expect(metricOptions[0]).toHaveTextContent("A");
    expect(metricOptions[1]).toHaveTextContent("C");
    expect(metricOptions[2]).toHaveTextContent("Z");
  });

  it("displays an error if the entered name is taken by another program", async () => {
    const programs = produce(mockPrograms, (draft) => {
      draft[0].name = "taken";
    });
    const { getByTestId, getByText } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={programs}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    updateInput(getByTestId("goal-name-input"), "taken");

    expect(getByText("Goal name already exists")).toBeInTheDocument();
  });

  it("doesn't display an error if the entered name is not taken by another program", async () => {
    const { getByTestId, queryByText } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    updateInput(getByTestId("goal-name-input"), "not taken");

    expect(queryByText("Goal name already exists")).not.toBeInTheDocument();
  });

  it("renders datagrid if a user and a metric is selected", async () => {
    const { getByTestId, getAllByRole } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    const userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[2]);
    fireEvent.click(within(userSelect).getByRole("button", { name: "Close" }));

    const metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[0]);

    expect(getByTestId("datagrid")).toBeInTheDocument();
  });

  it("can update target values", async () => {
    jest.useFakeTimers();
    // selecting users and metrics is incredibly slow. Instead prepare the goal with users and metrics already selected
    const goal: ReducerGoal = {
      ...createReducerGoal(),
      userIds: ["1"],
      metricIds: ["1"],
      targetValues: [[null]]
    };
    const { getByTestId, getAllByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={goal}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    const userRow = getAllByTestId("datagrid-row")[1];
    const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];

    expect(metricCell).toHaveTextContent("Enter goal");

    fireEvent.click(metricCell);
    updateInput(metricCell, "100");
    fireEvent.blur(getInput(getByTestId("datagrid-cell-edit"))!);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(metricCell).toHaveTextContent("100");
    jest.useRealTimers();
  });

  it("doesn't render datagrid if only a user is selected", async () => {
    const { getByTestId, getAllByRole, queryByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    const userSelect = getByTestId("user-select");
    fireEvent.click(within(userSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[2]);

    expect(queryByTestId("datagrid")).not.toBeInTheDocument();
  });

  it("doesn't render target values datagrid if only a metric is selected", async () => {
    const { getByTestId, getAllByRole, queryByTestId } = render(
      <GoalBuilder
        title={""}
        description={""}
        goal={createReducerGoal()}
        programs={mockPrograms}
        siteId={"0"}
        saving={false}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("goal-name-input"))).toBeEnabled();
    });

    const metricSelect = getByTestId("metric-select");
    fireEvent.click(within(metricSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getAllByRole("option")[0]);

    expect(queryByTestId("datagrid")).not.toBeInTheDocument();
  });
});
