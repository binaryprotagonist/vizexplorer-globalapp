import { render } from "@testing-library/react";
import { IndividualPerformance } from "./individual-performance";
import { SisenseContext } from "view-v2/sisense";
import { MockedProvider } from "@apollo/client/testing";
import {
  mockDashboardResetMutation,
  mockSiteQuery
} from "view-v2/sisense/__mocks__/sisense-dashboard-context";
import { mockSisenseCtx } from "view-v2/sisense/__mocks__/sisense";
import { generateDummyIndividualPerformanceMetrics } from "./__mocks__/individual-performance";

const mockMetrics = generateDummyIndividualPerformanceMetrics();

describe("<IndividualPerformance />", () => {
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
      <IndividualPerformance dashboardId={"0"} siteId={"0"} metrics={[]} />,
      { wrapper }
    );

    expect(getByTestId("individual-performance")).toBeInTheDocument();
  });

  it("renders metrics", async () => {
    const { findAllByTestId } = render(
      <IndividualPerformance dashboardId={"0"} siteId={"0"} metrics={mockMetrics} />,
      { wrapper }
    );

    const widgets = await findAllByTestId("sisense-widget");
    expect(widgets).toHaveLength(mockMetrics.length);
  });

  it("renders metrics as missing if `sisenseTeamWidget` is null", () => {
    const missingMetrics = mockMetrics.map((metric) => ({
      ...metric,
      sisenseIndividualWidget: null
    }));
    const { getAllByTestId } = render(
      <IndividualPerformance dashboardId={"0"} siteId={"0"} metrics={missingMetrics} />,
      { wrapper }
    );

    expect(getAllByTestId("dynamic-widget-missing")).toHaveLength(missingMetrics.length);
  });
});
