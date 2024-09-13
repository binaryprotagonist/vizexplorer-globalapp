import { GreetMetricDefinitionFragment, PdGreetMetricValueType } from "generated-graphql";
import { GreetDraftMetricTrigger, ReducerAction } from "../reducer/types";
import { Dispatch } from "react";
import { GridInputLayout, Select, SelectOption } from "../../components";
import { TextField, Tooltip, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { Box } from "@mui/material";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import { Delete } from "@mui/icons-material";
import { METRIC_DATE_OPTIONS, MetricDateOption, MetricValue } from "../types";
import { findMetricDateByRawValue } from "../utils";
import { InputLabel } from "view-v2/input-label";
import { IconButton, IconButtonProps } from "view-v2/icon-button";

type MetricSelectOption = SelectOption<string, { valueType: PdGreetMetricValueType }>;

type Props = {
  index: number;
  metric: GreetDraftMetricTrigger;
  metricDefinitions: GreetMetricDefinitionFragment[];
  dispatch: Dispatch<ReducerAction>;
  isMultiProperty: boolean;
  disabled?: boolean;
};

export function TriggerMetricRow({
  index,
  metric,
  metricDefinitions,
  dispatch,
  isMultiProperty,
  disabled = false
}: Props) {
  const selectedDef = metricDefinitions.find((def) => def.code === metric.code);
  const options = metricDefinitions.map<MetricSelectOption>((def) => ({
    label: def.label,
    value: def.code,
    valueType: def.valueType
  }));

  return (
    <GridInputLayout isMultiProperty={isMultiProperty} height={"72px"}>
      <MetricSelect
        selected={selectedDef?.code ?? null}
        options={options}
        onChange={(option) => {
          dispatch({
            type: "UPDATE_METRIC_SELECTION",
            payload: {
              index,
              code: option.value,
              valueType: option.valueType
            }
          });
        }}
        disabled={disabled}
      />
      {metric.valueType === PdGreetMetricValueType.Numeric && (
        <NumericMetricValue
          min={metric.value?.[0] ?? null}
          max={metric.value?.[1] ?? null}
          onChange={(min, max) => {
            dispatch({
              type: "UPDATE_METRIC_VALUE",
              payload: { index, value: [min, max] }
            });
          }}
          onClickDelete={() => dispatch({ type: "DELETE_METRIC", payload: { index } })}
          disabled={disabled}
        />
      )}
      {metric.valueType === PdGreetMetricValueType.Date && (
        <DateMetricValue
          value={metric.value}
          onChange={(option) =>
            dispatch({
              type: "UPDATE_METRIC_VALUE",
              payload: { index, value: option.rawValue }
            })
          }
          onClickDelete={() => dispatch({ type: "DELETE_METRIC", payload: { index } })}
          disabled={disabled}
        />
      )}
    </GridInputLayout>
  );
}

type MetricSelectProps = {
  selected: string | null;
  options: MetricSelectOption[];
  onChange: (value: MetricSelectOption) => void;
  disabled: boolean;
};

function MetricSelect({ selected, options, onChange, disabled }: MetricSelectProps) {
  const theme = useGlobalTheme();

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <InputLabel>Metric</InputLabel>
      <Select
        data-testid={"metric-select"}
        selected={selected}
        onChange={onChange}
        options={options}
        placeholder={"Select metric"}
        startAdornment={<LeaderboardRounded sx={{ fill: theme.colors.grey[500] }} />}
        disabled={disabled}
      />
    </Box>
  );
}

type MetricInputProps = {
  value: number | null;
  onChange: (value: string) => void;
  error: boolean;
  helperText?: string;
  disabled: boolean;
};

function MetricInput({ value, onChange, error, helperText, ...rest }: MetricInputProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      type={"number"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter a value..."
      InputLabelProps={{
        shrink: false
      }}
      autoComplete={"off"}
      error={error}
      helperText={helperText}
      {...rest}
    />
  );
}

type NumericMetricValueProps = {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  onClickDelete: VoidFunction;
  disabled: boolean;
};

function NumericMetricValue({
  min,
  max,
  onChange,
  onClickDelete,
  disabled
}: NumericMetricValueProps) {
  const invalidMin = min !== null && max !== null && min > max;
  const invalidMax = min !== null && max !== null && max < min;

  function onInputChange(field: "min" | "max", value: string) {
    const numValue = Number(value);
    const isValidNumber = !isNaN(numValue) && value !== "";
    const newValue = isValidNumber ? numValue : null;
    onChange(field === "min" ? newValue : min, field === "max" ? newValue : max);
  }

  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel>Min value</InputLabel>
        <MetricInput
          data-testid={"min-value-input"}
          value={min}
          onChange={(value) => onInputChange("min", value)}
          error={invalidMin}
          helperText={invalidMin ? "Min must be less than max" : " "}
          disabled={disabled}
        />
      </Box>
      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel>Max value</InputLabel>
        <Box display={"grid"} gridTemplateColumns={"auto max-content"} columnGap={1}>
          <MetricInput
            data-testid={"max-value-input"}
            value={max}
            onChange={(value) => onInputChange("max", value)}
            error={invalidMax}
            disabled={disabled}
          />
          <DeleteMetric
            onClick={onClickDelete}
            disabled={disabled}
            sx={{ height: "max-content" }}
          />
        </Box>
      </Box>
    </>
  );
}

const DATE_COMPARISON_HELP = `Your selection will be used to compare the chosen date metric.
For example, if you select 'this week', we will assess the date
within the past 7 days and the upcoming 7 days to determine
if the greet should be triggered.`;

type DateValueProps = {
  value?: MetricValue | null;
  onChange: (value: MetricDateOption) => void;
  onClickDelete: VoidFunction;
  disabled: boolean;
};

function DateMetricValue({ value, onChange, onClickDelete, disabled }: DateValueProps) {
  const selected = value ? findMetricDateByRawValue(value) : null;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <InputLabel help={DATE_COMPARISON_HELP}>Days comparison</InputLabel>
      <Box
        display={"grid"}
        gridTemplateColumns={"auto max-content"}
        columnGap={1}
        alignItems={"center"}
      >
        <Select
          data-testid={"date-value-select"}
          selected={selected?.value ?? null}
          onChange={onChange}
          placeholder={"Select comparison"}
          options={METRIC_DATE_OPTIONS}
          disabled={disabled}
        />
        <DeleteMetric onClick={onClickDelete} disabled={disabled} />
      </Box>
    </Box>
  );
}

function DeleteMetric(props: IconButtonProps) {
  return (
    <Tooltip title={"Delete metric"} placement={"right"}>
      <span>
        <IconButton {...props}>
          <Delete />
        </IconButton>
      </span>
    </Tooltip>
  );
}
