import { fireEvent, render } from "@testing-library/react";
import { DatabaseCredentials } from "./database-credentials";
import { ThemeProvider } from "../../../theme";
import { FeedCredentials } from "./types";

const mockCredentials: FeedCredentials = {
  orgId: "1",
  dbName: "data_feed_1",
  host: "vod-db-dev",
  port: 5432,
  username: "db-user",
  password: "db-pass",
  slotFeedEndpoint: "http://notifydataloaded"
};

describe("<DatabaseCredentials />", () => {
  const mockClickCopy = jest.fn();

  beforeEach(() => {
    mockClickCopy.mockClear();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("database-credentials")).toBeInTheDocument();
  });

  it("renders provided Stage DB information", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("stage-db-notifydataloaded")).toHaveTextContent(
      mockCredentials.slotFeedEndpoint
    );
    expect(getByTestId("stage-db-host")).toHaveTextContent(mockCredentials.host);
    expect(getByTestId("stage-db-port")).toHaveTextContent(`${mockCredentials.port}`);
    expect(getByTestId("stage-db-databasename")).toHaveTextContent(
      mockCredentials.dbName
    );
    expect(getByTestId("stage-db-username")).toHaveTextContent(mockCredentials.username);
    expect(getByTestId("stage-db-password")).toHaveTextContent(mockCredentials.password);
  });

  it("renders copy button for each Stage DB field", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("stage-db-notifydataloaded-copy")).toBeInTheDocument();
    expect(getByTestId("stage-db-host-copy")).toBeInTheDocument();
    expect(getByTestId("stage-db-port-copy")).toBeInTheDocument();
    expect(getByTestId("stage-db-databasename-copy")).toBeInTheDocument();
    expect(getByTestId("stage-db-username-copy")).toBeInTheDocument();
    expect(getByTestId("stage-db-password-copy")).toBeInTheDocument();
  });

  it("renders LoadingSkeleton if `loading` is true", () => {
    const { getByTestId, queryByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={true}
        onClickCopy={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("stage-db-loading")).toBeInTheDocument();
    expect(queryByTestId("database-credentials")).not.toBeInTheDocument();
  });

  it("doesn't render LoadingSkeleton if `loading` is false", () => {
    const { getByTestId, queryByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={() => {}}
      />,
      { wrapper }
    );

    expect(queryByTestId("stage-db-loading")).not.toBeInTheDocument();
    expect(getByTestId("database-credentials")).toBeInTheDocument();
  });

  it("throws an error if `credentials` is null and `loading` is `FALSE`", () => {
    jest.spyOn(console, "error").mockImplementation();
    expect(() =>
      render(
        <DatabaseCredentials credentials={null} loading={false} onClickCopy={() => {}} />,
        { wrapper }
      )
    ).toThrow();
  });

  it("doesn't throw if `credentials` is null `loading` is `TRUE`", () => {
    expect(() =>
      render(
        <DatabaseCredentials credentials={null} loading={true} onClickCopy={() => {}} />,
        { wrapper }
      )
    ).not.toThrow();
  });

  it("runs `onClickCopy` with expected value if Slot Feed Endpoint is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-notifydataloaded-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.slotFeedEndpoint);
  });

  it("runs `onClickCopy` with expected value if Host is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-host-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.host);
  });

  it("runs `onClickCopy` with expected value if Port is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-port-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.port.toString());
  });

  it("runs `onClickCopy` with expected value if Database Name is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-databasename-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.dbName);
  });

  it("runs `onClickCopy` with expected value if Username is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-username-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.username);
  });

  it("runs `onClickCopy` with expected value if Password is copied", () => {
    const { getByTestId } = render(
      <DatabaseCredentials
        credentials={mockCredentials}
        loading={false}
        onClickCopy={mockClickCopy}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("stage-db-password-copy"));
    expect(mockClickCopy).toHaveBeenCalledWith(mockCredentials.password);
  });
});
