import { Box, Skeleton } from "@mui/material";
import { Tab, Tabs, Typography } from "@vizexplorer/global-ui-v2";
import { GreetRules } from "./rules";
import { useState } from "react";
import { SystemSettings } from "./system-settings";
import { useCurrentUserQuery } from "generated-graphql";
import { NetworkStatus } from "@apollo/client";
import { GREET_VIEWS, GreetView } from "./types";
import { canAccessGreetView, greetSettingsTabLabel } from "./utils";
import { PageContainer } from "view-v2/page";

export function Greet() {
  const [view, setView] = useState<GreetView>("greet-rules");

  const {
    data: curUserData,
    error: curUserErr,
    networkStatus: curUserNetworkStatus
  } = useCurrentUserQuery();

  const curUser = curUserData?.currentUser;
  const loadingCurUser = curUserNetworkStatus === NetworkStatus.loading;
  const greetViews = curUser
    ? GREET_VIEWS.filter((type) => canAccessGreetView(type, curUser))
    : [];

  if (curUserErr) throw curUserErr;

  return (
    <PageContainer overflow={"auto"}>
      <Typography variant={"h1"} fontWeight={700} mb={2}>
        Greet Settings
      </Typography>

      {loadingCurUser ? (
        <Skeleton variant={"rounded"}>
          <ViewToggle data-testid={"view-tabs-loading"} options={[...GREET_VIEWS]} />
        </Skeleton>
      ) : (
        greetViews.length > 1 && (
          <ViewToggle
            data-testid={"view-tabs"}
            view={view}
            options={greetViews}
            onChange={setView}
          />
        )
      )}

      <Box mt={2}>{view === "greet-rules" ? <GreetRules /> : <SystemSettings />}</Box>
    </PageContainer>
  );
}

type ViewToggleProps = {
  view?: GreetView;
  options?: GreetView[];
  onChange?: (view: GreetView) => void;
};

function ViewToggle({ view, onChange, options = [], ...rest }: ViewToggleProps) {
  return (
    <Box>
      <Tabs
        value={view ?? options[0]}
        onChange={(_, value) => onChange?.(value)}
        {...rest}
      >
        {options.map((type) => (
          <Tab
            key={`setting-type-${type}`}
            data-testid={`setting-type-tab-${type}`}
            label={greetSettingsTabLabel(type)}
            value={type}
            sx={{ minWidth: "263px" }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
