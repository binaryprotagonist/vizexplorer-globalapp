import { SyntheticEvent, useRef, useState } from "react";
import { Box, Snackbar, SnackbarCloseReason, Typography, useTheme } from "@mui/material";
import { useOrgStageDatabaseQuery } from "generated-graphql";
import { DatabaseCredentials } from "./database-credentials";
import { GeneralDialog } from "../../../view/dialog";
import { useDeliveryMethod } from "@vizexplorer/global-ui-core";
import { FeedCredentials } from "./types";
import { slotFeedEndpoint } from "./utils";
import { copyToClipboard } from "../../../view/utils";

type Props = {
  onClose: VoidFunction;
};

export function CredentialsDialog({ onClose }: Props) {
  const theme = useTheme();
  const {
    data: orgData,
    error: orgErr,
    loading: loadingOrg
  } = useOrgStageDatabaseQuery({
    fetchPolicy: "no-cache"
  });
  const {
    isOnprem,
    loading: deliveryMethodLoading,
    error: deliveryMethodErr
  } = useDeliveryMethod();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const dialogContentRef = useRef();

  if (orgErr) throw orgErr;
  if (deliveryMethodErr) throw deliveryMethodErr;

  function onSnackClose(_: Event | SyntheticEvent, reason: SnackbarCloseReason) {
    if (reason !== "timeout") return;
    setShowSnackbar(false);
  }

  async function handleClickCopy(value: string) {
    await copyToClipboard(value, dialogContentRef.current);
    setShowSnackbar(true);
  }

  const stageDb = orgData?.org?.dataAdapter?.stageDb;
  const credentials: FeedCredentials | null = stageDb
    ? {
        orgId: orgData.org!.id,
        dbName: stageDb.databaseName,
        host: isOnprem ? window.location.hostname : stageDb.host,
        port: stageDb.port,
        username: stageDb.username,
        password: stageDb.password,
        slotFeedEndpoint: slotFeedEndpoint(orgData.org!.id)
      }
    : null;

  return (
    <>
      <Snackbar
        data-testid={"copy-clipboard-snackbar"}
        open={showSnackbar}
        autoHideDuration={1000}
        onClose={onSnackClose}
        message={"Copied to clipboard"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
      <GeneralDialog
        data-testid={"feed-credentials-dialog"}
        open={true}
        title={"Data Feed Credentials"}
        actions={[
          {
            variant: "contained",
            content: "Close",
            onClick: onClose,
            size: "large"
          }
        ]}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          minWidth={350}
          minHeight={200}
          padding={theme.spacing(1, 2)}
          ref={dialogContentRef}
        >
          <Typography
            variant={"h6"}
            align={"center"}
            mb={theme.spacing(3)}
            color={"hsla(222, 8%, 30%, 0.7)"}
          >
            Connection Details
          </Typography>
          <DatabaseCredentials
            credentials={credentials}
            loading={loadingOrg || !orgData?.org || deliveryMethodLoading}
            onClickCopy={handleClickCopy}
          />
        </Box>
      </GeneralDialog>
    </>
  );
}
