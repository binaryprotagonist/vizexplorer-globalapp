import { AppId } from "generated-graphql";

// logical collections of applications

export const SRAS_HEATMAP_APP_IDS = [
  AppId.Floorheatmap,
  AppId.Ratedguestheatmap
] as string[];

// application collections for specific use cases
export const PD_DATA_CONN_APP_IDS = [AppId.Pdr] as string[];

export const PD_SUITE_APP_IDS: string[] = Object.values(AppId).filter((appId) =>
  appId.startsWith("pd")
);
