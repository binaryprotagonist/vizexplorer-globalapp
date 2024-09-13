import { render } from "@testing-library/react";
import { TeamPerformance } from "./team-performance";
import { SisenseContext } from "view-v2/sisense";
import { mockSisenseCtx } from "view-v2/sisense/__mocks__/sisense";
import { MockedProvider } from "testing/graphql-provider";
import {
  mockDashboardResetMutation,
  mockSiteQuery
} from "view-v2/sisense/__mocks__/sisense-dashboard-context";
import { generateDummyTeamPerformanceMetrics } from "./__mocks__/team-performance";

const mockMetrics = generateDummyTeamPerformanceMetrics();

describe("<TeamPerformance />", () => {
  function wrapper({ children }: any) {
    return (
      <SisenseContext.Provider value={mockSisenseCtx}>
        <MockedProvider mocks={[mockSiteQuery(), mockDashboardResetMutation()]}>
          {children}
        </MockedProvider>
      </SisenseContext.Provider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <TeamPerformance dashboardId={"0"} siteId={"0"} metrics={[]} />,
      { wrapper }
    );

    expect(getByTestId("team-performance")).toBeInTheDocument();
  });

  it("renders metrics", async () => {
    const { findAllByTestId } = render(
      <TeamPerformance dashboardId={"0"} siteId={"0"} metrics={mockMetrics} />,
      { wrapper }
    );

    const widgets = await findAllByTestId("sisense-widget");
    expect(widgets).toHaveLength(mockMetrics.length);
  });

  it("renders metrics as missing if `sisenseTeamWidget` is null", () => {
    const missingMetrics = mockMetrics.map((metric) => ({
      ...metric,
      sisenseTeamWidget: null
    }));
    const { getAllByTestId } = render(
      <TeamPerformance dashboardId={"0"} siteId={"0"} metrics={missingMetrics} />,
      { wrapper }
    );

    expect(getAllByTestId("dynamic-widget-missing")).toHaveLength(missingMetrics.length);
  });
});
