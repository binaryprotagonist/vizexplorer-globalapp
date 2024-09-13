import { fireEvent, render } from "@testing-library/react";
import { NoRules } from "./no-rules";
import { ThemeProvider } from "../../../theme";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<NoRules />", () => {
  it("renders", () => {
    const { getByTestId } = render(<NoRules onClickAddNewRule={() => {}} />, { wrapper });

    expect(getByTestId("no-rules")).toBeInTheDocument();
  });

  it("runs onClickAddNewRule when Add Rule button is clicked", () => {
    const onClickAddNewRule = jest.fn();
    const { getByText } = render(<NoRules onClickAddNewRule={onClickAddNewRule} />, {
      wrapper
    });

    fireEvent.click(getByText("Add rule"));
    expect(onClickAddNewRule).toHaveBeenCalled();
  });
});
