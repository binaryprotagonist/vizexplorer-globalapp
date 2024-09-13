import { AssignByPriorityScoreChangeParams } from "./assign-by-priority-score/types";
import { GreetReassignmentTimeoutChangeParams } from "./greet-reassignment-timeout";
import { QueueInactiveGreetTimeoutChangeParams } from "./queue-inactive-greet-timeout";
import { ShowGuestActionsChangeParams } from "./show-guests-active-actions/types";
import { SuppressionDaysChangeParams } from "./suppression-days-after-completion";

export const aboutGreetsSettings = [
  "assign-by-priority-score",
  "suppression-days-after-completion",
  "queue-inactive-greet-timeout",
  "greet-reassignment-timeout",
  "show-guests-active-actions"
] as const;
export type AboutGreetsSettingId = (typeof aboutGreetsSettings)[number];
export type AboutGreetsChangeParams =
  | AssignByPriorityScoreChangeParams
  | SuppressionDaysChangeParams
  | QueueInactiveGreetTimeoutChangeParams
  | GreetReassignmentTimeoutChangeParams
  | ShowGuestActionsChangeParams;
