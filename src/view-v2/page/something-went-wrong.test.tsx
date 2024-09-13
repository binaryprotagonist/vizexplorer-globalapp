import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../theme";
import { SomethingWentWrong } from "./something-went-wrong";
import { VIZ_SUPPORT_LINK } from "view-v2/support";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<SomethingWentWrong />", () => {
  it("renders", () => {
    const { getByText } = render(<SomethingWentWrong onClickRefresh={() => {}} />, {
      wrapper
    });

    expect(getByText("Something went wrong")).toBeInTheDocument();
  });

  it("runs onClickRefresh when Refresh page is clicked", () => {
    const onClickRefresh = jest.fn();
    const { getByText } = render(<SomethingWentWrong onClickRefresh={onClickRefresh} />, {
      wrapper
    });

    fireEvent.click(getByText("Refresh page"));
    expect(onClickRefresh).toHaveBeenCalled();
  });

  it("applies the expected href attribute to Contact support button", () => {
    const { getByText } = render(<SomethingWentWrong onClickRefresh={() => {}} />, {
      wrapper
    });

    expect(getByText("Contact support")).toHaveAttribute("href", VIZ_SUPPORT_LINK);
  });
});
