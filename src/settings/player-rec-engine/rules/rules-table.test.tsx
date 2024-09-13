import { fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";
import { PdreRulesTable } from "./rules-table";
import { ThemeProvider } from "../../../theme";
import { produce } from "immer";
import {
  generateDummyPdreRules,
  generateDummySites,
  mockOrgAdmin,
  mockPdreRuleConfigUpdate
} from "../../../view/testing/mocks";
import { RecoilRoot } from "recoil";
import { MockAuthProvider, MockGraphQLProvider } from "@vizexplorer/global-ui-core";

const currentUser = { ...mockOrgAdmin };
const selectedSite = generateDummySites(1)[0];
// rule should resemble the state post-modification
const updatedRule = generateDummyPdreRules(1)[0];

describe("<PdreRulesTable />", () => {
  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockGraphQLProvider mocks={[mockPdreRuleConfigUpdate(updatedRule)]}>
            <ThemeProvider>{children}</ThemeProvider>
          </MockGraphQLProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={[]}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("pdre-rules-table")).toBeInTheDocument();
  });

  it("renders expected table headers", () => {
    const { getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={[]}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText("Rule Name")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Weighting")).toBeInTheDocument();
    expect(getByText("Enabled")).toBeInTheDocument();
  });

  it("renders expected row actions", () => {
    const rules = generateDummyPdreRules(1);
    const { getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText("Edit")).toBeInTheDocument();
  });

  it("renders loading table if loading is true", () => {
    const { getByTestId, queryByTestId } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={[]}
        loading={true}
      />,
      { wrapper }
    );

    expect(getByTestId("pdre-rules-table-loading")).toBeInTheDocument();
    expect(queryByTestId("pdre-rules-table")).not.toBeInTheDocument();
  });

  it("renders rules", () => {
    const rules = generateDummyPdreRules(3);
    const { getAllByTestId, queryByText, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    expect(getAllByTestId("pdre-rule-row")).toHaveLength(rules.length);
    rules.forEach((rule) => {
      expect(queryByText(rule.id)).not.toBeInTheDocument(); // shouldn't render ruleId
      expect(getByText(rule.name)).toBeInTheDocument();
      expect(getByText(rule.description)).toBeInTheDocument();
      expect(getByText(rule.config!.weight)).toBeInTheDocument();
    });
  });

  it("renders enabled as 'Yes' if the rule is enabled", () => {
    const rules = generateDummyPdreRules(1);
    const { getByTestId } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    const ruleRow = getByTestId("pdre-rule-row");
    expect(ruleRow).toHaveTextContent("Yes");
    expect(ruleRow).not.toHaveTextContent("No");
  });

  it("renders enabled as 'No' if the rule is disabled", () => {
    const rules = produce(generateDummyPdreRules(1), (draft) => {
      draft[0].config!.enabled = false;
    });
    const { getByTestId } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    const ruleRow = getByTestId("pdre-rule-row");
    expect(ruleRow).toHaveTextContent("No");
    expect(ruleRow).not.toHaveTextContent("Yes");
  });

  it("renders Edit Dialog if Edit is clicked", () => {
    const rules = generateDummyPdreRules(1);
    const { getByTestId, queryByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    expect(queryByTestId("pdre-rule-edit-dialog")).not.toBeInTheDocument();

    fireEvent.click(getByText("Edit"));
    expect(getByTestId("pdre-rule-edit-dialog")).toBeInTheDocument();
  });

  it("closes Edit Dialog if Cancel is clicked", () => {
    const rules = generateDummyPdreRules(1);
    const { getByTestId, queryByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={rules}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(getByTestId("pdre-rule-edit-dialog")).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));
    expect(queryByTestId("pdre-rule-edit-dialog")).not.toBeInTheDocument();
  });

  it("closes the Edit Dialog once Save is complete", async () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={[updatedRule]}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(getByTestId("pdre-rule-edit-dialog")).toBeInTheDocument();

    fireEvent.click(getByText("Save"));
    await waitForElementToBeRemoved(queryByTestId("pdre-rule-edit-dialog"));
  });

  it("can sort by rule name", () => {
    const unsortedRules = produce(generateDummyPdreRules(3), (draft) => {
      draft[0].name = "z rule name";
      draft[1].name = "a rule name";
      draft[2].name = "b rule name";
    });
    const { getAllByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={unsortedRules}
        loading={false}
      />,
      { wrapper }
    );

    // expect initial sort state
    let ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("z rule name");
    expect(ruleRows[1]).toHaveTextContent("a rule name");
    expect(ruleRows[2]).toHaveTextContent("b rule name");

    // sort asc
    fireEvent.click(getByText("Rule Name"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("a rule name");
    expect(ruleRows[1]).toHaveTextContent("b rule name");
    expect(ruleRows[2]).toHaveTextContent("z rule name");

    // sort desc
    fireEvent.click(getByText("Rule Name"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("z rule name");
    expect(ruleRows[1]).toHaveTextContent("b rule name");
    expect(ruleRows[2]).toHaveTextContent("a rule name");
  });

  it("can sort by rule weight", () => {
    const unsortedRules = produce(generateDummyPdreRules(3), (draft) => {
      draft[0].config!.weight = 90;
      draft[1].config!.weight = 1;
      draft[2].config!.weight = 2;
    });
    const { getAllByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={unsortedRules}
        loading={false}
      />,
      { wrapper }
    );

    // expect initial sort state
    let ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("90");
    expect(ruleRows[1]).toHaveTextContent("1");
    expect(ruleRows[2]).toHaveTextContent("2");

    // sort asc
    fireEvent.click(getByText("Weighting"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("1");
    expect(ruleRows[1]).toHaveTextContent("2");
    expect(ruleRows[2]).toHaveTextContent("90");

    // sort desc
    fireEvent.click(getByText("Weighting"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("90");
    expect(ruleRows[1]).toHaveTextContent("2");
    expect(ruleRows[2]).toHaveTextContent("1");
  });

  it("can sort by rule enalbed", () => {
    const unsortedRules = produce(generateDummyPdreRules(3), (draft) => {
      draft[0].config!.enabled = true;
      draft[1].config!.enabled = false;
      draft[2].config!.enabled = true;
    });
    const { getAllByTestId, getByText } = render(
      <PdreRulesTable
        currentUser={currentUser}
        site={selectedSite}
        rules={unsortedRules}
        loading={false}
      />,
      { wrapper }
    );

    // expect initial sort state
    let ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("Yes");
    expect(ruleRows[1]).toHaveTextContent("No");
    expect(ruleRows[2]).toHaveTextContent("Yes");

    // sort asc
    fireEvent.click(getByText("Enabled"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("No");
    expect(ruleRows[1]).toHaveTextContent("Yes");
    expect(ruleRows[2]).toHaveTextContent("Yes");

    // sort desc
    fireEvent.click(getByText("Enabled"));
    ruleRows = getAllByTestId("pdre-rule-row");
    expect(ruleRows[0]).toHaveTextContent("Yes");
    expect(ruleRows[1]).toHaveTextContent("Yes");
    expect(ruleRows[2]).toHaveTextContent("No");
  });
});
