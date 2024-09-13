import { GaUserFragment, LoyaltyTierFragment } from "generated-graphql";
import { isOrgAdmin } from "../../../view/user/utils";

export function disableManageTiersReasoning(
  currentUser: GaUserFragment | null,
  tiers: LoyaltyTierFragment[],
  loading: boolean
): string {
  if (loading || !currentUser) return "Loading...";
  if (!isOrgAdmin(currentUser.accessLevel)) {
    return "You don't have permission to add new tiers. Please contact an Admin";
  }
  if (!tiers.length) {
    return "No Loyalty Tiers to manage";
  }

  return "";
}
