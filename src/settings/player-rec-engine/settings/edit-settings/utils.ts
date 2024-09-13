import { PdOrgSettingsInput } from "generated-graphql";
import { assetUnreachable } from "../../../../view/utils";
import { PdreSelectSetting, PdreSetting } from "../types";
import { displayValueMetric } from "../utils";

export function pdreSettingInputFromValue<T extends PdreSetting>(
  setting: T,
  value: T["config"]["value"]
): PdOrgSettingsInput {
  if (setting.variant === "numeric") {
    const newValue = value as typeof setting.config.value;

    switch (setting.id) {
      case "lookback-period":
        return { lookbackDays: newValue };
      case "max-tasks-per-host-code":
        return { maxTasksPerHost: newValue };
      case "task-fetch-limit":
        return { maxTasksPerView: newValue };
      default:
        assetUnreachable(setting);
    }
  } else if (setting.variant === "select") {
    const newValue = value as typeof setting.config.value;

    switch (setting.id) {
      case "value-metric":
        return { valueMetric: newValue };
      default:
        assetUnreachable(setting);
    }
  } else if (setting.variant === "time-tz") {
    const newValue = value as typeof setting.config.value;

    switch (setting.id) {
      case "task-scheduler":
        return { taskScheduler: newValue };
      default:
        assetUnreachable(setting);
    }
  }

  assetUnreachable(setting);
}

export function inputLabel(settingId: PdreSetting["id"]): string {
  switch (settingId) {
    case "lookback-period":
      return "Lookback Days";
    case "max-tasks-per-host-code":
      return "Max Tasks";
    case "task-fetch-limit":
      return "Task Limit";
    case "value-metric":
      return "Metric Name";
    case "task-scheduler":
      return ""; // doesn't use custom input labels
    default:
      assetUnreachable(settingId);
  }
}

export function displaySelectOption(
  id: PdreSelectSetting["id"],
  value: PdreSelectSetting["config"]["value"]
): string {
  switch (id) {
    case "value-metric":
      return displayValueMetric(value);
    default:
      assetUnreachable(id);
  }
}
