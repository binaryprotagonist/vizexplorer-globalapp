import styled from "@emotion/styled";
import { Box, Paper, PaperProps, Typography, lighten } from "@mui/material";

export const BlueCardHeader = styled("div")(({ theme }) => ({
  background: "hsla(205, 100%, 46%, 0.08)",
  borderTopLeftRadius: "inherit",
  borderTopRightRadius: "inherit",
  padding: theme.spacing(2)
}));

export const PlainCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minHeight: "64px",
  padding: theme.spacing(0, 2)
}));

export function Card(props: PaperProps) {
  return (
    <Paper elevation={1} {...props}>
      {props.children}
    </Paper>
  );
}

export const Field = styled(Box)`
  display: grid;
  grid-template-columns: 100px auto;
  min-height: 50px;
  align-items: center;
`;

export const FieldTitle = styled(Typography)`
  color: ${({ theme }) => lighten(theme.palette.text.primary, 0.2)};
  font-size: 0.8rem;
  text-transform: uppercase;
`;
