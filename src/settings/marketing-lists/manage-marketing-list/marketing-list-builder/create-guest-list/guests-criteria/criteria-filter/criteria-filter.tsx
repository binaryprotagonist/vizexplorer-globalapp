import { PdMarketingProgramGuestMetric } from "generated-graphql";
import {
  CriteriaFilter,
  GuestListBuilderReducerAction
} from "../../../../reducer/guest-list-builder-reducer";
import { Dispatch } from "react";
import { MetricRangeFilter } from "./metric-range-filter";

type Props = {
  groupIdx: number;
  filterIdx: number;
  filter: CriteriaFilter;
  metrics: PdMarketingProgramGuestMetric[];
  dispatch: Dispatch<GuestListBuilderReducerAction>;
};

export function CriteriaFilter({
  groupIdx,
  filterIdx,
  filter,
  metrics,
  dispatch
}: Props) {
  return (
    <MetricRangeFilter
      groupIdx={groupIdx}
      filterIdx={filterIdx}
      filter={filter}
      metrics={metrics}
      dispatch={dispatch}
    />
  );
}
