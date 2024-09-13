import { Typography } from "@vizexplorer/global-ui-v2";
import { AboutGreetsSettingId } from "./types";

export function aboutGreetsSettingTitle(settingId: AboutGreetsSettingId): string {
  switch (settingId) {
    case "assign-by-priority-score":
      return "Assign by priority score";
    case "suppression-days-after-completion":
      return "Suppression days after completion";
    case "queue-inactive-greet-timeout":
      return "Queue inactive greet timeout";
    case "greet-reassignment-timeout":
      return "Greet reassignment timeout";
    case "show-guests-active-actions":
      return "Show guest active actions";
  }
}

export function aboutGreetsSettingHelp(settingId: AboutGreetsSettingId): JSX.Element {
  switch (settingId) {
    case "assign-by-priority-score":
      return (
        <>
          <Typography variant={"label"} color={"white"} fontWeight={600}>
            Priority score
          </Typography>
          <Typography variant={"label"} color={"white"} marginY={1}>
            The system will assign actions based on their priority scores, which are
            calculated using the assignment weight, tier score, and time factors.
          </Typography>
          <Typography variant={"label"} color={"white"}>
            When disabled, actions are assigned sequentially from the top of the queue to
            the bottom.
          </Typography>
        </>
      );
    case "suppression-days-after-completion":
      return (
        <>
          Duration during which the system will not generate new greets for uncoded and
          coded guests after a host completes a greet.
        </>
      );
    case "queue-inactive-greet-timeout":
      return (
        <>
          Number of minutes a greet can remain in the queue before it is automatically
          removed.
        </>
      );
    case "greet-reassignment-timeout":
      return (
        <>
          Number of minutes from greet assignment before it is considered a missed greet
          and automatically reassigned to another person.
        </>
      );
    case "show-guests-active-actions":
      return (
        <>
          Display the number of other active actions associated with that guest in the
          action list. This helps provide visibility into the workload of each guest and
          their ongoing actions.
        </>
      );
  }
}
