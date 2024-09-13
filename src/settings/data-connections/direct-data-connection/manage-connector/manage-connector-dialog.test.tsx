import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { MockedProvider } from "@apollo/client/testing";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ManageConnectorDialog } from "./manage-connector-dialog";
import {
  generateDummyDataConnectors,
  mockDataConnectorsCreate,
  mockDataConnectorsUpdate
} from "../../../../view/testing/mocks";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../../../view/graphql";
import { getInput, updateInput } from "../../../../view/testing";

const mockConnector = generateDummyDataConnectors(1)[0];
Element.prototype.scrollTo = () => {};
const origMatchMedia = window.matchMedia;

describe("<ManageConnectorDialog />", () => {
  const cache = new InMemoryCache(cacheConfig);

  beforeAll(() => {
    // ensure time picker is rendered in desktop mode.
    window.matchMedia = jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn()
    })) as any;
  });

  beforeEach(() => {
    cache.restore({});
  });

  afterAll(() => {
    window.matchMedia = origMatchMedia;
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <MockedProvider
            cache={cache}
            mocks={[mockDataConnectorsUpdate(), mockDataConnectorsCreate()]}
          >
            {children}
          </MockedProvider>
        </ThemeProvider>
      </LocalizationProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("manage-connector-dialog")).toBeInTheDocument();
  });

  it("renders connection form", () => {
    const { getByTestId } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("connection-form")).toBeInTheDocument();
  });

  it("runs onClose if `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });

  it("runs onClose if the backdrop is clicked", () => {
    const onClose = jest.fn();
    const { getAllByRole } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getAllByRole("presentation")[0].firstChild!);
    expect(onClose).toHaveBeenCalled();
  });

  it("disables form fields while submitting update/creation", async () => {
    const onClose = jest.fn();
    const { getByText, getByTestId } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      expect(getByText("Cancel")).toBeDisabled();
      expect(getByText("Continue")).toBeDisabled();
      expect(getInput(getByTestId("name-input"))).toBeDisabled();
    });
  });

  it("runs onClose upon successful update", async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ManageConnectorDialog connector={mockConnector} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("runs onClose upon successful creation", async () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <ManageConnectorDialog connector={null} onClose={onClose} />,
      { wrapper }
    );

    updateInput(getByTestId("name-input"), mockConnector.name);
    updateInput(getByTestId("host-input"), mockConnector.params!.hostname);
    updateInput(getByTestId("port-input"), mockConnector.params!.port);
    updateInput(getByTestId("database-input"), mockConnector.params!.database);
    updateInput(getByTestId("username-input"), mockConnector.params!.username);
    updateInput(getByTestId("password-input"), "secret_password");
    updateInput(
      getByTestId("schedule-input"),
      `${mockConnector.dataRefreshTime!.hour}:${mockConnector.dataRefreshTime!.minute} am`
    );
    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("adds Connector to cache on creation", async () => {
    // id `100` reserved for creation
    const cacheId = `${mockConnector.__typename}:100`;
    const { getByTestId, getByText } = render(
      <ManageConnectorDialog connector={null} onClose={() => {}} />,
      { wrapper }
    );

    updateInput(getByTestId("name-input"), mockConnector.name);
    updateInput(getByTestId("host-input"), mockConnector.params!.hostname);
    updateInput(getByTestId("port-input"), mockConnector.params!.port);
    updateInput(getByTestId("database-input"), mockConnector.params!.database);
    updateInput(getByTestId("username-input"), mockConnector.params!.username);
    updateInput(getByTestId("password-input"), "secret_password");
    updateInput(
      getByTestId("schedule-input"),
      `${mockConnector.dataRefreshTime!.hour}:${mockConnector.dataRefreshTime!.minute} am`
    );
    fireEvent.click(getByText("Continue"));

    await waitFor(() => {
      expect(Object.keys(cache.extract())).toContain(cacheId);
    });
  });
});
