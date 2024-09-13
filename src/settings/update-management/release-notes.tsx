import { Box, Typography, useTheme } from "@mui/material";
import { Card, PlainCardHeader } from "../../view/card";
import { marked } from "marked";
import parse from "html-react-parser";

type Props = {
  notes: string;
};

export function ReleaseNotes({ notes }: Props) {
  const theme = useTheme();

  return (
    <Card data-testid={"release-notes"}>
      <PlainCardHeader>
        <Typography variant={"h6"}>Release Notes</Typography>
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)} sx={{ wordBreak: "break-all" }}>
        {parse(marked(notes))}
      </Box>
    </Card>
  );
}
