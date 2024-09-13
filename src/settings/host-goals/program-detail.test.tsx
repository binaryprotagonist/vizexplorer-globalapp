import { render, within } from "@testing-library/react";
import { ProgramDetail } from "./program-detail";
import { ProgramCardProgramDetailFragment } from "./__generated__/program-detail";
import { produce } from "immer";

const mockProgramDetail: ProgramCardProgramDetailFragment = {
  startDate: "2022-01-01",
  endDate: "2022-02-01",
  members: [{ id: "1", firstName: "John", lastName: "Doe" }],
  metrics: [{ id: "theo-win", name: "Theo Win" }],
  targets: { matrix: [[100]] }
};

describe("<ProgramDetail />", () => {
  it("renders", () => {
    const { getByTestId } = render(<ProgramDetail programDetail={mockProgramDetail} />);

    expect(getByTestId("program-detail")).toBeInTheDocument();
  });

  it("renders program date range", () => {
    const { getByTestId } = render(<ProgramDetail programDetail={mockProgramDetail} />);

    expect(getByTestId("program-date-range")).toHaveTextContent(
      "01 January 2022 - 01 February 2022"
    );
  });

  it("renders target values datagrid", () => {
    const { getByTestId } = render(<ProgramDetail programDetail={mockProgramDetail} />);

    expect(getByTestId("datagrid")).toBeInTheDocument();
  });

  it("renders provided users, metrics and target values in the target values grid", () => {
    const { getByTestId } = render(<ProgramDetail programDetail={mockProgramDetail} />);

    expect(getByTestId("datagrid")).toHaveTextContent("John Doe");
    expect(getByTestId("datagrid")).toHaveTextContent("Theo Win");
    expect(getByTestId("datagrid")).toHaveTextContent("100");
  });

  it("doesn't allow editing target values", () => {
    const { getAllByTestId } = render(
      <ProgramDetail programDetail={mockProgramDetail} />
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

  it("defaults matrix values for each user and metric if target values is not provided", () => {
    const noTargetValues = produce(mockProgramDetail, (draft) => {
      draft.targets = null;
    });
    const { getAllByTestId } = render(<ProgramDetail programDetail={noTargetValues} />);

    const [_, userRow] = getAllByTestId("datagrid-row");
    const userCells = within(userRow).getAllByTestId("datagrid-cell");

    // First cell is the users name, second is a metric cell
    expect(userCells[1]).toHaveTextContent("0");
  });
});
