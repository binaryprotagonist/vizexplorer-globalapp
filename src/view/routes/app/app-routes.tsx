import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { Home } from "../../../home";
import { Unauthorized } from "../../../unauthorized";
import { Login } from "../../../login";
import {
  Authenticate,
  SharedSubscriptionRoutes,
  AppLayout,
  AuthBasedLayout,
  AppRootRoute,
  OnpremRouteProtect,
  hostGoalsRoutes,
  propertiesRoutes,
  orgSettingsRoutes,
  greetSettingsRoutes,
  userManagementRoutes,
  dataConnectionsRoutes,
  pdreRoutes,
  marketingListsRoutes
} from "../shared";
import { ManageLicense, UpdateManagement } from "../../../settings";
import { PersonalInfoRoutes } from "./personal-info";
import { useEffect } from "react";

export const appRoutes: RouteObject[] = [
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
            path: "/",
            element: <Home />
          },
          {
            path: "unauthorized",
            element: <Unauthorized />
          }
        ]
      },
      {
        path: "settings/*",
        element: <SettingsRoute />,
        children: [
          {
            element: <Authenticate />,
            children: [
              {
                element: <AppLayout />,
                children: [
                  {
                    path: "personal-info/*",
                    element: <PersonalInfoRoutes />
                  },
                  {
                    path: "subscription/*",
                    element: <SharedSubscriptionRoutes />
                  },
                  ...propertiesRoutes,
                  ...greetSettingsRoutes,
                  ...userManagementRoutes,
                  ...hostGoalsRoutes,
                  ...marketingListsRoutes,
                  ...dataConnectionsRoutes,
                  ...pdreRoutes,
                  ...orgSettingsRoutes("organization"),
                  {
                    index: true,
                    element: <Navigate to={"personal-info"} />
                  }
                ]
              }
            ]
          },
          {
            element: <OnpremRouteProtect />,
            children: [
              {
                element: <Authenticate />,
                children: [
                  {
                    element: <AppLayout />,
                    children: [
                      {
                        path: "update-management",
                        element: <UpdateManagement />
                      }
                    ]
                  }
                ]
              },
              {
                element: <AuthBasedLayout />,
                children: [
                  {
                    path: "license/manage",
                    element: <ManageLicense />
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

function SettingsRoute() {
  useEffect(() => {
    document.title = "Account Settings";
  }, []);

  return <Outlet />;
}
