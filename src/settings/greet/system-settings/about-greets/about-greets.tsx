import { AboutGreetsChangeParams, AboutGreetsSettingId } from "./types";
import { CategoryLabel, SettingContainer } from "../common";
import { AssignByPriorityScore } from "./assign-by-priority-score";
import { SuppressionDaysAfterCompletion } from "./suppression-days-after-completion";
import { QueueInactiveTimeout } from "./queue-inactive-greet-timeout";
import { GreetReassignmentTimeout } from "./greet-reassignment-timeout";
import { ShowGuestActiveActions } from "./show-guests-active-actions";
import { GreetSettingsFragment } from "generated-graphql";

type Props = {
  settingIds: AboutGreetsSettingId[];
  settingData: GreetSettingsFragment | null;
  onChange: (params: AboutGreetsChangeParams) => void;
  loading?: boolean;
};

export function AboutGreets({ settingIds, settingData, onChange, loading }: Props) {
  return (
    <SettingContainer data-testid={"about-greets"}>
      <CategoryLabel>ABOUT GREETS</CategoryLabel>
      {settingIds.map((setting) => {
        switch (setting) {
          case "assign-by-priority-score": {
            return (
              <AssignByPriorityScore
                key={setting}
                loading={loading}
                greetAssignment={settingData?.greetAssignByPriorityScore ?? null}
                onChange={onChange}
              />
            );
          }
          case "suppression-days-after-completion": {
            return (
              <SuppressionDaysAfterCompletion
                key={setting}
                suppressionDays={settingData?.greetSuppressionDays ?? null}
                onChange={onChange}
                loading={loading}
              />
            );
          }
          case "queue-inactive-greet-timeout": {
            return (
              <QueueInactiveTimeout
                key={setting}
                timeout={settingData?.greetQueueInactiveTimeout ?? null}
                onChange={onChange}
                loading={loading}
              />
            );
          }
          case "greet-reassignment-timeout": {
            return (
              <GreetReassignmentTimeout
                key={setting}
                timeout={settingData?.greetReassignmentTimeout ?? null}
                onChange={onChange}
                loading={loading}
              />
            );
          }
          case "show-guests-active-actions": {
            return (
              <ShowGuestActiveActions
                key={setting}
                loading={loading}
                greetShowGuestActiveActions={
                  settingData?.greetShowGuestActiveActions ?? null
                }
                onChange={onChange}
              />
            );
          }
          default: {
            throw Error(`Unexpected setting: ${setting}`);
          }
        }
      })}
    </SettingContainer>
  );
}
