import { AppId, BillingInterval } from "generated-graphql";
import { SubBuilderSubPlanFragment } from "../__generated__/subscription-builder";

export const mockSubBuilderSubPlans: SubBuilderSubPlanFragment[] = [
  {
    id: "pdre-onprem-elite-annual",
    appId: AppId.Pdre,
    appName: "PD Rec Engine",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdereporting-cloud-elite-annual",
    appId: AppId.Pdereporting,
    appName: "PD Engage Reporting",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdereporting.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdereporting-onprem-elite-annual",
    appId: AppId.Pdereporting,
    appName: "PD Engage Reporting",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdereporting.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "ratedguestheatmap-cloud-elite-annual",
    appId: AppId.Ratedguestheatmap,
    appName: "Slot Heat Map - Rated",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/ratedguestheatmap.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "ratedguestheatmap-onprem-elite-annual",
    appId: AppId.Ratedguestheatmap,
    appName: "Slot Heat Map - Rated",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/ratedguestheatmap.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "ratedguestdashboards-onprem-elite-annual",
    appId: AppId.Ratedguestdashboards,
    appName: "Slot Reporting - Rated",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/ratedguestdashboards.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "ratedguestdashboards-cloud-elite-annual",
    appId: AppId.Ratedguestdashboards,
    appName: "Slot Reporting - Rated",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/ratedguestdashboards.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdengage-onprem-elite-annual",
    appId: AppId.Pdengage,
    appName: "PD Engage",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdengage.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "floorheatmap-onprem-elite-annual",
    appId: AppId.Floorheatmap,
    appName: "Slot Heat Map",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/floorheatmap.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdengage-cloud-elite-annual",
    appId: AppId.Pdengage,
    appName: "PD Engage",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdengage.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdre-cloud-elite-annual",
    appId: AppId.Pdre,
    appName: "PD Rec Engine",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-elite-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-elite-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-elite-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-elite-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-elite-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-elite-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-elite-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-elite-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "floorheatmap-cloud-elite-annual",
    appId: AppId.Floorheatmap,
    appName: "Slot Heat Map",
    isOnprem: false,
    package: "elite",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/floorheatmap.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdengage-cloud-premium-annual",
    appId: AppId.Pdengage,
    appName: "PD Engage",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdengage.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdrer-cloud-premium-annual",
    appId: AppId.Pdrer,
    appName: "PD Rec Engine Reporting",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdrer.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdre-cloud-premium-annual",
    appId: AppId.Pdre,
    appName: "PD Rec Engine",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdr-onprem-premium-monthly",
    appId: AppId.Pdr,
    appName: "PD Reporting",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/pdr.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdr-cloud-premium-monthly",
    appId: AppId.Pdr,
    appName: "PD Reporting",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/pdr.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdr-onprem-premium-annual",
    appId: AppId.Pdr,
    appName: "PD Reporting",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdr.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "pdr-cloud-premium-annual",
    appId: AppId.Pdr,
    appName: "PD Reporting",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/pdr.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "mar-cloud-manufacturer",
    appId: AppId.Mar,
    appName: "Slot Analytics",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/mar.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-standard-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "standard",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-standard-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "standard",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-standard-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "standard",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-standard-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "standard",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-premium-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-cloud-premium-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-premium-monthly",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sras-onprem-premium-annual",
    appId: AppId.Sras,
    appName: "Slot Reporting",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sras.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-premium-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-premium-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-premium-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-premium-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "premium",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-standard-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "standard",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-onprem-standard-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: true,
    package: "standard",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-standard-annual",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "standard",
    billingInterval: BillingInterval.Annual,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  },
  {
    id: "sre-cloud-standard-monthly",
    appId: AppId.Sre,
    appName: "Slot Rec Engine",
    isOnprem: false,
    package: "standard",
    billingInterval: BillingInterval.Monthly,
    icon: "http://localhost/sre.svg",
    __typename: "SubscriptionPlan"
  }
];
