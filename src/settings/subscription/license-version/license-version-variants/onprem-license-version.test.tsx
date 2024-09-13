import { render } from "@testing-library/react";
import { OnpremLicenseVersion } from "./onprem-license-version";
import { MockedProvider } from "testing/graphql-provider";
import { ThemeProvider } from "../../../../theme";
import { mockOnpremLicenseQuery } from "./__mocks__/onprem-license-version";
import { BrowserRouter } from "react-router-dom";
import { mockAdmin, mockCurrentUserQuery, mockOrgAdmin } from "testing/mocks";
import { GaUserFragment } from "generated-graphql";

describe("<OnPremLicenseVersion />", () => {
  let currentUser: GaUserFragment;

  beforeEach(() => {
    currentUser = mockOrgAdmin;
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[mockOnpremLicenseQuery(), mockCurrentUserQuery(currentUser)]}
      >
        <ThemeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    await findByTestId("license-card");
  });

  it("renders loading card while APIs are loading", () => {
    const { getByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    expect(getByTestId("license-card-loading")).toBeInTheDocument();
  });

  it("renders expected license card variant", async () => {
    const { findByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    const licenseCard = await findByTestId("license-card");

    expect(licenseCard).toHaveAttribute("data-variant", "app-onprem");
  });

  it("renders manage license button", () => {
    const { getByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeInTheDocument();
  });

  it("disables manage license button while loading", () => {
    const { getByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeDisabled();
  });

  it("enables manage license button if the user has permission", async () => {
    const { findByTestId, getByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    await findByTestId("license-card");

    expect(getByTestId("manage-license-button")).toBeEnabled();
  });

  it("disables manage license button if the user doesn't have permission", async () => {
    currentUser = mockAdmin;
    const { findByTestId, getByTestId } = render(<OnpremLicenseVersion />, { wrapper });

    await findByTestId("license-card");

    expect(getByTestId("manage-license-button")).toBeDisabled();
  });

  it("renders license status", async () => {
    const { findByTestId, getByTestId } = render(<OnpremLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
  });
});
