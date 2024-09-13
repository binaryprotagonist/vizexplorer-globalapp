import { PdGuestInteractionType } from "generated-graphql";

export type UnmappedOption = {
  group: "unmapped";
  name: string;
  nativeHost: { siteId: string; nativeHostId: string };
};

export type MappedSelectOption = {
  group: "mapped";
  userId: string;
  name: string;
  hostCodes: string[];
};

export type UsersSelectOption = MappedSelectOption | UnmappedOption;

export type UsersSelectGroupType = "mapped" | "unmapped";

export const GUEST_INTERATION_OPTIONS = Object.values(PdGuestInteractionType);

export type GuestInteractionExt = PdGuestInteractionType | null | "undetermined";

export type UserGroupForm = {
  name: string;
  // "undetermined" = Greet Assignment is enabled but no Guest Interaction has been selected
  // undefined = Greet Assignment disabled
  guestInteraction?: GuestInteractionExt;
  includeInReports: boolean;
  users: UsersSelectOption[];
};

export type ValidUserGroupForm = Omit<UserGroupForm, "guestInteraction"> & {
  guestInteraction: PdGuestInteractionType;
};
