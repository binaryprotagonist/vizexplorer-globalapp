import React from "react";
import {
  SideNav,
  NavItem,
  LayeredNavItem,
  MobileSideNav
} from "@vizexplorer/global-ui-core";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  PropertiesIcon,
  SubscriptionIcon,
  DataConnectionIcon,
  SideNavLoading,
  SideNavProps,
  GreetSettingsIcon,
  UserGroupsIcon,
  HostGoalsIcon,
  MarketingListsIcon
} from "../shared";
import SettingsIcon from "@mui/icons-material/Settings";
import BallotOutlined from "@mui/icons-material/BallotOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import { Box, SvgIcon } from "@mui/material";
import { AdminApplicationsNav } from "./applications-nav";
import { useCurrentUserQuery } from "generated-graphql";
import { useEnvironment } from "../../hooks";
import { isCloud } from "../../../settings/subscription";
import { Grain } from "@mui/icons-material";
import { userHasRouteAuth } from "../../utils";

export function AdminSidenav({
  isMobile,
  isOpen,
  onClose,
  dataAdapterAllowed
}: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: curUserData,
    loading: loadingCurUser,
    error: curUserErr
  } = useCurrentUserQuery();
  const {
    currentEnvironment,
    subscriptionEnvironment,
    loading: envLoading,
    error: envErr
  } = useEnvironment();

  function isActiveMenuItem(id: string) {
    return !!matchPath(`/org/:orgId/${id}/*`, location.pathname);
  }

  if (curUserErr) throw curUserErr;
  if (envErr) throw envErr;

  if (loadingCurUser || envLoading) {
    return <SideNavLoading isMobile={isMobile} isOpen={isOpen} onClose={onClose} />;
  }

  function handleNavItemClick(route: string) {
    navigate(route);
    if (isMobile) onClose();
  }

  if (currentEnvironment !== subscriptionEnvironment) {
    return (
      <SideNavContainer isMobile={isMobile} isOpen={isOpen} onClose={onClose}>
        <NavItem
          icon={<SubscriptionIcon active={isActiveMenuItem("subscription")} />}
          label={"Subscription & Payment"}
          onClick={() => handleNavItemClick("subscription")}
          active={isActiveMenuItem("subscription")}
        />
      </SideNavContainer>
    );
  }

  const currentUser = curUserData!.currentUser!;

  return (
    <SideNavContainer isMobile={isMobile} isOpen={isOpen} onClose={onClose}>
      <NavItem
        icon={<SubscriptionIcon active={isActiveMenuItem("subscription")} />}
        label={"Subscription & Payment"}
        onClick={() => handleNavItemClick("subscription")}
        active={isActiveMenuItem("subscription")}
      />
      <NavItem
        icon={<PropertiesIcon active={isActiveMenuItem("properties")} />}
        label={"Property Management"}
        onClick={() => handleNavItemClick("properties")}
        active={isActiveMenuItem("properties")}
      />
      {userHasRouteAuth(currentUser, "org-settings") && (
        <NavItem
          icon={<SvgIcon component={BallotOutlined} viewBox="3 3 18 18" />}
          label={"Organization Settings"}
          onClick={() => handleNavItemClick("settings")}
          active={isActiveMenuItem("settings")}
        />
      )}
      {userHasRouteAuth(currentUser, "greet-settings") && (
        <NavItem
          icon={<GreetSettingsIcon />}
          label={"Greet Settings"}
          onClick={() => handleNavItemClick("greet")}
          active={isActiveMenuItem("greet")}
        />
      )}
      {!isCloud(currentEnvironment) && (
        <NavItem
          icon={<SvgIcon component={UpdateIcon} viewBox="3 3 18 18" />}
          label={"Update Management"}
          onClick={() => handleNavItemClick("update-management")}
          active={isActiveMenuItem("update-management")}
        />
      )}
      {userHasRouteAuth(currentUser, "data-connections") && (
        <NavItem
          icon={<DataConnectionIcon />}
          label={"Data Connections"}
          onClick={() => handleNavItemClick("data-connections")}
          active={isActiveMenuItem("data-connections")}
        />
      )}
      <NavItem
        icon={<UserGroupsIcon />}
        label={"User Management"}
        onClick={() => handleNavItemClick("user-management")}
        active={isActiveMenuItem("user-management")}
      />
      {userHasRouteAuth(currentUser, "host-goals") && (
        <NavItem
          icon={<HostGoalsIcon />}
          label={"Host Goals"}
          onClick={() => handleNavItemClick("host-goals")}
          active={isActiveMenuItem("host-goals")}
        />
      )}
      {userHasRouteAuth(currentUser, "marketing-lists") && (
        <NavItem
          icon={<MarketingListsIcon />}
          label={"Marketing Lists"}
          onClick={() => handleNavItemClick("marketing-lists")}
          active={isActiveMenuItem("/settings/marketing-lists")}
        />
      )}
      <AdminApplicationsNav
        isActiveMenuItem={isActiveMenuItem}
        onClick={handleNavItemClick}
        navProps={{
          pdre: {
            hide: !userHasRouteAuth(currentUser, "pdre-settings")
          }
        }}
      />
      <Box marginTop={"8px"}>
        <LayeredNavItem title={"Administration"}>
          {dataAdapterAllowed && (
            <NavItem
              icon={<SvgIcon component={SettingsIcon} viewBox="2 2 19 20" />}
              label={"Data Feed"}
              onClick={() => handleNavItemClick("data-feed")}
              active={isActiveMenuItem("data-feed")}
            />
          )}
          {userHasRouteAuth(currentUser, "admin-heat-map-associations") && (
            <NavItem
              icon={<Grain />}
              label={"Heat Map Associations"}
              onClick={() => handleNavItemClick("heat-map-associations")}
              active={isActiveMenuItem("heat-map-associations")}
            />
          )}
        </LayeredNavItem>
      </Box>
    </SideNavContainer>
  );
}

type ContainerProps = SideNavProps & {
  children: React.ReactNode;
};

function SideNavContainer({ isMobile, isOpen, onClose, children }: ContainerProps) {
  if (isMobile) {
    return (
      <>
        <span data-testid={"admin-sidenav"} />
        <MobileSideNav
          data-testid={"admin-mobile-sidenav"}
          open={isOpen}
          onClose={onClose}
          PaperProps={{ sx: { width: "70%" } }}
        >
          {children}
        </MobileSideNav>
      </>
    );
  }

  return (
    <>
      <span data-testid={"admin-sidenav"} />
      <SideNav>{children}</SideNav>
    </>
  );
}
