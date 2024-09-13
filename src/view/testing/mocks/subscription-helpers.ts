import {
  ApplicationSubscriptionsDocument,
  AppSubscriptionFragment,
  SubscriptionStatus
} from "generated-graphql";

export function mockAppSubscriptionsQuery(appSubs?: AppSubscriptionFragment[]) {
  return {
    request: {
      query: ApplicationSubscriptionsDocument
    },
    result: {
      data: {
        appSubscriptions: appSubs || generateDummyAppSubscriptions(3)
      }
    }
  };
}

export function generateDummyAppSubscriptions(length: number): AppSubscriptionFragment[] {
  return Array(length)
    .fill(null)
    .map<AppSubscriptionFragment>((_, idx) => ({
      __typename: "Application",
      id: `app_sub_${idx + 1}`,
      name: `App ${idx + 1}`,
      subscription: {
        __typename: "AppSubscription",
        id: `subscription-${idx + 1}`,
        isOnprem: false,
        package: "standard",
        periodStartDate: `2021-02-0${idx + 1}T02:19:13+00:00`,
        periodEndDate: `2022-02-1${idx + 1}T02:19:13+00:00`,
        status: SubscriptionStatus.Active,
        isValid: true
      }
    }));
}
