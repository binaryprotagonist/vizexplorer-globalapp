import { PdValueMetric } from "generated-graphql";
import { assetUnreachable, displayTimeTz } from "../../../view/utils";
import { PdreSetting } from "./types";

export function displaySettingValue(setting: PdreSetting): string {
  if (setting.id === "value-metric") {
    return displayValueMetric(setting.config.value);
  }

  if (setting.id === "task-scheduler") {
    return displayTimeTz(setting.config.value);
  }

  return `${setting.config.value}`;
}

export function displayValueMetric(aggregation: PdValueMetric): string {
  switch (aggregation) {
    case PdValueMetric.DailyAverage:
      return "Average Daily Worth";
    case PdValueMetric.TripAverage:
      return "Average Trip Worth";
    case PdValueMetric.Total:
      return "Total Worth";
    default:
      assetUnreachable(aggregation);
  }
}
