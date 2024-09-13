import { RouteObject } from "react-router-dom";
import { UserManagement } from "../../../settings";

export const userManagementRoutes: RouteObject[] = [
  {
    path: "user-management",
    element: <UserManagement />
  }
];
