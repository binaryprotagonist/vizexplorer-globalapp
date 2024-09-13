import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute, userHasRouteAuth } from "../../utils";
import { useCurrentUserQuery } from "generated-graphql";

type Props = {
  route: ProtectedRoute;
  children?: React.ReactElement;
};

export function RouteAuthorization({ route, children }: Props) {
  const { data: curUser, loading, error } = useCurrentUserQuery();

  if (loading) return null;

  if (error) throw error;
  if (!curUser?.currentUser) throw Error("Failed to load current user");

  if (!userHasRouteAuth(curUser.currentUser, route)) {
    return <Navigate to={"/"} />;
  }

  if (!children) {
    return <Outlet />;
  }

  return children;
}
