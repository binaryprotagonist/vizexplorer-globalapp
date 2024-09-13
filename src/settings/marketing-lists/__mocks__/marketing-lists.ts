import { SiteSelectSiteFragment } from "view-v2/site-select";
import { SitesDocument } from "../__generated__/marketing-lists";

export function generateDummySites(length: number): SiteSelectSiteFragment[] {
  return Array(length)
    .fill(null)
    .map<SiteSelectSiteFragment>((_, idx) => ({
      __typename: "Site",
      id: `${idx}`,
      name: `Site ${idx}`
    }));
}

export function mockSitesQuery(sites?: SiteSelectSiteFragment[]) {
  const userSites = sites || generateDummySites(3);

  return {
    request: {
      query: SitesDocument
    },
    result: { data: { sites: userSites } }
  };
}
