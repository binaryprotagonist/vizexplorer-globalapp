import { render, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { Greet } from "./greet";
import { ThemeProvider } from "../../theme";
import { MockedProvider } from "@apollo/client/testing";
import {
  generateDummySites,
  mockAdmin,
  mockCurrentUserQuery,
  mockGreetRulesQuery,
  mockGreetSettingsQuery,
  mockOrgAdmin,
  mockPDEngageAdminAccess,
  mockSitesQuery
} from "testing/mocks";
import { GaUserFragment, SiteFragment } from "generated-graphql";
import { produce } from "immer";
import { AlertProvider } from "view-v2/alert";

describe("<Greet />", () => {
  let sites: SiteFragment[];
  let currentUser: GaUserFragment;

  beforeEach(() => {
    sites = generateDummySites(3);
    currentUser = mockOrgAdmin;
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            mockSitesQuery(sites),
            mockCurrentUserQuery(currentUser),
            mockGreetRulesQuery(),
            mockGreetSettingsQuery()
          ]}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders Greet Settings title", () => {
    const { getByText } = render(<Greet />, { wrapper });

    expect(getByText("Greet Settings")).toBeInTheDocument();
  });

  it("renders tabs with the correct labels", async () => {
    const { getByTestId } = render(<Greet />, { wrapper });

    await waitForElementToBeRemoved(() => getByTestId("view-tabs-loading"));
    expect(getByTestId("view-tabs")).toHaveTextContent("Greet rules");
    expect(getByTestId("view-tabs")).toHaveTextContent("System settings");
  });

  it("doesn't render tabs if the user has access to only one view", async () => {
    // only access to greet rules
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList = [mockPDEngageAdminAccess];
    });
    const { getByTestId, queryByTestId } = render(<Greet />, { wrapper });

    await waitForElementToBeRemoved(() => getByTestId("view-tabs-loading"));
    expect(queryByTestId("view-tabs")).not.toBeInTheDocument();
  });

  it("renders Greet Rules tab and content", async () => {
    const { getByTestId, findByTestId, queryByTestId } = render(<Greet />, { wrapper });

    await findByTestId("view-tabs");
    const greetRulesTab = getByTestId("setting-type-tab-greet-rules");
    fireEvent.click(greetRulesTab);

    expect(getByTestId("greet-rules")).toBeInTheDocument();
    expect(queryByTestId("system-settings")).toBeNull();
  });

  it("renders System Settings tab and content", async () => {
    const { getByTestId, findByTestId, queryByTestId } = render(<Greet />, { wrapper });

    await findByTestId("view-tabs");
    const systemSettingsTab = getByTestId("setting-type-tab-system-settings");
    fireEvent.click(systemSettingsTab);

    expect(getByTestId("system-settings")).toBeInTheDocument();
    expect(queryByTestId("greet-rules")).toBeNull();
  });
});
