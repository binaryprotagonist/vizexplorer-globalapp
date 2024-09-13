import { render } from "@testing-library/react";
import { AdminCloudLicenseVersion } from "./admin-cloud-license-version";
import { ThemeProvider } from "../../../../theme";
import { MockedProvider } from "testing/graphql-provider";
import { mockAdminCloudVersionsQuery } from "./__mocks__/admin-cloud-license-version";

describe("<AdminCloudLicenseVersion />", () => {
  function wrapper({ children }: any) {
    return (
      <MockedProvider mocks={[mockAdminCloudVersionsQuery()]}>
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<AdminCloudLicenseVersion />, { wrapper });

    await findByTestId("license-card");
  });

  it("renders loading card while APIs are loading", () => {
    const { getByTestId } = render(<AdminCloudLicenseVersion />, { wrapper });

    expect(getByTestId("license-card-loading")).toBeInTheDocument();
  });

  it("renders expected license card variant", async () => {
    const { findByTestId } = render(<AdminCloudLicenseVersion />, { wrapper });

    const licenseCard = await findByTestId("license-card");

    expect(licenseCard).toHaveAttribute("data-variant", "admin-cloud-to-cloud");
  });

  it("renders versions from API", async () => {
    const { findByTestId, getByTestId } = render(<AdminCloudLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    expect(getByTestId("app-version-field")).toHaveTextContent("v1.0.0");
    expect(getByTestId("data-objects-version-field")).toHaveTextContent("v2.0.0");
  });
});
