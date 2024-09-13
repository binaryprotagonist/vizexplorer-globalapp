import {
  PdMarketingProgramGuestMetric,
  PdMetricDateRangeType,
  PdMetricFuturePresetPeriod,
  PdMetricPastPresetPeriod,
  PdMetricPresetTripRange
} from "generated-graphql";

export type GuestListBuilderReducerState = {
  builder: DraftGuestListBuilder;
};

export type DraftGuestListBuilder = {
  type: GuestListBuilderType;
  criteria: GuestListCriteria;
  rawString: string;
};

export type GuestListBuilderType = "criteria" | "raw-string";

export type GuestListCriteria = {
  hosted: boolean;
  filterGroups: CriteriaFilterGroup[];
  canAddFilterGroup: boolean;
};

export type CriteriaFilterGroup = {
  filters: CriteriaFilter[];
  canAddFilter: boolean;
};

export type CriteriaFilter = {
  metric: PdMarketingProgramGuestMetric | null;
  dateRange?: DraftMetricDateRange;
  members?: string[];
  range?: CriteriaFilterValueRange;
};

export type DraftMetricDateRange =
  | {
      type: PdMetricDateRangeType.FuturePreset;
      value: { preset: PdMetricFuturePresetPeriod };
    }
  | {
      type: PdMetricDateRangeType.PastPreset;
      value:
        | { preset: PdMetricPastPresetPeriod }
        | { custom: { start: string | null; end: string | null } };
    }
  | {
      type: PdMetricDateRangeType.TripPreset;
      value: { preset: PdMetricPresetTripRange } | { lastNTrips: number | null };
    };

export type CriteriaFilterValueRange = [from?: string | null, to?: string | null];

export type FilterUpdateValue = { range: CriteriaFilterValueRange };

export type UpdateTypeAction = {
  type: "update-type";
  payload: { type: GuestListBuilderType };
};

export type UpdateHostedAction = {
  type: "update-hosted";
  payload: { hosted: boolean };
};

export type ResetFilterGroupsAction = {
  type: "reset-filter-groups";
};

export type UpdateFilterMetricAction = {
  type: "update-filter-metric";
  payload: {
    groupIdx: number;
    filterIdx: number;
    metric: PdMarketingProgramGuestMetric;
  };
};

export type UpdateFilterDateRangeAction = {
  type: "update-filter-date-range";
  payload: { groupIdx: number; filterIdx: number; dateRange: DraftMetricDateRange };
};

export type UpdateFilterValueAction = {
  type: "update-filter-value";
  payload: {
    groupIdx: number;
    filterIdx: number;
    value: FilterUpdateValue;
  };
};

export type AddFilterAction = {
  type: "add-filter";
  payload: { groupIdx: number };
};

export type DeleteFilterAction = {
  type: "delete-filter";
  payload: { groupIdx: number; filterIdx: number };
};

export type AddFilterGroupAction = {
  type: "add-filter-group";
};

export type UpdateRawStringAction = {
  type: "update-raw-string";
  payload: { rawString: string };
};

export type GuestListBuilderReducerAction =
  | UpdateTypeAction
  | UpdateHostedAction
  | ResetFilterGroupsAction
  | UpdateFilterMetricAction
  | UpdateFilterDateRangeAction
  | UpdateFilterValueAction
  | AddFilterAction
  | DeleteFilterAction
  | AddFilterGroupAction
  | UpdateRawStringAction;
