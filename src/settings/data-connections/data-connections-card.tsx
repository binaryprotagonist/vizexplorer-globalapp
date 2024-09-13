import { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AppSwitcher } from "./app-switcher";
import { AppOption } from "./types";
import { Card, PlainCardHeader } from "../../view/card";
import { DirectDataConnection } from "./direct-data-connection";
import { AppId, useCurrentUserQuery } from "generated-graphql";
import { buildAppOptions } from "./utils";
import { sortArray } from "../../view/utils";

export function DataConnectionsCard() {
  const theme = useTheme();
  const [selectedApp, setSelectedApp] = useState<AppOption | null>(null);
  const {
    data: curUserData,
    loading: curUserLoading,
    error: curUserError
  } = useCurrentUserQuery();

  const currentUser = curUserData?.currentUser;
  const appOptions = useMemo<AppOption[]>(() => {
    if (!currentUser) return [];
    const options = buildAppOptions(currentUser);
    return sortArray(options);
  }, [currentUser]);

  useEffect(() => {
    if (selectedApp || !appOptions.length) return;
    setSelectedApp(appOptions[0]);
  }, [appOptions, selectedApp]);

  if (curUserError) throw curUserError;

  return (
    <Card>
      <PlainCardHeader>
        <Typography variant={"h6"}>Data Connections</Typography>
      </PlainCardHeader>
      <Box>
        <Box padding={theme.spacing(0, 0, 2, 3)}>
          <AppSwitcher
            selected={selectedApp}
            options={appOptions}
            onChange={(app) => setSelectedApp(app)}
            loading={curUserLoading && !selectedApp}
          />
        </Box>
        <DirectDataConnection appId={AppId.Pdr} />
      </Box>
    </Card>
  );
}
