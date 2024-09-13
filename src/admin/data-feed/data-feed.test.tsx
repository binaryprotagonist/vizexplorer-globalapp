import { render } from "@testing-library/react";
import { DataFeed } from "./data-feed";
import {
  generateDummyOrgSummaries,
  mockDataFeedSourceSitesIds,
  mockDataFeedStatus,
  mockOrgDataAdapterEnabled,
  mockOrgSitesMapping
} from "../../view/testing/mocks/admin";
import { ThemeProvider } from "../../theme";
import { MockedProvider } from "../../view/testing";

describe("<DataFeed />", () => {
  const selectedOrg = generateDummyOrgSummaries(1)[0];
  let enabled = false;

  beforeEach(() => {
    enabled = false;
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          mocks={[
            mockOrgDataAdapterEnabled(selectedOrg, enabled),
            mockOrgSitesMapping(selectedOrg.id),
            mockDataFeedStatus(),
            mockDataFeedStatus(),
            mockDataFeedSourceSitesIds(),
            mockDataFeedSourceSitesIds()
          ]}
        >
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<DataFeed />, { wrapper });

    expect(getByTestId("feed-configuration")).toBeInTheDocument();
  });

  it("renders `Enable Feed` button if Data Feed is not enabled", async () => {
    const { findByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("data-feed-enable-btn");
  });

  it("doesn't render `Enable Feed` button if Data Feed is already enabled", async () => {
    enabled = true;
    const { findByTestId, queryByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("feed-credentials");
    expect(queryByTestId("feed-enable")).not.toBeInTheDocument();
  });

  it("renders database credentials if Data Feed is enabled", async () => {
    enabled = true;
    const { findByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("feed-credentials");
  });

  it("doesn't render database credentials if Data Feed is not enabled", async () => {
    const { queryByTestId, findByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("data-feed-enable-btn");
    expect(queryByTestId("feed-credentials")).not.toBeInTheDocument();
  });

  it("render `Status` if Data Feed is enabled", async () => {
    enabled = true;
    const { findByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("feed-status");
  });

  it("doesn't render `Status` if Data Feed is disabled", async () => {
    const { queryByTestId, findByTestId } = render(<DataFeed />, { wrapper });

    await findByTestId("data-feed-enable-btn");
    expect(queryByTestId("feed-status")).not.toBeInTheDocument();
  });
});
