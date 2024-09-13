import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { AdminOnpremTunnelLicenseVersion } from "./admin-onprem-tunnel-license-version";
import { MockedProvider } from "testing/graphql-provider";
import { ThemeProvider } from "../../../../theme";
import {
  AdminOnpremTunnelsQueryOpts,
  mockAdminOnpremTunnelsQuery
} from "./__mocks__/admin-onprem-tunnel-license-version";
import {
  OrgLicensesQueryOpts,
  mockOrgLicense,
  mockOrgLicenseCreateMutation,
  mockOrgLicenseDisableMutation,
  mockOrgLicenseEnableMutation,
  mockOrgLicensesQuery
} from "testing/mocks/admin";
import { formatLastVerified } from "./utils";

describe("<AdminOnpremTunnelLicenseVersion />", () => {
  let orgLicensesRequests: OrgLicensesQueryOpts[];
  let tunnelQueryOpts: AdminOnpremTunnelsQueryOpts;

  beforeEach(() => {
    orgLicensesRequests = [{ orgLicenses: [mockOrgLicense] }];
    tunnelQueryOpts = { tunnelUrls: ["http://tunnel.dev"] };
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          mockAdminOnpremTunnelsQuery(tunnelQueryOpts),
          ...orgLicensesRequests.map(mockOrgLicensesQuery),
          mockOrgLicenseCreateMutation(),
          mockOrgLicenseEnableMutation(mockOrgLicense),
          mockOrgLicenseDisableMutation(mockOrgLicense)
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<AdminOnpremTunnelLicenseVersion />, { wrapper });

    await findByTestId("license-card");
  });

  it("renders loading card while APIs are loading", () => {
    const { getByTestId } = render(<AdminOnpremTunnelLicenseVersion />, { wrapper });

    expect(getByTestId("license-card-loading")).toBeInTheDocument();
  });

  it("renders expected license card variant", async () => {
    const { findByTestId } = render(<AdminOnpremTunnelLicenseVersion />, { wrapper });

    const licenseCard = await findByTestId("license-card");

    expect(licenseCard).toHaveAttribute("data-variant", "admin-cloud-to-onprem");
  });

  it("renders tunnel, license and version information", async () => {
    const { findByTestId, getByTestId } = render(<AdminOnpremTunnelLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    const appVersion = mockOrgLicense.lastVerifiedVersions!.app;
    const doVersion = mockOrgLicense.lastVerifiedVersions!.sisenseDataObject;
    const lastVerified = formatLastVerified(mockOrgLicense.lastVerifiedAt);
    expect(getByTestId("app-version-field")).toHaveTextContent(`v${appVersion}`);
    expect(getByTestId("data-objects-version-field")).toHaveTextContent(`${doVersion}`);
    expect(getByTestId("tunnel-field")).toHaveTextContent("Online");
    expect(getByTestId("tunnel-connect-btn")).toBeInTheDocument();
    expect(getByTestId("license-key-field")).toHaveTextContent(mockOrgLicense.key);
    expect(getByTestId("license-generate-new-btn")).toBeInTheDocument();
    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
    expect(getByTestId("license-toggle-btn")).toHaveTextContent("Disable");
    expect(getByTestId("last-verified-field")).toHaveTextContent(lastVerified);
  });

  it("renders license information from the latest issued license", async () => {
    const licenses = Array.from({ length: 3 }, (_, i) => ({
      ...mockOrgLicense,
      id: `${i}`,
      key: `key-${i}`,
      issuedAt: `2021-01-0${i + 1}T00:00:00Z`
    }));
    orgLicensesRequests = [{ orgLicenses: licenses }];
    const { findByTestId, getByTestId } = render(<AdminOnpremTunnelLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");

    const latestLicense = licenses[2];
    expect(getByTestId("license-key")).toHaveTextContent(latestLicense.key);
  });

  it("can generate and display a new license", async () => {
    orgLicensesRequests = [{ orgLicenses: [] }, { orgLicenses: [mockOrgLicense] }];
    const { findByTestId, getByTestId, getByText } = render(
      <AdminOnpremTunnelLicenseVersion />,
      { wrapper }
    );

    await findByTestId("license-card");
    fireEvent.click(getByText("Generate New License"));
    fireEvent.click(getByText("Generate"));

    await waitFor(() => {
      expect(getByTestId("license-key")).toHaveTextContent(mockOrgLicense.key);
    });
  });

  it("can enable an exired license", async () => {
    orgLicensesRequests = [
      { orgLicenses: [{ ...mockOrgLicense, expiresAt: "1900-01-01T00:00:00+00:00" }] }
    ];
    const { findByTestId, getByText, getByTestId } = render(
      <AdminOnpremTunnelLicenseVersion />,
      { wrapper }
    );

    await findByTestId("license-card");

    expect(getByTestId("license-status")).toHaveTextContent("Expired");

    fireEvent.click(getByText("Enable"));
    const dialog = getByTestId("license-status-toggle-dialog");
    fireEvent.click(within(dialog).getByText("Enable"));

    await waitFor(() => {
      expect(getByTestId("license-status")).toHaveTextContent("Active");
    });
  });

  it("can disable an active license", async () => {
    const { findByTestId, getByText, getByTestId } = render(
      <AdminOnpremTunnelLicenseVersion />,
      { wrapper }
    );

    await findByTestId("license-card");

    expect(getByTestId("license-status")).toHaveTextContent("Active");

    fireEvent.click(getByText("Disable"));
    const dialog = getByTestId("license-status-toggle-dialog");
    fireEvent.click(within(dialog).getByText("Disable"));

    await waitFor(() => {
      expect(getByTestId("license-status")).toHaveTextContent("Expired");
    });
  });

  it("renders Tunnel Status as Offline if no tunnels are available", async () => {
    tunnelQueryOpts = { tunnelUrls: [] };
    const { findByTestId, getByTestId } = render(<AdminOnpremTunnelLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");
    expect(getByTestId("tunnel-status")).toHaveTextContent("Offline");
    expect(getByTestId("tunnel-connect-btn")).toBeDisabled();
  });

  it("opens Tunnel Url in new tab if `Connect` is clicked", async () => {
    window.open = jest.fn();
    const { findByTestId, getByTestId } = render(<AdminOnpremTunnelLicenseVersion />, {
      wrapper
    });

    await findByTestId("license-card");
    fireEvent.click(getByTestId("tunnel-connect-btn"));
    expect(window.open).toHaveBeenCalledWith(tunnelQueryOpts!.tunnelUrls![0], "_blank");
  });
});
