import { PdGuestInteractionType } from "generated-graphql";

export function guestInteractionLabel(
  interaction?: PdGuestInteractionType | null
): string {
  switch (interaction) {
    case null:
    case undefined:
      return "None";
    case PdGuestInteractionType.All:
      return "All guests";
    case PdGuestInteractionType.Coded:
      return "Coded guests";
    case PdGuestInteractionType.Uncoded:
      return "Uncoded guests";
  }
}

export function booleanAsYesNo(bool: boolean): string {
  return bool ? "Yes" : "No";
}
