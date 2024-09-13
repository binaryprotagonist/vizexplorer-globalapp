import { useImmerReducer } from "use-immer";
import {
  guestListBuilderReducer,
  GuestListBuilderReducerAction,
  GuestListBuilderReducerState
} from "../../../reducer/guest-list-builder-reducer";
import { useTheme } from "@mui/material";
import { Paper } from "@vizexplorer/global-ui-v2";
import { CriteriaFilterGroup } from "./criteria-filter-group";

type Props = {
  initialState: GuestListBuilderReducerState;
};

export function GuestsCriteria({ initialState }: Props) {
  const theme = useTheme();
  const [state, dispatch] = useImmerReducer<
    GuestListBuilderReducerState,
    GuestListBuilderReducerAction
  >(guestListBuilderReducer, initialState);

  return (
    <Paper sx={{ padding: theme.spacing(3) }}>
      {state.builder.criteria.filterGroups.map((filterGroup, groupIdx) => (
        <CriteriaFilterGroup
          key={`filter-group-${groupIdx}`}
          groupIdx={groupIdx}
          filterGroup={filterGroup}
          dispatch={dispatch}
        />
      ))}
    </Paper>
  );
}
