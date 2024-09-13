import { useDeliveryMethod } from "@vizexplorer/global-ui-core";
import {
  AppSubscriptionFragment,
  useApplicationSubscriptionsQuery
} from "generated-graphql";
import { Environment } from "../../settings/subscription";

function isSubscriptionsOnprem(apps: AppSubscriptionFragment[]) {
  return apps.some((app) => app.subscription!.isOnprem);
}

type MatchingEnv = {
  currentEnvironment: Environment | null;
  subscriptionEnvironment: Environment | null;
  loading: boolean;
  error?: Error;
};

/**
 * @returns currentEnvironment - where the user is accessing the app from
 * @returns subscriptionEnvironment - environment the user has (valid) app subscriptions to
 */
export function useEnvironment(): MatchingEnv {
  const {
    isOnprem,
    loading: deliveryMethodLoading,
    error: deliveryMethodErr
  } = useDeliveryMethod({ fetchPolicy: "cache-first" });
  const {
    data: appsData,
    loading: appsLoading,
    error: appsError
  } = useApplicationSubscriptionsQuery({ fetchPolicy: "cache-first" });

  const apps = appsData?.appSubscriptions || [];
  const appsWithValidSubscription = apps.filter((app) => app.subscription?.isValid);

  const loading = appsLoading || deliveryMethodLoading;
  const currentEnvironment = isOnprem ? Environment.ONPREM : Environment.CLOUD;
  const subscriptionEnvironment = appsWithValidSubscription.length
    ? isSubscriptionsOnprem(appsWithValidSubscription)
      ? Environment.ONPREM
      : Environment.CLOUD
    : null;

  return {
    currentEnvironment: loading ? null : currentEnvironment,
    subscriptionEnvironment: loading ? null : subscriptionEnvironment,
    loading,
    error: appsError || deliveryMethodErr
  };
}
