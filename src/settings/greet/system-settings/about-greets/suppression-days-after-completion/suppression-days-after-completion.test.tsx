import { act, fireEvent, render, within } from "@testing-library/react";
import { SuppressionDaysAfterCompletion } from "./suppression-days-after-completion";
import { GreetSuppressionDaysFragment } from "generated-graphql";
import { SuppressionDaysChangeParams } from "./types";

const mockSuppressionDays: GreetSuppressionDaysFragment = {
  coded: 5,
  uncoded: 7
};

describe("<SuppressionDaysAfterCompletion />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    expect(getByTestId("suppression-days-after-completion")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    expect(getByTestId("suppression-days-after-completion")).toHaveTextContent(
      "Suppression days after completion"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/generate new greets/);
  });

  it("renders action buttons", () => {
    const { getByTestId, queryByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    expect(getByTestId("coded-suppression-days-action")).toBeInTheDocument();
    expect(getByTestId("uncoded-suppression-days-action")).toBeInTheDocument();
    expect(queryByTestId("coded-suppression-loading")).not.toBeInTheDocument();
    expect(queryByTestId("uncoded-suppression-loading")).not.toBeInTheDocument();
  });

  it("renders actions loading if `loading` is true", () => {
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        loading
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    expect(getByTestId("coded-suppression-loading")).toBeInTheDocument();
    expect(getByTestId("uncoded-suppression-loading")).toBeInTheDocument();
  });

  it("renders expected tooltip when hovering over Coded action icon", () => {
    const { getByTestId, getByRole } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    fireEvent.mouseOver(getByTestId("coded-action-icon"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Coded guests");
  });

  it("renders expected tooltip when hovering over Uncoded action icon", () => {
    const { getByTestId, getByRole } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    fireEvent.mouseOver(getByTestId("uncoded-action-icon"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Uncoded guests");
  });

  it("renders expected action text based on provided values", () => {
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={() => {}}
      />
    );

    expect(getByTestId("coded-suppression-days-action")).toHaveTextContent("5 days");
    expect(getByTestId("uncoded-suppression-days-action")).toHaveTextContent("7 days");
  });

  it("renders expected text for a single day", () => {
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={{ coded: 1, uncoded: 1 }}
        onChange={() => {}}
      />
    );

    expect(getByTestId("coded-suppression-days-action")).toHaveTextContent("1 day");
    expect(getByTestId("uncoded-suppression-days-action")).toHaveTextContent("1 day");
  });

  it("runs `onChange` when `coded` value is change", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={onChange}
      />
    );

    fireEvent.click(getByTestId("coded-suppression-days-action"));
    const codedMenu = getByTestId("coded-suppression-days-menu");
    fireEvent.click(within(codedMenu).getByText("2 days"));

    expect(onChange).toHaveBeenCalledWith<[SuppressionDaysChangeParams]>({
      settingId: "suppression-days-after-completion",
      value: {
        __typename: "PdGreetSuppressionDays",
        coded: 2,
        uncoded: mockSuppressionDays.uncoded
      }
    });
  });

  it("runs `onChange` when `uncoded` value is change", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <SuppressionDaysAfterCompletion
        suppressionDays={mockSuppressionDays}
        onChange={onChange}
      />
    );

    fireEvent.click(getByTestId("uncoded-suppression-days-action"));
    const uncodedMenu = getByTestId("uncoded-suppression-days-menu");
    fireEvent.click(within(uncodedMenu).getByText("2 days"));

    expect(onChange).toHaveBeenCalledWith<[SuppressionDaysChangeParams]>({
      settingId: "suppression-days-after-completion",
      value: {
        __typename: "PdGreetSuppressionDays",
        coded: mockSuppressionDays.coded,
        uncoded: 2
      }
    });
  });
});
