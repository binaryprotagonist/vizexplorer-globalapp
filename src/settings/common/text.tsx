import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export const OverflowText = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});
