import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
  within
} from "@testing-library/react";
import { GreetRuleDialog } from "./greet-rule-dialog";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../../theme";
import { MockedProvider } from "testing/graphql-provider";
import {
  MockGreetRuleCreateOpts,
  generateDummyGreetSections,
  generateDummySites,
  mockCurrentUserQuery,
  mockGreetRuleBuilderOrgData,
  mockGreetRuleBuilderSiteData,
  mockGreetRuleCreateMutation,
  mockGreetRuleWithMultiselectedOptions,
  mockSitesQuery
} from "testing/mocks";
import { getInput, updateInput } from "testing/utils";
import { emptyGreetRuleDraft } from "./utils";
import {
  GreetRuleFragment,
  GreetSectionFragment,
  PdGreetAssignmentType,
  PdGuestInteractionType,
  SiteFragment
} from "generated-graphql";
import { AlertProvider } from "view-v2/alert";
import { produce } from "immer";
import { draftRuleToRuleCreateInput } from "./utils";
import { GraphQLError } from "graphql";

const draftRule = emptyGreetRuleDraft("0");
const createRule = produce(draftRule, (draft) => {
  draft.name = "create 1";
  draft.siteId = "0";
  draft.specialTriggers.daysOfWeeks = "__ALL__";
  draft.specialTriggers.guestType = PdGuestInteractionType.All;
  draft.specialTriggers.sections = "__ALL__";
  draft.specialTriggers.tiers = "__ALL__";
  draft.assignment.assignTo = {
    assignmentToType: PdGreetAssignmentType.AllUsers
  };
});

describe("<GreetRuleDialog />", () => {
  let mockSites: SiteFragment[];
  let mockRules: GreetRuleFragment[];
  let mockSections: GreetSectionFragment[];
  let greetRuleCreateOpts: MockGreetRuleCreateOpts;

  beforeEach(() => {
    mockSites = generateDummySites(3);
    mockRules = [mockGreetRuleWithMultiselectedOptions];
    mockSections = generateDummyGreetSections();
    greetRuleCreateOpts = {
      input: draftRuleToRuleCreateInput(createRule)
    };
    jest.clearAllMocks();
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockRecoilProvider>
          <MockAuthProvider>
            <MockedProvider
              mocks={[
                mockSitesQuery(mockSites),
                mockGreetRuleBuilderOrgData(),
                mockGreetRuleBuilderSiteData({
                  rules: mockRules,
                  sections: mockSections,
                  vars: { siteId: `${mockSites[0].id}` }
                }),
                mockGreetRuleBuilderSiteData({
                  rules: mockRules,
                  sections: mockSections,
                  vars: { siteId: "1" }
                }),
                mockCurrentUserQuery(),
                mockGreetRuleCreateMutation(greetRuleCreateOpts)
              ]}
            >
              <ThemeProvider>{children}</ThemeProvider>
            </MockedProvider>
          </MockAuthProvider>
        </MockRecoilProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("greet-rule-dialog")).toBeInTheDocument();
  });

  it("renders correct title for add action", () => {
    const { getByText } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Create a new rule")).toBeInTheDocument();
  });

  it("renders correct title for edit action", () => {
    const { getByText } = render(
      <GreetRuleDialog
        actionType="edit"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Edit the rule")).toBeInTheDocument();
  });

  it("runs onclose if `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={onClose}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onclose if `Close Icon` is clicked", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={onClose}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByLabelText("close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders RuleSettings", () => {
    const { getByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-settings")).toBeInTheDocument();
  });

  it("can update rule name", () => {
    const { getByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    fireEvent.change(getInput(getByTestId("rule-name-input"))!, {
      target: { value: "New Rule Name" }
    });

    expect(getInput(getByTestId("rule-name-input"))).toHaveValue("New Rule Name");
  });

  it("can select a property where there is more than 1 property option", async () => {
    const { getByText, getByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getByTestId("loading"));

    const selectBtn = within(getByTestId("property-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText(mockSites[1].name));

    expect(getByTestId("property-select")).toHaveTextContent(mockSites[1].name);
  });

  it("doesn't render property select if there is only 1 property option", async () => {
    mockSites = generateDummySites(1);
    const { queryByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(queryByTestId("loading"));
    expect(queryByTestId("property-select")).not.toBeInTheDocument();
  });

  it("automatically loads section options for a single property", async () => {
    mockSites = generateDummySites(1);
    const { getByTestId, getAllByRole } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );
    await waitForElementToBeRemoved(getByTestId("loading"));

    fireEvent.keyDown(getByTestId("section-select"), { keyCode: 40 });
    const sectionOptions = getAllByRole("option");

    expect(sectionOptions).toHaveLength(mockSections.length + 1);
  });

  it("automatically loads section options for the property assigned to the draft rule", async () => {
    const { getByTestId, getAllByRole } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getByTestId("loading"));

    fireEvent.keyDown(getByTestId("section-select"), { keyCode: 40 });
    const sectionOptions = getAllByRole("option");

    expect(sectionOptions).toHaveLength(mockSections.length + 1);
  });

  it("renders helper text for duplicate rule name", async () => {
    mockSites = generateDummySites(1);
    const { getByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={draftRule}
        onClose={() => {}}
        onSaveComplete={() => {}}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getByTestId("loading"));

    fireEvent.change(getInput(getByTestId("rule-name-input"))!, {
      target: { value: mockRules[0].name }
    });

    expect(getByTestId("rule-name-input")).toHaveTextContent("Rule name already exists");
  });

  it("calls onSaveComplete when a rule is successfully created", async () => {
    const onSaveComplete = jest.fn();
    mockSites = generateDummySites(1);
    const { getByText, getByTestId, findByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={{ ...createRule, name: "" }}
        onClose={() => {}}
        onSaveComplete={onSaveComplete}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getByTestId("loading"));

    // update name to trigger rule changed and enable save button
    updateInput(getByTestId("rule-name-input"), createRule.name);
    fireEvent.click(getByText("Save"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(`${createRule.name} added`);
    expect(onSaveComplete).toHaveBeenCalled();
  });

  it("renders error if rule creation API returns an error", async () => {
    const onSaveComplete = jest.fn();
    greetRuleCreateOpts.error = { graphQL: [new GraphQLError("Unexpected error")] };
    mockSites = generateDummySites(1);
    const { getByText, getByTestId, findByTestId } = render(
      <GreetRuleDialog
        actionType="add"
        draftRule={{ ...createRule, name: "" }}
        onClose={() => {}}
        onSaveComplete={onSaveComplete}
      />,
      { wrapper }
    );

    await waitForElementToBeRemoved(getByTestId("loading"));

    updateInput(getByTestId("rule-name-input"), createRule.name);
    fireEvent.click(getByText("Save"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent(
      "An unexpected error occurred while saving. Please try again."
    );
    expect(onSaveComplete).not.toHaveBeenCalled();
  });
});
