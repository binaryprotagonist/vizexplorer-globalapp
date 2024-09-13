import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import { Greet } from "../../../settings";

export const greetSettingsRoutes: RouteObject[] = [
  {
    path: "greet",
    element: (
      <RouteAuthorization route={"greet-settings"}>
        <Greet />
      </RouteAuthorization>
    )
  }
];
