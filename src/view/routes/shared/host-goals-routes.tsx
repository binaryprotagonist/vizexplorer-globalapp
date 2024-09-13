import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import { HostGoalCreate, HostGoalEdit, HostGoals } from "../../../settings";
import React, { Suspense } from "react";

const HostGoalProgramDashboard = React.lazy(
  () => import("../../../settings/host-goals/program-dashboard")
);

export const hostGoalsRoutes: RouteObject[] = [
  {
    path: "host-goals/*",
    element: <RouteAuthorization route={"host-goals"} />,
    children: [
      {
        index: true,
        element: <HostGoals />
      },
      {
        path: "sites/:siteId/new",
        element: <HostGoalCreate />
      },
      {
        path: "sites/:siteId/programs/:programId/edit",
        element: <HostGoalEdit />
      },
      {
        path: "sites/:siteId/programs/:programId/duplicate",
        element: <HostGoalCreate />
      },
      {
        path: "sites/:siteId/programs/:programId/dashboard",
        element: (
          <Suspense fallback={<div />}>
            <HostGoalProgramDashboard />
          </Suspense>
        )
      }
    ]
  }
];
