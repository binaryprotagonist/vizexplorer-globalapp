import { SubscriptionTable } from "../shared";
import { SubscriptionsProps } from "../types";

export function Subscriptions({
  currentUser,
  appSubscriptions,
  companyName
}: SubscriptionsProps) {
  return (
    <SubscriptionTable
      currentUser={currentUser}
      appSubscriptions={appSubscriptions}
      companyName={companyName}
    />
  );
}
