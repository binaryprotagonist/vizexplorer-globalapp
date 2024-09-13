import { MTableBodyRow } from "@material-table/core";
import { styled } from "@mui/material";

type TableRowPropsEtx = {
  paging?: boolean;
};

export const TableRow = styled(MTableBodyRow, {
  shouldForwardProp: (prop) => prop !== "paging"
})<TableRowPropsEtx>(({ paging }) => ({
  // Remove border from last row if paging is disabled to avoid double border
  ...(!paging && {
    "&:last-child td, &:last-child th": {
      border: 0
    }
  })
}));
