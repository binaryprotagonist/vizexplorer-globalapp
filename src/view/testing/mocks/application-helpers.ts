import { AppId } from "generated-graphql";

export function dummyAppFullName(appId: AppId): string {
  switch (appId) {
    case AppId.Sre:
      return "Slot Recommendation Engine";
    case AppId.Sras:
      return "Slot Reporting";
    case AppId.Mar:
      return "Market Analysis Reporting";
    case AppId.Pdr:
      return "Player Development Reporting";
    case AppId.Pdre:
      return "Player Development Recommendation Engine";
    case AppId.Pdrer:
      return "Player Development Recommendations Reporting";
    default:
      return "Not Needed";
  }
}
