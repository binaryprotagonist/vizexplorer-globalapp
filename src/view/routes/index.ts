import { RouteObject } from "react-router-dom";
import { isAdminBuild } from "../../utils";
import { adminRoutes } from "./admin";
import { appRoutes } from "./app";

export let routes: RouteObject[];
if (isAdminBuild()) {
  routes = adminRoutes;
} else {
  routes = appRoutes;
}
