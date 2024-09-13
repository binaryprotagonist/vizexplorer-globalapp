import { TeamPerformanceMetricFragment } from "../__generated__/team-performance";

export function generateDummyTeamPerformanceMetrics(
  length = 6
): TeamPerformanceMetricFragment[] {
  return Array.from({ length }, (_, i) => ({
    __typename: "PdGoalProgramMetric",
    id: `${i}`,
    name: `Metric ${i}`,
    sisenseTeamWidget: {
      __typename: "OdrWidget",
      id: `${i}`
    }
  }));
}
