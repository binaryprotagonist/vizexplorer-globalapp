import { Route } from "react-router-dom";
import { AddSubscription } from "../../../settings/subscription/subscriptions/admin";
import { SharedSubscriptionRoutes } from "../shared";

export function AdminSubscriptionRoutes() {
  return (
    <SharedSubscriptionRoutes>
      <Route path={"new"} element={<AddSubscription />} />
    </SharedSubscriptionRoutes>
  );
}
