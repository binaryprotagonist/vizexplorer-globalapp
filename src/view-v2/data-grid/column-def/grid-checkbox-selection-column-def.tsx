import { GridCheckboxSelectionCell } from "../grid-cell";
import { GridHeaderCheckboxSelectionCell } from "../grid-header";
import { Column } from "../types";

// Custom column definition for `checkboxSelection` prop
export const GRID_CHECKBOX_SELECTION_COLUMN_DEF: Column = {
  type: "custom",
  field: "__vod_checkbox__",
  width: 75,
  justifyContent: "center",
  renderCell: (props) => <GridCheckboxSelectionCell {...props} />,
  renderHeader: () => <GridHeaderCheckboxSelectionCell />
};
