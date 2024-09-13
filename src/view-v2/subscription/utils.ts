import { BillingInterval } from "generated-graphql";
import { SubscriptionEnvironment } from "./types";

export function displaySubscriptionEnvironment(environment: SubscriptionEnvironment) {
  return environment === SubscriptionEnvironment.ONPREM ? "On-Premises" : "Cloud";
}

export function displayBillingInterval(interval: BillingInterval) {
  switch (interval) {
    case BillingInterval.Annual:
      return "Annual";
    case BillingInterval.Monthly:
      return "Monthly";
  }
}
