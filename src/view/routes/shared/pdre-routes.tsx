import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import { Pdre } from "../../../settings";

export const pdreRoutes: RouteObject[] = [
  {
    path: "pdre",
    element: (
      <RouteAuthorization route={"pdre-settings"}>
        <Pdre />
      </RouteAuthorization>
    )
  }
];
