import { act, fireEvent, render } from "@testing-library/react";
import { ShowGuestActiveActions } from "./show-guests-active-actions";
import { ThemeProvider } from "../../../../../theme";
import { getInput } from "testing/utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<ShowGuestActiveActions />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("show-guests-active-actions")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("show-guests-active-actions")).toHaveTextContent(
      "Show guest active actions"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/provide visibility/);
  });

  it("renders action toggle", () => {
    const { getByTestId } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("show-guests-active-actions-action")).toBeInTheDocument();
  });

  it("doesn't render action toggle if `loading` is true", () => {
    const { queryByTestId } = render(
      <ShowGuestActiveActions
        greetShowGuestActiveActions={false}
        onChange={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(queryByTestId("show-guests-active-actions-action")).not.toBeInTheDocument();
  });

  it("renders action menu if the action toggle is clicked", () => {
    const { getByTestId } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("show-guests-active-actions-action"));

    expect(getByTestId("show-guests-active-actions-action-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("show-guests-active-actions-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("Yes");
    expect(menuOptions[1]).toHaveTextContent("No");
  });

  it("selects menu option `Yes` if `greetShowGuestActiveActions` is true", () => {
    const { getByTestId, getAllByRole } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={true} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("show-guests-active-actions-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).toBeChecked();
    expect(getInput(noEle)).not.toBeChecked();
  });

  it("selects menu option `No` if `greetShowGuestActiveActions` is false", () => {
    const { getByTestId, getAllByRole } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("show-guests-active-actions-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).not.toBeChecked();
    expect(getInput(noEle)).toBeChecked();
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <ShowGuestActiveActions greetShowGuestActiveActions={false} onChange={onChange} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("show-guests-active-actions-action"));
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith({
      settingId: "show-guests-active-actions",
      value: true
    });
  });
});
