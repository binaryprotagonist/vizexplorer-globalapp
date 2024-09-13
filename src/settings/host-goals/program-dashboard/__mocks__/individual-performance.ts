import { IndividualPerformanceMetricFragment } from "../__generated__/individual-performance";

export function generateDummyIndividualPerformanceMetrics(
  length = 6
): IndividualPerformanceMetricFragment[] {
  return Array.from({ length }, (_, i) => ({
    __typename: "PdGoalProgramMetric",
    id: `${i}`,
    name: `Metric ${i}`,
    sisenseIndividualWidget: {
      __typename: "OdrWidget",
      id: `${i}`
    }
  }));
}
