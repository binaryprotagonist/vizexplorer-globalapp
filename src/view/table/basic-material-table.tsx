import { forwardRef } from "react";
import MaterialTable, { MaterialTableProps } from "@material-table/core";
import {
  ArrowDownward,
  ChevronLeft,
  ChevronRight,
  Clear,
  FilterList,
  FirstPage,
  LastPage,
  Search
} from "@mui/icons-material";

const tableIcons = {
  Clear: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  ))
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function BasicMaterialTable<RowData extends object>(
  props: MaterialTableProps<RowData>
) {
  const { icons, ...other } = props;

  return <MaterialTable icons={{ ...tableIcons, ...icons }} {...other} />;
}
