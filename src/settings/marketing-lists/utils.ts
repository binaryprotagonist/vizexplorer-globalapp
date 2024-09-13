import { GaUserFragment, PdMarketingProgramStatus } from "generated-graphql";
import { SiteSelectSiteFragment } from "view-v2/site-select";
import { canUser, isOrgAdmin } from "../../view/user/utils";
import { UserActionType } from "../../view/user/types";
import { format, parseISO } from "date-fns";

export function sitesManageableByUser(
  sites: SiteSelectSiteFragment[],
  user: GaUserFragment
) {
  if (isOrgAdmin(user.accessLevel)) {
    return sites;
  }

  return sites.filter((site) =>
    canUser(user, { type: UserActionType.MANAGE_PD_SUITE_FOR_SITE, siteId: site.id })
  );
}

export function siteFromSearchParams(
  sites: SiteSelectSiteFragment[],
  searchParams: URLSearchParams
): SiteSelectSiteFragment | null {
  const siteIdFromParams = searchParams.get("siteId");
  return siteIdFromParams
    ? sites.find((site) => site.id === siteIdFromParams) ?? null
    : null;
}

export function isActiveMarketingProgramStatus(
  status?: PdMarketingProgramStatus | null
): status is PdMarketingProgramStatus.Current | PdMarketingProgramStatus.Future {
  return (
    status === PdMarketingProgramStatus.Current ||
    status === PdMarketingProgramStatus.Future
  );
}

export function isHistoricalMarketingProgramStatus(
  status?: PdMarketingProgramStatus | null
): status is PdMarketingProgramStatus.History {
  return status === PdMarketingProgramStatus.History;
}

export function formatDateString(date: string): string {
  return format(parseISO(date), "dd MMMM yyyy");
}
