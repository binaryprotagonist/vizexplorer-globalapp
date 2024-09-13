import { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { CredentialsDialog } from "./credentials-dialog";
import { Card, PlainCardHeader } from "../../view/card";

export function Credentials() {
  const theme = useTheme();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <Card data-testid={"feed-credentials"}>
      {showDialog && <CredentialsDialog onClose={() => setShowDialog(false)} />}
      <PlainCardHeader>
        <Typography variant={"h6"}>Data Feed Credentials</Typography>
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)}>
        <Button variant={"contained"} onClick={() => setShowDialog(true)}>
          Show Credentials
        </Button>
      </Box>
    </Card>
  );
}
