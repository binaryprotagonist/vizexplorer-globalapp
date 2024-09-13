import { act, fireEvent, render, within } from "@testing-library/react";
import { Table } from "./table";
import { Column } from "@material-table/core";
import { getInput, updateInput } from "testing/utils";

type MockData = {
  name: string;
};
const mockData: MockData[] = [
  { name: "John 1" },
  { name: "Zoe 2" },
  { name: "Aplha 3" },
  { name: "Bravo 4" },
  { name: "Charlie 5" },
  { name: "Delta 6" }
];
const mockColumns: Column<MockData>[] = [{ title: "Full Name", field: "name" }];

describe("<Table />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders provided columns and data", () => {
    const { getByText } = render(<Table data={mockData} columns={mockColumns} />);

    mockColumns.forEach((column) => {
      expect(getByText(column.title as string)).toBeInTheDocument();
    });
    mockData.slice(0, 5).forEach((data) => {
      expect(getByText(data.name)).toBeInTheDocument();
    });
  });

  it("renders provided actions", () => {
    const { getAllByTestId } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        actions={[{ icon: () => <div data-testid={"mock-icon"} />, onClick: () => {} }]}
      />
    );

    expect(getAllByTestId("mock-icon")).toHaveLength(5);
  });

  it("runs `onClick` when an object defined action is clicked", () => {
    const onActionClick = jest.fn();
    const { getAllByTestId } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        actions={[
          { icon: () => <div data-testid={"mock-icon"} />, onClick: onActionClick }
        ]}
      />
    );

    fireEvent.click(getAllByTestId("mock-icon")[0]);
    expect(onActionClick).toHaveBeenCalled();
  });

  it("runs `onClick` when a function defined action is clicked", () => {
    const onActionClick = jest.fn();
    const { getAllByTestId } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        actions={[
          () => ({
            icon: () => <div data-testid={"mock-icon"} />,
            onClick: onActionClick
          })
        ]}
      />
    );

    fireEvent.click(getAllByTestId("mock-icon")[0]);
    expect(onActionClick).toHaveBeenCalled();
  });

  it("renders toolbar by default", () => {
    const { getByTestId } = render(<Table data={mockData} columns={mockColumns} />);

    expect(getByTestId("table-toolbar")).toBeInTheDocument();
  });

  it("renders search within toolbar by default", () => {
    const { getByTestId } = render(<Table data={mockData} columns={mockColumns} />);

    expect(
      within(getByTestId("table-toolbar")).getByTestId("table-search")
    ).toBeInTheDocument();
  });

  it("doesn't render table container or toolbar if toolbar type is external", () => {
    const { queryByTestId } = render(
      <Table data={mockData} columns={mockColumns} toolbar={{ type: "external" }} />
    );

    expect(queryByTestId("table-container")).not.toBeInTheDocument();
    expect(queryByTestId("table-toolbar")).not.toBeInTheDocument();
  });

  it("allows overriding the toolbar and continuing to display built in components", () => {
    const { getByTestId } = render(
      <Table
        data={[]}
        columns={[]}
        toolbar={{
          type: "custom",
          component: ({ ToolbarContainer, search }) => (
            <ToolbarContainer data-testid={"custom-toolbar"}>
              <div data-testid={"custom-toolbar-content"} />
              {search}
            </ToolbarContainer>
          )
        }}
      />
    );

    expect(getByTestId("table-container")).toBeInTheDocument();
    expect(getByTestId("custom-toolbar")).toBeInTheDocument();
    expect(getByTestId("table-search")).toBeInTheDocument();
    expect(getByTestId("custom-toolbar-content")).toBeInTheDocument();
  });

  it("allows overriding the toolbar without displaying built in components", () => {
    const { getByTestId, queryByTestId } = render(
      <Table
        data={[]}
        columns={[]}
        toolbar={{
          type: "custom",
          component: () => <div data-testid={"custom-toolbar"} />
        }}
      />
    );

    expect(getByTestId("custom-toolbar")).toBeInTheDocument();
    expect(queryByTestId("table-search")).not.toBeInTheDocument();
    expect(queryByTestId("table-toolbar")).not.toBeInTheDocument();
  });

  it("filters table data when searching", () => {
    const { getByTestId, queryByText } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    updateInput(getByTestId("table-search"), "John");

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByText(mockData[0].name)).toBeInTheDocument();
    expect(queryByText(mockData[1].name)).not.toBeInTheDocument();
    expect(queryByText(mockData[2].name)).not.toBeInTheDocument();
  });

  it("filters table data when searching and using a custom toolbar", () => {
    const { getByTestId, queryByText } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        toolbar={{
          type: "custom",
          component: ({ ToolbarContainer, search }) => (
            <ToolbarContainer>{search}</ToolbarContainer>
          )
        }}
      />
    );

    updateInput(getByTestId("table-search"), "John");

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByText(mockData[0].name)).toBeInTheDocument();
    expect(queryByText(mockData[1].name)).not.toBeInTheDocument();
    expect(queryByText(mockData[2].name)).not.toBeInTheDocument();
  });

  it("renders pagination if there are more than 5 records", () => {
    const { getByTestId } = render(
      <Table
        data={mockData}
        columns={mockColumns}
        toolbar={{
          type: "custom",
          component: ({ ToolbarContainer, search }) => (
            <ToolbarContainer>{search}</ToolbarContainer>
          )
        }}
      />
    );

    expect(getByTestId("table-pagination")).toBeInTheDocument();
  });

  it("doesn't render pagination if there 5 records or less", () => {
    const { queryByTestId } = render(
      <Table data={mockData.slice(0, 5)} columns={mockColumns} />
    );

    expect(queryByTestId("table-pagination")).not.toBeInTheDocument();
  });

  it("can go to the next page by clicking Next", () => {
    const { getByTestId, queryByText } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    fireEvent.click(within(getByTestId("table-pagination")).getByText("Next"));

    expect(queryByText(mockData[0].name)).not.toBeInTheDocument();
    expect(queryByText(mockData.at(-1)!.name)).toBeInTheDocument();
  });

  it("can go directly to a page by clicking the page number", () => {
    const { getByTestId, queryByText } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    fireEvent.click(within(getByTestId("table-pagination")).getByText("2"));

    expect(queryByText(mockData[0].name)).not.toBeInTheDocument();
    expect(queryByText(mockData.at(-1)!.name)).toBeInTheDocument();
  });

  it("can go to the previous page by clicking Previous", () => {
    const { getByTestId, queryByText } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    fireEvent.click(within(getByTestId("table-pagination")).getByText("Next"));
    fireEvent.click(within(getByTestId("table-pagination")).getByText("Previous"));

    expect(queryByText(mockData[0].name)).toBeInTheDocument();
    expect(queryByText(mockData.at(-1)!.name)).not.toBeInTheDocument();
  });

  it("disables the Previous pagination button while on the first page", () => {
    const { getByTestId } = render(<Table data={mockData} columns={mockColumns} />);

    expect(within(getByTestId("table-pagination")).getByText("Previous")).toBeDisabled();
  });

  it("disables the Next pagination button while on the last page", () => {
    const { getByTestId } = render(<Table data={mockData} columns={mockColumns} />);

    fireEvent.click(within(getByTestId("table-pagination")).getByText("Next"));

    expect(within(getByTestId("table-pagination")).getByText("Next")).toBeDisabled();
  });

  it("renders skeletons when loading", () => {
    const { getByTestId, getAllByTestId, queryByTestId } = render(
      <Table loading data={[]} columns={mockColumns} actions={[]} />
    );

    const paginationBtns = within(getByTestId("table-pagination")).getAllByRole("button");
    // fixed row count of 5 while loading
    const numCells = mockColumns.length * 5;

    expect(getInput(getByTestId("table-search"))).toBeDisabled();
    expect(getAllByTestId("table-cell-loading")).toHaveLength(numCells);
    // 5 placeholder + previous + next
    expect(paginationBtns).toHaveLength(7);
    paginationBtns.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
    mockData.forEach((data) => {
      expect(queryByTestId(data.name)).not.toBeInTheDocument();
    });
  });
});
