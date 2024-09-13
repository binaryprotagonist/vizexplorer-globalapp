import { css } from "@emotion/react";
import { Box, Paper, styled, Theme } from "@mui/material";

// TODO simplify and improve selector
// Add padding to the first and last element in table header and body rows
const rootStyle = (theme: Theme) =>
  css({
    "& thead > tr > th:first-of-type, tbody > tr > td:first-of-type": {
      paddingLeft: "30px !important"
    },
    "& thead > tr > th:last-of-type, tbody > tr > td:last-of-type": {
      paddingRight: "30px !important"
    },
    "& td > div > span:not(span:last-of-type)": {
      marginRight: theme.spacing(4)
    }
  });

export function TableContainer(props: any) {
  return <Paper elevation={1} css={rootStyle} {...props} />;
}

// When centering row data on material table, it will mis-align with the header as the header
// is made up of text + sorting icon. This mimics the header style for the wrapped value so it
// centers correctly
// Not required if sorting is disabled
export const CenteredCell = styled(Box)({
  display: "grid",
  gridTemplateColumns: "auto 26px"
});
