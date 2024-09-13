import { PdValueMetric } from "generated-graphql";
import { produce } from "immer";
import { defaultTimezone } from "../../../../view/utils";
import {
  defaultLookbackPeriod,
  defaultMaxTasksPerHostCode,
  defaultTaskFetchLimit,
  defaultTaskSchedule,
  defaultValueMetric
} from "../types";
import { displaySelectOption, inputLabel, pdreSettingInputFromValue } from "./utils";

describe("PDRE Edit Settings Utils", () => {
  describe("inputLabel", () => {
    it("returns expected label for `lookback-period` setting", () => {
      expect(inputLabel("lookback-period")).toEqual("Lookback Days");
    });

    it("returns expected label for `max-tasks-per-host-code` setting", () => {
      expect(inputLabel("max-tasks-per-host-code")).toEqual("Max Tasks");
    });

    it("returns expected label for `task-fetch-limit` setting", () => {
      expect(inputLabel("task-fetch-limit")).toEqual("Task Limit");
    });

    it("returns expected label for `value-metric` setting", () => {
      expect(inputLabel("value-metric")).toEqual("Metric Name");
    });

    it("returns expected label for `task-scheduler` setting", () => {
      expect(inputLabel("task-scheduler")).toEqual("");
    });

    it("throws an error if a setting with an invalid setting ID is provided", () => {
      expect(() => inputLabel("invalid" as any)).toThrow();
    });
  });

  describe("pdreSettingInputFromValue", () => {
    it("returns expected Input for `lookback-period` setting", () => {
      expect(pdreSettingInputFromValue(defaultLookbackPeriod, 300)).toEqual({
        lookbackDays: 300
      });
    });

    it("returns expected Input for `max-tasks-per-host-code` setting", () => {
      expect(pdreSettingInputFromValue(defaultMaxTasksPerHostCode, 200)).toEqual({
        maxTasksPerHost: 200
      });
    });

    it("returns expected Input for `task-fetch-limit` setting", () => {
      expect(pdreSettingInputFromValue(defaultTaskFetchLimit, 30)).toEqual({
        maxTasksPerView: 30
      });
    });

    it("returns expected Input for `value-metric` setting", () => {
      expect(pdreSettingInputFromValue(defaultValueMetric, PdValueMetric.Total)).toEqual({
        valueMetric: PdValueMetric.Total
      });
    });

    it("returns expected Input for `task-scheduler` setting", () => {
      expect(
        pdreSettingInputFromValue(defaultTaskSchedule, {
          hour: 3,
          minute: 30,
          timezone: defaultTimezone().tzCode
        })
      ).toEqual({
        taskScheduler: {
          hour: 3,
          minute: 30,
          timezone: defaultTimezone().tzCode
        }
      });
    });

    it("throws an error a setting with an invalid variant is provided", () => {
      const invalidVariant = produce(defaultTaskFetchLimit, (draft) => {
        draft.variant = "invalid" as any;
      });
      expect(() => pdreSettingInputFromValue(invalidVariant, 10)).toThrow();
    });

    it("throws an error if a setting with an invalid setting ID is provided", () => {
      const invalidId = produce(defaultTaskFetchLimit, (draft) => {
        draft.id = "invalid" as any;
      });
      expect(() => pdreSettingInputFromValue(invalidId, 10)).toThrow();
    });
  });

  describe("displaySelectOption", () => {
    describe("value-metric", () => {
      it("retuns expected value for `DailyAverage`", () => {
        expect(displaySelectOption("value-metric", PdValueMetric.DailyAverage)).toEqual(
          "Average Daily Worth"
        );
      });

      it("retuns expected value for `TripAverage`", () => {
        expect(displaySelectOption("value-metric", PdValueMetric.TripAverage)).toEqual(
          "Average Trip Worth"
        );
      });

      it("retuns expected value for `Total`", () => {
        expect(displaySelectOption("value-metric", PdValueMetric.Total)).toEqual(
          "Total Worth"
        );
      });

      it("throws an error if value is not a valid `PdValueMetric`", () => {
        const invalid = "invalid" as PdValueMetric;
        expect(() => displaySelectOption("value-metric", invalid)).toThrow();
      });
    });
  });
});
