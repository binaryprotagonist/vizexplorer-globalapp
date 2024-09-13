import { Box } from "@mui/material";
import { Dispatch } from "react";
import { Button, Switch, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { GridInputLayout, Select, SelectOption } from "../../components";
import {
  GreetDraftMetricTrigger,
  ReducerAction,
  ReducerState,
  DraftSelectAll
} from "../reducer/types";
import { TriggerMetricRow } from "./trigger-metric-row";
import { GreetMetricDefinitionFragment, PdGuestInteractionType } from "generated-graphql";
import AccountCircleRounded from "@mui/icons-material/AccountCircleRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import { isMetricValid } from "../reducer";
import { InputLabel } from "view-v2/input-label";
import { CheckboxMultiSelect } from "view-v2/multi-select";

type Props = {
  isMultiProperty: boolean;
  state: ReducerState;
  tierOptions: SelectOption<string>[];
  metrics: GreetMetricDefinitionFragment[];
  dispatch: Dispatch<ReducerAction>;
  disableFields?: boolean;
};

export function TriggerSettings({
  isMultiProperty,
  state,
  tierOptions,
  metrics,
  dispatch,
  disableFields = false
}: Props) {
  const theme = useGlobalTheme();
  const { daysOfWeeks, tiers, guestType } = state.rule.specialTriggers;
  const { metricTriggers } = state.rule;
  const lastMetric = metricTriggers.at(-1);

  function availableMetricDefinitions(
    metric: GreetDraftMetricTrigger
  ): GreetMetricDefinitionFragment[] {
    return metrics.filter((metricDef) => {
      if (metricDef.code === metric.code) {
        return true;
      }
      // Only display metric options that aren't used by other metric triggers (include the selected metric in the options)
      return !metricTriggers.some((trigger) => trigger.code === metricDef.code);
    });
  }

  return (
    <Box data-testid={"trigger-sections"}>
      <GridInputLayout isMultiProperty={isMultiProperty} mb={4}>
        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel>Guest Type</InputLabel>
          <Select
            data-testid={"guest-select"}
            placeholder={"Select guest type"}
            selected={guestType ?? null}
            options={GUEST_OPTIONS}
            onChange={(option) =>
              dispatch({
                type: "UPDATE_GUEST_TYPE",
                payload: { guestType: option.value }
              })
            }
            startAdornment={
              <AccountCircleRounded sx={{ fill: theme.colors.grey[500] }} />
            }
            disabled={disableFields}
          />
        </Box>
        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel
            type={"count"}
            label={"Tier"}
            count={tierValue(tiers, tierOptions).length}
          />
          <CheckboxMultiSelect
            showSelectAll
            fullWidth
            data-testid={"tier-select"}
            placeholder={"Select tier"}
            value={tierValue(tiers, tierOptions)}
            options={tierOptions.map((t) => t.value)}
            allOptionLabel={"All tiers"}
            onChange={(selected) => {
              const tiers = selected.length === tierOptions.length ? "__ALL__" : selected;
              dispatch({ type: "UPDATE_TIERS", payload: { tiers } });
            }}
            icon={<StarRounded sx={{ fill: theme.colors.grey[500] }} />}
            limitTags={1}
            disabled={disableFields}
          />
        </Box>

        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel
            type={"count"}
            label={"Days of the week"}
            count={daysOfWeeks?.length ?? 0}
          />
          <CheckboxMultiSelect
            showSelectAll
            fullWidth
            data-testid={"weekdays-select"}
            placeholder={"Select days"}
            value={daysOfweekValue(daysOfWeeks, WEEKDAY_OPTIONS)}
            options={WEEKDAY_OPTIONS}
            allOptionLabel={"All days"}
            onChange={(selected) => {
              const daysOfWeek =
                selected.length === WEEKDAY_OPTIONS.length ? "__ALL__" : selected;
              dispatch({ type: "UPDATE_DAYS_OF_WEEKS", payload: { daysOfWeek } });
            }}
            icon={<CalendarMonthRounded sx={{ fill: theme.colors.grey[500] }} />}
            limitTags={1}
            disabled={disableFields}
          />
        </Box>
      </GridInputLayout>

      <Box display={"flex"} flexDirection={"column"} rowGap={4} mb={2}>
        {metricTriggers.map((metric, index) => (
          <TriggerMetricRow
            key={`metric-trigger-${metric.code}`}
            index={index}
            metric={metric}
            metricDefinitions={availableMetricDefinitions(metric)}
            dispatch={dispatch}
            isMultiProperty={isMultiProperty}
            disabled={disableFields}
          />
        ))}
      </Box>

      <Box sx={{ maxWidth: "140px", mb: 1.5 }}>
        <Button
          variant={"text"}
          size={"small"}
          color={"neutral"}
          onClick={() => dispatch({ type: "ADD_EMPTY_METRIC" })}
          disabled={(lastMetric && !isMetricValid(lastMetric)) || disableFields}
          startIcon={<AddRounded />}
          sx={{ fontSize: "14px" }}
        >
          Add metric
        </Button>
      </Box>

      <Box display={"flex"} alignItems={"center"}>
        <InputLabel gutterBottom={false} help={IGNORE_SUPPRESSION_HELP} fontWeight={400}>
          Ignore suppression
        </InputLabel>
        <Switch
          data-testid={"ignore-suppression-switch"}
          color={"success"}
          checked={state.rule.isIgnoreSuppression}
          onChange={(_e, checked) => {
            dispatch({
              type: "UPDATE_IGNORE_SUPPRESSION",
              payload: { ignoreSuppression: checked }
            });
          }}
          disabled={disableFields}
          sx={{
            ml: 1
          }}
        />
      </Box>
    </Box>
  );
}

export type TierOption = {
  label: string;
  value: string;
};

type GuestTypeOption = {
  label: string;
  value: PdGuestInteractionType;
};

const GUEST_OPTIONS: GuestTypeOption[] = [
  { label: "All guests", value: PdGuestInteractionType.All },
  { label: "Uncoded", value: PdGuestInteractionType.Uncoded },
  { label: "Coded", value: PdGuestInteractionType.Coded }
];

const WEEKDAY_OPTIONS: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function tierValue(
  value: DraftSelectAll | string[] | null,
  options: SelectOption<string>[]
): string[] {
  return !value ? [] : value === "__ALL__" ? options.map((t) => t.value) : value;
}

function daysOfweekValue(
  value: DraftSelectAll | string[] | null,
  options: string[]
): string[] {
  return !value ? [] : value === "__ALL__" ? options : value;
}

const IGNORE_SUPPRESSION_HELP =
  "Turn on to skip suppression (if any), or turn it off to respect suppression settings.";
