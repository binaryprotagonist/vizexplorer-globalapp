import { useAuth } from "@vizexplorer/global-ui-core";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function Authenticate() {
  const location = useLocation();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <Navigate
        replace
        to={{ pathname: "/login", search: `next=${location.pathname}` }}
      />
    );
  }

  return <Outlet />;
}
