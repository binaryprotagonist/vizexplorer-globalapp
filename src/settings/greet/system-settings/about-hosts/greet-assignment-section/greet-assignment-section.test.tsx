import { act, fireEvent, render } from "@testing-library/react";
import { EnalbleGreetAssignmentSection } from "./greet-assignment-section";
import { ThemeProvider } from "../../../../../theme";
import { getInput } from "testing/utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<EnalbleGreetAssignmentSection />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />
    );

    expect(getByTestId("enable-section-for-greet")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />
    );

    expect(getByTestId("enable-section-for-greet")).toHaveTextContent(
      "Enable sections for greets assignment"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/Use sections/);
  });

  it("renders action toggle", () => {
    const { getByTestId } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("enable-section-for-greet-action")).toBeInTheDocument();
  });

  it("doesn't render action toggle if `loading` is true", () => {
    const { queryByTestId } = render(
      <EnalbleGreetAssignmentSection
        hostEnableSections={false}
        onChange={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(queryByTestId("enable-section-for-greet-action")).not.toBeInTheDocument();
  });

  it("renders action menu if the action toggle is clicked", () => {
    const { getByTestId } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("enable-section-for-greet-action"));

    expect(getByTestId("enable-section-for-greet-action-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("enable-section-for-greet-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("Yes");
    expect(menuOptions[1]).toHaveTextContent("No");
  });

  it("selects menu option `Yes` if `hostEnableSections` is true", () => {
    const { getByTestId, getAllByRole } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={true} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("enable-section-for-greet-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).toBeChecked();
    expect(getInput(noEle)).not.toBeChecked();
  });

  it("selects menu option `No` if `hostEnableSections` is false", () => {
    const { getByTestId, getAllByRole } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("enable-section-for-greet-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).not.toBeChecked();
    expect(getInput(noEle)).toBeChecked();
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <EnalbleGreetAssignmentSection hostEnableSections={false} onChange={onChange} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("enable-section-for-greet-action"));
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith({
      settingId: "enable-section-for-greet",
      value: true
    });
  });
});
