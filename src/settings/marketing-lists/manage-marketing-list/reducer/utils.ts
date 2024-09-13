import { emptyGuestListBuilderReducerState } from "./guest-list-builder-reducer";
import { ManageMarketingListReducerState } from "./types";

export function emptyManageMarketingListReducerState(): ManageMarketingListReducerState {
  return {
    marketingList: {
      name: "",
      guestListBuilder: emptyGuestListBuilderReducerState().builder
    }
  };
}
