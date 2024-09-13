import { CriteriaFilterGroup, GuestListBuilderReducerState } from "./types";

export function deleteFilter(
  filterGroups: CriteriaFilterGroup[],
  groupIdx: number,
  filterIdx: number
) {
  const filtersForGroup = filterGroups[groupIdx].filters;

  // remove the filter if there are multiple filters
  if (filtersForGroup.length > 1) {
    filtersForGroup.splice(filterIdx, 1);
    return;
  }

  // remove the whole filter group if it's the last filter for the group and there are multiple groups
  if (filterGroups.length > 1) {
    filterGroups.splice(groupIdx, 1);
    return;
  }

  // last possible filter, just reset it to default state
  filtersForGroup[0] = { metric: null };
}

export function updateCanAddFilterGroup(state: GuestListBuilderReducerState) {
  const filterGroups = state.builder.criteria.filterGroups;
  state.builder.criteria.canAddFilterGroup = filterGroups.every(
    (group) => group.canAddFilter
  );
}

export function updateCanAddFilter(state: GuestListBuilderReducerState) {
  const filterGroups = state.builder.criteria.filterGroups;
  filterGroups.forEach((group) => {
    group.canAddFilter = group.filters.every((filter) => filter.metric);
  });
}
