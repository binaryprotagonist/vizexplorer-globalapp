import { Checkbox } from "@vizexplorer/global-ui-v2";
import { useDataGridContext } from "../context";
import { DataGridRecord, RenderCellProps } from "../types";
import { getRowId } from "../utils";

// Component specifically to handle `checkboxSelection` prop. Not for general checkbox use.
export function GridCheckboxSelectionCell<T extends DataGridRecord>({
  row
}: RenderCellProps<T>) {
  const { rowSelectionModel, disableAllCheckboxSelection, onRowSelectionModelChange } =
    useDataGridContext();
  const checked = rowSelectionModel?.has(getRowId(row));

  return (
    <Checkbox
      checked={checked}
      disabled={disableAllCheckboxSelection}
      size={"small"}
      onChange={(_, checked) => {
        if (!onRowSelectionModelChange) return;

        const currentSelection = new Set(rowSelectionModel);
        if (checked) {
          currentSelection.add(getRowId(row));
          onRowSelectionModelChange(currentSelection);
        } else {
          currentSelection.delete(getRowId(row));
          onRowSelectionModelChange(currentSelection);
        }
      }}
    />
  );
}
