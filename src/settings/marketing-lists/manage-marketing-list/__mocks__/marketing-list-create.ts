import { PdMarketingProgramGuestMetric, PdMetricDateRangeType } from "generated-graphql";

export const mockTheoWinMetric: PdMarketingProgramGuestMetric = {
  __typename: "PdMarketingProgramGuestMetric",
  id: "theo-win",
  label: "Theo Win",
  dateRangeTypes: [PdMetricDateRangeType.PastPreset, PdMetricDateRangeType.TripPreset]
};

export const mockActualWinMetric: PdMarketingProgramGuestMetric = {
  __typename: "PdMarketingProgramGuestMetric",
  id: "actual-win",
  label: "Actual Win",
  dateRangeTypes: [PdMetricDateRangeType.PastPreset, PdMetricDateRangeType.TripPreset]
};

export const mockGFVTheoWinMetric: PdMarketingProgramGuestMetric = {
  __typename: "PdMarketingProgramGuestMetric",
  id: "gfv-theo-win",
  label: "GFV Theo Win",
  dateRangeTypes: [PdMetricDateRangeType.FuturePreset]
};

export const mockGFVChurnMetric: PdMarketingProgramGuestMetric = {
  __typename: "PdMarketingProgramGuestMetric",
  id: "gfv-churn",
  label: "GFV Churn",
  dateRangeTypes: []
};
