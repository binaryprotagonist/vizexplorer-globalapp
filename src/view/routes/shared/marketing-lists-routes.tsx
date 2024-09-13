import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import React, { Suspense } from "react";

const MarketingLists = React.lazy(() => import("../../../settings/marketing-lists"));
const MarketingListCreate = React.lazy(
  () =>
    import(
      "../../../settings/marketing-lists/manage-marketing-list/marketing-list-create"
    )
);

export const marketingListsRoutes: RouteObject[] = [
  {
    path: "marketing-lists/*",
    element: <RouteAuthorization route={"marketing-lists"} />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <MarketingLists />
          </Suspense>
        )
      },
      {
        path: "sites/:siteId/new",
        element: (
          <Suspense fallback={null}>
            <MarketingListCreate />
          </Suspense>
        )
      }
    ]
  }
];
