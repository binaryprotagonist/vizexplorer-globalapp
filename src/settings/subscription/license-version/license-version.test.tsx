import { render } from "@testing-library/react";
import { LicenseVersion } from "./license-version";
import { Environment } from "../subscriptions";
import { ThemeProvider } from "../../../theme";
import * as buildUtils from "../../../utils";

jest.mock("../../../utils", () => ({
  isAdminBuild: jest.fn()
}));

// Ensure current path is hit without rendering real components and needing to mock APIs
jest.mock("./license-version-variants", () => ({
  AdminCloudLicenseVersion: () => (
    <div data-testid={"mock-admin-cloud-license-version"} />
  ),
  AdminOnpremLicenseVersion: () => (
    <div data-testid={"mock-admin-onprem-license-version"} />
  ),
  AdminOnpremTunnelLicenseVersion: () => (
    <div data-testid={"mock-admin-onprem-tunnel-license-version"} />
  ),
  OnpremLicenseVersion: () => <div data-testid={"mock-onprem-license-version"} />
}));

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<LicenseVersion />", () => {
  describe("App Build", () => {
    it("renders OnpremLicenseVersion if currentEnv and subscriptionEnv is OnPrem", () => {
      const { getByTestId } = render(
        <LicenseVersion
          currentEnv={Environment.ONPREM}
          subscriptionEnv={Environment.ONPREM}
        />
      );

      expect(getByTestId("mock-onprem-license-version")).toBeInTheDocument();
    });

    it("returns null if any other combination of currentEnv and subscriptionEnv is provded", () => {
      const { container, rerender } = render(
        <LicenseVersion
          currentEnv={Environment.CLOUD}
          subscriptionEnv={Environment.CLOUD}
        />
      );
      expect(container).toBeEmptyDOMElement();

      rerender(
        <LicenseVersion
          currentEnv={Environment.CLOUD}
          subscriptionEnv={Environment.ONPREM}
        />
      );
      expect(container).toBeEmptyDOMElement();

      rerender(
        <LicenseVersion
          currentEnv={Environment.ONPREM}
          subscriptionEnv={Environment.CLOUD}
        />
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Admin Build", () => {
    beforeAll(() => {
      (buildUtils.isAdminBuild as jest.Mock).mockImplementation(() => true);
    });

    it("renders AdminCloudLicenseVersion if subscriptionEnv is Cloud", () => {
      const { getByTestId } = render(
        <LicenseVersion
          currentEnv={Environment.CLOUD}
          subscriptionEnv={Environment.CLOUD}
        />,
        { wrapper }
      );

      expect(getByTestId("mock-admin-cloud-license-version")).toBeInTheDocument();
    });

    it("renders AdminOnpremTunnelLicenseVersion if currentEnv is Cloud and subscriptionEnv is OnPrem", () => {
      const { getByTestId } = render(
        <LicenseVersion
          currentEnv={Environment.CLOUD}
          subscriptionEnv={Environment.ONPREM}
        />,
        { wrapper }
      );

      expect(getByTestId("mock-admin-onprem-tunnel-license-version")).toBeInTheDocument();
    });

    it("renders AdminOnpremLicenseVersion if currentEnv and subscriptionEnv is OnPrem", () => {
      const { getByTestId } = render(
        <LicenseVersion
          currentEnv={Environment.ONPREM}
          subscriptionEnv={Environment.ONPREM}
        />,
        { wrapper }
      );

      expect(getByTestId("mock-admin-onprem-license-version")).toBeInTheDocument();
    });

    it("renders OnpremLicenseVersion if currentEnv and subscriptionEnv is OnPrem", () => {
      const { getByTestId } = render(
        <LicenseVersion
          currentEnv={Environment.ONPREM}
          subscriptionEnv={Environment.ONPREM}
        />
      );

      expect(getByTestId("mock-admin-onprem-license-version")).toBeInTheDocument();
    });
  });
});
