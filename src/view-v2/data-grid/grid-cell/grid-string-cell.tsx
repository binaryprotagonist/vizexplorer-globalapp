import { Box, outlinedInputClasses, styled } from "@mui/material";
import { TextField, Tooltip, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { CellMode, CellValueChange, Column, DataGridRecord } from "../types";
import { getRowId } from "../utils";
import { memo, useState } from "react";
import { useFnDebounce } from "../../../view/utils";

type Props<T extends DataGridRecord> = {
  mode: CellMode;
  column: Column<T>;
  row: T;
  onChange?: CellValueChange<T>;
};

function RawGridStringCell<T extends DataGridRecord>({
  mode,
  column,
  row,
  onChange
}: Props<T>) {
  const globalTheme = useGlobalTheme();

  const value = column.valueGetter
    ? column.valueGetter({ row })
    : column.field in row
      ? row[column.field]
      : "";

  if (mode === "edit") {
    return (
      <GridEditStringCell value={value} column={column} row={row} onChange={onChange} />
    );
  }

  if (!value) {
    const placeholderValue = column.valuePlaceholder?.({ id: getRowId(row) });

    if (placeholderValue) {
      return (
        <Box
          color={globalTheme.colors.grey[500]}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
          whiteSpace={"nowrap"}
        >
          {placeholderValue}
        </Box>
      );
    }
  }

  return (
    <Tooltip title={value} enterDelay={500} enterNextDelay={500} placement={"top"}>
      <Box overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
        {value}
      </Box>
    </Tooltip>
  );
}

export const GridStringCell = memo(RawGridStringCell) as typeof RawGridStringCell;

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root}`]: {
    fontSize: "14px",
    [`& .${outlinedInputClasses.input}`]: {
      padding: 0,
      // hide number spinner for chrome, safari, edge & opera
      ["::-webkit-inner-spin-button"]: {
        WebkitAppearance: "none",
        margin: 0
      }
    },
    // hide number spinner for firefox
    [`& .${outlinedInputClasses.input}[type=number]`]: {
      MozAppearance: "textfield"
    },
    [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      border: "none ",
      boxShadow: "none"
    },
    [`.${outlinedInputClasses.notchedOutline}`]: {
      border: "none ",
      boxShadow: "none"
    }
  }
});

type GridEditStringCellProps<T extends DataGridRecord> = {
  column: Column<T>;
  row: T;
  value: string;
  onChange?: CellValueChange<T>;
  onBlur?: VoidFunction;
};

function GridEditStringCell<T extends DataGridRecord>({
  column,
  row,
  value,
  onChange,
  onBlur
}: GridEditStringCellProps<T>) {
  const [editingValue, setEditingValue] = useState<string>(value);
  const debounceFn = useFnDebounce();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedValue = column.valueParser?.(e.target.value) ?? e.target.value;
    setEditingValue(parsedValue);

    if (!onChange) return;
    debounceFn(() => {
      onChange({ column, row, value: parsedValue });
    }, 200);
  }

  return (
    <StyledTextField
      autoFocus
      data-testid={"datagrid-cell-edit"}
      value={editingValue}
      {...(column.type === "number" && {
        type: "number",
        inputProps: {
          inputMode: "numeric"
        }
      })}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
}
