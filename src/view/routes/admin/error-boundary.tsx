import { Outlet } from "react-router-dom";
import { AdminAppErrorBoundary, AdminPageErrorBoundary } from "../../error-boundary";

export function ErrorBoundaryAppRoute() {
  return (
    <AdminAppErrorBoundary>
      <Outlet />
    </AdminAppErrorBoundary>
  );
}

export function ErrorBoundaryPageRoute() {
  return (
    <AdminPageErrorBoundary>
      <Outlet />
    </AdminPageErrorBoundary>
  );
}
