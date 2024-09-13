import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { NoSearchResult } from "./no-search-results";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<NoSearchResult />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <NoSearchResult search={""} onClickClearSearch={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("no-search-results")).toBeInTheDocument();
  });

  it("displays provided search as part of the message", () => {
    const search = "test search";
    const { getByText } = render(
      <NoSearchResult search={search} onClickClearSearch={() => {}} />,
      { wrapper }
    );

    expect(getByText(`Your search "${search}"`, { exact: false })).toBeInTheDocument();
  });

  it("runs onClickClearSearch when Clear search button is clicked", () => {
    const onClickClearSearch = jest.fn();
    const { getByText } = render(
      <NoSearchResult search={""} onClickClearSearch={onClickClearSearch} />,
      { wrapper }
    );

    fireEvent.click(getByText("Clear search"));
    expect(onClickClearSearch).toHaveBeenCalled();
  });
});
