import { render } from "@testing-library/react";
import { VersionStatus } from "./version-status";
import { ThemeProvider } from "../../theme";
import { LatestVersion } from "@vizexplorer/global-ui-core";

const mockLatestVersion: LatestVersion = {
  instructionUrl: "https://apps.vizexplorer.dev/installer/instruction.pdf",
  latestVersion: "2.0.0",
  notes: ""
};

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<VersionStatus />", () => {
  it("renders", () => {
    const { getByTestId } = render(<VersionStatus currentVersion={"1.0.0"} />, {
      wrapper
    });

    expect(getByTestId("version-status")).toBeInTheDocument();
  });

  it("renders expected title when no update is available", () => {
    const { getByText } = render(<VersionStatus currentVersion={"1.0.0"} />, {
      wrapper
    });

    expect(getByText("Applications Up To Date")).toBeInTheDocument();
  });

  it("renders expected title when there is an update available", () => {
    const { getByText } = render(
      <VersionStatus currentVersion={"1.0.0"} latestVersion={mockLatestVersion} />,
      { wrapper }
    );

    expect(getByText("Update Available")).toBeInTheDocument();
  });

  it("renders expected fields when no update is available", () => {
    const { getByText, queryByText, queryByTestId } = render(
      <VersionStatus currentVersion={"1.0.0"} />,
      { wrapper }
    );

    expect(getByText("Current Version")).toBeInTheDocument();
    expect(getByText("1.0.0")).toBeInTheDocument();

    expect(queryByText("Latest Version")).not.toBeInTheDocument();
    expect(queryByTestId("latest-version")).not.toBeInTheDocument();

    expect(queryByText("Download Instructions")).not.toBeInTheDocument();
    expect(queryByTestId("instruction-url")).not.toBeInTheDocument();
  });

  it("renders expected fields when an update is available", () => {
    const { getByText, getByTestId } = render(
      <VersionStatus currentVersion={"1.0.0"} latestVersion={mockLatestVersion} />,
      { wrapper }
    );

    expect(getByText("Current Version")).toBeInTheDocument();
    expect(getByText("1.0.0")).toBeInTheDocument();

    expect(getByText("Latest Version")).toBeInTheDocument();
    expect(getByTestId("latest-version")).toHaveTextContent(
      mockLatestVersion.latestVersion
    );

    expect(getByText("Download Instructions")).toBeInTheDocument();
    const downloadLink = getByTestId("instruction-url");
    expect(downloadLink).toHaveTextContent("Click Here");
    expect(downloadLink).toHaveAttribute("href", mockLatestVersion.instructionUrl);
  });

  it("renders expected remainingDays message given a value greater than 0", () => {
    const { getByTestId } = render(
      <VersionStatus
        currentVersion={"1.0.0"}
        latestVersion={mockLatestVersion}
        remainingDays={30}
      />,
      { wrapper }
    );

    expect(getByTestId("version-remaining-days")).toHaveTextContent(
      "30 days or applications will be disabled"
    );
  });

  it("renders expected remainingDays message given a value of 0", () => {
    const { getByTestId } = render(
      <VersionStatus
        currentVersion={"1.0.0"}
        latestVersion={mockLatestVersion}
        remainingDays={0}
      />,
      { wrapper }
    );

    expect(getByTestId("version-remaining-days")).toHaveTextContent(
      "Please update to the latest version immediately to reactivate applications"
    );
  });

  it("doesn't render remainingDays message given a value of null", () => {
    const { queryByTestId } = render(
      <VersionStatus
        currentVersion={"1.0.0"}
        latestVersion={mockLatestVersion}
        remainingDays={null}
      />,
      { wrapper }
    );

    expect(queryByTestId("version-remaining-days")).not.toBeInTheDocument();
  });

  it("doesn't render remainingDays message if `remainingDays` is not provided", () => {
    const { queryByTestId } = render(
      <VersionStatus currentVersion={"1.0.0"} latestVersion={mockLatestVersion} />,
      { wrapper }
    );

    expect(queryByTestId("version-remaining-days")).not.toBeInTheDocument();
  });
});
