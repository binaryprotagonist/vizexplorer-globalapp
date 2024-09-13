import { act, fireEvent, render } from "@testing-library/react";
import { GreetReassignmentTimeout, MENU_OPTIONS } from "./greet-reassignment-timeout";
import { GreetTimeoutFragment } from "generated-graphql";
import { GreetReassignmentTimeoutChangeParams } from "./types";

const mockTimeout: GreetTimeoutFragment = {
  hours: 0,
  minutes: 5
};

describe("<GreetReassignmentTimeout />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("greet-reassignment-timeout")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("greet-reassignment-timeout")).toHaveTextContent(
      "Greet reassignment timeout"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/greet assignment/);
  });

  it("renders action button with expected text based on the provided timeout", () => {
    const { getByTestId } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("reassignment-timeout-action")).toHaveTextContent("5 minutes");
  });

  it("doesn't render action button if `loading` is true", () => {
    const { queryByTestId } = render(
      <GreetReassignmentTimeout loading timeout={mockTimeout} onChange={() => {}} />
    );

    expect(queryByTestId("reassignment-timeout-action")).not.toBeInTheDocument();
  });

  it("renders action menu if the action button is clicked", () => {
    const { getByTestId } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("reassignment-timeout-action"));

    expect(getByTestId("reassignment-timeout-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("reassignment-timeout-action"));

    const menuOptionEles = getAllByRole("option");
    MENU_OPTIONS.forEach((option, i) => {
      expect(menuOptionEles[i]).toHaveTextContent(option.label);
    });
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <GreetReassignmentTimeout timeout={mockTimeout} onChange={onChange} />
    );

    fireEvent.click(getByTestId("reassignment-timeout-action"));
    fireEvent.click(getAllByRole("option")[1]);

    expect(onChange).toHaveBeenCalledWith<[GreetReassignmentTimeoutChangeParams]>({
      settingId: "greet-reassignment-timeout",
      value: { __typename: "PdGreetTimeout", hours: 0, minutes: 10 }
    });
  });
});
