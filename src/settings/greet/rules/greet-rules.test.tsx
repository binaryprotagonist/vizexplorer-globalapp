import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
  within
} from "@testing-library/react";
import { GreetRules } from "./greet-rules";
import { ThemeProvider } from "../../../theme";
import { MockedProvider } from "testing/graphql-provider";
import {
  MockGreetRulesQueryOpts,
  generateDummyGreetRules,
  generateDummySites,
  mockAdmin,
  mockCurrentUserQuery,
  mockGreetRuleBuilderOrgData,
  mockGreetRuleBuilderSiteData,
  mockGreetRuleDeleteMutation,
  mockGreetRuleWithMultiselectedOptions,
  mockGreetRulesQuery,
  mockOrgAdmin,
  mockPDEngageAdminAccess,
  mockSitesQuery
} from "testing/mocks";
import { GraphQLError } from "graphql";
import { getInput, updateInput } from "testing/utils";
import { AppId, GaUserFragment, SiteFragment } from "generated-graphql";
import { produce } from "immer";
import { AlertProvider } from "view-v2/alert";

// Make Rule API run automatically by default
const pdEngageSingleSiteAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});
const siteId = mockPDEngageAdminAccess.site.id.toString();
const mockRules = generateDummyGreetRules(3, siteId);

describe("<GreetRules />", () => {
  let ruleRequests: MockGreetRulesQueryOpts[];
  let sites: SiteFragment[];
  let currentUser: GaUserFragment;

  beforeEach(() => {
    ruleRequests = [{ rules: mockRules, vars: { siteId } }];
    sites = generateDummySites(3);
    currentUser = pdEngageSingleSiteAdmin;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            ...ruleRequests.map(mockGreetRulesQuery),
            mockSitesQuery(sites),
            mockSitesQuery(sites), // refetch
            mockCurrentUserQuery(currentUser),
            mockCurrentUserQuery(currentUser),
            mockGreetRuleDeleteMutation(mockRules[0].id, siteId),
            // manage rule dialog queries
            mockGreetRuleBuilderOrgData(),
            mockGreetRuleBuilderSiteData()
          ]}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<GreetRules />, { wrapper });

    expect(getByTestId("greet-rules")).toBeInTheDocument();
  });

  it("loads greet rules automatically for single site access", async () => {
    const { findAllByTestId } = render(<GreetRules />, { wrapper });

    const ruleCards = await findAllByTestId("greet-rule");
    expect(ruleCards).toHaveLength(ruleRequests[0].rules!.length);
  });

  it("doesn't render site select for single site access", async () => {
    const { findAllByTestId, queryByTestId } = render(<GreetRules />, { wrapper });

    await findAllByTestId("greet-rule");
    expect(queryByTestId("site-select")).not.toBeInTheDocument();
  });

  it("requires property selection to load rules for multi site access", async () => {
    currentUser = mockOrgAdmin;
    const { findAllByTestId, findByTestId, getByText, getByTestId, queryByTestId } =
      render(<GreetRules />, {
        wrapper
      });

    const siteSelect = await findByTestId("site-select");

    expect(getByTestId("no-site-selection")).toBeInTheDocument();
    expect(queryByTestId("greet-rule")).not.toBeInTheDocument();

    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[0].name));

    await findAllByTestId("greet-rule");
  });

  it("ony lists site options where the user has appropriate access", async () => {
    // two sites w/ PDEngage admin - rest, other apps admin
    currentUser = produce(mockAdmin, (draft) => {
      draft.accessList[0].app.id = AppId.Pdengage;
      draft.accessList[2].app.id = AppId.Pdengage;
    });
    const { findByTestId, getAllByRole } = render(<GreetRules />, {
      wrapper
    });

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));

    const siteOptions = getAllByRole("option");
    expect(siteOptions).toHaveLength(2);
    expect(siteOptions[0]).toHaveTextContent(sites[0].name);
    expect(siteOptions[1]).toHaveTextContent(sites[2].name);
  });

  it("sorts site options alphabetically", async () => {
    // clear user access list as otherwise the graphql cache will overwrite the sites list
    currentUser = { ...mockOrgAdmin, accessList: [] };
    sites[0].name = "Z";
    sites[1].name = "A";
    sites[2].name = "M";
    const { findByTestId, getAllByRole } = render(<GreetRules />, {
      wrapper
    });

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));

    const siteOptions = getAllByRole("option");
    expect(siteOptions[0]).toHaveTextContent(sites[1].name);
    expect(siteOptions[1]).toHaveTextContent(sites[2].name);
    expect(siteOptions[2]).toHaveTextContent(sites[0].name);
  });

  it("doesn't render site select during initial load", async () => {
    currentUser = mockOrgAdmin;
    const { queryByTestId } = render(<GreetRules />, {
      wrapper
    });

    expect(queryByTestId("site-select")).not.toBeInTheDocument();
  });

  it("continues to render site select during rule load after selecting a property", async () => {
    currentUser = mockOrgAdmin;
    const { findByTestId, getByText, getByTestId } = render(<GreetRules />, {
      wrapper
    });

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[0].name));

    expect(getByTestId("site-select")).toBeInTheDocument();
  });

  it("renders loading state while greet rules are loading", async () => {
    const { findAllByTestId, queryByTestId } = render(<GreetRules />, { wrapper });

    await findAllByTestId("greet-rule-loading");
    expect(queryByTestId("greet-rule")).not.toBeInTheDocument();

    await findAllByTestId("greet-rule");
    expect(queryByTestId("greet-rule-loading")).not.toBeInTheDocument();
  });

  it("disables actions while greet rules are loading", async () => {
    const { findAllByTestId, getByTestId, getByText } = render(<GreetRules />, {
      wrapper
    });

    expect(getByText("Add rule")).toBeDisabled();
    expect(getInput(getByTestId("greet-rule-search"))).toBeDisabled();
    const rules = await findAllByTestId("greet-rule-loading");
    rules.forEach((rule) => {
      expect(within(rule).getByTestId("edit-rule")).toBeDisabled();
      expect(within(rule).getByTestId("delete-rule")).toBeDisabled();
    });
  });

  it("renders No Rules component if there are no greet rules", async () => {
    ruleRequests[0].rules = [];
    const { findByTestId } = render(<GreetRules />, { wrapper });

    await findByTestId("no-rules");
  });

  it("can search on greet rules", async () => {
    const { getByTestId, findAllByTestId, getAllByTestId } = render(<GreetRules />, {
      wrapper
    });

    await findAllByTestId("greet-rule");

    const ruleName = ruleRequests[0].rules![0].name;
    updateInput(getByTestId("greet-rule-search"), ruleName);

    expect(getAllByTestId("greet-rule")).toHaveLength(1);
    expect(getInput(getByTestId("greet-rule-search"))).toHaveValue(ruleName);
  });

  it("renders No Search Results component if there are no greet rules matching the search", async () => {
    const { getByTestId, findAllByTestId } = render(<GreetRules />, {
      wrapper
    });

    await findAllByTestId("greet-rule");

    updateInput(getByTestId("greet-rule-search"), "zzzzz");
    expect(getByTestId("no-search-results")).toBeInTheDocument();
  });

  it("resets search value on site change", async () => {
    currentUser = mockOrgAdmin;
    ruleRequests.push({ rules: mockRules, vars: { siteId: "1" } });
    const { findByTestId, getByTestId, findAllByTestId, getByText } = render(
      <GreetRules />,
      { wrapper }
    );

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[0].name));

    await findAllByTestId("greet-rule");
    updateInput(getByTestId("greet-rule-search"), "zzzzz");

    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[1].name));

    await findAllByTestId("greet-rule");
    expect(getInput(getByTestId("greet-rule-search"))).toHaveValue("");
  });

  it("renders error component if the greet rules API returns an error", async () => {
    ruleRequests[0].errors = [new GraphQLError("Something went wrong")];
    const { findByTestId } = render(<GreetRules />, { wrapper });

    await findByTestId("greet-rules-error");
  });

  it("re-executes queries if Refresh Page is clicked on the error component", async () => {
    ruleRequests[0].errors = [new GraphQLError("Something went wrong")];
    ruleRequests.push({ rules: [mockGreetRuleWithMultiselectedOptions], errors: [] });
    const { findByTestId, findAllByTestId, getByText, queryByTestId } = render(
      <GreetRules />,
      { wrapper }
    );

    await findByTestId("greet-rules-error");
    fireEvent.click(getByText("Refresh page"));

    expect(queryByTestId("greet-rules-error")).not.toBeInTheDocument();
    const greetRules = await findAllByTestId("greet-rule");
    expect(greetRules).toHaveLength(ruleRequests[1].rules!.length);
  });

  it("renders Rule Detail if Expand button is clicked", async () => {
    const { findAllByTestId, getByTestId } = render(<GreetRules />, {
      wrapper
    });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("expand-rule"));

    expect(getByTestId("rule-detail")).toBeInTheDocument();
  });

  it("doesn't render Rule Detail if Expand button isn't clicked", async () => {
    const { findAllByTestId, queryByTestId } = render(<GreetRules />, {
      wrapper
    });

    await findAllByTestId("greet-rule");
    expect(queryByTestId("rule-detail")).not.toBeInTheDocument();
  });

  it("collapses Rule Detail if Expand button is clicked while Rule Detail is open", async () => {
    jest.useFakeTimers();
    const { findAllByTestId, queryByTestId } = render(<GreetRules />, {
      wrapper
    });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("expand-rule"));
    fireEvent.click(within(rules[0]).getByTestId("expand-rule"));

    // wait for the component to unmount after the transition
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByTestId("rule-detail")).not.toBeInTheDocument();
  });

  it("renders appropriate Rule Detail for the given rule", async () => {
    currentUser = mockOrgAdmin;
    ruleRequests[0].rules = [mockGreetRuleWithMultiselectedOptions];
    const { findAllByTestId, getByTestId, findByTestId, getByText } = render(
      <GreetRules />,
      { wrapper }
    );

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(sites[0].name));

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("expand-rule"));

    const detail = getByTestId("rule-detail");
    const propertySections = within(detail).getByTestId("property-sections");
    const guestType = within(detail).getByTestId("guest-type");
    const tiers = within(detail).getByTestId("tiers");
    const daysOfWeek = within(detail).getByTestId("days-of-week");
    const metricTriggers = within(detail).getAllByTestId("metric-trigger");
    const assignmentWeight = within(detail).getByTestId("assignment-weight");
    const assignTo = within(detail).getByTestId("assign-to");
    const userGroup = within(detail).getByTestId("user-group");
    const overflow1 = within(detail).getByTestId("user-group-overflow1");
    const overflow2 = within(detail).getByTestId("user-group-overflow2");

    expect(propertySections).toHaveTextContent("01, 02");
    expect(guestType).toHaveTextContent("All guests");
    expect(tiers).toHaveTextContent("Platinum, Gold");
    expect(daysOfWeek).toHaveTextContent("Sunday, Tuesday, Thursday, Saturday");
    expect(metricTriggers[0]).toHaveTextContent("Today Actual Win: Min 100 Max 200");
    expect(assignmentWeight).toHaveTextContent("75");
    expect(assignTo).toHaveTextContent("Specific User Group");
    expect(userGroup).toHaveTextContent("JL 1");
    expect(overflow1).toHaveTextContent("JL 2");
    expect(overflow2).toHaveTextContent("JL 3");
  });

  it("renders only sections in Greet Detail for a single property access", async () => {
    const { findAllByTestId, getByTestId } = render(<GreetRules />, {
      wrapper
    });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("expand-rule"));
    const detail = getByTestId("rule-detail");

    expect(within(detail).getByTestId("sections")).toBeInTheDocument();
  });

  it("displays DeleteRuleDialog if delete is clicked on a rule", async () => {
    const { findAllByTestId, getByTestId } = render(<GreetRules />, { wrapper });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("delete-rule"));

    const dialog = getByTestId("delete-rule-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(ruleRequests[0].rules![0].name);
  });

  it("can delete a rule successfully", async () => {
    ruleRequests.push({ rules: [], errors: [] }); // refetch on delete
    const { findAllByTestId, getByTestId } = render(<GreetRules />, {
      wrapper
    });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("delete-rule"));

    const deleteDialog = getByTestId("delete-rule-dialog");
    fireEvent.click(within(deleteDialog).getByText("Delete"));

    await waitForElementToBeRemoved(rules[0]);
  });

  it("displays EditRuleDialog if edit is clicked on a rule", async () => {
    const { findAllByTestId, getByTestId } = render(<GreetRules />, { wrapper });

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("edit-rule"));

    const dialog = getByTestId("greet-rule-dialog");
    expect(dialog).toBeInTheDocument();
    const ruleInput = getInput(getByTestId("rule-name-input"));
    expect(ruleInput).toHaveValue(ruleRequests[0].rules![0].name);
  });

  it("can close the Edit Site Dialog", async () => {
    const { findAllByTestId, getByTestId, queryByTestId, getByText } = render(
      <GreetRules />,
      { wrapper }
    );

    const rules = await findAllByTestId("greet-rule");
    fireEvent.click(within(rules[0]).getByTestId("edit-rule"));

    const dialog = getByTestId("greet-rule-dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));
    expect(queryByTestId("greet-rule-dialog")).not.toBeInTheDocument();
  });
});
