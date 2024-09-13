import { fireEvent, render } from "@testing-library/react";
import { NoSearchResult } from "./no-search-result";

describe("<NoSearchResult />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <NoSearchResult search={""} onClickClearSearch={() => {}} />
    );

    expect(getByTestId("no-search-results")).toBeInTheDocument();
  });

  it("displays provided search as part of the message", () => {
    const search = "test search";
    const { getByText } = render(
      <NoSearchResult search={search} onClickClearSearch={() => {}} />
    );

    expect(getByText(`Your search "${search}"`, { exact: false })).toBeInTheDocument();
  });

  it("runs onClickClearSearch when Clear search button is clicked", () => {
    const onClickClearSearch = jest.fn();
    const { getByText } = render(
      <NoSearchResult search={""} onClickClearSearch={onClickClearSearch} />
    );

    fireEvent.click(getByText("Clear search"));
    expect(onClickClearSearch).toHaveBeenCalled();
  });
});
