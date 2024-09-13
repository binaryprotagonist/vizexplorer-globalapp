import { render } from "@testing-library/react";
import { Action, GeneralDialog } from "./general-dialog";
import { ThemeProvider } from "../../theme";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<GeneralDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <GeneralDialog title={"Test Dialog"} open={true} actions={[]}>
        <div />
      </GeneralDialog>,
      { wrapper }
    );

    expect(getByTestId("general-dialog")).toBeInTheDocument();
  });

  it("doesn't render if open is false", () => {
    const { queryByTestId } = render(
      <GeneralDialog title={"Test Dialog"} open={false} actions={[]}>
        <div />
      </GeneralDialog>,
      { wrapper }
    );

    expect(queryByTestId("general-dialog")).not.toBeInTheDocument();
  });

  it("renders title", () => {
    const { getByText } = render(
      <GeneralDialog title={"Test Dialog"} open={true} actions={[]}>
        <div />
      </GeneralDialog>,
      { wrapper }
    );

    expect(getByText("Test Dialog")).toBeInTheDocument();
  });

  it("renders children", () => {
    const { getByTestId } = render(
      <GeneralDialog title={"Test Dialog"} open={true} actions={[]}>
        <div data-testid={"dialog-child"} />
      </GeneralDialog>,
      { wrapper }
    );

    expect(getByTestId("dialog-child")).toBeInTheDocument();
  });

  it("renders actions", () => {
    const action: Action = { content: "action 1" };
    const action2: Action = { content: "action 2" };
    const { getByText } = render(
      <GeneralDialog title={"Test Dialog"} open={true} actions={[action, action2]}>
        <div />
      </GeneralDialog>,
      { wrapper }
    );

    expect(getByText("action 1")).toBeInTheDocument();
    expect(getByText("action 2")).toBeInTheDocument();
  });
});
