import { fireEvent, render, within } from "@testing-library/react";
import MarketingLists from "./marketing-lists";
import { MockedProvider } from "testing/graphql-provider";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockPDEngageAdminAccess
} from "testing/mocks";
import { generateDummySites, mockSitesQuery } from "./__mocks__/marketing-lists";
import { SiteSelectSiteFragment } from "view-v2/site-select";
import { produce } from "immer";
import { GaUserFragment } from "generated-graphql";
import { Router } from "react-router-dom";
import { History, createMemoryHistory } from "history";

const pdEngageSingleSiteAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});

describe("<MarketingLists />", () => {
  let sites: SiteSelectSiteFragment[];
  let currentUser: GaUserFragment;
  let history: History;

  beforeEach(() => {
    sites = generateDummySites(3);
    currentUser = pdEngageSingleSiteAdmin;
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider mocks={[mockCurrentUserQuery(currentUser), mockSitesQuery(sites)]}>
        <Router navigator={history} location={history.location}>
          {children}
        </Router>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<MarketingLists />, { wrapper });

    expect(getByTestId("marketing-lists")).toBeInTheDocument();
  });

  it("renders site select if the user has required access to multiple sites", async () => {
    currentUser = mockOrgAdmin;
    const { findByTestId, getByTestId } = render(<MarketingLists />, { wrapper });

    await findByTestId("site-select");
    expect(getByTestId("no-site-selection")).toBeInTheDocument();
  });

  it("loads marketing list for the selected site", async () => {
    currentUser = mockOrgAdmin;
    const { findByTestId, getByText } = render(<MarketingLists />, {
      wrapper
    });

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[0].name));

    await findByTestId("no-marketing-lists");
  });

  it("doesn't render site select if the user only has required access to a single sites", async () => {
    const { findByTestId, queryByTestId } = render(<MarketingLists />, { wrapper });

    await findByTestId("no-marketing-lists");
    expect(queryByTestId("site-select")).not.toBeInTheDocument();
  });

  it("can select a site from a valid query parameter", async () => {
    currentUser = mockOrgAdmin;
    history.push(`?siteId=${sites[1].id}`);
    const { findByTestId, getByTestId } = render(<MarketingLists />, { wrapper });

    await findByTestId("no-marketing-lists");
    expect(getByTestId("site-select")).toHaveTextContent(sites[1].name);
  });

  it("doesn't select a site from an invalid query parameter", async () => {
    currentUser = mockOrgAdmin;
    history.push("?siteId=50");
    const { findByTestId } = render(<MarketingLists />, { wrapper });

    await findByTestId("no-site-selection");
  });

  it("renders no marketing list if there are no marketing lists", async () => {
    const { findByTestId } = render(<MarketingLists />, { wrapper });

    await findByTestId("no-marketing-lists");
  });

  it("navigates to marketing list creation if the create button is clicked on NoMarketingLists", async () => {
    const { findByTestId } = render(<MarketingLists />, { wrapper });

    const noMarketingLists = await findByTestId("no-marketing-lists");
    fireEvent.click(within(noMarketingLists).getByText("Create list"));

    expect(history.location.pathname).toEqual(`/sites/${sites[0].id}/new`);
  });
});
