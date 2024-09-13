import { fireEvent, render } from "@testing-library/react";
import { Action, ErrorDialog } from "./error-dialog";

describe("<ErrorDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <ErrorDialog title={"error"} actions={[]}>
        <div />
      </ErrorDialog>
    );

    expect(getByTestId("error-dialog")).toBeInTheDocument();
  });

  it("renders children", () => {
    const { getByTestId } = render(
      <ErrorDialog title={"error"} actions={[]}>
        <div data-testid={"error-dialog-child"} />
      </ErrorDialog>
    );

    expect(getByTestId("error-dialog-child")).toBeInTheDocument();
  });

  it("renders provided actions", () => {
    const action1: Action = { name: "Act 1", onClick: () => {} };
    const { getByText } = render(
      <ErrorDialog title={"error"} actions={[action1]}>
        <div />
      </ErrorDialog>
    );

    expect(getByText("Act 1")).toBeInTheDocument();
  });

  it("runs action onClick when clicked", () => {
    const onClick = jest.fn();
    const action1: Action = { name: "Act 1", onClick };
    const { getByText } = render(
      <ErrorDialog title={"error"} actions={[action1]}>
        <div />
      </ErrorDialog>
    );

    fireEvent.click(getByText("Act 1"));

    expect(onClick).toHaveBeenCalled();
  });
});
