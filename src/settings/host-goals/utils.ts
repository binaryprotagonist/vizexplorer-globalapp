import { GaUserFragment, PdGoalProgramStatus } from "generated-graphql";
import { UserActionType } from "../../view/user/types";
import { canUser, isOrgAdmin } from "../../view/user/utils";
import { SiteSelectSiteFragment } from "view-v2/site-select";
import { format, parseISO } from "date-fns";
import { ProgramCardProgramFragment } from "./__generated__/program-card";

export const MAX_GOAL_VALUE = 9_999_999_999;
export const MIN_GOAL_VALUE = -MAX_GOAL_VALUE;

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

export function isActiveProgramStatus(
  status?: PdGoalProgramStatus | null
): status is PdGoalProgramStatus.Current | PdGoalProgramStatus.Future {
  return status === PdGoalProgramStatus.Current || status === PdGoalProgramStatus.Future;
}

export function formatDateString(date: string): string {
  return format(parseISO(date), "dd MMMM yyyy");
}

export function programMatchesSearch(
  program: ProgramCardProgramFragment,
  search: string
): boolean {
  return program.name.toLowerCase().includes(search.toLowerCase());
}
