import {
  isValidFilterGroupIndex,
  isValidFilterIndex,
  isValidMetricDateRange,
  isValidMetricValue
} from "./action-validation";
import { deleteFilter, updateCanAddFilter, updateCanAddFilterGroup } from "./actions";
import { GuestListBuilderReducerAction, GuestListBuilderReducerState } from "./types";
import { emptyCriteriaFilterGroup } from "./utils";

export function guestListBuilderReducer(
  state: GuestListBuilderReducerState,
  action: GuestListBuilderReducerAction
) {
  switch (action.type) {
    case "update-type":
      state.builder.type = action.payload.type;
      break;
    case "update-hosted":
      state.builder.criteria.hosted = action.payload.hosted;
      break;
    case "reset-filter-groups":
      state.builder.criteria.filterGroups = [emptyCriteriaFilterGroup()];
      break;
    case "update-filter-metric": {
      const { groupIdx, filterIdx, metric } = action.payload;

      const filterGroups = state.builder.criteria.filterGroups;
      if (!isValidFilterIndex(filterGroups, groupIdx, filterIdx)) {
        return;
      }

      // retain selections for metrics with overlapping date ranges, otherwise reset
      const existingDateRange = filterGroups[groupIdx].filters[filterIdx].dateRange;
      if (existingDateRange && metric.dateRangeTypes.includes(existingDateRange.type)) {
        filterGroups[groupIdx].filters[filterIdx].metric = metric;
      } else {
        filterGroups[groupIdx].filters[filterIdx] = { metric };
      }
      break;
    }
    case "update-filter-date-range": {
      const { groupIdx, filterIdx, dateRange } = action.payload;

      const filterGroups = state.builder.criteria.filterGroups;
      if (!isValidFilterIndex(filterGroups, groupIdx, filterIdx)) {
        return;
      }

      const filter = filterGroups[groupIdx].filters[filterIdx];
      if (!isValidMetricDateRange(filter.metric, dateRange)) {
        return;
      }

      filter.dateRange = dateRange;
      break;
    }
    case "update-filter-value": {
      const { groupIdx, filterIdx, value } = action.payload;

      const filterGroups = state.builder.criteria.filterGroups;
      if (!isValidFilterIndex(filterGroups, groupIdx, filterIdx)) {
        return;
      }

      const filter = filterGroups[groupIdx].filters[filterIdx];
      if (!isValidMetricValue(filter.metric)) {
        return;
      }

      filter.range = value.range;
      break;
    }
    case "add-filter": {
      const { groupIdx } = action.payload;

      const filterGroups = state.builder.criteria.filterGroups;
      if (!isValidFilterGroupIndex(filterGroups, groupIdx)) {
        return;
      }

      const targetGroup = filterGroups[action.payload.groupIdx];
      if (!targetGroup.canAddFilter) {
        console.error("Requirements not met to add another filter");
        return;
      }

      targetGroup.filters.push({ metric: null });
      break;
    }
    case "delete-filter": {
      const { groupIdx, filterIdx } = action.payload;

      const filterGroups = state.builder.criteria.filterGroups;
      if (!isValidFilterIndex(filterGroups, groupIdx, filterIdx)) {
        return;
      }

      deleteFilter(filterGroups, groupIdx, filterIdx);
      break;
    }
    case "add-filter-group": {
      const filterGroups = state.builder.criteria.filterGroups;
      if (!state.builder.criteria.canAddFilterGroup) {
        console.error("Requirements not met to add another filter group");
        return;
      }

      filterGroups.push(emptyCriteriaFilterGroup());
      break;
    }
    case "update-raw-string":
      state.builder.rawString = action.payload.rawString;
      break;
  }

  updateCanAddFilter(state);
  updateCanAddFilterGroup(state);
}
