import { ReactElement } from "react";
import { isAdminBuild } from "../../../utils";
import { AdminSubscriptions } from "./admin";
import { Subscriptions as AppSubscriptions } from "./app";
import { SubscriptionsProps } from "./types";

export let Subscriptions: (props: SubscriptionsProps) => ReactElement | null;
if (isAdminBuild()) {
  Subscriptions = AdminSubscriptions;
} else {
  Subscriptions = AppSubscriptions;
}

export * from "./types";
export * from "./utils";
