import { fireEvent, render, waitFor } from "@testing-library/react";
import { AccessOrgDialog } from "./access-reason-dialog";
import { AlertProvider } from "view-v2/alert";
import { ThemeProvider } from "../../theme";
import { getInput, updateInput } from "testing/utils";
import { act } from "react-dom/test-utils";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { MockedProvider } from "testing/graphql-provider";
import { GraphQLError } from "graphql";
import {
  MockImpersonateOrgV2MutationOpts,
  mockImpersonateOrgV2Mutation
} from "./__mocks__/access-reason-dialog";

describe("<AccessOrgDialog />", () => {
  let history: History = null as any;
  let impersonateOrgOpts: MockImpersonateOrgV2MutationOpts;

  beforeEach(() => {
    jest.resetModules();
    history = createMemoryHistory();
    impersonateOrgOpts = {};
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <Router navigator={history} location={history.location}>
          <MockedProvider mocks={[mockImpersonateOrgV2Mutation(impersonateOrgOpts)]}>
            <ThemeProvider>{children}</ThemeProvider>
          </MockedProvider>
        </Router>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("access-reason-dialog")).toBeInTheDocument();
  });

  it("renders correct title for dialog", () => {
    const { getByText } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    expect(
      getByText("Please provide the reason for accessing the Organization")
    ).toBeInTheDocument();
  });

  it("runs onclose if `Close Icon` is clicked", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getByLabelText("close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders expected input field", () => {
    const { getByTestId } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("access-reason-input")).toBeInTheDocument();
  });

  it("auto focuses input field", () => {
    const { getByTestId } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    expect(getInput(getByTestId("access-reason-input"))).toHaveFocus();
  });

  it("disable button when reason is empty", () => {
    const { getByText } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByText("Save and access")).toBeDisabled();
  });

  it("enables save when all fields reason is filled", () => {
    const { getByTestId, getByText } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={() => {}} />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("access-reason-input"), "Valid reason");
    });

    expect(getByText("Save and access")).toBeEnabled();
  });

  it("navigates on success", async () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={onClose} />,
      { wrapper }
    );

    updateInput(getByTestId("access-reason-input"), "Valid reason");
    fireEvent.click(getByText("Save and access"));

    await waitFor(() => expect(history.location.pathname).toBe("/1"));

    expect(onClose).toHaveBeenCalled();
  });

  it("displays alert & doesn't navigate on failure", async () => {
    impersonateOrgOpts.errors = [new GraphQLError("")];
    const onClose = jest.fn();
    const { getByTestId, getByText, findByTestId } = render(
      <AccessOrgDialog orgId={"1"} orgName={"Test Org"} onClose={onClose} />,
      { wrapper }
    );

    updateInput(getByTestId("access-reason-input"), "Valid reason");
    fireEvent.click(getByText("Save and access"));

    const alert = await findByTestId("alert");

    expect(alert).toHaveTextContent("An unexpected error occurred");
    expect(history.location.pathname).toBe("/");
    expect(onClose).not.toHaveBeenCalled();
  });
});
