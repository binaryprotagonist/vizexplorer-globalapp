import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { ConnectorForm } from "./connector-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput, updateInput } from "../../../../view/testing";
import { scheduleAsDate } from "../utils";
import { format } from "date-fns";
import { DataConnectorFieldsFragment } from "generated-graphql";
import { defaultTimezone } from "../../../../view/utils";
import { produce } from "immer";
import { FormInput } from "./types";

const mockConnection: DataConnectorFieldsFragment = {
  id: "123",
  name: "Connection 1",
  params: {
    hostname: "123.352.512.123",
    database: "sras_dev",
    port: 5432,
    username: "username@db",
    tlsEnabled: true
  },
  dataRefreshTime: { hour: 6, minute: 30, timezone: "Pacific/Auckland" }
};

describe("<ConnectorForm />", () => {
  let history: History = null as any;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <Router navigator={history} location={history.location}>
            {children}
          </Router>
        </ThemeProvider>
      </LocalizationProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={mockConnection} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getByTestId("connection-form")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={mockConnection} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getByTestId("name-input")).toBeInTheDocument();
    expect(getByTestId("host-input")).toBeInTheDocument();
    expect(getByTestId("port-input")).toBeInTheDocument();
    expect(getByTestId("tls-toggle")).toBeInTheDocument();
    expect(getByTestId("database-input")).toBeInTheDocument();
    expect(getByTestId("username-input")).toBeInTheDocument();
    expect(getByTestId("password-input")).toBeInTheDocument();
    expect(getByTestId("schedule-input")).toBeInTheDocument();
    expect(getByTestId("timezone-input")).toBeInTheDocument();
  });

  it("renders connection information", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={mockConnection} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getInput(getByTestId("name-input"))).toHaveAttribute(
      "value",
      mockConnection.name
    );
    expect(getInput(getByTestId("host-input"))).toHaveAttribute(
      "value",
      mockConnection.params!.hostname
    );
    expect(getInput(getByTestId("port-input"))).toHaveAttribute(
      "value",
      mockConnection.params!.port.toString()
    );
    expect(getInput(getByTestId("tls-toggle"))).toBeChecked();
    expect(getInput(getByTestId("database-input"))).toHaveAttribute(
      "value",
      mockConnection.params!.database
    );
    expect(getInput(getByTestId("username-input"))).toHaveAttribute(
      "value",
      mockConnection.params!.username
    );
    expect(getInput(getByTestId("schedule-input"))).toHaveAttribute(
      "value",
      format(scheduleAsDate(mockConnection.dataRefreshTime!), "hh:mm bb")
    );
    expect(getInput(getByTestId("timezone-input"))).toHaveAttribute(
      "value",
      defaultTimezone(mockConnection.dataRefreshTime!.timezone).name
    );
  });

  it("renders default values if no connector is provided", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={null} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getInput(getByTestId("name-input"))).toHaveAttribute("value", "");
    expect(getInput(getByTestId("host-input"))).toHaveAttribute("value", "");
    expect(getInput(getByTestId("port-input"))).toHaveAttribute("value", "");
    // tls enabled by default for new connections
    expect(getInput(getByTestId("tls-toggle"))).toBeChecked();
    expect(getInput(getByTestId("database-input"))).toHaveAttribute("value", "");
    expect(getInput(getByTestId("username-input"))).toHaveAttribute("value", "");
    expect(getInput(getByTestId("schedule-input"))).toHaveAttribute("value", "");
    expect(getInput(getByTestId("timezone-input"))).toHaveAttribute(
      "value",
      defaultTimezone().name
    );
  });

  it("renders TLS toggle as unchecked if `tlsEnabled` is false", () => {
    const connTlsFalse = produce(mockConnection, (draft) => {
      draft.params!.tlsEnabled = false;
    });
    const { getByTestId } = render(
      <ConnectorForm connector={connTlsFalse} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getInput(getByTestId("tls-toggle"))).not.toBeChecked();
  });

  it("renders TLS toggle as unchecked if `tlsEnabled` is not provided", () => {
    const connNoTls = produce(mockConnection, (draft) => {
      draft.params!.tlsEnabled = undefined;
    });
    const { getByTestId } = render(
      <ConnectorForm connector={connNoTls} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getInput(getByTestId("tls-toggle"))).not.toBeChecked();
  });

  it("renders errors if required fields are left blank", async () => {
    const { getByTestId, getByText } = render(
      <ConnectorForm connector={null} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    fireEvent.submit(getByTestId("name-input"));
    await waitFor(() => {
      expect(getByText("Connection Name can't be blank")).toBeInTheDocument();
    });
    expect(getByText("Host can't be blank")).toBeInTheDocument();
    expect(getByText("Port can't be blank")).toBeInTheDocument();
    expect(getByText("Database Name can't be blank")).toBeInTheDocument();
    expect(getByText("Username can't be blank")).toBeInTheDocument();
    expect(getByText("Password can't be blank")).toBeInTheDocument();
    expect(getByText("Data Refresh Time can't be blank")).toBeInTheDocument();
  });

  it("disables all fields if `disabled` is true", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={null} onSubmit={() => {}} disabled={true} />,
      { wrapper }
    );

    expect(getInput(getByTestId("name-input"))).toBeDisabled();
    expect(getInput(getByTestId("host-input"))).toBeDisabled();
    expect(getInput(getByTestId("port-input"))).toBeDisabled();
    expect(getInput(getByTestId("tls-toggle"))).toBeDisabled();
    expect(getInput(getByTestId("database-input"))).toBeDisabled();
    expect(getInput(getByTestId("username-input"))).toBeDisabled();
    expect(getInput(getByTestId("password-input"))).toBeDisabled();
    expect(getInput(getByTestId("schedule-input"))).toBeDisabled();
    expect(getInput(getByTestId("timezone-input"))).toBeDisabled();
  });

  it("doesn't disable any fields if `disabled` is false", () => {
    const { getByTestId } = render(
      <ConnectorForm connector={null} onSubmit={() => {}} disabled={false} />,
      { wrapper }
    );

    expect(getInput(getByTestId("name-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("host-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("port-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("tls-toggle"))).not.toBeDisabled();
    expect(getInput(getByTestId("database-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("username-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("password-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("schedule-input"))).not.toBeDisabled();
    expect(getInput(getByTestId("timezone-input"))).not.toBeDisabled();
  });

  it("runs onSubmit with expected values", async () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId } = render(
      <ConnectorForm connector={null} onSubmit={mockOnSubmit} disabled={false} />,
      { wrapper }
    );

    updateInput(getByTestId("name-input"), "test-connection");
    updateInput(getByTestId("host-input"), "test-host");
    updateInput(getByTestId("port-input"), "1234");
    fireEvent.click(getByTestId("tls-toggle"));
    updateInput(getByTestId("database-input"), "test-database");
    updateInput(getByTestId("username-input"), "test-username");
    updateInput(getByTestId("password-input"), "test-password");
    updateInput(getByTestId("schedule-input"), "12:00 PM");
    fireEvent.submit(getByTestId("name-input"));

    await waitFor(() => {
      expect(mockOnSubmit).toBeCalled();
    });
    const submittedForm: FormInput = mockOnSubmit.mock.calls[0][0];
    expect(submittedForm.name).toEqual("test-connection");
    expect(submittedForm.hostname).toEqual("test-host");
    expect(submittedForm.port).toEqual("1234");
    expect(submittedForm.tlsEnabled).toEqual(false);
    expect(submittedForm.database).toEqual("test-database");
    expect(submittedForm.username).toEqual("test-username");
    expect(submittedForm.password).toEqual("test-password");
    expect(submittedForm.dataRefreshTime!.getHours()).toEqual(12);
  });
});
