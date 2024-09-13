import {
  GreetSettingsDocument,
  GreetSettingsFragment,
  GreetSettingsQuery,
  GreetSettingsUpdateDocument,
  GreetSettingsUpdateMutation,
  GreetSettingsUpdateMutationVariables
} from "generated-graphql";
import { GraphQLError } from "graphql";

export const mockGreetSettings: GreetSettingsFragment = {
  __typename: "PdGreetSettings",
  id: "1",
  guestReportBanned: {
    __typename: "PdGreetReportConfig",
    enabled: false,
    emailRecipients: []
  },
  greetSuppressionDays: {
    __typename: "PdGreetSuppressionDays",
    coded: 5,
    uncoded: 7
  },
  greetQueueInactiveTimeout: {
    __typename: "PdGreetTimeout",
    hours: 1,
    minutes: 0
  },
  greetReassignmentTimeout: {
    __typename: "PdGreetTimeout",
    hours: 0,
    minutes: 5
  },
  greetAssignByPriorityScore: false,
  greetShowGuestActiveActions: false,
  hostAllowSuppression: false,
  hostEnableSections: false,
  hostMaxAssignments: 1,
  hostMaxMissedGreets: 1
};

export type MockGreetSettingsQueryOpts = {
  settings?: GreetSettingsFragment;
  errors?: GraphQLError[];
};

export function mockGreetSettingsQuery({
  settings,
  errors
}: MockGreetSettingsQueryOpts = {}) {
  const data: GreetSettingsQuery = {
    pdGreetSettings: settings ?? mockGreetSettings
  };

  return {
    request: {
      query: GreetSettingsDocument
    },
    result: {
      data,
      errors: errors
    }
  };
}

export type MockGreetSettingsUpdateOpts = {
  // changes to apply to the settings
  input: GreetSettingsUpdateMutationVariables["input"];
  // original settings object prior to being changed
  settings: GreetSettingsFragment;
};

export function mockGreetSettingsUpdate({
  input,
  settings
}: MockGreetSettingsUpdateOpts) {
  const variables: GreetSettingsUpdateMutationVariables = {
    input: input
  };

  const data: GreetSettingsUpdateMutation = {
    pdGreetSettingsUpdate: {
      __typename: "PdGreetSettings",
      id: settings.id ?? "1",
      guestReportBanned: {
        ...settings.guestReportBanned,
        ...input.guestReportBanned
      },
      greetSuppressionDays: {
        ...settings.greetSuppressionDays,
        ...input.greetSuppressionDays
      },
      greetQueueInactiveTimeout: {
        ...settings.greetQueueInactiveTimeout,
        ...input.greetQueueInactiveTimeout
      },
      greetReassignmentTimeout: {
        ...settings.greetReassignmentTimeout,
        ...input.greetReassignmentTimeout
      },
      greetAssignByPriorityScore:
        input.greetAssignByPriorityScore ?? settings.greetAssignByPriorityScore,
      greetShowGuestActiveActions:
        input.greetShowGuestActiveActions ?? settings.greetShowGuestActiveActions,
      hostAllowSuppression: input.hostAllowSuppression ?? settings.hostAllowSuppression,
      hostEnableSections: input.hostEnableSections ?? settings.hostEnableSections,
      hostMaxAssignments: input.hostMaxAssignments ?? settings.hostMaxAssignments,
      hostMaxMissedGreets: input.hostMaxMissedGreets ?? settings.hostMaxMissedGreets
    }
  };

  return {
    request: {
      query: GreetSettingsUpdateDocument,
      variables
    },
    result: {
      data
    }
  };
}
