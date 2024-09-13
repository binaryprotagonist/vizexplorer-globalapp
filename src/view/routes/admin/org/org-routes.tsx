import { Navigate, Outlet, RouteObject, useNavigate } from "react-router-dom";
import { AdminDataFeed, HeatMapAssociations } from "../../../../admin";
import { UpdateManagement, ManageLicense } from "../../../../settings";
import {
  OnpremRouteProtect,
  RouteAuthorization,
  dataConnectionsRoutes,
  greetSettingsRoutes,
  hostGoalsRoutes,
  marketingListsRoutes,
  orgSettingsRoutes,
  pdreRoutes,
  propertiesRoutes,
  userManagementRoutes
} from "../../shared";
import { AdminSubscriptionRoutes } from "../subscription-routes";
import { useEnvironment } from "../../../hooks";
import { useEffect } from "react";

export const orgRoutes: RouteObject[] = [
  {
    path: "subscription/*",
    element: <AdminSubscriptionRoutes />
  },
  {
    element: <MatchingEnvRouteProtect />,
    children: [
      ...propertiesRoutes,
      ...orgSettingsRoutes("settings"),
      ...greetSettingsRoutes,
      ...userManagementRoutes,
      ...hostGoalsRoutes,
      ...marketingListsRoutes,
      ...dataConnectionsRoutes,
      ...pdreRoutes,
      {
        path: "data-feed",
        element: <AdminDataFeed />
      },
      {
        path: "heat-map-associations",
        element: (
          <RouteAuthorization route={"admin-heat-map-associations"}>
            <HeatMapAssociations />
          </RouteAuthorization>
        )
      },
      {
        element: <OnpremRouteProtect />,
        children: [
          {
            path: "license/manage",
            element: <ManageLicense />
          },
          {
            path: "update-management",
            element: <UpdateManagement />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate replace to={"subscription"} />
  }
];

function MatchingEnvRouteProtect() {
  const navigate = useNavigate();
  const {
    currentEnvironment,
    subscriptionEnvironment,
    loading: envLoading
  } = useEnvironment();

  const isMatchingEnv = currentEnvironment === subscriptionEnvironment;

  useEffect(() => {
    if (envLoading) return;

    if (!isMatchingEnv) {
      navigate("subscription", { replace: true });
    }
  }, [isMatchingEnv, envLoading]);

  if (envLoading || !isMatchingEnv) return null;

  return <Outlet />;
}
