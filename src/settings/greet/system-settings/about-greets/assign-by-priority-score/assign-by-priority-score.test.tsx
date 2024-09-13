import { act, fireEvent, render } from "@testing-library/react";
import { AssignByPriorityScore } from "./assign-by-priority-score";
import { ThemeProvider } from "../../../../../theme";
import { getInput } from "testing/utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<AssignByPriorityScore />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <AssignByPriorityScore greetAssignment={null} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("assign-by-priority-score")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <AssignByPriorityScore greetAssignment={null} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("assign-by-priority-score")).toHaveTextContent(
      "Assign by priority score"
    );
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <AssignByPriorityScore greetAssignment={null} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/assign actions/);
  });

  it("renders action toggle", () => {
    const { getByTestId } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("assign-by-priority-score-action")).toBeInTheDocument();
  });

  it("doesn't render action toggle if `loading` is true", () => {
    const { queryByTestId } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={() => {}} loading />,
      { wrapper }
    );

    expect(queryByTestId("assign-by-priority-score-action")).not.toBeInTheDocument();
  });

  it("renders action menu if the action toggle is clicked", () => {
    const { getByTestId } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("assign-by-priority-score-action"));

    expect(getByTestId("assign-by-priority-score-action-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("assign-by-priority-score-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("Yes");
    expect(menuOptions[1]).toHaveTextContent("No");
  });

  it("selects menu option `Yes` if `greetAssignment` is true", () => {
    const { getByTestId, getAllByRole } = render(
      <AssignByPriorityScore greetAssignment={true} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("assign-by-priority-score-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).toBeChecked();
    expect(getInput(noEle)).not.toBeChecked();
  });

  it("selects menu option `No` if `greetAssignment` is false", () => {
    const { getByTestId, getAllByRole } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("assign-by-priority-score-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).not.toBeChecked();
    expect(getInput(noEle)).toBeChecked();
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <AssignByPriorityScore greetAssignment={false} onChange={onChange} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("assign-by-priority-score-action"));
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith({
      settingId: "assign-by-priority-score",
      value: true
    });
  });
});
