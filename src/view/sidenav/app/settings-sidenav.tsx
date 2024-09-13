import { ReactNode } from "react";
import {
  SideNav,
  NavItem,
  useDeliveryMethod,
  MobileSideNav
} from "@vizexplorer/global-ui-core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PropertiesIcon,
  PersonalInfoIcon,
  SubscriptionIcon,
  DataConnectionIcon,
  SideNavLoading,
  SideNavProps,
  GreetSettingsIcon,
  HostGoalsIcon,
  MarketingListsIcon
} from "../shared";
import { BallotOutlined, Update as UpdateIcon } from "@mui/icons-material";
import { SvgIcon } from "@mui/material";
import { useCurrentUserQuery } from "generated-graphql";
import { ApplicationsNav } from "./applications-nav";
import { userHasRouteAuth } from "../../utils";
import { UserGroupsIcon } from "../shared/icons/user-groups-icon";

export function SettingsSidenav({ isMobile, isOpen, onClose }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnprem, loading: loadingIsOnprem } = useDeliveryMethod();
  const { data: curUserData, loading: loadingCurUser } = useCurrentUserQuery();

  if (loadingCurUser || loadingIsOnprem) {
    return <SideNavLoading isMobile={isMobile} isOpen={isOpen} onClose={onClose} />;
  }

  function handleNavItemClick(route: string) {
    navigate(route);
    if (isMobile) onClose();
  }

  function isActiveMenuItem(id: string) {
    return location.pathname.startsWith(id);
  }

  const currentUser = curUserData!.currentUser!;

  return (
    <>
      <span data-testid={"app-sidenav"} />
      <SideNavWrapper isMobile={isMobile} isOpen={isOpen} onClose={onClose}>
        <NavItem
          icon={<PersonalInfoIcon />}
          label={"Personal Info"}
          onClick={() => handleNavItemClick("personal-info")}
          active={isActiveMenuItem("/settings/personal-info")}
        />
        <NavItem
          icon={<SubscriptionIcon active={isActiveMenuItem("/settings/subscription")} />}
          label={"Subscription & Payment"}
          onClick={() => handleNavItemClick("subscription")}
          active={
            isActiveMenuItem("/settings/subscription") ||
            isActiveMenuItem("/settings/license")
          }
        />
        <NavItem
          icon={<PropertiesIcon active={isActiveMenuItem("/settings/properties")} />}
          label={"Property Management"}
          onClick={() => handleNavItemClick("properties")}
          active={isActiveMenuItem("/settings/properties")}
        />
        {userHasRouteAuth(currentUser, "org-settings") && (
          <NavItem
            icon={<SvgIcon component={BallotOutlined} viewBox="3 3 18 18" />}
            label={"Organization Settings"}
            onClick={() => handleNavItemClick("organization")}
            active={isActiveMenuItem("/settings/organization")}
          />
        )}
        {userHasRouteAuth(currentUser, "greet-settings") && (
          <NavItem
            icon={<GreetSettingsIcon />}
            label={"Greet Settings"}
            onClick={() => handleNavItemClick("greet")}
            active={isActiveMenuItem("/settings/greet")}
          />
        )}
        {isOnprem && (
          <>
            <NavItem
              icon={<SvgIcon component={UpdateIcon} viewBox="3 3 18 18" />}
              label={"Update Management"}
              onClick={() => handleNavItemClick("update-management")}
              active={isActiveMenuItem("/settings/update-management")}
            />
          </>
        )}
        {userHasRouteAuth(currentUser, "data-connections") && (
          <NavItem
            icon={<DataConnectionIcon />}
            label={"Data Connections"}
            onClick={() => handleNavItemClick("data-connections")}
            active={isActiveMenuItem("/settings/data-connections")}
          />
        )}
        <NavItem
          icon={<UserGroupsIcon />}
          label={"User Management"}
          onClick={() => handleNavItemClick("user-management")}
          active={isActiveMenuItem("/settings/user-management")}
        />
        {userHasRouteAuth(currentUser, "host-goals") && (
          <NavItem
            icon={<HostGoalsIcon />}
            label={"Host Goals"}
            onClick={() => handleNavItemClick("host-goals")}
            active={isActiveMenuItem("/settings/host-goals")}
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
        <ApplicationsNav
          navProps={{
            pdre: {
              hide: !userHasRouteAuth(currentUser, "pdre-settings")
            }
          }}
          isActiveMenuItem={isActiveMenuItem}
          onClick={handleNavItemClick}
        />
      </SideNavWrapper>
    </>
  );
}

type WrapperProps = SideNavProps & {
  children: ReactNode;
};

function SideNavWrapper({ isMobile, isOpen, onClose, children }: WrapperProps) {
  if (isMobile) {
    return (
      <MobileSideNav
        data-testid={"mobile-sidenav-wrapper"}
        open={isOpen}
        onClose={onClose}
        PaperProps={{ sx: { width: "70%" } }}
      >
        {children}
      </MobileSideNav>
    );
  }

  return <SideNav>{children}</SideNav>;
}
