import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render } from "@testing-library/react";
import { SiteMapping } from "./site-mapping";
import { produce } from "immer";
import {
  generateDummyOrgSummaries,
  generateDummySitesMappings,
  mockDataFeedSourceSitesIds,
  mockOrgSitesMapping
} from "../../../view/testing/mocks/admin";
import { ThemeProvider } from "../../../theme";

describe("<SiteMapping />", () => {
  const org = generateDummyOrgSummaries(1)[0];
  const sourceSiteIds = ["100", "101", "102"];
  // Only [0] has a preconfigured mapping. [1], [2] not configured
  const siteMapping = produce(generateDummySitesMappings(3), (siteMappings) => {
    siteMappings[0].dataFeedMapping!.sourceSiteId = sourceSiteIds[0];
    siteMappings[1].dataFeedMapping = null;
    siteMappings[2].dataFeedMapping = null;
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          mocks={[
            mockDataFeedSourceSitesIds(sourceSiteIds),
            mockOrgSitesMapping(org.id, siteMapping)
          ]}
        >
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<SiteMapping />, { wrapper });

    expect(getByTestId("site-mapping")).toBeInTheDocument();
  });

  it("renders mapping table", async () => {
    const { findByTestId } = render(<SiteMapping />, { wrapper });

    await findByTestId("site-mapping-table");
  });

  it("renders mapping dialog when `Edit` is clicked", async () => {
    const { getAllByText, queryByTestId, getByTestId, findByTestId } = render(
      <SiteMapping />,
      { wrapper }
    );

    await findByTestId("site-mapping-table");
    expect(queryByTestId("site-mapping-dialog")).not.toBeInTheDocument();

    fireEvent.click(getAllByText("Edit")[0]);
    expect(getByTestId("site-mapping-dialog")).toBeInTheDocument();
  });

  it("only renders unused `sourceSiteIds`", async () => {
    const { getAllByText, getByTestId, getAllByTestId, findByTestId } = render(
      <SiteMapping />,
      { wrapper }
    );

    await findByTestId("site-mapping-table");
    fireEvent.click(getAllByText("Edit")[1]);
    fireEvent.keyDown(getByTestId("source-site-id"), { keyCode: 40 });

    // sourceSiteIds[0] used by siteMapping[0]. sourceSiteIds[1] and sourceSiteIds[2] not used
    const options = getAllByTestId("source-site-id-option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent(sourceSiteIds[1]);
    expect(options[1]).toHaveTextContent(sourceSiteIds[2]);
  });
});
