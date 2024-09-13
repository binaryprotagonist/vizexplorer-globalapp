import { GaUserFragment, SiteFragment } from "generated-graphql";
import { UserActionType } from "../../view/user/types";
import { canUser } from "../../view/user/utils";
import { TimeZone, TimeZoneOption } from "./dialog/types";

export function disabledAddReasoning(
  currentUser: GaUserFragment,
  sites: SiteFragment[],
  isMultiProp: boolean
): string {
  if (sites.length >= 1 && !isMultiProp) {
    return "You are subscribed to single property plan. Please contact us to make changes";
  }

  if (!canUser(currentUser, { type: UserActionType.MANAGE_PROPERTIES })) {
    return "You don't have permission to add new properties. Please contact an Org Admin";
  }

  return "";
}

export function timezoneAsOption(tz: TimeZone): TimeZoneOption {
  return {
    label: tz.name,
    value: tz.tzCode
  };
}
