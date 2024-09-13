import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";

type Props = {
  title: string;
  message: string;
};

export function BoundaryErrorMessage({ title, message }: Props) {
  const theme = useTheme();

  return (
    <Box textAlign={"center"} m={theme.spacing(2)}>
      <Typography gutterBottom variant={"h4"}>
        {title}
      </Typography>
      <Typography variant={"h6"}>{message}</Typography>
    </Box>
  );
}

export const ErrorContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: "600px",
  width: "100%",
  alignItems: "center",
  margin: theme.spacing(2, "auto")
}));
