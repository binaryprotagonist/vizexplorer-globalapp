import { act, fireEvent, render, within } from "@testing-library/react";
import { TargetValuesGrid } from "./target-values-grid";
import { updateInput } from "testing/utils";
import {
  TargetValuesMetricFragment,
  TargetValuesUserFragment
} from "./__generated__/target-values-grid";
import { MAX_GOAL_VALUE, MIN_GOAL_VALUE } from "./utils";

const mockUser: TargetValuesUserFragment = {
  __typename: "User",
  id: "1",
  firstName: "John",
  lastName: "Doe"
};
const mockMetric: TargetValuesMetricFragment = {
  __typename: "PdGoalProgramMetric",
  id: "1",
  name: "Metric 1"
};

describe("<TargetValuesGrid />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <TargetValuesGrid users={[]} metrics={[]} targetValues={[[]]} onChange={() => {}} />
    );

    expect(getByTestId("datagrid")).toBeInTheDocument();
  });

  it("renders expected header and cell values based on provided metrics and users", () => {
    const { getByTestId, getAllByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={() => {}}
      />
    );

    const header = getByTestId("datagrid-header");
    expect(within(header).getByText("Users")).toBeInTheDocument();
    expect(within(header).getByText("Metric 1")).toBeInTheDocument();

    const [totalRow, userRow] = getAllByTestId("datagrid-row");
    const [totalUserCell, totalMetricCell] =
      within(totalRow).getAllByTestId("datagrid-cell");
    expect(totalUserCell).toHaveTextContent("TOTAL");
    expect(within(totalMetricCell).getByText("0")).toBeInTheDocument();

    const [userUserCell, userMetricCell] =
      within(userRow).getAllByTestId("datagrid-cell");
    expect(userUserCell).toHaveTextContent("John Doe");
    expect(userMetricCell).toHaveTextContent("Enter goal");
  });

  it("calculates totals cell based on row content", () => {
    const metrics = [mockMetric, { ...mockMetric, name: "metric 2" }];
    const users = [mockUser, { ...mockUser, id: "2", firstName: "Jane" }];
    const targetValues = [
      [1, 2],
      [3, 4]
    ];
    const { getAllByTestId } = render(
      <TargetValuesGrid
        users={users}
        metrics={metrics}
        targetValues={targetValues}
        onChange={() => {}}
      />
    );

    const [totalRow] = getAllByTestId("datagrid-row");
    const totalCells = within(totalRow).getAllByTestId("datagrid-cell");

    expect(totalCells[1]).toHaveTextContent("4");
    expect(totalCells[2]).toHaveTextContent("6");
  });

  it("allows editing target value cells", () => {
    const { getAllByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={() => {}}
      />
    );

    const userRow = getAllByTestId("datagrid-row")[1];
    const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];

    expect(metricCell).toHaveAttribute("data-editable", "true");
  });

  it("doesn't allow editing non-target value cells", () => {
    const { getByTestId, getAllByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={() => {}}
      />
    );

    const header = getByTestId("datagrid-header");
    const headerCells = within(header).getAllByTestId("datagrid-cell");

    const [totalRow, userRow] = getAllByTestId("datagrid-row");
    const totalCells = within(totalRow).getAllByTestId("datagrid-cell");
    const userCells = within(userRow).getAllByTestId("datagrid-cell");

    // header cells aren't editable
    headerCells.forEach((headerCell) => {
      expect(headerCell).toHaveAttribute("data-editable", "false");
    });
    // total cells aren't editable
    totalCells.forEach((totalCell) => {
      expect(totalCell).toHaveAttribute("data-editable", "false");
    });
    // users name isn't editable
    expect(userCells[0]).toHaveAttribute("data-editable", "false");
    // users metric/s are editable
    expect(userCells[1]).toHaveAttribute("data-editable", "true");
  });

  it("doesn't allow editing any cells of `readOnly` is true", () => {
    const { getAllByTestId } = render(
      <TargetValuesGrid
        readOnly
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={() => {}}
      />
    );

    const [totalRow, userRow] = getAllByTestId("datagrid-row");
    const totalCells = within(totalRow).getAllByTestId("datagrid-cell");
    const userCells = within(userRow).getAllByTestId("datagrid-cell");

    totalCells.forEach((totalCell) => {
      expect(totalCell).toHaveAttribute("data-editable", "false");
    });
    userCells.forEach((userCell) => {
      expect(userCell).toHaveAttribute("data-editable", "false");
    });
  });

  it("calls onChange with expected values when a cell is updated", () => {
    const onChange = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={onChange}
      />
    );

    const userRow = getAllByTestId("datagrid-row")[1];
    const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];
    fireEvent.click(metricCell);

    updateInput(getByTestId("datagrid-cell-edit"), "123");

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onChange).toHaveBeenCalledWith({ colIdx: 0, rowIdx: 0, value: "123" });
  });

  it("calls `onChange` with the max possible value if the max value is exceeded", () => {
    const onChange = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={onChange}
      />
    );

    const userRow = getAllByTestId("datagrid-row")[1];
    const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];
    fireEvent.click(metricCell);

    updateInput(getByTestId("datagrid-cell-edit"), `${MAX_GOAL_VALUE + 1}`);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onChange).toHaveBeenCalledWith({
      colIdx: 0,
      rowIdx: 0,
      value: `${MAX_GOAL_VALUE}`
    });
  });

  it("calls `onChange` with the min possible value if the min value is exceeded", () => {
    const onChange = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <TargetValuesGrid
        users={[mockUser]}
        metrics={[mockMetric]}
        targetValues={[[null]]}
        onChange={onChange}
      />
    );

    const userRow = getAllByTestId("datagrid-row")[1];
    const metricCell = within(userRow).getAllByTestId("datagrid-cell")[1];
    fireEvent.click(metricCell);

    updateInput(getByTestId("datagrid-cell-edit"), `${MIN_GOAL_VALUE - 1}`);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onChange).toHaveBeenCalledWith({
      colIdx: 0,
      rowIdx: 0,
      value: `${MIN_GOAL_VALUE}`
    });
  });
});
