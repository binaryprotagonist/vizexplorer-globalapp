import { renderHook } from "@testing-library/react";
import {
  ManageMarketingListReducerAction,
  ManageMarketingListReducerState
} from "./types";
import { useImmerReducer } from "use-immer";
import { act } from "react-dom/test-utils";
import { emptyManageMarketingListReducerState } from "./utils";
import { manageMarketingListReducer } from "./manage-marketing-list-reducer";
import { mockCompleteCriteriaGuestListBuilder } from "./guest-list-builder-reducer/__mocks__/guest-list-builder-reducer";

const mockState: ManageMarketingListReducerState = emptyManageMarketingListReducerState();

function renderReducer(state: ManageMarketingListReducerState) {
  return renderHook(() =>
    useImmerReducer<ManageMarketingListReducerState, ManageMarketingListReducerAction>(
      manageMarketingListReducer,
      state
    )
  );
}

describe("manageMarketingListReducer", () => {
  it("can update market list name", () => {
    const { result } = renderReducer(mockState);
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-name", payload: { name: "New Name" } });
    });

    const [newState] = result.current;
    expect(curState.marketingList.name).toEqual("");
    expect(newState.marketingList.name).toEqual("New Name");
  });

  it("can update guest list builder", () => {
    const { result } = renderReducer(mockState);
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-guest-list-builder",
        payload: { guestListBuilder: mockCompleteCriteriaGuestListBuilder }
      });
    });

    const [newState] = result.current;
    expect(newState.marketingList.guestListBuilder).toEqual(
      mockCompleteCriteriaGuestListBuilder
    );
  });
});
