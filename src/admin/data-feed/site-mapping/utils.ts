import { SiteMappingFragment } from "generated-graphql";

export function filterUsedSourceSites(
  options: string[],
  activeSite: SiteMappingFragment,
  sites: SiteMappingFragment[]
) {
  return options.filter(
    (option) =>
      option === activeSite.dataFeedMapping?.sourceSiteId ||
      !sites.some((site) => site.dataFeedMapping?.sourceSiteId === option)
  );
}
