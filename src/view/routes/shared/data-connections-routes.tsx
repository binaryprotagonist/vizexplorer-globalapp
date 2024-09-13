import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import { DataConnections } from "../../../settings";

export const dataConnectionsRoutes: RouteObject[] = [
  {
    path: "data-connections",
    element: (
      <RouteAuthorization route={"data-connections"}>
        <DataConnections />
      </RouteAuthorization>
    )
  }
];
