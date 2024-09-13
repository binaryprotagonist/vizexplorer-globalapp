import { useState } from "react";
import { Footer, Header as GlobalHeader } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { SettingsLogo } from "../../header/shared/icons";
import { SideNav } from "../../sidenav";
import { Box } from "@mui/material";
import { ContainerProps } from "../types";
import { AppHeader } from "../../header";
import { useLocation, useNavigate } from "react-router-dom";
import { useMobileQuery } from "../../hooks";

export function Container({ children }: ContainerProps) {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const { isMobile } = useMobileQuery();

  return (
    <>
      <span data-testid={"app-container"} />
      <AppHeader
        logo={<SettingsLogo />}
        showBurger={isMobile}
        onBurgerClick={() => setSidenavOpen(true)}
      />
      <ThemeProvider>
        <Box display={"flex"} flex={1} overflow={"hidden"}>
          <SideNav
            isMobile={isMobile}
            isOpen={sidenavOpen}
            onClose={() => setSidenavOpen(false)}
          />
          {children}
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
}

/**
 * Container which doesn't require user to be authenticated
 */
export function GuestContainer({ children }: ContainerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogoClick() {
    if (!location.pathname.startsWith("/settings")) return;
    navigate("/settings");
  }

  return (
    <>
      <GlobalHeader logo={<SettingsLogo />} onLogoClick={handleLogoClick} />
      <Box display={"flex"} flex={1}>
        <ThemeProvider>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flex={1}>
            {children}
          </Box>
        </ThemeProvider>
      </Box>
      <Footer />
    </>
  );
}
