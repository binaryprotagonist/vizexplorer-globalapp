import { render } from "@testing-library/react";
import { AdminOnpremLicenseVersion } from "./admin-onprem-license-version";
import { MockedProvider } from "testing/graphql-provider";
import { ThemeProvider } from "../../../../theme";
import { BrowserRouter } from "react-router-dom";
import {
  mockAdminOnpremLicenseQuery,
  mockAdminOnpremVersionsQuery
} from "./__mocks__/admin-onprem-license-version";

describe("<AdminOnpremLicenseVersion />", () => {
  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[mockAdminOnpremLicenseQuery(), mockAdminOnpremVersionsQuery()]}
      >
        <ThemeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<AdminOnpremLicenseVersion />, { wrapper });

    await findByTestId("license-card");
  });

  it("renders loading card while APIs are loading", () => {
    const { getByTestId } = render(<AdminOnpremLicenseVersion />, { wrapper });

    expect(getByTestId("license-card-loading")).toBeInTheDocument();
  });

  it("renders expected license card variant", async () => {
    const { findByTestId } = render(<AdminOnpremLicenseVersion />, { wrapper });

    const licenseCard = await findByTestId("license-card");

    expect(licenseCard).toHaveAttribute("data-variant", "admin-onprem");
  });

  it("renders Manage License button", () => {
    const { getByTestId } = render(<AdminOnpremLicenseVersion />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeInTheDocument();
  });

  it("renders license status", async () => {
    const { findByTestId, getByTestId } = render(<AdminOnpremLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
  });

  it("renders version information", async () => {
    const { findByTestId, getByTestId } = render(<AdminOnpremLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    expect(getByTestId("app-version-field")).toHaveTextContent("v1.0.0");
    expect(getByTestId("data-objects-version-field")).toHaveTextContent("v2.0.0");
  });
});
