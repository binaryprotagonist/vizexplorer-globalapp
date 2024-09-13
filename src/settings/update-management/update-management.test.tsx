import { render, waitFor } from "@testing-library/react";
import { UpdateManagement } from "./update-management";
import { ThemeProvider } from "../../theme";
import {
  LatestVersion,
  MockAuthProvider,
  mockDeliveryMethodQuery,
  MockRecoilProvider
} from "@vizexplorer/global-ui-core";
import { GlobalMockedProvider } from "../../view/testing";
import { BrowserRouter } from "react-router-dom";

function wrapper({ children }: any) {
  return (
    <MockRecoilProvider>
      <MockAuthProvider>
        <GlobalMockedProvider
          mockData={{ isOnprem: true }}
          mocks={[mockDeliveryMethodQuery(true)]}
        >
          <ThemeProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </ThemeProvider>
        </GlobalMockedProvider>
      </MockAuthProvider>
    </MockRecoilProvider>
  );
}

describe("<UpdateManagement />", () => {
  let mockLatestVersion: LatestVersion | null = null;

  beforeEach(() => {
    mockLatestVersion = {
      latestVersion: "2.0.0",
      instructionUrl: "https://apps.vizexplorer.dev/installer/instruction.pdf",
      notes: "# Release Notes Header"
    };
    // fetch to check for updates (/installer/apps/latest?current_version=xx)
    fetchMock.doMock(JSON.stringify(mockLatestVersion));
  });

  it("renders", async () => {
    const { findByTestId } = render(<UpdateManagement />, { wrapper });

    await findByTestId("update-management");
  });

  it("renders Version Status card", async () => {
    const { findByTestId } = render(<UpdateManagement />, { wrapper });

    await findByTestId("version-status");
  });

  it("renders Release Notes if updates are available", async () => {
    const { findByTestId } = render(<UpdateManagement />, { wrapper });

    await findByTestId("release-notes");
  });

  it("doesn't render Release Notes if no updates are available", async () => {
    mockLatestVersion = null;
    fetchMock.doMock(JSON.stringify(mockLatestVersion));
    const { queryByTestId, findByTestId } = render(<UpdateManagement />, {
      wrapper
    });

    await findByTestId("version-status");
    expect(queryByTestId("release-notes")).not.toBeInTheDocument();
  });

  it("renders latest version information from API", async () => {
    const { getByText } = render(<UpdateManagement />, { wrapper });

    await waitFor(() => {
      expect(getByText(mockLatestVersion!.latestVersion)).toBeInTheDocument();
    });
    // instruction download link
    expect(getByText("Click Here")).toHaveAttribute(
      "href",
      mockLatestVersion!.instructionUrl
    );
  });
});
