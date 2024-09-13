import { fireEvent, render } from "@testing-library/react";
import { Currency } from "./currency";
import { ThemeProvider } from "../../../theme";

describe("<Currency />", () => {
  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <Currency currencyCode={"None"} onChange={jest.fn()} />,
      { wrapper }
    );

    expect(getByTestId("currency-select")).toBeInTheDocument();
  });

  it("renders expected options", async () => {
    const { getByText, getAllByText } = render(
      <Currency currencyCode={"None"} onChange={jest.fn()} />,
      { wrapper }
    );

    fireEvent.mouseDown(getByText("None"));
    expect(getAllByText("None")).toHaveLength(2);
    expect(getByText("$ USD")).toBeInTheDocument();
    expect(getByText("€ EUR")).toBeInTheDocument();
  });

  it("runs `onChange` when an option is clicked", async () => {
    const onChange = jest.fn();
    const { getByText } = render(<Currency currencyCode={"None"} onChange={onChange} />, {
      wrapper
    });

    fireEvent.mouseDown(getByText("None"));
    fireEvent.click(getByText("$ USD"));
    expect(onChange).toHaveBeenCalledWith("USD");
  });
});
