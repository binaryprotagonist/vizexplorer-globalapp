import { RouteObject } from "react-router-dom";
import { RouteAuthorization } from "./route-authorization";
import { OrgSettings } from "../../../settings";

// path is different between app and admin build
export function orgSettingsRoutes(path: string): RouteObject[] {
  return [
    {
      path,
      element: (
        <RouteAuthorization route={"org-settings"}>
          <OrgSettings />
        </RouteAuthorization>
      )
    }
  ];
}
