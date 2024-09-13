import { PdValueMetric } from "generated-graphql";
import { defaultTimezone, TimeTz } from "../../../view/utils";

const pdreMetricAggs = [
  PdValueMetric.DailyAverage,
  PdValueMetric.TripAverage,
  PdValueMetric.Total
] as const;

// Select settings
type PdreMetricSelectSetting = {
  variant: "select";
  id: "value-metric";
  name: string;
  description: string;
  additionalInfo?: string[];
  config: {
    value: PdValueMetric;
    options: PdValueMetric[];
  };
};

export type PdreSelectSetting = PdreMetricSelectSetting;

// Numeric settings
type PdreNumericSetting = {
  variant: "numeric";
  id: "lookback-period" | "max-tasks-per-host-code" | "task-fetch-limit";
  name: string;
  description: string;
  additionalInfo?: string[];
  config: {
    value: number;
    min: number;
    max: number;
  };
};

// Time w/ TimeZone
type PdreTimeTzSetting = {
  variant: "time-tz";
  id: "task-scheduler";
  name: string;
  description: string;
  additionalInfo?: string[];
  config: {
    value: TimeTz;
  };
};

// Combined setting types
export type PdreSetting = PdreSelectSetting | PdreNumericSetting | PdreTimeTzSetting;

// Default setting implementation
export const defaultValueMetric: Readonly<PdreMetricSelectSetting> = {
  variant: "select",
  id: "value-metric",
  name: "Value Metric",
  description: "Player metric to use when determining highest value",
  additionalInfo: ["Changes will not take effect until next action generation"],
  config: {
    value: pdreMetricAggs[0],
    options: [...pdreMetricAggs]
  }
};

export const defaultLookbackPeriod: Readonly<PdreNumericSetting> = {
  variant: "numeric",
  id: "lookback-period",
  name: "Lookback Period",
  description: "Number of days of data to use when running rule evaluations",
  additionalInfo: ["Changes will not take effect until next action generation"],
  config: {
    value: 365,
    min: 45,
    max: 365
  }
};

export const defaultMaxTasksPerHostCode: Readonly<PdreNumericSetting> = {
  variant: "numeric",
  id: "max-tasks-per-host-code",
  name: "Maximum Tasks per Host Code",
  description: "Maximum number of recommendation tasks to generate per host code",
  additionalInfo: ["Changes will not take effect until next action generation"],
  config: {
    value: 200,
    min: 100,
    max: 500
  }
};

export const defaultTaskFetchLimit: Readonly<PdreNumericSetting> = {
  variant: "numeric",
  id: "task-fetch-limit",
  name: "Number of Tasks to View",
  description: "Number of tasks a user can view at one given time",
  config: {
    value: 25,
    min: 10,
    max: 100
  }
};

export const defaultTaskSchedule: Readonly<PdreTimeTzSetting> = {
  variant: "time-tz",
  id: "task-scheduler",
  name: "Task Scheduler Run Time",
  description: "Time of day to run task generation",
  config: {
    value: {
      hour: 1,
      minute: 0,
      timezone: defaultTimezone().tzCode
    }
  }
};

export const defaultPdreSettings = [
  defaultValueMetric,
  defaultLookbackPeriod,
  defaultMaxTasksPerHostCode,
  defaultTaskFetchLimit,
  defaultTaskSchedule
] as const;
