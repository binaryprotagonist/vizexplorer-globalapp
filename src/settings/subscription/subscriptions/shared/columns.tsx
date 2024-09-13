import { Column } from "@material-table/core";
import { AppSubscriptionFragment } from "generated-graphql";
import { Display } from "../utils";
import { compareAsc, toDate } from "date-fns";
import { capitalize } from "../../../../view/utils/capitalize";

const appName: Column<AppSubscriptionFragment> = {
  title: "Product Name",
  field: "name",
  width: "25%"
};

const packageName: Column<AppSubscriptionFragment> = {
  title: "Package",
  field: "subscription.package",
  render: (appSub) => Display.package(appSub.subscription?.package || "")
};

const deliveryMethod: Column<AppSubscriptionFragment> = {
  title: "Environment",
  render: (appSub) => Display.environment(appSub.subscription?.isOnprem || false),
  customFilterAndSearch: (search, appSub) => {
    const env = Display.environment(appSub.subscription?.isOnprem || false);
    return env.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  },
  sorting: false
};

const startDate: Column<AppSubscriptionFragment> = {
  title: "Start Date",
  render: (appSub) => Display.date(appSub.subscription?.periodStartDate),
  customFilterAndSearch: (search, appSub) => {
    const formattedDateStr = Display.date(appSub.subscription?.periodStartDate);
    return formattedDateStr.toLowerCase().includes(search.toLowerCase());
  },
  customSort: (appA, appB) => {
    const dateA = toDate(new Date(appA.subscription?.periodStartDate));
    const dateB = toDate(new Date(appB.subscription?.periodStartDate));
    return compareAsc(dateA, dateB);
  }
};

const endDate: Column<AppSubscriptionFragment> = {
  title: "End Date",
  field: "subscription.endDate",
  render: (appSub) => Display.date(appSub.subscription?.periodEndDate),
  customFilterAndSearch: (search, appSub) => {
    const dateStr = Display.date(appSub.subscription?.periodEndDate);
    return dateStr.toLowerCase().includes(search.toLowerCase());
  },
  customSort: (appA, appB) => {
    const dateA = toDate(new Date(appA.subscription?.periodEndDate));
    const dateB = toDate(new Date(appB.subscription?.periodEndDate));
    return compareAsc(dateA, dateB);
  }
};

const status: Column<AppSubscriptionFragment> = {
  title: "Status",
  field: "subscription.status",
  render: (appSub) => capitalize(appSub.subscription?.status?.toLocaleLowerCase() || "")
};

export const subscriptionColumns = [
  appName,
  packageName,
  deliveryMethod,
  startDate,
  endDate,
  status,
  { sorting: false }
];
