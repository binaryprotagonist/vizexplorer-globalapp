import { PdMarketingProgramGuestMetric } from "generated-graphql";
import { CriteriaFilterGroup, DraftMetricDateRange } from "./types";

export function isValidFilterGroupIndex(
  filterGroups: CriteriaFilterGroup[],
  groupIdx: number
): boolean {
  if (!filterGroups[groupIdx]) {
    console.error(`Filter group index ${groupIdx} does not exist`);
    return false;
  }

  return true;
}

export function isValidFilterIndex(
  filterGroups: CriteriaFilterGroup[],
  groupIdx: number,
  filterIndex: number
): boolean {
  if (!isValidFilterGroupIndex(filterGroups, groupIdx)) {
    return false;
  }

  if (!filterGroups[groupIdx].filters[filterIndex]) {
    console.error(`Filter index ${filterIndex} does not exist`);
    return false;
  }

  return true;
}

export function isValidMetricDateRange(
  metric: PdMarketingProgramGuestMetric | null,
  dateRange: DraftMetricDateRange
): boolean {
  if (!metric) {
    console.error("Unable to set a Date Range for a filter without a metric");
    return false;
  }

  if (!metric.dateRangeTypes.length) {
    console.error(`Metric ${metric.label} doesn't accept a date range`);
    return false;
  }

  if (!metric.dateRangeTypes.includes(dateRange.type)) {
    console.error(`Metric ${metric.label} doesn't accept a ${dateRange.type} date range`);
    return false;
  }

  return true;
}

export function isValidMetricValue(
  metric: PdMarketingProgramGuestMetric | null
): boolean {
  if (!metric) {
    console.error("Unable to set a Value for a filter without a metric");
    return false;
  }

  return true;
}
