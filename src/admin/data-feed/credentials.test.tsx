import { fireEvent, render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { Credentials } from "./credentials";
import {
  generateDummyOrgSummaries,
  mockOrgStageDatabaseQuery,
  mockStageDatabase
} from "../../view/testing/mocks/admin";
import { ThemeProvider } from "../../theme";
import { mockDeliveryMethodQuery } from "@vizexplorer/global-ui-core";

describe("<Credentials />", () => {
  const mockOrg = generateDummyOrgSummaries(1)[0];
  const mockStageDb = { ...mockStageDatabase };

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          mocks={[
            mockOrgStageDatabaseQuery(mockOrg.id, mockStageDb),
            mockDeliveryMethodQuery()
          ]}
        >
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<Credentials />, { wrapper });

    expect(getByTestId("feed-credentials")).toBeInTheDocument();
  });

  it("renders `Show Credentials` button", () => {
    const { getByText } = render(<Credentials />, { wrapper });

    expect(getByText("Show Credentials")).toBeInTheDocument();
  });

  it("opens `CredentialsDialog` if `Show Credentials` is clicked", () => {
    const { getByText, getByTestId } = render(<Credentials />, {
      wrapper
    });

    fireEvent.click(getByText("Show Credentials"));
    expect(getByTestId("feed-credentials-dialog")).toBeInTheDocument();
  });

  it("closes `CredentialsDialog` if `Close` is clicked", async () => {
    const { getByText, findByTestId, queryByTestId } = render(<Credentials />, {
      wrapper
    });

    fireEvent.click(getByText("Show Credentials"));

    await findByTestId("feed-credentials-dialog");
    fireEvent.click(getByText("Close"));

    expect(queryByTestId("feed-credentials-dialog")).not.toBeInTheDocument();
  });
});
