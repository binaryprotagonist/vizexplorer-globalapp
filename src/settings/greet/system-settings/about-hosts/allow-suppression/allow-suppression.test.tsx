import { act, fireEvent, render } from "@testing-library/react";
import { AllowSuppressionCompletion } from "./allow-suppression";
import { ThemeProvider } from "../../../../../theme";
import { getInput } from "testing/utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<AllowSuppressionCompletion />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />
    );

    expect(getByTestId("allow-suppression-without-completion")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />
    );

    expect(getByTestId("allow-suppression-without-completion")).toHaveTextContent(
      "Allow suppression without completion"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/Allow Hosts/);
  });

  it("renders action toggle", () => {
    const { getByTestId } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(
      getByTestId("allow-suppression-without-completion-action")
    ).toBeInTheDocument();
  });

  it("doesn't render action toggle if `loading` is true", () => {
    const { queryByTestId } = render(
      <AllowSuppressionCompletion
        hostAllowSuppression={false}
        onChange={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(
      queryByTestId("allow-suppression-without-completion-action")
    ).not.toBeInTheDocument();
  });

  it("renders action menu if the action toggle is clicked", () => {
    const { getByTestId } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("allow-suppression-without-completion-action"));

    expect(
      getByTestId("allow-suppression-without-completion-action-menu")
    ).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("allow-suppression-without-completion-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("Yes");
    expect(menuOptions[1]).toHaveTextContent("No");
  });

  it("selects menu option `Yes` if `hostAllowSuppression` is true", () => {
    const { getByTestId, getAllByRole } = render(
      <AllowSuppressionCompletion hostAllowSuppression={true} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("allow-suppression-without-completion-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).toBeChecked();
    expect(getInput(noEle)).not.toBeChecked();
  });

  it("selects menu option `No` if `hostAllowSuppression` is false", () => {
    const { getByTestId, getAllByRole } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("allow-suppression-without-completion-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).not.toBeChecked();
    expect(getInput(noEle)).toBeChecked();
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <AllowSuppressionCompletion hostAllowSuppression={false} onChange={onChange} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("allow-suppression-without-completion-action"));
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith({
      settingId: "allow-suppression-without-completion",
      value: true
    });
  });
});
