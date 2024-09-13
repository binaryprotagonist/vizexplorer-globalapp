import { fireEvent, render, waitFor } from "@testing-library/react";
import { MarketingListBuilder } from "./marketing-list-builder";
import { MockedProvider } from "testing/graphql-provider";
import { Route, Router, Routes } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import {
  MockMarketingProgramsQueryOpts,
  generateDummyMarketingPrograms,
  mockMarketingProgramsQuery
} from "./__mocks__/marketing-list-builder";
import { getInput, updateInput } from "testing/utils";

describe("<MarketingListBuilder />", () => {
  let history: History;
  let mockProgramsQueryOpts: MockMarketingProgramsQueryOpts;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/settings/marketing-lists/sites/0/new"]
    });
    mockProgramsQueryOpts = {};
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider mocks={[mockMarketingProgramsQuery(mockProgramsQueryOpts)]}>
        <Router navigator={history} location={history.location}>
          <Routes>
            <Route path={"/settings/marketing-lists/*"}>
              <Route path={"sites/:siteId/new"} element={children} />
            </Route>
          </Routes>
        </Router>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<MarketingListBuilder title={""} siteId={"0"} />, {
      wrapper
    });

    expect(getByTestId("marketing-list-builder")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(
      <MarketingListBuilder title={"Provided Title"} siteId={"0"} />,
      { wrapper }
    );

    expect(getByText("Provided Title")).toBeInTheDocument();
  });

  it("renders CreateGuestList", () => {
    const { getByTestId } = render(<MarketingListBuilder title={""} siteId={"0"} />, {
      wrapper
    });

    expect(getByTestId("create-guest-list")).toBeInTheDocument();
  });

  it("returns to previous page with a siteId query param on cancel", () => {
    const { getByText } = render(<MarketingListBuilder title={""} siteId={"0"} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));

    expect(history.location.pathname).toEqual("/settings/marketing-lists");
    expect(history.location.search).toEqual("?siteId=0");
  });

  it("renders name taken error if the entered name is taken by another program", async () => {
    const existingPrograms = generateDummyMarketingPrograms(1);
    mockProgramsQueryOpts = { programs: existingPrograms };
    const { getByTestId } = render(<MarketingListBuilder title={""} siteId={"0"} />, {
      wrapper
    });

    await waitFor(() => {
      expect(getByTestId("create-guest-list")).toHaveAttribute("data-loading", "false");
    });

    updateInput(getByTestId("name-input"), existingPrograms[0].name);

    expect(getInput(getByTestId("name-input"))).toHaveAttribute("aria-invalid", "true");
  });

  it("doesn't render name taken error if the entered name is not taken by another program", async () => {
    const { getByTestId } = render(<MarketingListBuilder title={""} siteId={"0"} />, {
      wrapper
    });

    await waitFor(() => {
      expect(getByTestId("create-guest-list")).toHaveAttribute("data-loading", "false");
    });

    updateInput(getByTestId("name-input"), "Unique Name");

    expect(getInput(getByTestId("name-input"))).toHaveAttribute("aria-invalid", "false");
  });
});
