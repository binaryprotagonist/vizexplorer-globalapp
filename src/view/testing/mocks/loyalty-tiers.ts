import { LoyaltyTierFragment } from "generated-graphql";

export function generateDummyLoyaltyTiers(length = 3): LoyaltyTierFragment[] {
  return Array(length)
    .fill(null)
    .map<LoyaltyTierFragment>((_, idx) => ({
      id: `${idx + 1}`,
      order: idx + 1,
      name: `Tier ${idx + 1}`,
      color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`
    }));
}
