import { fireEvent, render } from "@testing-library/react";
import { CreateGuestList } from "./create-guest-list";
import {
  ManageMarketingListReducerState,
  UpdateNameAction,
  emptyManageMarketingListReducerState
} from "../../reducer";
import { getInput, updateInput } from "testing/utils";

describe("<CreateGuestList />", () => {
  let mockReducerState: ManageMarketingListReducerState;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockReducerState = emptyManageMarketingListReducerState();
    mockDispatch.mockClear();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} />
    );

    expect(getByTestId("create-guest-list")).toBeInTheDocument();
  });

  it("updates name value based on state", () => {
    mockReducerState.marketingList.name = "Test Name";
    const { getByTestId } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} />
    );

    expect(getInput(getByTestId("name-input"))).toHaveValue("Test Name");
  });

  it("calls dispatch with updated name value", () => {
    const { getByTestId } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} />
    );

    updateInput(getByTestId("name-input"), "New Name");

    expect(mockDispatch).toHaveBeenCalledWith<[UpdateNameAction]>({
      type: "update-name",
      payload: { name: "New Name" }
    });
  });

  it("displays error when name is taken", () => {
    const { getByTestId } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} isNameTaken />
    );

    expect(getInput(getByTestId("name-input"))).toHaveAttribute("aria-invalid", "true");
  });

  it("doesn't display error when name is not taken", () => {
    const { getByTestId } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} />
    );

    expect(getInput(getByTestId("name-input"))).toHaveAttribute("aria-invalid", "false");
  });

  it("disables all fields and actions when continuing", () => {
    const { getByTestId, getByText } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} continuing />
    );

    expect(getInput(getByTestId("name-input"))).toBeDisabled();
    expect(getByTestId("continue-btn")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });

  it("disables expected fields and actions when disabled", () => {
    const { getByTestId, getByText } = render(
      <CreateGuestList state={mockReducerState} dispatch={mockDispatch} disabled />
    );

    expect(getInput(getByTestId("name-input"))).toBeDisabled();
    expect(getByTestId("continue-btn")).toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
  });

  it("runs onClickCancel when cancel button is clicked", () => {
    const mockClickCancel = jest.fn();
    const { getByText } = render(
      <CreateGuestList
        state={mockReducerState}
        dispatch={mockDispatch}
        onClickCancel={mockClickCancel}
      />
    );

    fireEvent.click(getByText("Cancel"));

    expect(mockClickCancel).toHaveBeenCalled();
  });
});
