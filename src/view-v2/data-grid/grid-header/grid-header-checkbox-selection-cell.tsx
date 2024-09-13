import { Checkbox } from "@vizexplorer/global-ui-v2";
import { useDataGridContext } from "../context";
import { getRowId } from "../utils";

// Component specifically to handle `checkboxSelection` prop. Not for general use.
export function GridHeaderCheckboxSelectionCell() {
  const {
    rows,
    rowSelectionModel,
    disableAllCheckboxSelection,
    onRowSelectionModelChange
  } = useDataGridContext();
  const checked = rowSelectionModel?.size === rows.length;

  return (
    <Checkbox
      checked={checked}
      disabled={disableAllCheckboxSelection}
      size={"small"}
      onChange={(_, checked) => {
        if (!onRowSelectionModelChange || disableAllCheckboxSelection) return;
        onRowSelectionModelChange(checked ? new Set(rows.map(getRowId)) : new Set());
      }}
    />
  );
}
