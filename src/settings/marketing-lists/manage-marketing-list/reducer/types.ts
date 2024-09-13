import { DraftGuestListBuilder } from "./guest-list-builder-reducer";

export type ManageMarketingListReducerState = {
  marketingList: DraftMarketingList;
};

export type DraftMarketingList = {
  name: string;
  guestListBuilder?: DraftGuestListBuilder;
};

export type UpdateNameAction = {
  type: "update-name";
  payload: { name: string };
};

export type UpdateGuestListBuilderAction = {
  type: "update-guest-list-builder";
  payload: { guestListBuilder: DraftGuestListBuilder };
};

export type ManageMarketingListReducerAction =
  | UpdateNameAction
  | UpdateGuestListBuilderAction;
