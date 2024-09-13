import { fireEvent, render, within } from "@testing-library/react";
import { TriggerMetricRow } from "./trigger-metric-row";
import { ThemeProvider } from "../../../../theme";
import { GreetMetricDefinitionFragment, PdGreetMetricValueType } from "generated-graphql";
import { GreetDraftMetricTrigger } from "../reducer/types";
import { getInput } from "testing/utils";

const mockDispatch = jest.fn();

const mockMetricDate: GreetDraftMetricTrigger = {
  __typename: "PdGreetRuleMetricTrigger",
  valueType: PdGreetMetricValueType.Date
};

const mockMetricNumeric: GreetDraftMetricTrigger = {
  __typename: "PdGreetRuleMetricTrigger",
  valueType: PdGreetMetricValueType.Numeric
};

// TODO this could be useful in many places. better to add it to our testing utils follow the same standard as `generateDummy....` function
const mockMetricOptions: GreetMetricDefinitionFragment[] = [
  {
    __typename: "PdGreetMetricDefinition",
    code: "Patron.Birthday",
    label: "Birthday",
    valueType: PdGreetMetricValueType.Date
  },
  {
    __typename: "PdGreetMetricDefinition",
    code: "Stats.AW_THISTRIP",
    label: "ActialWin This Trip",
    valueType: PdGreetMetricValueType.Numeric
  }
];

describe("<TriggerMetricRow />", () => {
  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricDate}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    expect(getByTestId("metric-select")).toBeInTheDocument();
  });

  it("calls onChange with correct arguments for metrics", () => {
    const { getByTestId, getByText } = render(
      <TriggerMetricRow
        index={0}
        metric={mockMetricDate}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    const selectBtn = within(getByTestId("metric-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText(mockMetricOptions[0].label));

    // Check if dispatch was called with the correct arguments
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 0,
        code: mockMetricOptions[0].code,
        valueType: mockMetricOptions[0].valueType
      }
    });
  });

  it("doesn't render enrollment select input when valueType is not `DATE`", () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricNumeric}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    const selectBtn = within(getByTestId("metric-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText(mockMetricOptions[1].label));

    // Check if dispatch was called with the correct arguments
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_METRIC_SELECTION",
      payload: {
        index: 1,
        code: mockMetricOptions[1].code,
        valueType: mockMetricOptions[1].valueType
      }
    });
    expect(queryByTestId("date-value-select")).not.toBeInTheDocument();
  });

  it("calls onChange with correct arguments for days comparison", () => {
    const { getByTestId, getByText } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricDate}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    const selectBtn = within(getByTestId("date-value-select")).getByRole("combobox");
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(getByText("Today"));

    // Check if dispatch was called with the correct arguments
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_METRIC_VALUE",
      payload: {
        index: 1,
        value: [0, 0]
      }
    });
  });

  it("render min value and max value inputs", () => {
    const { getByTestId } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricNumeric}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    expect(getByTestId("min-value-input")).toBeInTheDocument();
    expect(getByTestId("max-value-input")).toBeInTheDocument();
  });

  it("calls onChange with correct arguments for min-value-input", () => {
    const { getByTestId } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricNumeric}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    fireEvent.change(getInput(getByTestId("min-value-input"))!, {
      target: { value: "1" }
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_METRIC_VALUE",
      payload: {
        index: 1,
        value: [1, null]
      }
    });
  });

  it("calls onChange with correct arguments for max-value-input", () => {
    const { getByTestId } = render(
      <TriggerMetricRow
        index={1}
        metric={mockMetricNumeric}
        dispatch={mockDispatch}
        metricDefinitions={mockMetricOptions}
        isMultiProperty={true}
      />,
      { wrapper }
    );

    fireEvent.change(getInput(getByTestId("max-value-input"))!, {
      target: { value: "2" }
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_METRIC_VALUE",
      payload: {
        index: 1,
        value: [null, 2]
      }
    });
  });
});
