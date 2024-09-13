export const ASSOCIATION_TYPES = ["all", "associated"] as const;
export type AssociationType = (typeof ASSOCIATION_TYPES)[number];
