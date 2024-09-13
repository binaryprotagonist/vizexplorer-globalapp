import {
  ManageMarketingListReducerAction,
  ManageMarketingListReducerState
} from "./types";

export function manageMarketingListReducer(
  state: ManageMarketingListReducerState,
  action: ManageMarketingListReducerAction
) {
  switch (action.type) {
    case "update-name":
      state.marketingList.name = action.payload.name;
      break;
    case "update-guest-list-builder":
      state.marketingList.guestListBuilder = action.payload.guestListBuilder;
      break;
  }
}
