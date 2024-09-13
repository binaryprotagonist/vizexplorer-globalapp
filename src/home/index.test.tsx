import { render, waitFor } from "@testing-library/react";
import { Home } from ".";
import {
  MockGraphQLProvider,
  MockRecoilProvider,
  MockAuthProvider,
  OrgAppFragment,
  LAST_ACCESSED_APP,
  generateDummyOrgApps
} from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../theme";
import { BrowserRouter } from "react-router-dom";
import { mockCompanyQuery, mockCurrentUserQuery } from "testing/mocks";
import { GaCompanyFragment } from "generated-graphql";

delete (window as any).location;

describe("Home", () => {
  let orgApps: OrgAppFragment[] = [];
  let company: Partial<GaCompanyFragment> = null as any;

  beforeEach(() => {
    orgApps = generateDummyOrgApps(2);
    company = {
      name: "test company name"
    };
    window.location = {
      href: "http://localhost/",
      pathname: "/"
    } as any;
  });

  function wrapper({ children }: any) {
    return (
      <MockAuthProvider>
        <MockRecoilProvider>
          <MockGraphQLProvider
            mockData={{ orgApps }}
            mocks={[mockCurrentUserQuery(), mockCompanyQuery(company)]}
          >
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </MockGraphQLProvider>
        </MockRecoilProvider>
      </MockAuthProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<Home />, { wrapper });

    const appSelector = await findByTestId("app-selector");
    expect(appSelector).toBeDefined();
  });

  it("renders company name", async () => {
    const { findByText } = render(<Home />, { wrapper });

    const companyName = await findByText(company.name!);
    expect(companyName).toBeDefined();
  });

  it("renders application cards", async () => {
    const { findAllByTestId } = render(<Home />, { wrapper });

    const appCards = await findAllByTestId("app-card");
    expect(appCards).toHaveLength(orgApps.length);
  });

  it("only renders application cards for the apps the currentUser has access to", async () => {
    orgApps = generateDummyOrgApps(3);
    orgApps[0].hasAccess = false;
    const { findAllByTestId } = render(<Home />, { wrapper });

    const appCards = await findAllByTestId("app-card");
    expect(appCards).toHaveLength(2);
    expect(appCards[0]).toHaveTextContent(orgApps[1].name);
    expect(appCards[1]).toHaveTextContent(orgApps[2].name);
  });

  it("renders a message if the currentUser doesn't have access to any apps", async () => {
    orgApps = generateDummyOrgApps(1);
    orgApps[0].hasAccess = false;
    const { queryByTestId, getByTestId } = render(<Home />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("no-app-access")).toBeInTheDocument();
    });
    expect(queryByTestId("app-card")).not.toBeInTheDocument();
  });

  it("renders link to more VizExplorer solutions", async () => {
    const { findAllByTestId } = render(<Home />, { wrapper });

    const viewMoreBtn = await findAllByTestId("app-selector-view-more");
    expect(viewMoreBtn).toBeDefined();
  });

  describe("Automatic application navigation", () => {
    it("nagivates for a single app", async () => {
      orgApps = generateDummyOrgApps(1);
      render(<Home />, { wrapper });

      await waitFor(() => {
        expect(window.location.href).toEqual(orgApps[0].url);
      });
    });

    it("doesn't navigate for a single app if `isValid` is false", async () => {
      orgApps = generateDummyOrgApps(1);
      orgApps[0].isValid = false;
      render(<Home />, { wrapper });

      await waitFor(() => {
        expect(window.location.href).toEqual("http://localhost/");
      });
    });

    it("navigates for multi app if the ID matches local storage", async () => {
      localStorage.setItem(LAST_ACCESSED_APP, orgApps[1].id);
      render(<Home />, { wrapper });

      await waitFor(() => {
        expect(window.location.href).toEqual(orgApps[1].url);
      });
    });

    it("doesn't navigate for multi app if no IDs match local storage", async () => {
      localStorage.removeItem(LAST_ACCESSED_APP);
      render(<Home />, { wrapper });

      await waitFor(() => {
        expect(window.location.href).toEqual("http://localhost/");
      });
    });
  });
});
