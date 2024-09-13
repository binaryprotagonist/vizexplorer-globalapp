import { useDeliveryMethod } from "@vizexplorer/global-ui-core";
import { Navigate, Outlet } from "react-router-dom";

export function OnpremRouteProtect() {
  const { isOnprem, loading } = useDeliveryMethod();

  if (loading) return null;

  if (!isOnprem) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
}
