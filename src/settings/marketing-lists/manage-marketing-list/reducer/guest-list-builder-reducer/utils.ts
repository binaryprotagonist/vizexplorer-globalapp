import { CriteriaFilterGroup, GuestListBuilderReducerState } from "./types";

export function emptyGuestListBuilderReducerState(): GuestListBuilderReducerState {
  return {
    builder: {
      type: "criteria",
      criteria: {
        hosted: true,
        filterGroups: [emptyCriteriaFilterGroup()],
        canAddFilterGroup: false
      },
      rawString: ""
    }
  };
}

export function emptyCriteriaFilterGroup(): CriteriaFilterGroup {
  return { filters: [{ metric: null }], canAddFilter: false };
}
