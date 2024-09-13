import { fireEvent, render, within } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { RuleSettings } from "./rule-settings";
import { getInput } from "testing/utils";
import { SelectOption } from "../../components";
import { ReducerAction, ReducerState } from "../reducer/types";
import { produce } from "immer";
import { emptyGreetRuleDraft } from "./utils";

const initialState: ReducerState = {
  rule: emptyGreetRuleDraft("0"),
  error: null,
  ruleChanged: true
};
const mockSitesOptions: SelectOption<string>[] = [
  { value: "0", label: "Site 0" },
  { value: "1", label: "Site 1" }
];
const mockSectionOptions: string[] = ["Section A", "Section B", "Section C"];

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<RuleSettings />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-settings")).toBeInTheDocument();
  });

  it("renders input fields", () => {
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={mockSitesOptions}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-name-input")).toBeInTheDocument();
    expect(getByTestId("property-select")).toBeInTheDocument();
    expect(getByTestId("section-select")).toBeInTheDocument();
    expect(getByTestId("enable-rule-switch")).toBeInTheDocument();
  });

  it("renders input fields disabled if `disableFields` is true", () => {
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={mockSitesOptions}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
        disableFields={true}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("rule-name-input"))).toBeDisabled();
    expect(getInput(getByTestId("property-select"))).toBeDisabled();
    expect(getInput(getByTestId("section-select"))).toBeDisabled();
    expect(getInput(getByTestId("enable-rule-switch"))).toBeDisabled();
  });

  it("doesn't render property input when there is only a single option", () => {
    const { queryByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={[mockSitesOptions[0]]}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />,
      { wrapper }
    );

    expect(queryByTestId("property-select")).not.toBeInTheDocument();
  });

  it("renders fields with provided state values", () => {
    const stateWithValues = produce(initialState, (draft) => {
      draft.rule.name = "Test Rule";
      draft.rule.siteId = mockSitesOptions[0].value;
      draft.rule.specialTriggers.sections = mockSectionOptions;
      draft.rule.isEnabled = false;
    });

    const { getByTestId } = render(
      <RuleSettings
        state={stateWithValues}
        sites={mockSitesOptions}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("rule-name-input"))).toHaveValue("Test Rule");
    expect(getByTestId("property-select")).toHaveTextContent(mockSitesOptions[0].label);
    expect(getByTestId("section-select")).toHaveTextContent("All sections");
  });

  it("calls onChange with correct arguments for rule name", () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={mockDispatch}
      />
    );

    fireEvent.change(getInput(getByTestId("rule-name-input"))!, {
      target: { value: "New Rule Name" }
    });

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_NAME",
      payload: { name: "New Rule Name" }
    });
  });

  it("calls dispatch with correct arguments for property", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <RuleSettings
        state={initialState}
        sites={mockSitesOptions}
        sectionOptions={mockSectionOptions}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    // mouseDown event is only available on the element with `role="combobox"`
    const selectBtn = within(getByTestId("property-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText(mockSitesOptions[1].label));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_PROPERTY",
      payload: { siteId: mockSitesOptions[1].value }
    });
  });

  it("calls onChange with correct arguments for sections", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <RuleSettings
        state={initialState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={mockDispatch}
      />
    );

    fireEvent.keyDown(getByTestId("section-select"), { keyCode: 40 });
    fireEvent.click(getByText("Section B"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_SECTIONS",
      payload: { sections: ["Section B"] }
    });
  });

  it("calls onChange with correct arguments for enable rule", () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={mockDispatch}
      />
    );

    const enableToggleInput = getInput(getByTestId("enable-rule-switch"))!;
    fireEvent.click(enableToggleInput);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_ENABLED",
      payload: { enabled: false }
    });
  });

  it("renders section count label with correct count if count > 0", () => {
    const selectedSectionState = produce(initialState, (draft) => {
      draft.rule.specialTriggers.sections = [
        mockSectionOptions[0],
        mockSectionOptions[1]
      ];
    });
    const { getByTestId } = render(
      <RuleSettings
        state={selectedSectionState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />
    );

    const countLabel = getByTestId("section-count-label");
    const numSeleted = selectedSectionState.rule.specialTriggers!.sections!.length;
    expect(within(countLabel).getByTestId("count")).toHaveTextContent(`${numSeleted}`);
  });

  it("doesn't render section count label if there are no selected sections", () => {
    const { getByTestId } = render(
      <RuleSettings
        state={initialState}
        sites={[]}
        sectionOptions={mockSectionOptions}
        dispatch={() => {}}
      />
    );

    const countLabel = getByTestId("section-count-label");
    expect(within(countLabel).queryByTestId("count")).not.toBeInTheDocument();
  });
});
