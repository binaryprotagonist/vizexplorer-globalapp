import {
  ApplicationConfig,
  ApplicationTheme,
  AuthProvider,
  GraphqlProvider,
  useAuthConfigDiscovery
} from "@vizexplorer/global-ui-core";
import { globalTheme } from "../../../theme";
import { Box } from "@mui/material";
import { applicationId } from "../../../utils";
import { cacheConfig, defaultOptions } from "../../graphql";

type Props = {
  children: React.ReactNode;
};

export function GlobalContainer({ children }: Props) {
  const appId = applicationId();
  const { data, error } = useAuthConfigDiscovery(appId);

  if (error) throw error;

  return (
    <AuthProvider config={data.config}>
      <GraphqlProvider client={{ cacheConfig, defaultOptions }}>
        <ApplicationConfig applicationId={appId} rememberApp>
          <ApplicationTheme theme={globalTheme}>
            <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
              {children}
            </Box>
          </ApplicationTheme>
        </ApplicationConfig>
      </GraphqlProvider>
    </AuthProvider>
  );
}
