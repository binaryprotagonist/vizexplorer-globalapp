import { Box, useTheme } from "@mui/material";
import {
  CriteriaFilterGroup,
  GuestListBuilderReducerAction
} from "../../../reducer/guest-list-builder-reducer";
import { CriteriaFilter } from "./criteria-filter/criteria-filter";
import { Dispatch } from "react";
import {
  mockActualWinMetric,
  mockGFVChurnMetric,
  mockGFVTheoWinMetric,
  mockTheoWinMetric
} from "../../../__mocks__/marketing-list-create";
import { Button } from "@vizexplorer/global-ui-v2";
import AddRounded from "@mui/icons-material/AddRounded";

type Props = {
  groupIdx: number;
  filterGroup: CriteriaFilterGroup;
  dispatch: Dispatch<GuestListBuilderReducerAction>;
};

export function CriteriaFilterGroup({ groupIdx, filterGroup, dispatch }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <Box display={"flex"} flexDirection={"column"} rowGap={theme.spacing(3)}>
        {filterGroup.filters.map((filter, filterIdx) => (
          <CriteriaFilter
            key={`filter-group-${filterIdx}`}
            groupIdx={groupIdx}
            filterIdx={filterIdx}
            filter={filter}
            metrics={[
              mockTheoWinMetric,
              mockActualWinMetric,
              mockGFVChurnMetric,
              mockGFVTheoWinMetric
            ]}
            dispatch={dispatch}
          />
        ))}
      </Box>

      <Button
        variant={"text"}
        size={"small"}
        color={"neutral"}
        disabled={!filterGroup.canAddFilter}
        startIcon={<AddRounded />}
        sx={{ fontSize: "14px", mt: theme.spacing(2) }}
        onClick={() => dispatch({ type: "add-filter", payload: { groupIdx } })}
      >
        Add metric
      </Button>
    </Box>
  );
}
