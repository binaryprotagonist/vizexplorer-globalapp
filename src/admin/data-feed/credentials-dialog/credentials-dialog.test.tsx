import { fireEvent, render } from "@testing-library/react";
import { CredentialsDialog } from "./credentials-dialog";
import { MockedProvider } from "@apollo/client/testing";
import {
  generateDummyOrgSummaries,
  mockOrgStageDatabaseQuery,
  mockStageDatabase
} from "../../../view/testing/mocks/admin";
import { ThemeProvider } from "../../../theme";
import { mockDeliveryMethodQuery } from "@vizexplorer/global-ui-core";

// @ts-ignore readonly property
const mockClipboard = (global.navigator.clipboard = {
  // @ts-ignore only mock writeText as that's all we use
  writeText: jest.fn()
});

describe("<CredentialsDialog />", () => {
  const mockOrg = generateDummyOrgSummaries(1)[0];
  const mockStageDb = { ...mockStageDatabase };
  let isOnprem = false;

  beforeAll(() => {
    delete (window as any).location;
    window.location = {
      origin: "http://localhost",
      hostname: "localhost"
    } as any;
  });

  beforeEach(() => {
    isOnprem = false;
    mockClipboard.writeText.mockClear();
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          mocks={[
            mockOrgStageDatabaseQuery(mockOrg.id, mockStageDb),
            mockDeliveryMethodQuery(isOnprem)
          ]}
        >
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<CredentialsDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByTestId("feed-credentials-dialog")).toBeInTheDocument();
  });

  it("renders loading skeleton while loading Stage DB information", () => {
    const { getByTestId } = render(<CredentialsDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByTestId("stage-db-loading")).toBeInTheDocument();
  });

  it("renders Stage DB information", async () => {
    const { getByTestId, findByTestId } = render(
      <CredentialsDialog onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    expect(getByTestId("stage-db-notifydataloaded")).toBeInTheDocument();
    expect(getByTestId("stage-db-host")).toHaveTextContent(mockStageDb.host);
    expect(getByTestId("stage-db-port")).toHaveTextContent(`${mockStageDb.port}`);
    expect(getByTestId("stage-db-databasename")).toHaveTextContent(
      mockStageDb.databaseName
    );
    expect(getByTestId("stage-db-username")).toHaveTextContent(mockStageDb.username);
    expect(getByTestId("stage-db-password")).toHaveTextContent(mockStageDb.password);
  });

  it("uses `window.location.hostname` for DB host for onprem", async () => {
    isOnprem = true;
    const { getByTestId, findByTestId } = render(
      <CredentialsDialog onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    expect(getByTestId("stage-db-host")).not.toHaveTextContent(mockStageDb.host);
    expect(getByTestId("stage-db-host")).toHaveTextContent("localhost");
  });

  it("renders expected Slot Feed Endpoint", async () => {
    isOnprem = true;
    const { getByTestId, findByTestId } = render(
      <CredentialsDialog onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    expect(getByTestId("stage-db-notifydataloaded")).toHaveTextContent(
      "http://localhost/data_feed/new_data_available?database_name=data_feed_1"
    );
  });

  it("runs `navigator.clipboard.writeText` if copy is clicked in a secure context", async () => {
    window.isSecureContext = true;
    const { getByTestId, findByTestId } = render(
      <CredentialsDialog onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    fireEvent.click(getByTestId("stage-db-databasename-copy"));
    await findByTestId("copy-clipboard-snackbar");
    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockStageDb.databaseName);
  });

  it("runs `document.execCommand('copy')` if copy is clicked in an insecure context", async () => {
    window.isSecureContext = false;
    document.execCommand = jest.fn(() => true);
    const { getByTestId, findByTestId } = render(
      <CredentialsDialog onClose={() => {}} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    fireEvent.click(getByTestId("stage-db-databasename-copy"));
    await findByTestId("copy-clipboard-snackbar");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("renders `Close` button", async () => {
    const { getByText, findByTestId } = render(<CredentialsDialog onClose={() => {}} />, {
      wrapper
    });

    await findByTestId("database-credentials");
    expect(getByText("Close")).toBeInTheDocument();
  });

  it("calls `onClose` if `Close` button is clicked", async () => {
    const mockClose = jest.fn();
    const { getByText, findByTestId } = render(
      <CredentialsDialog onClose={mockClose} />,
      { wrapper }
    );

    await findByTestId("database-credentials");
    fireEvent.click(getByText("Close"));
    expect(mockClose).toHaveBeenCalled();
  });
});
