import {
  PdMetricDateRangeType,
  PdMetricFuturePresetPeriod,
  PdMetricPastPresetPeriod
} from "generated-graphql";
import {
  mockGFVChurnMetric,
  mockTheoWinMetric
} from "../../../__mocks__/marketing-list-create";
import {
  CriteriaFilter,
  CriteriaFilterGroup,
  DraftGuestListBuilder,
  DraftMetricDateRange
} from "../types";

export const mockPast180DaysDateRange: DraftMetricDateRange = {
  type: PdMetricDateRangeType.PastPreset,
  value: { preset: PdMetricPastPresetPeriod.Last_180Days }
};

export const mockFuture180DaysDateRange: DraftMetricDateRange = {
  type: PdMetricDateRangeType.FuturePreset,
  value: { preset: PdMetricFuturePresetPeriod.Next_180Days }
};

export const mockCustomDateRange: DraftMetricDateRange = {
  type: PdMetricDateRangeType.PastPreset,
  value: { custom: { start: "2020-01-01", end: "2020-12-31" } }
};

export const mockTheoWinCriteriaFilter: CriteriaFilter = {
  metric: mockTheoWinMetric,
  dateRange: mockPast180DaysDateRange,
  range: ["100", "300"]
};

export const mockGFVChurnCriteriaFilter: CriteriaFilter = {
  metric: mockGFVChurnMetric,
  range: ["10", null]
};

export const mockTheoWinFilterGroup: CriteriaFilterGroup = {
  filters: [mockTheoWinCriteriaFilter],
  canAddFilter: true
};

export const mockGFVChurnFilterGroup: CriteriaFilterGroup = {
  filters: [mockGFVChurnCriteriaFilter],
  canAddFilter: false
};

export const mockCompleteCriteriaGuestListBuilder: DraftGuestListBuilder = {
  type: "criteria",
  criteria: {
    hosted: true,
    filterGroups: [mockTheoWinFilterGroup, mockGFVChurnFilterGroup],
    canAddFilterGroup: false
  },
  rawString: ""
};
