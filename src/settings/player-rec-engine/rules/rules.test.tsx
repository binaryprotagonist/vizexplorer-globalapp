import { fireEvent, render, waitFor } from "@testing-library/react";
import { PdreRules } from "./rules";
import { RecoilRoot } from "recoil";
import { MockAuthProvider, MockGraphQLProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { BrowserRouter } from "react-router-dom";
import { produce } from "immer";
import { getInput } from "../../../view/testing";
import {
  generateDummyPdreRules,
  generateDummySites,
  mockCurrentUserQuery,
  mockPdreRulesQuery,
  mockSitesQuery
} from "../../../view/testing/mocks";
import { SiteFragment } from "generated-graphql";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../../view/graphql";

const mouseDown = { keyCode: 40 };
const rules = generateDummyPdreRules(3);

describe("<Rules />", () => {
  let mockSites: SiteFragment[] = null as any;
  const cache = new InMemoryCache(cacheConfig);

  beforeEach(() => {
    mockSites = generateDummySites(3);
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockGraphQLProvider
            mocks={[
              mockSitesQuery(mockSites),
              mockPdreRulesQuery(mockSites[0].id.toString(), rules),
              mockPdreRulesQuery(mockSites[1].id.toString(), rules),
              mockCurrentUserQuery()
            ]}
          >
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </MockGraphQLProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<PdreRules />, { wrapper });

    await findByTestId("pdre-rules");
  });

  it("renders site dropdown", async () => {
    const { getByTestId, findByTestId } = render(<PdreRules />, { wrapper });

    await findByTestId("pdre-rules");
    expect(getByTestId("pdre-rules-site-dropdown")).toBeInTheDocument();
  });

  it("defaults site selection to the first site alphabetically", async () => {
    mockSites = produce(mockSites, (draft) => {
      draft[0].name = "z property";
      draft[1].name = "a property";
      draft[2].name = "p property";
    });
    const { getByTestId, findByTestId } = render(<PdreRules />, { wrapper });

    await findByTestId("pdre-rules-table");
    const siteDropdownInput = getInput(getByTestId("pdre-rules-site-dropdown"));
    await waitFor(() => {
      expect(siteDropdownInput).toHaveAttribute("value", mockSites[1].name);
    });
  });

  it("lists available properties in the site dropdown when clicked", async () => {
    const { getByText, getByTestId, findByTestId } = render(<PdreRules />, {
      wrapper
    });

    await findByTestId("pdre-rules-table");
    fireEvent.keyDown(getByTestId("pdre-rules-site-dropdown"), mouseDown);
    mockSites.forEach((site) => {
      expect(getByText(site.name)).toBeInTheDocument();
    });
  });

  it("renders rules table", async () => {
    const { findByTestId } = render(<PdreRules />, { wrapper });

    await findByTestId("pdre-rules-table");
  });

  it("renders rules table as loading while loading", async () => {
    const { getByTestId, queryByTestId, findByTestId } = render(<PdreRules />, {
      wrapper
    });

    expect(getByTestId("pdre-rules-table-loading")).toBeInTheDocument();
    expect(queryByTestId("pdre-rules-table")).not.toBeInTheDocument();
    await findByTestId("pdre-rules-table");
  });

  it("renders rules table as loading if the selected property changes", async () => {
    const { getByTestId, queryByTestId, getByText, findByTestId } = render(
      <PdreRules />,
      { wrapper }
    );

    await findByTestId("pdre-rules-table");
    expect(queryByTestId("pdre-rules-table-loading")).not.toBeInTheDocument();

    fireEvent.keyDown(getByTestId("pdre-rules-site-dropdown"), mouseDown);
    fireEvent.click(getByText(mockSites[1].name));

    expect(getByTestId("pdre-rules-table-loading")).toBeInTheDocument();
    expect(queryByTestId("pdre-rules-table")).not.toBeInTheDocument();
    await findByTestId("pdre-rules-table");
  });

  it("stores rules in cache using `id` and `siteId` combination", () => {
    render(<PdreRules />, {
      wrapper
    });

    const ruleCacheId = cache.identify(rules[0]);
    expect(ruleCacheId).toEqual(
      `PdRule:{"id":"${rules[0].id}","siteId":"${rules[0].siteId}"}`
    );
  });
});
