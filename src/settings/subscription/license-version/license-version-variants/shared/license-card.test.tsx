import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { LicenseCard } from "./license-card";
import { formatLastVerified } from "../utils";
import { LicenseAction } from "../types";

describe("<LicenseCard />", () => {
  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders expected fields, values and actions for admin-cloud-to-cloud type", () => {
    const { getByTestId, queryByTestId } = render(
      <LicenseCard
        type={"admin-cloud-to-cloud"}
        appVersion={"v1.0.0"}
        dataObjectsVersion={"v2.0.0"}
      />,
      { wrapper }
    );

    expect(getByTestId("title")).toHaveTextContent("License / Version");
    expect(getByTestId("app-version-field")).toHaveTextContent("v1.0.0");
    expect(getByTestId("data-objects-version-field")).toHaveTextContent("v2.0.0");
    expect(queryByTestId("tunnel-field")).not.toBeInTheDocument();
    expect(queryByTestId("license-key-field")).not.toBeInTheDocument();
    expect(queryByTestId("license-status-field")).not.toBeInTheDocument();
    expect(queryByTestId("last-verified-field")).not.toBeInTheDocument();
  });

  it("renders expected fields, values and actions for admin-cloud-to-onprem type", () => {
    const { getByTestId } = render(
      <LicenseCard
        type={"admin-cloud-to-onprem"}
        appVersion={"v1.0.0"}
        dataObjectsVersion={"v2.0.0"}
        licenseKey={"abc-123"}
        licenseStatus={"active"}
        tunnelUrl={"http://test123.dev"}
        lastVerificationDate={"2022-01-01T01:30:00"}
        disableActions={false}
        onClickAction={() => {}}
      />,
      { wrapper }
    );

    const lastVerified = formatLastVerified("2022-01-01T01:30:00");
    expect(getByTestId("title")).toHaveTextContent("License / Version");
    expect(getByTestId("app-version-field")).toHaveTextContent("v1.0.0");
    expect(getByTestId("data-objects-version-field")).toHaveTextContent("v2.0.0");
    expect(getByTestId("tunnel-field")).toHaveTextContent("Online");
    expect(getByTestId("tunnel-connect-btn")).toBeInTheDocument();
    expect(getByTestId("license-key-field")).toHaveTextContent("abc-123");
    expect(getByTestId("license-generate-new-btn")).toBeInTheDocument();
    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
    expect(getByTestId("license-toggle-btn")).toHaveTextContent("Disable");
    expect(getByTestId("last-verified-field")).toHaveTextContent(lastVerified);
  });

  it("renders expected fields, values and actions for admin-onprem type", () => {
    const { getByTestId, queryByTestId } = render(
      <LicenseCard
        type={"admin-onprem"}
        appVersion={"v1.0.0"}
        dataObjectsVersion={"v2.0.0"}
        licenseStatus={"active"}
      />,
      { wrapper }
    );

    expect(getByTestId("title")).toHaveTextContent("License / Version");
    expect(getByTestId("app-version-field")).toHaveTextContent("v1.0.0");
    expect(getByTestId("data-objects-version-field")).toHaveTextContent("v2.0.0");
    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
    expect(queryByTestId("license-toggle-btn")).not.toBeInTheDocument();
    expect(queryByTestId("tunnel-field")).not.toBeInTheDocument();
    expect(queryByTestId("license-key-field")).not.toBeInTheDocument();
    expect(queryByTestId("last-verified-field")).not.toBeInTheDocument();
  });

  it("renders expected fields, values and actions for app-onprem type", () => {
    const { getByTestId, queryByTestId } = render(
      <LicenseCard type={"app-onprem"} licenseStatus={"active"} />,
      { wrapper }
    );

    expect(getByTestId("title")).toHaveTextContent("License");
    expect(getByTestId("license-status-field")).toHaveTextContent("Active");
    expect(queryByTestId("license-toggle-btn")).not.toBeInTheDocument();
    expect(queryByTestId("app-version-field")).not.toBeInTheDocument();
    expect(queryByTestId("data-objects-version-field")).not.toBeInTheDocument();
    expect(queryByTestId("tunnel-field")).not.toBeInTheDocument();
    expect(queryByTestId("license-key-field")).not.toBeInTheDocument();
    expect(queryByTestId("last-verified-field")).not.toBeInTheDocument();
  });

  it("renders loading card state if loading is true", () => {
    const { getByTestId, queryByTestId } = render(
      <LicenseCard type={"app-onprem"} licenseStatus={"active"} loading />,
      { wrapper }
    );

    expect(getByTestId("license-card-loading")).toBeInTheDocument();
    expect(queryByTestId("license-card")).not.toBeInTheDocument();
  });

  it("renders License Status as Expired for an expired license", () => {
    const { getByTestId } = render(
      <LicenseCard type={"app-onprem"} licenseStatus={"expired"} />,
      { wrapper }
    );

    expect(getByTestId("license-status")).toHaveTextContent("Expired");
  });

  describe("admin-cloud-to-onprem", () => {
    it("disables all buttons if `disableActions` is true", () => {
      const { getByTestId } = render(
        <LicenseCard
          disableActions
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(getByTestId("tunnel-connect-btn")).toBeDisabled();
      expect(getByTestId("license-generate-new-btn")).toBeDisabled();
      expect(getByTestId("license-toggle-btn")).toBeDisabled();
    });

    it("enables all actions if `disableActions` is false", () => {
      const { getByTestId } = render(
        <LicenseCard
          disableActions={false}
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(getByTestId("tunnel-connect-btn")).toBeEnabled();
      expect(getByTestId("license-generate-new-btn")).toBeEnabled();
      expect(getByTestId("license-toggle-btn")).toBeEnabled();
    });

    it("renders tunnel status as Online if the tunnel URL is not null", () => {
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(getByTestId("tunnel-status")).toHaveTextContent("Online");
    });

    it("renders tunnel status as Offline if the tunnel URL is null", () => {
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={null}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(getByTestId("tunnel-status")).toHaveTextContent("Offline");
    });

    it("runs onClickAction when the tunnel Connect button is clicked", () => {
      const onClickAction = jest.fn();
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={onClickAction}
        />,
        { wrapper }
      );

      fireEvent.click(getByTestId("tunnel-connect-btn"));

      expect(onClickAction).toHaveBeenCalledWith<[LicenseAction]>({
        type: "tunnel-connect",
        url: "http://test123.dev"
      });
    });

    it("disables the tunnel Connect button if the tunnel URL is null", () => {
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={null}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(getByTestId("tunnel-connect-btn")).toBeDisabled();
    });

    it("runs onClickAction when the Generate New License button is clicked", () => {
      const onClickAction = jest.fn();
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={onClickAction}
        />,
        { wrapper }
      );

      fireEvent.click(getByTestId("license-generate-new-btn"));

      expect(onClickAction).toHaveBeenCalledWith<[LicenseAction]>({
        type: "generate-new"
      });
    });

    it("renders license toggle as Enable if the license status is expired", () => {
      const onClickAction = jest.fn();
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"expired"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={onClickAction}
        />,
        { wrapper }
      );

      fireEvent.click(getByTestId("license-toggle-btn"));

      expect(getByTestId("license-toggle-btn")).toHaveTextContent("Enable");
      expect(onClickAction).toHaveBeenCalledWith({ type: "enable" });
    });

    it("renders license toggle as Disable if the license status is active", () => {
      const onClickAction = jest.fn();
      const { getByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={"active"}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={onClickAction}
        />,
        { wrapper }
      );

      fireEvent.click(getByTestId("license-toggle-btn"));

      expect(getByTestId("license-toggle-btn")).toHaveTextContent("Disable");
      expect(onClickAction).toHaveBeenCalledWith<[LicenseAction]>({ type: "disable" });
    });

    it("doesn't render license toggle button if the license status is null", () => {
      const { queryByTestId } = render(
        <LicenseCard
          type={"admin-cloud-to-onprem"}
          appVersion={"v1.0.0"}
          dataObjectsVersion={"v2.0.0"}
          licenseKey={"abc-123"}
          licenseStatus={null}
          tunnelUrl={"http://test123.dev"}
          lastVerificationDate={"2022-01-01T01:30:00"}
          disableActions={false}
          onClickAction={() => {}}
        />,
        { wrapper }
      );

      expect(queryByTestId("license-toggle-btn")).not.toBeInTheDocument();
    });
  });
});
