import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const TableButton = styled(Button)({
  textTransform: "none",
  textDecoration: "none",
  width: "max-content",
  height: "fit-content",
  minWidth: 0,
  "&:hover": {
    textDecoration: "none",
    background: "none"
  }
});
