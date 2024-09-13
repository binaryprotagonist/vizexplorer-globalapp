import { fireEvent, render, within } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { GreetRulesList } from "./greet-rules-list";
import { generateDummyGreetRules } from "testing/mocks";
import { produce } from "immer";
import { SiteSelectSiteFragment } from "view-v2/site-select";

const mockSelectedSite: SiteSelectSiteFragment = { id: "Site 0", name: "0" };
const mockRules = generateDummyGreetRules(5, mockSelectedSite.id);
const SPACE = { keyCode: 32 };
const ARROW_DOWN = { keyCode: 40 };
window.scrollBy = jest.fn();

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<GreetRulesList />", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <GreetRulesList
        allRules={[]}
        renderRules={[]}
        selectedSite={mockSelectedSite}
        onReorder={() => {}}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("greet-rules-list")).toBeInTheDocument();
  });

  it("renders rules provided to `renderRules`", () => {
    const renderRules = mockRules.slice(0, 2);
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={renderRules}
        selectedSite={mockSelectedSite}
        onReorder={() => {}}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByTestId("greet-rule")).toHaveLength(renderRules.length);
  });

  it("renders disabled rules after enabled rules", () => {
    const renderRules = produce(mockRules, (draft) => {
      draft[0].isEnabled = false;
      draft[1].isEnabled = false;
    });
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={renderRules}
        selectedSite={mockSelectedSite}
        onReorder={() => {}}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const rules = getAllByTestId("greet-rule");
    expect(rules[0]).toHaveTextContent(mockRules[2].name);
    expect(rules.at(-1)).toHaveTextContent(mockRules[1].name);
    expect(rules.at(-2)).toHaveTextContent(mockRules[0].name);
  });

  it("doesn't render order tag for disabled rules", () => {
    const renderRules = produce(mockRules, (draft) => {
      draft[0].isEnabled = false;
    });
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={renderRules}
        selectedSite={mockSelectedSite}
        onReorder={() => {}}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const rules = getAllByTestId("greet-rule");
    expect(within(rules[0]).getByTestId("rule-order")).toBeInTheDocument();
    expect(within(rules.at(-1)!).queryByTestId("rule-order")).not.toBeInTheDocument();
  });

  it("calls `onReorder` with expected value if a rule is moved 2 positions down", async () => {
    const mockOnReorder = jest.fn();
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={mockRules}
        selectedSite={mockSelectedSite}
        onReorder={mockOnReorder}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const [firstRule] = getAllByTestId("greet-rule");
    fireEvent.keyDown(firstRule, SPACE);
    fireEvent.keyDown(firstRule, ARROW_DOWN);
    fireEvent.keyDown(firstRule, ARROW_DOWN);
    fireEvent.keyDown(firstRule, SPACE);

    const newOrder = mockOnReorder.mock.calls[0][0];
    expect(newOrder[0].id).toEqual(mockRules[1].id);
    expect(newOrder[1].id).toEqual(mockRules[2].id);
    expect(newOrder[2].id).toEqual(mockRules[0].id);
  });

  it("calls `onReorder` with expected value when changing the order of a filtered list", () => {
    const renderRules = [mockRules[1], mockRules[3], mockRules[4]];
    const mockOnReorder = jest.fn();
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={renderRules}
        selectedSite={mockSelectedSite}
        onReorder={mockOnReorder}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const [firstRule] = getAllByTestId("greet-rule");
    fireEvent.keyDown(firstRule, SPACE);
    fireEvent.keyDown(firstRule, ARROW_DOWN);
    fireEvent.keyDown(firstRule, SPACE);

    // From the filtered view, this move looks like:
    //             v -------- v
    // Filtered [Rule2, Rule4,  Rule5]

    // From the original list view, this move is actually:
    //           v --------------- v
    // [Rule1, Rule2, Rule3, Rule4,  Rule5]
    const newOrder = mockOnReorder.mock.calls[0][0];
    expect(newOrder[0].id).toEqual(mockRules[0].id); // Rule 1
    expect(newOrder[1].id).toEqual(mockRules[2].id); // Rule 3
    expect(newOrder[2].id).toEqual(mockRules[3].id); // Rule 4
    expect(newOrder[3].id).toEqual(mockRules[1].id); // Rule 2
    expect(newOrder[4].id).toEqual(mockRules[4].id); // Rule 5
  });

  it("doesn't call `onReorder` when trying to reordering enabled rules below disabled rules", () => {
    const mockOnReorder = jest.fn();
    const renderRules = produce(generateDummyGreetRules(2), (draft) => {
      draft[1].isEnabled = false;
    });
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={renderRules}
        selectedSite={mockSelectedSite}
        onReorder={mockOnReorder}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const [firstRule] = getAllByTestId("greet-rule");
    fireEvent.keyDown(firstRule, SPACE);
    fireEvent.keyDown(firstRule, ARROW_DOWN);
    fireEvent.keyDown(firstRule, SPACE);

    expect(mockOnReorder).not.toHaveBeenCalled();
  });

  it("doesn't call `onReorder` if the position doesn't change", async () => {
    const mockOnReorder = jest.fn();
    const { getAllByTestId } = render(
      <GreetRulesList
        allRules={mockRules}
        renderRules={mockRules}
        selectedSite={mockSelectedSite}
        onReorder={mockOnReorder}
        handleRuleActionClick={() => {}}
      />,
      { wrapper }
    );

    const [firstRule] = getAllByTestId("greet-rule");
    fireEvent.keyDown(firstRule, SPACE);
    fireEvent.keyDown(firstRule, SPACE);

    expect(mockOnReorder).not.toHaveBeenCalled();
  });
});
