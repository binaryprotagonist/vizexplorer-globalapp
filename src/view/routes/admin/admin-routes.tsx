import { useEffect } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { OrgSelection } from "../../../admin/org";
import { Login } from "../../../login";
import { Unauthorized } from "../../../unauthorized";
import { AppRootRoute, Authenticate } from "../shared";
import { ErrorBoundaryAppRoute, ErrorBoundaryPageRoute } from "./error-boundary";
import { OrgRouteManager, orgRoutes } from "./org";

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminRootRoute />,
    children: [
      {
        element: <AppRootRoute />,
        children: [
          {
            path: "login",
            element: <Login />
          },
          {
            element: <Authenticate />,
            children: [
              {
                element: <ErrorBoundaryAppRoute />,
                children: [
                  {
                    path: "org/*",
                    children: [
                      {
                        index: true,
                        element: <OrgSelection />
                      },
                      {
                        path: ":orgId/*",
                        element: <OrgRouteManager />,
                        children: [
                          {
                            element: <ErrorBoundaryPageRoute />,
                            children: [
                              {
                                path: "*",
                                children: orgRoutes
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: "unauthorized",
                    element: <Unauthorized />
                  }
                ]
              },
              {
                index: true,
                element: <Navigate to={"/org"} />
              }
            ]
          }
        ]
      }
    ]
  }
];

function AdminRootRoute() {
  useEffect(() => {
    document.title = "VizExplorer Admin";
  }, []);

  return <Outlet />;
}
