import { AllowSuppressionChangeParams } from "./allow-suppression/types";
import { EnableSectionsForGreetChangeParams } from "./greet-assignment-section/types";
import { MaxAssignmentsPerHostChangeParams } from "./max-host-assignment";
import { MaxMissedGreetsChangeParams } from "./max-missed-greets";

export const aboutHostsSettings = [
  "enable-section-for-greet",
  "allow-suppression-without-completion",
  "max-assignment-per-host",
  "max-missed-greets"
] as const;
export type AboutHostsSettingId = (typeof aboutHostsSettings)[number];
export type AboutHostsChangeParams =
  | EnableSectionsForGreetChangeParams
  | AllowSuppressionChangeParams
  | MaxAssignmentsPerHostChangeParams
  | MaxMissedGreetsChangeParams;
