import { act, fireEvent, render, within } from "@testing-library/react";
import { MENU_OPTIONS, MaxMissedGreets } from "./max-missed-greet";
import { MaxMissedGreetsChangeParams } from "./types";

describe("<MaxMixedGreets />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(<MaxMissedGreets maxGreets={1} onChange={() => {}} />);

    expect(getByTestId("max-missed-greets")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(<MaxMissedGreets maxGreets={1} onChange={() => {}} />);

    expect(getByTestId("max-missed-greets")).toHaveTextContent("Max missed greets");
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <MaxMissedGreets maxGreets={1} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/Number of/);
  });

  it("renders action button with expected text based on the provided max greets", () => {
    const { getByTestId } = render(<MaxMissedGreets maxGreets={1} onChange={() => {}} />);

    expect(getByTestId("max-missed-greets-action")).toHaveTextContent("1 greet");
  });

  it("doesn't render action button if `loading` is true", () => {
    const { queryByTestId } = render(
      <MaxMissedGreets loading maxGreets={1} onChange={() => {}} />
    );

    expect(queryByTestId("max-missed-greets-action")).not.toBeInTheDocument();
  });

  it("renders expected tooltip when hovering over the action icon", () => {
    const { getByTestId, getByRole } = render(
      <MaxMissedGreets maxGreets={1} onChange={() => {}} />
    );

    const action = getByTestId("max-missed-greets-action");
    fireEvent.mouseOver(within(action).getByTestId("icon"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Number of greets");
  });

  it("renders action menu if the action button is clicked", () => {
    const { getByTestId } = render(<MaxMissedGreets maxGreets={1} onChange={() => {}} />);

    fireEvent.click(getByTestId("max-missed-greets-action"));

    expect(getByTestId("max-missed-greets-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <MaxMissedGreets maxGreets={1} onChange={() => {}} />
    );

    fireEvent.click(getByTestId("max-missed-greets-action"));

    const menuOptionEles = getAllByRole("option");
    MENU_OPTIONS.forEach((option, i) => {
      expect(menuOptionEles[i]).toHaveTextContent(option.label);
    });
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <MaxMissedGreets maxGreets={1} onChange={onChange} />
    );

    fireEvent.click(getByTestId("max-missed-greets-action"));
    fireEvent.click(getAllByRole("option")[1]);

    expect(onChange).toHaveBeenCalledWith<[MaxMissedGreetsChangeParams]>({
      settingId: "max-missed-greets",
      value: MENU_OPTIONS[1].value
    });
  });
});
