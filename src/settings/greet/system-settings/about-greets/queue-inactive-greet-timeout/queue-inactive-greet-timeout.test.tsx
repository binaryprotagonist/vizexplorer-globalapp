import { act, fireEvent, render } from "@testing-library/react";
import { QueueInactiveTimeout } from "./queue-inactive-greet-timeout";
import { GreetTimeoutFragment } from "generated-graphql";
import { QueueInactiveGreetTimeoutChangeParams } from "./types";

const mockTimeout: GreetTimeoutFragment = {
  hours: 1,
  minutes: 0
};

describe("<QueueInactiveTimeout />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("queue-inactive-greet-timeout")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("queue-inactive-greet-timeout")).toHaveTextContent(
      "Queue inactive greet timeout"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/queue/);
  });

  it("renders action button with expected text based on the provided timeout", () => {
    const { getByTestId } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    expect(getByTestId("queue-inactive-timeout-action")).toHaveTextContent("1 hour");
  });

  it("doesn't render action button if `loading` is true", () => {
    const { queryByTestId } = render(
      <QueueInactiveTimeout loading timeout={mockTimeout} onChange={() => {}} />
    );

    expect(queryByTestId("queue-inactive-timeout-action")).not.toBeInTheDocument();
  });

  it("renders action menu if the action button is clicked", () => {
    const { getByTestId } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("queue-inactive-timeout-action"));

    expect(getByTestId("queue-inactive-timeout-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("queue-inactive-timeout-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("1 hour");
    expect(menuOptions[1]).toHaveTextContent("1h 15min");
    expect(menuOptions[2]).toHaveTextContent("1h 30min");
    expect(menuOptions[3]).toHaveTextContent("1h 45min");
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <QueueInactiveTimeout timeout={mockTimeout} onChange={onChange} />
    );

    fireEvent.click(getByTestId("queue-inactive-timeout-action"));
    fireEvent.click(getAllByRole("option")[1]);

    expect(onChange).toHaveBeenCalledWith<[QueueInactiveGreetTimeoutChangeParams]>({
      settingId: "queue-inactive-greet-timeout",
      value: { __typename: "PdGreetTimeout", hours: 1, minutes: 15 }
    });
  });
});
