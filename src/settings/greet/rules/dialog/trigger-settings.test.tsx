import { fireEvent, render, within } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { TierOption, TriggerSettings } from "./trigger-settings";
import { ReducerAction, ReducerState } from "../reducer/types";
import {
  GreetMetricDefinitionFragment,
  PdGreetMetricValueType,
  PdGuestInteractionType
} from "generated-graphql";
import { produce } from "immer";
import { getInput } from "testing/utils";
import { emptyGreetRuleDraft } from "./utils";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const initialState: ReducerState = {
  rule: emptyGreetRuleDraft("0"),
  error: null,
  ruleChanged: true
};

const mockTierOptions: TierOption[] = [
  { label: "Platinum", value: "Platinum" },
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" }
];

// TODO as mention in `trigger-metric-row.test` here is an example where we could create and re-use a function to generate dummy data
const numericMetric: GreetMetricDefinitionFragment = {
  code: "Patron.DateEnrolled",
  label: "Date Enrolled",
  valueType: PdGreetMetricValueType.Numeric
};
const dateMetric: GreetMetricDefinitionFragment = {
  code: "Patron.WeddingAnnivDate",
  label: "Wedding Anniversary",
  valueType: PdGreetMetricValueType.Date
};
const mockMetricOptions: GreetMetricDefinitionFragment[] = [numericMetric, dateMetric];

describe("<TriggerSettings />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={initialState}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    expect(getByTestId("trigger-sections")).toBeInTheDocument();
  });

  it("renders input fields", () => {
    const { getByTestId } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={initialState}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    expect(getByTestId("guest-select")).toBeInTheDocument();
    expect(getByTestId("tier-select")).toBeInTheDocument();
    expect(getByTestId("weekdays-select")).toBeInTheDocument();
    expect(getByTestId("metric-select")).toBeInTheDocument();
    expect(getByTestId("ignore-suppression-switch")).toBeInTheDocument();
  });

  it("renders input fields disabled if `disableFields` is true", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: mockMetricOptions[0].code,
          valueType: mockMetricOptions[0].valueType
        },
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: mockMetricOptions[1].code,
          valueType: mockMetricOptions[1].valueType
        }
      ];
    });
    const { getByTestId, getAllByTestId } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
        disableFields={true}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("guest-select"))).toBeDisabled();
    expect(getInput(getByTestId("tier-select"))).toBeDisabled();
    expect(getInput(getByTestId("weekdays-select"))).toBeDisabled();
    getAllByTestId("metric-select").forEach((select) => {
      expect(getInput(select)).toBeDisabled();
    });
    expect(getInput(getByTestId("min-value-input"))).toBeDisabled();
    expect(getInput(getByTestId("max-value-input"))).toBeDisabled();
    expect(getInput(getByTestId("date-value-select"))).toBeDisabled();
    expect(getInput(getByTestId("ignore-suppression-switch"))).toBeDisabled();
  });

  it("calls dispatch with correct arguments for guest", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={mockDispatch}
        state={initialState}
        isMultiProperty={true}
      />,
      { wrapper }
    );
    const selectBtn = within(getByTestId("guest-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText("All guests"));
    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_GUEST_TYPE",
      payload: { guestType: PdGuestInteractionType.All }
    });
  });

  it("calls dispatch with correct arguments for tier", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={mockDispatch}
        state={initialState}
        isMultiProperty={true}
      />
    );

    fireEvent.keyDown(getByTestId("tier-select"), { keyCode: 40 });
    fireEvent.click(getByText(mockTierOptions[0].label));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_TIERS",
      payload: { tiers: [mockTierOptions[0].value] }
    });
  });

  it("calls dispatch with correct arguments for weekdays", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={mockDispatch}
        state={initialState}
        isMultiProperty={true}
      />
    );

    fireEvent.keyDown(getByTestId("weekdays-select"), { keyCode: 40 });
    fireEvent.click(getByText("Monday"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_DAYS_OF_WEEKS",
      payload: { daysOfWeek: ["Monday"] }
    });
  });

  it("calls dispatch with correct arguments for ignore suppression", () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={mockDispatch}
        state={initialState}
        isMultiProperty={true}
      />
    );

    fireEvent.click(getInput(getByTestId("ignore-suppression-switch"))!);

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_IGNORE_SUPPRESSION",
      payload: { ignoreSuppression: true }
    });
  });

  it("renders error text if a Numeric metric has a min value greater than max", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: numericMetric.code,
          valueType: numericMetric.valueType,
          value: [10, 5]
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Min must be less than max")).toBeInTheDocument();
  });

  it("disables Add Metric button if metric code hasn't been selected", () => {
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={initialState}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeDisabled();
  });

  it("disables Add Metric button if a Numeric metric is selected with no value input", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: numericMetric.code,
          valueType: numericMetric.valueType
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeDisabled();
  });

  it("enables Add Metric button if a Numeric metric is selected and min value entered", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: numericMetric.code,
          valueType: numericMetric.valueType,
          value: [10, null]
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeEnabled();
  });

  it("enables Add Metric button if a Numeric metric is selected and max value entered", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: numericMetric.code,
          valueType: numericMetric.valueType,
          value: [null, 10]
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeEnabled();
  });

  it("disables Add Metric button if a Numeric metric is selected and min is greater than max", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: numericMetric.code,
          valueType: numericMetric.valueType,
          value: [10, 5]
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeDisabled();
  });

  it("disables Add Metric button if a Date metric is selected with no value input", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: dateMetric.code,
          valueType: dateMetric.valueType
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeDisabled();
  });

  it("enables Add Metric button if a Date metric is selected and value selected", () => {
    const state = produce(initialState, (draft) => {
      draft.rule.metricTriggers = [
        {
          __typename: "PdGreetRuleMetricTrigger",
          code: dateMetric.code,
          valueType: dateMetric.valueType,
          value: [0, 0]
        }
      ];
    });
    const { getByText } = render(
      <TriggerSettings
        tierOptions={mockTierOptions}
        metrics={mockMetricOptions}
        dispatch={() => {}}
        state={state}
        isMultiProperty={true}
      />
    );

    expect(getByText("Add metric")).toBeEnabled();
  });
});
