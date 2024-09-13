import { useState } from "react";
import { Box, styled, Typography } from "@mui/material";
import { Footer, useDeliveryMethod, AppSwitcher } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { SideNav } from "../../sidenav";
import { useCurrentOrgSummaryQuery } from "generated-graphql";
import { ContainerProps } from "../types";
import { AdminHeader } from "../../header";
import { Link } from "react-router-dom";
import { AdminAvatar } from "../../admin/avatar";
import { useMobileQuery } from "../../hooks";

const StyledOrgContainer = styled(Box)(({ theme }) => ({
  [`@media (min-width: ${theme.breakpoints.values.sm}px)`]: {
    position: "absolute",
    left: "50%",
    marginRight: "0 !important"
  },
  display: "flex",
  alignItems: "center"
}));

type ContainerWrapperProps = {
  orgCtx?: boolean;
};

export function AdminContainer({
  orgCtx = true,
  children
}: ContainerProps & ContainerWrapperProps) {
  const Container = orgCtx ? AdminContainerWithOrgCtx : AdminContainerWithoutOrgCtx;

  return (
    <>
      <span data-testid={"admin-app-container"} />
      <Container>{children}</Container>
    </>
  );
}

/**
 * Container when operating within the context of an Org
 * Includes SideNav and Org Switch link
 */
function AdminContainerWithOrgCtx({ children }: ContainerProps) {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const { isMobile } = useMobileQuery();
  const {
    data: orgData,
    loading: orgLoading,
    error: orgErr
  } = useCurrentOrgSummaryQuery();
  const {
    isOnprem,
    loading: deliveryMethodLoading,
    error: deliveryMethodErr
  } = useDeliveryMethod();

  if (orgErr) throw orgErr;
  if (deliveryMethodErr) throw deliveryMethodErr;

  return (
    <>
      <AdminHeader showBurger={isMobile} onBurgerClick={() => setSidenavOpen(true)}>
        {!orgLoading && !deliveryMethodLoading && (
          <StyledOrgContainer>
            <Typography variant={"h6"}>
              {orgData?.currentOrg?.company?.name || "(Unknown Org Name)"}
            </Typography>
            {!isOnprem && (
              <Box ml={"16px"}>
                <Link to={"/org"}>Change</Link>
              </Box>
            )}
          </StyledOrgContainer>
        )}
        <AppSwitcher />
        <AdminAvatar />
      </AdminHeader>
      <ThemeProvider>
        <Box display={"flex"} flex={1} overflow={"hidden"}>
          <SideNav
            isMobile={isMobile}
            isOpen={sidenavOpen}
            dataAdapterAllowed={orgData?.currentOrg?.dataAdapterAllowed || false}
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
 * Container when operating outside the context of an Org
 */
export function AdminContainerWithoutOrgCtx({ children }: ContainerProps) {
  return (
    <>
      <AdminHeader>
        <AdminAvatar />
      </AdminHeader>
      <ThemeProvider>
        <Box display={"flex"} flex={1} overflow={"hidden"}>
          {children}
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
}
