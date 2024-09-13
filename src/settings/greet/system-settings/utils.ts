import { GreetReportConfigFragment } from "generated-graphql";
import { NewAlert } from "view-v2/alert";
import { GreetCategory, OptimisticInput } from "./types";
import {
  AboutGreetsChangeParams,
  aboutGreetsSettingTitle,
  aboutGreetsSettings
} from "./about-greets";
import {
  AboutHostsChangeParams,
  aboutHostsSettingTitle,
  aboutHostsSettings
} from "./about-hosts";
import { aboutGuestsSettingTitle, aboutGuestsSettings } from "./about-guests";

const GREET_CATEGORIES: GreetCategory[] = [
  {
    name: "about-guests",
    settings: [...aboutGuestsSettings]
  },
  {
    name: "about-greets",
    settings: [...aboutGreetsSettings]
  },
  {
    name: "about-hosts",
    settings: [...aboutHostsSettings]
  }
];

export const ALERT_SETTING_UPDATED: NewAlert = {
  message: "Setting change saved",
  severity: "success"
};
export const ALERT_SETTING_UPDATE_FAILED: NewAlert = {
  message: "An unexpected error occurred while saving. Please try again.",
  severity: "error"
};

export function reportBannedOptimisticInput(
  newValue: GreetReportConfigFragment
): OptimisticInput {
  return {
    input: { guestReportBanned: newValue },
    newValue: { guestReportBanned: { __typename: "PdGreetReportConfig", ...newValue } }
  };
}

export function aboutGreetsOptimisticInput({
  settingId,
  value
}: AboutGreetsChangeParams): OptimisticInput {
  switch (settingId) {
    case "assign-by-priority-score":
      return {
        input: { greetAssignByPriorityScore: value },
        newValue: { greetAssignByPriorityScore: value }
      };
    case "suppression-days-after-completion":
      return {
        input: { greetSuppressionDays: { coded: value.coded, uncoded: value.uncoded } },
        newValue: { greetSuppressionDays: value }
      };
    case "queue-inactive-greet-timeout":
      return {
        input: {
          greetQueueInactiveTimeout: { hours: value.hours, minutes: value.minutes }
        },
        newValue: { greetQueueInactiveTimeout: value }
      };
    case "greet-reassignment-timeout":
      return {
        input: {
          greetReassignmentTimeout: { hours: value.hours, minutes: value.minutes }
        },
        newValue: { greetReassignmentTimeout: value }
      };

    case "show-guests-active-actions":
      return {
        input: { greetShowGuestActiveActions: value },
        newValue: { greetShowGuestActiveActions: value }
      };
  }
}

export function aboutHostsOptimisticInput({
  settingId,
  value
}: AboutHostsChangeParams): OptimisticInput {
  switch (settingId) {
    case "enable-section-for-greet":
      return {
        input: { hostEnableSections: value },
        newValue: { hostEnableSections: value }
      };
    case "allow-suppression-without-completion":
      return {
        input: { hostAllowSuppression: value },
        newValue: { hostAllowSuppression: value }
      };
    case "max-assignment-per-host":
      return {
        input: { hostMaxAssignments: value },
        newValue: { hostMaxAssignments: value }
      };
    case "max-missed-greets": {
      return {
        input: { hostMaxMissedGreets: value },
        newValue: { hostMaxMissedGreets: value }
      };
    }
  }
}

function filterCategory(category: GreetCategory, search: string): GreetCategory | null {
  if (category.name === "about-guests") {
    const settings = category.settings.filter((setting) => {
      const title = aboutGuestsSettingTitle(setting);
      return title.toLowerCase().includes(search);
    });
    return settings.length ? { name: "about-guests", settings } : null;
  }

  if (category.name === "about-greets") {
    const settings = category.settings.filter((setting) => {
      const title = aboutGreetsSettingTitle(setting);
      return title.toLowerCase().includes(search);
    });
    return settings.length ? { name: "about-greets", settings } : null;
  }

  if (category.name === "about-hosts") {
    const settings = category.settings.filter((setting) => {
      const title = aboutHostsSettingTitle(setting);
      return title.toLowerCase().includes(search);
    });
    return settings.length ? { name: "about-hosts", settings } : null;
  }

  return null;
}

export function filteredGreetCategories(search: string): GreetCategory[] {
  if (!search.length) return GREET_CATEGORIES;

  const normalizedSearch = search.trim().toLowerCase();
  const categories: GreetCategory[] = [];
  for (const category of GREET_CATEGORIES) {
    const filteredCategory = filterCategory(category, normalizedSearch);
    if (filteredCategory) {
      categories.push(filteredCategory);
    }
  }

  return categories;
}
