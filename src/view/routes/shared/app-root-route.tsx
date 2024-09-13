import { RecoilRoot } from "recoil";
import { ErrorBoundary } from "../../error-boundary";
import { styled } from "@mui/material";
import { ConfigProvider } from "../../config";
import { GlobalContainer } from "../../container";
import { PendoProvider } from "../../pendo";
import { UnsecureClientProvider } from "../../graphql";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AlertProvider } from "view-v2/alert";
import { Outlet } from "react-router-dom";
import { SisenseProvider } from "view-v2/sisense";

const RootContainer = styled("div")`
  background: #f9f9f9;
  overflow: hidden;
`;

const SisenseAppContainer = styled("div")({
  overflow: "hidden",
  // TODO not super ideal. Without this, sisense will apply `Open Sans` font family to components of the application
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif, "Open Sans" !important'
});

export function AppRootRoute() {
  return (
    <SisenseAppContainer id="sisenseApp">
      <RecoilRoot>
        <ErrorBoundary>
          <RootContainer>
            <ConfigProvider>
              <SisenseProvider>
                <GlobalContainer>
                  <PendoProvider>
                    <UnsecureClientProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <AlertProvider>
                          <Outlet />
                        </AlertProvider>
                      </LocalizationProvider>
                    </UnsecureClientProvider>
                  </PendoProvider>
                </GlobalContainer>
              </SisenseProvider>
            </ConfigProvider>
          </RootContainer>
        </ErrorBoundary>
      </RecoilRoot>
    </SisenseAppContainer>
  );
}
