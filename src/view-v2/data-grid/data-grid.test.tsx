import { act, fireEvent, render, within } from "@testing-library/react";
import { DataGrid } from "./data-grid";
import { CellValueChangeParams, Column } from "./types";
import { getInput, updateInput } from "testing/utils";
import { produce } from "immer";

type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
};

const mockColumns: Column<MockUser>[] = [
  {
    headerName: "ID",
    field: "id"
  },
  {
    headerName: "First Name",
    field: "firstName",
    valuePlaceholder: ({ id }) => (id === "1" ? "Enter first name" : null)
  },
  {
    headerName: "Last Name",
    field: "lastName"
  },
  {
    headerName: "Full Name",
    field: "fullName",
    valueGetter: ({ row }) => `${row.firstName} ${row.lastName}`
  }
];

const mockRows: MockUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith"
  }
];

describe("<DataGrid />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(<DataGrid rows={[]} columns={[]} />);

    expect(getByTestId("datagrid")).toBeInTheDocument();
  });

  it("renders provided colum headers", () => {
    const { getByText } = render(<DataGrid rows={[]} columns={mockColumns} />);

    mockColumns.forEach((column) => {
      expect(getByText(column.headerName!)).toBeInTheDocument();
    });
  });

  it("renders provided rows", () => {
    const { getByText } = render(<DataGrid rows={mockRows} columns={mockColumns} />);

    mockRows.forEach((row) => {
      expect(getByText(row.id)).toBeInTheDocument();
      expect(getByText(row.firstName)).toBeInTheDocument();
      expect(getByText(row.lastName)).toBeInTheDocument();
      expect(getByText(`${row.firstName} ${row.lastName}`)).toBeInTheDocument();
    });
  });

  it("converts a cell to edit mode when clicked and isCellEditable returns true", () => {
    const { queryByTestId, getByText, getByTestId } = render(
      <DataGrid rows={mockRows} columns={mockColumns} isCellEditable={() => true} />
    );

    expect(queryByTestId("datagrid-cell-edit")).not.toBeInTheDocument();

    fireEvent.click(getByText("John"));

    expect(getByTestId("datagrid-cell-edit")).toBeInTheDocument();
  });

  it("runs onCellValueChange when a cell is edited", () => {
    const onCellValueChange = jest.fn();
    const { getByText, getByTestId } = render(
      <DataGrid
        rows={mockRows}
        columns={mockColumns}
        isCellEditable={() => true}
        onCellValueChange={onCellValueChange}
      />
    );

    fireEvent.click(getByText("John"));
    updateInput(getByTestId("datagrid-cell-edit"), "New Value");

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onCellValueChange).toHaveBeenCalledWith<[CellValueChangeParams<MockUser>]>({
      column: mockColumns[1],
      row: mockRows[0],
      value: "New Value"
    });
  });

  it("can alter the user input using valueParser before calling onCellValueChange", () => {
    const withValueParser = produce(mockColumns, (draft) => {
      draft[1].valueParser = (value) => value.toUpperCase();
    });
    const onCellValueChange = jest.fn();
    const { getByText, getByTestId } = render(
      <DataGrid
        rows={mockRows}
        columns={withValueParser}
        isCellEditable={() => true}
        onCellValueChange={onCellValueChange}
      />
    );

    fireEvent.click(getByText("John"));
    updateInput(getByTestId("datagrid-cell-edit"), "new value");

    expect(getInput(getByTestId("datagrid-cell-edit"))).toHaveValue("NEW VALUE");

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onCellValueChange).toHaveBeenCalledWith<[CellValueChangeParams<MockUser>]>({
      column: withValueParser[1],
      row: mockRows[0],
      value: "NEW VALUE"
    });
  });

  it("doesn't convert to edit cell when isCellEditable returns false", () => {
    const { queryByTestId, getByText } = render(
      <DataGrid rows={mockRows} columns={mockColumns} isCellEditable={() => false} />
    );

    fireEvent.click(getByText("John"));

    expect(queryByTestId("datagrid-cell-edit")).not.toBeInTheDocument();
  });

  it("renders placeholder value if provided and the cell doesn't have a value", () => {
    const missingFirstName = produce(mockRows, (draft) => {
      draft[0].firstName = "";
      draft[1].firstName = "";
    });
    const { getAllByTestId } = render(
      <DataGrid rows={missingFirstName} columns={mockColumns} />
    );

    const [firstRow, secondRow] = getAllByTestId("datagrid-row");
    const [_, firstRowFirstName] = within(firstRow).getAllByTestId("datagrid-cell");
    const [__, secondRowFirstName] = within(secondRow).getAllByTestId("datagrid-cell");

    // only render placeholder for the first row based on the mock column definition
    expect(firstRowFirstName).toHaveTextContent("Enter first name");
    expect(secondRowFirstName).toHaveTextContent("");
  });

  it("applies a height to the datagrid based provided maxRows", () => {
    const { getByTestId } = render(
      <DataGrid rows={mockRows} columns={mockColumns} maxRows={1} />
    );

    const datagrid = getByTestId("datagrid");
    const datagridStyles = globalThis.getComputedStyle(datagrid);
    // hardcoded check because if this value is to change, it should be scrutinized and ensured that visually any change makes sense
    expect(datagridStyles.height).toEqual("105px");
  });

  it("doesn't apply a height to the datagrid if maxRows isn't provided", () => {
    const { getByTestId } = render(<DataGrid rows={mockRows} columns={mockColumns} />);

    const datagrid = getByTestId("datagrid");
    const datagridStyles = globalThis.getComputedStyle(datagrid);
    expect(datagridStyles.height).toEqual("");
  });

  it("applies sticky position to datagrid header", () => {
    const { getByTestId } = render(<DataGrid rows={[]} columns={[]} />);

    expect(getByTestId("datagrid-header")).toHaveStyle({ position: "sticky" });
  });

  it("applies sticky position styles to cells based on pinned columns and rows", () => {
    const { getAllByTestId } = render(
      <DataGrid
        rows={mockRows}
        columns={mockColumns}
        isCellEditable={() => false}
        pinnedColumns={{ field: "firstName" }}
        pinnedRows={{ top: 1 }}
      />
    );

    // pinnedRows applies sticky at the row level while pinnedColumns applies sticky at the cell level
    const rows = getAllByTestId("datagrid-row");
    const firstRowCells = within(rows[0]).getAllByTestId("datagrid-cell");
    const secondRowCells = within(rows[1]).getAllByTestId("datagrid-cell");

    // validate row level sticky based on pinnedRows
    expect(rows[0]).toHaveStyle({ position: "sticky" });
    expect(rows[1]).not.toHaveStyle({ position: "sticky" });

    // validate cell level sticky based on pinnedColumns
    firstRowCells.forEach((cell, idx) => {
      if (idx < 2) {
        expect(cell).toHaveStyle({ position: "sticky" });
      } else {
        expect(cell).not.toHaveStyle({ position: "sticky" });
      }
    });

    secondRowCells.forEach((cell, idx) => {
      if (idx < 2) {
        expect(cell).toHaveStyle({ position: "sticky" });
      } else {
        expect(cell).not.toHaveStyle({ position: "sticky" });
      }
    });
  });

  it("can apply custom styles to cells", () => {
    const { getAllByTestId } = render(
      <DataGrid
        rows={mockRows}
        columns={mockColumns}
        isCellEditable={() => false}
        cellStyle={(params) => {
          return params?.row.id === mockRows[0].id
            ? { backgroundColor: "red" }
            : { backgroundColor: "blue" };
        }}
      />
    );

    const rows = getAllByTestId("datagrid-row");
    const firstRowCells = within(rows[0]).getAllByTestId("datagrid-cell");
    const secondRowCells = within(rows[1]).getAllByTestId("datagrid-cell");

    firstRowCells.forEach((cell) => {
      expect(cell).toHaveStyle({ backgroundColor: "red" });
    });

    secondRowCells.forEach((cell) => {
      expect(cell).toHaveStyle({ backgroundColor: "blue" });
    });
  });

  it("renders an editing cell as numeric type if the column type is number", () => {
    const numberColumn: Column<MockUser>[] = [
      { headerName: "ID", field: "id", type: "number" }
    ];
    const { getByTestId, getAllByTestId } = render(
      <DataGrid rows={mockRows} columns={numberColumn} isCellEditable={() => true} />
    );

    const rows = getAllByTestId("datagrid-row");
    fireEvent.click(within(rows[0]).getAllByTestId("datagrid-cell")[0]);

    expect(getInput(getByTestId("datagrid-cell-edit"))).toHaveAttribute("type", "number");
  });

  it("renders an editing cell as text type if the column type isn't specified", () => {
    const { getByTestId, getAllByTestId } = render(
      <DataGrid rows={mockRows} columns={mockColumns} isCellEditable={() => true} />
    );

    const rows = getAllByTestId("datagrid-row");
    fireEvent.click(within(rows[0]).getAllByTestId("datagrid-cell")[0]);

    expect(getInput(getByTestId("datagrid-cell-edit"))).toHaveAttribute("type", "text");
  });

  describe("checkboxSelection", () => {
    it("renders checkboxs in the first column if checkboxSelection is true", () => {
      const { getByTestId, getAllByTestId } = render(
        <DataGrid checkboxSelection rows={mockRows} columns={mockColumns} />
      );

      const header = getByTestId("datagrid-header");
      const firstHeaderCell = within(header).getAllByTestId("datagrid-cell")[0];
      expect(within(firstHeaderCell).getByRole("checkbox")).toBeInTheDocument();

      getAllByTestId("datagrid-row").forEach((row) => {
        const firstCell = within(row).getAllByTestId("datagrid-cell")[0];
        expect(within(firstCell).getByRole("checkbox")).toBeInTheDocument();
      });
    });

    it("doesn't render checkbox selection column if checkboxSelection is false", () => {
      const { queryAllByRole } = render(
        <DataGrid rows={mockRows} columns={mockColumns} />
      );

      expect(queryAllByRole("checkbox")).toHaveLength(0);
    });

    it("disables all checkboxes if disableAllCheckboxSelection is true", () => {
      const { getAllByRole } = render(
        <DataGrid
          checkboxSelection
          disableAllCheckboxSelection
          rows={mockRows}
          columns={mockColumns}
        />
      );

      getAllByRole("checkbox").forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("doesn't disable checkboxes if disableAllCheckboxSelection is false", () => {
      const { getAllByRole } = render(
        <DataGrid checkboxSelection rows={mockRows} columns={mockColumns} />
      );

      getAllByRole("checkbox").forEach((checkbox) => {
        expect(checkbox).toBeEnabled();
      });
    });

    it("renders all checkbox as deselected if rowSelectionModel is empty", () => {
      const { getAllByRole } = render(
        <DataGrid checkboxSelection rows={mockRows} columns={mockColumns} />
      );

      getAllByRole("checkbox").forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("renders all checkbox as selected if rowSelectionModel contains all row ids", () => {
      const { getAllByRole } = render(
        <DataGrid
          checkboxSelection
          rows={mockRows}
          columns={mockColumns}
          rowSelectionModel={new Set(mockRows.map((row) => row.id))}
        />
      );

      getAllByRole("checkbox").forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it("doesn't render header checkbox as checked if rowSelectionModel doesn't contain all row ids", () => {
      const { getByTestId, getAllByTestId } = render(
        <DataGrid
          checkboxSelection
          rows={mockRows}
          columns={mockColumns}
          rowSelectionModel={new Set([mockRows[0].id])}
        />
      );

      const header = getByTestId("datagrid-header");
      const firstHeaderCell = within(header).getAllByTestId("datagrid-cell")[0];
      expect(within(firstHeaderCell).getByRole("checkbox")).not.toBeChecked();

      getAllByTestId("datagrid-row").forEach((row, idx) => {
        const firstCell = within(row).getAllByTestId("datagrid-cell")[0];
        if (idx === 0) {
          expect(within(firstCell).getByRole("checkbox")).toBeChecked();
        } else {
          expect(within(firstCell).getByRole("checkbox")).not.toBeChecked();
        }
      });
    });

    it("calls onRowSelectionModelChange with all row ids if the header checkbox is clicked while not all rows are selected", () => {
      const mockOnRowSelectionModelChange = jest.fn();
      const { getByTestId } = render(
        <DataGrid
          checkboxSelection
          rowSelectionModel={new Set([mockRows[0].id])}
          rows={mockRows}
          columns={mockColumns}
          onRowSelectionModelChange={mockOnRowSelectionModelChange}
        />
      );

      const header = getByTestId("datagrid-header");
      const firstHeaderCell = within(header).getAllByTestId("datagrid-cell")[0];
      fireEvent.click(within(firstHeaderCell).getByRole("checkbox"));

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith<[Set<string>]>(
        new Set(mockRows.map((row) => row.id))
      );
    });

    it("calls onRowSelectionModelChange with an empty set if the header checkbox is clicked while all rows are selected", () => {
      const mockOnRowSelectionModelChange = jest.fn();
      const { getByTestId } = render(
        <DataGrid
          checkboxSelection
          rowSelectionModel={new Set(mockRows.map((row) => row.id))}
          rows={mockRows}
          columns={mockColumns}
          onRowSelectionModelChange={mockOnRowSelectionModelChange}
        />
      );

      const header = getByTestId("datagrid-header");
      const firstHeaderCell = within(header).getAllByTestId("datagrid-cell")[0];
      fireEvent.click(within(firstHeaderCell).getByRole("checkbox"));

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith<[Set<string>]>(
        new Set()
      );
    });

    it("calls onRowSelectionModelChange with the row id added to the existing set when selecting an unselected row", () => {
      const mockOnRowSelectionModelChange = jest.fn();
      const { getAllByTestId } = render(
        <DataGrid
          checkboxSelection
          rowSelectionModel={new Set([mockRows[0].id])}
          rows={mockRows}
          columns={mockColumns}
          onRowSelectionModelChange={mockOnRowSelectionModelChange}
        />
      );

      const secondRow = getAllByTestId("datagrid-row")[1];
      const firstCell = within(secondRow).getAllByTestId("datagrid-cell")[0];
      fireEvent.click(within(firstCell).getByRole("checkbox"));

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith<[Set<string>]>(
        new Set([mockRows[0].id, mockRows[1].id])
      );
    });

    it("calls onRowSelectionModelChange with the row id removed from the existing set when deselecting a selected row", () => {
      const mockOnRowSelectionModelChange = jest.fn();
      const { getAllByTestId } = render(
        <DataGrid
          checkboxSelection
          rowSelectionModel={new Set([mockRows[0].id, mockRows[1].id])}
          rows={mockRows}
          columns={mockColumns}
          onRowSelectionModelChange={mockOnRowSelectionModelChange}
        />
      );

      const secondRow = getAllByTestId("datagrid-row")[1];
      const firstCell = within(secondRow).getAllByTestId("datagrid-cell")[0];
      fireEvent.click(within(firstCell).getByRole("checkbox"));

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith<[Set<string>]>(
        new Set([mockRows[0].id])
      );
    });
  });
});
