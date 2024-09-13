import { Box, Radio, styled, useTheme } from "@mui/material";
import {
  Autocomplete,
  FormControlLabel,
  TextField,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import { InputLabel } from "view-v2/input-label";
import {
  PdMarketingProgramGuestMetric,
  PdMetricDateRangeType,
  PdMetricFuturePresetPeriod,
  PdMetricPastPresetPeriod,
  PdMetricPresetTripRange
} from "generated-graphql";
import {
  CriteriaFilter,
  DraftMetricDateRange,
  GuestListBuilderReducerAction
} from "../../../../reducer/guest-list-builder-reducer";
import { Dispatch } from "react";
import { getValidRangeValue } from "./utils";
import { NumberInput } from "view-v2/number-input";
import { DesktopDatePicker } from "view-v2/date-picker";
import { IconButton } from "view-v2/icon-button";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { capitalize } from "../../../../../../../view/utils/capitalize";

const InputContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1
});

type Props = {
  groupIdx: number;
  filterIdx: number;
  filter: CriteriaFilter;
  metrics: PdMarketingProgramGuestMetric[];
  dispatch: Dispatch<GuestListBuilderReducerAction>;
};

export function MetricRangeFilter({
  groupIdx,
  filterIdx,
  filter,
  metrics,
  dispatch
}: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();
  const { metric, dateRange, range } = filter;

  return (
    <Box display={"grid"} gridTemplateColumns={"auto max-content"} alignItems={"end"}>
      <Box display={"flex"} columnGap={theme.spacing(1.5)}>
        <InputContainer minWidth={"20%"} maxWidth={"20%"}>
          <InputLabel>Metric</InputLabel>
          <Autocomplete
            disableClearable
            // @ts-ignore allow null
            value={metric}
            options={metrics}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            onChange={(_, value) => {
              dispatch({
                type: "update-filter-metric",
                payload: { groupIdx, filterIdx, metric: value }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={"Select metric"}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <LeaderboardRounded sx={{ fill: globalTheme.colors.grey[500] }} />
                  )
                }}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <FormControlLabel
                  control={<Radio checked={selected} size={"small"} />}
                  label={option.label}
                />
              </li>
            )}
          />
        </InputContainer>

        {!!metric?.dateRangeTypes.length && (
          <InputContainer>
            <InputLabel help={dateInputHelp(metric.dateRangeTypes)}>
              {dateInputLabel(metric.dateRangeTypes)}
            </InputLabel>
            <Autocomplete
              disableClearable
              // @ts-ignore allow null
              value={dateRange ?? null}
              options={dateInputOptions(metric.dateRangeTypes)}
              getOptionLabel={dateInputOptionLabel}
              isOptionEqualToValue={(option, value) => {
                if (option.type !== value.type) return false;
                return (
                  option.type === PdMetricDateRangeType.CustomRange ||
                  option.type === PdMetricDateRangeType.LastNTrips ||
                  option.value === value.value
                );
              }}
              onChange={(_, value) => {
                dispatch({
                  type: "update-filter-date-range",
                  payload: { groupIdx, filterIdx, dateRange: value }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={dateInputPlaceholer(metric.dateRangeTypes)}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <FormControlLabel
                    control={<Radio checked={selected} size={"small"} />}
                    label={dateInputOptionLabel(option)}
                  />
                </li>
              )}
            />
          </InputContainer>
        )}

        {dateRange?.type === PdMetricDateRangeType.CustomRange && (
          <>
            <InputContainer>
              <InputLabel>From (date)</InputLabel>
              <DesktopDatePicker reduceAnimations />
            </InputContainer>

            <InputContainer>
              <InputLabel>To (date)</InputLabel>
              <DesktopDatePicker reduceAnimations />
            </InputContainer>
          </>
        )}

        {dateRange?.type === PdMetricDateRangeType.LastNTrips && (
          <InputContainer>
            <InputLabel>Trips</InputLabel>
            <NumberInput
              value={range?.[0] ?? ""}
              placeholder={"Enter trips"}
              onChange={(e) => {
                dispatch({
                  type: "update-filter-value",
                  payload: {
                    groupIdx,
                    filterIdx,
                    value: { range: [getValidRangeValue(e.target.value)] }
                  }
                });
              }}
            />
          </InputContainer>
        )}

        {!!metric && (
          <>
            <InputContainer>
              <InputLabel>From</InputLabel>
              <NumberInput
                value={range?.[0] ?? ""}
                placeholder={"Enter from"}
                onChange={(e) => {
                  dispatch({
                    type: "update-filter-value",
                    payload: {
                      groupIdx,
                      filterIdx,
                      value: { range: [getValidRangeValue(e.target.value), range?.[1]] }
                    }
                  });
                }}
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>To</InputLabel>
              <NumberInput
                value={range?.[1] ?? ""}
                placeholder={"Enter to"}
                onChange={(e) => {
                  dispatch({
                    type: "update-filter-value",
                    payload: {
                      groupIdx,
                      filterIdx,
                      value: { range: [range?.[0], getValidRangeValue(e.target.value)] }
                    }
                  });
                }}
              />
            </InputContainer>
          </>
        )}
      </Box>

      <Box p={theme.spacing(0.5, 0, 0.5, 1)}>
        <IconButton
          data-testid={"delete-filter"}
          onClick={() => {
            dispatch({ type: "delete-filter", payload: { groupIdx, filterIdx } });
          }}
          disabled={false}
          sx={{ visibility: metric ? "visible" : "hidden" }}
        >
          <DeleteRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

function dateInputLabel(dateRangeTypes: PdMetricDateRangeType[]): string {
  if (dateRangeTypes.includes(PdMetricDateRangeType.FuturePreset)) {
    return "Period";
  }

  return "Date range";
}

function dateInputHelp(dateRangeTypes: PdMetricDateRangeType[]): string {
  if (dateRangeTypes.includes(PdMetricDateRangeType.FuturePreset)) {
    return "For each Guest Future Value metric, please select the future period.";
  }

  return "For each Historical Activity metric, please select the date range.";
}

function dateInputPlaceholer(dateRangeTypes: PdMetricDateRangeType[]): string {
  if (dateRangeTypes.includes(PdMetricDateRangeType.FuturePreset)) {
    return "Select period";
  }

  return "Select date range";
}

function dateInputOptionLabel(option: DraftMetricDateRange): string {
  switch (option.type) {
    case PdMetricDateRangeType.FuturePreset:
      return option.value;
    case PdMetricDateRangeType.TripPreset:
    case PdMetricDateRangeType.PastPreset:
      return capitalize(option.value.replace(/_/g, " ").toLowerCase());
    case PdMetricDateRangeType.CustomRange:
      return "Custom range";
    case PdMetricDateRangeType.LastNTrips:
      return "Last N trips";
  }
}

function dateInputOptions(
  dateRangeTypes: PdMetricDateRangeType[]
): DraftMetricDateRange[] {
  const dateOptions: DraftMetricDateRange[] = [];

  if (dateRangeTypes.includes(PdMetricDateRangeType.PastPreset)) {
    dateOptions.push(
      ...Object.values(PdMetricPastPresetPeriod).map<DraftMetricDateRange>((preset) => ({
        type: PdMetricDateRangeType.PastPreset,
        value: preset
      }))
    );
  }

  if (dateRangeTypes.includes(PdMetricDateRangeType.CustomRange)) {
    dateOptions.push({
      type: PdMetricDateRangeType.CustomRange,
      value: { start: null, end: null }
    });
  }

  if (dateRangeTypes.includes(PdMetricDateRangeType.TripPreset)) {
    dateOptions.push(
      ...Object.values(PdMetricPresetTripRange).map<DraftMetricDateRange>((preset) => ({
        type: PdMetricDateRangeType.TripPreset,
        variant: "preset",
        value: preset
      }))
    );
  }

  if (dateRangeTypes.includes(PdMetricDateRangeType.LastNTrips)) {
    dateOptions.push({
      type: PdMetricDateRangeType.LastNTrips,
      value: null
    });
  }

  if (dateRangeTypes.includes(PdMetricDateRangeType.FuturePreset)) {
    dateOptions.push(
      ...Object.values(PdMetricFuturePresetPeriod).map<DraftMetricDateRange>(
        (preset) => ({
          type: PdMetricDateRangeType.FuturePreset,
          value: preset
        })
      )
    );
  }

  return dateOptions;
}
