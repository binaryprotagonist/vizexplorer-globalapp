import { act, fireEvent, render, within } from "@testing-library/react";
import { MENU_OPTIONS, MaxAssignmentPerHost } from "./max-host-assignment";
import { MaxAssignmentsPerHostChangeParams } from "./types";

describe("<MaxAssignmentPerHost />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    expect(getByTestId("max-assignment-per-host")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    expect(getByTestId("max-assignment-per-host")).toHaveTextContent(
      "Max assignments per host"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/Number of greets/);
  });

  it("renders action button with expected text based on the provided number of assignments", () => {
    const { getByTestId } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    expect(getByTestId("max-assignments-per-host-action")).toHaveTextContent("1 greet");
  });

  it("doesn't render action button if `loading` is true", () => {
    const { queryByTestId } = render(
      <MaxAssignmentPerHost loading numAssignments={1} onChange={() => {}} />
    );

    expect(queryByTestId("max-assignments-per-host-action")).not.toBeInTheDocument();
  });

  it("renders expected tooltip when hovering over the action icon", () => {
    const { getByTestId, getByRole } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    const action = getByTestId("max-assignments-per-host-action");
    fireEvent.mouseOver(within(action).getByTestId("icon"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Number of greets");
  });

  it("renders action menu if the action button is clicked", () => {
    const { getByTestId } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("max-assignments-per-host-action"));

    expect(getByTestId("max-assignments-per-host-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("max-assignments-per-host-action"));

    const menuOptionEles = getAllByRole("option");
    MENU_OPTIONS.forEach((option, i) => {
      expect(menuOptionEles[i]).toHaveTextContent(option.label);
    });
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <MaxAssignmentPerHost numAssignments={1} onChange={onChange} />
    );

    fireEvent.click(getByTestId("max-assignments-per-host-action"));
    fireEvent.click(getAllByRole("option")[1]);

    expect(onChange).toHaveBeenCalledWith<[MaxAssignmentsPerHostChangeParams]>({
      settingId: "max-assignment-per-host",
      value: MENU_OPTIONS[1].value
    });
  });
});
