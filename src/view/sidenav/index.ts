import { ReactElement } from "react";
import { isAdminBuild } from "../../utils";
import { AdminSidenav } from "./admin";
import { SettingsSidenav } from "./app/settings-sidenav";
import { SideNavProps } from "./shared";

export let SideNav: (props: SideNavProps) => ReactElement;
if (isAdminBuild()) {
  SideNav = AdminSidenav;
} else {
  SideNav = SettingsSidenav;
}
