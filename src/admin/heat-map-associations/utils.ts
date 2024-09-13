import { OrgHeatMapFragment, SiteMappingFragment } from "generated-graphql";

export const HEATMAP_DATE_FORMAT = "EEE, MMM d, yyyy";
export const UPLOAD_DATE_FORMAT = "EEE, MMM d, yyyy ppp";

export function filenameFromId(heatmapId: string): string {
  return heatmapId.split("/").slice(-1)[0];
}

export function getAssociatedOrgHeatmaps(
  site: SiteMappingFragment,
  heatmaps: OrgHeatMapFragment[]
): OrgHeatMapFragment[] {
  return heatmaps.filter(
    (heatmap) => heatmap.sourceSiteId === site.dataFeedMapping?.sourceSiteId
  );
}
